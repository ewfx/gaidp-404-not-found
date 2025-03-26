from app.services.agents.crew import crew_ai


class ColumnsGenerator:
    @staticmethod
    async def generate_columns(filepath: str, schema_name: str, pages: list[int]):
        return await crew_ai.generate_columns(filepath, schema_name, pages)
