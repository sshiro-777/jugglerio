import React from 'react';
import { Task, Project, ProjectDna, ScheduledTask } from '../types';
import GoogleCalendarIcon from './icons/GoogleCalendarIcon';

interface ScheduleTimetableProps {
    tasks: Task[];
    schedule: ScheduledTask[];
    projectMap: Map<string, Project>;
    onSelectTask: (task: Task) => void;
}

const timeToMinutes = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0; // Midnight case
    return hours * 60 + minutes;
};

const getProjectDnaColor = (dna: ProjectDna = 'Deep Work') => {
    switch (dna) {
        case 'Deep Work': return 'bg-indigo-600 border-indigo-400';
        case 'Burst Creativity': return 'bg-amber-600 border-amber-400';
        case 'Research & Analysis': return 'bg-sky-600 border-sky-400';
        case 'Client Communication': return 'bg-teal-600 border-teal-400';
        case 'Routine Maintenance': return 'bg-slate-600 border-slate-400';
        default: return 'bg-slate-600 border-slate-400';
    }
}

const ScheduleTimetable: React.FC<ScheduleTimetableProps> = ({ tasks, schedule, projectMap, onSelectTask }) => {
    const START_HOUR = 8;
    const END_HOUR = 18;
    const PIXELS_PER_MINUTE = 1.5;

    const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);
    const taskMap = new Map(tasks.map(t => [t.task_id, t]));

    const createGoogleCalendarLink = (task: Task, scheduleInfo: ScheduledTask) => {
        if (!scheduleInfo) return '#';
        const project = projectMap.get(task.project_id);
        const title = encodeURIComponent(task.description);
        const details = encodeURIComponent(`Project: ${project?.name || 'N/A'}\n\nThis task is managed in juggler.io.`);
        
        const now = new Date();
        const startTimeStr = scheduleInfo.start_time;
        const [time, modifier] = startTimeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        const endDate = new Date(startDate.getTime() + scheduleInfo.duration_minutes * 60000);
        
        const formatForGoogle = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');
        const dates = `${formatForGoogle(startDate)}/${formatForGoogle(endDate)}`;

        return `https://calendar.google.com/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
    };

    // Fix: Refactor task mapping to use a type guard, ensuring the 'task' variable is correctly typed.
    // This resolves issues where the TypeScript compiler fails to infer the type of `task` within the map callback.
    const scheduledItems = schedule
        .map(scheduleInfo => ({
            scheduleInfo,
            task: taskMap.get(scheduleInfo.task_id),
        }))
        .filter((item): item is { scheduleInfo: ScheduledTask; task: Task } => Boolean(item.task));

    return (
        <div className="bg-dark-surface rounded-lg p-4 h-full overflow-y-auto">
            <div className="relative">
                {/* Hour markers and lines */}
                {hours.map(hour => (
                    <div key={hour} className="h-[90px] flex" style={{ height: `${60 * PIXELS_PER_MINUTE}px` }}>
                        <div className="w-16 text-right pr-2 text-xs text-dark-text-secondary -translate-y-2">
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                        </div>
                        <div className="flex-1 border-t border-slate-700"></div>
                    </div>
                ))}

                {/* Scheduled tasks */}
                {scheduledItems.map(({ scheduleInfo, task }) => {
                    const project = projectMap.get(task.project_id);
                    const top = (timeToMinutes(scheduleInfo.start_time) - (START_HOUR * 60)) * PIXELS_PER_MINUTE;
                    const height = scheduleInfo.duration_minutes * PIXELS_PER_MINUTE;

                    return (
                        <div
                            key={task.task_id}
                            className={`absolute left-16 right-0 p-2 rounded-lg border-l-4 overflow-hidden ${getProjectDnaColor(project?.project_dna)}`}
                            style={{ top: `${top}px`, height: `${height}px` }}
                        >
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <p className="font-bold text-sm text-dark-text-primary truncate">{task.description}</p>
                                    <p className="text-xs text-dark-text-secondary">{project?.name}</p>
                                </div>
                                <div className="flex justify-end gap-2 items-center">
                                     <a 
                                        href={createGoogleCalendarLink(task, scheduleInfo)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        title="Add to Google Calendar" 
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                                    >
                                        <GoogleCalendarIcon className="w-4 h-4" />
                                    </a>
                                    <button 
                                        onClick={() => onSelectTask(task)}
                                        className="bg-black/20 hover:bg-black/40 text-white text-xs font-bold py-1 px-3 rounded-full transition-colors"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleTimetable;