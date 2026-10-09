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
  name: 'Verified Doctor',
  email: 'doctor@hospital.org',
  role: 'doctor',
  phone: '+1 (555) 019-2831',
  hospitalName: 'St. Jude General Hospital',
  licenseNumber: 'MD-92841-CA',
  city: 'Metro Medical Center',
  isVerified: true,
  isAuthenticated: true,
};

export const DEFAULT_PATIENT_USER: UserProfile = {
  id: 'guest-user',
  name: '',
  email: '',
  role: 'user',
  phone: '',
  bloodGroup: undefined,
  city: '',
  isVerified: false,
  activeMode: 'patient',
  isAuthenticated: false,
};

// Clean empty initial data (no pre-entered records)
export const INITIAL_PATIENT_REQUESTS: PatientRequest[] = [];

export const INITIAL_DONORS: DonorAvailability[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_GROUPS: DonorGroup[] = [];

export const INITIAL_MATCH: MatchRecord | null = null;
