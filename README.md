# Gen AI Data Profiling

## 📌 Project Description
This project is a **data profiling and schema generation system** that integrates **PDF and CSV file handling** with a **FastAPI backend** and a **React frontend**. The system enables:
- **File uploads & downloads** (PDF, CSV)
- **Schema extraction using AI**
- **Rule generation for data validation**
- **Metadata storage in MongoDB**

---

## 🚀 Functionality
### 1️⃣ File Upload and Management
#### 📄 PDF Upload:
✅ Users can upload PDF files via the frontend.  
✅ The backend processes and stores these files for schema generation and downloads.  

#### 📊 CSV Upload:
✅ Users can upload CSV files similarly for data profiling.

---
### 2️⃣ File Download
#### 📄 PDF Download:
🔹 Endpoint: `GET /pdf/download/{pdf_id}`  
🔹 Backend serves the file using `FileResponse` with MIME type `application/pdf`  

#### 📊 CSV Download:
🔹 Endpoint: `GET /csv/download/{csv_id}`  
🔹 MIME type: `text/csv`  

---
### 3️⃣ Schema Generation
#### 📋 Schema Extraction:
✔️ AI extracts structured schemas from PDFs, including **column names, page numbers, and metadata**.  
✔️ Uses AI agents (CrewAI class) to automate schema extraction.  

#### 🔍 Column Extraction:
✔️ Extracts specific columns from PDFs for **CSV profiling**.  

#### ⚡ Rule Generation:
✔️ Generates rules for **data validation & profiling**.

---
### 4️⃣ Frontend Features
✅ **PDF & CSV Management**: View, upload, and download files.  
✅ **Drag-and-Drop Upload**: Simple and intuitive file upload experience.  
✅ **Search & Filter**: Easily locate uploaded files.  

---
### 5️⃣ Backend Services
- **MongoDB Integration**: Stores metadata of files, schemas, and rules.  
- **AI-Powered Schema & Rule Extraction**: Uses CrewAI to extract structured data from PDFs.  

---

## 🔗 API Endpoints
### 📄 PDF Endpoints
| Method | Endpoint | Description |
|--------|----------------------|------------------|
| POST | `/pdf/upload` | Upload a PDF file |
| GET | `/pdf/download/{pdf_id}` | Download a specific PDF |
| GET | `/pdf/{pdf_id}` | Retrieve metadata of a specific PDF |
| GET | `/pdf` | Retrieve a list of all PDFs |

### 📊 CSV Endpoints
| Method | Endpoint | Description |
|--------|----------------------|------------------|
| POST | `/csv/upload` | Upload a CSV file |
| GET | `/csv/download/{csv_id}` | Download a specific CSV |
| GET | `/csv/{csv_id}` | Retrieve metadata of a specific CSV |
| GET | `/csv` | Retrieve a list of all CSVs |

### 📋 Schema & Rule Endpoints
| Method | Endpoint | Description |
|--------|----------------------|------------------|
| POST | `/schema/create/{pdf_id}` | Generate a schema for a PDF |
| POST | `/rules` | Generate rules based on extracted schemas |

---

## 🛠 Implementation
### 1️⃣ Backend (FastAPI)
- **File Handling**: Uses `UploadFile` to handle file uploads, and `FileResponse` for downloads.  
- **AI Agents**: `CrewAI` extracts schema and rules from PDFs.  
- **Database**: MongoDB stores file metadata, schemas, and rules.  
- **Services**: `PdfService`, `CsvService`, and `SchemaService` handle business logic.  

### 2️⃣ Frontend (React)
- **Components**:  
  - `PdfCard`: Displays PDFs with options for download/schema generation.  
  - `ExistingPDFList`: Displays a list of uploaded PDFs.  
  - `UploadPDF`: Main interface for managing PDF uploads.  
- **API Integration**: Uses `axios` for API calls.  
- **Routing**: Handled via `React Router`.  
- **Styling**: Uses **CSS modules**.  

### 3️⃣ Middleware
- **CORS Middleware**: Configured to allow frontend requests (`http://localhost:5174`).

---

## 🌐 Deployment
### ▶️ Backend:
```sh
uvicorn app.main:app --reload
```

### ▶️ Frontend:
```sh
cd frontend
npm install
npm run dev
```

---

## ⚙️ Key Technologies
### 🔹 Backend:
- **FastAPI** – REST API framework
- **MongoDB** – NoSQL database
- **CrewAI** – AI-powered schema & rule extraction
- **Python Libraries** – `pdfminer`, `pydantic`

### 🔹 Frontend:
- **React** – UI Framework
- **Axios** – API requests
- **Vite** – Build tool

### 🔹 Other Tools:
- **dotenv** – Environment variable management

---

## 🎯 Summary
This project is a **comprehensive data profiling tool** combining:
✅ AI-powered schema extraction  
✅ PDF & CSV management  
✅ Automated rule generation  
✅ A seamless **FastAPI backend & React frontend** experience  

🚀 **Empower your data profiling with AI today!**


---

## 🖥️ Steps to Run the Project Locally

### **1️⃣ Prerequisites**
Ensure you have the following installed:
- **Python** (version 3.8 or higher)
- **Node.js** (for the frontend)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (for metadata storage)

---

### **2️⃣ Backend Setup**

#### **Step 1: Create a Python Virtual Environment**
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv myenv
   ```
3. Activate the virtual environment:
   ```bash
   myenv\Scripts\activate  # For Windows
   source myenv/bin/activate  # For macOS/Linux
   ```

#### **Step 2: Install Dependencies**
1. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

#### **Step 3: Configure Environment Variables**
1. Create a `.env` file in the `backend` directory and add the following:
   ```env
   SAMBANOVA_API_KEY=your_api_key_here
   ```

#### **Step 4: Run the Backend**
1. Start the FastAPI backend:
   ```bash
   uvicorn app.main:app --reload
   ```
2. The backend will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### **3️⃣ Frontend Setup**

#### **Step 1: Navigate to the Frontend Directory**
1. Open a new terminal and navigate to the `frontend/my-react-app` directory:
   ```bash
   cd frontend/my-react-app
   ```

#### **Step 2: Install Dependencies**
1. Install the required Node.js packages:
   ```bash
   npm install
   ```

#### **Step 3: Run the Frontend**
1. Start the React development server:
   ```bash
   npm run dev
   ```
2. The frontend will be available at: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

### **4️⃣ MongoDB Setup**
1. Ensure MongoDB is installed and running on your system.
2. By default, the backend will connect to `mongodb://localhost:27017`. If you need to customize the connection, update the MongoDB URI in the backend configuration.

---

### **5️⃣ Testing the Application**
1. **Upload Files**:
   - Use the frontend to upload PDF or CSV files.
   - Alternatively, use tools like Postman to test the backend endpoints.
2. **Download Files**:
   - Test the file download functionality for both PDF and CSV files.
3. **Schema Generation**:
   - Verify that the AI-based schema generation works as expected.

---

### **6️⃣ Additional Notes**
- **Frontend Build**:
  If you want to build the frontend for production, run:
  ```bash
  npm run build
  ```
  The build files will be available in the `dist` directory.
- **Backend Logs**:
  Check the terminal running the backend for logs and error messages.

---

### **7️⃣ Cleanup**
To deactivate the Python virtual environment, run:
```bash
deactivate
```

By following these steps, you should be able to run the **Gen AI Data Profiling** project successfully in your local environment.
