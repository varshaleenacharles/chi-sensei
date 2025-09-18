import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, MessageCircle, X } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
}

interface ChatbotHelpdeskProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatbotHelpdesk = ({ isOpen, onToggle }: ChatbotHelpdeskProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hello! I\'m your KMRL AI Assistant. I can help you with policies, compliance, HR, finance, project data, and document status updates. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(currentMessage);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setCurrentMessage("");
  };

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = "";
    
    if (lowerMessage.includes('status') && lowerMessage.includes('document')) {
      response = "I can help you check document status. Please provide the document ID or title. Current status types are: 🔴 Urgent, 🟡 Pending, ✅ Completed, 🟣 Under Review.";
    } else if (lowerMessage.includes('policy') || lowerMessage.includes('compliance')) {
      response = "For policy and compliance queries, I can help with KMRL guidelines. Common topics include: Safety protocols, Financial procedures, Project guidelines, and HR policies. What specific policy information do you need?";
    } else if (lowerMessage.includes('finance') || lowerMessage.includes('budget')) {
      response = "For finance queries, I can provide information about: Budget allocations, Invoice procedures, Vendor payments, and Financial approvals. Finance documents are marked with 🔵 Blue color code.";
    } else if (lowerMessage.includes('project')) {
      response = "Project-related queries: I can help with project timelines, approvals, and documentation. Project documents are marked with 🟢 Green color code. What project information do you need?";
    } else if (lowerMessage.includes('safety') || lowerMessage.includes('health')) {
      response = "Health & Safety information: I can provide safety protocols, incident reporting procedures, and compliance requirements. Safety documents are marked with 🔴 Red color code.";
    } else if (lowerMessage.includes('legal')) {
      response = "Legal matters: I can help with contract procedures, legal compliance, and documentation requirements. Legal documents are marked with 🟣 Purple color code.";
    } else if (lowerMessage.includes('systems') || lowerMessage.includes('operations')) {
      response = "Systems & Operations: I can provide information about IT procedures, operational guidelines, and system documentation. These are marked with 🟠 Orange color code.";
    } else {
      response = "I understand you need assistance. I can help with: \n• Document status updates \n• Policy and compliance information \n• Departmental procedures (Finance, Projects, Legal, Health & Safety, Systems & Operations) \n• HR guidelines \n• Project information \n\nPlease specify what you'd like to know more about.";
    }

    return {
      id: Date.now().toString() + '_bot',
      type: 'bot',
      message: response,
      timestamp: new Date().toLocaleTimeString()
    };
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
      <Card className="h-full shadow-lg border-2">
        <CardHeader className="pb-3 bg-primary text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-medium">KMRL AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            <span className="text-xs opacity-90">Online • 24/7 Available</span>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.type === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-foreground'
                  }`}>
                    {msg.type === 'bot' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Bot className="h-3 w-3" />
                        <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.message}</p>
                    <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotHelpdesk;