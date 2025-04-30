
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Employee, Review, ReviewStatus, Kpi, KpiReview, Cycle, ReviewWindow } from '@/types/employee';

// Mock data - In a real app, this would come from your API/database
const employeesData: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Sales Manager',
    department: 'Sales',
    email: 'john.smith@example.com',
    kpiProgress: 85,
    kpiCount: 3,
    status: 'on-track',
    manager: 'David Miller',
    kpis: [
      {
        id: 'kpi1',
        name: 'Sales Target Achievement',
        description: 'Achieve quarterly sales targets as defined in the business plan',
        weight: 40,
        progress: 90
      },
      {
        id: 'kpi2',
        name: 'Team Management',
        description: 'Effective management of the sales team, including coaching and development',
        weight: 30,
        progress: 85
      },
      {
        id: 'kpi3',
        name: 'Customer Satisfaction',
        description: 'Maintain high customer satisfaction ratings based on surveys',
        weight: 30,
        progress: 80
      }
    ],
    reviews: []
  },
  // ... more employees would be here in a real app
];

// Mock cycle data
const cyclesData: Cycle[] = [
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

const ratingOptions = [
  { value: 1, label: '1 - Needs Improvement' },
  { value: 2, label: '2 - Developing' },
  { value: 3, label: '3 - Meeting Expectations' },
  { value: 4, label: '4 - Exceeding Expectations' },
  { value: 5, label: '5 - Outstanding' }
];

// Form schema for single KPI review
const kpiReviewSchema = z.object({
  selfRating: z.number().min(1).max(5).optional(),
  selfComment: z.string().optional(),
  managerRating: z.number().min(1).max(5).optional(),
  managerComment: z.string().optional(),
});

// Form schema for the entire review
const reviewSchema = z.object({
  cycleId: z.string().optional(),
  windowId: z.string().optional(),
  kpiReviews: z.array(kpiReviewSchema),
  finalManagerComment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function EmployeeReview() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>(cyclesData);
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<ReviewWindow | null>(null);
  const [isManager, setIsManager] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      kpiReviews: [],
      finalManagerComment: "",
    }
  });

  // In a real app, you'd fetch employee data from your API
  useEffect(() => {
    if (id) {
      const foundEmployee = employeesData.find(emp => emp.id === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
        
        // For demo purposes, we'll assume the current user is either the employee or their manager
        const userIsManager = Math.random() > 0.5; // Random for demo
        setIsManager(userIsManager);
        
        // Set the active cycle and window
        const activeCycle = cycles.find(c => c.status === 'active');
        if (activeCycle) {
          setSelectedCycle(activeCycle);
          const openWindow = activeCycle.windows.find(w => w.status === 'open');
          if (openWindow) {
            setSelectedWindow(openWindow);
          }
        }
        
        // Get or create review
        let existingReview = foundEmployee.reviews?.find(r => r.status !== 'reviewed');
        if (!existingReview && activeCycle) {
          const openWindow = activeCycle.windows.find(w => w.status === 'open');
          
          // Create KPI review objects
          const kpiReviews: KpiReview[] = foundEmployee.kpis?.map(kpi => ({
            kpiId: kpi.id,
            kpiName: kpi.name,
            weight: kpi.weight,
            selfRating: undefined,
            selfComment: "",
            managerRating: undefined,
            managerComment: "",
          })) || [];
          
          // Create new review
          existingReview = {
            id: uuidv4(),
            employeeId: foundEmployee.id,
            date: new Date().toISOString().split('T')[0],
            cycleId: activeCycle.id,
            windowId: openWindow?.id,
            status: 'pending' as ReviewStatus,
            kpiReviews: kpiReviews,
          };
          
          if (!foundEmployee.reviews) {
            foundEmployee.reviews = [];
          }
          foundEmployee.reviews.push(existingReview);
        }
        
        setReview(existingReview || null);
        
        // Populate form with existing review data
        if (existingReview) {
          const kpiReviewValues = existingReview.kpiReviews.map(kr => ({
            selfRating: kr.selfRating,
            selfComment: kr.selfComment || "",
            managerRating: kr.managerRating,
            managerComment: kr.managerComment || "",
          }));
          
          form.reset({
            cycleId: existingReview.cycleId,
            windowId: existingReview.windowId,
            kpiReviews: kpiReviewValues,
            finalManagerComment: existingReview.finalManagerComment || "",
          });
        }
      }
    }
  }, [id, form]);

  // Calculate overall rating based on weighted manager ratings
  const calculateOverallRating = (kpiReviews: KpiReview[]): number => {
    const totalWeight = kpiReviews.reduce((sum, kr) => sum + kr.weight, 0);
    if (totalWeight === 0) return 0;
    
    const weightedSum = kpiReviews.reduce((sum, kr) => {
      return sum + (kr.managerRating || 0) * kr.weight;
    }, 0);
    
    return parseFloat((weightedSum / totalWeight).toFixed(1));
  };

  const onSubmitSelfReview = (data: ReviewFormValues) => {
    if (!employee || !review) return;
    
    // Update each KPI review with self-assessment data
    review.kpiReviews.forEach((kr, index) => {
      kr.selfRating = data.kpiReviews[index].selfRating;
      kr.selfComment = data.kpiReviews[index].selfComment;
    });
    
    review.status = 'submitted';
    
    toast({
      title: "Self-review submitted!",
      description: "Your manager will be notified to review your submission.",
    });
    
    // In a real app, you'd send this data to your backend
    console.log("Self-review submitted:", review);
    
    // Force a re-render
    setReview({ ...review });
  };

  const onSubmitManagerReview = (data: ReviewFormValues) => {
    if (!employee || !review) return;
    
    // Update each KPI review with manager assessment data
    review.kpiReviews.forEach((kr, index) => {
      kr.managerRating = data.kpiReviews[index].managerRating;
      kr.managerComment = data.kpiReviews[index].managerComment;
    });
    
    // Set final manager comment
    review.finalManagerComment = data.finalManagerComment;
    
    // Calculate overall rating
    review.overallRating = calculateOverallRating(review.kpiReviews);
    
    review.status = 'reviewed';
    
    toast({
      title: "Manager review submitted!",
      description: "The review process has been completed with an overall rating of " + review.overallRating,
    });
    
    // In a real app, you'd send this data to your backend
    console.log("Manager review submitted:", review);
    
    // Force a re-render
    setReview({ ...review });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (!employee) {
    return <div className="p-8 text-center">Employee not found</div>;
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{employee.name} - Performance Review</h1>
            <p className="text-muted-foreground">
              {employee.position} • {employee.department}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedCycle && selectedWindow && (
            <div className="text-right">
              <div className="text-sm font-medium">{selectedCycle.name}</div>
              <div className="text-sm text-muted-foreground">{selectedWindow.name} Review</div>
            </div>
          )}
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isManager 
              ? "Manager Review" 
              : review?.status === 'submitted' 
                ? "Self Assessment (Submitted)" 
                : "Self Assessment"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={
              isManager 
                ? form.handleSubmit(onSubmitManagerReview) 
                : form.handleSubmit(onSubmitSelfReview)
            } className="space-y-6">
              
              {/* Cycle and Window Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cycleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Cycle</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const cycle = cycles.find(c => c.id === value);
                          if (cycle) setSelectedCycle(cycle);
                        }}
                        defaultValue={field.value}
                        disabled={review?.status !== 'pending'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cycle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cycles.map((cycle) => (
                            <SelectItem key={cycle.id} value={cycle.id}>{cycle.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="windowId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Window</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (selectedCycle) {
                            const window = selectedCycle.windows.find(w => w.id === value);
                            if (window) setSelectedWindow(window);
                          }
                        }}
                        defaultValue={field.value}
                        disabled={review?.status !== 'pending' || !selectedCycle}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select window" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedCycle?.windows.map((window) => (
                            <SelectItem key={window.id} value={window.id}>
                              {window.name} ({window.startDate} to {window.endDate})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              {/* KPI Reviews Section */}
              {review?.kpiReviews.map((kpiReview, kpiIndex) => (
                <Card key={kpiReview.kpiId} className="mb-6 border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{kpiReview.kpiName}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Weight: {kpiReview.weight}%
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Self Assessment Section */}
                      <div className={isManager ? "opacity-70" : ""}>
                        <h3 className="text-md font-medium mb-3">Self Assessment</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`kpiReviews.${kpiIndex}.selfRating`}
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel>Self Rating</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    className="flex flex-wrap gap-4"
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    value={field.value?.toString()}
                                    disabled={isManager || review?.status === 'submitted'}
                                  >
                                    {ratingOptions.map((option) => (
                                      <div key={option.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option.value.toString()} id={`rating-${kpiIndex}-${option.value}`} />
                                        <label htmlFor={`rating-${kpiIndex}-${option.value}`} className="text-sm">
                                          {option.label}
                                        </label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`kpiReviews.${kpiIndex}.selfComment`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Self Comment</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Add your comments regarding this KPI..."
                                    disabled={isManager || review?.status === 'submitted'}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Manager Assessment Section - only visible to managers or after review is completed */}
                      {(isManager || review?.status === 'reviewed') && (
                        <>
                          <Separator className="my-4" />
                          <div className={!isManager ? "opacity-70" : ""}>
                            <h3 className="text-md font-medium mb-3">Manager Assessment</h3>
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name={`kpiReviews.${kpiIndex}.managerRating`}
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormLabel>Manager Rating</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        className="flex flex-wrap gap-4"
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value?.toString()}
                                        disabled={!isManager || review?.status === 'reviewed'}
                                      >
                                        {ratingOptions.map((option) => (
                                          <div key={option.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.value.toString()} id={`manager-rating-${kpiIndex}-${option.value}`} />
                                            <label htmlFor={`manager-rating-${kpiIndex}-${option.value}`} className="text-sm">
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`kpiReviews.${kpiIndex}.managerComment`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Manager Comment</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Add manager comments regarding this KPI..."
                                        disabled={!isManager || review?.status === 'reviewed'}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Final Manager Comment & Overall Rating - Only for managers */}
              {(isManager || review?.status === 'reviewed') && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Overall Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={!isManager ? "opacity-70" : ""}>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="finalManagerComment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Final Manager Comments</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide overall feedback on employee's performance..."
                                  className="min-h-[120px]"
                                  disabled={!isManager || review?.status === 'reviewed'}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {review?.status === 'reviewed' && (
                          <div className="mt-4">
                            <FormLabel>Overall Rating (Auto-calculated)</FormLabel>
                            <div className="text-3xl font-bold mt-2">
                              {review.overallRating}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Calculated based on the weighted average of manager ratings
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <CardFooter className="px-0 pb-0">
                {!isManager && review?.status !== 'submitted' && (
                  <Button type="submit">Submit Self Assessment</Button>
                )}
                {isManager && review?.status === 'submitted' && (
                  <Button type="submit">Submit Manager Review</Button>
                )}
                {review?.status === 'reviewed' && (
                  <div className="text-green-600 font-medium">Review completed</div>
                )}
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
