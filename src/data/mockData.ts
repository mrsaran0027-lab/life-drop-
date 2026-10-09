import {
  UserProfile,
  PatientRequest,
  DonorAvailability,
  Appointment,
  DonorGroup,
  MatchRecord,
} from '../types';

export const DEFAULT_DOCTOR_USER: UserProfile = {
  id: 'doc-user',
  name: 'Doctor Portal',
  email: '',
  role: 'doctor',
  phone: '',
  hospitalName: '',
  licenseNumber: '',
  city: '',
  isVerified: true,
};

export const DEFAULT_PATIENT_USER: UserProfile = {
  id: 'guest-user',
  name: 'Community User',
  email: '',
  role: 'user',
  phone: '',
  bloodGroup: undefined,
  city: '',
  isVerified: false,
  activeMode: 'patient',
};

// Clean empty initial data (no pre-entered records)
export const INITIAL_PATIENT_REQUESTS: PatientRequest[] = [];

export const INITIAL_DONORS: DonorAvailability[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_GROUPS: DonorGroup[] = [];

export const INITIAL_MATCH: MatchRecord | null = null;
