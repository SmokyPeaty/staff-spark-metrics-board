
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/ui/chart';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { BarChart as BarChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Reports() {
  // Sample data for charts
  const quarterlyPerformanceData = [
    {
      name: 'Q1',
      'Sales': 85,
      'Marketing': 75,
      'Engineering': 92,
      'HR': 68,
      'Finance': 80,
      'Support': 72,
    },
    {
      name: 'Q2',
      'Sales': 88,
      'Marketing': 78,
      'Engineering': 90,
      'HR': 72,
      'Finance': 82,
      'Support': 75,
    },
    {
      name: 'Q3',
      'Sales': 90,
      'Marketing': 82,
      'Engineering': 88,
      'HR': 75,
      'Finance': 85,
      'Support': 78,
    },
    {
      name: 'Q4',
      'Sales': 87,
      'Marketing': 80,
      'Engineering': 94,
      'HR': 70,
      'Finance': 84,
      'Support': 80,
    },
  ];

  const statusTrendData = [
    {
      name: 'Jan',
      'On Track': 65,
      'At Risk': 25,
      'Off Track': 10,
    },
    {
      name: 'Feb',
      'On Track': 68,
      'At Risk': 22,
      'Off Track': 10,
    },
    {
      name: 'Mar',
      'On Track': 70,
      'At Risk': 20,
      'Off Track': 10,
    },
    {
      name: 'Apr',
      'On Track': 72,
      'At Risk': 18,
      'Off Track': 10,
    },
    {
      name: 'May',
      'On Track': 75,
      'At Risk': 16,
      'Off Track': 9,
    },
    {
      name: 'Jun',
      'On Track': 77,
      'At Risk': 15,
      'Off Track': 8,
    },
  ];

  const kraPerformanceData = [
    {
      name: 'Sales Growth',
      performance: 85,
    },
    {
      name: 'Customer Satisfaction',
      performance: 92,
    },
    {
      name: 'Operational Efficiency',
      performance: 78,
    },
    {
      name: 'Employee Development',
      performance: 72,
    },
    {
      name: 'Innovation',
      performance: 68,
    },
  ];

  const employeePerformanceData = [
    {
      name: 'John S.',
      performance: 95,
    },
    {
      name: 'Sarah J.',
      performance: 85,
    },
    {
      name: 'Michael C.',
      performance: 92,
    },
    {
      name: 'Jessica W.',
      performance: 65,
    },
    {
      name: 'David M.',
      performance: 88,
    },
    {
      name: 'Lisa T.',
      performance: 78,
    },
    {
      name: 'Robert G.',
      performance: 82,
    },
    {
      name: 'Emily W.',
      performance: 75,
    },
  ];

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChartIcon size={24} className="text-primary" />
            Reports
          </h1>
          <p className="text-muted-foreground">
            Analyze performance data and trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export PDF
          </Button>
          <Select defaultValue="2025">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Quarterly performance by department</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={quarterlyPerformanceData}
              categories={["Sales", "Marketing", "Engineering", "HR", "Finance", "Support"]}
              colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]}
              valueFormatter={(value) => `${value}%`}
              height={350}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>KPI Status Trend</CardTitle>
            <CardDescription>Monthly KPI status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={statusTrendData}
              categories={["On Track", "At Risk", "Off Track"]}
              colors={["#10b981", "#f59e0b", "#ef4444"]}
              valueFormatter={(value) => `${value}%`}
              height={350}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KRA Performance</CardTitle>
            <CardDescription>Overall achievement by key result area</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={kraPerformanceData}
              categories={["performance"]}
              index="name"
              colors={["#3b82f6"]}
              valueFormatter={(value) => `${value}%`}
              height={350}
              layout="vertical"
              showLegend={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Employee Performance</CardTitle>
            <CardDescription>KPI achievement by employee</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={employeePerformanceData}
              categories={["performance"]}
              index="name"
              colors={["#8b5cf6"]}
              valueFormatter={(value) => `${value}%`}
              height={350}
              layout="vertical"
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
