
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, FileText, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Cycle, ReviewFrequency, ReviewWindow, WindowStatus } from '@/types/employee';

// Mock data - In a real app, this would come from your API/database
const cyclesData: Cycle[] = [
  {
    id: '1',
    name: 'FY 2023-24',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    frequency: 'quarterly',
    status: 'closed',
    windows: [
      {
        id: 'w1',
        cycleId: '1',
        name: 'Q1',
        startDate: '2023-04-01',
        endDate: '2023-06-30',
        status: 'closed'
      },
      {
        id: 'w2',
        cycleId: '1',
        name: 'Q2',
        startDate: '2023-07-01',
        endDate: '2023-09-30',
        status: 'closed'
      },
      {
        id: 'w3',
        cycleId: '1',
        name: 'Q3',
        startDate: '2023-10-01',
        endDate: '2023-12-31',
        status: 'closed'
      },
      {
        id: 'w4',
        cycleId: '1',
        name: 'Q4',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'closed'
      }
    ]
  },
  {
    id: '2',
    name: 'FY 2024-25',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    frequency: 'quarterly',
    status: 'active',
    windows: [
      {
        id: 'w5',
        cycleId: '2',
        name: 'Q1',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        status: 'open'
      },
      {
        id: 'w6',
        cycleId: '2',
        name: 'Q2',
        startDate: '2024-07-01',
        endDate: '2024-09-30',
        status: 'upcoming'
      },
      {
        id: 'w7',
        cycleId: '2',
        name: 'Q3',
        startDate: '2024-10-01',
        endDate: '2024-12-31',
        status: 'upcoming'
      },
      {
        id: 'w8',
        cycleId: '2',
        name: 'Q4',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        status: 'upcoming'
      }
    ]
  }
];

const formSchema = z.object({
  name: z.string().min(1, { message: 'Cycle name is required' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  frequency: z.enum(['quarterly', 'half-yearly']),
});

type FormValues = z.infer<typeof formSchema>;

export default function Cycles() {
  const [cycles, setCycles] = useState<Cycle[]>(cyclesData);
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      frequency: 'quarterly',
    },
  });

  // Generate review windows based on cycle dates and frequency
  const generateWindows = (startDate: Date, endDate: Date, frequency: ReviewFrequency, cycleId: string): ReviewWindow[] => {
    const windows: ReviewWindow[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (frequency === 'quarterly') {
      // Create 4 windows (quarters)
      const quarterDuration = Math.floor((end.getTime() - start.getTime()) / 4);
      
      for (let i = 0; i < 4; i++) {
        const windowStart = new Date(start.getTime() + i * quarterDuration);
        const windowEnd = i === 3 ? end : new Date(start.getTime() + (i + 1) * quarterDuration - 1);
        
        windows.push({
          id: uuidv4(),
          cycleId,
          name: `Q${i + 1}`,
          startDate: windowStart.toISOString().split('T')[0],
          endDate: windowEnd.toISOString().split('T')[0],
          status: i === 0 ? 'open' as WindowStatus : 'upcoming' as WindowStatus
        });
      }
    } else if (frequency === 'half-yearly') {
      // Create 2 windows (half-years)
      const halfYearDuration = Math.floor((end.getTime() - start.getTime()) / 2);
      
      for (let i = 0; i < 2; i++) {
        const windowStart = new Date(start.getTime() + i * halfYearDuration);
        const windowEnd = i === 1 ? end : new Date(start.getTime() + (i + 1) * halfYearDuration - 1);
        
        windows.push({
          id: uuidv4(),
          cycleId,
          name: `H${i + 1}`,
          startDate: windowStart.toISOString().split('T')[0],
          endDate: windowEnd.toISOString().split('T')[0],
          status: i === 0 ? 'open' as WindowStatus : 'upcoming' as WindowStatus
        });
      }
    }
    
    return windows;
  };

  const handleCreateCycle = (values: FormValues) => {
    const { name, startDate, endDate, frequency } = values;
    
    // Create a new cycle with a unique ID
    const newCycleId = uuidv4();
    const newCycle: Cycle = {
      id: newCycleId,
      name,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      frequency,
      status: 'active',
      windows: generateWindows(startDate, endDate, frequency, newCycleId)
    };
    
    setCycles([...cycles, newCycle]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Cycle created",
      description: `${name} has been created with ${frequency === 'quarterly' ? '4 quarterly' : '2 half-yearly'} review windows.`
    });
  };

  const handleCloseCycle = (cycleId: string) => {
    const updatedCycles = cycles.map(cycle => {
      if (cycle.id === cycleId) {
        return {
          ...cycle,
          status: 'closed' as const,
          windows: cycle.windows.map(window => ({
            ...window,
            status: 'closed' as WindowStatus
          }))
        };
      }
      return cycle;
    });
    
    setCycles(updatedCycles);
    
    toast({
      title: "Cycle closed",
      description: "The cycle has been closed and all windows are now locked."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="text-primary" />
            Review Cycles
          </h1>
          <p className="text-muted-foreground">
            Manage performance review cycles and windows
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Cycle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Review Cycle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateCycle)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cycle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., FY 2024-25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="quarterly">Quarterly (4 reviews per cycle)</SelectItem>
                          <SelectItem value="half-yearly">Half-Yearly (2 reviews per cycle)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit">Create Cycle</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {cycles.map((cycle) => (
          <Card key={cycle.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{cycle.name}</CardTitle>
                  <CardDescription>
                    {format(new Date(cycle.startDate), "d MMM yyyy")} - {format(new Date(cycle.endDate), "d MMM yyyy")}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(cycle.status)}>
                  {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Review Windows</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cycle.windows.map((window) => (
                          <TableRow key={window.id}>
                            <TableCell className="font-medium">{window.name}</TableCell>
                            <TableCell>
                              {format(new Date(window.startDate), "d MMM yyyy")} - {format(new Date(window.endDate), "d MMM yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(window.status)}>
                                {window.status.charAt(0).toUpperCase() + window.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {cycle.frequency === 'quarterly' ? '4 quarterly reviews' : '2 half-yearly reviews'}
                  </span>
                  {cycle.status === 'active' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => handleCloseCycle(cycle.id)}
                    >
                      Close Cycle
                    </Button>
                  )}
                  {cycle.status === 'closed' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <FileText className="h-4 w-4" /> Export Report
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
