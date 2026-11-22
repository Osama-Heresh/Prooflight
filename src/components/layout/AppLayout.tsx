
"use client";
import type { ReactNode } from 'react';
import { Header } from './Header';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpenText } from 'lucide-react';

export function AppLayout({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) {
      setCurrentLang(storedLang);
    }

    const handleLangChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ newLang: 'en' | 'ar' }>;
      if (customEvent.detail && customEvent.detail.newLang) {
        setCurrentLang(customEvent.detail.newLang);
      }
    };
    
    // Listen for custom lang changes dispatched by Header
    window.addEventListener('langchange', handleLangChange);
    
    // Standard storage event for cross-tab sync
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setCurrentLang(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const layoutDir = isMounted ? (currentLang === 'ar' ? 'rtl' : 'ltr') : undefined;

  const footerTextEn = `© ${new Date().getFullYear()} Prooflight. All rights reserved. Secure and Innovative.`;
  const footerTextAr = `© ${new Date().getFullYear()} تحقيق. جميع الحقوق محفوظة. آمن ومبتكر.`;
  const whitePaperTextEn = "White Paper";
  const whitePaperTextAr = "الورقة البيضاء";
  const userGuideTextEn = "User Guide";
  const userGuideTextAr = "دليل المستخدم";
  const userGuideLinkEn = "/how-it-works";
  const userGuideLinkAr = "/ar/how-it-works";


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header /> {/* Header manages its own language state and global document attributes */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-8"
        dir={layoutDir}
      >
        {children}
      </motion.main>
      <footer 
        className="py-6 text-center text-sm text-muted-foreground border-t border-border/30" 
        dir={layoutDir}
      >
        <div className="space-y-1">
            <p>
            {currentLang === 'ar' ? footerTextAr : footerTextEn}
            </p>
            <div className="flex justify-center items-center space-x-3 rtl:space-x-reverse">
                <Link href="/whitepaper.pdf" className="hover:text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {currentLang === 'ar' ? whitePaperTextAr : whitePaperTextEn}
                </Link>
                <span>|</span>
                 <Link href={isMounted ? (currentLang === 'ar' ? userGuideLinkAr : userGuideLinkEn) : userGuideLinkEn} className="flex items-center hover:text-primary hover:underline">
                    <BookOpenText className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                    {isMounted ? (currentLang === 'ar' ? userGuideTextAr : userGuideTextEn) : userGuideTextEn}
                </Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
