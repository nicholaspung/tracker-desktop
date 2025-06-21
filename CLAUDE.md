# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Wails Desktop App
- `wails dev` - Start development server with hot reload
- `wails build` - Build production desktop application

### Frontend (React + Vite)
```bash
cd frontend
npm install      # Install dependencies
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Go Backend
- `go mod tidy` - Clean up Go dependencies
- `go run .` - Run the Go backend directly

## Architecture Overview

This is a **Wails v2 desktop application** combining:
- **Go backend** (`app.go`, `main.go`) with embedded PocketBase database
- **React frontend** (`frontend/`) using Vite, Cloudscape Design System, and Tailwind CSS

### Key Architecture Decisions

**Local-First Design**: The app is designed to work entirely offline by default. Data syncing to external servers is an optional paid feature that maintains local-first principles.

**Embedded Database**: PocketBase is embedded as a binary (`pocketbase.exe`) and auto-started when the app launches, providing a local SQLite database with REST API.

**State Management**: Uses Zustand for global state management (`frontend/src/store/useStore.js`).

### Frontend Structure

**UI Framework**: Cloudscape Design System components with Tailwind CSS for styling

**Key Directories**:
- `components/` - Reusable UI components including modals, forms, tables
- `routes/` - Main page components (home, tasks, health, wealth, applications, inventory)
- `screens/` - Sub-page components (habits, dailies, body composition, finance)
- `lib/` - Business logic and API calls
- `utils/` - Utility functions for data processing, dates, math
- `hooks/` - Custom React hooks (theme, modal, flashbar)

**Routing**: React Router DOM with routes defined in `lib/routes.js`

### Backend Structure

**Go Application**: Minimal Wails app that primarily starts and manages the embedded PocketBase instance. The main business logic resides in the frontend, with PocketBase handling data persistence.

**Data Flow**: Frontend ↔ PocketBase REST API ↔ Local SQLite database

### Key Features

The app appears to be a personal tracking system with modules for:
- Task management (habits, dailies) with calendar integration
- Health tracking (body composition)
- Finance tracking (balances, logs)
- Inventory management
- Application usage tracking

### Development Notes

- Frontend uses ESLint with Airbnb config for code standards
- React Query (`@tanstack/react-query`) for server state management
- PapaParse for CSV handling
- Custom hooks for common UI patterns (modals, themes, flashbars)