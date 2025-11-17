import React, { useState, useEffect } from 'react';
import { Project, Task } from '../types';
import { decomposeTaskWithGemini } from '../services/geminiService';
import TargetIcon from '../components/icons/TargetIcon';
import MenuIcon from '../components/icons/MenuIcon';
import SparklesIcon from '../components/icons/SparklesIcon';

interface DecomposedTask {
  subtask: string;
  effort_score: number;
}

interface DecomposePageProps {
  projects: Project[];
  onAddTasks: (tasks: Omit<Task, 'task_id' | 'flow_rating'>[]) => void;
  onToggleSidebar: () => void;
  initialTasks?: DecomposedTask[];
  onProcessingComplete: () => void;
}

const DecomposePage: React.FC<DecomposePageProps> = ({ projects, onAddTasks, onToggleSidebar, initialTasks, onProcessingComplete }) => {
  const [goal, setGoal] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.find(p => p.current_status === 'Active')?.project_id || '');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasksToReview, setTasksToReview] = useState<DecomposedTask[] | null>(null);

  useEffect(() => {
    if (initialTasks) {
      setTasksToReview(initialTasks);
      // Clean up the initial tasks from App state after loading them
      onProcessingComplete();
    }
  }, [initialTasks, onProcessingComplete]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !selectedProjectId || !deadline) {
      alert('Please fill out all fields.');
      return;
    }
    setIsLoading(true);
    setTasksToReview(null);
    try {
      const decomposedTasks = await decomposeTaskWithGemini(goal);
      setTasksToReview(decomposedTasks);
    } catch (error) {
      console.error('Failed to decompose task:', error);
      alert('Failed to break down the task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateReviewTask = (index: number, field: 'subtask' | 'effort_score', value: string | number) => {
    if (!tasksToReview) return;
    const updatedTasks = [...tasksToReview];
    const taskToUpdate = { ...updatedTasks[index] };
    
    if (field === 'subtask') {
        taskToUpdate.subtask = String(value);
    } else if (field === 'effort_score') {
        let numericValue = Number(value);
        if (numericValue < 1) numericValue = 1;
        if (numericValue > 10) numericValue = 10;
        taskToUpdate.effort_score = numericValue;
    }
    
    updatedTasks[index] = taskToUpdate;
    setTasksToReview(updatedTasks);
  };
  
  const handleConfirmTasks = () => {
    if (!tasksToReview || !selectedProjectId || !deadline) {
        alert("Please ensure a project and deadline are selected, especially when using templates.");
        return;
    };
    const newTasks = tasksToReview.map(dt => ({
      project_id: selectedProjectId,
      description: dt.subtask,
      deadline: new Date(deadline).toISOString(),
      effort_score: dt.effort_score,
      is_critical_path: false,
    }));
    onAddTasks(newTasks);
    
    setTasksToReview(null);
    setGoal('');
    setDeadline('');
    alert(`${newTasks.length} tasks added successfully!`);
  };

  const handleCancelReview = () => {
    setTasksToReview(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
         <header className="mb-8 flex items-center">
            <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 mr-2 text-dark-text-secondary rounded-full hover:bg-dark-surface">
                <MenuIcon className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-dark-text-primary">Decompose a Goal</h1>
                <p className="text-dark-text-secondary">Let AI break down your big goals into manageable tasks.</p>
            </div>
        </header>
        <main className="max-w-3xl mx-auto">
            <div className="p-6 bg-dark-surface rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <SparklesIcon className="w-6 h-6 text-brand-primary" />
                    <h3 className="text-lg font-bold text-dark-text-primary">New Goal</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-dark-text-secondary mb-1">High-Level Goal</label>
                        <textarea
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Launch the new marketing website for Project Phoenix"
                        className="w-full bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary min-h-[80px]"
                        required={!tasksToReview} // Not required if reviewing template tasks
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="project" className="block text-sm font-medium text-dark-text-secondary mb-1">Assign to Project</label>
                            <select
                                id="project"
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                className="w-full bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary"
                                required
                            >
                                {projects.filter(p=>p.current_status === 'Active').map(p => <option key={p.project_id} value={p.project_id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-dark-text-secondary mb-1">Target Deadline</label>
                            <input
                                type="date"
                                id="deadline"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-primary hover:bg-opacity-80 text-dark-bg font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                    >
                         Let AI Plan
                    </button>
                </form>
            </div>

            {(isLoading || tasksToReview) && (
                 <div className="p-6 bg-dark-surface rounded-2xl shadow-lg mt-8">
                     <div className="flex items-center gap-3 mb-4">
                        <TargetIcon className="w-6 h-6 text-brand-secondary" />
                        <h3 className="text-lg font-bold text-dark-text-primary">Review AI Suggestions</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center gap-3 py-12 text-dark-text-secondary">
                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Decomposing your goal...</span>
                        </div>
                    ) : tasksToReview && (
                        <div className="space-y-3">
                            <p className="text-sm text-dark-text-secondary">Review the tasks below. Adjust the descriptions and effort scores (1-10) as needed before confirming.</p>
                            {tasksToReview.map((task, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input 
                                        type="text"
                                        value={task.subtask}
                                        onChange={(e) => handleUpdateReviewTask(index, 'subtask', e.target.value)}
                                        className="flex-grow bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary"
                                    />
                                    <input 
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={task.effort_score}
                                        onChange={(e) => handleUpdateReviewTask(index, 'effort_score', e.target.value)}
                                        className="w-20 bg-dark-bg border border-slate-700 rounded-lg px-3 py-2 text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary text-center"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={handleCancelReview} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleConfirmTasks} className="bg-brand-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Confirm & Add Tasks
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    </div>
  );
};

export default DecomposePage;