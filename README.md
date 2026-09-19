# Interactive 3D Portfolio

A highly interactive, modern web developer portfolio built with React and Vite. This application features a persistent 3D canvas background and restricts access to the main portfolio content behind a Supabase email authentication gate, providing a unique and secure visitor experience.

## Architecture Overview

```text
User Browser
    │
    ▼
┌──────────────────────────┐
│  React (App.jsx)         │  ← Manages Global State & Auth Sequence
└──────────┬───────────────┘
           │
    ┌──────┼───────────────────────┐
    ▼      ▼                       ▼
┌────────┐ ┌────────────────┐ ┌────────────────┐
│Supabase│ │ EmailGate (UI) │ │ Canvas         │
│Auth    │ │ (Login Form)   │ │ Background (3D)│
└───┬────┘ └──────┬─────────┘ └──────┬─────────┘
    │             │                  │
    ▼             ▼                  ▼
┌──────────────────────────────────────┐
│  Transition Animation (2s delay)     │ ← Renders 3D waving/walking animation
└──────────────┬───────────────────────┘
               ▼
┌──────────────────────────────────────┐
│  MainPortfolio (UI)                  │ ← Loads full portfolio content
└──────────────────────────────────────┘
```

## System Output

The portfolio application manages transitions between two primary states:

| State | Component | Output/Behavior |
|---|---|---|
| Unauthenticated | `EmailGate` | Displays a login overlay atop the 3D canvas; waits for Supabase session. |
| Transitioning | `animatingOut` | Triggers a 2-second 3D animation (e.g., character waving and walking off) before granting access. |
| Authenticated | `MainPortfolio` | Hides the login gate and renders the actual project galleries and resume data. |

## Directory Structure

```text
Portfolio/
├── index.html                  # Main HTML entry point
├── package.json                # Project metadata and NPM scripts
├── vite.config.js              # Vite bundler configuration
├── public/                     # Static assets (3D models, textures)
└── src/
    ├── App.jsx                 # Core routing and authentication logic
    ├── main.jsx                # React DOM renderer
    ├── lib/                    # Supabase client configuration
    ├── data/                   # JSON data for portfolio projects and skills
    └── components/
        ├── CanvasBackground.jsx # Persistent 3D Three.js/R3F environment
        ├── EmailGate.jsx       # Authentication UI overlay
        └── MainPortfolio.jsx   # Core portfolio rendering component
```

## How to Run

### 1. Prerequisites
- Node.js (v16+)
- A Supabase account and project (for authentication)

### 2. Install Dependencies

```bash
# Install node modules
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application

```bash
# Start the Vite development server
npm run dev
```

### 5. Usage
1. Open `http://localhost:5173`.
2. You will be greeted by the 3D Canvas Background and the `EmailGate`.
3. Provide an email or use the Mock Login to bypass authentication.
4. Watch the 2-second transition animation.
5. Explore the main portfolio content containing projects, achievements, and contact information.

## Key Design Decisions

1. **Email-Gated Access**: Leveraging Supabase Auth creates an exclusive feel for the portfolio while also allowing tracking of who views the resume.
2. **Persistent 3D Context**: The `CanvasBackground` is rendered at the root level outside the conditional UI blocks. This ensures the heavy 3D context isn't re-mounted or destroyed during the login transition, maintaining high performance and smooth visuals.
3. **Delayed State Updates for Animation**: When authentication succeeds, React state (`animatingOut`) artificially delays the mounting of `MainPortfolio` by 2000ms to allow the 3D character to play a "goodbye/welcome" animation, drastically improving UX.
