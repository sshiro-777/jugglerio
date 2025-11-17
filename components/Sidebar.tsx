import React from 'react';
import LayoutDashboardIcon from './icons/LayoutDashboardIcon';
import TargetIcon from './icons/TargetIcon';
import ListChecksIcon from './icons/ListChecksIcon';
import SparklesIcon from './icons/SparklesIcon';
import XIcon from './icons/XIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import HomeIcon from './icons/HomeIcon';

type Page = 'home' | 'dashboard' | 'projects' | 'tasks' | 'decompose';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
      isActive
        ? 'bg-brand-secondary text-white'
        : 'text-dark-text-secondary hover:bg-dark-surface hover:text-dark-text-primary'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`fixed inset-y-0 left-0 w-64 bg-dark-surface p-4 flex flex-col z-40 transform transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <BrainCircuitIcon className="w-8 h-8 text-brand-primary" />
                <h1 className="text-2xl font-bold text-dark-text-primary">juggler.io</h1>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-dark-text-secondary rounded-full hover:bg-dark-bg md:hidden">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem
            icon={<HomeIcon className="w-5 h-5" />}
            label="Home"
            isActive={currentPage === 'home'}
            onClick={() => onNavigate('home')}
          />
          <NavItem
            icon={<LayoutDashboardIcon className="w-5 h-5" />}
            label="Dashboard"
            isActive={currentPage === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          <NavItem
            icon={<TargetIcon className="w-5 h-5" />}
            label="Projects"
            isActive={currentPage === 'projects'}
            onClick={() => onNavigate('projects')}
          />
          <NavItem
            icon={<ListChecksIcon className="w-5 h-5" />}
            label="Today's Tasks"
            isActive={currentPage === 'tasks'}
            onClick={() => onNavigate('tasks')}
          />
           <NavItem
            icon={<SparklesIcon className="w-5 h-5" />}
            label="Decompose Goal"
            isActive={currentPage === 'decompose'}
            onClick={() => onNavigate('decompose')}
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;