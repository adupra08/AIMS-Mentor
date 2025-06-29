import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Users, User, MapPin, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StudentProfile } from "@shared/schema";

interface CurrentOpportunitiesProps {
  studentProfile: StudentProfile;
}

export default function CurrentOpportunities({ studentProfile }: CurrentOpportunitiesProps) {
  const { toast } = useToast();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["/api/opportunities", {
      grades: [studentProfile.currentGrade],
      subjects: studentProfile.academicInterests,
    }],
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

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Upcoming Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="flex space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleBookmark = (opportunityId: number) => {
    bookmarkMutation.mutate(opportunityId);
  };

  const getMatchBadge = (opportunity: any) => {
    const matchingInterests = opportunity.subjects?.filter((subject: string) =>
      studentProfile.academicInterests?.includes(subject)
    ).length || 0;

    if (matchingInterests >= 2) {
      return <Badge className="bg-secondary/20 text-secondary">Perfect Match</Badge>;
    } else if (matchingInterests >= 1) {
      return <Badge className="bg-accent/20 text-accent">High Match</Badge>;
    } else {
      return <Badge variant="secondary">Good Match</Badge>;
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Upcoming Opportunities</CardTitle>
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities?.slice(0, 3).map((opportunity: any) => (
            <div
              key={opportunity.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors aims-card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Due: {opportunity.deadline 
                        ? new Date(opportunity.deadline).toLocaleDateString()
                        : "Rolling"
                      }
                    </span>
                    <span className="flex items-center">
                      {opportunity.isTeamBased ? (
                        <>
                          <Users className="mr-1 h-3 w-3" />
                          Team Based
                        </>
                      ) : (
                        <>
                          <User className="mr-1 h-3 w-3" />
                          Individual
                        </>
                      )}
                    </span>
                    {opportunity.location && (
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {opportunity.location}
                      </span>
                    )}
                    {getMatchBadge(opportunity)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(opportunity.id)}
                  disabled={bookmarkMutation.isPending}
                  className="ml-4 text-primary hover:text-primary/80"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {!opportunities?.length && (
            <div className="text-center py-8 text-gray-500">
              <p>No opportunities found matching your profile.</p>
              <p className="text-sm mt-1">Check back later or adjust your interests.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
