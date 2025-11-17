import React from 'react';
import { Project } from '../types';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

interface PauseSuggestionModalProps {
  suggestion: {
    project: Project;
    effortReduction: number;
  };
  onClose: () => void; // This will now be the "Ignore for Today" handler
  onPauseProject: (projectId: string) => void;
}

const PauseSuggestionModal: React.FC<PauseSuggestionModalProps> = ({ suggestion, onClose, onPauseProject }) => {
  const { project, effortReduction } = suggestion;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 border border-red-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
            <BrainCircuitIcon className="w-8 h-8 text-red-400" />
            <div>
                 <h2 className="text-2xl font-bold text-dark-text-primary">Cognitive Overload Alert</h2>
            </div>
        </div>

        <div className="text-dark-text-secondary my-6">
            <p>
                Your cognitive load is critically high, increasing the risk of burnout.
            </p>
            <p className="mt-4">
                To recover focus, we suggest pausing your lowest-impact project:
            </p>
            <div className="my-4 p-4 bg-dark-bg rounded-lg text-center">
                <p className="font-bold text-lg text-dark-text-primary">{project.name}</p>
                <p className="text-sm text-brand-primary">
                    This will reduce your Effort Load by <span className="font-bold">{effortReduction}</span> points.
                </p>
            </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
            <button 
                onClick={onClose} 
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Ignore for Today
            </button>
            <button 
                onClick={() => onPauseProject(project.project_id)} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Pause Project
            </button>
        </div>
      </div>
    </div>
  );
};

export default PauseSuggestionModal;