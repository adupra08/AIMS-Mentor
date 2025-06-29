import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: chatMessages, isLoading } = useQuery({
    queryKey: ["/api/student/chat"],
    enabled: isOpen,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/student/chat", { message });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/student/chat"] });
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Sort messages by date and group user/AI pairs
  const sortedMessages = chatMessages?.sort((a: any, b: any) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) || [];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Interface */}
      {isOpen && (
        <div className="mb-4 w-80 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                AI Mentor
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleChat}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm mt-2">Loading messages...</p>
                </div>
              ) : sortedMessages.length > 0 ? (
                sortedMessages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="flex items-center mb-1">
                          <Bot className="mr-1 h-3 w-3" />
                          <span className="text-xs font-medium">AIMS</span>
                        </div>
                      )}
                      <p>{msg.message}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-white text-xs" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    <p>
                      Hi! I'm your AI mentor. Ask me anything about your academic journey, 
                      college preparation, or opportunities you should explore!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center space-x-2 border-t pt-4">
              <Input
                type="text"
                placeholder="Type your message..."
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
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className="w-14 h-14 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="text-xl group-hover:scale-110 transition-transform" />
        ) : (
          <MessageCircle className="text-xl group-hover:scale-110 transition-transform" />
        )}
      </Button>
    </div>
  );
}
