import { ProjectDna } from '../types';

export interface ProjectTemplate {
    name: string;
    dna: ProjectDna;
    impact_score: number;
    tasks: {
        subtask: string;
        effort_score: number;
    }[];
}

export const projectTemplates: ProjectTemplate[] = [
    {
        name: 'Capstone Project',
        dna: 'Deep Work',
        impact_score: 5,
        tasks: [
            { subtask: 'Finalize research question and thesis statement', effort_score: 5 },
            { subtask: 'Conduct literature review and create annotated bibliography', effort_score: 8 },
            { subtask: 'Develop methodology and experimental design', effort_score: 7 },
            { subtask: 'Collect and process primary data', effort_score: 9 },
            { subtask: 'Analyze results and write discussion chapter', effort_score: 8 },
            { subtask: 'Draft introduction and conclusion chapters', effort_score: 6 },
            { subtask: 'Format citations and proofread entire document', effort_score: 4 },
        ],
    },
    {
        name: 'Hackathon Prep',
        dna: 'Burst Creativity',
        impact_score: 4,
        tasks: [
            { subtask: 'Brainstorm and validate core project idea', effort_score: 6 },
            { subtask: 'Define MVP features and user flow', effort_score: 5 },
            { subtask: 'Choose tech stack and set up development environment', effort_score: 4 },
            { subtask: 'Create basic UI/UX wireframes', effort_score: 5 },
            { subtask: 'Develop core backend logic/API endpoints', effort_score: 8 },
            { subtask: 'Build frontend components for the MVP', effort_score: 7 },
            { subtask: 'Prepare a 3-minute pitch deck and presentation', effort_score: 4 },
        ]
    },
    {
        name: 'New Feature Launch',
        dna: 'Research & Analysis',
        impact_score: 4,
        tasks: [
            { subtask: 'Conduct user research and gather requirements', effort_score: 6 },
            { subtask: 'Perform competitor analysis', effort_score: 5 },
            { subtask: 'Create technical specification document', effort_score: 7 },
            { subtask: 'Design UI mockups and prototypes', effort_score: 6 },
            { subtask: 'Develop and test the new feature', effort_score: 9 },
            { subtask: 'Plan and execute marketing campaign', effort_score: 7 },
        ]
    }
];
