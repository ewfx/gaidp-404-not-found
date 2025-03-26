from pydantic import BaseModel


# Request Body Schema
class SchemaRequest(BaseModel):
    name: str
    pages: list[int]
