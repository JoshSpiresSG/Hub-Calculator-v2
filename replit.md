# Drone ROI Calculator

## Overview

This is a fullstack web application for calculating the Return on Investment (ROI) of remote drone platforms versus manual drone operations. The application allows users to input various parameters related to their drone operations and provides detailed cost comparisons and analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern client-server architecture:

1. **Frontend**: React-based SPA (Single Page Application) using Vite as the build tool
2. **Backend**: Node.js Express server
3. **Database**: PostgreSQL with Drizzle ORM for database operations
4. **API Layer**: RESTful API endpoints for calculations
5. **UI Framework**: ShadCN UI components based on Radix UI primitives
6. **Styling**: TailwindCSS for styling

The application is structured with clear separation between client, server, and shared code:

- `/client`: React frontend code
- `/server`: Express backend code
- `/shared`: Code shared between frontend and backend (schemas, types)

## Key Components

### Frontend

1. **Calculator Form**: Collects user input parameters related to drone operations
2. **Calculator Results**: Displays cost comparison, charts, and ROI analysis
3. **UI Components**: Leverages ShadCN/Radix UI for consistent, accessible components
4. **React Query**: Manages server state, caching, and API requests

### Backend

1. **Express Server**: Handles HTTP requests and serves the frontend in production
2. **API Routes**: Processes calculation requests and returns results
3. **Database Integration**: Uses Drizzle ORM for database operations

### Shared

1. **Schema Definitions**: Zod schemas for validation across frontend and backend
2. **Type Definitions**: TypeScript types shared between client and server

## Data Flow

1. User inputs parameters into the Calculator Form
2. Form data is validated using Zod schemas
3. Data is sent to the server via a POST request to `/api/calculate`
4. Server validates the input data
5. Calculation logic processes the data and generates results
6. Results are returned to the client as JSON
7. Client displays the results with charts and formatted data

The application includes fallback client-side calculations if the server request fails.

## External Dependencies

### Frontend

1. **React**: UI library
2. **TailwindCSS**: Utility-first CSS framework
3. **ShadCN/Radix UI**: Accessible UI component library
4. **React Query**: Data fetching and state management
5. **React Hook Form**: Form management
6. **Zod**: Schema validation
7. **Recharts**: Chart visualization

### Backend

1. **Express**: Web server framework
2. **Drizzle ORM**: Database ORM
3. **Zod**: Input validation

## Database Schema

The application uses a PostgreSQL database with Drizzle ORM. The primary schema includes:

1. **Users Table**: For authentication (though not fully implemented)
2. **No persistent storage for calculations**: Calculations are performed on-the-fly and not stored in the database

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Development Mode**: `npm run dev` - Uses Vite's development server with HMR
2. **Production Build**: `npm run build` - Bundles frontend with Vite and backend with esbuild
3. **Production Start**: `npm run start` - Runs the production build

The deployment uses:
- Node.js 20 module
- PostgreSQL 16 module
- Port 5000 for local development (mapped to port 80 for external access)

## Development Considerations

1. **Database Setup**: The app requires setting up a PostgreSQL database with the `DATABASE_URL` environment variable
2. **Schema Migrations**: Use `npm run db:push` to push schema changes to the database
3. **Type Safety**: The application leverages TypeScript for end-to-end type safety

## Recent Changes

### January 2025
- **Field Update**: Replaced FIFO roster dropdown with flexible "Frequency of Operation" number input (default: 2)
  - User can now input any frequency value instead of being limited to preset roster options
  - Travel cost calculation now uses frequency multiplier: if frequency=1, includes cost for going to and returning from operation
  - Higher frequencies reduce relative travel costs per operation

## Feature Expansion

Potential areas for expansion:

1. **User Authentication**: The schema includes user tables, but implementation is minimal
2. **Saving Calculations**: Allow users to save and revisit previous calculations
3. **More Detailed Analysis**: Add additional metrics and visualizations
4. **Reporting**: Add PDF export of calculation results
5. **Multi-user Teams**: Allow organizations to share calculation data