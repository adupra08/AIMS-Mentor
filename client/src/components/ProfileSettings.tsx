import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User, Mail, Save, X, GraduationCap, Settings, Activity, BookOpen, Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const EXTRACURRICULAR_ACTIVITIES = [
  "Student Government", "Debate Team", "Model UN", "National Honor Society",
  "Science Olympiad", "Math Team", "Academic Decathlon", "Quiz Bowl",
  "Robotics Club", "Computer Science Club", "Drama Club", "Band/Orchestra",
  "Sports Teams", "Volunteer Work", "Community Service", "Internships"
];

const ACADEMIC_INTERESTS = [
  "STEM Research", "Medical Research", "Engineering", "Computer Science",
  "Business & Entrepreneurship", "Liberal Arts", "Social Sciences",
  "Fine Arts", "Music & Performing Arts", "Environmental Studies",
  "International Relations", "Journalism", "Education", "Law"
];

const INTERESTED_SUBJECTS = [
  "Mathematics", "Science", "English/Literature", "History", "Foreign Languages",
  "Computer Science", "Engineering", "Medicine", "Business", "Arts", "Music",
  "Psychology", "Economics", "Political Science", "Environmental Science"
];

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [academicFormData, setAcademicFormData] = useState({
    extracurricularActivities: [] as string[],
    academicInterests: [] as string[],
    interestedSubjects: [] as string[],
    currentGpa: undefined as number | undefined,
    testScores: {
      sat: undefined as number | undefined,
      act: undefined as number | undefined,
      psat: undefined as number | undefined
    }
  });
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: studentProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["/api/student/profile"],
  });

  // Type-safe user access
  const userData = user as any;
  const profileData = studentProfile as any;

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { firstName: string; lastName: string }) => {
      const response = await apiRequest("PATCH", "/api/auth/user", updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateAcademicProfileMutation = useMutation({
    mutationFn: async (updates: {
      extracurricularActivities?: string[];
      academicInterests?: string[];
      interestedSubjects?: string[];
      currentGpa?: number;
      testScores?: {sat?: number, act?: number, psat?: number};
    }) => {
      const response = await apiRequest("PUT", `/api/student/profile/${profileData?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Academic Profile Updated",
        description: "Your academic interests and activities have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/student/profile"] });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update academic profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const response = await apiRequest("POST", "/api/auth/change-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Changed!",
        description: "Your password has been successfully updated.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password Change Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || ""
      });
    }
    if (profileData) {
      setAcademicFormData({
        extracurricularActivities: profileData.extracurricularActivities || [],
        academicInterests: profileData.academicInterests || [],
        interestedSubjects: profileData.interestedSubjects || [],
        currentGpa: profileData.currentGpa ? parseFloat(profileData.currentGpa) : undefined,
        testScores: {
          sat: profileData.testScores?.sat || undefined,
          act: profileData.testScores?.act || undefined,
          psat: profileData.testScores?.psat || undefined
        }
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (activeTab === "basic") {
      updateProfileMutation.mutate({
        firstName: formData.firstName,
        lastName: formData.lastName
      });
    } else if (activeTab === "academic") {
      updateAcademicProfileMutation.mutate(academicFormData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: ""
    });
    setAcademicFormData({
      extracurricularActivities: [],
      academicInterests: [],
      interestedSubjects: [],
      currentGpa: undefined,
      testScores: {
        sat: undefined,
        act: undefined,
        psat: undefined
      }
    });
  };

  const handleExtracurricularChange = (activity: string, checked: boolean) => {
    setAcademicFormData(prev => ({
      ...prev,
      extracurricularActivities: checked
        ? [...prev.extracurricularActivities, activity]
        : prev.extracurricularActivities.filter(item => item !== activity)
    }));
  };

  const handleAcademicInterestChange = (interest: string, checked: boolean) => {
    setAcademicFormData(prev => ({
      ...prev,
      academicInterests: checked
        ? [...prev.academicInterests, interest]
        : prev.academicInterests.filter(item => item !== interest)
    }));
  };

  const handleInterestedSubjectChange = (subject: string, checked: boolean) => {
    setAcademicFormData(prev => ({
      ...prev,
      interestedSubjects: checked
        ? [...prev.interestedSubjects, subject]
        : prev.interestedSubjects.filter(item => item !== subject)
    }));
  };

  const handleTestScoreChange = (testType: 'sat' | 'act' | 'psat', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    setAcademicFormData(prev => ({
      ...prev,
      testScores: {
        ...prev.testScores,
        [testType]: numValue
      }
    }));
  };

  const handleGpaChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setAcademicFormData(prev => ({
      ...prev,
      currentGpa: numValue
    }));
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Profile Settings</CardTitle>
          {!isEditing ? (
            <Button variant="outline" onClick={handleEdit}>
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending || updateAcademicProfileMutation.isPending}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={updateProfileMutation.isPending || updateAcademicProfileMutation.isPending}
              >
                <Save className="mr-1 h-4 w-4" />
                {(updateProfileMutation.isPending || updateAcademicProfileMutation.isPending) ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={userData?.profileImageUrl} alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(userData?.firstName, userData?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {userData?.firstName || userData?.lastName ? 
                  `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() : 
                  "User"
                }
              </h3>
              <p className="text-sm text-gray-500 flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {userData?.email || "No email provided"}
              </p>
            </div>
          </div>

          {/* Tabs for Basic and Academic Profile */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-0">
              <TabsTrigger value="basic" className="flex items-center justify-center text-xs sm:text-sm py-2">
                <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Basic Info</span>
                <span className="xs:hidden">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center justify-center text-xs sm:text-sm py-2">
                <GraduationCap className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Academic Profile</span>
                <span className="sm:hidden">Academic</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center justify-center text-xs sm:text-sm py-2">
                <Lock className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Password</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="min-h-[40px] px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {userData?.firstName || "Not provided"}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="min-h-[40px] px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                      {userData?.lastName || "Not provided"}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="min-h-[40px] px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center text-gray-600">
                  {userData?.email || "No email provided"}
                  <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                </div>
              </div>

              {/* Account Information */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Account Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Account ID: {userData?.id}</p>
                  <p>Member since: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6 mt-4">
              {isProfileLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current GPA */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Current GPA</Label>
                    </div>
                    
                    {isEditing ? (
                      <div className="border border-gray-200 rounded-md p-4">
                        <div className="max-w-xs">
                          <Label htmlFor="gpa" className="text-sm font-medium">GPA (4.0 Scale)</Label>
                          <Input
                            id="gpa"
                            type="number"
                            step="0.01"
                            min="0.00"
                            max="4.00"
                            placeholder="Enter your current GPA"
                            value={academicFormData.currentGpa || ''}
                            onChange={(e) => handleGpaChange(e.target.value)}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-500 mt-1">Update this each year as your GPA changes</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        {profileData?.currentGpa ? (
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary">{parseFloat(profileData.currentGpa).toFixed(2)}</div>
                              <div className="text-sm text-gray-600">Current GPA</div>
                            </div>
                            <div className="text-sm text-gray-500">
                              <p>Grade {profileData.currentGrade} • 4.0 Scale</p>
                              <p className="text-xs">Update annually to track progress</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <GraduationCap className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-500 text-sm">GPA not entered yet</p>
                            <p className="text-xs text-gray-400 mt-1">Add your current GPA to track academic progress</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Extracurricular Activities */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Extracurricular Activities</Label>
                    </div>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                        {EXTRACURRICULAR_ACTIVITIES.map((activity) => (
                          <div key={activity} className="flex items-start space-x-3 space-y-0">
                            <Checkbox
                              checked={academicFormData.extracurricularActivities.includes(activity)}
                              onCheckedChange={(checked) => handleExtracurricularChange(activity, !!checked)}
                            />
                            <Label className="text-sm font-normal leading-tight">
                              {activity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        {profileData?.extracurricularActivities?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profileData.extracurricularActivities.map((activity: string) => (
                              <span key={activity} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {activity}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No extracurricular activities selected</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Academic Interests */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Academic Interests</Label>
                    </div>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                        {ACADEMIC_INTERESTS.map((interest) => (
                          <div key={interest} className="flex items-start space-x-3 space-y-0">
                            <Checkbox
                              checked={academicFormData.academicInterests.includes(interest)}
                              onCheckedChange={(checked) => handleAcademicInterestChange(interest, !!checked)}
                            />
                            <Label className="text-sm font-normal leading-tight">
                              {interest}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        {profileData?.academicInterests?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profileData.academicInterests.map((interest: string) => (
                              <span key={interest} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {interest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No academic interests selected</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Interested Subjects */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Interested Subjects</Label>
                    </div>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                        {INTERESTED_SUBJECTS.map((subject) => (
                          <div key={subject} className="flex items-start space-x-3 space-y-0">
                            <Checkbox
                              checked={academicFormData.interestedSubjects.includes(subject)}
                              onCheckedChange={(checked) => handleInterestedSubjectChange(subject, !!checked)}
                            />
                            <Label className="text-sm font-normal leading-tight">
                              {subject}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        {profileData?.interestedSubjects?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profileData.interestedSubjects.map((subject: string) => (
                              <span key={subject} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {subject}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No interested subjects selected</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Test Scores */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      <Label className="text-base font-medium">Test Scores</Label>
                    </div>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor="sat-score" className="text-sm font-medium">SAT Score</Label>
                          <Input
                            id="sat-score"
                            type="number"
                            placeholder="1600 max"
                            min="400"
                            max="1600"
                            value={academicFormData.testScores.sat || ''}
                            onChange={(e) => handleTestScoreChange('sat', e.target.value)}
                            className="text-center"
                          />
                          <p className="text-xs text-gray-500 text-center">400-1600</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="act-score" className="text-sm font-medium">ACT Score</Label>
                          <Input
                            id="act-score"
                            type="number"
                            placeholder="36 max"
                            min="1"
                            max="36"
                            value={academicFormData.testScores.act || ''}
                            onChange={(e) => handleTestScoreChange('act', e.target.value)}
                            className="text-center"
                          />
                          <p className="text-xs text-gray-500 text-center">1-36</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="psat-score" className="text-sm font-medium">PSAT Score</Label>
                          <Input
                            id="psat-score"
                            type="number"
                            placeholder="1520 max"
                            min="320"
                            max="1520"
                            value={academicFormData.testScores.psat || ''}
                            onChange={(e) => handleTestScoreChange('psat', e.target.value)}
                            className="text-center"
                          />
                          <p className="text-xs text-gray-500 text-center">320-1520</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        {(profileData?.testScores?.sat || profileData?.testScores?.act || profileData?.testScores?.psat) ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {profileData?.testScores?.sat && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{profileData.testScores.sat}</div>
                                <div className="text-sm text-gray-600">SAT Score</div>
                              </div>
                            )}
                            {profileData?.testScores?.act && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{profileData.testScores.act}</div>
                                <div className="text-sm text-gray-600">ACT Score</div>
                              </div>
                            )}
                            {profileData?.testScores?.psat && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{profileData.testScores.psat}</div>
                                <div className="text-sm text-gray-600">PSAT Score</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-500 text-sm">No test scores recorded yet</p>
                            <p className="text-xs text-gray-400 mt-1">Add your SAT, ACT, or PSAT scores to track your progress</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password" className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Enter your current password"
                      className="pl-10 pr-10"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      data-testid="input-current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      data-testid="toggle-current-password"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter your new password"
                      className="pl-10 pr-10"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      data-testid="input-new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      data-testid="toggle-new-password"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className="pl-10 pr-10"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      data-testid="input-confirm-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      data-testid="toggle-confirm-password"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => {
                      if (passwordData.newPassword !== passwordData.confirmPassword) {
                        toast({
                          title: "Password Mismatch",
                          description: "New passwords don't match",
                          variant: "destructive",
                        });
                        return;
                      }
                      changePasswordMutation.mutate(passwordData);
                    }}
                    disabled={changePasswordMutation.isPending || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="flex items-center"
                    data-testid="button-change-password"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}