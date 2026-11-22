
"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const pageTexts = {
  en: {
    title: "Welcome Back",
    description: "Sign in to access your Prooflight dashboard.",
  },
  ar: {
    title: "مرحباً بعودتك",
    description: "سجل الدخول للوصول إلى لوحة تحكم تحقيق (Prooflight) الخاصة بك.",
  }
};

export default function LoginPage() {
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
    window.addEventListener('langchange', handleLangChange);
    
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
        className="flex justify-center items-center min-h-[calc(100vh-15rem)] py-12" 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Card className="w-full max-w-md shadow-xl bg-card text-card-foreground border-border">
          <CardHeader className="text-center">
            <motion.div 
              className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            >
              <LogIn className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold font-headline">{currentTexts.title}</CardTitle>
            <CardDescription className="text-card-foreground/80">{currentTexts.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm lang={pageLang} />
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
