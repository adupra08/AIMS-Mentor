import { useQuery } from "@tanstack/react-query";
import { Check, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentProfile } from "@shared/schema";

interface PersonalizedPathwayProps {
  studentProfile: StudentProfile;
}

export default function PersonalizedPathway({ studentProfile }: PersonalizedPathwayProps) {
  const { data: pathway, isLoading } = useQuery({
    queryKey: ["/api/student/pathway"],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-12 bg-gray-300 rounded-full mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dreamCollege = studentProfile.dreamColleges?.[0] || "Top University";
  const pathwayData = pathway?.pathwayData || {};

  const getGradeStatus = (grade: number) => {
    if (grade < studentProfile.currentGrade) return 'completed';
    if (grade === studentProfile.currentGrade) return 'current';
    return 'future';
  };

  const renderGradeColumn = (grade: number, tasks: any[] = []) => {
    const status = getGradeStatus(grade);
    const gradeLabel = grade === 9 ? "9th Grade" : 
                     grade === 10 ? "10th Grade" : 
                     grade === 11 ? "11th Grade" : "12th Grade";
    
    const statusLabel = status === 'completed' ? 'Completed' :
                       status === 'current' ? 'Current' : 'Future';

    const iconClass = status === 'completed' ? 'bg-secondary text-white' :
                     status === 'current' ? 'bg-blue-100 text-primary border-2 border-primary' :
                     'bg-gray-100 text-gray-400';

    const textClass = status === 'future' ? 'text-gray-400' : 'text-gray-900';
    const tasksOpacity = status === 'future' ? 'opacity-50' : 'opacity-100';

    return (
      <div key={grade} className="relative">
        <div className="text-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${iconClass}`}>
            {status === 'completed' ? (
              <Check className="text-lg" />
            ) : (
              <span className="text-lg font-bold">{grade}</span>
            )}
          </div>
          <h3 className={`font-semibold ${textClass}`}>{gradeLabel}</h3>
          <p className={`text-sm ${status === 'future' ? 'text-gray-400' : 'text-gray-500'}`}>
            {statusLabel}
          </p>
        </div>
        <div className={`space-y-3 ${tasksOpacity}`}>
          {tasks.slice(0, 3).map((task, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-3 ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' :
                task.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  task.status === 'completed' ? 'text-green-800' :
                  task.status === 'in_progress' ? 'text-blue-800' :
                  'text-gray-600'
                }`}>
                  {task.title}
                </span>
                {task.status === 'completed' ? (
                  <Check className="text-green-600 h-4 w-4" />
                ) : task.status === 'in_progress' ? (
                  <Clock className="text-blue-600 h-4 w-4" />
                ) : null}
              </div>
              {task.priority === 'high' && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  High Priority
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Your Personalized Pathway to {dreamCollege}
            </CardTitle>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View Full Pathway <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {renderGradeColumn(9, pathwayData.grade9)}
            {renderGradeColumn(10, pathwayData.grade10)}
            {renderGradeColumn(11, pathwayData.grade11)}
            {renderGradeColumn(12, pathwayData.grade12)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
