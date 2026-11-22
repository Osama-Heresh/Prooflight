
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { EditNftForm } from '@/components/admin/EditNftForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, PencilLine, ShieldAlert } from 'lucide-react';
import { mockNfts } from '@/lib/mockData';
import type { NftMetadata } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';

const pageTexts = (lang: 'en' | 'ar') => ({
  loading: lang === 'ar' ? "جار التحميل..." : "Loading...",
  notFoundTitle: lang === 'ar' ? "الإثبات غير موجود" : "Proof Not Found",
  notFoundDesc: lang === 'ar' ? "تعذر العثور على الإثبات الرقمي الذي تحاول تعديله. ربما تمت إزالته أو أن المعرف غير صحيح." : "The digital proof you are trying to edit could not be found. It might have been removed or the ID is incorrect.",
  backToAnalytics: lang === 'ar' ? "العودة إلى التحليلات" : "Back to Analytics",
  backButton: lang === 'ar' ? "رجوع" : "Back",
  pageTitle: lang === 'ar' ? "تعديل الإثبات الرقمي" : "Edit Digital Proof",
  pageDescription: (nftId: string) => lang === 'ar' ? `قم بتعديل تفاصيل الإثبات الرقمي ذو المعرف: ${nftId}` : `Modify the details of the digital proof ID: ${nftId}`,
  alertTitle: lang === 'ar' ? "معلومات التعديل" : "Editing Information",
  alertItems: [
    lang === 'ar' ? "قم بتحديث الحقول الضرورية أدناه." : "Update the necessary fields below.",
    lang === 'ar' ? "تتم محاكاة التغييرات على المستند (عبر تجزئة IPFS)." : "Changes to the document (via IPFS hash) are simulated.",
    lang === 'ar' ? "تذكر أن البيانات الهامة المسجلة على السلسلة (مثل معرف الرمز المميز نفسه) عادة ما تكون غير قابلة للتغيير. هذا النموذج يحاكي تحديثات البيانات الوصفية خارج السلسلة." : "Remember that critical on-chain data (like the Token ID itself) is typically immutable. This form simulates off-chain metadata updates."
  ],
});

export default function EditProofPage() {
  const params = useParams();
  const router = useRouter();
  const nftId = params?.id as string;

  const [nftData, setNftData] = useState<NftMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');

  const currentTexts = pageTexts(pageLang);
  
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

    if (nftId) {
      setLoading(true);
      setTimeout(() => {
        const foundNft = mockNfts.find(item => item.id === nftId);
        if (foundNft) {
          setNftData(foundNft);
          setNotFound(false);
        } else {
          setNftData(null);
          setNotFound(true);
        }
        setLoading(false);
      }, 500); 
    } else {
        setLoading(false);
        setNotFound(true); 
    }
    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [nftId]);

  const handleUpdateSuccess = (updatedData: NftMetadata) => {
    setNftData(updatedData); 
  };

  if (loading) {
    return (
      <AppLayout>
        <motion.div
          className="max-w-2xl mx-auto py-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
        >
          <Skeleton className="h-10 w-1/4 mb-4" />
          <Card className="shadow-xl">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-6" />
            </CardContent>
          </Card>
        </motion.div>
      </AppLayout>
    );
  }

  if (notFound) {
    return (
      <AppLayout>
        <motion.div
          className="max-w-lg mx-auto py-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
        >
          <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">{currentTexts.notFoundTitle}</h1>
          <p className="text-muted-foreground mb-6">
            {currentTexts.notFoundDesc}
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/analytics">
              <ArrowLeft className={pageLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> {currentTexts.backToAnalytics}
            </Link>
          </Button>
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
         <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className={pageLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
            {currentTexts.backButton}
        </Button>

        <Card className="shadow-xl bg-card text-card-foreground border-border">
          <CardHeader className="text-center">
             <motion.div 
                className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full"
                animate={{ scale: [1, 1.1, 1], rotate:[0,3,-3,0]}}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.1, repeat: Infinity, repeatDelay: 2.5 }}
             >
                <PencilLine className="h-12 w-12 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold font-headline">{currentTexts.pageTitle}</CardTitle>
            <CardDescription className="text-card-foreground/80">
              {currentTexts.pageDescription(nftId)} <code className="font-mono bg-muted px-1 rounded" dir="ltr">{nftId}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
              <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <AlertTitle className="font-semibold">{currentTexts.alertTitle}</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 mt-1 space-y-1 text-sm">
                  {currentTexts.alertItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
            {nftData && <EditNftForm nftData={nftData} onUpdateSuccess={handleUpdateSuccess} lang={pageLang} />}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}

    