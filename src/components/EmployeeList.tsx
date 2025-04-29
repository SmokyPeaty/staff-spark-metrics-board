
import React from 'react';
import EmployeeCard from './EmployeeCard';
import { Employee } from '@/types/employee';
import { Users } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <EmployeeCard 
          key={employee.id} 
          {...employee} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}

      {employees.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <Users size={48} className="text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium">No employees found</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
