
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { ProoflightChatbot } from '@/components/chat/ProoflightChatbot';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const pageTexts = {
  en: {
    title: "Chat with ProoflightBot",
    description: "Ask questions about the Prooflight system and get instant answers.",
  },
  ar: {
    title: "تحدث مع بوت تحقيق (ProoflightBot)",
    description: "اطرح أسئلة حول نظام تحقيق (Prooflight) واحصل على إجابات فورية.",
  }
};

export default function ChatPage() {
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) {
      setPageLang(storedLang);
    }

    const handleLangChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ newLang: 'en' | 'ar' }>;
      if (customEvent.detail && customEvent.detail.newLang) {
        setPageLang(customEvent.detail.newLang);
      }
    };
    
    // Listen for custom lang changes dispatched by Header
    window.addEventListener('langchange', handleLangChange);
    
    // Standard storage event for cross-tab sync (if needed, but custom event handles same-page)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setPageLang(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const currentTexts = pageTexts[pageLang];

  return (
    <AppLayout>
      <motion.div
        className="max-w-3xl mx-auto py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Card className="shadow-xl border-border">
          <CardHeader className="text-center">
            <motion.div
              className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full"
              animate={{ scale: [1, 1.1, 1], y: [0, -3, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, delay: 0.2 }}
            >
              <MessageCircle className="h-12 w-12 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold font-headline">{currentTexts.title}</CardTitle>
            <CardDescription className="text-card-foreground/80">{currentTexts.description}</CardDescription>
          </CardHeader>
        </Card>
        
        <div className="mt-8">
          {/* The key prop ensures ProoflightChatbot remounts when pageLang changes */}
          <ProoflightChatbot key={pageLang} lang={pageLang} />
        </div>
      </motion.div>
    </AppLayout>
  );
}
