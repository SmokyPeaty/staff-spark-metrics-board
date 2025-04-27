
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KpiCard from './KpiCard';
import { Separator } from '@/components/ui/separator';

type KPI = {
  id: string;
  title: string;
  description: string;
  target: string;
  currentValue: string | number;
  progress: number;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'off-track';
};

type KraSectionProps = {
  id: string;
  title: string;
  description: string;
  weightage: number;
  kpis: KPI[];
};

export default function KraSection({
  id,
  title,
  description,
  weightage,
  kpis,
}: KraSectionProps) {
  // Calculate overall KRA progress based on KPI progress average
  const calculateOverallProgress = () => {
    if (kpis.length === 0) return 0;
    const sum = kpis.reduce((acc, kpi) => acc + kpi.progress, 0);
    return Math.round(sum / kpis.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {weightage}% weightage
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="text-sm font-medium">Overall Progress: {overallProgress}%</div>
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Badge component to maintain consistency with other code
function Badge({ children, variant, className }: { 
  children: React.ReactNode; 
  variant?: 'outline' | 'default'; 
  className?: string 
}) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", 
        variant === 'outline' 
          ? "border border-input bg-background" 
          : "bg-primary text-primary-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

// Helper function that was used in the Badge component
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
