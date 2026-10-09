import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  PatientRequest,
  DonorAvailability,
  Appointment,
  DonorGroup,
  MatchRecord,
  UserProfile,
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// ==========================================
// 1. PATIENT REQUESTS COLLECTION
// ==========================================
export const PatientRequestsDB = {
  collectionPath: 'patientRequests',

  async create(request: PatientRequest): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await setDoc(doc(db, this.collectionPath, request.id), request);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, this.collectionPath);
    }
  },

  async updateStatus(id: string, status: PatientRequest['status']): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await updateDoc(doc(db, this.collectionPath, id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${this.collectionPath}/${id}`);
    }
  },

  subscribe(callback: (requests: PatientRequest[]) => void): Unsubscribe | null {
    if (!db || !isFirebaseConfigured) return null;
    try {
      const q = query(collection(db, this.collectionPath), orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((d) => d.data() as PatientRequest);
          callback(list);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, this.collectionPath);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, this.collectionPath);
      return null;
    }
  },
};

// ==========================================
// 2. DONORS REGISTRY COLLECTION
// ==========================================
export const DonorsDB = {
  collectionPath: 'donors',

  async create(donor: DonorAvailability): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await setDoc(doc(db, this.collectionPath, donor.id), donor);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, this.collectionPath);
    }
  },

  async updateStatus(id: string, status: DonorAvailability['status']): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await updateDoc(doc(db, this.collectionPath, id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${this.collectionPath}/${id}`);
    }
  },

  subscribe(callback: (donors: DonorAvailability[]) => void): Unsubscribe | null {
    if (!db || !isFirebaseConfigured) return null;
    try {
      const q = query(collection(db, this.collectionPath));
      return onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((d) => d.data() as DonorAvailability);
          callback(list);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, this.collectionPath);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, this.collectionPath);
      return null;
    }
  },
};

// ==========================================
// 3. APPOINTMENTS COLLECTION (D2 & U6 SYNC)
// ==========================================
export const AppointmentsDB = {
  collectionPath: 'appointments',

  async create(appointment: Appointment): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await setDoc(doc(db, this.collectionPath, appointment.id), appointment);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, this.collectionPath);
    }
  },

  async updateStatus(
    id: string,
    status: 'Accepted' | 'Cancelled',
    acceptedTimeSlot?: string
  ): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      const payload: any = { status };
      if (acceptedTimeSlot) payload.acceptedTimeSlot = acceptedTimeSlot;
      await updateDoc(doc(db, this.collectionPath, id), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${this.collectionPath}/${id}`);
    }
  },

  subscribe(callback: (appointments: Appointment[]) => void): Unsubscribe | null {
    if (!db || !isFirebaseConfigured) return null;
    try {
      const q = query(collection(db, this.collectionPath), orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((d) => d.data() as Appointment);
          callback(list);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, this.collectionPath);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, this.collectionPath);
      return null;
    }
  },
};

// ==========================================
// 4. GROUPS COLLECTION
// ==========================================
export const GroupsDB = {
  collectionPath: 'groups',

  async create(group: DonorGroup): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await setDoc(doc(db, this.collectionPath, group.id), group);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, this.collectionPath);
    }
  },

  async updateMemberCount(id: string, count: number): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await updateDoc(doc(db, this.collectionPath, id), { memberCount: count });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${this.collectionPath}/${id}`);
    }
  },

  subscribe(callback: (groups: DonorGroup[]) => void): Unsubscribe | null {
    if (!db || !isFirebaseConfigured) return null;
    try {
      const q = query(collection(db, this.collectionPath));
      return onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((d) => d.data() as DonorGroup);
          callback(list);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, this.collectionPath);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, this.collectionPath);
      return null;
    }
  },
};

// ==========================================
// 5. MATCHES COLLECTION
// ==========================================
export const MatchesDB = {
  collectionPath: 'matches',

  async create(match: MatchRecord): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await setDoc(doc(db, this.collectionPath, match.id), match);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, this.collectionPath);
    }
  },

  async updateStep(
    id: string,
    currentStep: MatchRecord['currentStep'],
    receivingStatus: MatchRecord['receivingStatus'],
    arrivalStatus: MatchRecord['arrivalStatus']
  ): Promise<void> {
    if (!db || !isFirebaseConfigured) return;
    try {
      await updateDoc(doc(db, this.collectionPath, id), {
        currentStep,
        receivingStatus,
        arrivalStatus,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${this.collectionPath}/${id}`);
    }
  },
};
