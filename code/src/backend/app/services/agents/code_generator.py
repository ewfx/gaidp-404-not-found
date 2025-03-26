from app.services.agents.crew import crew_ai
from typing import Literal


class CodeGenerator:
    @staticmethod
    async def generate_code(
        pdf_path: str,
        pages: list[int],
        schema_name: str,
        columns: list[str],
        rule_description: str,
        rule_columns: list[str],
        rule_category: Literal["record", "batch"],
        prompt: str,
    ):
        return await crew_ai.generate_code(
            pdf_path,
            pages,
            schema_name,
            columns,
            rule_description,
            rule_columns,
            rule_category,
            prompt,
        )
