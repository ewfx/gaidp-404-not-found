from app.services.agents.rules_generator import RulesGenerator
from app.db.rule import RuleModel
from app.db.schema import SchemaModel
from app.db.pdf import PDFModel
from bson import ObjectId
from typing import Literal


class RulesService:
    @staticmethod
    async def get_rules(schema_id: str):
        schema_id = ObjectId(schema_id)

        # Fetch all schemas related to this PDF
        schema = await SchemaModel.get(schema_id)

        rule_ids = [ObjectId(id) for id in schema.rules]

        rules = await RuleModel.find({"_id": {"$in": rule_ids}}).to_list()

        result = [
            {
                "id": str(rule.id),
                "description": rule.description,
                "code": rule.code,
                "columns": rule.columns,
                "category": rule.category,
            }
            for rule in rules
        ]

        return result

    @staticmethod
    async def get_rule(schema_id: str, rule_id: str):

        rule = await RuleModel.get(ObjectId(rule_id))

        result = {
            "id": str(rule.id),
            "description": rule.description,
            "code": rule.code,
            "columns": rule.columns,
            "category": rule.category,
        }

        return result

    @staticmethod
    async def add_rule(
        schema_id: str,
        rule_category: Literal["record", "batch"],
        rule_description: str,
        rule_code: str,
        columns: list[str],
    ):
        rule = RuleModel(
            category=rule_category,
            columns=columns,
            description=rule_description,
            code=rule_code,
        )

        rule = await rule.save()

        schema = await SchemaModel.get(ObjectId(schema_id))
        schema.rules.append(str(rule.id))
        await schema.save()

        result = {
            "id": str(rule.id),
            "description": rule.description,
            "code": rule.code,
            "columns": rule.columns,
            "category": rule.category,
        }

        return result

    @staticmethod
    async def update_rule(
        schema_id: str,
        rule_id: str,
        rule_category: Literal["record", "batch"],
        rule_description: str,
        rule_code: str,
        columns: list[str],
    ):
        rule = await RuleModel.get(ObjectId(rule_id))
        rule.category = rule_category
        rule.columns = columns
        rule.description = rule_description
        rule.code = rule_code

        await rule.save()

        result = {
            "id": str(rule.id),
            "description": rule.description,
            "code": rule.code,
            "columns": rule.columns,
            "category": rule.category,
        }

        return result

    @staticmethod
    async def generate_rules(schema_id: str, prompt: str):
        schema_id = ObjectId(schema_id)

        # Fetch all schemas related to this PDF
        schema = await SchemaModel.get(schema_id)

        pdf = await PDFModel.get(ObjectId(schema.pdf_id))

        rules_data = await RulesGenerator.generate_rules(
            pdf.filepath, schema.name, schema.pages, schema.columns, prompt
        )

        rules = []
        for rule_data in rules_data:

            rule = RuleModel(
                description=rule_data.description,
                category=rule_data.category,
                code="",
                columns=rule_data.columns,
            )
            rules.append(rule)

        if rules:
            rules = await RuleModel.insert_many(rules)
            schema.rules = [str(rule) for rule in rules.inserted_ids]
            await schema.save()

        result = await RulesService.get_rules(schema_id)

        return result

    @staticmethod
    async def generate_rule(schema_id: str, rule_id: str, prompt: str):
        schema_id = ObjectId(schema_id)

        # Fetch all schemas related to this PDF
        schema = await SchemaModel.get(schema_id)

        pdf = await PDFModel.get(ObjectId(schema.pdf_id))

        rule = await RuleModel.get(ObjectId(rule_id))

        if not pdf or not schema or not rule:
            raise HTTPException(status_code=404, detail="Invalid Request")

        rule_data = await RulesGenerator.generate_rule(
            pdf.filepath,
            schema.name,
            schema.pages,
            schema.columns,
            rule.category,
            rule.description,
            rule.columns,
            prompt,
        )

        rule = RuleModel(
            description=rule_data.description,
            category=rule_data.category,
            columns=rule_data.columns,
            code="",
        )

        if rule:
            rule = await rule.save()
            schema.rules.append(str(rule.id))
            await schema.save()

        result = {
            "description": rule.description,
            "columns": rule.columns,
            "category": rule.category,
            "code": rule.code,
            "id": str(rule.id),
        }

        return result

    @staticmethod
    async def delete_rule(schema_id: str, rule_id: str):

        schema = await SchemaModel.get(ObjectId(schema_id))
        schema.rules.remove(str(rule_id))
        await schema.save()

        rule = await RuleModel.get(ObjectId(rule_id))
        await rule.delete()

        result = {}

        return result
