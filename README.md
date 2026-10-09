# Maverick Healthcare
> **Enterprise-Grade Online Healthcare Management & Doctor Appointment Scheduling System**

Maverick Healthcare is a full-stack clinical management platform designed to connect patients, attending medical specialists, and hospital administrators. It features real-time appointment scheduling with zero double-booking conflict prevention, role-based dashboards, electronic medical records (EMR), and digital prescription management.

## Key System Features
- **Doctor Discovery & Filtering**: Search verified specialists by clinical department, medical qualification, experience, consultation fee, and hospital affiliation.
- **Zero Double-Booking Engine**: Real-time slot conflict prevention prevents concurrent reservations for the same practitioner time slot.
- **Role-Based Portals (RBAC)**:
  - **Patient Portal**: Instant appointment booking, clinical consultation history, digital prescriptions, and personal health dossier.
  - **Doctor Portal**: Daily schedule overview, patient consultation management, diagnosis logging, and digital prescription issuance.
  - **Admin Dashboard**: Hospital-wide operational metrics, practitioner credential onboarding, patient records, and operational configurations.
- **Digital EMR & Prescriptions**: Standardized clinical treatment plans, medication schedules (dosage, frequency, duration), and printable prescription slips.
- **Interactive Architecture Viewer**: Built-in modal demonstrating system components, database schemas, and REST controller flows.

## Technology Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite, Lucide React, Motion |
| **Active Backend** | Node.js (v22), Express 4.21, TSX, JSON Database (`data/careconnect_db.json`) |
| **Architecture** | Dual-Backend support with Spring Boot REST API specification |

## Demo Accounts (Quick Login Buttons Available in UI)
| Role | Email Address | Password | Account Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@careconnect.com` | `admin123` | System oversight, doctor onboarding, clinical stats |
| **Cardiologist** | `dr.rajesh@careconnect.com` | `doctor123` | Doctor dashboard, schedule, prescriptions |
| **Neurologist** | `dr.priya@careconnect.com` | `doctor123` | Doctor schedule, clinical consultations |
| **Patient** | `patient@careconnect.com` | `patient123` | Appointment booking, medical history, EMR |
