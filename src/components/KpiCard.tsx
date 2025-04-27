
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type KpiCardProps = {
  id: string;
  title: string;
  description: string;
  target: string;
  currentValue: string | number;
  progress: number;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'off-track';
};

export default function KpiCard({
  id,
  title,
  description,
  target,
  currentValue,
  progress,
  dueDate,
  status,
}: KpiCardProps) {
  
  const getStatusColor = () => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'off-track':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedDueDate = new Date(dueDate).toLocaleDateString();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">{title}</h3>
          <Badge className={getStatusColor()}>
            {status === 'on-track'
              ? 'On Track'
              : status === 'at-risk'
              ? 'At Risk'
              : 'Off Track'}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-sm font-medium">{target}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-sm font-medium">{currentValue}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-sm font-medium">{formattedDueDate}</p>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Progress</span>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-1.5",
              progress < 30 ? "text-destructive" : progress < 70 ? "text-amber-500" : "text-emerald-500"
            )} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
