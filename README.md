# LifeDrop — Blood Donation & Medical Appointments Platform

A responsive medical platform connecting verified hospitals, doctors, patients, and volunteer blood donors with real-time geolocation matching and appointments management.

## 🩸 Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Palette:** Deep Navy (`#1F2A6B`), Light Lavender (`#E6E6F2`), Crimson Red (`#DC2626`)

## 🚀 Setup & Run Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (runs on port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## 🗺️ Application Architecture & Page Map

| Screen | Route | Role | Description |
|---|---|---|---|
| **D1** | `/` | All | Very First Page UI with role switch tabs and verified doctor/hospital login |
| **D2** | `/doctor` | Doctor / Hospital | Doctor Dashboard for reviewing appointments, accepting by time slot, or cancelling |
| **U1** | `/auth` | User | Account creation & login with blood group selection |
| **U2** | `/home` | User | User Home with two large action cards (Patient Request & Donor Availability) |
| **U3.1** | `/patient-view` | User (Patient) | Available donors sorted by nearest location with interactive radar map |
| **U3.2** | `/donor-view` | User (Donor) | Incoming patient blood requests with compatibility verification and map |
| **U4** | `/matching` | User | Live match tracker (Donor Found / Patient Matched) with coming time & progress stepper |
| **U5** | `/groups` | User | Join blood groups or create new collectives (verified users) |
| **U6** | `/appointments` | User | Request doctor consultation, blood tests, or reports; real-time dual sync with D2 |

## 💉 Core Features & Business Logic
1. **Role-Based Workflows:** Seamless toggling between Verified Doctor / Hospital mode and Patient / Donor mode.
2. **Blood Compatibility Engine:** Strict ABO and Rh factor compatibility matrix validation prevents incompatible blood transfusions.
3. **Two-Way Clinical Sync:** Appointments booked in U6 immediately propagate to D2; doctor acceptance with assigned time slot updates U6 instantly.
4. **Firebase & Firestore Database Integration:**
   - `firebase-blueprint.json`: Complete schema definition for collections: `patientRequests`, `donors`, `appointments`, `groups`, `matches`, and `users`.
   - `firestore.rules`: Production security rules with field validation and RBAC guards.
   - `src/services/db.ts`: Firestore backend operations (create, update, real-time `onSnapshot` subscriptions) with automatic local storage fallback.
5. **Pure HTML + Tailwind CSS + JavaScript Bundle:**
   - Located at `public/standalone.html`, this single file contains the entire application in pure HTML5, Tailwind CSS, and ES module JavaScript with direct Firebase CDN imports.
