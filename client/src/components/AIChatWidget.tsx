import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Send, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AIChatWidget() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: chatMessages, refetch } = useQuery({
    queryKey: ["/api/student/chat"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/student/chat", { message });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      refetch(); // Immediately refresh chat messages
      toast({
        title: "Message sent!",
        description: "Your AI mentor is thinking...",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get the latest AI message for display
  const latestAiMessage = Array.isArray(chatMessages) ? chatMessages.find((msg: any) => msg.sender === "ai") : null;

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">AI Mentor</CardTitle>
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white text-xs" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-sm">
              <p>
                {latestAiMessage?.message || 
                 "Hi! I'm your AI mentor. Ask me anything about your academic journey, college preparation, or opportunities you should explore!"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !message.trim()}
            className="bg-primary hover:bg-primary/90 p-2"
          >
            <Send className="text-sm" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
