from fastapi import FastAPI, File, UploadFile
from fastapi import APIRouter
from app.models.code import GenerateCodeRequest
from app.services.code import CodeGenerationService
from starlette.responses import JSONResponse

router = APIRouter()


@router.post("/generate/{schema_id}/{rule_id}")
async def generate_code_for_rule(
    schema_id: str, rule_id: str, request: GenerateCodeRequest
):
    content = await CodeGenerationService.generate_code(
        schema_id, rule_id, request.prompt
    )
    return JSONResponse(status_code=200, content=content)
