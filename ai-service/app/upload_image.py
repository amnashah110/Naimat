from fastapi import APIRouter

router = APIRouter()

@router.get("/upload-image")
def upload_image():
    return {"endpoint": "upload-image"}
