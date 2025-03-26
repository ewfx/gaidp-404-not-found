import motor.motor_asyncio
from beanie import init_beanie
from app.db.pdf import PDFModel
from app.db.rule import RuleModel
from app.db.schema import SchemaModel
from app.db.csv import CSVModel


class MongoDB:
    def __init__(self, db_url: str, db_name: str):
        self.client = motor.motor_asyncio.AsyncIOMotorClient(db_url)
        self.database = self.client[db_name]

    async def init(self):
        """Initialize Beanie ORM with MongoDB models."""
        await init_beanie(
            database=self.database,
            document_models=[PDFModel, RuleModel, SchemaModel, CSVModel],
        )
