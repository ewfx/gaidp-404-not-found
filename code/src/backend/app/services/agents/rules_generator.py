from app.services.agents.crew import crew_ai
from typing import Literal


class RulesGenerator:
    @staticmethod
    async def generate_rules(
        file_path: str,
        schema_name: str,
        pages: list[int],
        columns: list[str],
        prompt: str,
    ):
        return await crew_ai.generate_rules(
            file_path, schema_name, pages, columns, prompt
        )

    @staticmethod
    async def generate_rule(
        file_path: str,
        schema_name: str,
        pages: list[int],
        columns: list[str],
        rule_category: Literal["record", "batch"],
        rule_description: str,
        rule_columns: list[str],
        prompt: str,
    ):
        return await crew_ai.generate_rule(
            file_path,
            schema_name,
            pages,
            rule_category,
            rule_description,
            rule_columns,
            columns,
            prompt,
        )
