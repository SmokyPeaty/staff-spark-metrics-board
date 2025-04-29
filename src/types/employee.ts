
export type EmployeeStatus = 'on-track' | 'at-risk' | 'off-track';

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
}
