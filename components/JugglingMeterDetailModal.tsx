import React from 'react';
import { Task, Project } from '../types';
import TargetIcon from './icons/TargetIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import XIcon from './icons/XIcon';

interface JugglingMeterDetailModalProps {
  tasks: Task[]; // Should be pre-filtered to high-impact tasks
  projects: Project[];
  onClose: () => void;
  onRemoveTask: (taskId: string) => void;
}

const JugglingMeterDetailModal: React.FC<JugglingMeterDetailModalProps> = ({ tasks, projects, onClose, onRemoveTask }) => {
  const projectMap = new Map<string, Project>(projects.map(p => [p.project_id, p]));

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg m-4 p-8 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
            <BrainCircuitIcon className="w-8 h-8 text-brand-primary" />
            <div>
                 <h2 className="text-2xl font-bold text-dark-text-primary">Cognitive Load Analysis</h2>
                 <p className="text-dark-text-secondary text-sm">These high-effort tasks are contributing most to your load.</p>
            </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {tasks.length > 0 ? tasks.map(task => {
                 const project = projectMap.get(task.project_id);
                 return (
                    <div key={task.task_id} className="bg-dark-bg p-4 rounded-lg flex items-center justify-between gap-2">
                        <div className="flex-grow">
                          <p className="font-semibold text-dark-text-primary">{task.description}</p>
                          <div className="flex justify-between items-center text-sm text-dark-text-secondary mt-2">
                              <div className="flex items-center gap-2">
                                  <TargetIcon className="w-4 h-4" />
                                  <span>{project?.name}</span>
                              </div>
                              <span>Effort: <span className="font-bold text-dark-text-primary">{task.effort_score}</span></span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemoveTask(task.task_id)}
                          title="Remove Task"
                          className="flex-shrink-0 p-2 text-red-400 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-colors"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                 );
            }) : <p className="text-center text-dark-text-secondary py-8">No high-effort tasks detected. Your cognitive load is low.</p>}
        </div>
        
        <button 
            onClick={onClose} 
            className="mt-8 w-full bg-brand-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
            Close
        </button>
      </div>
    </div>
  );
};

export default JugglingMeterDetailModal;