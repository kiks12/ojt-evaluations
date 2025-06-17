
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from typing import Union
from transformers import pipeline

sentiment_model = pipeline(
    model="finiteautomata/bertweet-base-sentiment-analysis")


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Statement(BaseModel):
    text: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/statement/")
def analyze_statement(statement: Statement):
    return sentiment_model(statement.text)
