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
  const sortedMessages = Array.isArray(chatMessages) ? chatMessages.sort((a: any, b: any) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) : [];

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Chat Interface */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] max-w-sm sm:w-80 sm:max-w-none bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] sm:max-h-96 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg flex-shrink-0 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center">
                <Bot className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                AI Mentor
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleChat}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-3 sm:p-4 min-h-0">
            {/* Messages */}
            <div className="flex-1 space-y-3 mb-3 overflow-y-auto overscroll-contain chat-scrollbar">
              {isLoading ? (
                <div className="text-center text-gray-500 py-8">
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
                      className={`max-w-[85%] sm:max-w-xs px-3 py-2 rounded-lg text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="flex items-center mb-1">
                          <Bot className="mr-1 h-3 w-3" />
                          <span className="text-xs font-medium text-primary">AIMS</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
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
                <div className="flex items-start space-x-2 py-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-white text-xs" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm rounded-bl-sm">
                    <p className="leading-relaxed">
                      Hi! I'm your AI mentor. Ask me anything about your academic journey, 
                      college preparation, or opportunities you should explore!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center space-x-2 border-t pt-3 flex-shrink-0">
              <Input
                type="text"
                placeholder="Type your message..."
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
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group active:scale-95 mobile-touch-target"
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
        )}
      </Button>
    </div>
  );
}
