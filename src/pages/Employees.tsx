
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Users } from 'lucide-react';
import EmployeeList from '@/components/EmployeeList';
import EmployeeDialog from '@/components/EmployeeDialog';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { Employee } from '@/types/employee';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Sample employee data - in a real app, this would come from Supabase
const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Sales Manager',
    department: 'Sales',
    email: 'john.smith@example.com',
    kpiProgress: 85,
    kpiCount: 6,
    status: 'on-track',
    manager: 'Sarah Johnson',
    location: 'New York',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Marketing Specialist',
    department: 'Marketing',
    email: 'sarah.j@example.com',
    kpiProgress: 68,
    kpiCount: 5,
    status: 'at-risk',
    manager: 'David Miller',
    location: 'Boston',
  },
  {
    id: '3',
    name: 'Michael Chen',
    position: 'Software Engineer',
    department: 'Engineering',
    email: 'michael.c@example.com',
    kpiProgress: 92,
    kpiCount: 4,
    status: 'on-track',
    manager: 'Lisa Taylor',
    location: 'San Francisco',
  },
  {
    id: '4',
    name: 'Jessica Williams',
    position: 'HR Coordinator',
    department: 'HR',
    email: 'jessica.w@example.com',
    kpiProgress: 45,
    kpiCount: 7,
    status: 'off-track',
    manager: 'David Miller',
    location: 'Chicago',
  },
  {
    id: '5',
    name: 'David Miller',
    position: 'Financial Analyst',
    department: 'Finance',
    email: 'david.m@example.com',
    kpiProgress: 76,
    kpiCount: 5,
    status: 'on-track',
    manager: 'Robert Garcia',
    location: 'Miami',
  },
  {
    id: '6',
    name: 'Lisa Taylor',
    position: 'Customer Support Lead',
    department: 'Support',
    email: 'lisa.t@example.com',
    kpiProgress: 62,
    kpiCount: 4,
    status: 'at-risk',
    manager: 'David Miller',
    location: 'Austin',
  },
];

const departments = ['All', 'Sales', 'Marketing', 'Engineering', 'HR', 'Finance', 'Support', 'Operations'];
const statuses = ['All', 'on-track', 'at-risk', 'off-track'];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | undefined>(undefined);
  
  const { toast } = useToast();

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = department === 'All' || employee.department === department;
    const matchesStatus = status === 'All' || employee.status === status;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = (data: Partial<Employee>) => {
    const newEmployee: Employee = {
      ...data,
      id: uuidv4(),
      kpiProgress: 0,
      kpiCount: 0,
      status: data.status || 'on-track',
    } as Employee;
    
    setEmployees([...employees, newEmployee]);
    toast({
      title: "Employee added!",
      description: `${newEmployee.name} has been successfully added.`,
    });
  };

  const handleEditEmployee = (data: Partial<Employee>) => {
    if (currentEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === currentEmployee.id ? { ...emp, ...data } : emp
      ));
      toast({
        title: "Employee updated!",
        description: `${data.name} has been successfully updated.`,
      });
    }
  };

  const handleDeleteEmployee = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      toast({
        title: "Employee deleted!",
        description: `${employeeToDelete.name} has been successfully removed.`,
      });
    }
  };

  const openEditDialog = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    setCurrentEmployee(employee);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentEmployee(undefined);
    }
  };

  const handleSubmit = (data: any) => {
    if (currentEmployee) {
      handleEditEmployee(data);
    } else {
      handleAddEmployee(data);
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users size={24} className="text-primary" />
            Employees
          </h1>
          <p className="text-muted-foreground">
            Manage staff and assign KPIs
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="w-full pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={department}
          onValueChange={setDepartment}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'on-track' ? 'On Track' : s === 'at-risk' ? 'At Risk' : s === 'off-track' ? 'Off Track' : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <EmployeeList 
        employees={filteredEmployees} 
        onEdit={openEditDialog} 
        onDelete={openDeleteDialog} 
      />

      <EmployeeDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
        employee={currentEmployee}
        departments={departments}
      />

      {employeeToDelete && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteEmployee}
          name={employeeToDelete.name}
        />
      )}
    </div>
  );
}
