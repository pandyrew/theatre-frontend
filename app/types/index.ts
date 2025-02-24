export interface Actor {
  id: number;
  name: string;
  email: string;
  role: string;
  bio?: string | null;
  phoneNumber?: string | null;
  auditionDate: string; // ISO string from backend DateTime
  auditionNotes?: string | null;
  previousExperience?: string | null;
  weekdayAvailability?: string | null;
  weekendAvailability?: string | null;
  specialConsiderations?: string | null;
  clerkUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Administrator {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  canModifyUI: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  clerkUserId: string;
  createdAt: string;
  updatedAt: string;
}

export type ActorFormData = Omit<
  Actor,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;
export type AdminFormData = Omit<
  Administrator,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;
