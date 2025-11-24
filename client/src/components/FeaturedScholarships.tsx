import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, DollarSign, Calendar, ArrowRight, GraduationCap } from "lucide-react";

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: number;
  provider: string;
  deadline: string | null;
  matchScore?: number;
  matchReasons?: string[];
}

interface FeaturedScholarshipsProps {
  onViewAll: () => void;
}

export default function FeaturedScholarships({ onViewAll }: FeaturedScholarshipsProps) {
  const { data: scholarshipsData, isLoading } = useQuery<{
    matched: Scholarship[];
    totalMatches: number;
  }>({
    queryKey: ['/api/student/matched-scholarships'],
  });

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Featured Scholarships
          </CardTitle>
          <CardDescription>Loading your matched scholarships...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topScholarships = scholarshipsData?.matched.slice(0, 3) || [];
  const totalMatches = scholarshipsData?.totalMatches || 0;

  if (topScholarships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Featured Scholarships
          </CardTitle>
          <CardDescription>Personalized scholarship recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Complete your profile to see matched scholarships
            </p>
            <Button variant="outline" size="sm" onClick={onViewAll}>
              Explore Scholarships
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Featured Scholarships
            </CardTitle>
            <CardDescription>
              {totalMatches} {totalMatches === 1 ? 'scholarship' : 'scholarships'} matched to your profile
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAll}
            className="text-primary hover:text-primary"
            data-testid="view-all-scholarships"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topScholarships.map((scholarship) => (
            <div 
              key={scholarship.id} 
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={onViewAll}
              data-testid={`featured-scholarship-${scholarship.id}`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 truncate">{scholarship.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{scholarship.provider}</p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="text-lg font-bold text-primary whitespace-nowrap">
                    ${scholarship.amount.toLocaleString()}
                  </div>
                  {scholarship.matchScore !== undefined && scholarship.matchScore > 0 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {Math.round(scholarship.matchScore)}% match
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {scholarship.description}
              </p>

              <div className="flex items-center justify-between">
                {scholarship.deadline && (
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className={getDeadlineColor(scholarship.deadline)}>
                      {formatDeadline(scholarship.deadline)}
                    </span>
                  </div>
                )}
                {scholarship.matchReasons && scholarship.matchReasons.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {scholarship.matchReasons[0]}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalMatches > 3 && (
          <Button 
            variant="outline" 
            className="w-full mt-4" 
            onClick={onViewAll}
            data-testid="view-more-scholarships"
          >
            View {totalMatches - 3} More Scholarships
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
