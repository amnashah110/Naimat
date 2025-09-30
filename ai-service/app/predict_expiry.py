from fastapi import APIRouter

router = APIRouter()

@router.get("/predict-expiry")
def predict_expiry():
    return {"endpoint": "predict-expiry"}
