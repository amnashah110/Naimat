from fastapi import APIRouter

router = APIRouter()

@router.get("/categorize-food")
def categorize_food():
    return {"endpoint": "categorize-food"}
