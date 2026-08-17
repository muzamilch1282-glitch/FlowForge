<div align="center">
  <img src="public/favicon.ico" alt="FlowForge Logo" width="80" height="80" />
  <h1>FlowForge</h1>
  <p>A modern, high-performance SaaS Project Management Dashboard designed for seamless team collaboration, task tracking, and workspace management.</p>
</div>

---

## 🚀 Overview

FlowForge is a comprehensive project management platform built to help teams organize their work effortlessly. From high-level project tracking to day-to-day task management on a Kanban board, FlowForge provides all the tools you need to stay productive and aligned.

## ✨ Key Features

- **Workspace Management**: Create isolated workspaces, manage multiple teams, and monitor workspace activity in real-time.
- **Project Tracking**: Organize work into projects with real-time health indicators, progress tracking, and priority badges.
- **Kanban Boards**: Drag-and-drop task management with customizable columns for smooth workflows.
- **Task Calendar**: A dedicated calendar view to schedule deadlines and plan your upcoming sprints.
- **Team Collaboration**: Invite members via email, assign granular roles (Owner, Admin, Member), and manage permissions using Row-Level Security (RLS).
- **Authentication**: Fully integrated authentication flow (Sign Up, Sign In, Forgot Password) powered by Supabase.
- **Account & Security**: Complete profile management, appearance settings (Light/Dark mode), and secure account deletion.
- **Real-Time Data**: Live updates powered by Supabase Realtime—never refresh to see a teammate's changes.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: Shadcn UI & Lucide React Icons
- **State Management**: Zustand
- **Database & Auth**: Supabase (PostgreSQL)

## 📁 Folder Structure

```text
src/
├── app/                  # Next.js App Router (Pages, API routes, Layouts)
│   ├── (auth)/           # Authentication pages (Login, Register, Reset)
│   └── dashboard/        # Protected application routes
├── components/           # Reusable React components
│   ├── auth/             # Permission Guards and auth forms
│   ├── kanban/           # Drag-and-drop board components
│   ├── layout/           # Sidebar, Navbar, and Protected Layout wrappers
│   ├── shared/           # Reusable UI elements (Logo, Loading Spinners)
│   └── ui/               # Base Shadcn UI components
├── features/             # Feature-based logic and form components
├── hooks/                # Custom React hooks (Data fetching, Permissions, Auth)
├── lib/                  # Utilities (Supabase client, Tailwind merger)
├── services/             # Database and API services
├── store/                # Global state (Zustand)
└── types/                # TypeScript interfaces and type definitions
```

## 🚀 Getting Started

### Prerequisites

You will need a Supabase project set up. Ensure you have your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` ready.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/FlowForge.git
   cd FlowForge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file and add your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and fill in:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🛡️ CI/CD & Production

The repository is configured with a GitHub Actions CI pipeline (`.github/workflows/ci.yml`) that validates the build on every push. For production deployment:
1. Push your code to GitHub.
2. Import the repository into **Vercel**.
3. Add the Supabase environment variables in the Vercel project settings.
4. Deploy!

---

<div align="center">
  <i>Built with modern web technologies to forge a better workflow.</i>
</div>
