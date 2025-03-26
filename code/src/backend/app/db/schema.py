from beanie import Document
from pydantic import Field
from typing import List, Optional
from app.db.rule import RuleModel
from app.db.pdf import PDFModel


class SchemaModel(Document):
    name: str = Field(..., title="Schema Name")
    columns: List[str] = Field(default=[], title="Column Names")
    pages: List[int] = Field(..., min_items=1, title="Page Numbers")
    pdf_id: str
    rules: List[str] = Field(default=[], title="Validation Rules")

    class Settings:
        collection = "schema_collection"
