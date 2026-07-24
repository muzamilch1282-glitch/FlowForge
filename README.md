# FlowForge

FlowForge is a modern SaaS Project Management Dashboard designed for seamless team collaboration, project tracking, and workspace management.

## Features

- **Projects Dashboard**: Track your active, on-hold, and completed projects with progress bars and priority badges.
- **Workspaces**: Manage multiple workspaces and monitor their activity, project counts, and member limits.
- **Team Management**: Invite team members, view their status, and manage their roles within the workspace.
- **Profile Management**: Update your personal information and upload your avatar.
- **Settings**: Configure application preferences, including appearance (Light/Dark mode), notifications, and security.
- **Responsive Layout**: Works seamlessly across desktop and mobile devices.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: React Query

## Folder Structure

```
src/
├── app/                  # Next.js app router pages and layouts
│   └── dashboard/        # Dashboard feature routes (Projects, Workspace, Team, etc.)
├── components/           # Reusable React components
│   ├── dashboard/        # Feature-specific dashboard components
│   ├── layout/           # Layout components (Sidebar, Navbar)
│   ├── shared/           # Reusable UI elements (Button, Modal, etc.)
│   └── ui/               # Base UI components (Shadcn)
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── store/                # Global state (Zustand)
└── types/                # TypeScript type definitions
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd FlowForge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables (copy `.env.example` to `.env.local`).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
