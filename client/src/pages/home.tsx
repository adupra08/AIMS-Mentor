import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { StudentProfile, User } from "@shared/schema";
import WelcomeHeader from "@/components/WelcomeHeader";
import QuickActions from "@/components/QuickActions";

import PersonalizedPathway from "@/components/PersonalizedPathway";
import CurrentOpportunities from "@/components/CurrentOpportunities";
import TodoList from "@/components/TodoList";
import ProgressOverview from "@/components/ProgressOverview";
import RecommendedCourses from "@/components/RecommendedCourses";
import Achievements from "@/components/Achievements";
import GraduationRequirements from "@/components/GraduationRequirements";
import FloatingChatButton from "@/components/FloatingChatButton";
import Footer from "@/components/Footer";

import { GraduationCap, Bell, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please sign in again.",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/");
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  const { data: studentProfile, isLoading: profileLoading } = useQuery<StudentProfile>({
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

  const queryClient = useQueryClient();

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
      // Even if logout fails, redirect to landing page for security
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
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
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-white text-base sm:text-lg" />
                  </div>
                  <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-gray-900 lg:hidden">AIMS</span>
                  <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-gray-900 hidden lg:block">AI Mentor for Students - AIMS</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-2 xl:space-x-4">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                    activeTab === 'dashboard' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('pathway')}
                  className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                    activeTab === 'pathway' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  Pathway
                </button>
                <button 
                  onClick={() => setActiveTab('opportunities')}
                  className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                    activeTab === 'opportunities' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  Opportunities
                </button>
                <button 
                  onClick={() => setActiveTab('progress')}
                  className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                    activeTab === 'progress' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  Progress
                </button>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                    activeTab === 'achievements' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  Achievements
                </button>
                <button 
                  onClick={() => setActiveTab('graduation')}
                  className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                    activeTab === 'graduation' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  Graduation
                </button>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications - Hidden on small screens */}
              <button className="hidden sm:block text-gray-500 hover:text-primary p-2 rounded-md transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              {/* Settings */}
              <button 
                onClick={() => setLocation('/settings')}
                className="text-gray-500 hover:text-primary p-2 rounded-md transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* User Avatar */}
              {(user as any)?.profileImageUrl ? (
                <img 
                  src={(user as any).profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              
              {/* Logout - Hidden on mobile, shown as icon on tablet */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="hidden md:flex text-gray-500 hover:text-gray-700"
              >
                Logout
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-500 hover:text-primary p-2 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                <button 
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'dashboard' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('pathway');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'pathway' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Pathway
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('opportunities');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'opportunities' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Opportunities
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('progress');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'progress' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Progress
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('achievements');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'achievements' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Achievements
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('graduation');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === 'graduation' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Graduation
                </button>
                
                {/* Mobile-only actions */}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <button 
                    onClick={() => setLocation('/settings')}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors md:hidden"
                  >
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors md:hidden"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <WelcomeHeader studentProfile={studentProfile!} user={user as User | null} />
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Actions */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <QuickActions onTabChange={setActiveTab} />
            </div>

            {/* Current Opportunities & To-Do */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CurrentOpportunities studentProfile={studentProfile!} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <TodoList studentProfile={studentProfile!} />
              </div>
            </div>

            {/* Recommended AP Courses */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <RecommendedCourses studentProfile={studentProfile!} />
            </div>
          </div>
        )}

        {activeTab === 'pathway' && (
          <PersonalizedPathway studentProfile={studentProfile!} />
        )}

        {activeTab === 'opportunities' && (
          <CurrentOpportunities studentProfile={studentProfile!} />
        )}

        {activeTab === 'progress' && (
          <ProgressOverview studentProfile={studentProfile!} />
        )}

        {activeTab === 'achievements' && (
          <Achievements />
        )}

        {activeTab === 'graduation' && (
          <GraduationRequirements studentProfile={studentProfile!} />
        )}
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton />

      {/* Footer */}
      <Footer />
    </div>
  );
}
