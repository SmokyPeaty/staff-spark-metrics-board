
export type EmployeeStatus = 'on-track' | 'at-risk' | 'off-track';
export type ReviewStatus = 'pending' | 'submitted' | 'reviewed';

export interface Review {
  id: string;
  employeeId: string;
  date: string;
  selfAssessment?: string;
  selfRating?: number;
  managerAssessment?: string;
  managerRating?: number;
  goals?: string;
  status: ReviewStatus;
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
  reviews?: Review[];
}
