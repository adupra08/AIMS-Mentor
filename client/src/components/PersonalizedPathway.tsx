import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Clock, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentProfile } from "@shared/schema";

interface PersonalizedPathwayProps {
  studentProfile: StudentProfile;
}

export default function PersonalizedPathway({ studentProfile }: PersonalizedPathwayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
  const pathwayData = (pathway as any)?.pathwayData || {};
  
  // Enhanced pathway data with additional details when expanded
  const getEnhancedPathwayData = () => {
    if (!pathwayData || Object.keys(pathwayData).length === 0) {
      return {
        grade9: [
          { title: "Build Strong Foundation", description: "Focus on core subjects and develop study habits", timeline: "Year-long", status: "in_progress", priority: "high", category: "Academic" },
          { title: "Explore Interests", description: "Join clubs and activities to discover passions", timeline: "Ongoing", status: "current", priority: "medium", category: "Extracurricular" },
          { title: "Develop Leadership", description: "Take on small leadership roles in activities", timeline: "Second semester", status: "future", priority: "medium", category: "Leadership" }
        ],
        grade10: [
          { title: "Take Challenging Courses", description: "Enroll in honors or pre-AP classes", timeline: "Course selection", status: "future", priority: "high", category: "Academic" },
          { title: "Community Service", description: "Begin regular volunteer work", timeline: "Monthly", status: "future", priority: "medium", category: "Service" },
          { title: "Standardized Test Prep", description: "Start PSAT preparation", timeline: "Fall semester", status: "future", priority: "medium", category: "Testing" }
        ],
        grade11: [
          { title: "AP Courses", description: "Take 3-4 AP courses in areas of interest", timeline: "Full year", status: "future", priority: "high", category: "Academic" },
          { title: "SAT/ACT Prep", description: "Intensive test preparation and taking", timeline: "Spring semester", status: "future", priority: "high", category: "Testing" },
          { title: "Leadership Positions", description: "Pursue major leadership roles", timeline: "Full year", status: "future", priority: "high", category: "Leadership" }
        ],
        grade12: [
          { title: "College Applications", description: "Apply to target colleges including " + dreamCollege, timeline: "Fall semester", status: "future", priority: "high", category: "College Prep" },
          { title: "Scholarship Applications", description: "Apply to relevant scholarships", timeline: "Fall/Winter", status: "future", priority: "high", category: "Financial" },
          { title: "Senior Project", description: "Complete capstone project or thesis", timeline: "Full year", status: "future", priority: "medium", category: "Academic" }
        ]
      };
    }
    return pathwayData;
  };
  
  const enhancedPathwayData = getEnhancedPathwayData();

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

    const displayTasks = isExpanded ? tasks : tasks.slice(0, 3);

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
          {displayTasks.map((task, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-3 ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' :
                task.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
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
              {isExpanded && task.description && (
                <p className="text-xs text-gray-600 mb-2">{task.description}</p>
              )}
              {isExpanded && task.timeline && (
                <p className="text-xs text-gray-500 mb-2">Timeline: {task.timeline}</p>
              )}
              {task.priority === 'high' && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  High Priority
                </Badge>
              )}
              {isExpanded && task.category && (
                <Badge variant="outline" className="mt-1 ml-1 text-xs">
                  {task.category}
                </Badge>
              )}
            </div>
          ))}
          {!isExpanded && tasks.length > 3 && (
            <div className="text-center pt-2">
              <span className="text-xs text-gray-500">
                +{tasks.length - 3} more items
              </span>
            </div>
          )}
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
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Collapse Pathway <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  View Full Pathway <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {renderGradeColumn(9, enhancedPathwayData.grade9)}
            {renderGradeColumn(10, enhancedPathwayData.grade10)}
            {renderGradeColumn(11, enhancedPathwayData.grade11)}
            {renderGradeColumn(12, enhancedPathwayData.grade12)}
          </div>
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Pathway Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Academic Focus Areas</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• STEM coursework preparation</li>
                    <li>• Advanced Placement program</li>
                    <li>• Research opportunities</li>
                    <li>• Academic competitions</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">Extracurricular Development</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Leadership positions</li>
                    <li>• Community service projects</li>
                    <li>• Subject-specific clubs</li>
                    <li>• Summer programs</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">Testing Strategy</h5>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• PSAT preparation (Grade 10)</li>
                    <li>• SAT/ACT testing timeline</li>
                    <li>• Subject test considerations</li>
                    <li>• Score improvement plan</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">College Preparation</h5>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Application timeline</li>
                    <li>• Essay writing preparation</li>
                    <li>• Letter of recommendation strategy</li>
                    <li>• Financial aid planning</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
