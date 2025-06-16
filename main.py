
from transformers import pipeline

sentiment_model = pipeline(model="finiteautomata/bertweet-base-sentiment-analysis")

from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Statement(BaseModel):
    text: str


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/statement/")
def analyze_statement(statement: Statement):
    return sentiment_model(statement.text)

