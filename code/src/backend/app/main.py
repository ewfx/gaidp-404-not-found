from fastapi import FastAPI

from app.api.pdf import router as pdf_router
from app.api.csv import router as csv_router
from app.api.schema import router as schema_router
from app.api.columns import router as columns_router
from app.api.rules import router as rules_router
from app.api.code import router as code_router
from app.api.validate import router as validate_router
from fastapi.middleware.cors import CORSMiddleware


from app.db.connection import MongoDB

from dotenv import load_dotenv

load_dotenv()

import os

# Initialize FastAPI application
app = FastAPI(title="FastAPI Project", version="1.0")

# Include routers
app.include_router(pdf_router, prefix="/pdf", tags=["PDF"])
app.include_router(csv_router, prefix="/csv", tags=["CSV"])
app.include_router(schema_router, prefix="/schema", tags=["SCHEMA"])
app.include_router(columns_router, prefix="/columns", tags=["COLUMNS"])
app.include_router(rules_router, prefix="/rules", tags=["RULES"])
app.include_router(code_router, prefix="/code", tags=["CODE"])
app.include_router(validate_router, prefix="/validate", tags=["VALIDATE"])

mongo_connection = MongoDB(os.environ.get("MONGO_DB_URL"), "dev")


@app.on_event("startup")
async def startup():
    await mongo_connection.init()


# cors
# Allow requests from your frontend's origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173",
    ],  # or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run with: uvicorn app.main:app --reload
