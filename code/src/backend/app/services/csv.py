from fastapi import UploadFile, HTTPException
from app.db.csv import CSVModel  # Assuming a CSVModel similar to PDFModel exists
from app.services.file import FileService
from bson import ObjectId


class CsvService:

    @staticmethod
    async def get_csvs():
        """Retrieve all stored CSVs from MongoDB."""
        csvs = await CSVModel.find_all().to_list()

        result = [
            {"csv_id": str(csv.id), "filename": csv.filename, "filepath": csv.filepath}
            for csv in csvs
        ]

        return result

    @staticmethod
    async def upload_csv(file: UploadFile):
        if file.content_type != "text/csv":
            raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

        # Step 1: Insert metadata into MongoDB (get `_id`)
        csv_entry = CSVModel(filename=file.filename, filepath="")
        inserted_csv = await csv_entry.insert()

        # Step 2: Save the file using `_id`
        file_path = await FileService.save_csv(file, str(inserted_csv.id))

        # Step 3: Update MongoDB with correct file path
        inserted_csv.filepath = file_path
        await inserted_csv.save()

        result = {
            "message": "File uploaded successfully!",
            "csv_id": str(inserted_csv.id),
            "path": file_path,
        }

        return result

    @staticmethod
    async def get_csv(csv_id: str):
        """Retrieve a specific CSV by its ID from MongoDB."""
        if not ObjectId.is_valid(csv_id):
            raise HTTPException(status_code=400, detail="Invalid CSV ID format.")

        csv = await CSVModel.get(ObjectId(csv_id))

        if not csv:
            raise HTTPException(status_code=404, detail="CSV not found.")

        result = {
            "csv_id": str(csv.id),
            "filename": csv.filename,
            "filepath": csv.filepath,
        }

        return result
