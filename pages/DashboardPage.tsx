import React, { useEffect } from 'react';
import { Project, Task, JugglingMeterStatus } from '../types';
import JugglingMeter from '../components/JugglingMeter';
import CriticalFewList from '../components/CriticalFewList';
import MenuIcon from '../components/icons/MenuIcon';
import CognitiveLoadChart from '../components/CognitiveLoadChart';

interface DashboardPageProps {
  projects: Project[];
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onToggleSidebar: () => void;
  onOpenJugglingMeterModal: () => void;
  onShowPauseSuggestion: () => void;
  activeTimer: { taskId: string; startTime: number } | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ projects, tasks, onSelectTask, onToggleSidebar, onOpenJugglingMeterModal, onShowPauseSuggestion, activeTimer }) => {

  const activeProjectIds = new Set(projects.filter(p => p.current_status === 'Active').map(p => p.project_id));
  const activeTasks = tasks.filter(t => activeProjectIds.has(t.project_id));
  
  const totalEffort = activeTasks.reduce((sum, task) => sum + task.effort_score, 0);

  const getJugglingMeterStatus = (
    effortLoad: number
  ): JugglingMeterStatus => {
    if (effortLoad >= 30) return 'RED';
    if (effortLoad >= 15) return 'YELLOW';
    return 'GREEN';
  };
  
  const meterStatus = getJugglingMeterStatus(totalEffort);
  
  useEffect(() => {
    if (meterStatus === 'RED') {
        onShowPauseSuggestion();
    }
  }, [meterStatus, onShowPauseSuggestion]);

  // Mock data for the new chart
  const mockHistoricalLoad = [
    { day: 'Mon', load: 25 },
    { day: 'Tue', load: 32 },
    { day: 'Wed', load: 28 },
    { day: 'Thu', load: 35 },
    { day: 'Fri', load: 22 },
    { day: 'Sat', load: 10 },
    { day: 'Sun', load: 12 },
  ];


  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <header className="mb-8 flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 mr-2 text-dark-text-secondary rounded-full hover:bg-dark-surface">
            <MenuIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary">Dashboard</h1>
          <p className="text-dark-text-secondary">A high-level overview of your cognitive load and priorities.</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
           <JugglingMeter 
              status={meterStatus} 
              effortLoad={totalEffort}
              onOpenModal={onOpenJugglingMeterModal}
            />
        </div>
        <div className="lg:col-span-2">
          <CriticalFewList tasks={activeTasks} projects={projects} onSelectTask={onSelectTask} activeTimer={activeTimer} />
        </div>
        <div className="lg:col-span-3">
          <CognitiveLoadChart data={mockHistoricalLoad} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
