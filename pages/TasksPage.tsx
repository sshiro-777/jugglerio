import React, { useState, useEffect, useMemo } from 'react';
// Fix: Import ScheduledTask from the central types file.
import { Task, Project, ProjectDna, ScheduledTask } from '../types';
// Fix: Remove ScheduledTask import from geminiService as it's now imported from types.
import { generateDailySchedule } from '../services/geminiService';
import TargetIcon from '../components/icons/TargetIcon';
import MenuIcon from '../components/icons/MenuIcon';
import ScheduleTimetable from '../components/ScheduleTimetable';
import TimerIcon from '../components/icons/TimerIcon';

interface TasksPageProps {
  tasks: Task[];
  projects: Project[];
  projectMap: Map<string, Project>;
  onSelectTask: (task: Task) => void;
  onToggleSidebar: () => void;
  activeTimer: { taskId: string; startTime: number } | null;
}

const TaskRow: React.FC<{ 
    task: Task; 
    project: Project | undefined; 
    onSelectTask: (task: Task) => void;
    isTiming: boolean;
}> = ({ task, project, onSelectTask, isTiming }) => {
    return (
        <div className={`bg-dark-surface p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 transition-all ${isTiming ? 'ring-2 ring-brand-primary' : ''}`}>
            {isTiming && (
                <div className="flex-shrink-0" title="Timer is active for this task">
                    <TimerIcon className="w-5 h-5 text-brand-primary animate-pulse" />
                </div>
            )}
            <div className="flex-grow min-w-0 w-full">
                <p className="font-semibold text-dark-text-primary truncate" title={task.description}>{task.description}</p>
                <div className="flex items-center gap-2 text-sm text-dark-text-secondary mt-1">
                    <TargetIcon className="w-4 h-4" />
                    <span>{project?.name || 'Unknown Project'}</span>
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 w-full sm:w-auto border-t border-slate-700 sm:border-none pt-3 sm:pt-0">
                <div className="text-center">
                    <p className="text-xs text-dark-text-secondary">Flow</p>
                    <p className="text-xl font-bold text-brand-accent">{task.flow_rating}</p>
                </div>
                <button 
                    onClick={() => onSelectTask(task)}
                    className="bg-brand-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    View
                </button>
            </div>
        </div>
    );
};

const getProjectDnaColorClasses = (dna: ProjectDna) => {
    switch (dna) {
        case 'Deep Work': return { border: 'border-indigo-500', text: 'text-indigo-300' };
        case 'Burst Creativity': return { border: 'border-amber-500', text: 'text-amber-300' };
        case 'Research & Analysis': return { border: 'border-sky-500', text: 'text-sky-300' };
        case 'Client Communication': return { border: 'border-teal-500', text: 'text-teal-300' };
        case 'Routine Maintenance': return { border: 'border-slate-500', text: 'text-slate-300' };
        default: return { border: 'border-slate-500', text: 'text-slate-300' };
    }
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, projects, projectMap, onSelectTask, onToggleSidebar, activeTimer }) => {
  const [schedule, setSchedule] = useState<ScheduledTask[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const prioritySortedTasks = useMemo(() => [...tasks].sort((a, b) => b.flow_rating - a.flow_rating), [tasks]);
  
  const categorizedTasks = useMemo(() => {
    if (schedule) return [];

    const categories: Record<ProjectDna, Task[]> = {
        'Deep Work': [],
        'Burst Creativity': [],
        'Research & Analysis': [],
        'Client Communication': [],
        'Routine Maintenance': [],
    };

    prioritySortedTasks.forEach(task => {
        const project = projectMap.get(task.project_id);
        if (project && categories[project.project_dna]) {
            categories[project.project_dna].push(task);
        }
    });

    return Object.entries(categories)
        .map(([dna, tasks]) => ({ dna: dna as ProjectDna, tasks }))
        .filter(category => category.tasks.length > 0);

  }, [prioritySortedTasks, projectMap, schedule]);


  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    const tasksToSchedule = prioritySortedTasks.map(t => {
        const project = projectMap.get(t.project_id);
        return { ...t, project_dna: project?.project_dna };
    });

    const generatedSchedule = await generateDailySchedule(tasksToSchedule);
    setSchedule(generatedSchedule);
    setIsGenerating(false);
  };
  
  const handleClearSchedule = () => {
    setSchedule(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full h-full flex flex-col">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center">
            <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 mr-2 text-dark-text-secondary rounded-full hover:bg-dark-surface">
                <MenuIcon className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-dark-text-primary">Today's Tasks</h1>
                <p className="text-dark-text-secondary">{schedule ? "Your AI-generated schedule for the day." : "Your complete AI-prioritized task list."}</p>
            </div>
        </div>
        {!schedule ? (
          <button
              onClick={handleGenerateSchedule}
              disabled={isGenerating}
              className="bg-brand-primary hover:bg-opacity-80 text-dark-bg font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Plan...
                </>
              ) : (
                "Generate Today's Plan"
              )}
            </button>
        ) : (
             <button
              onClick={handleClearSchedule}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Clear Plan
            </button>
        )}
      </header>
      <main className="flex-grow min-h-0">
        {schedule ? (
            <ScheduleTimetable 
                tasks={tasks} 
                schedule={schedule}
                projectMap={projectMap}
                onSelectTask={onSelectTask}
            />
        ) : (
            <div className="space-y-8">
                {categorizedTasks.length > 0 ? (
                categorizedTasks.map(({ dna, tasks: categoryTasks }) => {
                    const colorClasses = getProjectDnaColorClasses(dna);
                    return(
                        <div key={dna}>
                            <h2 className={`text-lg font-bold mb-3 pl-2 border-l-4 ${colorClasses.border} ${colorClasses.text}`}>
                                {dna}
                            </h2>
                            <div className="space-y-3">
                                {categoryTasks.map(task => (
                                    <TaskRow 
                                        key={task.task_id} 
                                        task={task} 
                                        project={projectMap.get(task.project_id)}
                                        onSelectTask={onSelectTask}
                                        isTiming={activeTimer?.taskId === task.task_id}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })
                ) : (
                <div className="text-center py-16 bg-dark-surface rounded-lg">
                    <p className="text-dark-text-secondary">No active tasks. Add a goal to get started!</p>
                </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default TasksPage;
