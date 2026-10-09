export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'doctor' | 'user';
export type UserMode = 'patient' | 'donor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  bloodGroup?: BloodGroup;
  city: string;
  isVerified: boolean;
  hospitalName?: string;
  licenseNumber?: string;
  activeMode?: UserMode;
}

export type UrgencyLevel = 'Emergency' | 'Urgent' | 'Standard';

export interface PatientRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  urgency: UrgencyLevel;
  location: string;
  city: string;
  contactNumber: string;
  notes?: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  createdAt: string;
  status: 'Open' | 'Pending Confirmation' | 'Matched' | 'Fulfilled' | 'Cancelled';
}

export interface DonorAvailability {
  id: string;
  donorName: string;
  bloodGroup: BloodGroup;
  lastDonationDate: string;
  availability: 'Immediate' | 'Today' | 'Within 24h';
  location: string;
  city: string;
  phone: string;
  distanceKm: number;
  lat: number;
  lng: number;
  isVerified: boolean;
  status: 'Available' | 'Requested' | 'Matched';
}

export type MatchStep = 1 | 2 | 3 | 4 | 5;

export interface MatchRecord {
  id: string;
  patientRequestId: string;
  donorId: string;
  patientName: string;
  donorName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  estimatedArrivalMins: number;
  receivingStatus: 'Verifying Compatibility' | 'Blood Screened & Packed' | 'In Transit' | 'Ready for Transfusion' | 'Transfusion Complete';
  arrivalStatus: 'Request Confirmed' | 'Donor En Route' | 'Arrived at Hospital' | 'Transfusion Active' | 'Complete';
  currentStep: MatchStep;
  matchedAt: string;
  patientPhone: string;
  donorPhone: string;
  vehicleInfo?: string;
}

export type AppointmentService = 'doctor consultation' | 'blood test' | 'report';
export type AppointmentStatus = 'Pending' | 'Accepted' | 'Cancelled';

export interface Appointment {
  id: string;
  userId: string;
  patientName: string;
  service: AppointmentService;
  requestedDate: string;
  requestedTime: string;
  notes: string;
  status: AppointmentStatus;
  acceptedTimeSlot?: string;
  doctorName?: string;
  department?: string;
  createdAt: string;
}

export interface DonorGroup {
  id: string;
  name: string;
  description: string;
  category: 'Emergency Vanguard' | 'Hospital Auxiliary' | 'Rare Blood Network' | 'Community Lifesavers';
  location: string;
  memberCount: number;
  isVerifiedOnly: boolean;
  isJoined?: boolean;
  leadCoordinator: string;
}

// ABO and Rh blood compatibility matrix
// donorGroup -> recipientGroup
export const isBloodCompatible = (donor: BloodGroup, recipient: BloodGroup): boolean => {
  const compatibilityMap: Record<BloodGroup, BloodGroup[]> = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'], // Universal recipient for donor AB+
  };

  return compatibilityMap[donor]?.includes(recipient) ?? false;
};
