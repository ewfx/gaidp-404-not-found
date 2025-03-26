from fastapi import FastAPI, File, UploadFile
from starlette.responses import JSONResponse
from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

from app.services.pdf import PdfService

router = APIRouter()


@router.get("/download/{pdf_id}")
async def download_pdf(pdf_id: str):
    content = await PdfService.get_pdf(pdf_id)
    if os.path.exists(content["filepath"]):
        return FileResponse(
            content["filepath"],
            media_type="application/pdf",
            filename=content["filename"],
        )
    return JSONResponse(status_code=200, content={"error": "File not found"})


@router.get("/")
async def get_pdfs():
    content = await PdfService.get_pdfs()
    return JSONResponse(status_code=200, content=content)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    content = await PdfService.upload_pdf(file)
    return JSONResponse(status_code=201, content=content)


@router.get("/{pdf_id}")
async def get_pdf(pdf_id: str):
    content = await PdfService.get_pdf(pdf_id)
    return JSONResponse(status_code=200, content=content)
