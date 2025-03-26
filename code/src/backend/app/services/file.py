import os
from fastapi import UploadFile


class FileService:
    SAVE_PATH = "app/assets/"

    @staticmethod
    async def save_pdf(file: UploadFile, file_id: str) -> str:
        """Save the uploaded PDF file using MongoDB _id as the filename."""
        os.makedirs(FileService.SAVE_PATH + "pdf/", exist_ok=True)
        file_extension = file.filename.split(".")[-1]  # Extract file extension
        new_filename = f"{file_id}.{file_extension}"  # Use MongoDB ID

        file_path = FileService.SAVE_PATH + "pdf/" + new_filename

        with open(file_path, "wb") as f:
            f.write(await file.read())

        return file_path

    @staticmethod
    async def save_csv(file: UploadFile, file_id: str) -> str:
        """Save the uploaded CSV file using MongoDB _id as the filename."""
        os.makedirs(FileService.SAVE_PATH + "csv/", exist_ok=True)
        file_extension = file.filename.split(".")[-1]  # Extract file extension
        new_filename = f"{file_id}.{file_extension}"  # Use MongoDB ID

        file_path = FileService.SAVE_PATH + "csv/" + new_filename

        with open(file_path, "wb") as f:
            f.write(await file.read())

        return file_path
