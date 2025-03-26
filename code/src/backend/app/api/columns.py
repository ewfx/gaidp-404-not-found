from fastapi import FastAPI, File, UploadFile
from fastapi import APIRouter
from app.models.columns import ColumnsRequest
from app.services.columns import ColumnsService
from starlette.responses import JSONResponse

router = APIRouter()


@router.get("/{schema_id}")
async def generate_columns(schema_id: str):
    content = await ColumnsService.generate_columns(schema_id)
    return JSONResponse(status_code=200, content=content)


@router.put("/update/{schema_id}")
async def update_columns(schema_id: str, request: ColumnsRequest):
    content = await ColumnsService.update_columns(schema_id, request.columns)
    return JSONResponse(status_code=200, content=content)
