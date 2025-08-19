import { Calendar, TrendingUp, Target } from "lucide-react";
import { StudentProfile, User } from "@shared/schema";

interface WelcomeHeaderProps {
  studentProfile: StudentProfile;
  user: User | null;
}

export default function WelcomeHeader({ studentProfile, user }: WelcomeHeaderProps) {
  const firstName = user?.firstName || "Student";
  const dreamCollege = studentProfile.dreamColleges?.[0] || "your dream college";
  const progress = 68; // This would be calculated from actual progress data

  return (
    <div className="mb-8 animate-fade-in">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 animate-slide-up">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Let's continue your journey to {dreamCollege}
            </p>
            <div className="mt-4 flex items-center space-x-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  Grade: <span className="font-semibold">{studentProfile.currentGrade}th</span>
                </span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  GPA: <span className="font-semibold">{studentProfile.currentGpa || "N/A"}</span>
                </span>
              </div>
              <div className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  Progress: <span className="font-semibold">{progress}%</span>
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-bounce-gentle">
                <div className="text-center">
                  <div className="text-2xl font-bold animate-pulse-soft">{progress}%</div>
                  <div className="text-sm opacity-90">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
