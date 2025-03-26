from app.services.agents.code_generator import CodeGenerator
from bson import ObjectId
from app.db.rule import RuleModel
from app.db.schema import SchemaModel
from app.db.pdf import PDFModel


class CodeGenerationService:
    @staticmethod
    async def generate_code(schema_id: str, rule_id: str, prompt: str):
        schema = await SchemaModel.get(ObjectId(schema_id))
        pdf = await PDFModel.get(ObjectId(schema.pdf_id))
        rule = await RuleModel.get(ObjectId(rule_id))
        code = await CodeGenerator.generate_code(
            pdf.filepath,
            schema.pages,
            schema.name,
            schema.columns,
            rule.description,
            rule.columns,
            rule.category,
            prompt,
        )

        rule.code = code
        await rule.save()

        result = {
            "id": str(rule.id),
            "category": rule.category,
            "description": rule.description,
            "columns": rule.columns,
            "code": rule.code,
        }

        return result
