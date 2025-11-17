import { Task, Project } from '../types';

/**
 * AI Priority Engine (APE)
 * Calculates the Flow Rating for a given task.
 * A higher burnout budget usage slightly decreases the flow rating.
 */
export const calculateFlowRating = (task: Task, project: Project, available_energy: number): number => {
  if (!project) {
    return 0;
  }

  const daysToDeadline = Math.max(1, (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const { impact_score, burnout_budget_usage } = project;
  const { effort_score } = task;

  // Burnout factor penalizes tasks from projects that are consuming a lot of energy.
  // A usage of 100% adds a penalty of 10 to the denominator.
  const burnoutFactor = (burnout_budget_usage || 0) / 10;

  const denominator = daysToDeadline + available_energy + burnoutFactor;

  if (denominator === 0) {
    return Infinity; // Avoid division by zero, prioritize highly
  }

  const flowRating = (impact_score * effort_score) / denominator;
  
  return parseFloat(flowRating.toFixed(2));
};