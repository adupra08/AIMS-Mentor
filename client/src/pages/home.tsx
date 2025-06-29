import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import WelcomeHeader from "@/components/WelcomeHeader";
import QuickActions from "@/components/QuickActions";
import AIChatWidget from "@/components/AIChatWidget";
import PersonalizedPathway from "@/components/PersonalizedPathway";
import CurrentOpportunities from "@/components/CurrentOpportunities";
import TodoList from "@/components/TodoList";
import ProgressOverview from "@/components/ProgressOverview";
import RecommendedCourses from "@/components/RecommendedCourses";
import FloatingChatButton from "@/components/FloatingChatButton";
import { GraduationCap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: studentProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/student/profile"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Redirect to onboarding if profile doesn't exist or isn't complete
  useEffect(() => {
    if (!profileLoading && !studentProfile && isAuthenticated) {
      setLocation("/onboarding");
    }
  }, [studentProfile, profileLoading, isAuthenticated, setLocation]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentProfile) {
    return null; // Will redirect to onboarding
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-white text-lg" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">AIMS</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Pathways</a>
                <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Opportunities</a>
                <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Progress</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-primary">
                <Bell className="text-lg" />
              </button>
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <WelcomeHeader studentProfile={studentProfile} user={user} />

        {/* Quick Actions & AI Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          <AIChatWidget />
        </div>

        {/* Personalized Pathway */}
        <PersonalizedPathway studentProfile={studentProfile} />

        {/* Current Opportunities & To-Do */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CurrentOpportunities studentProfile={studentProfile} />
          <TodoList studentProfile={studentProfile} />
        </div>

        {/* Progress Overview */}
        <ProgressOverview studentProfile={studentProfile} />

        {/* Recommended AP Courses */}
        <RecommendedCourses studentProfile={studentProfile} />
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
