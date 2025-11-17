import React, { useState } from 'react';
import { Project, ProjectDna } from '../types';
import { projectTemplates } from '../services/templates';
import TargetIcon from './icons/TargetIcon';

interface AddProjectModalProps {
  onClose: () => void;
  onAddProject: (
    project: Omit<Project, 'project_id' | 'burnout_budget_usage'>,
    templateTasks?: { subtask: string; effort_score: number }[]
  ) => void;
}

const ImpactScoreInput: React.FC<{ score: number; setScore: (score: number) => void }> = ({ score, setScore }) => {
    return (
        <div className="flex items-center justify-center gap-2" title={`Impact Score: ${score} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
            <button
            type="button"
            key={index}
            onClick={() => setScore(index + 1)}
            className={`h-5 w-5 rounded-full transition-colors border-2 ${
                index < score ? 'bg-white border-white' : 'bg-transparent border-slate-600 hover:border-white'
            }`}
            ></button>
        ))}
        </div>
    );
};


const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onAddProject }) => {
  const [name, setName] = useState('');
  const [projectDna, setProjectDna] = useState<ProjectDna>('Deep Work');
  const [impactScore, setImpactScore] = useState(3);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateName = e.target.value;
    setSelectedTemplate(templateName);
    const template = projectTemplates.find(t => t.name === templateName);
    if (template) {
        setName(template.name);
        setProjectDna(template.dna);
        setImpactScore(template.impact_score);
    } else {
        setName('');
        setProjectDna('Deep Work');
        setImpactScore(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
        alert('Please provide a project name.');
        return;
    }
    const template = projectTemplates.find(t => t.name === selectedTemplate);
    onAddProject({
        name,
        project_dna: projectDna,
        impact_score: impactScore,
        current_status: 'Active',
    }, template?.tasks);
  };
  
  const dnaOptions: ProjectDna[] = ['Deep Work', 'Burst Creativity', 'Research & Analysis', 'Client Communication', 'Routine Maintenance'];

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
            <TargetIcon className="w-6 h-6 text-brand-primary" />
            <h2 className="text-2xl font-bold text-dark-text-primary">Add New Project</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
                <label htmlFor="template" className="block text-sm font-medium text-dark-text-secondary mb-1">Start with a Template (Optional)</label>
                <select
                    id="template"
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    className="w-full bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary"
                >
                    <option value="">Start from scratch</option>
                    {projectTemplates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
           </div>
           
           <hr className="border-slate-700" />

           <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-dark-text-secondary mb-1">Project Name</label>
                <input
                    type="text"
                    id="projectName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Q4 Marketing Campaign"
                    className="w-full bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">Project DNA</label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {dnaOptions.map(dna => (
                         <button 
                            key={dna}
                            type="button" 
                            onClick={() => setProjectDna(dna)} 
                            className={`p-2 rounded-lg border-2 text-sm transition-colors ${projectDna === dna ? 'border-brand-secondary bg-brand-secondary/20' : 'border-slate-700 bg-dark-bg'}`}
                         >
                            {dna}
                         </button>
                    ))}
                </div>
            </div>
            <div>
                 <label htmlFor="impactScore" className="block text-sm font-medium text-dark-text-secondary mb-2">Impact Score ({impactScore})</label>
                 <ImpactScoreInput score={impactScore} setScore={setImpactScore} />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Cancel
                </button>
                <button type="submit" className="bg-brand-primary hover:bg-opacity-80 text-dark-bg font-bold py-2 px-4 rounded-lg transition-colors">
                    {selectedTemplate ? 'Next: Review Tasks' : 'Add Project'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;