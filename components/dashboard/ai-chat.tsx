"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your FitMate AI coach. How can I help you with your fitness journey today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Based on your current fitness level, I'd recommend focusing on progressive overload for your strength training.",
        "I've analyzed your recent workouts, and I see room for improvement in your recovery time. Make sure you're getting enough sleep.",
        "Your progress has been impressive! I've updated your workout plan to include more challenging exercises.",
        "For your goal of weight loss, I suggest adding 2 HIIT sessions per week alongside your strength training.",
        "Let's adjust your workout schedule to better fit your availability. How about 3 workouts during the week and 1 on the weekend?",
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const newAIMessage: Message = {
        id: Date.now(),
        content: randomResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newAIMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">AI Coach Chat</h1>
        <p className="text-sm text-muted-foreground">
          Ask about your workouts, get advice, or update your fitness goals
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className={message.sender === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                <div className="w-10 h-10 flex items-center justify-center">
                  {message.sender === 'ai' ? 'AI' : 'You'}
                </div>
              </Avatar>
              <Card className={`max-w-[80%] p-3 ${
                message.sender === 'user' ? 'bg-primary text-primary-foreground' : ''
              }`}>
                <p>{message.content}</p>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <Avatar className="bg-primary text-primary-foreground">
                <div className="w-10 h-10 flex items-center justify-center">AI</div>
              </Avatar>
              <Card className="p-3">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your AI coach a question..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            Send
          </Button>
        </form>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Suggested: "Can you adjust my workout plan?", "How do I improve my form?", "I need a rest day today"</p>
        </div>
      </div>
    </div>
  );
} 