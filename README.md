# LifeDrop — Blood Donation & Medical Appointments Platform

A responsive medical platform connecting verified hospitals, doctors, patients, and volunteer blood donors with real-time appointments and emergency matching.

## 🩸 Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router
- **Icons:** Lucide React
- **Palette:** Deep Navy (`#1F2A6B`), Light Lavender (`#E6E6F2`), Crimson Red (`#DC2626`)
- **Backend & Database:** Firebase Firestore ready with local persistence fallback

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
| **D1** | `/` | All (Entry) | Very First Page UI with 2-portal selection (Admin & Doctor vs Patient & User) |
| **D2** | `/doctor` | Doctor / Hospital | Doctor Dashboard for reviewing appointments, accepting with time slot picker, or cancelling |
| **U1** | `/auth` | User | Account creation & login with blood group selection |
| **U2** | `/home` | User | User Home with two large action cards (Patient Request & Donor Availability) |
| **U3.1** | `/patient-view` | User (Patient) | Available donors sorted by nearest location with direct request dispatch |
| **U3.2** | `/donor-view` | User (Donor) | Incoming patient blood requests with blood compatibility verification |
| **U4** | `/matching` | User | Live match tracker (Donor Found / Patient Matched) with ETA countdown & progress stepper |
| **U5** | `/groups` | User | Join blood donor groups or create new verified collectives |
| **U6** | `/appointments` | User | Request doctor consultation, blood tests, or reports; real-time dual sync with D2 |

## 💉 Core System Rules & Logic
1. **Strict 2-User Login (No In-Session Switching):**
   - **Doctor / Hospital Portal:** Verified login using email, password, and state medical license ID. Once signed in, doctors can only access the Doctor Dashboard (D2). There is no way to enter the User/Community portal without explicitly logging out.
   - **User / Community Portal:** Users sign in or register with name, phone, blood group, city, and password. Once signed in, users cannot access the Doctor portal without logging out.
2. **Zero Pre-entered Data & Clean Initial State:**
   - Starts with clean, empty databases. Users and doctors register actual records that persist in localStorage and sync with Firebase Firestore.
3. **Blood Compatibility Engine:**
   - Strict ABO and Rh factor compatibility matrix validation ensures donors only match with medically compatible recipients.
4. **Two-Way Clinical Sync:**
   - Appointments booked in U6 immediately appear in the D2 Doctor queue. When a doctor accepts and assigns a clinic time slot (or cancels), U6 reflects this in real-time.
5. **Firebase & Firestore Database Readiness:**
   - `src/services/db.ts`: Firestore backend operations (create, update, real-time `onSnapshot` subscriptions) for `patientRequests`, `donors`, `appointments`, `groups`, `matches`, and `users`.
