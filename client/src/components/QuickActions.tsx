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
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 group ${action.color}`}
            >
              <action.icon className="text-2xl mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
