import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, DollarSign, Calendar, MapPin, BookmarkPlus, ExternalLink, Award, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: number;
  provider: string;
  deadline: string | null;
  applicationUrl: string | null;
  eligibleGrades: number[];
  minGpa: string | null;
  subjects: string[];
  states: string[];
  requiresEssay: boolean;
  requiresRecommendation: boolean;
  meritBased: boolean;
  financialNeedBased: boolean;
  renewable: boolean;
  tags: string[];
  matchScore?: number;
  matchReasons?: string[];
  isSaved?: boolean;
}

export default function Scholarships() {
  const { toast } = useToast();

  const { data: scholarshipsData, isLoading } = useQuery<{
    matched: Scholarship[];
    totalMatches: number;
  }>({
    queryKey: ['/api/student/matched-scholarships'],
  });

  const handleSaveScholarship = async (scholarshipId: number) => {
    try {
      await apiRequest(`/api/student/scholarships/${scholarshipId}/save`, {
        method: 'POST',
      });
      
      await queryClient.invalidateQueries({ queryKey: ['/api/student/matched-scholarships'] });
      
      toast({
        title: "Scholarship Saved",
        description: "Scholarship has been added to your saved list.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save scholarship. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    const today = new Date();
    const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return "Deadline passed";
    if (daysUntil === 0) return "Due today!";
    if (daysUntil === 1) return "Due tomorrow!";
    if (daysUntil <= 7) return `Due in ${daysUntil} days`;
    if (daysUntil <= 30) return `Due in ${daysUntil} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDeadlineColor = (deadline: string | null) => {
    if (!deadline) return "text-muted-foreground";
    const date = new Date(deadline);
    const today = new Date();
    const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return "text-muted-foreground";
    if (daysUntil <= 7) return "text-red-600 font-semibold";
    if (daysUntil <= 30) return "text-orange-600 font-semibold";
    return "text-foreground";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Scholarships</h2>
          <p className="text-muted-foreground">Loading matched scholarships...</p>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const scholarships = scholarshipsData?.matched || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Scholarships for You</h2>
        <p className="text-muted-foreground">
          {scholarships.length > 0 
            ? `Found ${scholarships.length} scholarships matched to your profile` 
            : "No scholarships match your current profile"}
        </p>
      </div>

      {scholarships.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Scholarships Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Complete your profile with GPA, test scores, and academic interests to get personalized scholarship recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1 flex items-center gap-2">
                      {scholarship.title}
                      {scholarship.isSaved && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4" />
                      {scholarship.provider}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${scholarship.amount.toLocaleString()}
                    </div>
                    {scholarship.renewable && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Renewable
                      </Badge>
                    )}
                  </div>
                </div>

                {scholarship.matchScore !== undefined && scholarship.matchScore > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm font-medium">Match Score:</div>
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(scholarship.matchScore, 100)}%` }}
                        />
                      </div>
                      <div className="text-sm font-semibold">{Math.round(scholarship.matchScore)}%</div>
                    </div>
                    {scholarship.matchReasons && scholarship.matchReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {scholarship.matchReasons.slice(0, 3).map((reason, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {scholarship.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {scholarship.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={getDeadlineColor(scholarship.deadline)}>
                        {formatDeadline(scholarship.deadline)}
                      </span>
                    </div>
                  )}

                  {scholarship.eligibleGrades.length > 0 && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>Grades {scholarship.eligibleGrades.join(', ')}</span>
                    </div>
                  )}

                  {scholarship.minGpa && (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Min GPA: {scholarship.minGpa}</span>
                    </div>
                  )}

                  {scholarship.states.length > 0 && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{scholarship.states.join(', ')}</span>
                    </div>
                  )}
                </div>

                {scholarship.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {scholarship.subjects.slice(0, 5).map((subject, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {scholarship.requiresEssay && (
                    <Badge variant="secondary" className="text-xs">Essay Required</Badge>
                  )}
                  {scholarship.requiresRecommendation && (
                    <Badge variant="secondary" className="text-xs">Recommendation Required</Badge>
                  )}
                  {scholarship.meritBased && (
                    <Badge variant="secondary" className="text-xs">Merit-Based</Badge>
                  )}
                  {scholarship.financialNeedBased && (
                    <Badge variant="secondary" className="text-xs">Need-Based</Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {!scholarship.isSaved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveScholarship(scholarship.id)}
                      data-testid={`save-scholarship-${scholarship.id}`}
                    >
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Save for Later
                    </Button>
                  )}
                  {scholarship.applicationUrl && (
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      data-testid={`apply-scholarship-${scholarship.id}`}
                    >
                      <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Now
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
