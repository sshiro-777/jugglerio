import React from 'react';
import { Task, Project, ProjectDna } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
  currentDate: Date;
  onSelectTask: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, projects, currentDate, onSelectTask }) => {
  const projectMap = new Map<string, Project>(projects.map(p => [p.project_id, p]));

  const getProjectDnaColor = (dna: ProjectDna = 'Deep Work') => {
    switch (dna) {
        case 'Deep Work': return 'bg-indigo-400';
        case 'Burst Creativity': return 'bg-amber-400';
        case 'Research & Analysis': return 'bg-sky-400';
        case 'Client Communication': return 'bg-teal-400';
        case 'Routine Maintenance': return 'bg-slate-400';
        default: return 'bg-slate-400';
    }
  };

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.deadline).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCells = () => {
    // Fix: Use React.ReactElement to avoid issues with the global JSX namespace.
    const cells: React.ReactElement[] = [];
    let day = 1;
    for (let i = 0; i < 6; i++) { // Max 6 weeks in a month view
      if (day > daysInMonth) break;
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          cells.push(<div key={`empty-start-${j}`} className="p-2 border-r border-b border-slate-700 h-28"></div>);
        } else if (day > daysInMonth) {
          cells.push(<div key={`empty-end-${j}`} className="p-2 border-r border-b border-slate-700 h-28"></div>);
        } else {
          const today = new Date();
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          const dateStr = new Date(year, month, day).toISOString().split('T')[0];
          const tasksForDay = tasksByDate[dateStr] || [];

          cells.push(
            <div key={day} className="p-2 border-r border-b border-slate-700 h-28 flex flex-col overflow-hidden">
              <span className={`font-bold ${isToday ? 'bg-brand-secondary text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>{day}</span>
              <div className="mt-1 flex-grow overflow-y-auto space-y-1">
                {tasksForDay.map(task => {
                   const project = projectMap.get(task.project_id);
                   return (
                     <button
                        key={task.task_id}
                        onClick={() => onSelectTask(task)}
                        className="w-full text-left text-xs p-1 rounded-md bg-dark-bg hover:bg-slate-800 flex items-center gap-1.5"
                     >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getProjectDnaColor(project?.project_dna)}`}></div>
                        <span className="truncate">{task.description}</span>
                     </button>
                   );
                })}
              </div>
            </div>
          );
          day++;
        }
      }
    }
    return cells;
  };

  return (
    <div className="bg-dark-surface rounded-2xl shadow-lg p-4">
      <div className="grid grid-cols-7 text-center font-bold text-dark-text-secondary border-b border-slate-700">
        {days.map(day => (
          <div key={day} className="p-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-t border-slate-700">
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarView;