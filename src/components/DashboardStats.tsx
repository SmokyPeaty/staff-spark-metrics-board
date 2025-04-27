
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, AlertCircle, Users } from 'lucide-react';

type StatsCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Employees"
        value="24"
        description="Active employees tracked"
        icon={<Users size={18} />}
      />
      <StatsCard
        title="On Track KPIs"
        value="67%"
        description="KPIs meeting targets"
        icon={<CheckCircle size={18} />}
        trend={{
          value: 5.2,
          isPositive: true,
        }}
      />
      <StatsCard
        title="At Risk KPIs"
        value="22%"
        description="KPIs needing attention"
        icon={<Activity size={18} />}
        trend={{
          value: 2.1,
          isPositive: false,
        }}
      />
      <StatsCard
        title="Off Track KPIs"
        value="11%"
        description="KPIs below target"
        icon={<AlertCircle size={18} />}
        trend={{
          value: 1.5,
          isPositive: true,
        }}
      />
    </div>
  );
}
