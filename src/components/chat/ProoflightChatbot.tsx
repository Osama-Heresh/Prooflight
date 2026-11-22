
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { prooflightChat, type ProoflightChatInput } from '@/ai/flows/prooflight-chat-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const chatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});
type ChatInputFormData = z.infer<typeof chatInputSchema>;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  avatar?: string;
}

const chatbotTexts = {
  en: {
    placeholder: "Ask about Prooflight...",
    submit: "Send",
    sending: "Sending...",
    errorTitle: "Chat Error",
    errorMessage: "Failed to get a response. Please try again.",
    welcomeMessage: "Hello! I'm ProoflightBot. How can I help you understand the Prooflight system today?",
  },
  ar: {
    placeholder: "اسأل عن تحقيق (Prooflight)...",
    submit: "إرسال",
    sending: "جار الإرسال...",
    errorTitle: "خطأ في الدردشة",
    errorMessage: "فشل في الحصول على رد. يرجى المحاولة مرة أخرى.",
    welcomeMessage: "مرحباً! أنا بوت تحقيق (ProoflightBot). كيف يمكنني مساعدتك في فهم نظام تحقيق اليوم؟",
  }
};


export function ProoflightChatbot({ lang }: { lang: 'en' | 'ar' }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null); 
  const { toast } = useToast();
  const texts = chatbotTexts[lang];

  const { register, handleSubmit, reset, setFocus, formState: { errors } } = useForm<ChatInputFormData>({
    resolver: zodResolver(chatInputSchema),
  });

  useEffect(() => {
    setMessages([
      { id: 'initial-bot-message', role: 'assistant', content: texts.welcomeMessage, avatar: '/bot-avatar.png' }
    ]);
  }, [texts.welcomeMessage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // The actual scrollable element is the viewport inside the ScrollArea
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        // Use a short timeout to allow the DOM to update before scrolling
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 0);
      }
    }
  }, [messages]);
  
  useEffect(() => {
    setFocus("message");
  }, [setFocus, lang]);


  const onSubmit: SubmitHandler<ChatInputFormData> = async (data) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: data.message,
      avatar: '/user-avatar.png', 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    reset();

    try {
      const input: ProoflightChatInput = { 
        userQuestion: data.message, 
        lang: lang
      };
      const result = await prooflightChat(input);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.aiResponse,
        avatar: '/bot-avatar.png', 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Chatbot Error in onSubmit:", error);
      
      let detailedErrorMessage = texts.errorMessage;
      if (error.message) {
        detailedErrorMessage += ` Details: ${error.message}`;
      }

      toast({ title: texts.errorTitle, description: detailedErrorMessage, variant: "destructive" });
       const errorMessageToDisplay: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: texts.errorMessage, 
        avatar: '/bot-avatar.png',
      };
      setMessages(prev => [...prev, errorMessageToDisplay]);
    }
    setIsLoading(false);
    setFocus("message");
  };

  return (
    <div className={cn("flex flex-col h-[calc(100vh-20rem)] max-h-[700px] bg-card border border-border rounded-lg shadow-md", lang === 'ar' ? 'text-right' : 'text-left')}>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-end gap-2 mb-4",
                msg.role === 'user' ? (lang === 'ar' ? 'flex-row-reverse mr-auto' : 'flex-row-reverse ml-auto') : (lang === 'ar' ? 'flex-row mr-auto' : 'flex-row ml-auto') 
              )}
            >
              <div className={cn("max-w-[70%] p-3 rounded-lg shadow", 
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                lang === 'ar' ? (msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none') : (msg.role === 'user' ? 'rounded-bl-none' : 'rounded-br-none')
              )}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
               <Avatar className="h-8 w-8 self-start">
                 <AvatarImage src={msg.avatar} alt={msg.role} />
                 <AvatarFallback>
                   {msg.role === 'user' ? <User/> : <Bot/>}
                 </AvatarFallback>
               </Avatar>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-3 border-t border-border">
        <Input
          {...register("message")}
          placeholder={texts.placeholder}
          className="flex-grow disabled:opacity-70"
          autoComplete="off"
          disabled={isLoading}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        />
        <Button type="submit" disabled={isLoading} size="icon" className={cn("bg-primary hover:bg-primary-hover text-primary-foreground", lang === 'ar' ? 'mr-2' : 'ml-2')}>
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          <span className="sr-only">{isLoading ? texts.sending : texts.submit}</span>
        </Button>
      </form>
       {errors.message && <p className="text-xs text-destructive p-2 pt-0">{errors.message.message}</p>}
    </div>
  );
}
