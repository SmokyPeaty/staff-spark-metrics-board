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
import { Activity, Plus, Search } from 'lucide-react';
import KraSection from '@/components/KraSection';
import { AddKraDialog } from '@/components/AddKraDialog';

// Sample KRA and KPI data - in a real app, this would come from Supabase
const sampleKRAs = [
  {
    id: '1',
    title: 'Sales Growth',
    description: 'Increase revenue through sales initiatives',
    weightage: 40,
    kpis: [
      {
        id: '101',
        title: 'Monthly Sales Target',
        description: 'Achieve monthly sales targets as set in annual plan',
        target: '$50,000 per month',
        currentValue: '$42,500',
        progress: 85,
        dueDate: '2025-06-30',
        status: 'on-track' as const,
      },
      {
        id: '102',
        title: 'New Customer Acquisition',
        description: 'Bring new customers onboard through outreach',
        target: '10 new clients per quarter',
        currentValue: '7',
        progress: 70,
        dueDate: '2025-06-30',
        status: 'at-risk' as const,
      },
      {
        id: '103',
        title: 'Average Deal Size',
        description: 'Increase average transaction value',
        target: '$5,000',
        currentValue: '$4,800',
        progress: 96,
        dueDate: '2025-06-30',
        status: 'on-track' as const,
      },
    ],
  },
  {
    id: '2',
    title: 'Customer Satisfaction',
    description: 'Improve overall customer experience and satisfaction',
    weightage: 30,
    kpis: [
      {
        id: '201',
        title: 'NPS Score',
        description: 'Maintain high Net Promoter Score',
        target: '8.5+',
        currentValue: '8.2',
        progress: 94,
        dueDate: '2025-06-30',
        status: 'on-track' as const,
      },
      {
        id: '202',
        title: 'Support Response Time',
        description: 'Decrease time to first response on support tickets',
        target: '< 2 hours',
        currentValue: '2.5 hours',
        progress: 80,
        dueDate: '2025-06-30',
        status: 'at-risk' as const,
      },
    ],
  },
  {
    id: '3',
    title: 'Operational Efficiency',
    description: 'Optimize processes and reduce operational costs',
    weightage: 30,
    kpis: [
      {
        id: '301',
        title: 'Cost Reduction',
        description: 'Reduce operational costs across departments',
        target: '15% reduction YoY',
        currentValue: '8%',
        progress: 53,
        dueDate: '2025-06-30',
        status: 'at-risk' as const,
      },
      {
        id: '302',
        title: 'Process Automation',
        description: 'Implement automation in key operational areas',
        target: '5 key processes',
        currentValue: '2',
        progress: 40,
        dueDate: '2025-06-30',
        status: 'off-track' as const,
      },
      {
        id: '303',
        title: 'Employee Productivity',
        description: 'Increase output per employee hour worked',
        target: '10% increase',
        currentValue: '12%',
        progress: 120,
        dueDate: '2025-06-30',
        status: 'on-track' as const,
      },
    ],
  },
];

// Filter options
const kpiStatuses = ['All', 'on-track', 'at-risk', 'off-track'];

export default function KpiTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All');
  const [kras, setKras] = useState(sampleKRAs);
  
  const filteredKRAs = kras.map(kra => {
    const filteredKpis = kra.kpis.filter(kpi => {
      const matchesSearch = 
        kpi.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        kpi.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = status === 'All' || kpi.status === status;
      
      return matchesSearch && matchesStatus;
    });
    
    return {
      ...kra,
      kpis: filteredKpis,
      visible: filteredKpis.length > 0,
    };
  }).filter(kra => kra.visible);

  const handleAddKra = (data: { title: string; description: string; weightage: number }) => {
    const newKra = {
      id: (kras.length + 1).toString(),
      title: data.title,
      description: data.description,
      weightage: data.weightage,
      kpis: [],
    };
    setKras([...kras, newKra]);
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity size={24} className="text-primary" />
            KPI Tracker
          </h1>
          <p className="text-muted-foreground">
            Monitor key performance indicators and goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Report
          </Button>
          <AddKraDialog onKraAdd={handleAddKra} />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add KPI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search KPIs..."
            className="w-full pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {kpiStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'on-track' ? 'On Track' : s === 'at-risk' ? 'At Risk' : s === 'off-track' ? 'Off Track' : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredKRAs.map((kra) => (
          <KraSection 
            key={kra.id} 
            id={kra.id}
            title={kra.title}
            description={kra.description}
            weightage={kra.weightage}
            kpis={kra.kpis}
          />
        ))}
        
        {filteredKRAs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity size={48} className="text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium">No KPIs found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
