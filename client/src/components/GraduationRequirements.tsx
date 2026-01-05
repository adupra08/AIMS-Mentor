import { useQuery, useMutation } from "@tanstack/react-query";
import { BookOpen, CheckCircle, Clock, AlertCircle, Plus, Award, GraduationCap, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StudentProfile } from "@shared/schema";
import { useState, useEffect } from "react";

interface GraduationRequirementsProps {
  studentProfile: StudentProfile;
}

interface GraduationRequirement {
  id: number;
  state: string;
  district?: string;
  subject: string;
  courseTitle: string;
  creditsRequired: string;
  isMandatory: boolean;
  gradeLevel?: string;
  description?: string;
  alternatives?: string[];
}

interface StudentCourseProgress {
  id: number;
  studentId: number;
  requirementId?: number;
  courseName: string;
  creditsEarned: string;
  grade?: string;
  semester?: string;
  isCompleted: boolean;
  plannedSemester?: string;
}

const courseProgressSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  creditsEarned: z.string().min(1, "Credits earned is required"),
  grade: z.string().optional(),
  semester: z.string().optional(),
  isCompleted: z.boolean().default(false),
  plannedSemester: z.string().optional(),
  requirementId: z.number().optional(),
});

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function GraduationRequirements({ studentProfile }: GraduationRequirementsProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(studentProfile.state || "California");

  // Keep selectedState in sync with studentProfile.state
  useEffect(() => {
    if (studentProfile.state && studentProfile.state !== selectedState) {
      setSelectedState(studentProfile.state);
    }
  }, [studentProfile.state]);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/student/graduation-requirements", selectedState],
    queryFn: async () => {
      const response = await fetch(`/api/student/graduation-requirements?state=${selectedState}`);
      if (!response.ok) throw new Error("Failed to fetch graduation requirements");
      return response.json();
    },
  });

  const requirements: GraduationRequirement[] = (data as { requirements: GraduationRequirement[]; progress: StudentCourseProgress[] })?.requirements || [];
  const progress: StudentCourseProgress[] = (data as { requirements: GraduationRequirement[]; progress: StudentCourseProgress[] })?.progress || [];

  // Get available states
  const { data: statesData } = useQuery<{ states: string[] }>({
    queryKey: ["/api/graduation-requirements/states"],
    queryFn: async () => {
      const response = await fetch("/api/graduation-requirements/states");
      if (!response.ok) throw new Error("Failed to fetch states");
      return response.json();
    },
  });

  const availableStates: string[] = statesData?.states || US_STATES;

  // Update student profile state when changed
  const updateStateMutation = useMutation({
    mutationFn: async (newState: string) => {
      const response = await apiRequest("PATCH", "/api/student/profile", { state: newState });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/profile"] });
      toast({
        title: "State Updated",
        description: "Your state preference has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update state preference.",
        variant: "destructive",
      });
    },
  });

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    updateStateMutation.mutate(newState);
  };

  const form = useForm<z.infer<typeof courseProgressSchema>>({
    resolver: zodResolver(courseProgressSchema),
    defaultValues: {
      courseName: "",
      creditsEarned: "",
      grade: "",
      semester: "",
      isCompleted: false,
      plannedSemester: "",
    },
  });

  const addCourseMutation = useMutation({
    mutationFn: async (courseData: z.infer<typeof courseProgressSchema>) => {
      const response = await apiRequest("POST", "/api/student/course-progress", courseData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Course Added",
        description: "Course progress has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/student/graduation-requirements"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add course progress.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof courseProgressSchema>) => {
    addCourseMutation.mutate(values);
  };

  // Calculate progress for each requirement
  const getRequirementProgress = (requirement: GraduationRequirement) => {
    const relatedProgress = progress.filter(p => 
      p.requirementId === requirement.id || 
      p.courseName.toLowerCase().includes(requirement.subject.toLowerCase())
    );
    
    const totalEarned = relatedProgress.reduce((sum, p) => sum + parseFloat(p.creditsEarned || '0'), 0);
    const required = parseFloat(requirement.creditsRequired);
    const percentage = Math.min((totalEarned / required) * 100, 100);
    
    return {
      earned: totalEarned,
      required,
      percentage,
      courses: relatedProgress,
      isComplete: totalEarned >= required
    };
  };

  // Calculate overall graduation progress
  const totalRequiredCredits = requirements.reduce((sum, req) => sum + parseFloat(req.creditsRequired), 0);
  const totalEarnedCredits = progress.reduce((sum, p) => sum + parseFloat(p.creditsEarned || '0'), 0);
  const overallProgress = Math.min((totalEarnedCredits / totalRequiredCredits) * 100, 100);

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Graduation Requirements as per {studentProfile.state || 'your state'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Graduation Requirements
          </CardTitle>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="w-[180px]" data-testid="state-selector">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {availableStates.map((state) => (
                  <SelectItem key={state} value={state} data-testid={`state-option-${state.toLowerCase().replace(/\s+/g, '-')}`}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalEarnedCredits.toFixed(1)}</span> / {totalRequiredCredits} credits
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90" data-testid="add-course-button">
                <Plus className="w-4 h-4 mr-1" />
                Add Course
              </Button>
            </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Course Progress</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="courseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Algebra II, Biology, English 11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="creditsEarned"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credits Earned</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.5" placeholder="1.0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Fall 2024, Spring 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requirementId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fulfills Requirement (Optional)</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select requirement" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {requirements.map((req) => (
                                <SelectItem key={req.id} value={req.id.toString()}>
                                  {req.subject} - {req.courseTitle}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={addCourseMutation.isPending}>
                        {addCourseMutation.isPending ? "Adding..." : "Add Course"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{overallProgress.toFixed(1)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requirements.map((requirement) => {
            const reqProgress = getRequirementProgress(requirement);
            
            return (
              <div
                key={requirement.id}
                className={`border rounded-lg p-4 transition-colors ${
                  reqProgress.isComplete 
                    ? "border-green-200 bg-green-50" 
                    : "border-gray-200 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{requirement.courseTitle}</h3>
                      {reqProgress.isComplete && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {requirement.isMandatory && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{requirement.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {requirement.subject}
                      </span>
                      <span className="flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {requirement.creditsRequired} credits required
                      </span>
                      {requirement.gradeLevel && (
                        <span className="flex items-center">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Grades {requirement.gradeLevel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {reqProgress.earned.toFixed(1)} / {reqProgress.required} credits
                    </div>
                    <div className="text-xs text-gray-500">
                      {reqProgress.percentage.toFixed(0)}% complete
                    </div>
                  </div>
                </div>
                
                <Progress value={reqProgress.percentage} className="h-2 mb-3" />
                
                {reqProgress.courses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Completed Courses:</h4>
                    <div className="space-y-1">
                      {reqProgress.courses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{course.courseName}</span>
                            {course.grade && (
                              <Badge variant="outline" className="text-xs">
                                Grade: {course.grade}
                              </Badge>
                            )}
                            {course.semester && (
                              <span className="text-gray-500">({course.semester})</span>
                            )}
                          </div>
                          <span className="text-gray-700">{course.creditsEarned} credits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {requirement.alternatives && requirement.alternatives.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                    <span className="font-medium text-blue-700">Alternative courses:</span>
                    <span className="text-blue-600 ml-1">{requirement.alternatives.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {requirements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No graduation requirements found</p>
              <p className="text-sm mt-1">Requirements will be based on your state and district.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}