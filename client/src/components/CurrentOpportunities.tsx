import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Users, User, MapPin, Bookmark, ExternalLink, DollarSign, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StudentProfile } from "@shared/schema";

interface CurrentOpportunitiesProps {
  studentProfile: StudentProfile;
}

interface Opportunity {
  id: number;
  title: string;
  description: string;
  category: string;
  eligibleGrades: number[];
  subjects: string[];
  deadline: string;
  applicationUrl: string;
  isTeamBased: boolean;
  location: string;
  isPaid: boolean;
  difficultyLevel: string;
  tags: string[];
  matchScore?: number;
  matchReasons?: string[];
}

export default function CurrentOpportunities({ studentProfile }: CurrentOpportunitiesProps) {
  const { toast } = useToast();

  const { data: recommendedData, isLoading } = useQuery({
    queryKey: ["/api/student/recommended-opportunities"],
  });

  const { data: allOpportunities, isLoading: isLoadingAll } = useQuery({
    queryKey: ["/api/opportunities"],
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (opportunityId: number) => {
      const response = await apiRequest("POST", `/api/student/opportunities/${opportunityId}/bookmark`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bookmarked!",
        description: "Opportunity added to your saved list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/student/opportunities"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to bookmark opportunity.",
        variant: "destructive",
      });
    },
  });

  const handleBookmark = (opportunityId: number) => {
    bookmarkMutation.mutate(opportunityId);
  };

  const formatDate = (date: string | Date) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'TBD';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "competition":
        return "bg-blue-100 text-blue-800";
      case "internship":
        return "bg-green-100 text-green-800";
      case "scholarship":
        return "bg-purple-100 text-purple-800";
      case "program":
        return "bg-orange-100 text-orange-800";
      case "course":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || isLoadingAll) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Recommended For You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recommendedOpportunities = recommendedData?.recommended || [];
  const upcomingOpportunities = recommendedData?.upcoming || [];
  
  const displayOpportunities = recommendedOpportunities.length > 0 ? recommendedOpportunities : (upcomingOpportunities.slice(0, 4) || []);

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            {recommendedOpportunities.length > 0 ? "Recommended For You" : "Upcoming Opportunities"}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {displayOpportunities.length} matches found
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayOpportunities.slice(0, 6).map((opportunity: Opportunity) => (
            <div
              key={opportunity.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors aims-card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                    <Badge className={getCategoryColor(opportunity.category)}>
                      {opportunity.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                  {opportunity.matchReasons && opportunity.matchReasons.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {opportunity.matchScore}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {opportunity.matchReasons[0]}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>Due: {formatDate(opportunity.deadline)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>{opportunity.location}</span>
                    </div>
                    {opportunity.eligibleGrades && (
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        <span>Grades: {opportunity.eligibleGrades.join(', ')}</span>
                      </div>
                    )}
                    {opportunity.isTeamBased && (
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        <span>Team</span>
                      </div>
                    )}
                    {opportunity.isPaid && (
                      <div className="flex items-center">
                        <span className="text-green-600 font-medium">Paid</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {opportunity.tags && opportunity.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(opportunity.id)}
                        className="text-primary hover:text-primary/80"
                        disabled={bookmarkMutation.isPending}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {displayOpportunities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No opportunities found</p>
              <p className="text-sm mt-1">We're finding the best matches for your grade ({studentProfile.currentGrade}) and interests.</p>
              <p className="text-sm">Check back later for new opportunities!</p>
            </div>
          )}
          
          {displayOpportunities.length > 6 && (
            <div className="text-center pt-4">
              <Button variant="outline" size="sm">
                View All {displayOpportunities.length} Opportunities
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}