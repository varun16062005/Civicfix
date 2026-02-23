require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require("axios");
const FormData = require("form-data");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas (database: civicfix)'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Issue schema (matches frontend mockIssues structure) and model
const issueSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true, sparse: true }, // e.g., ISSUE-1024
  category: String,
  urgency: String,
  status: String,
  locationText: String,
  location: {
    lat: Number,
    lng: Number,
  },
  description: String,
  photoUrl: String,
  createdAt: { type: Date, default: Date.now },
  aiVerdict: String,
  department: String,
  reporterId: String,
}, { collection: 'issues' }); // explicitly target the 'issues' collection

const Issue = mongoose.model('Issue', issueSchema);

// Get all issues (supports ?q=&urgency=&status=&category=&reporterId=)
app.get('/issues', async (req, res) => {
  try {
    const { q, urgency, status, category, reporterId } = req.query;
    const filter = {};
    if (urgency) filter.urgency = urgency;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (reporterId) filter.reporterId = reporterId;

    let query = Issue.find(filter).sort({ createdAt: -1 });
    if (q) {
      const regex = new RegExp(q, 'i');
      query = query.find({ $or: [{ description: regex }, { locationText: regex }, { id: regex }] });
    }

    const issues = await query.exec();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an issue by Mongo _id or custom `id` field
app.patch('/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let issue = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      issue = await Issue.findByIdAndUpdate(id, updates, { new: true });
    }
    if (!issue) {
      issue = await Issue.findOneAndUpdate({ id }, updates, { new: true });
    }
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an issue by Mongo _id or custom `id` field
app.delete('/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let result = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      result = await Issue.findByIdAndDelete(id);
    }
    if (!result) {
      result = await Issue.findOneAndDelete({ id });
    }
    if (!result) return res.status(404).json({ message: 'Issue not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin stats
app.get('/admin/stats', async (req, res) => {
  try {
    const all = await Issue.find().exec();
    const total = all.length;
    const resolved = all.filter((i) => i.status === 'Resolved' || i.status === 'RESOLVED' || i.status === 'resolved').length;
    const pending = all.filter((i) => i.status === 'Pending' || i.status === 'PENDING' || i.status === 'pending').length;
    const inProgress = all.filter((i) => i.status === 'In Progress' || i.status === 'IN_PROGRESS' || i.status === 'in_progress' || i.status === 'in progress').length;
    const byCategory = all.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {});
    res.json({ total, resolved, pending, inProgress, byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get single issue by numeric Mongo _id or by custom `id` field (e.g., ISSUE-1024)
app.get('/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let issue = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      issue = await Issue.findById(id);
    }
    if (!issue) {
      issue = await Issue.findOne({ id });
    }
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new issue
app.post('/issues', async (req, res) => {
  try {
    let aiVerdict = "ai_failed";

    // If image exists, send to Python AI server
    if (req.body.photoUrl && req.body.photoUrl.startsWith("data:image")) {
      try {
        // Convert base64 to buffer
        const base64Data = req.body.photoUrl.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        const formData = new FormData();
        formData.append("file", buffer, {
          filename: "image.jpg",
          contentType: "image/jpeg",
        });

        const aiResponse = await axios.post(
          "http://127.0.0.1:8000/detect",
          formData,
          { headers: formData.getHeaders() }
        );

        const aiData = aiResponse.data;

        aiVerdict = aiData.is_real ? "REAL_IMAGE" : "AI_GENERATED";
      } catch (err) {
        console.error("AI detection failed:", err.message);
      }
    }

    const issue = new Issue({
      ...req.body,
      id: `ISSUE-${Date.now()}`,
      createdAt: new Date(),
      aiVerdict,
    });

    await issue.save();
    res.status(201).json(issue);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


console.log('Registered issue routes: GET /issues, GET /issues/:id, POST /issues');


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));