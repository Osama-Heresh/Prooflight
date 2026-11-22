
"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { VerificationForm } from '@/components/verify/VerificationForm';
import { AiReasoningSection } from '@/components/verify/AiReasoningSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScanSearch, Brain, Info, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const pageTexts = {
  en: {
    verifyTitle: "Verify Digital Proof",
    verifyDescription: "Enter an NFT ID or public wallet address to validate the authenticity of a digital proof.",
    howToVerifyTitle: "How to Verify a Proof",
    howToVerifyItems: [
      "Enter the unique ID of the digital proof (e.g., NFT001).",
      "Alternatively, you can enter the public blockchain wallet address of the proof holder (e.g., 0x123...abc).",
      "The system will retrieve and display the proof's details and its current validity status."
    ],
    aiReasoningTitle: "AI-Assisted Proof Reasoning",
    aiReasoningDescription: "Use AI to analyze if a proof of ownership/authenticity aligns with a stated identity. This provides an extra layer of confidence.",
    understandingAiTitle: "Understanding AI Reasoning",
    understandingAiDesc: "This tool helps assess if a claimed proof logically matches a given identity. Provide details for both the proof (e.g., \"Diploma\", \"Certificate ID\") and the identity (e.g., \"Student\", \"John Doe\"). The AI will offer a reasoning and a confidence score.",
    codeExampleNftId: "NFT001",
    codeExampleWallet: "0x123...abc",
  },
  ar: {
    verifyTitle: "التحقق من الإثبات الرقمي",
    verifyDescription: "أدخل معرّف NFT أو عنوان المحفظة العام للتحقق من صحة الإثبات الرقمي.",
    howToVerifyTitle: "كيفية التحقق من الإثبات",
    howToVerifyItems: [
      "أدخل المعرّف الفريد للإثبات الرقمي (مثال: NFT001).",
      "بدلاً من ذلك، يمكنك إدخال عنوان محفظة البلوكتشين العام لحامل الإثبات (مثال: 0x123...abc).",
      "سيقوم النظام باسترداد وعرض تفاصيل الإثبات وحالته الصلاحية الحالية."
    ],
    aiReasoningTitle: "الاستدلال على الإثبات بمساعدة الذكاء الاصطناعي",
    aiReasoningDescription: "استخدم الذكاء الاصطناعي لتحليل ما إذا كان إثبات الملكية/الأصالة يتوافق مع الهوية المعلنة. هذا يوفر طبقة إضافية من الثقة.",
    understandingAiTitle: "فهم استدلال الذكاء الاصطناعي",
    understandingAiDesc: "تساعد هذه الأداة في تقييم ما إذا كان الإثبات المُطالب به يتطابق منطقيًا مع هوية معينة. قدم تفاصيل لكل من الإثبات (مثل \"دبلوم\"، \"معرّف الشهادة\") والهوية (مثل \"طالب\"، \"جون دو\"). سيقدم الذكاء الاصطناعي استدلالًا ودرجة ثقة.",
    codeExampleNftId: "NFT001",
    codeExampleWallet: "0x123...abc",
  }
};

export default function VerifyPage() {
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
      <div className="max-w-3xl mx-auto space-y-12 py-8" dir={pageLang === 'ar' ? 'rtl' : 'ltr'}>
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-xl bg-card text-card-foreground border-border">
            <CardHeader className="items-center text-center">
              <motion.div 
                className="p-3 bg-primary/10 rounded-full inline-block mb-3"
                animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
              >
                <ScanSearch className="h-10 w-10 text-primary" />
              </motion.div>
              <CardTitle className="text-3xl font-bold font-headline">{currentTexts.verifyTitle}</CardTitle>
              <CardDescription className="text-lg text-card-foreground/80 max-w-xl mx-auto">
                {currentTexts.verifyDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="default" className="mb-6 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300">
                <HelpCircle className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                <AlertTitle className="font-semibold">{currentTexts.howToVerifyTitle}</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 mt-1 space-y-1 text-sm">
                    {currentTexts.howToVerifyItems.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: item.replace(/NFT001/g, `<code class="bg-sky-100 dark:bg-sky-800 px-1 rounded">${currentTexts.codeExampleNftId}</code>`).replace(/0x123...abc/g, `<code class="bg-sky-100 dark:bg-sky-800 px-1 rounded">${currentTexts.codeExampleWallet}</code>`) }} />
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
              <VerificationForm lang={pageLang} />
            </CardContent>
          </Card>
        </motion.section>

        <motion.section 
          id="ai-reasoning"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }} 
        >
          <Card className="shadow-xl bg-card text-card-foreground border-border">
            <CardHeader className="items-center text-center">
               <motion.div 
                  className="p-3 bg-accent/10 rounded-full inline-block mb-3"
                  animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
                  transition={{ duration: 1.7, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
               >
                <Brain className="h-10 w-10 text-accent" />
               </motion.div>
              <CardTitle className="text-3xl font-bold font-headline">{currentTexts.aiReasoningTitle}</CardTitle>
              <CardDescription className="text-lg text-card-foreground/80 max-w-xl mx-auto">
                {currentTexts.aiReasoningDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="default" className="mb-6 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300">
                <Info className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                <AlertTitle className="font-semibold">{currentTexts.understandingAiTitle}</AlertTitle>
                <AlertDescription>
                   {currentTexts.understandingAiDesc}
                </AlertDescription>
              </Alert>
              <AiReasoningSection lang={pageLang} />
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </AppLayout>
  );
}

    