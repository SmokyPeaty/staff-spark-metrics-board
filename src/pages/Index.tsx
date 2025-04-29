import React from 'react';
import DashboardStats from '@/components/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeeList from '@/components/EmployeeList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/ui/chart';
import { Employee } from '@/types/employee';

const Index = () => {
  // Sample data for charts
  const kpiTrendData = [
    {
      name: 'Jan',
      'On Track': 40,
      'At Risk': 24,
      'Off Track': 10,
    },
    {
      name: 'Feb',
      'On Track': 45,
      'At Risk': 22,
      'Off Track': 12,
    },
    {
      name: 'Mar',
      'On Track': 50,
      'At Risk': 20,
      'Off Track': 8,
    },
    {
      name: 'Apr',
      'On Track': 55,
      'At Risk': 15,
      'Off Track': 6,
    },
    {
      name: 'May',
      'On Track': 60,
      'At Risk': 18,
      'Off Track': 9,
    },
    {
      name: 'Jun',
      'On Track': 65,
      'At Risk': 19,
      'Off Track': 11,
    },
  ];

  const departmentPerformanceData = [
    {
      name: 'Sales',
      performance: 85,
    },
    {
      name: 'Marketing',
      performance: 75,
    },
    {
      name: 'Engineering',
      performance: 90,
    },
    {
      name: 'HR',
      performance: 68,
    },
    {
      name: 'Finance',
      performance: 82,
    },
    {
      name: 'Support',
      performance: 71,
    },
  ];

  // Sample employees for the dashboard view
  const dashboardEmployees: Employee[] = [
    {
      id: '1',
      name: 'John Smith',
      position: 'Sales Manager',
      department: 'Sales',
      email: 'john.smith@example.com',
      kpiProgress: 85,
      kpiCount: 6,
      status: 'on-track',
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
    },
  ];

  // Dummy handlers for the dashboard view - these would redirect to the employee page in a real app
  const handleEdit = (id: string) => {
    console.log(`Edit employee ${id} - would redirect in a real app`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete employee ${id} - would redirect in a real app`);
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of employee performance and KPI tracking.
          </p>
        </div>
      </div>

      <DashboardStats />

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="mt-4 space-y-4">
          <EmployeeList 
            employees={dashboardEmployees} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Monthly KPI performance by category</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={kpiTrendData}
                categories={["On Track", "At Risk", "Off Track"]}
                colors={["#10b981", "#f59e0b", "#ef4444"]}
                valueFormatter={(value) => `${value}%`}
                height={350}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KPI Status Trends</CardTitle>
              <CardDescription>6-Month view of KPI status changes</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={kpiTrendData}
                categories={["On Track", "At Risk", "Off Track"]}
                colors={["#10b981", "#f59e0b", "#ef4444"]}
                valueFormatter={(value) => `${value}%`}
                height={350}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Overall KPI achievement by department</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={departmentPerformanceData}
                categories={["performance"]}
                colors={["#3b82f6"]}
                valueFormatter={(value) => `${value}%`}
                height={350}
                className="mt-4"
                layout="vertical"
                showLegend={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
