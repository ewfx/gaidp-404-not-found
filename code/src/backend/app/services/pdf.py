from fastapi import UploadFile
from app.db.pdf import PDFModel
from app.services.file import FileService
from bson import ObjectId


class PdfService:

    @staticmethod
    async def get_pdfs():
        """Retrieve all stored PDFs from MongoDB."""
        pdfs = await PDFModel.find_all().to_list()

        result = [
            {"pdf_id": str(pdf.id), "filename": pdf.filename, "filepath": pdf.filepath}
            for pdf in pdfs
        ]

        return result

    @staticmethod
    async def upload_pdf(file: UploadFile):
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

        # Step 1: Insert metadata into MongoDB (get `_id`)
        pdf_entry = PDFModel(filename=file.filename, filepath="")
        inserted_pdf = await pdf_entry.insert()

        # Step 2: Save the file using `_id`
        file_path = await FileService.save_pdf(file, str(inserted_pdf.id))

        # Step 3: Update MongoDB with correct file path
        inserted_pdf.filepath = file_path
        await inserted_pdf.save()

        result = {
            "message": "File uploaded successfully!",
            "pdf_id": str(inserted_pdf.id),
            "path": file_path,
        }

        return result

    @staticmethod
    async def get_pdf(pdf_id: str):
        """Retrieve a specific PDF by its ID from MongoDB."""
        if not ObjectId.is_valid(pdf_id):
            raise HTTPException(status_code=400, detail="Invalid PDF ID format.")

        pdf = await PDFModel.get(ObjectId(pdf_id))

        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found.")

        result = {
            "pdf_id": str(pdf.id),
            "filename": pdf.filename,
            "filepath": pdf.filepath,
        }

        return result
