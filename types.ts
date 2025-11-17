export type ProjectDna = 
  | 'Deep Work' 
  | 'Burst Creativity' 
  | 'Research & Analysis' 
  | 'Routine Maintenance' 
  | 'Client Communication';
  
export type ProjectStatus = 'Active' | 'Paused' | 'Archived';

export interface Project {
  project_id: string;
  name: string;
  project_dna: ProjectDna;
  impact_score: number; // 1-5
  current_status: ProjectStatus;
  burnout_budget_usage: number; // Weekly percentage
}

export interface Task {
  task_id: string;
  project_id: string; // Foreign Key
  description: string;
  deadline: string; // ISO 8601 format
  effort_score: number; // AI-derived difficulty 1-10
  flow_rating: number; // The final dynamic priority score
  is_critical_path: boolean;
}

export interface EnergyLog {
  log_id: string;
  user_id: string;
  timestamp: string; // ISO 8601 format
  available_energy: number; // User input 1-10
  focus_debt_incurred: number; // Minutes
}

export type JugglingMeterStatus = 'RED' | 'YELLOW' | 'GREEN';

// Fix: Add and export the ScheduledTask interface to resolve import errors.
export interface ScheduledTask {
  task_id: string;
  start_time: string;
  duration_minutes: number;
}
