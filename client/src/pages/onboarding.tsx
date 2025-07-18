import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const onboardingSchema = z.object({
  currentGrade: z.number().min(9).max(12),
  currentGpa: z.string().optional(),
  currentSubjects: z.array(z.string()).min(1, "Please select at least one current subject"),
  interestedSubjects: z.array(z.string()).min(1, "Please select at least one interested subject"),
  dreamColleges: z.array(z.string()).optional(),
  customDreamColleges: z.array(z.string()).optional(),
  academicInterests: z.array(z.string()).min(1, "Please select at least one academic interest"),
  careerGoals: z.string().min(10, "Please provide your career goals (at least 10 characters)"),
  extracurricularActivities: z.array(z.string()).optional(),
  location: z.string().optional(),
  schoolDistrict: z.string().optional(),
}).refine((data) => {
  const totalColleges = (data.dreamColleges?.length || 0) + (data.customDreamColleges?.length || 0);
  return totalColleges > 0;
}, {
  message: "Please select at least one dream college or add a custom college",
  path: ["dreamColleges"],
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const CURRENT_SUBJECTS = [
  "Algebra I", "Algebra II", "Geometry", "Pre-Calculus", "Calculus",
  "Biology", "Chemistry", "Physics", "Earth Science",
  "English 9", "English 10", "English 11", "English 12",
  "World History", "US History", "Government", "Geography",
  "Spanish", "French", "German", "Chinese",
  "Art", "Music", "Theater", "Physical Education"
];

const INTERESTED_SUBJECTS = [
  "Mathematics", "Science", "English/Literature", "History", "Foreign Languages",
  "Computer Science", "Engineering", "Medicine", "Business", "Arts", "Music",
  "Psychology", "Economics", "Political Science", "Environmental Science"
];

const DREAM_COLLEGES = [
  { name: "Harvard University", location: "Cambridge, MA, USA" },
  { name: "Stanford University", location: "Stanford, CA, USA" },
  { name: "MIT", location: "Cambridge, MA, USA" },
  { name: "Princeton University", location: "Princeton, NJ, USA" },
  { name: "Yale University", location: "New Haven, CT, USA" },
  { name: "Columbia University", location: "New York, NY, USA" },
  { name: "University of Pennsylvania", location: "Philadelphia, PA, USA" },
  { name: "Duke University", location: "Durham, NC, USA" },
  { name: "Northwestern University", location: "Evanston, IL, USA" },
  { name: "Johns Hopkins University", location: "Baltimore, MD, USA" },
  { name: "University of Chicago", location: "Chicago, IL, USA" },
  { name: "California Institute of Technology", location: "Pasadena, CA, USA" },
  { name: "Cornell University", location: "Ithaca, NY, USA" },
  { name: "Rice University", location: "Houston, TX, USA" },
  { name: "Vanderbilt University", location: "Nashville, TN, USA" },
  { name: "University of Notre Dame", location: "Notre Dame, IN, USA" },
  { name: "Carnegie Mellon University", location: "Pittsburgh, PA, USA" },
  { name: "Emory University", location: "Atlanta, GA, USA" },
  { name: "Georgetown University", location: "Washington, DC, USA" },
  { name: "University of California, Berkeley", location: "Berkeley, CA, USA" },
  { name: "University of California, Los Angeles", location: "Los Angeles, CA, USA" },
  { name: "University of Michigan", location: "Ann Arbor, MI, USA" },
  { name: "University of Virginia", location: "Charlottesville, VA, USA" },
  { name: "University of North Carolina at Chapel Hill", location: "Chapel Hill, NC, USA" },
  { name: "University of Texas at Austin", location: "Austin, TX, USA" },
  { name: "Georgia Institute of Technology", location: "Atlanta, GA, USA" },
  { name: "University of Oxford", location: "Oxford, England, UK" },
  { name: "University of Cambridge", location: "Cambridge, England, UK" },
  { name: "London School of Economics", location: "London, England, UK" },
  { name: "University of Toronto", location: "Toronto, Ontario, Canada" },
  { name: "McGill University", location: "Montreal, Quebec, Canada" },
  { name: "University of British Columbia", location: "Vancouver, BC, Canada" },
  { name: "Australian National University", location: "Canberra, Australia" },
  { name: "University of Melbourne", location: "Melbourne, Australia" },
  { name: "University of Sydney", location: "Sydney, Australia" }
];

const ACADEMIC_INTERESTS = [
  "STEM Research", "Medical Research", "Engineering", "Computer Science",
  "Business & Entrepreneurship", "Liberal Arts", "Social Sciences",
  "Fine Arts", "Music & Performing Arts", "Environmental Studies",
  "International Relations", "Journalism", "Education", "Law"
];

const EXTRACURRICULAR_ACTIVITIES = [
  "Student Government", "Debate Team", "Model UN", "National Honor Society",
  "Science Olympiad", "Math Team", "Academic Decathlon", "Quiz Bowl",
  "Robotics Club", "Computer Science Club", "Drama Club", "Band/Orchestra",
  "Sports Teams", "Volunteer Work", "Community Service", "Internships"
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customCollegeInput, setCustomCollegeInput] = useState("");
  const totalSteps = 5;

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      currentSubjects: [],
      interestedSubjects: [],
      dreamColleges: [],
      customDreamColleges: [],
      academicInterests: [],
      extracurricularActivities: [],
      careerGoals: "",
      location: "",
      schoolDistrict: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      // Combine selected and custom dream colleges
      const allDreamColleges = [...data.dreamColleges, ...(data.customDreamColleges || [])];
      const response = await apiRequest("POST", "/api/student/profile", {
        ...data,
        dreamColleges: allDreamColleges,
        currentGpa: data.currentGpa || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Created!",
        description: "Welcome to AI Mentor for Students - AIMS! Your personalized academic journey starts now.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OnboardingData) => {
    createProfileMutation.mutate(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof OnboardingData)[] => {
    switch (step) {
      case 1: return ["currentGrade", "currentGpa"];
      case 2: return ["currentSubjects"];
      case 3: return ["interestedSubjects", "academicInterests"];
      case 4: return ["dreamColleges", "careerGoals"];
      case 5: return ["extracurricularActivities", "location", "schoolDistrict"];
      default: return [];
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with your current academic status</p>
            </div>
            
            <FormField
              control={form.control}
              name="currentGrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Grade Level *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="9">9th Grade (Freshman)</SelectItem>
                      <SelectItem value="10">10th Grade (Sophomore)</SelectItem>
                      <SelectItem value="11">11th Grade (Junior)</SelectItem>
                      <SelectItem value="12">12th Grade (Senior)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentGpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current GPA (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 3.8" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="4" 
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Subjects</h2>
              <p className="text-gray-600">What subjects are you currently taking?</p>
            </div>
            
            <FormField
              control={form.control}
              name="currentSubjects"
              render={() => (
                <FormItem>
                  <FormLabel>Select all subjects you're currently taking *</FormLabel>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {CURRENT_SUBJECTS.map((subject) => (
                      <FormField
                        key={subject}
                        control={form.control}
                        name="currentSubjects"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(subject)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, subject])
                                    : field.onChange(field.value?.filter((value) => value !== subject));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {subject}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Interests</h2>
              <p className="text-gray-600">What subjects and areas interest you most?</p>
            </div>
            
            <FormField
              control={form.control}
              name="interestedSubjects"
              render={() => (
                <FormItem>
                  <FormLabel>Subjects you're interested in studying *</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {INTERESTED_SUBJECTS.map((subject) => (
                      <FormField
                        key={subject}
                        control={form.control}
                        name="interestedSubjects"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(subject)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, subject])
                                    : field.onChange(field.value?.filter((value) => value !== subject));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {subject}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academicInterests"
              render={() => (
                <FormItem>
                  <FormLabel>Academic areas of focus *</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {ACADEMIC_INTERESTS.map((interest) => (
                      <FormField
                        key={interest}
                        control={form.control}
                        name="academicInterests"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, interest])
                                    : field.onChange(field.value?.filter((value) => value !== interest));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {interest}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">College Goals</h2>
              <p className="text-gray-600">Where do you dream of studying?</p>
            </div>
            
            <Tabs defaultValue="preset" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preset">Popular Colleges</TabsTrigger>
                <TabsTrigger value="custom">Add Your Own</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preset" className="space-y-4">
                <FormField
                  control={form.control}
                  name="dreamColleges"
                  render={() => (
                    <FormItem>
                      <FormLabel>Dream colleges (select up to 5) *</FormLabel>
                      <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                        {DREAM_COLLEGES.map((college) => (
                          <FormField
                            key={college.name}
                            control={form.control}
                            name="dreamColleges"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(college.name)}
                                    onCheckedChange={(checked) => {
                                      if (checked && field.value.length >= 5) {
                                        toast({
                                          title: "Limit Reached",
                                          description: "You can select up to 5 dream colleges.",
                                          variant: "destructive",
                                        });
                                        return;
                                      }
                                      return checked
                                        ? field.onChange([...field.value, college.name])
                                        : field.onChange(field.value?.filter((value) => value !== college.name));
                                    }}
                                  />
                                </FormControl>
                                <div className="flex-1">
                                  <FormLabel className="text-sm font-medium">
                                    {college.name}
                                  </FormLabel>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {college.location}
                                  </p>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-4">
                  <FormLabel>Add your dream colleges</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="e.g., Stanford University, California"
                      value={customCollegeInput}
                      onChange={(e) => setCustomCollegeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const customColleges = form.getValues("customDreamColleges") || [];
                          if (customCollegeInput.trim() && !customColleges.includes(customCollegeInput.trim())) {
                            form.setValue("customDreamColleges", [...customColleges, customCollegeInput.trim()]);
                            setCustomCollegeInput("");
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const customColleges = form.getValues("customDreamColleges") || [];
                        if (customCollegeInput.trim() && !customColleges.includes(customCollegeInput.trim())) {
                          form.setValue("customDreamColleges", [...customColleges, customCollegeInput.trim()]);
                          setCustomCollegeInput("");
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="customDreamColleges"
                    render={({ field }) => (
                      <FormItem>
                        {field.value && field.value.length > 0 && (
                          <div className="space-y-2">
                            <FormLabel>Your custom colleges:</FormLabel>
                            <div className="space-y-2">
                              {field.value.map((college, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{college}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedColleges = field.value.filter((_, i) => i !== index);
                                      form.setValue("customDreamColleges", updatedColleges);
                                    }}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Career Goals *
              </label>
              <textarea
                placeholder="Describe your career aspirations and what you hope to achieve..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={form.watch("careerGoals") || ""}
                onChange={(e) => {
                  form.setValue("careerGoals", e.target.value, { shouldValidate: true });
                }}
              />
              {form.formState.errors.careerGoals && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.careerGoals.message}
                </p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
              <p className="text-gray-600">Help us personalize your experience further</p>
            </div>
            
            <FormField
              control={form.control}
              name="extracurricularActivities"
              render={() => (
                <FormItem>
                  <FormLabel>Current or planned extracurricular activities</FormLabel>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {EXTRACURRICULAR_ACTIVITIES.map((activity) => (
                      <FormField
                        key={activity}
                        control={form.control}
                        name="extracurricularActivities"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(activity)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), activity])
                                    : field.onChange(field.value?.filter((value) => value !== activity));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {activity}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City, State)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Houston, TX" 
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School District</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Houston ISD" 
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-lg" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">AI Mentor for Students - AIMS</span>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={createProfileMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {createProfileMutation.isPending ? "Creating Profile..." : "Complete Setup"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
