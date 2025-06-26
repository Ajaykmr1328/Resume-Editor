from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import json
import os
from datetime import datetime
import random

app = FastAPI(title="Resume Editor API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class AIEnhanceResponse(BaseModel):
    enhanced_content: str

class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    summary: str = ""

class Experience(BaseModel):
    id: int
    company: str = ""
    position: str = ""
    duration: str = ""
    description: str = ""

class Education(BaseModel):
    id: int
    institution: str = ""
    degree: str = ""
    year: str = ""
    description: str = ""

class Skill(BaseModel):
    id: int
    name: str = ""

class Resume(BaseModel):
    personalInfo: PersonalInfo
    experience: List[Experience]
    education: List[Education]
    skills: List[Skill]

# In-memory storage (for demo purposes)
resume_storage = {}

# Mock AI enhancement templates
AI_ENHANCEMENTS = {
    "summary": [
        "Results-driven professional with proven expertise in {domain}. Demonstrated ability to lead cross-functional teams and drive strategic initiatives that deliver measurable business impact.",
        "Dynamic {role} with extensive experience in {domain}. Known for innovative problem-solving, exceptional leadership skills, and a track record of exceeding performance targets.",
        "Accomplished professional with deep expertise in {domain}. Combines technical excellence with strategic thinking to deliver solutions that drive organizational growth and efficiency."
    ],
    "experience": [
        "• Spearheaded key initiatives that resulted in significant improvements to team productivity and project delivery timelines\n• Collaborated with stakeholders across multiple departments to ensure alignment with business objectives\n• Implemented best practices and mentored team members to enhance overall performance\n• Delivered high-quality solutions while maintaining strict adherence to project deadlines and budget constraints",
        "• Led cross-functional teams to achieve project milestones and deliver exceptional results\n• Developed and executed strategic plans that improved operational efficiency by measurable metrics\n• Established strong relationships with clients and stakeholders to ensure project success\n• Implemented innovative solutions that streamlined processes and reduced operational costs",
        "• Managed complex projects from conception to completion, ensuring all deliverables met quality standards\n• Collaborated with diverse teams to solve challenging technical problems and implement scalable solutions\n• Conducted thorough analysis and provided actionable insights that informed key business decisions\n• Maintained detailed documentation and reporting to track progress and communicate with stakeholders"
    ],
    "education": [
        "• Completed comprehensive coursework in core areas including advanced topics relevant to the field\n• Actively participated in academic projects and research initiatives\n• Maintained strong academic performance while engaging in extracurricular activities\n• Developed critical thinking and analytical skills through rigorous academic training",
        "• Specialized in relevant subject areas with focus on practical applications and industry trends\n• Participated in collaborative projects that enhanced teamwork and communication skills\n• Engaged with faculty and peers to expand knowledge and professional network\n• Applied theoretical knowledge to real-world scenarios through internships and practical exercises",
        "• Pursued advanced studies in specialized areas with emphasis on innovation and problem-solving\n• Contributed to academic community through participation in student organizations and initiatives\n• Developed strong foundation in analytical thinking and research methodologies\n• Maintained academic excellence while balancing multiple responsibilities and commitments"
    ]
}

def get_mock_enhancement(section: str, content: str) -> str:
    """Generate mock AI-enhanced content based on section type"""
    if not content.strip():
        return content
    
    if section == "summary":
        # Extract potential domain/role from content
        common_roles = ["developer", "engineer", "manager", "analyst", "designer", "consultant"]
        common_domains = ["technology", "software development", "data analysis", "project management", "business strategy"]
        
        detected_role = "professional"
        detected_domain = "their field"
        
        content_lower = content.lower()
        for role in common_roles:
            if role in content_lower:
                detected_role = role
                break
        
        for domain in common_domains:
            if any(word in content_lower for word in domain.split()):
                detected_domain = domain
                break
        
        template = random.choice(AI_ENHANCEMENTS["summary"])
        enhanced = template.format(domain=detected_domain, role=detected_role)
        return f"{content} {enhanced}"
    
    elif section in ["experience", "education"]:
        if section in AI_ENHANCEMENTS:
            enhancement = random.choice(AI_ENHANCEMENTS[section])
            return f"{content}\n{enhancement}"
    
    # Default enhancement for other sections
    return f"{content} [AI Enhanced: This content has been optimized for better impact and clarity.]"

@app.get("/")
async def root():
    return {"message": "Resume Editor API is running", "version": "1.0.0"}

@app.post("/ai-enhance", response_model=AIEnhanceResponse)
async def enhance_content(request: AIEnhanceRequest):
    """
    Enhance resume section content using mock AI
    """
    try:
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        # Simulate AI processing time
        import time
        time.sleep(0.5)  # Small delay to simulate processing
        
        enhanced_content = get_mock_enhancement(request.section, request.content)
        
        return AIEnhanceResponse(enhanced_content=enhanced_content)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

@app.post("/save-resume")
async def save_resume(resume: Resume):
    """
    Save resume data to storage
    """
    try:
        # Generate unique ID for this resume
        resume_id = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Convert to dict for storage
        resume_data = resume.dict()
        resume_data['id'] = resume_id
        resume_data['saved_at'] = datetime.now().isoformat()
        
        # Store in memory
        resume_storage[resume_id] = resume_data
        
        # Also save to file for persistence (optional)
        os.makedirs("saved_resumes", exist_ok=True)
        with open(f"saved_resumes/{resume_id}.json", "w") as f:
            json.dump(resume_data, f, indent=2)
        
        return {
            "message": "Resume saved successfully",
            "resume_id": resume_id,
            "saved_at": resume_data['saved_at']
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save failed: {str(e)}")

@app.get("/resumes")
async def list_resumes():
    """
    List all saved resumes
    """
    try:
        resumes = []
        for resume_id, resume_data in resume_storage.items():
            resumes.append({
                "id": resume_id,
                "name": resume_data.get("personalInfo", {}).get("name", "Unnamed"),
                "saved_at": resume_data.get("saved_at", "Unknown")
            })
        return {"resumes": resumes}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list resumes: {str(e)}")

@app.get("/resume/{resume_id}")
async def get_resume(resume_id: str):
    """
    Retrieve a specific resume by ID
    """
    try:
        if resume_id not in resume_storage:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return resume_storage[resume_id]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve resume: {str(e)}")

@app.delete("/resume/{resume_id}")
async def delete_resume(resume_id: str):
    """
    Delete a specific resume by ID
    """
    try:
        if resume_id not in resume_storage:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Remove from memory storage
        del resume_storage[resume_id]
        
        # Remove from file storage if exists
        file_path = f"saved_resumes/{resume_id}.json"
        if os.path.exists(file_path):
            os.remove(file_path)
        
        return {"message": "Resume deleted successfully", "resume_id": resume_id}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete resume: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "total_resumes": len(resume_storage)
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting Resume Editor API...")
    print("API Documentation available at: http://localhost:8000/docs")
    print("Frontend should be running at: http://localhost:3000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)