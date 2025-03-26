from pydantic import BaseModel


class UpdateRulesRequest(BaseModel):
    rule_category: str
    rule_description: str
    rule_code: str
    columns: list[str]


class GenerateRuleRequest(BaseModel):
    prompt: str


class AddRuleRequest(BaseModel):
    rule_category: str
    rule_description: str
    rule_code: str
    columns: list[str]
