import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, T5ForConditionalGeneration
import torch
import re

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "final_model"

app=FastAPI(title="Text Summarizer App",description="Text Summarization using T5 Transformer Model",version="1.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

model=T5ForConditionalGeneration.from_pretrained(MODEL_DIR)
tokenizer=AutoTokenizer.from_pretrained(MODEL_DIR, use_fast=True)


if torch.backends.mps.is_available():
    device=torch.device("mps")
elif torch.cuda.is_available():
    device=torch.device("cuda")
else:
    device=torch.device("cpu")

model.to(device)
model.eval()

class DialogueInput(BaseModel):
    dialogue:str
    

def clean_data(text):
    text=re.sub(r"\r\n"," ",text) # remove lines
    text=re.sub(r"\s+"," ",text) # spaces
    text=re.sub(r"<[^>]*>"," ",text) # html tags
    text=text.strip().lower()
    return text


def summarize_dialogue(dialogue:str)->str:
    # cleaning
    dialogue=clean_data(dialogue)

    # tokenize
    inputs=tokenizer(dialogue, padding="max_length",max_length=512,truncation=True, return_tensors="pt")
    inputs = {name: value.to(device) for name, value in inputs.items()}
    
    # generate the summary -> token ids
    with torch.inference_mode():
        targets=model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=150,
            num_beams=4,
            early_stopping=True
        )

    # token ids convert to summary -> decoding
    summary=tokenizer.decode(targets[0],skip_special_tokens=True)

    return summary

@app.post("/summarize")
async def summarize(dialogue_input:DialogueInput):
    summary=summarize_dialogue(dialogue_input.dialogue)
    return {"summary":summary} 

@app.get("/")
async def health():
    return {"status": "ok"}
