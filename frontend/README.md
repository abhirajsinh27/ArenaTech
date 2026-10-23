# ArenaTech Gujarat — Project Specification

## Project objective
Build a SportsTech and sports-infrastructure platform connecting sports enthusiasts, facility owners, athletes, coaches, event organizers, and administrators across Gujarat.

## Technology stack
- Frontend: React, Vite, Tailwind CSS, React Router, lucide-react
- Backend: Python FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy
- Database migrations: Alembic

## Functional modules
1. Authentication and user profiles
2. Personalized dashboard
3. Sports facility discovery and management
4. Facility availability and bookings
5. Sports events and tournament registration
6. Athlete, coach, and training workflows
7. Notifications and recent activity
8. Administrative management and audit logs

## User roles
- normal_user: discover facilities, book venues, register for events
- athlete: athlete-specific profile and training features
- coach: assigned athletes and training management
- venue_manager: assigned facility management and bookings
- admin: user management, role assignments, approvals, and moderation

Every new account receives the normal_user role. Role assignments are controlled by authorized backend operations.

## Core database entities
User, Facility, FacilityImage, FacilityAvailability, Booking, SportEvent, EventRegistration, CoachProfile, AthleteProfile, TrainingSession, Notification, and AuditLog.

The final schema must define foreign keys, ownership relationships, uniqueness constraints, indexes, booking conflict prevention, and appropriate status fields.

## Core API groups
- /api/auth
- /api/users
- /api/facilities
- /api/facilities/{id}/availability
- /api/bookings
- /api/events
- /api/notifications
- /api/admin

Exact request and response schemas must be documented before each module is implemented.

## Quality requirements
- Backend-enforced authentication and authorization
- Secure session handling and password hashing
- Alembic-managed schema changes
- Validation and consistent error responses
- Booking conflict prevention and database integrity
- Responsive, accessible frontend
- Automated tests for permissions and critical workflows
- Environment-based configuration, logging, and deployment documentation

## Implementation policy
Build each module to its agreed requirements and integrate it into the same project. Avoid throwaway prototypes, duplicate database connections, unnecessary folders, and unplanned architectural rewrites. Validate major design decisions with the project tutor before implementing dependent modules.

## Acceptance criteria
The project is considered complete when users can complete the agreed workflows end to end, unauthorized operations are rejected by the backend, database constraints preserve integrity, critical paths are tested, and deployment instructions are documented.
