import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, Task } from './types';
import { calculateFlowRating } from './services/ApeService';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import DecomposePage from './pages/DecomposePage';
import HomePage from './pages/HomePage'; // Import the new Home Page
import CalendarPage from './pages/CalendarPage'; // Import the new Calendar Page
import TaskDetailModal from './components/TaskDetailModal';
import JugglingMeterDetailModal from './components/JugglingMeterDetailModal';
import PauseSuggestionModal from './components/PauseSuggestionModal';


// --- MOCK DATA ---
const initialProjects: Project[] = [
  { project_id: 'p1', name: 'Capstone Project', project_dna: 'Deep Work', impact_score: 5, current_status: 'Active', burnout_budget_usage: 40 },
  { project_id: 'p2', name: 'Hackathon Prep', project_dna: 'Burst Creativity', impact_score: 4, current_status: 'Active', burnout_budget_usage: 60 },
  { project_id: 'p3', name: 'Freelance Gig', project_dna: 'Client Communication', impact_score: 3, current_status: 'Active', burnout_budget_usage: 25 },
];

const initialTasks: Task[] = [
  { task_id: 't1', project_id: 'p1', description: 'Write Chapter 2 of Thesis on Advanced Machine Learning Techniques', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), effort_score: 8, flow_rating: 0, is_critical_path: true },
  { task_id: 't2', project_id: 'p2', description: 'Brainstorm main feature ideas and create user flow diagrams', deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), effort_score: 4, flow_rating: 0, is_critical_path: false },
  { task_id: 't3', project_id: 'p1', description: 'Gather and annotate the dataset for the primary experiment', deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), effort_score: 6, flow_rating: 0, is_critical_path: false },
  { task_id: 't4', project_id: 'p3', description: 'Client feedback implementation for the dashboard UI', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), effort_score: 7, flow_rating: 0, is_critical_path: true },
  { task_id: 't5', project_id: 'p2', description: 'Set up the initial repository and CI/CD pipeline', deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), effort_score: 5, flow_rating: 0, is_critical_path: false },
];
// --- END MOCK DATA ---

type Page = 'home' | 'dashboard' | 'projects' | 'tasks' | 'decompose' | 'calendar';
type TemplateTask = { subtask: string; effort_score: number };
type PauseSuggestion = { project: Project, effortReduction: number };

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isJugglingMeterModalOpen, setIsJugglingMeterModalOpen] = useState(false);
  const [tasksForDecomposition, setTasksForDecomposition] = useState<TemplateTask[] | undefined>(undefined);
  const [goalForDecomposition, setGoalForDecomposition] = useState<string | null>(null);
  const [pauseSuggestion, setPauseSuggestion] = useState<PauseSuggestion | null>(null);
  const [ignoreSuggestionToday, setIgnoreSuggestionToday] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{ taskId: string; startTime: number } | null>(null);


  const projectMap = useMemo(() => new Map<string, Project>(projects.map(p => [p.project_id, p])), [projects]);

  const updateAllFlowRatings = useCallback(() => {
    const availableEnergy = 7; // Using a stable baseline energy level

    setTasks(currentTasks => 
      currentTasks.map(task => {
        const project = projectMap.get(task.project_id);
        if (!project) return task;
        const newFlowRating = calculateFlowRating(task, project, availableEnergy);
        return { ...task, flow_rating: newFlowRating };
      })
    );
  }, [projectMap]);

  useEffect(() => {
    updateAllFlowRatings();
  }, [projects, updateAllFlowRatings]);

  const handleAddTasks = (newTasks: Omit<Task, 'task_id' | 'flow_rating'>[]) => {
      const availableEnergy = 7; // Stable baseline
      const tasksToAdd = newTasks.map((t, index) => {
        const project = projectMap.get(t.project_id);
        let flowRating = 0;
        if (project) {
          // Calculate flow rating immediately for the new task
          flowRating = calculateFlowRating({ ...t, task_id: '', flow_rating: 0 }, project, availableEnergy);
        }
        return {
          ...t,
          task_id: `t${Date.now() + index}`,
          flow_rating: flowRating,
        };
      });
      setTasks(prevTasks => [...prevTasks, ...tasksToAdd]);
  };
  
  const handleAddProject = (
    newProjectData: Omit<Project, 'project_id' | 'burnout_budget_usage'>,
    templateTasks?: TemplateTask[]
  ) => {
    const newProject: Project = {
        ...newProjectData,
        project_id: `p${Date.now()}`, // More robust ID
        burnout_budget_usage: 0,
    };
    setProjects(prevProjects => [...prevProjects, newProject]);

    if (templateTasks && templateTasks.length > 0) {
        setTasksForDecomposition(templateTasks);
        handleNavigate('decompose');
    }
  };
  
  const handleShowPauseSuggestion = useCallback(() => {
      if (pauseSuggestion || ignoreSuggestionToday) return;

      const activeProjects = projects.filter(p => p.current_status === 'Active');
      if (activeProjects.length <= 1) return;

      // Find the active project with the lowest impact score
      const lowestImpactProject = [...activeProjects].sort((a, b) => a.impact_score - b.impact_score)[0];
      
      const effortReduction = tasks
          .filter(t => t.project_id === lowestImpactProject.project_id)
          .reduce((sum, task) => sum + task.effort_score, 0);

      if (effortReduction > 0) {
        setPauseSuggestion({ project: lowestImpactProject, effortReduction });
      }
  }, [projects, tasks, pauseSuggestion, ignoreSuggestionToday]);
  
  const handlePauseProject = (projectId: string) => {
      setProjects(prevProjects => 
          prevProjects.map(p => 
              p.project_id === projectId ? { ...p, current_status: 'Paused' } : p
          )
      );
      setPauseSuggestion(null);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(currentTasks => currentTasks.filter(t => t.task_id !== taskId));
  };
  
  const handleIgnoreSuggestionForToday = () => {
      setIgnoreSuggestionToday(true);
      setPauseSuggestion(null);
  };
  
  const handleStartTimer = (taskId: string) => {
    if (activeTimer) {
      alert("Another task is already being timed. Please stop it first.");
      return;
    }
    setActiveTimer({ taskId, startTime: Date.now() });
  };

  const handleStopTimer = () => {
    if (activeTimer) {
      const duration = Date.now() - activeTimer.startTime;
      const seconds = Math.floor((duration / 1000) % 60);
      const minutes = Math.floor((duration / (1000 * 60)) % 60);
      const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      alert(`Focus session ended. Duration: ${hours}h ${minutes}m ${seconds}s`);
      setActiveTimer(null);
    }
  };


  const handleSelectTask = (task: Task) => setSelectedTask(task);
  const handleCloseModal = () => setSelectedTask(null);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    closeSidebar();
  };
  
  const handleDecomposeFromHome = (goal: string) => {
    setGoalForDecomposition(goal);
    handleNavigate('decompose');
  };
  
  const clearDecompositionInputs = () => {
      setTasksForDecomposition(undefined);
      setGoalForDecomposition(null);
  };

  const renderPage = () => {
    switch(currentPage) {
        case 'home':
            return <HomePage onDecomposeGoal={handleDecomposeFromHome} onNavigate={handleNavigate} onToggleSidebar={toggleSidebar} />;
        case 'dashboard':
            return <DashboardPage 
                        projects={projects}
                        tasks={tasks}
                        onSelectTask={handleSelectTask}
                        onToggleSidebar={toggleSidebar}
                        onOpenJugglingMeterModal={() => setIsJugglingMeterModalOpen(true)}
                        onShowPauseSuggestion={handleShowPauseSuggestion}
                        activeTimer={activeTimer}
                   />;
        case 'projects':
            return <ProjectsPage 
                        projects={projects} 
                        onToggleSidebar={toggleSidebar} 
                        onAddProject={handleAddProject}
                    />;
        case 'tasks':
            return <TasksPage tasks={tasks} projects={projects} projectMap={projectMap} onSelectTask={handleSelectTask} onToggleSidebar={toggleSidebar} activeTimer={activeTimer} />;
        case 'decompose':
            return <DecomposePage 
                        projects={projects} 
                        onAddTasks={handleAddTasks} 
                        onToggleSidebar={toggleSidebar} 
                        initialTasks={tasksForDecomposition}
                        initialGoal={goalForDecomposition}
                        onProcessingComplete={clearDecompositionInputs}
                    />;
        case 'calendar':
            return <CalendarPage
                        tasks={tasks}
                        projects={projects}
                        onSelectTask={handleSelectTask}
                        onToggleSidebar={toggleSidebar}
                    />;
        default:
             return <HomePage onDecomposeGoal={handleDecomposeFromHome} onNavigate={handleNavigate} onToggleSidebar={toggleSidebar} />;
    }
  }

  return (
    <div className="flex min-h-screen bg-dark-bg">
        <Sidebar 
            currentPage={currentPage} 
            onNavigate={handleNavigate} 
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
        />
        <main className="flex-1 min-w-0">
             {renderPage()}
        </main>
        {selectedTask && (
            <TaskDetailModal 
                task={selectedTask}
                project={projectMap.get(selectedTask.project_id)}
                onClose={handleCloseModal}
                activeTimer={activeTimer}
                onStartTimer={handleStartTimer}
                onStopTimer={handleStopTimer}
            />
        )}
        {isJugglingMeterModalOpen && (
            <JugglingMeterDetailModal
                tasks={tasks.filter(t => t.effort_score >= 7)}
                projects={projects}
                onClose={() => setIsJugglingMeterModalOpen(false)}
                onRemoveTask={handleRemoveTask}
            />
        )}
        {pauseSuggestion && (
            <PauseSuggestionModal
                suggestion={pauseSuggestion}
                onClose={handleIgnoreSuggestionForToday}
                onPauseProject={handlePauseProject}
            />
        )}
    </div>
  );
};

export default App;
