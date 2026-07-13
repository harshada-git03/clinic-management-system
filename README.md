# Smart Clinic Management System

A full-stack, role-based clinic management platform built for small clinic teams — connecting appointment booking, visit records, prescriptions, and billing into a single traceable thread per patient visit.

Register as a Patient, Doctor, or Receptionist and each role gets a dedicated view: patients book and track their own visits, doctors manage the clinical side of a visit, and receptionists run the front desk — scheduling, confirming, and billing.

## Why this exists

Most small clinics run booking, prescriptions, and billing as three disconnected systems — a notebook at reception, handwritten prescriptions, and manual math at checkout. This project connects all three into one workflow: book, confirm, prescribe, bill — with every step tied back to the same appointment record.

## Tech stack

**Backend**
- Java 21, Spring Boot 3.3
- Spring Security with JWT authentication
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios

## Core workflow
Patient books appointment
|
v
Receptionist confirms the slot (queue token assigned)
|
v
Doctor logs visit notes and writes a prescription
|
v
Receptionist generates invoice (auto-calculated: consultation fee + prescribed medicines)
|
v
Payment recorded

## Roles and permissions

| Action | Patient | Doctor | Receptionist |
|---|---|---|---|
| Book appointments | Own only | Not permitted | Any patient |
| View patient records | Own only | View only | Full access |
| Edit patient records | Not permitted | Not permitted | Full access |
| Confirm or cancel appointments | Not permitted | Not permitted | Full access |
| Write prescriptions | Not permitted | Own appointments only | Not permitted |
| View prescriptions | Own only | Own appointments only | Not permitted |
| View invoices | Own only | Not permitted | Full access |
| Generate invoices | Not permitted | Not permitted | Full access |
| Manage medicine catalog | Not permitted | Not permitted | Full access |

Every permission above is enforced server-side with Spring Security's `@PreAuthorize`, plus ownership checks where relevant (e.g. a doctor can only prescribe for their own appointments, not another doctor's patient). Role checks in the frontend are UX only — the real security boundary is the API.

## Project structure
clinic-project/
├── clinic-backend/
│   └── src/main/java/com/clinic/
│       ├── entity/         # User, Patient, Doctor, Appointment, Prescription, Invoice, Medicine...
│       ├── repository/     # Spring Data JPA repositories
│       ├── service/        # Business logic
│       ├── controller/     # REST endpoints
│       ├── security/       # JWT filter, security config, user details service
│       ├── dto/             # Request/response DTOs
│       └── exception/      # Global exception handling
└── clinic-frontend/
└── src/
├── api/             # Axios instance with JWT interceptor
├── context/         # Auth context
├── routes/          # Protected route wrapper
└── pages/           # Login, Signup, Patient/Doctor/Receptionist dashboards

## API overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET / PUT | `/api/patients/me` | Patient |
| GET / PUT | `/api/patients/{id}` | Doctor (view), Receptionist |
| GET | `/api/doctors` | All roles |
| PUT | `/api/doctors/me` | Doctor |
| POST | `/api/appointments` | Patient |
| GET | `/api/appointments/me` | Patient, Doctor |
| GET | `/api/appointments` | Receptionist |
| PUT | `/api/appointments/{id}/status` | Receptionist, Doctor |
| POST | `/api/prescriptions` | Doctor (own appointments only) |
| GET | `/api/prescriptions/me` | Patient |
| GET | `/api/medicines` | Doctor, Receptionist |
| POST | `/api/medicines` | Receptionist |
| POST | `/api/invoices/generate/{appointmentId}` | Receptionist |
| PUT | `/api/invoices/{id}/pay` | Receptionist |
| GET | `/api/invoices/me` | Patient |

All authenticated endpoints require an `Authorization: Bearer <token>` header, obtained from login or register.

## Getting started

### Prerequisites
- Java 21
- Node.js 18+
- PostgreSQL 14+
- Maven

### Backend setup

```bash
cd clinic-backend

# Create a Postgres database
psql -U postgres -c "CREATE DATABASE clinic_db;"

# Copy the config template and fill in your local credentials
cp src/main/resources/application.properties.example src/main/resources/application.properties
# then edit application.properties with your Postgres password and a JWT secret (32+ characters)

## Database schema

Nine entities modeling the core relationships: `User` (one-to-one with `Patient` or `Doctor` depending on role) links to `Appointment` (references a `Patient` and `Doctor`), which links to `Prescription` (one-to-one with an `Appointment`, has many `PrescriptionItem` records referencing the `Medicine` catalog) and to `Invoice` (one-to-one with an `Appointment`, has many `InvoiceItem` records, auto-calculated from consultation fee plus prescribed medicines).

## What's intentionally out of scope

This project deliberately keeps the Doctor role limited to data management — patient records, appointment scheduling, and prescription record-keeping. There is no clinical decision-support logic, diagnostic reasoning, or medical advice generated anywhere in the system.

## Roadmap

- Doctor availability slots and conflict prevention on double-booking
- Swagger/OpenAPI documentation
- Unit and integration tests (JUnit, React Testing Library)
- Docker Compose for one-command local setup
- Email notifications on appointment confirmation

## Author

Harshada — [GitHub](https://github.com/harshada-git03)
