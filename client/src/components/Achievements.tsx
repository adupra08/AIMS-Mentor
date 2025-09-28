import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Achievement, insertAchievementSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Trophy, 
  Award, 
  BookOpen, 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Calendar as CalendarIcon,
  Tag,
  MapPin,
  Building,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const achievementFormSchema = insertAchievementSchema.extend({
  skills: z.array(z.string()).optional(),
}).omit({ studentId: true, createdAt: true, updatedAt: true });

type AchievementFormData = z.infer<typeof achievementFormSchema>;

export default function Achievements() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [skillInput, setSkillInput] = useState("");

  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/student/achievements"],
  });

  const form = useForm<AchievementFormData>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "competition",
      category: "academic",
      organization: "",
      location: "",
      ranking: "",
      certificateUrl: "",
      publicationUrl: "",
      skills: [],
      isVerified: false,
      verificationNotes: "",
      dateAchieved: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AchievementFormData) => {
      const response = await apiRequest("POST", "/api/student/achievements", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/achievements"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Achievement Added!",
        description: "Your achievement has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add achievement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AchievementFormData> }) => {
      const response = await apiRequest("PATCH", `/api/student/achievements/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/achievements"] });
      setEditingAchievement(null);
      form.reset();
      toast({
        title: "Achievement Updated!",
        description: "Your achievement has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update achievement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/student/achievements/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/achievements"] });
      toast({
        title: "Achievement Deleted",
        description: "The achievement has been removed from your profile.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete achievement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AchievementFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Form is valid:", form.formState.isValid);
    
    if (editingAchievement) {
      updateMutation.mutate({ id: editingAchievement.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    form.reset({
      ...achievement,
      dateAchieved: achievement.dateAchieved ? new Date(achievement.dateAchieved) : undefined,
      skills: achievement.skills || [],
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      deleteMutation.mutate(id);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = form.getValues("skills") || [];
      if (!currentSkills.includes(skillInput.trim())) {
        form.setValue("skills", [...currentSkills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills") || [];
    form.setValue("skills", currentSkills.filter(skill => skill !== skillToRemove));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "competition": return <Trophy className="w-5 h-5" />;
      case "research": return <BookOpen className="w-5 h-5" />;
      case "certification": return <FileText className="w-5 h-5" />;
      case "award": return <Award className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "competition": return "bg-blue-100 text-blue-800";
      case "research": return "bg-green-100 text-green-800";
      case "certification": return "bg-purple-100 text-purple-800";
      case "award": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic": return "bg-indigo-100 text-indigo-800";
      case "extracurricular": return "bg-orange-100 text-orange-800";
      case "leadership": return "bg-red-100 text-red-800";
      case "technical": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const type = achievement.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Achievements</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                onClick={() => {
                  setEditingAchievement(null);
                  form.reset({
                    title: "",
                    description: "",
                    type: "competition",
                    category: "academic",
                    organization: "",
                    location: "",
                    ranking: "",
                    certificateUrl: "",
                    publicationUrl: "",
                    skills: [],
                    isVerified: false,
                    verificationNotes: "",
                    dateAchieved: undefined,
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAchievement ? "Edit Achievement" : "Add New Achievement"}
                </DialogTitle>
                <DialogDescription>
                  {editingAchievement 
                    ? "Update your achievement details below." 
                    : "Add a new achievement to your profile. Include competitions, research papers, certifications, or awards."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Achievement Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., First Place in Science Fair" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="competition">Competition</SelectItem>
                              <SelectItem value="research">Research</SelectItem>
                              <SelectItem value="certification">Certification</SelectItem>
                              <SelectItem value="award">Award</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your achievement, what you accomplished, and its significance..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="extracurricular">Extracurricular</SelectItem>
                              <SelectItem value="leadership">Leadership</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateAchieved"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Achieved</FormLabel>
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
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Google, MIT, Science Fair" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., San Francisco, CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ranking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ranking/Result</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1st Place, Finalist, Honorable Mention" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="certificateUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate/Proof URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="publicationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Skills</FormLabel>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Add a skill..."
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addSkill();
                                }
                              }}
                            />
                            <Button type="button" variant="outline" onClick={addSkill}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="pr-1">
                                  {skill}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                                    onClick={() => removeSkill(skill)}
                                  >
                                    ×
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingAchievement ? "Update" : "Add"} Achievement
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your achievement portfolio by adding competitions, research, certifications, and awards.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Achievement
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="competition">Competitions</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="certification">Certifications</TabsTrigger>
              <TabsTrigger value="award">Awards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-4">
              {Object.entries(groupedAchievements).map(([type, typeAchievements]) => (
                <div key={type}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize flex items-center">
                    {getTypeIcon(type)}
                    <span className="ml-2">{type}s ({typeAchievements.length})</span>
                  </h3>
                  <div className="grid gap-4">
                    {typeAchievements.map((achievement) => (
                      <AchievementCard 
                        key={achievement.id} 
                        achievement={achievement}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        getTypeColor={getTypeColor}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            {Object.entries(groupedAchievements).map(([type, typeAchievements]) => (
              <TabsContent key={type} value={type} className="space-y-4 mt-4">
                <div className="grid gap-4">
                  {typeAchievements.map((achievement) => (
                    <AchievementCard 
                      key={achievement.id} 
                      achievement={achievement}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      getTypeColor={getTypeColor}
                      getCategoryColor={getCategoryColor}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: number) => void;
  getTypeColor: (type: string) => string;
  getCategoryColor: (category: string) => string;
}

function AchievementCard({ achievement, onEdit, onDelete, getTypeColor, getCategoryColor }: AchievementCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
            <div className="flex items-center space-x-2">
              <Badge className={getTypeColor(achievement.type || "other")}>
                {achievement.type}
              </Badge>
              {achievement.category && (
                <Badge className={getCategoryColor(achievement.category)}>
                  {achievement.category}
                </Badge>
              )}
            </div>
          </div>
          
          {achievement.description && (
            <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
            {achievement.organization && (
              <div className="flex items-center">
                <Building className="w-3 h-3 mr-1" />
                {achievement.organization}
              </div>
            )}
            {achievement.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {achievement.location}
              </div>
            )}
            {achievement.dateAchieved && (
              <div className="flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {format(new Date(achievement.dateAchieved), "MMM yyyy")}
              </div>
            )}
            {achievement.ranking && (
              <div className="flex items-center">
                <Trophy className="w-3 h-3 mr-1" />
                {achievement.ranking}
              </div>
            )}
          </div>
          
          {achievement.skills && achievement.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {achievement.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {achievement.certificateUrl && (
              <a
                href={achievement.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FileText className="w-3 h-3 mr-1" />
                Certificate
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
            {achievement.publicationUrl && (
              <a
                href={achievement.publicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Publication
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(achievement)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(achievement.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}