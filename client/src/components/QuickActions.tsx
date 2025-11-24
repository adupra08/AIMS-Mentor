import { Route, Trophy, BookOpen, Handshake, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

export default function QuickActions({ onTabChange }: QuickActionsProps) {

  const quickActions = [
    {
      icon: Route,
      label: "Academic Pathway",
      color: "bg-blue-100 hover:bg-blue-200 text-blue-600",
      action: () => {
        console.log("View Pathway clicked");
        onTabChange('pathway');
      }
    },
    {
      icon: Trophy,
      label: "Find Competitions",
      color: "bg-amber-100 hover:bg-amber-200 text-amber-600",
      action: () => {
        console.log("Competitions clicked");
        onTabChange('opportunities');
      }
    },
    {
      icon: BookOpen,
      label: "Course Planning",
      color: "bg-green-100 hover:bg-green-200 text-green-600",
      action: () => {
        console.log("AP Courses clicked");
        onTabChange('pathway');
      }
    },
    {
      icon: Award,
      label: "Scholarships",
      color: "bg-rose-100 hover:bg-rose-200 text-rose-600",
      action: () => {
        console.log("Scholarships clicked");
        onTabChange('scholarships');
      }
    },
    {
      icon: Handshake,
      label: "Summer Programs",
      color: "bg-purple-100 hover:bg-purple-200 text-purple-600",
      action: () => {
        console.log("Internships clicked");
        onTabChange('opportunities');
      }
    }
  ];

  return (
    <Card className="shadow-sm border border-gray-200 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="animate-fade-in">Quick Actions</span>
          <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse-soft"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} p-3 sm:p-4 rounded-lg micro-hover button-press flex flex-col items-center justify-center space-y-2 min-h-[80px] sm:min-h-[100px] group animate-fade-in relative overflow-hidden transition-all duration-200`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 relative z-10" />
                <span className="text-xs sm:text-sm font-bold text-center leading-tight relative z-10 group-hover:font-extrabold transition-all duration-200">{action.label}</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-0 group-hover:opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
