from fastapi import FastAPI, File, UploadFile
from fastapi import APIRouter
from starlette.responses import JSONResponse
from fastapi.responses import FileResponse
import os
from app.services.csv import CsvService

router = APIRouter()


@router.get("/download/{csv_id}")
async def download_csv(csv_id: str):
    content = await CsvService.get_csv(csv_id)
    if os.path.exists(content["filepath"]):
        return FileResponse(
            content["filepath"],
            media_type="text/csv",
            filename=content["filename"],
        )
    return JSONResponse(status_code=200, content={"error": "File not found"})


@router.get("/")
async def get_csvs():
    content = await CsvService.get_csvs()
    return JSONResponse(status_code=200, content=content)


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    content = await CsvService.upload_csv(file)
    return JSONResponse(status_code=201, content=content)


@router.get("/{csv_id}")
async def get_csv(csv_id: str):
    content = await CsvService.get_csv(csv_id)
    return JSONResponse(status_code=200, content=content)
