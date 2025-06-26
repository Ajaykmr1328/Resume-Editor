# Resume Editor - Setup Guide

This is a full-stack Resume Editor application with React frontend and FastAPI backend.

## Features

### Frontend (React)
- ✅ Upload resume files (.pdf, .docx) with mock parsing
- ✅ Edit all resume sections (Personal Info, Experience, Education, Skills)
- ✅ AI Enhancement for each section using mock AI backend
- ✅ Add/remove entries dynamically
- ✅ Save resume data to backend
- ✅ Download resume as JSON file
- ✅ Modern, responsive UI with loading states

### Backend (FastAPI)
- ✅ POST `/ai-enhance` - Mock AI enhancement for resume sections
- ✅ POST `/save-resume` - Save complete resume JSON
- ✅ GET `/resumes` - List all saved resumes
- ✅ GET `/resume/{id}` - Retrieve specific resume
- ✅ DELETE `/resume/{id}` - Delete specific resume
- ✅ CORS enabled for frontend communication
- ✅ In-memory storage + file persistence

## Quick Start

### Backend Setup

1. **Install Python dependencies:**
```bash
pip install fastapi uvicorn python-multipart
```

2. **Create and run the backend:**
```bash
# Save the FastAPI code as 'main.py'
python main.py
```

The backend will start at `http://localhost:8000`
- API docs available at: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Frontend Setup

The React component is ready to use in any React environment. You can:

1. **Use with Create React App:**
```bash
npx create-react-app resume-editor
cd resume-editor
npm install lucide-react
# Replace src/App.js with the React component code
npm start
```

2. **Use with Vite:**
```bash
npm create vite@latest resume-editor -- --template react
cd resume-editor
npm install
npm install lucide-react
# Replace src/App.jsx with the React component code
npm run dev
```

## Requirements

### Python (Backend)
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0
```

### Node.js (Frontend)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  }
}
```

## API Endpoints

### POST `/ai-enhance`
Enhance resume section content using mock AI.

**Request:**
```json
{
  "section": "summary",
  "content": "Experienced developer with 5 years..."
}
```

**Response:**
```json
{
  "enhanced_content": "Experienced developer with 5 years... Results-driven professional with proven expertise..."
}
```

### POST `/save-resume`
Save complete resume data.

**Request:**
```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "summary": "Experienced developer..."
  },
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

**Response:**
```json
{
  "message": "Resume saved successfully",
  "resume_id": "resume_20240101_120000",
  "saved_at": "2024-01-01T12:00:00"
}
```

### GET `/resumes`
List all saved resumes.

**Response:**
```json
{
  "resumes": [
    {
      "id": "resume_20240101_120000",
      "name": "John Doe",
      "saved_at": "2024-01-01T12:00:00"
    }
  ]
}
```

## Usage Instructions

1. **Start the Backend:**
   ```bash
   python main.py
   ```

2. **Start the Frontend:**
   ```bash
   npm start  # or npm run dev for Vite
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features Demo

### File Upload
- Click "Upload Resume" to simulate parsing a PDF/DOCX file
- Mock data will be populated automatically

### Editing
- Fill in personal information fields
- Add/remove experience entries with company, position, duration, and description
- Add/remove education entries with institution, degree, year, and description
- Add/remove skills

### AI Enhancement
- Click the "Enhance" button (with sparkles icon) next to any section
- The mock AI will improve the content with professional language and formatting
- Different enhancement templates for different sections

### Saving & Downloading
- Click "Save Resume" to store data in the backend
- Click "Download JSON" to save the resume as a JSON file locally
- All data persists in the backend storage

## File Structure

```
resume-editor/
├── main.py                 # FastAPI backend
├── src/
│   └── App.js             # React frontend component
├── saved_resumes/         # Auto-created directory for saved resumes
├── requirements.txt       # Python dependencies
└── package.json          # Node.js dependencies
```

## Mock AI Enhancement

The AI enhancement feature uses predefined templates that:
- Analyze the content for keywords and context
- Add professional language and formatting
- Include relevant action verbs and industry terms
- Maintain the original content while improving presentation

## Customization

### Adding Real AI
Replace the mock enhancement in `get_mock_enhancement()` with calls to:
- OpenAI GPT API
- Anthropic Claude API
- Google Gemini API
- Azure OpenAI

### Database Integration
Replace in-memory storage with:
- PostgreSQL using SQLAlchemy
- MongoDB using motor
- SQLite for simpler deployment

### File Parsing
Add real PDF/DOCX parsing using:
- PyPDF2 or pdfplumber for PDFs
- python-docx for Word documents
- OCR libraries for scanned documents

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure:
- Backend is running on port 8000
- Frontend is running on port 3000
- CORS middleware is properly configured

### File Upload Issues
- File upload currently shows mock data
- To implement real parsing, add file processing logic in the backend

### Missing Dependencies
Install all required packages:
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

## Production Deployment

### Backend
- Use production WSGI server like Gunicorn
- Set up proper database
- Configure environment variables
- Set up HTTPS

### Frontend
- Build for production: `npm run build`
- Serve static files with nginx or similar
- Configure proper API endpoints

This setup provides a fully functional resume editor with modern UI and extensible backend architecture!
