from pydantic import BaseModel
from typing import List


class ColumnsRequest(BaseModel):
    columns: List[str]
