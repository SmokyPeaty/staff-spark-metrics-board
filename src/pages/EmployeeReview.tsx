
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Employee, Review, ReviewStatus } from '@/types/employee';

// Mock data - In a real app, this would come from your API/database
const employeesData: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Sales Manager',
    department: 'Sales',
    email: 'john.smith@example.com',
    kpiProgress: 85,
    kpiCount: 6,
    status: 'on-track',
    manager: 'David Miller',
    reviews: []
  },
  // ... more employees would be here in a real app
];

const reviewSchema = z.object({
  selfAssessment: z.string().min(10, { message: "Assessment must be at least 10 characters" }).optional(),
  selfRating: z.number().min(1).max(5).optional(),
  managerAssessment: z.string().min(10, { message: "Assessment must be at least 10 characters" }).optional(),
  managerRating: z.number().min(1).max(5).optional(),
  goals: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function EmployeeReview() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [isManager, setIsManager] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      selfAssessment: "",
      selfRating: 3,
      managerAssessment: "",
      managerRating: 3,
      goals: "",
    }
  });

  // In a real app, you'd fetch employee data from your API
  useEffect(() => {
    if (id) {
      const foundEmployee = employeesData.find(emp => emp.id === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
        
        // For demo purposes, we'll assume the current user is either the employee or their manager
        // In a real app, you'd check the authenticated user's ID against the employee or their manager
        const userIsManager = Math.random() > 0.5; // Random for demo
        setIsManager(userIsManager);
        
        // Get or create review
        let existingReview = foundEmployee.reviews?.find(r => r.status !== 'reviewed');
        if (!existingReview) {
          existingReview = {
            id: uuidv4(),
            employeeId: foundEmployee.id,
            date: new Date().toISOString().split('T')[0],
            status: 'pending' as ReviewStatus,
          };
          
          if (!foundEmployee.reviews) {
            foundEmployee.reviews = [];
          }
          foundEmployee.reviews.push(existingReview);
        }
        
        setReview(existingReview);
        
        // Populate form with existing review data if available
        form.reset({
          selfAssessment: existingReview.selfAssessment || "",
          selfRating: existingReview.selfRating || 3,
          managerAssessment: existingReview.managerAssessment || "",
          managerRating: existingReview.managerRating || 3,
          goals: existingReview.goals || "",
        });
      }
    }
  }, [id, form]);

  const onSubmitSelfReview = (data: ReviewFormValues) => {
    if (!employee || !review) return;
    
    // Update review with self-assessment data
    review.selfAssessment = data.selfAssessment;
    review.selfRating = data.selfRating;
    review.goals = data.goals;
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
    
    // Update review with manager assessment data
    review.managerAssessment = data.managerAssessment;
    review.managerRating = data.managerRating;
    review.status = 'reviewed';
    
    toast({
      title: "Manager review submitted!",
      description: "The review process has been completed.",
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
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
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
              
              {/* Self Assessment Section */}
              <div className={isManager ? "opacity-70" : ""}>
                <h3 className="text-lg font-medium mb-4">Self Assessment</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="selfAssessment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your achievements and challenges:</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your work performance, achievements, and challenges from the past period..."
                            className="min-h-[120px]"
                            disabled={isManager || review?.status === 'submitted'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="selfRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How would you rate your overall performance?</FormLabel>
                        <Select
                          disabled={isManager || review?.status === 'submitted'}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Needs Improvement</SelectItem>
                            <SelectItem value="2">2 - Developing</SelectItem>
                            <SelectItem value="3">3 - Meeting Expectations</SelectItem>
                            <SelectItem value="4">4 - Exceeding Expectations</SelectItem>
                            <SelectItem value="5">5 - Outstanding</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goals for next period:</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your goals and areas of focus for the next period..."
                            className="min-h-[100px]"
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
                <div className={!isManager ? "opacity-70" : ""}>
                  <h3 className="text-lg font-medium mb-4 pt-6 border-t">Manager Assessment</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="managerAssessment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager feedback and assessment:</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide feedback on employee's performance..."
                              className="min-h-[120px]"
                              disabled={!isManager || review?.status === 'reviewed'}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="managerRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Performance rating:</FormLabel>
                          <Select
                            disabled={!isManager || review?.status === 'reviewed'}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 - Needs Improvement</SelectItem>
                              <SelectItem value="2">2 - Developing</SelectItem>
                              <SelectItem value="3">3 - Meeting Expectations</SelectItem>
                              <SelectItem value="4">4 - Exceeding Expectations</SelectItem>
                              <SelectItem value="5">5 - Outstanding</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
