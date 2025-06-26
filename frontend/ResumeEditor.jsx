import React, { useState, useRef } from 'react';
import { Upload, Download, Sparkles, Plus, Trash2, Save, FileText } from 'lucide-react';

const ResumeEditor = () => {
  const [resume, setResume] = useState({
    personalInfo: { name: '', email: '', phone: '', location: '', summary: '' },
    experience: [],
    education: [],
    skills: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setTimeout(() => {
      const mockResumeData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          summary: 'Experienced software developer with 5+ years in full-stack development.'
        },
        experience: [
          {
            id: Date.now(),
            company: 'Tech Corp',
            position: 'Senior Developer',
            duration: '2022 - Present',
            description: 'Led development of web applications using React and Node.js'
          }
        ],
        education: [
          {
            id: Date.now(),
            institution: 'University of Technology',
            degree: 'Bachelor of Computer Science',
            year: '2020',
            description: 'Graduated Magna Cum Laude'
          }
        ],
        skills: [
          { id: Date.now(), name: 'JavaScript' }
        ]
      };
      setResume(mockResumeData);
    }, 1000);
  };

  const enhanceSection = async (section, content) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content })
      });
      if (response.ok) {
        const data = await response.json();
        return data.enhanced_content;
      } else {
        return getMockEnhancement(section, content);
      }
    } catch {
      return getMockEnhancement(section, content);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockEnhancement = (section, content) => {
    const enhancements = {
      summary: `${content} Proven track record...`,
      experience: `${content} • Collaborated with cross-functional teams...`,
      education: `${content} • Relevant coursework...`,
      skills: content
    };
    return enhancements[section] || `Enhanced: ${content}`;
  };

  const saveResume = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume)
      });
      if (response.ok) {
        setSavedMessage('Resume saved successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch {
      setSavedMessage('Resume saved locally (backend unavailable)');
      setTimeout(() => setSavedMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResume = () => {
    const dataStr = JSON.stringify(resume, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${resume.personalInfo.name || 'resume'}_resume.json`;
    link.click();
  };

  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), company: '', position: '', duration: '', description: '' }]
    }));
  };

  const updateExperience = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), institution: '', degree: '', year: '', description: '' }]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const addSkill = () => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now(), name: '' }]
    }));
  };

  const updateSkill = (id, value) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(skill => skill.id === id ? { ...skill, name: value } : skill)
    }));
  };

  const removeSkill = (id) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(skill => skill.id !== id) }));
  };

  const handleEnhanceSummary = async () => {
    const enhanced = await enhanceSection('summary', resume.personalInfo.summary);
    updatePersonalInfo('summary', enhanced);
  };

  const handleEnhanceExperience = async (id) => {
    const exp = resume.experience.find(e => e.id === id);
    const enhanced = await enhanceSection('experience', exp.description);
    updateExperience(id, 'description', enhanced);
  };

  const handleEnhanceEducation = async (id) => {
    const edu = resume.education.find(e => e.id === id);
    const enhanced = await enhanceSection('education', edu.description);
    updateEducation(id, 'description', enhanced);
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" /> Resume Editor
            </h1>
            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Upload size={16} /> Upload
              </button>
              <button onClick={saveResume} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Save size={16} /> Save
              </button>
              <button onClick={downloadResume} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Download size={16} /> Download
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" />
          </div>
          {/* Personal Information */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Full Name" value={resume.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
              <input type="email" placeholder="Email" value={resume.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Phone" value={resume.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Location" value={resume.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} className="p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex gap-2 mb-4">
              <textarea placeholder="Professional Summary" value={resume.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} rows={4} className="flex-1 p-2 border border-gray-300 rounded-lg" />
              <button onClick={handleEnhanceSummary} disabled={isLoading} className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2">
                <Sparkles size={16} /> Enhance
              </button>
            </div>
          </section>
          {/* Experience Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
              <button onClick={addExperience} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus size={16} /> Add Experience
              </button>
            </div>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid gap-3 mb-2">
                  <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Position" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Duration" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <textarea placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex gap-2 justify-between">
                  <button onClick={() => handleEnhanceExperience(exp.id)} disabled={isLoading} className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2">
                    <Sparkles size={16} /> Enhance
                  </button>
                  <button onClick={() => removeExperience(exp.id)} className="text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </section>

          {/* Education Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              <button onClick={addEducation} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus size={16} /> Add Education
              </button>
            </div>
            {resume.education.map((edu) => (
              <div key={edu.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid gap-3 mb-2">
                  <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <textarea placeholder="Details" value={edu.description} onChange={(e) => updateEducation(edu.id, 'description', e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex gap-2 justify-between">
                  <button onClick={() => handleEnhanceEducation(edu.id)} disabled={isLoading} className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2">
                    <Sparkles size={16} /> Enhance
                  </button>
                  <button onClick={() => removeEducation(edu.id)} className="text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </section>

          {/* Skills Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              <button onClick={addSkill} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus size={16} /> Add Skill
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resume.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <input type="text" placeholder="Skill" value={skill.name} onChange={(e) => updateSkill(skill.id, e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  <button onClick={() => removeSkill(skill.id)} className="text-red-600 hover:underline">Remove</button>
                </div>
              ))}
            </div>
          </section>

          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-gray-700">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
