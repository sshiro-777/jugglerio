import { GoogleGenAI, Type } from "@google/genai";
// Fix: Import ScheduledTask from the central types file.
import { Task, ProjectDna, ScheduledTask } from '../types';

const hasApiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY;

if (!hasApiKey) {
    console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: (hasApiKey ? process.env.API_KEY : "mock-key") as string });

interface DecomposedTask {
  subtask: string;
  effort_score: number;
}

// Fix: Removed local definition of ScheduledTask. It is now imported from ../types.ts.

const mockDecomposedTasks: DecomposedTask[] = [
    { subtask: "Set up project structure and boilerplate", effort_score: 3 },
    { subtask: "Design database schema for users and products", effort_score: 5 },
    { subtask: "Implement user authentication endpoints", effort_score: 7 },
    { subtask: "Develop the product listing UI", effort_score: 6 },
    { subtask: "Integrate payment gateway", effort_score: 8 },
];

const mockSchedule: ScheduledTask[] = [
    { task_id: 't1', start_time: '9:00 AM', duration_minutes: 90 },
    { task_id: 't3', start_time: '10:45 AM', duration_minutes: 75 },
    { task_id: 't5', start_time: '2:00 PM', duration_minutes: 60 },
    { task_id: 't2', start_time: '3:15 PM', duration_minutes: 45 },
    { task_id: 't4', start_time: '4:30 PM', duration_minutes: 60 },
];


/**
 * AI Task Decomposition Engine (ATDE)
 * Sends a high-level task description to Gemini Pro and gets a structured list of sub-tasks.
 */
export const decomposeTaskWithGemini = async (taskGoal: string): Promise<DecomposedTask[]> => {
    if (!hasApiKey) {
        console.log("Using mock ATDE response.");
        return new Promise(resolve => setTimeout(() => resolve(mockDecomposedTasks), 1000));
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User Input (Goal): "${taskGoal}"`,
            config: {
                systemInstruction: `You are an expert project planner and decomposition engine. Your task is to break down a high-level user goal into a list of smaller, actionable sub-tasks. For each sub-task, you must provide an estimated "Effort Score" on a scale of 1-10, where 1 is trivial and 10 is very difficult. Respond ONLY with the JSON output.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: "A list of decomposed sub-tasks.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            subtask: {
                                type: Type.STRING,
                                description: "A detailed description of the sub-task.",
                            },
                            effort_score: {
                                type: Type.NUMBER,
                                description: "The estimated difficulty of the sub-task from 1 to 10.",
                            },
                        },
                        required: ["subtask", "effort_score"],
                    },
                },
            },
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as DecomposedTask[];

    } catch (error) {
        console.error("Error calling Gemini API for task decomposition:", error);
        return mockDecomposedTasks;
    }
};

/**
 * AI Daily Scheduler
 * Generates a timed schedule for a list of tasks.
 */
export const generateDailySchedule = async (tasks: (Task & { project_dna?: ProjectDna })[]): Promise<ScheduledTask[]> => {
    if (!hasApiKey) {
        console.log("Using mock Schedule response.");
        return new Promise(resolve => setTimeout(() => resolve(mockSchedule.filter(st => tasks.some(t => t.task_id === st.task_id))), 1000));
    }

    const taskInput = tasks.map(t => ({
        task_id: t.task_id,
        description: t.description,
        effort_score: t.effort_score,
        project_dna: t.project_dna,
    }));

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Here is a JSON list of tasks for today, sorted by priority. Create a realistic and productive schedule. Key objective: Minimize context switching by grouping tasks with the same 'project_dna' into focused work blocks (e.g., a 'Deep Work' block, a 'Client Communication' block). Schedule high-effort tasks during peak focus times (e.g., morning). Base the duration on the effort score (e.g., effort 8-10: ~90 mins, 5-7: ~60 mins, 1-4: ~30 mins). Insert reasonable breaks between different blocks. Start the day at 9:00 AM. Tasks: ${JSON.stringify(taskInput)}`,
            config: {
                systemInstruction: "You are an expert productivity coach. Your task is to create an optimized daily schedule from a list of tasks that minimizes context switching. Respond ONLY with the JSON output.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: "An array of scheduled tasks for the day.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            task_id: { type: Type.STRING },
                            start_time: { type: Type.STRING, description: "e.g., '9:00 AM'" },
                            duration_minutes: { type: Type.NUMBER },
                        },
                        required: ["task_id", "start_time", "duration_minutes"],
                    },
                },
            },
        });
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as ScheduledTask[];
    } catch (error) {
        console.error("Error calling Gemini API for scheduling:", error);
        return mockSchedule.filter(st => tasks.some(t => t.task_id === st.task_id));
    }
};

/**
 * AI Draft Generator
 * Generates a text draft for a given task.
 */
export const generateTaskDraft = async (taskDescription: string): Promise<string> => {
    const mockDraft = `Based on the task "${taskDescription}", here is a starting point:\n\n### **Objective**\n\nClearly define the primary goal of this task.\n\n### **Key Sections**\n\n1.  **Introduction/Background:** Provide context.\n2.  **Core Content/Analysis:** The main body of the work.\n3.  **Conclusion/Summary:** Summarize the findings.\n\n### **Action Items**\n\n- [ ] Research item A.\n- [ ] Draft section 1.\n- [ ] ...`;

    if (!hasApiKey) {
        console.log("Using mock Draft response.");
        return new Promise(resolve => setTimeout(() => resolve(mockDraft), 1000));
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a concise, well-structured starter draft for the following task. The draft should be in Markdown format and include logical sections like an objective, key points, and initial action items. Task: "${taskDescription}"`,
            config: {
                systemInstruction: "You are a helpful productivity assistant. Your goal is to create a high-quality starting draft for a user's task to help them overcome writer's block.",
                // No response schema, as we want a freeform text response.
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for draft generation:", error);
        return mockDraft;
    }
};
