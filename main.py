
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


def scale_negative_to_positivity(score: float) -> float:
    """
    Takes a negative sentiment confidence score (0 to 1)
    and scales it to a positivity score (0 to 0.5).

    Higher negative scores → lower positivity.
    """
    return round((1 - score) * 0.5, 4)


def sentiment_to_positivity(label: str, score: float) -> float:
    if label == 'POS':
        return (score + 1) / 2
    elif label == 'NEG':
        return scale_negative_to_positivity(score)
    elif label == 'NEU':
        return 0.5
    else:
        return 0.5


@app.post("/statement/")
def analyze_statement(statement: Statement):
    output = sentiment_model(statement.text)
    positivity_score = sentiment_to_positivity(
        output[0]["label"], output[0]["score"])
    return [{"label": output[0]["label"], "score": positivity_score}]
