import { Route, Trophy, BookOpen, Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();

  const quickActions = [
    {
      icon: Route,
      label: "Academic Pathway",
      color: "bg-primary bg-opacity-10 hover:bg-opacity-20 text-primary",
      action: () => {
        console.log("View Pathway clicked");
        toast({
          title: "Academic Pathway",
          description: "Click the 'Pathway' tab above to view your personalized academic plan.",
        });
      }
    },
    {
      icon: Trophy,
      label: "Find Competitions",
      color: "bg-secondary bg-opacity-10 hover:bg-opacity-20 text-secondary",
      action: () => {
        console.log("Competitions clicked");
        toast({
          title: "Competitions",
          description: "Check the 'Opportunities' tab to find competitions matching your interests.",
        });
      }
    },
    {
      icon: BookOpen,
      label: "Course Planning",
      color: "bg-accent bg-opacity-10 hover:bg-opacity-20 text-accent",
      action: () => {
        console.log("AP Courses clicked");
        toast({
          title: "AP Courses",
          description: "Scroll down to see your recommended AP courses based on your goals.",
        });
      }
    },
    {
      icon: Handshake,
      label: "Summer Programs",
      color: "bg-purple-100 hover:bg-purple-200 text-purple-600",
      action: () => {
        console.log("Internships clicked");
        toast({
          title: "Internships",
          description: "Visit the 'Opportunities' tab to explore internship programs.",
        });
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
