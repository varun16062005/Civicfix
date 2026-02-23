import torch
import torch.nn as nn
from transformers import AutoModelForImageClassification, AutoImageProcessor
from huggingface_hub import hf_hub_download
from PIL import Image
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io

app = FastAPI()

# Enable CORS so Node.js can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_id = "boluobobo/ItsNotAI-ai-detector-v2"

print("Loading model... This may take time on first run.")

# Load model & processor
model = AutoModelForImageClassification.from_pretrained(model_id)
processor = AutoImageProcessor.from_pretrained(model_id)
model.eval()

# Load metadata
meta_path = hf_hub_download(repo_id=model_id, filename="source_meta.json")
with open(meta_path) as f:
    meta = json.load(f)

source_names = meta["source_names"]
hidden_size = meta.get("hidden_size", model.config.hidden_size)

# Load binary head
binary_head_path = hf_hub_download(repo_id=model_id, filename="binary_head.pt")
binary_head = nn.Sequential(
    nn.Dropout(0.1),
    nn.Linear(hidden_size, 2)
)
binary_head.load_state_dict(torch.load(binary_head_path, map_location="cpu"))
binary_head.eval()

print("Model loaded successfully.")


def get_backbone_features(pixel_values):
    if hasattr(model, 'beit'):
        outputs = model.beit(pixel_values)
    elif hasattr(model, 'vit'):
        outputs = model.vit(pixel_values)
    else:
        outputs = model.base_model(pixel_values)

    return outputs.last_hidden_state[:, 0]


@app.get("/")
def home():
    return {"message": "AI Detector API Running"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        inputs = processor(image, return_tensors="pt")

        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)[0]

            features = get_backbone_features(inputs["pixel_values"])
            binary_logits = binary_head(features)
            binary_probs = torch.softmax(binary_logits, dim=-1)[0]

            human_prob = binary_probs[0].item()
            ai_prob = binary_probs[1].item()

        pred_idx = probs.argmax().item()
        predicted_source = source_names[pred_idx]

        return {
            "ai_probability": round(ai_prob, 3),
            "human_probability": round(human_prob, 3),
            "predicted_source": predicted_source,
            "is_real": human_prob > ai_prob
        }

    except Exception as e:
        return {"error": str(e)}