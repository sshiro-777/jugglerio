import React, { useState, useEffect } from 'react';
import { Task, Project, ProjectDna } from '../types';
import TargetIcon from './icons/TargetIcon';
import GoogleDocsIcon from './icons/GoogleDocsIcon';
import GoogleCalendarIcon from './icons/GoogleCalendarIcon';
import SparklesIcon from './icons/SparklesIcon';
import { generateTaskDraft } from '../services/geminiService';
import PlayIcon from './icons/PlayIcon';
import StopIcon from './icons/StopIcon';
import PencilIcon from './icons/PencilIcon';
import SaveIcon from './icons/SaveIcon';
import XIcon from './icons/XIcon';


interface TaskDetailModalProps {
  task: Task;
  project: Project | undefined;
  onClose: () => void;
  activeTimer: { taskId: string; startTime: number } | null;
  onStartTimer: (taskId: string) => void;
  onStopTimer: () => void;
  onUpdateTask: (updatedTask: Task) => void;
}

const TimerDisplay: React.FC<{ startTime: number }> = ({ startTime }) => {
    const [elapsedTime, setElapsedTime] = useState(Date.now() - startTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return <span className="text-2xl font-bold font-mono text-dark-text-primary">{formatTime(elapsedTime)}</span>;
};


const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose, activeTimer, onStartTimer, onStopTimer, onUpdateTask }) => {
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftContent, setDraftContent] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  
  useEffect(() => {
      setEditedTask(task);
      if (task.task_id !== editedTask.task_id) {
          setIsEditing(false);
      }
  }, [task, editedTask.task_id]);

  if (!task) return null;
  
  const isCurrentTaskTiming = activeTimer?.taskId === task.task_id;
  const isAnotherTaskTiming = activeTimer && !isCurrentTaskTiming;

  const getDaysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff < 0) return { text: 'Overdue', color: 'text-red-400' };
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return { text: `${days} day${days !== 1 ? 's' : ''} remaining`, color: 'text-dark-text-secondary' };
  };

  const deadlineInfo = getDaysRemaining(task.deadline);
  
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

  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent(task.description);
    const details = encodeURIComponent(`Project: ${project?.name || 'N/A'}\n\nThis task is managed in juggler.io.`);
    const date = new Date(task.deadline).toISOString().replace(/-|:|\.\d+/g, '');
    return `https://calendar.google.com/render?action=TEMPLATE&text=${title}&details=${details}&dates=${date}/${date}`;
  };

  const createGoogleDocsLink = () => {
    const title = encodeURIComponent(`${project?.name}: ${task.description}`);
    return `https://docs.google.com/document/create?title=${title}`;
  };
  
  const handleGenerateDraft = async () => {
    setIsGeneratingDraft(true);
    setDraftContent(null);
    try {
        const draft = await generateTaskDraft(task.description);
        setDraftContent(draft);
    } catch (error) {
        console.error("Failed to generate draft:", error);
        setDraftContent("Sorry, there was an error generating the draft.");
    } finally {
        setIsGeneratingDraft(false);
    }
  };
  
  const handleCopyDraft = () => {
    if (draftContent) {
        navigator.clipboard.writeText(draftContent)
            .then(() => alert('Draft copied to clipboard!'))
            .catch(err => console.error('Failed to copy text: ', err));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleEffortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numericValue = Number(e.target.value);
    if (numericValue < 1) numericValue = 1;
    if (numericValue > 10) numericValue = 10;
    setEditedTask(prev => ({ ...prev, effort_score: numericValue }));
  };

  const handleSave = () => {
      onUpdateTask(editedTask);
      setIsEditing(false);
  };

  const handleCancel = () => {
      setEditedTask(task);
      setIsEditing(false);
  };


  const IntegrationButton: React.FC<{ icon: React.ReactNode; label: string; href: string; }> = ({ icon, label, href }) => (
    <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 bg-dark-bg hover:bg-slate-800 transition-colors text-dark-text-secondary py-2 px-3 rounded-lg border border-slate-700"
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </a>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg m-4 p-8 border border-slate-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
                 {isEditing ? (
                     <textarea
                         name="description"
                         value={editedTask.description}
                         onChange={handleInputChange}
                         className="w-full bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-2xl font-bold text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary"
                     />
                 ) : (
                    <h2 className="text-2xl font-bold text-dark-text-primary">{task.description}</h2>
                 )}
                 <div className="flex items-center gap-4 text-sm text-dark-text-secondary mt-2">
                     <div className="flex items-center gap-1.5">
                       <TargetIcon className="w-4 h-4" />
                       <span>{project?.name || 'Unknown Project'}</span>
                     </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getProjectDnaColor(project?.project_dna)}`}>{project?.project_dna}</span>
                  </div>
            </div>
            <div className="flex items-center gap-2">
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="p-2 text-dark-text-secondary hover:text-dark-text-primary rounded-full hover:bg-dark-bg" title="Edit Task">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                ) : (
                    <button onClick={handleSave} className="p-2 text-brand-primary hover:text-opacity-80 rounded-full hover:bg-dark-bg" title="Save Changes">
                        <SaveIcon className="w-5 h-5" />
                    </button>
                )}
                <button onClick={isEditing ? handleCancel : onClose} className="p-1 text-dark-text-secondary hover:text-dark-text-primary rounded-full hover:bg-dark-bg" title={isEditing ? "Cancel" : "Close"}>
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
        
        <div className="mt-8">
            <div className="flex items-center justify-between bg-dark-bg p-4 rounded-lg">
                <div className="flex flex-col">
                    <span className="text-sm text-dark-text-secondary">Focus Session</span>
                    {isCurrentTaskTiming && activeTimer ? (
                         <TimerDisplay startTime={activeTimer.startTime} />
                    ) : (
                         <span className="text-2xl font-bold font-mono text-dark-text-secondary">00:00:00</span>
                    )}
                </div>
                {isCurrentTaskTiming ? (
                     <button onClick={onStopTimer} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <StopIcon className="w-5 h-5" />
                        <span>Stop</span>
                    </button>
                ) : (
                    <button onClick={() => onStartTimer(task.task_id)} disabled={isAnotherTaskTiming} className="flex items-center gap-2 bg-brand-primary hover:bg-opacity-80 text-dark-bg font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                        <PlayIcon className="w-5 h-5" />
                        <span>Start</span>
                    </button>
                )}
            </div>
             {isAnotherTaskTiming && <p className="text-xs text-amber-400 mt-2 text-center">Another task is currently being timed.</p>}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="text-center bg-dark-bg p-4 rounded-lg">
                <p className="text-sm text-dark-text-secondary">Flow Rating</p>
                <p className="text-4xl font-bold text-brand-accent">{task.flow_rating}</p>
            </div>
            <div className="text-center bg-dark-bg p-4 rounded-lg">
                <p className="text-sm text-dark-text-secondary">Effort Score</p>
                {isEditing ? (
                    <input
                        type="number"
                        min="1"
                        max="10"
                        name="effort_score"
                        value={editedTask.effort_score}
                        onChange={handleEffortChange}
                        className="w-24 bg-dark-surface border border-slate-600 rounded-lg p-2 text-4xl font-bold text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary text-center"
                    />
                ) : (
                    <p className="text-4xl font-bold text-dark-text-primary">{task.effort_score}</p>
                )}
            </div>
             <div className="text-center bg-dark-bg p-4 rounded-lg">
                <p className="text-sm text-dark-text-secondary">Deadline</p>
                {isEditing ? (
                    <input
                        type="date"
                        name="deadline"
                        value={new Date(editedTask.deadline).toISOString().split('T')[0]}
                        onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            newDate.setUTCHours(12);
                            setEditedTask(prev => ({ ...prev, deadline: newDate.toISOString() }));
                        }}
                        className="w-full bg-dark-surface border border-slate-600 rounded-lg p-1.5 text-xl font-semibold text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary text-center"
                    />
                ) : (
                    <>
                        <p className={`text-xl font-semibold ${deadlineInfo.color}`}>{deadlineInfo.text}</p>
                        <p className="text-xs text-dark-text-secondary">{new Date(task.deadline).toLocaleDateString()}</p>
                    </>
                )}
            </div>
             <div className="text-center bg-dark-bg p-4 rounded-lg">
                <p className="text-sm text-dark-text-secondary">Project Impact</p>
                <p className="text-4xl font-bold text-dark-text-primary">{project?.impact_score}</p>
            </div>
        </div>
        
        {task.is_critical_path && (
            <div className="mt-6 text-center p-3 bg-red-500/20 rounded-lg">
                <p className="font-semibold text-red-300">This task is on the critical path.</p>
            </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-bold text-dark-text-secondary mb-3">AI Assistant</h4>
            <button
                onClick={handleGenerateDraft}
                disabled={isGeneratingDraft}
                className="w-full flex items-center justify-center gap-2 bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isGeneratingDraft ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate Draft with AI</span>
                    </>
                )}
            </button>
            {draftContent && (
                <div className="mt-4 p-4 bg-dark-bg rounded-lg border border-slate-700 relative">
                    <button onClick={handleCopyDraft} className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold py-1 px-2 rounded">Copy Draft</button>
                    <pre className="text-sm text-dark-text-secondary whitespace-pre-wrap font-sans">{draftContent}</pre>
                </div>
            )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-bold text-dark-text-secondary mb-3">Integrations</h4>
            <div className="flex items-center gap-3">
                <IntegrationButton icon={<GoogleDocsIcon className="w-5 h-5" />} label="Create Doc" href={createGoogleDocsLink()} />
                <IntegrationButton icon={<GoogleCalendarIcon className="w-5 h-5" />} label="Add to Calendar" href={createGoogleCalendarLink()} />
            </div>
        </div>

      </div>
    </div>
  );
};

export default TaskDetailModal;