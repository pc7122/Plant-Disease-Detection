import uvicorn
import tensorflow as tf
from typing import Tuple
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
)

LABELS = ['Early blight', 'Late blight', 'Healthy']
MODEL = tf.keras.models.load_model("./models/potato.h5")


def read_image(file) -> tf.Tensor:
    image = tf.image.decode_image(file, channels=3)
    image = tf.image.resize(image, [256, 256])
    return image


def predict_image(image: tf.Tensor) -> Tuple[str, float]:
    image = tf.expand_dims(image, axis=0)
    prediction = MODEL.predict(image)

    predicted_label = LABELS[tf.argmax(prediction[0])]
    confidence = tf.reduce_max(prediction[0])

    return predicted_label, confidence


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/predict")
async def predict(file: UploadFile):
    image = read_image(await file.read())
    label, confidence = predict_image(image)

    return {"label": label, "confidence": float(confidence)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
