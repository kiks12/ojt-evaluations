
from transformers import pipeline
data = ["I love you", "I hate you"]

specific_model = pipeline(model="finiteautomata/bertweet-base-sentiment-analysis")
print(specific_model(data))
