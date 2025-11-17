import React, { useState } from 'react';
import BrainCircuitIcon from '../components/icons/BrainCircuitIcon';
import ListChecksIcon from '../components/icons/ListChecksIcon';
import MenuIcon from '../components/icons/MenuIcon';
import CalendarIcon from '../components/icons/CalendarIcon';

interface HomePageProps {
  onDecomposeGoal: (goal: string) => void;
  onNavigate: (page: 'tasks' | 'calendar') => void;
  onToggleSidebar: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onDecomposeGoal, onNavigate, onToggleSidebar }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onDecomposeGoal(goal.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
       <button onClick={onToggleSidebar} className="absolute top-4 left-4 p-2 text-dark-text-secondary rounded-full hover:bg-dark-surface md:hidden">
        <MenuIcon className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-4 mb-6">
        <BrainCircuitIcon className="w-16 h-16 text-brand-primary" />
        <h1 className="text-6xl font-bold text-dark-text-primary tracking-tighter">juggler.io</h1>
      </div>
      <p className="text-dark-text-secondary text-lg mb-8 max-w-md">Your AI-powered cognitive management system.</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6">
        <div className="relative">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What would you like to do today?"
            className="w-full bg-dark-surface border-2 border-slate-700 rounded-full py-4 pl-6 pr-16 text-base text-dark-text-primary focus:ring-brand-secondary focus:border-brand-secondary focus:outline-none transition-colors"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-secondary hover:bg-opacity-80 text-white font-bold py-2.5 px-4 rounded-full transition-colors"
            aria-label="Decompose Goal"
          >
            Plan
          </button>
        </div>
      </form>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('tasks')}
          className="flex items-center gap-2 bg-dark-surface hover:bg-slate-800 text-dark-text-primary font-bold py-2 px-6 rounded-lg transition-colors border border-slate-700"
        >
          <ListChecksIcon className="w-5 h-5" />
          <span>View Today's Tasks</span>
        </button>
        <button 
          onClick={() => onNavigate('calendar')}
          className="flex items-center gap-2 bg-dark-surface hover:bg-slate-800 text-dark-text-primary font-bold py-2 px-6 rounded-lg transition-colors border border-slate-700"
        >
          <CalendarIcon className="w-5 h-5" />
          <span>Open Calendar</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
