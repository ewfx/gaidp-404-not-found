from beanie import Document
from pydantic import Field
from typing import List, Literal


class RuleModel(Document):
    description: str = Field(..., title="Rule Description")
    columns: List[str] = Field(..., min_items=1, title="Applicable Columns")
    code: str = Field(..., title="Rule Code")
    category: Literal["record", "batch"] = Field(..., title="Rule Category")

    class Settings:
        collection = "schema_collection"
