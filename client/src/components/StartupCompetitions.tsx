import { useQuery } from "@tanstack/react-query";
import { Opportunity } from "@shared/schema";
import { Calendar, MapPin, Users, Trophy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StartupCompetitions() {
  const { data: startupCompetitions = [], isLoading, error } = useQuery<Opportunity[]>({
    queryKey: ["/api/student/startup-competitions"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Failed to load startup competitions. Please try again.
      </div>
    );
  }

  if (startupCompetitions.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 text-lg font-medium">No matching startup competitions</p>
        <p className="text-gray-500">Based on your profile, there are no startup competitions matching your interests. Update your profile with entrepreneurship interests to see recommendations!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">High School Startup Competitions</h1>
        <p className="text-gray-600">Launch your business ideas and compete with other student entrepreneurs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startupCompetitions.map((competition) => (
          <Card key={competition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2">{competition.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {competition.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{competition.description}</p>

              <div className="space-y-2 text-sm">
                {competition.deadline && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>Deadline: {new Date(competition.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                {competition.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>{competition.location}</span>
                  </div>
                )}
                {competition.isTeamBased && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>Team-based</span>
                  </div>
                )}
                {competition.isPaid && (
                  <Badge variant="default" className="text-xs w-fit">
                    💰 Prize Money
                  </Badge>
                )}
              </div>

              {competition.applicationUrl && (
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    if (competition.applicationUrl) {
                      window.open(competition.applicationUrl, "_blank");
                    }
                  }}
                  data-testid={`button-apply-${competition.id}`}
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
