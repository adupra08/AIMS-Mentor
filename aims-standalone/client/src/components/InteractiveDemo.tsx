import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Sparkles, Zap, Trophy, Target } from "lucide-react";

export default function InteractiveDemo() {
  const [likeCount, setLikeCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const demoCards = [
    {
      id: "animations",
      icon: Sparkles,
      title: "Smooth Animations",
      description: "Fade-in, slide-up, and scale animations",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      accentColor: "text-blue-600"
    },
    {
      id: "interactions",
      icon: Zap,
      title: "Micro-interactions",
      description: "Hover effects, button presses, and transitions",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      accentColor: "text-purple-600"
    },
    {
      id: "feedback",
      icon: Star,
      title: "Visual Feedback",
      description: "Loading states, progress indicators, and notifications",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      accentColor: "text-green-600"
    }
  ];

  return (
    <Card className="animate-slide-up border-2 border-dashed border-gray-300 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500 animate-bounce-gentle" />
            <span className="animate-fade-in">Interactive Demo</span>
          </span>
          <Badge className="animate-pulse-soft">
            Live Preview
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Like Button Demo */}
        <div className="text-center p-4 bg-white rounded-lg border animate-fade-in">
          <Button
            onClick={handleLike}
            variant={isLiked ? "default" : "outline"}
            className={`relative overflow-hidden ${isLiked ? 'animate-bounce-gentle' : ''}`}
          >
            <Heart 
              className={`mr-2 h-4 w-4 transition-all duration-300 ${
                isLiked ? 'fill-current text-red-500 scale-125' : 'text-gray-500'
              }`} 
            />
            {isLiked ? 'Liked!' : 'Like This'} ({likeCount})
            {isLiked && (
              <div className="absolute inset-0 bg-red-100 opacity-30 animate-pulse"></div>
            )}
          </Button>
        </div>

        {/* Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoCards.map((card, index) => {
            const IconComponent = card.icon;
            const isSelected = selectedCard === card.id;
            
            return (
              <div
                key={card.id}
                onClick={() => setSelectedCard(isSelected ? null : card.id)}
                className={`${card.color} p-4 rounded-lg border-2 cursor-pointer micro-hover card-interactive animate-fade-in ${
                  isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <IconComponent className={`mx-auto h-8 w-8 mb-2 ${card.accentColor} group-hover:scale-110 transition-all duration-300 ${
                    isSelected ? 'animate-bounce-gentle' : ''
                  }`} />
                  <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                  {isSelected && (
                    <div className="mt-2 animate-fade-in">
                      <Badge className="animate-glow">
                        <Target className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar Demo */}
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between text-sm font-medium">
            <span>Animation Progress</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full progress-animate animate-glow"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="inline w-4 h-4 mr-1 animate-pulse-soft" />
          All UI elements now include smooth micro-interactions!
        </div>
      </CardContent>
    </Card>
  );
}