import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AIMentorIcon from "./AIMentorIcon";
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
    <Card className="shadow-sm border border-gray-200 w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <AIMentorIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            AI Mentor
          </CardTitle>
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 mb-4 max-h-48 sm:max-h-56 overflow-y-auto overscroll-contain chat-scrollbar">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-soft">
              <AIMentorIcon className="text-white h-5 w-5" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm rounded-bl-sm flex-1 border border-gray-200">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom components for better formatting
                    h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-2">{children}</h1>,
                    h2: ({children}) => <h2 className="text-base font-semibold text-gray-800 mb-2">{children}</h2>,
                    h3: ({children}) => <h3 className="text-sm font-semibold text-gray-700 mb-1">{children}</h3>,
                    p: ({children}) => <p className="text-gray-700 mb-2 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-2 text-gray-700">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-2 text-gray-700">{children}</ol>,
                    li: ({children}) => <li className="ml-2">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                    code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                    blockquote: ({children}) => <blockquote className="border-l-2 border-primary pl-3 italic text-gray-600 my-2">{children}</blockquote>
                  }}
                >
                  {latestAiMessage ? latestAiMessage.message : (
                    `**Welcome to AIMS!** 🎓

I'm your **AI Academic Mentor**, here to help guide your journey to your dream college.

**I can help you with:**
• Academic planning and course selection
• College preparation strategies  
• Finding relevant competitions and opportunities
• Extracurricular activity recommendations
• Test preparation guidance
• Personal development planning

**What would you like to discuss today?** Feel free to ask me anything about your academic path!`
                  )}
                </ReactMarkdown>
              </div>
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
            className="flex-1 text-sm focus:ring-2 focus:ring-primary focus:border-transparent h-9 sm:h-10 chat-input"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !message.trim()}
            className="bg-primary hover:bg-primary/90 h-9 w-9 sm:h-10 sm:w-10 p-0 flex-shrink-0 mobile-touch-target"
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
