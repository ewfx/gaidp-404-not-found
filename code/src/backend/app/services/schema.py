from bson import ObjectId
from app.db.schema import SchemaModel
from app.db.pdf import PDFModel
from app.services.agents.schema_generator import SchemaGenerator


class SchemaService:
    @staticmethod
    async def get_schema_by_id(schema_id: str):

        schema_id = ObjectId(schema_id)

        # Fetch all schemas related to this PDF
        schema = await SchemaModel.get(schema_id)

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
    async def get_schema_by_pdf_id(pdf_id: str):
        # Fetch all schemas related to this PDF
        schemas = await SchemaModel.find(SchemaModel.pdf_id == pdf_id).to_list()

        result = [
            {
                "id": str(schema.id),
                "name": schema.name,
                "columns": schema.columns,
                "pages": schema.pages,
                "pdf_id": str(schema.pdf_id),
                "rules": [str(rule) for rule in schema.rules],
            }
            for schema in schemas
        ]

        return result

    @staticmethod
    async def generate_schema(pdf_id: str):
        if not ObjectId.is_valid(pdf_id):
            raise HTTPException(status_code=400, detail="Invalid PDF ID format.")

        pdf = await PDFModel.get(ObjectId(pdf_id))

        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found.")

        schemas_data = await SchemaGenerator.generate_schema(pdf.filepath)

        if not isinstance(schemas_data, list):
            raise HTTPException(
                status_code=500, detail="Invalid schema generation result."
            )

        schema_records = []
        for schema_data in schemas_data:

            schema = SchemaModel(
                name=schema_data.name,
                pages=schema_data.pages,
                pdf_id=str(pdf.id),
                columns=[],  # Modify if column data is available
                rules=[],
            )
            schema_records.append(schema)

        if schema_records:
            await SchemaModel.insert_many(schema_records)

        result = await SchemaService.get_schema_by_pdf_id(pdf_id)

        return result

    @staticmethod
    async def update_schema(schema_id: str, name: str, pages: list[int]):
        schema_obj_id = ObjectId(schema_id)

        # Find and update the schema
        schema = await SchemaModel.get(schema_obj_id)
        if not schema:
            return {"error": f"Schema with ID {schema_id} not found"}

        schema.name = name
        schema.pages = pages
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
    async def create_schema(pdf_id: str, name: str, pages: list[int]):

        schema = SchemaModel(
            name=name, pages=pages, columns=[], pdf_id=pdf_id, rules=[]
        )

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
