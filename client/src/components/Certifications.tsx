import { useQuery } from "@tanstack/react-query";
import { Opportunity } from "@shared/schema";
import { Calendar, MapPin, Award, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Certifications() {
  const { data: opportunities = [], isLoading, error } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const certifications = opportunities.filter(
    opp => opp.category === "certification"
  );

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
        Failed to load certifications. Please try again.
      </div>
    );
  }

  if (certifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 text-lg font-medium">No free certifications available</p>
        <p className="text-gray-500">Check back soon for new opportunities!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Free Certifications</h1>
        <p className="text-gray-600">Earn recognized certificates to boost your college applications and career prospects</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2">{cert.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {cert.subjects?.map((subject) => (
                  <Badge key={subject} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{cert.description}</p>

              <div className="space-y-2 text-sm">
                {cert.difficultyLevel && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        cert.difficultyLevel === "beginner"
                          ? "secondary"
                          : cert.difficultyLevel === "intermediate"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs capitalize"
                    >
                      {cert.difficultyLevel}
                    </Badge>
                  </div>
                )}
                {cert.deadline && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>Deadline: {new Date(cert.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                {cert.location && cert.location !== "Online" && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>{cert.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <Award className="w-4 h-4" />
                  <span>Free!</span>
                </div>
              </div>

              {cert.applicationUrl && (
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    if (cert.applicationUrl) {
                      window.open(cert.applicationUrl, "_blank");
                    }
                  }}
                  data-testid={`button-enroll-${cert.id}`}
                >
                  Enroll Now
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
