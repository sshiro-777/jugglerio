import React, { useState } from 'react';
import { Project, ProjectDna } from '../types';
import MenuIcon from '../components/icons/MenuIcon';
import AddProjectModal from '../components/AddProjectModal';
import PlusIcon from '../components/icons/PlusIcon';
import ImpactScoreMeter from '../components/ImpactScoreMeter';

interface ProjectsPageProps {
    projects: Project[];
    onToggleSidebar: () => void;
    onAddProject: (
      project: Omit<Project, 'project_id' | 'burnout_budget_usage'>,
      templateTasks?: { subtask: string; effort_score: number }[]
    ) => void;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const getProjectDnaColor = (dna: ProjectDna) => {
        switch (dna) {
            case 'Deep Work': return 'bg-indigo-500/50 text-indigo-200';
            case 'Burst Creativity': return 'bg-amber-500/50 text-amber-200';
            case 'Research & Analysis': return 'bg-sky-500/50 text-sky-200';
            case 'Client Communication': return 'bg-teal-500/50 text-teal-200';
            case 'Routine Maintenance': return 'bg-slate-500/50 text-slate-200';
            default: return 'bg-slate-500/50 text-slate-200';
        }
    }

    return (
        <div className="bg-dark-surface p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-dark-text-primary pr-4">{project.name}</h3>
                    <div className="text-center flex-shrink-0">
                        <p className="text-xs text-dark-text-secondary mb-1">Impact</p>
                        <ImpactScoreMeter score={project.impact_score} />
                    </div>
                </div>
                <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getProjectDnaColor(project.project_dna)}`}>
                    {project.project_dna}
                </span>
            </div>
            <div className="mt-6">
                 <p className="text-sm text-dark-text-secondary">Burnout Budget Usage</p>
                 <div className="w-full bg-dark-bg rounded-full h-2.5 mt-1">
                    <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${project.burnout_budget_usage}%` }}></div>
                </div>
                <p className="text-right text-xs mt-1 text-dark-text-secondary">{project.burnout_budget_usage}%</p>
            </div>
             <div className="mt-4 text-sm text-dark-text-secondary">
                Status: <span className="font-semibold text-dark-text-primary">{project.current_status}</span>
            </div>
        </div>
    );
};


const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onToggleSidebar, onAddProject }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const activeProjects = projects.filter(p => p.current_status === 'Active');
    const otherProjects = projects.filter(p => p.current_status !== 'Active');
    
    const handleAddProject = (
      project: Omit<Project, 'project_id' | 'burnout_budget_usage'>,
      templateTasks?: { subtask: string; effort_score: number }[]
    ) => {
        onAddProject(project, templateTasks);
        setIsAddModalOpen(false);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 mr-2 text-dark-text-secondary rounded-full hover:bg-dark-surface">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-dark-text-primary">Projects</h1>
                        <p className="text-dark-text-secondary">Manage all your high-impact endeavors.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-primary text-dark-bg font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Project</span>
                </button>
            </header>

            <main>
                <h2 className="text-xl font-semibold text-dark-text-primary mb-4 border-b border-slate-700 pb-2">Active Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects.length > 0 ? activeProjects.map(project => <ProjectCard key={project.project_id} project={project} />)
                    : <p className="text-dark-text-secondary md:col-span-2 lg:col-span-3">No active projects. Add one to get started!</p>
                    }
                </div>

                {otherProjects.length > 0 && (
                    <>
                        <h2 className="text-xl font-semibold text-dark-text-primary mt-12 mb-4 border-b border-slate-700 pb-2">Paused & Archived</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherProjects.map(project => <ProjectCard key={project.project_id} project={project} />)}
                        </div>
                    </>
                )}
            </main>
            
            {isAddModalOpen && (
                <AddProjectModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAddProject={handleAddProject}
                />
            )}
        </div>
    );
};

export default ProjectsPage;