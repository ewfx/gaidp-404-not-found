from beanie import Document
from pydantic import Field


class CSVModel(Document):
    filename: str = Field(..., min_length=1, title="Original Filename")
    filepath: str = Field(..., title="Stored Filepath")

    class Settings:
        collection = "csv_collection"
