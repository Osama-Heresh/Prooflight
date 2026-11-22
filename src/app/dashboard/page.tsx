
"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { ConnectWalletButton } from '@/components/dashboard/ConnectWalletButton';
import { NftList } from '@/components/dashboard/NftList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Info, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { mockNfts } from '@/lib/mockData'; 
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import type { UserRole } from '@/components/auth/SignupForm';

const pageTexts = {
  en: {
    titleText: "My Digital Proofs",
    descriptionText: "View and manage your verified credentials and ownership NFTs.",
    issueNewProofText: "Issue New Proof",
    noProofsTitleText: "No Proofs Yet!",
    noProofsDescText: "It looks like your collection is empty. Digital proofs you own or are issued to you will appear here. If you're an issuer, you can start by creating your first proof.",
    issueFirstProofText: "Issue your first proof",
    welcomeTitleText: "Welcome to Your Dashboard!",
    welcomeListItems: [
      "Your digital proofs are displayed below as interactive cards.",
      "Hover over a card for quick actions or click to view more details (if available).",
      "Use the \"Share\" button on a card to get a link or QR code for verification.",
      "If you have issuer privileges, the \"Issue New Proof\" button allows you to create new digital credentials."
    ],
  },
  ar: {
    titleText: "إثباتاتي الرقمية",
    descriptionText: "عرض وإدارة بيانات الاعتماد التي تم التحقق منها و NFTs الملكية.",
    issueNewProofText: "إصدار إثبات جديد",
    noProofsTitleText: "لا توجد إثباتات بعد!",
    noProofsDescText: "يبدو أن مجموعتك فارغة. الإثباتات الرقمية التي تملكها أو تصدر لك ستظهر هنا. إذا كنت مُصدرًا، يمكنك البدء بإنشاء أول إثبات لك.",
    issueFirstProofText: "إصدار أول إثبات لك",
    welcomeTitleText: "مرحباً بك في لوحة التحكم الخاصة بك!",
    welcomeListItems: [
      "إثباتاتك الرقمية معروضة أدناه كبطاقات تفاعلية.",
      "مرر الفأرة فوق البطاقة لإجراءات سريعة أو انقر لعرض المزيد من التفاصيل (إذا كانت متوفرة).",
      "استخدم زر \"مشاركة\" على البطاقة للحصول على رابط أو رمز QR للتحقق.",
      "إذا كانت لديك صلاحيات المُصدر، فإن زر \"إصدار إثبات جديد\" يسمح لك بإنشاء بيانات اعتماد رقمية جديدة."
    ],
  }
};


export default function DashboardPage() {
  const userNfts = mockNfts; 
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) {
      setPageLang(storedLang);
    }
    
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

    const handleLangChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ newLang: 'en' | 'ar' }>;
      if (customEvent.detail && customEvent.detail.newLang) {
        setPageLang(customEvent.detail.newLang);
      }
    };
    window.addEventListener('langchange', handleLangChange);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setPageLang(event.newValue);
      }
      if (event.key === 'authToken') {
        if (event.newValue) {
          try {
            const authData = JSON.parse(event.newValue);
            setUserRole(authData.role);
          } catch (e) {
            console.error("Failed to parse auth token from storage event:", e);
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const currentTexts = pageTexts[pageLang];
  const canIssueProof = userRole === 'proof_issuer' || userRole === 'site_admin';

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-border">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2 text-foreground">{currentTexts.titleText}</h1>
            <p className="text-muted-foreground">{currentTexts.descriptionText}</p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4 md:mt-0">
            <ConnectWalletButton />
            {!loadingRole && canIssueProof && (
              <Button asChild variant="outline" className="border-primary/70 text-primary hover:bg-primary/10 hover:border-primary hover:text-primary-hover">
                <Link href="/admin/issue-nft">
                  <PlusCircle className={pageLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                  {currentTexts.issueNewProofText}
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        {userNfts.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Alert className="max-w-md mx-auto bg-card border-border text-card-foreground shadow-lg">
              <Info className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold">{currentTexts.noProofsTitleText}</AlertTitle>
              <AlertDescription className="text-card-foreground/80">
                {currentTexts.noProofsDescText}
              </AlertDescription>
               {canIssueProof && (
                  <Button asChild className="mt-6 bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Link href="/admin/issue-nft">{currentTexts.issueFirstProofText}</Link>
                  </Button>
                )}
            </Alert>
          </motion.div>
        )}

        {userNfts.length > 0 && (
          <>
            <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
              <LayoutGrid className="h-5 w-5 text-green-500 dark:text-green-400" />
              <AlertTitle className="font-semibold">{currentTexts.welcomeTitleText}</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 mt-1 space-y-1 text-sm">
                  {currentTexts.welcomeListItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
            <NftList nfts={userNfts} />
          </>
        )}
      </motion.div>
    </AppLayout>
  );
}


    