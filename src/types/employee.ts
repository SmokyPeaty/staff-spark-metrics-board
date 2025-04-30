
export type EmployeeStatus = 'on-track' | 'at-risk' | 'off-track';
export type ReviewStatus = 'pending' | 'submitted' | 'reviewed';
export type ReviewFrequency = 'quarterly' | 'half-yearly';
export type WindowStatus = 'upcoming' | 'open' | 'closed';
export type CycleStatus = 'active' | 'closed';

export interface ReviewWindow {
  id: string;
  cycleId: string;
  name: string; // e.g., "Q1", "H1"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: WindowStatus;
}

export interface Cycle {
  id: string;
  name: string; // e.g., "FY 2024-25"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  frequency: ReviewFrequency;
  windows: ReviewWindow[];
  status: CycleStatus;
}

export interface KpiReview {
  kpiId: string;
  kpiName: string;
  weight: number;
  selfRating?: number;
  selfComment?: string;
  managerRating?: number;
  managerComment?: string;
}

export interface Review {
  id: string;
  employeeId: string;
  date: string;
  windowId?: string; // Reference to the review window
  cycleId?: string; // Reference to the cycle
  overallRating?: number;
  status: ReviewStatus;
  kpiReviews: KpiReview[];
  finalManagerComment?: string;
}

export interface Kpi {
  id: string;
  name: string;
  description: string;
  weight: number; // Weight as percentage (e.g., 20 for 20%)
  progress: number; // Progress as percentage
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  kpiProgress: number;
  kpiCount: number;
  status: EmployeeStatus;
  manager?: string;
  hireDate?: string;
  phone?: string;
  location?: string;
  kpis?: Kpi[];
  reviews?: Review[];
}
