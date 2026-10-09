import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  UserMode,
  PatientRequest,
  DonorAvailability,
  Appointment,
  DonorGroup,
  MatchRecord,
  MatchStep,
  BloodGroup,
  isBloodCompatible,
} from '../types';
import {
  DEFAULT_DOCTOR_USER,
  DEFAULT_PATIENT_USER,
} from '../data/mockData';
import {
  PatientRequestsDB,
  DonorsDB,
  AppointmentsDB,
  GroupsDB,
  MatchesDB,
} from '../services/db';
import { isFirebaseConfigured } from '../services/firebase';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: UserProfile;
  patientRequests: PatientRequest[];
  donors: DonorAvailability[];
  appointments: Appointment[];
  groups: DonorGroup[];
  activeMatch: MatchRecord | null;
  toasts: ToastMessage[];

  // User & Role actions
  switchUserRole: (targetRole: UserRole) => void;
  setCurrentUser: (user: UserProfile) => void;
  setUserMode: (mode: UserMode) => void;
  loginDoctor: (emailOrId: string, facilityId?: string, doctorName?: string) => boolean;
  loginUser: (email: string) => boolean;
  signupUser: (details: {
    name: string;
    phone: string;
    bloodGroup: BloodGroup;
    city: string;
  }) => void;
  logout: () => void;

  // Patient / Donor actions
  addPatientRequest: (req: Omit<PatientRequest, 'id' | 'createdAt' | 'status' | 'lat' | 'lng'>) => string;
  addDonorAvailability: (donor: Omit<DonorAvailability, 'id' | 'distanceKm' | 'lat' | 'lng' | 'isVerified' | 'status'>) => string;
  requestDonorForPatient: (donorId: string, patientRequestId?: string) => void;
  acceptPatientAsDonor: (patientRequestId: string, donorId?: string) => { success: boolean; message: string };
  updateMatchStep: (step: MatchStep) => void;

  // Appointments (shared between U6 and D2)
  createAppointment: (apt: Omit<Appointment, 'id' | 'userId' | 'status' | 'createdAt'>) => string;
  updateAppointmentStatus: (
    id: string,
    status: 'Accepted' | 'Cancelled',
    acceptedTimeSlot?: string
  ) => void;

  // Groups
  createGroup: (name: string, description: string, category?: DonorGroup['category']) => boolean;
  toggleJoinGroup: (groupId: string) => void;

  // Feedback
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Version 2 storage keys ensuring clean state without pre-entered demo records
const STORAGE_KEYS = {
  USER: 'lifedrop_v2_current_user',
  REQUESTS: 'lifedrop_v2_patient_requests',
  DONORS: 'lifedrop_v2_donors',
  APPOINTMENTS: 'lifedrop_v2_appointments',
  GROUPS: 'lifedrop_v2_groups',
  MATCH: 'lifedrop_v2_active_match',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PATIENT_USER;
  });

  const [patientRequests, setPatientRequests] = useState<PatientRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [donors, setDonors] = useState<DonorAvailability[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DONORS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [groups, setGroups] = useState<DonorGroup[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GROUPS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeMatch, setActiveMatch] = useState<MatchRecord | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MATCH);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(patientRequests));
  }, [patientRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  // Real-time Firestore sync when live Firebase credentials exist
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubReqs = PatientRequestsDB.subscribe((data) => {
      if (data && data.length > 0) setPatientRequests(data);
    });
    const unsubDonors = DonorsDB.subscribe((data) => {
      if (data && data.length > 0) setDonors(data);
    });
    const unsubApts = AppointmentsDB.subscribe((data) => {
      if (data && data.length > 0) setAppointments(data);
    });
    const unsubGroups = GroupsDB.subscribe((data) => {
      if (data && data.length > 0) setGroups(data);
    });

    return () => {
      if (unsubReqs) unsubReqs();
      if (unsubDonors) unsubDonors();
      if (unsubApts) unsubApts();
      if (unsubGroups) unsubGroups();
    };
  }, []);

  useEffect(() => {
    if (activeMatch) {
      localStorage.setItem(STORAGE_KEYS.MATCH, JSON.stringify(activeMatch));
    } else {
      localStorage.removeItem(STORAGE_KEYS.MATCH);
    }
  }, [activeMatch]);

  const addToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
  };

  const switchUserRole = (targetRole: UserRole) => {
    if (targetRole === 'doctor') {
      setCurrentUserState((prev) => ({
        ...prev,
        role: 'doctor',
        name: prev.name && prev.name !== 'Community User' ? prev.name : 'Doctor / Hospital Admin',
        isVerified: true,
      }));
      addToast('Switched to Doctor Mode', 'Viewing Doctor / Hospital portal', 'info');
    } else {
      setCurrentUserState((prev) => ({
        ...prev,
        role: 'user',
        name: prev.name && prev.name !== 'Doctor / Hospital Admin' ? prev.name : 'User',
      }));
      addToast('Switched to User Mode', 'Viewing Patient / Donor portal', 'info');
    }
  };

  const setUserMode = (mode: UserMode) => {
    setCurrentUserState((prev) => ({ ...prev, activeMode: mode }));
  };

  const loginDoctor = (emailOrId: string, facilityId?: string, doctorName?: string) => {
    const docUser: UserProfile = {
      id: 'doc-' + Date.now().toString(36),
      name: doctorName || (emailOrId ? emailOrId.split('@')[0] : 'Verified Doctor'),
      email: emailOrId,
      role: 'doctor',
      phone: '',
      hospitalName: facilityId ? `Facility #${facilityId}` : 'Hospital Center',
      licenseNumber: facilityId || '',
      city: '',
      isVerified: true,
    };
    setCurrentUserState(docUser);
    addToast('Verified Doctor Portal Access', `Signed in as ${docUser.name}`, 'success');
    return true;
  };

  const loginUser = (email: string) => {
    const user: UserProfile = {
      id: 'user-' + Date.now().toString(36),
      name: email ? email.split('@')[0] : 'User',
      email,
      role: 'user',
      phone: '',
      city: '',
      isVerified: true,
      activeMode: 'patient',
    };
    setCurrentUserState(user);
    addToast('Signed In', `Welcome back, ${user.name}`, 'success');
    return true;
  };

  const signupUser = (details: {
    name: string;
    phone: string;
    bloodGroup: BloodGroup;
    city: string;
  }) => {
    const newUser: UserProfile = {
      id: 'user-' + Date.now().toString(36),
      name: details.name,
      email: `${details.name.toLowerCase().replace(/\s+/g, '.')}@lifedrop.org`,
      role: 'user',
      phone: details.phone,
      bloodGroup: details.bloodGroup,
      city: details.city,
      isVerified: true,
      activeMode: 'patient',
    };
    setCurrentUserState(newUser);
    addToast('Account Created Successfully', `Registered as ${newUser.bloodGroup} user`, 'success');
  };

  const logout = () => {
    setCurrentUserState(DEFAULT_PATIENT_USER);
    addToast('Signed Out', 'Returned to landing page', 'info');
  };

  // Add Patient Request (from U2)
  const addPatientRequest = (req: Omit<PatientRequest, 'id' | 'createdAt' | 'status' | 'lat' | 'lng'>): string => {
    const id = 'req-' + Date.now().toString(36);
    const newReq: PatientRequest = {
      ...req,
      id,
      createdAt: new Date().toISOString(),
      status: 'Open',
      lat: 0,
      lng: 0,
      distanceKm: req.distanceKm ?? 1.5,
    };

    setPatientRequests((prev) => [newReq, ...prev]);
    PatientRequestsDB.create(newReq);
    addToast(
      'Blood Request Published!',
      `${newReq.units} unit(s) of ${newReq.bloodGroup} requested at ${newReq.hospital}`,
      'success'
    );
    return id;
  };

  // Add Donor Availability (from U2)
  const addDonorAvailability = (
    donorData: Omit<DonorAvailability, 'id' | 'distanceKm' | 'lat' | 'lng' | 'isVerified' | 'status'>
  ): string => {
    const id = 'donor-' + Date.now().toString(36);
    const newDonor: DonorAvailability = {
      ...donorData,
      id,
      distanceKm: 1.2,
      lat: 0,
      lng: 0,
      isVerified: true,
      status: 'Available',
    };

    setDonors((prev) => [newDonor, ...prev]);
    DonorsDB.create(newDonor);
    addToast(
      'Donor Availability Registered!',
      `Thank you ${newDonor.donorName}. Ready to assist emergency requests.`,
      'success'
    );
    return id;
  };

  // Patient requests a donor (from U3.1)
  const requestDonorForPatient = (donorId: string, patientRequestId?: string) => {
    const targetDonor = donors.find((d) => d.id === donorId);
    if (!targetDonor) return;

    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, status: 'Requested' } : d))
    );

    addToast(
      'Request Sent',
      `Direct notification sent to donor ${targetDonor.donorName} (${targetDonor.bloodGroup})`,
      'info'
    );
  };

  // Donor accepts a patient request (from U3.2) -> creates matching!
  const acceptPatientAsDonor = (
    patientRequestId: string,
    donorId?: string
  ): { success: boolean; message: string } => {
    const patientReq = patientRequests.find((p) => p.id === patientRequestId);
    if (!patientReq) {
      return { success: false, message: 'Patient request not found.' };
    }

    let activeDonor = donorId ? donors.find((d) => d.id === donorId) : undefined;
    if (!activeDonor) {
      if (currentUser.bloodGroup) {
        activeDonor = {
          id: currentUser.id,
          donorName: currentUser.name || 'Anonymous Donor',
          bloodGroup: currentUser.bloodGroup,
          lastDonationDate: new Date().toISOString().split('T')[0],
          availability: 'Immediate',
          location: currentUser.city || 'Local Area',
          city: currentUser.city || 'Local Area',
          phone: currentUser.phone || '',
          distanceKm: 1.5,
          lat: 0,
          lng: 0,
          isVerified: currentUser.isVerified,
          status: 'Available',
        };
      } else if (donors.length > 0) {
        activeDonor = donors[0];
      } else {
        activeDonor = {
          id: 'donor-direct',
          donorName: currentUser.name || 'Volunteer Donor',
          bloodGroup: patientReq.bloodGroup, // match same blood group
          lastDonationDate: new Date().toISOString().split('T')[0],
          availability: 'Immediate',
          location: 'Local Area',
          city: 'Local Area',
          phone: currentUser.phone || '',
          distanceKm: 1.2,
          lat: 0,
          lng: 0,
          isVerified: true,
          status: 'Available',
        };
      }
    }

    // Blood compatibility check
    const compatible = isBloodCompatible(activeDonor.bloodGroup, patientReq.bloodGroup);
    if (!compatible) {
      const msg = `Blood incompatibility: Donor (${activeDonor.bloodGroup}) cannot donate to Patient (${patientReq.bloodGroup}).`;
      addToast('Matching Incompatible', msg, 'error');
      return { success: false, message: msg };
    }

    // Create match record
    const matchId = 'match-' + Date.now().toString(36);
    const newMatch: MatchRecord = {
      id: matchId,
      patientRequestId: patientReq.id,
      donorId: activeDonor.id,
      patientName: patientReq.patientName,
      donorName: activeDonor.donorName,
      bloodGroup: activeDonor.bloodGroup,
      units: patientReq.units,
      hospital: patientReq.hospital,
      estimatedArrivalMins: 15,
      receivingStatus: 'Blood Screened & Packed',
      arrivalStatus: 'Donor En Route',
      currentStep: 2,
      matchedAt: new Date().toISOString(),
      patientPhone: patientReq.contactNumber,
      donorPhone: activeDonor.phone,
      vehicleInfo: 'Direct Rapid Transport',
    };

    setActiveMatch(newMatch);
    MatchesDB.create(newMatch);

    // Update patient request status
    setPatientRequests((prev) =>
      prev.map((p) => (p.id === patientRequestId ? { ...p, status: 'Matched' } : p))
    );
    PatientRequestsDB.updateStatus(patientRequestId, 'Matched');

    // Update donor status
    setDonors((prev) =>
      prev.map((d) => (d.id === activeDonor?.id ? { ...d, status: 'Matched' } : d))
    );
    if (activeDonor?.id) {
      DonorsDB.updateStatus(activeDonor.id, 'Matched');
    }

    addToast(
      'Blood Match Confirmed!',
      `Donor ${activeDonor.donorName} matched for patient ${patientReq.patientName}. Proceeding to Live Tracking.`,
      'success'
    );

    return { success: true, message: 'Match successfully created!' };
  };

  const updateMatchStep = (step: MatchStep) => {
    if (!activeMatch) return;

    const stepStatuses: Record<
      MatchStep,
      { receiving: MatchRecord['receivingStatus']; arrival: MatchRecord['arrivalStatus'] }
    > = {
      1: { receiving: 'Verifying Compatibility', arrival: 'Request Confirmed' },
      2: { receiving: 'Blood Screened & Packed', arrival: 'Donor En Route' },
      3: { receiving: 'In Transit', arrival: 'Arrived at Hospital' },
      4: { receiving: 'Ready for Transfusion', arrival: 'Transfusion Active' },
      5: { receiving: 'Transfusion Complete', arrival: 'Complete' },
    };

    const statusPair = stepStatuses[step];
    const updated: MatchRecord = {
      ...activeMatch,
      currentStep: step,
      receivingStatus: statusPair.receiving,
      arrivalStatus: statusPair.arrival,
    };

    setActiveMatch(updated);
    MatchesDB.updateStep(activeMatch.id, step, statusPair.receiving, statusPair.arrival);
    addToast('Match Status Updated', `Status changed to: ${statusPair.arrival}`, 'info');
  };

  // Appointments (shared state between U6 and D2)
  const createAppointment = (
    apt: Omit<Appointment, 'id' | 'userId' | 'status' | 'createdAt'>
  ): string => {
    const id = 'apt-' + Date.now().toString(36);
    const newApt: Appointment = {
      ...apt,
      id,
      userId: currentUser.id,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      doctorName: apt.doctorName || 'Attending Physician',
      department: apt.department || 'Medical Department',
    };

    setAppointments((prev) => [newApt, ...prev]);
    AppointmentsDB.create(newApt);
    addToast(
      'Appointment Submitted',
      `Requested ${newApt.service} for ${newApt.requestedDate}. Sent to Doctor Dashboard.`,
      'success'
    );
    return id;
  };

  const updateAppointmentStatus = (
    id: string,
    status: 'Accepted' | 'Cancelled',
    acceptedTimeSlot?: string
  ) => {
    setAppointments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            acceptedTimeSlot: status === 'Accepted' ? acceptedTimeSlot || 'Assigned Time Slot' : undefined,
          };
        }
        return item;
      })
    );

    AppointmentsDB.updateStatus(id, status, acceptedTimeSlot);

    if (status === 'Accepted') {
      addToast(
        'Appointment Confirmed',
        `Scheduled for ${acceptedTimeSlot || 'assigned slot'}. User notified in U6 panel.`,
        'success'
      );
    } else {
      addToast('Appointment Cancelled', 'Request status updated to Cancelled.', 'info');
    }
  };

  // Groups (U5)
  const createGroup = (name: string, description: string, category: DonorGroup['category'] = 'Emergency Vanguard'): boolean => {
    const newGroup: DonorGroup = {
      id: 'grp-' + Date.now().toString(36),
      name,
      description,
      category,
      location: currentUser.city || 'Metro City',
      memberCount: 1,
      isVerifiedOnly: true,
      isJoined: true,
      leadCoordinator: currentUser.name || 'Coordinator',
    };

    setGroups((prev) => [newGroup, ...prev]);
    GroupsDB.create(newGroup);
    addToast('Group Created!', `"${name}" is now available.`, 'success');
    return true;
  };

  const toggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const joined = !g.isJoined;
          addToast(
            joined ? `Joined ${g.name}` : `Left ${g.name}`,
            joined ? 'You are now an active member' : 'Membership removed',
            'info'
          );
          return {
            ...g,
            isJoined: joined,
            memberCount: joined ? g.memberCount + 1 : Math.max(1, g.memberCount - 1),
          };
        }
        return g;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        patientRequests,
        donors,
        appointments,
        groups,
        activeMatch,
        toasts,
        switchUserRole,
        setCurrentUser,
        setUserMode,
        loginDoctor,
        loginUser,
        signupUser,
        logout,
        addPatientRequest,
        addDonorAvailability,
        requestDonorForPatient,
        acceptPatientAsDonor,
        updateMatchStep,
        createAppointment,
        updateAppointmentStatus,
        createGroup,
        toggleJoinGroup,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
