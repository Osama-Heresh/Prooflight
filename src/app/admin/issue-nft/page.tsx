
"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { IssueNftForm } from '@/components/admin/IssueNftForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldPlus, Info, ListChecks, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { UserRole } from '@/components/auth/SignupForm';

const pageTexts = {
  en: {
    loadingPermissions: "Loading access permissions...",
    accessDeniedTitle: "Access Denied",
    accessDeniedDesc: "You do not have permission to issue new proofs. This area is restricted to Proof Issuers and Site Admins.",
    pageTitle: "Issue New Digital Proof",
    pageDescription: "Complete the form below to create and issue a new NFT-based proof. (Proof Issuers & Admins Only)",
    alertTitle: "How to Issue a Proof",
    alertItems: [
      "Fill in all required fields with accurate information about the proof.",
      "The 'Recipient Identifier' should be a unique identifier for the recipient (e.g., wallet address, email, or user ID).",
      "For documents, you can optionally include an IPFS hash for decentralized storage.",
      "Double-check all details before clicking \"Issue Proof\" as this action (once on-chain) is typically irreversible."
    ],
  },
  ar: {
    loadingPermissions: "جار تحميل أذونات الوصول...",
    accessDeniedTitle: "تم رفض الوصول",
    accessDeniedDesc: "ليس لديك إذن لإصدار إثباتات جديدة. هذه المنطقة مخصصة لمصدري الإثباتات ومسؤولي الموقع فقط.",
    pageTitle: "إصدار إثبات رقمي جديد",
    pageDescription: "أكمل النموذج أدناه لإنشاء وإصدار إثبات جديد قائم على NFT. (لمصدري الإثباتات والمسؤولين فقط)",
    alertTitle: "كيفية إصدار إثبات",
    alertItems: [
      "املأ جميع الحقول المطلوبة بمعلومات دقيقة حول الإثبات.",
      "يجب أن يكون 'معرف المستلم' معرفًا فريدًا للمستلم (مثل عنوان المحفظة، البريد الإلكتروني، أو معرف المستخدم).",
      "بالنسبة للمستندات، يمكنك اختياريًا تضمين تجزئة IPFS للتخزين اللامركزي.",
      "تحقق جيدًا من جميع التفاصيل قبل النقر فوق \"إصدار الإثبات\" حيث أن هذا الإجراء (بمجرد تسجيله على السلسلة) لا يمكن عكسه عادةً."
    ],
  }
};

export default function IssueNftPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');

  const currentTexts = pageTexts[pageLang];

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

    const authDataString = localStorage.getItem('authToken');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        setUserRole(authData.role);
      } catch (e) {
        console.error("Failed to parse auth token for role check:", e);
        setUserRole(null);
      }
    }
    setLoadingRole(false);
    
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


  if (loadingRole) {
    return <AppLayout><div className="text-center py-10" dir={pageLang === 'ar' ? 'rtl' : 'ltr'}>{currentTexts.loadingPermissions}</div></AppLayout>;
  }

  if (userRole !== 'site_admin' && userRole !== 'proof_issuer') {
    return (
      <AppLayout>
        <motion.div
          className="max-w-lg mx-auto py-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
        >
          <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">{currentTexts.accessDeniedTitle}</h1>
          <p className="text-muted-foreground">
            {currentTexts.accessDeniedDesc}
          </p>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div 
        className="max-w-2xl mx-auto py-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Card className="shadow-xl bg-card text-card-foreground border-border">
          <CardHeader className="text-center">
             <motion.div 
                className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.1, repeat: Infinity, repeatDelay: 3 }}
             >
                <ShieldPlus className="h-12 w-12 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold font-headline">{currentTexts.pageTitle}</CardTitle>
            <CardDescription className="text-card-foreground/80">
              {currentTexts.pageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
              <ListChecks className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <AlertTitle className="font-semibold">{currentTexts.alertTitle}</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 mt-1 space-y-1 text-sm">
                  {currentTexts.alertItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
            <IssueNftForm lang={pageLang} />
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}

    