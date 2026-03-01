# CivicFix – Full Stack Civic Issue Reporting Platform

CivicFix is a full-stack web application that allows citizens to report and track civic issues such as potholes, garbage dumps, broken street lights, etc.

Now integrated with **Local AI Image Detection** to detect whether uploaded images are AI-generated or real.

---

# 🛠️ Setup Instructions

## 1️⃣ Backend (Node.js)
cd backend
npm install
node server.js

Runs on: http://localhost:3000

---

## 2️⃣ AI Service (Python + FastAPI)
(first time)
cd backend/ai
python -m venv venv
venv\Scripts\activate           # Windows
source venv/bin/activate        # Linux/Mac
pip install -r requirements.txt # Install all deps listed in the file
python start.py                 # Just run this!

Runs on: http://127.0.0.1:8000

(later uses)
cd backend/ai
venv\Scripts\activate
python start.py

Check your Python environment
In VS Code, check which interpreter is active:
Press Ctrl+Shift+P → “Python: Select Interpreter”
Make sure it points to the virtual environment or Python where your packages are installed.

# 🏗️ Architecture

Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
AI Service (FastAPI + PyTorch + HuggingFace Model)
        ↓
MongoDB Atlas (Database)

---

# 🚀 Features

## 👤 User Features

- Report Issue with:
  - Photo upload (converted to base64)
  - Description
  - Urgency (High / Medium / Low)
  - Category
  - Location (text + coordinates)
- AI Image Detection (local model)
- Issues List with:
  - Search
  - Filters (Urgency / Status / Category)
- Map Explorer with color-coded pins
- Profile – My Complaints
- Persistent MongoDB storage

---

## 🤖 AI Detection

Uses HuggingFace model:

`boluobobo/ItsNotAI-ai-detector-v2`

- Runs locally using PyTorch
- No API key required
- No request limits
- Unlimited local inference
- AI verdict stored in MongoDB as:
  - REAL_IMAGE
  - AI_GENERATED

---

# 🗂️ Project Structure
# CivicFix – Full Stack Civic Issue Reporting Platform

CivicFix is a full-stack web application that allows citizens to report and track civic issues such as potholes, garbage dumps, broken street lights, etc.

Now integrated with **Local AI Image Detection** to detect whether uploaded images are AI-generated or real.

---

# 🏗️ Architecture

Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
AI Service (FastAPI + PyTorch + HuggingFace Model)
        ↓
MongoDB Atlas (Database)

---

# 🚀 Features

## 👤 User Features

- Report Issue with:
  - Photo upload (converted to base64)
  - Description
  - Urgency (High / Medium / Low)
  - Category
  - Location (text + coordinates)
- AI Image Detection (local model)
- Issues List with:
  - Search
  - Filters (Urgency / Status / Category)
- Map Explorer with color-coded pins
- Profile – My Complaints
- Persistent MongoDB storage

---

## 🤖 AI Detection

Uses HuggingFace model:

`boluobobo/ItsNotAI-ai-detector-v2`

- Runs locally using PyTorch
- No API key required
- No request limits
- Unlimited local inference
- AI verdict stored in MongoDB as:
  - REAL_IMAGE
  - AI_GENERATED

---

# 🗂️ Project Structure
# CivicFix – Full Stack Civic Issue Reporting Platform

CivicFix is a full-stack web application that allows citizens to report and track civic issues such as potholes, garbage dumps, broken street lights, etc.

Now integrated with **Local AI Image Detection** to detect whether uploaded images are AI-generated or real.

---

# 🏗️ Architecture

Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
AI Service (FastAPI + PyTorch + HuggingFace Model)
        ↓
MongoDB Atlas (Database)

---

# 🚀 Features

## 👤 User Features

- Report Issue with:
  - Photo upload (converted to base64)
  - Description
  - Urgency (High / Medium / Low)
  - Category
  - Location (text + coordinates)
- AI Image Detection (local model)
- Issues List with:
  - Search
  - Filters (Urgency / Status / Category)
- Map Explorer with color-coded pins
- Profile – My Complaints
- Persistent MongoDB storage

---

## 🤖 AI Detection

Uses HuggingFace model:

`boluobobo/ItsNotAI-ai-detector-v2`

- Runs locally using PyTorch
- No API key required
- No request limits
- Unlimited local inference
- AI verdict stored in MongoDB as:
  - REAL_IMAGE
  - AI_GENERATED

---

# 🗂️ Project Structure

CivicFix/
│
├── frontend/ # React frontend
│ └── src/
│
├── backend/
│ ├── server.js # Express backend
│ ├── ai/ # AI microservice
│ │ ├── main.py
│ │ └── venv/
│ └── package.json


---
