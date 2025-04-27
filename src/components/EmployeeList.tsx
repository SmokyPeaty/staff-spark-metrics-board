
import React from 'react';
import EmployeeCard from './EmployeeCard';

// Sample employee data
const sampleEmployees = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Sales Manager',
    department: 'Sales',
    email: 'john.smith@example.com',
    kpiProgress: 85,
    kpiCount: 6,
    status: 'on-track' as const,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Marketing Specialist',
    department: 'Marketing',
    email: 'sarah.j@example.com',
    kpiProgress: 68,
    kpiCount: 5,
    status: 'at-risk' as const,
  },
  {
    id: '3',
    name: 'Michael Chen',
    position: 'Software Engineer',
    department: 'Engineering',
    email: 'michael.c@example.com',
    kpiProgress: 92,
    kpiCount: 4,
    status: 'on-track' as const,
  },
  {
    id: '4',
    name: 'Jessica Williams',
    position: 'HR Coordinator',
    department: 'HR',
    email: 'jessica.w@example.com',
    kpiProgress: 45,
    kpiCount: 7,
    status: 'off-track' as const,
  },
  {
    id: '5',
    name: 'David Miller',
    position: 'Financial Analyst',
    department: 'Finance',
    email: 'david.m@example.com',
    kpiProgress: 76,
    kpiCount: 5,
    status: 'on-track' as const,
  },
  {
    id: '6',
    name: 'Lisa Taylor',
    position: 'Customer Support Lead',
    department: 'Support',
    email: 'lisa.t@example.com',
    kpiProgress: 62,
    kpiCount: 4,
    status: 'at-risk' as const,
  },
];

export default function EmployeeList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sampleEmployees.map((employee) => (
        <EmployeeCard key={employee.id} {...employee} />
      ))}
    </div>
  );
}
