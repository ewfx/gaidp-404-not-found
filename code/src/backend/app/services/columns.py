from app.services.agents.columns_generator import ColumnsGenerator
from bson import ObjectId
from app.db.schema import SchemaModel
from app.db.rule import RuleModel
from app.db.pdf import PDFModel


class ColumnsService:
    @staticmethod
    async def generate_columns(schema_id: str):
        schema_id = ObjectId(schema_id)

        # Fetch all schemas related to this PDF
        schema = await SchemaModel.get(schema_id)

        pdf = await PDFModel.get(ObjectId(schema.pdf_id))

        columns = await ColumnsGenerator.generate_columns(
            pdf.filepath, schema.name, schema.pages
        )

        schema.columns = columns
        await schema.save()

        result = {
            "id": str(schema.id),
            "name": schema.name,
            "columns": schema.columns,
            "pages": schema.pages,
            "pdf_id": str(schema.pdf_id),
            "rules": [str(rule) for rule in schema.rules],
        }

        return result

    @staticmethod
    async def update_columns(schema_id: str, columns: list[str]):

        schema_id = ObjectId(schema_id)

        # Fetch all schemas related to this PDF
        schema = await SchemaModel.get(schema_id)
        if not schema:
            return {"error": f"Schema with ID {schema_id} not found"}

        schema.columns = columns
        schema = await schema.save()

        result = {
            "id": str(schema.id),
            "name": schema.name,
            "columns": schema.columns,
            "pages": schema.pages,
            "pdf_id": str(schema.pdf_id),
            "rules": [str(rule) for rule in schema.rules],
        }

        return result
