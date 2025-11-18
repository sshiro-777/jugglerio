Juggler.io is an innovative, AI-powered Cognitive Management System built on the Gemini API and designed for high-achievers juggling complex, concurrent projects like academic requirements (Capstone, FYP) and intense sprints (Hackathons). It is not just a to-do list; it's a specialized autopilot that actively protects the user’s attention and energy.

The Main Selling Point of jugglerio is its ability to eliminate the decision fatigue and context-switching that lead to burnout.

The app's core intelligence is driven by two integrated AI engines:

AI Priority Engine (APE): This engine constantly recalculates the Flow Rating for every task globally. The formula dynamically weights project Impact Score, AI-estimated Effort Score (difficulty), and the user's reported Available Energy against the deadline. This guarantees the user is always working on the single most valuable task for their current mental state.

AI Task Decomposition Engine (ATDE): To eliminate planning friction, the user inputs a high-level goal, and the ATDE instantly generates a structured, actionable subtask list with estimated Effort Scores. It performs an immediate Deadline Realism Check to warn the user if the new scope compromises the project timeline.

The Juggling Meter is the signature visual feature, displaying Cognitive Load in real-time. It tracks Focus-Debt (the time penalty incurred from rapid context switching) and Q1 task volume. When the meter hits RED, it prompts immediate corrective action, such as using the Project Suspension Toggle to restore balance.

Further innovative tools include the Cognitive Creation Suite, which integrates document search (Project Brain) with Genius Draft (AI writing) to accelerate documentation using factually sourced content. Context-Aware Scheduling blocks tasks based on energy profiles, ensuring Deep Work is protected and Recovery Blocks are scheduled post-Hackathon. jugglerio transforms project chaos into a streamlined, strategic workflow. 

Application demo: https://juggler-io-631496734018.us-west1.run.app 
## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
