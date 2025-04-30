
export type EmployeeStatus = 'on-track' | 'at-risk' | 'off-track';
export type ReviewStatus = 'pending' | 'submitted' | 'reviewed';

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
