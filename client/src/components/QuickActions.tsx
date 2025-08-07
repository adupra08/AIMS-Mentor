import { Route, Trophy, BookOpen, Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

export default function QuickActions({ onTabChange }: QuickActionsProps) {

  const quickActions = [
    {
      icon: Route,
      label: "Academic Pathway",
      color: "bg-primary bg-opacity-10 hover:bg-opacity-20 text-primary",
      action: () => {
        console.log("View Pathway clicked");
        onTabChange('pathway');
      }
    },
    {
      icon: Trophy,
      label: "Find Competitions",
      color: "bg-secondary bg-opacity-10 hover:bg-opacity-20 text-secondary",
      action: () => {
        console.log("Competitions clicked");
        onTabChange('opportunities');
      }
    },
    {
      icon: BookOpen,
      label: "Course Planning",
      color: "bg-accent bg-opacity-10 hover:bg-opacity-20 text-accent",
      action: () => {
        console.log("AP Courses clicked");
        onTabChange('pathway');
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} p-4 rounded-lg micro-hover button-press flex flex-col items-center justify-center space-y-2 min-h-[100px] group animate-fade-in relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <IconComponent className="h-6 w-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 relative z-10" />
                <span className="text-sm font-bold text-center leading-tight relative z-10 group-hover:font-extrabold transition-all duration-200">{action.label}</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-0 group-hover:opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
