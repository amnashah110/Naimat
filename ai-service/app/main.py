from fastapi import FastAPI
from app.upload_image import router as upload_image_router
from app.predict_expiry import router as predict_expiry_router
from app.categorize_food import router as categorize_food_router

app = FastAPI()

@app.get("/")
def read_root():
	return {"message": "Hello, World!"}

app.include_router(upload_image_router)
app.include_router(predict_expiry_router)
app.include_router(categorize_food_router)
