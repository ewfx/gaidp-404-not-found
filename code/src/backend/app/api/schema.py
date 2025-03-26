from fastapi import FastAPI, File, UploadFile
from fastapi import APIRouter
from app.models.schema import SchemaRequest
from app.services.schema import SchemaService
from starlette.responses import JSONResponse

router = APIRouter()


@router.get("/{schema_id}")
async def get_schema_by_id(schema_id: str):
    content = await SchemaService.get_schema_by_id(schema_id)
    return JSONResponse(status_code=200, content=content)


@router.get("/pdf/{pdf_id}")
async def get_schema_by_pdf_id(pdf_id: str):
    content = await SchemaService.get_schema_by_pdf_id(pdf_id)
    return JSONResponse(status_code=200, content=content)


@router.get("/generate/{pdf_id}")
async def generate_schema(pdf_id: str):
    content = await SchemaService.generate_schema(pdf_id)
    return JSONResponse(status_code=200, content=content)


@router.put("/update/{schema_id}")
async def update_schema(schema_id: str, request: SchemaRequest):
    content = await SchemaService.update_schema(schema_id, request.name, request.pages)
    return JSONResponse(status_code=200, content=content)


@router.post("/create/{pdf_id}")
async def create_schema(pdf_id: str, request: SchemaRequest):
    content = await SchemaService.create_schema(pdf_id, request.name, request.pages)
    return JSONResponse(status_code=200, content=content)
