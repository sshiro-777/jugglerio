import React from 'react';
import { Task, Project, ProjectDna } from '../types';
import ListChecksIcon from './icons/ListChecksIcon';
import TargetIcon from './icons/TargetIcon';

interface CriticalFewListProps {
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
}

const CriticalFewList: React.FC<CriticalFewListProps> = ({ tasks, projects, onSelectTask }) => {
  const sortedTasks = [...tasks].sort((a, b) => b.flow_rating - a.flow_rating);
  const projectMap = new Map<string, Project>(projects.map(p => [p.project_id, p]));

  const getDaysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff < 0) return 'Overdue';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''} left`;
  };
  
  const getProjectDnaColor = (dna: ProjectDna = 'Deep Work') => {
    switch (dna) {
        case 'Deep Work': return 'bg-indigo-500/50 text-indigo-200';
        case 'Burst Creativity': return 'bg-amber-500/50 text-amber-200';
        case 'Research & Analysis': return 'bg-sky-500/50 text-sky-200';
        case 'Client Communication': return 'bg-teal-500/50 text-teal-200';
        case 'Routine Maintenance': return 'bg-slate-500/50 text-slate-200';
        default: return 'bg-slate-500/50 text-slate-200';
    }
  }
  
  const truncate = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
  }

  return (
    <div className="p-6 bg-dark-surface rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <ListChecksIcon className="w-6 h-6 text-brand-secondary" />
        <h3 className="text-lg font-bold text-dark-text-primary">The Critical Few</h3>
      </div>
      <div className="space-y-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.slice(0, 3).map(task => { // Limiting to top 3 for a cleaner look
            const project = projectMap.get(task.project_id);
            return (
              <button 
                key={task.task_id} 
                onClick={() => onSelectTask(task)}
                className="w-full text-left bg-dark-bg p-4 rounded-lg flex items-center justify-between gap-4 transition-all hover:bg-slate-800"
              >
                <div className="flex-grow">
                  <p className="font-semibold text-dark-text-primary">{truncate(task.description, 60)}</p>
                  <div className="flex items-center gap-4 text-sm text-dark-text-secondary mt-1">
                     <div className="flex items-center gap-1.5">
                       <TargetIcon className="w-4 h-4 text-dark-text-secondary" />
                       <span>{project?.name || 'Unknown Project'}</span>
                     </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getProjectDnaColor(project?.project_dna)}`}>{project?.project_dna}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-brand-accent">{task.flow_rating}</span>
                    <span className="text-sm text-dark-text-secondary">Flow</span>
                  </div>
                  <p className="text-xs text-dark-text-secondary">{getDaysRemaining(task.deadline)}</p>
                </div>
              </button>
            );
          })
        ) : (
          <p className="text-center text-dark-text-secondary py-8">No active tasks. Add a goal to get started!</p>
        )}
      </div>
    </div>
  );
};

export default CriticalFewList;