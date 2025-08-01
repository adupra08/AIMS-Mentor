import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProfile } from "@shared/schema";

interface ProgressOverviewProps {
  studentProfile: StudentProfile;
}

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}

function ProgressCircle({ percentage, size = 80, strokeWidth = 8, color }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="progress-animate"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
}

export default function ProgressOverview({ studentProfile }: ProgressOverviewProps) {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ["/api/student/progress"],
  });

  // Calculate progress based on student profile and progress data
  const calculateProgress = () => {
    // Overall progress based on grade and completion
    const gradeProgress = ((studentProfile.currentGrade - 9) / 3) * 100;
    const overallProgress = Math.min(gradeProgress + 20, 100); // Add base progress

    // Academic performance based on GPA
    const gpaScore = studentProfile.currentGpa ? (parseFloat(studentProfile.currentGpa.toString()) / 4.0) * 100 : 75;
    
    // Extracurricular based on activities count
    const extracurricularCount = studentProfile.extracurricularActivities?.length || 0;
    const extracurricularProgress = Math.min(extracurricularCount * 15, 100);

    // Test prep based on test scores
    const hasTestScores = studentProfile.testScores && 
      (studentProfile.testScores.sat || studentProfile.testScores.act || studentProfile.testScores.psat);
    const testPrepProgress = hasTestScores ? 75 : (studentProfile.currentGrade >= 11 ? 30 : 20);

    return {
      overall: Math.round(overallProgress),
      academic: Math.round(gpaScore),
      extracurricular: Math.round(extracurricularProgress),
      testPrep: Math.round(testPrepProgress)
    };
  };

  const progress = calculateProgress();

  const progressItems = [
    {
      title: "Overall Progress",
      subtitle: `On track for ${studentProfile.dreamColleges?.[0] || "college"}`,
      percentage: progress.overall,
      color: "url(#gradient1)"
    },
    {
      title: "Academic Performance",
      subtitle: `GPA: ${studentProfile.currentGpa || "N/A"}/4.0`,
      percentage: progress.academic,
      color: "#10B981"
    },
    {
      title: "Extracurriculars",
      subtitle: progress.extracurricular < 50 ? "Need improvement" : "Good progress",
      percentage: progress.extracurricular,
      color: "#F59E0B"
    },
    {
      title: "Test Prep",
      subtitle: progress.testPrep < 50 ? "Just started" : "Making progress",
      percentage: progress.testPrep,
      color: "#8B5CF6"
    }
  ];

  if (isLoading) {
    return (
      <div className="mb-8">
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Academic Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Academic Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {progressItems.map((item, index) => (
              <div key={index} className="text-center">
                <div className="mb-3">
                  <ProgressCircle
                    percentage={item.percentage}
                    color={item.color}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Progress insights */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Progress Insights</h4>
            <div className="text-sm text-blue-800 space-y-1">
              {progress.overall >= 80 && (
                <p>🎉 Excellent progress! You're well on track for your dream college.</p>
              )}
              {progress.overall >= 60 && progress.overall < 80 && (
                <p>📈 Good progress! Focus on areas needing improvement.</p>
              )}
              {progress.overall < 60 && (
                <p>⚡ Time to accelerate! Consider increasing your involvement in key areas.</p>
              )}
              
              {progress.extracurricular < 50 && (
                <p>• Consider joining more extracurricular activities to strengthen your profile.</p>
              )}
              {progress.testPrep < 50 && studentProfile.currentGrade >= 10 && (
                <p>• Start preparing for standardized tests (SAT/ACT) to improve your scores.</p>
              )}
              {progress.academic >= 90 && (
                <p>• Outstanding academic performance! Keep up the excellent work.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
