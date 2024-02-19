from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import io
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

model = load_model('./model/pokemon_card_recognition_model.h5')

class_indices = {i: folder for i, folder in enumerate(os.listdir('C:/Users/user/Desktop/pkm-site/files/images'))}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with the origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = image.load_img(io.BytesIO(contents), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Expand dimensions to match the batch size
    img_array = img_array / 255.

    predictions = model.predict(img_array)
    top_prediction = np.argmax(predictions)

    result = {"prediction": class_indices[top_prediction]}
    print(result)
    return JSONResponse(content=result)
