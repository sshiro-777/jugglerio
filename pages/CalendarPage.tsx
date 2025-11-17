import React, { useState } from 'react';
import { Task, Project } from '../types';
import CalendarView from '../components/CalendarView';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import MenuIcon from '../components/icons/MenuIcon';

interface CalendarPageProps {
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
  onToggleSidebar: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ tasks, projects, onSelectTask, onToggleSidebar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full h-full flex flex-col">
       <header className="mb-4 flex items-center flex-shrink-0">
         <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 mr-2 text-dark-text-secondary rounded-full hover:bg-dark-surface">
             <MenuIcon className="w-6 h-6" />
         </button>
         <div>
            <h1 className="text-3xl font-bold text-dark-text-primary">Calendar</h1>
            <p className="text-dark-text-secondary">A visual overview of your task deadlines.</p>
        </div>
       </header>
       <main className="flex-grow min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-dark-text-primary">{monthYearFormat.format(currentDate)}</h2>
            <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full bg-dark-surface hover:bg-slate-800 transition-colors" aria-label="Previous month">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button onClick={handleNextMonth} className="p-2 rounded-full bg-dark-surface hover:bg-slate-800 transition-colors" aria-label="Next month">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
         </div>
          <CalendarView 
            tasks={tasks} 
            projects={projects}
            currentDate={currentDate}
            onSelectTask={onSelectTask}
          />
       </main>
    </div>
  );
};

export default CalendarPage;