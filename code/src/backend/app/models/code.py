from pydantic import BaseModel
from typing import List
from typing_extensions import Literal


class GenerateCodeRequest(BaseModel):
    prompt: str
