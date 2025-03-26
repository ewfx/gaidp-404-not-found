from fastapi import FastAPI, File, UploadFile
from fastapi import APIRouter
from app.models.rules import UpdateRulesRequest, GenerateRuleRequest, AddRuleRequest
from app.services.rules import RulesService
from starlette.responses import JSONResponse

router = APIRouter()


@router.get("/{schema_id}")
async def get_rules(schema_id: str):
    content = await RulesService.get_rules(schema_id)
    return JSONResponse(status_code=200, content=content)


@router.get("/{schema_id}/{rule_id}")
async def get_rule(schema_id: str, rule_id: str):
    content = await RulesService.get_rule(schema_id, rule_id)
    return JSONResponse(status_code=200, content=content)


@router.put("/update/{schema_id}/{rule_id}")
async def update_rule(schema_id: str, rule_id: str, request: UpdateRulesRequest):
    content = await RulesService.update_rule(
        schema_id,
        rule_id,
        request.rule_category,
        request.rule_description,
        request.rule_code,
        request.columns,
    )
    return JSONResponse(status_code=200, content=content)


@router.post("/generate/{schema_id}")
async def generate_rules(schema_id: str, request: GenerateRuleRequest):
    content = await RulesService.generate_rules(schema_id, request.prompt)
    return JSONResponse(status_code=200, content=content)


@router.post("/generate/{schema_id}/{rule_id}")
async def generate_rule(schema_id: str, rule_id: str, request: GenerateRuleRequest):
    content = await RulesService.generate_rule(schema_id, rule_id, request.prompt)
    return JSONResponse(status_code=200, content=content)


@router.post("/delete/{schema_id}/{rule_id}")
async def delete_rule(schema_id: str, rule_id: str):
    content = await RulesService.delete_rule(schema_id, rule_id)
    return JSONResponse(status_code=200, content=content)


@router.post("/add/{schema_id}")
async def add_rule(schema_id: str, request: AddRuleRequest):
    content = await RulesService.add_rule(
        schema_id,
        request.rule_category,
        request.rule_description,
        request.rule_code,
        request.columns,
    )
    return JSONResponse(status_code=200, content=content)
