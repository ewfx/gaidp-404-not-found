from fastapi import FastAPI, File, UploadFile, Response
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.services.validate import ValidationService

router = APIRouter()


@router.get("/get/{schema_id}")
async def get_validator(schema_id: str):
    content = await ValidationService.get_validator(schema_id)
    return JSONResponse(status_code=200, content=content)


@router.get("/csv/{schema_id}/{csv_id}")
async def perform_validation(schema_id: str, csv_id: str):
    content = await ValidationService.perform_validation(schema_id, csv_id)
    return Response(
        content.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=data.zip"},
    )
