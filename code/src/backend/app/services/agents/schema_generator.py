from app.services.agents.crew import crew_ai


class SchemaGenerator:
    @staticmethod
    async def generate_schema(pdf_path: str):
        return await crew_ai.generate_schema(pdf_path)
