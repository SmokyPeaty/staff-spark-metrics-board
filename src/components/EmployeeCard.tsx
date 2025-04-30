
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmployeeStatus } from '@/types/employee';

type EmployeeCardProps = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  kpiProgress: number;
  kpiCount: number;
  status: EmployeeStatus;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function EmployeeCard({
  id,
  name,
  position,
  department,
  email,
  kpiProgress,
  kpiCount,
  status,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const navigate = useNavigate();
  
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleReviewClick = () => {
    navigate(`/employee-review/${id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-muted-foreground">{position}</p>
                <p className="text-xs text-muted-foreground mt-1">{email}</p>
              </div>
              <Badge className={getStatusColor()}>
                {status === 'on-track'
                  ? 'On Track'
                  : status === 'at-risk'
                  ? 'At Risk'
                  : 'Off Track'}
              </Badge>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">KPI Progress</span>
                <span className="text-xs font-medium">{kpiProgress}%</span>
              </div>
              <Progress value={kpiProgress} className="h-1.5" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {kpiCount} KPIs assigned
                </span>
                <span className="text-xs text-muted-foreground">Department: {department}</span>
              </div>
              <div className="flex justify-between mt-3 gap-2">
                <Button variant="outline" size="sm" onClick={handleReviewClick}>
                  <ClipboardCheck className="h-4 w-4 mr-1" /> Review
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => onDelete(id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
