
"use client";

import * as React from 'react'; // Added React import
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Settings, Info, Database, Lock, Link as LinkIconLucide, Cloud, Zap, DollarSign, Key, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';

const pageTexts = {
  en: {
    title: "Production Setup Guide & Checklist",
    description: "This guide helps you configure Prooflight for a live production environment. Enter your actual values for your reference. These settings must be applied manually in your hosting environment or code as indicated.",
    disclaimerTitle: "Important Disclaimer",
    disclaimerDesc: "This page is a guide only. Saving notes here DOES NOT automatically configure your application. You or your development team must manually apply these settings to your hosting environment, smart contracts, and relevant code.",
    loadingPermissions: "Loading access permissions...",
    accessDeniedTitle: "Access Denied",
    accessDeniedDesc: "You do not have permission to view this page. This area is restricted to Site Admins.",
    saveNotesButton: "Save Notes for Reference",
    notesSavedTitle: "Notes Saved",
    notesSavedDesc: "Your production setup notes have been saved to your browser's local storage.",
    
    sections: {
      envVars: {
        title: "Environment Variables (.env / Hosting Provider)",
        desc: "These are critical values that should be set as environment variables in your hosting provider (e.g., Firebase App Hosting). Create a `.env.production.local` file for local production testing if needed, but do not commit sensitive keys to Git. Refer to `.env.example`.",
        googleApiKey: {
          label: "Google AI API Key (for Genkit)",
          placeholder: "AIzaSy...",
          explanation: "Your API key for Google AI Studio / Vertex AI, used by Genkit for AI features. Set as `PROOFLIGHT_GOOGLE_AI_API_KEY`.",
        },
        firebaseConfig: {
          label: "Firebase Configuration (if using Firebase Auth/DB)",
          placeholder: "{ apiKey: '...', authDomain: '...', ... }",
          explanation: "If using Firebase services directly (not just App Hosting), provide your Firebase project configuration JSON. Typically, individual keys like `PROOFLIGHT_FIREBASE_API_KEY`, `PROOFLIGHT_FIREBASE_AUTH_DOMAIN`, etc., are set as separate environment variables.",
        },
        databaseUrl: {
          label: "Database Connection URL (if not Firebase)",
          placeholder: "postgres://user:pass@host:port/db",
          explanation: "Connection string for your production database (e.g., PostgreSQL, MongoDB). Set as `PROOFLIGHT_DATABASE_URL`.",
        },
        ipfsApiKey: {
          label: "IPFS Pinning Service API Key (e.g., Pinata)",
          placeholder: "Your Pinata API Key",
          explanation: "API key for your chosen IPFS pinning service to ensure documents remain available. Set as `PROOFLIGHT_IPFS_PINATA_API_KEY` (or similar, depending on service).",
        },
        jwtSecret: {
          label: "JWT Secret Key (for custom auth)",
          placeholder: "A_very_strong_random_secret_key",
          explanation: "A strong, random secret key for signing JWTs if you implement custom authentication. Set as `PROOFLIGHT_JWT_SECRET`.",
        },
      },
      blockchain: {
        title: "Blockchain & NFT Configuration",
        desc: "Settings related to your smart contracts and blockchain interaction. These might be in `src/config/production-settings.ts` or environment variables.",
        networkName: {
          label: "Target Blockchain Network Name",
          placeholder: "e.g., Polygon Mainnet, Ethereum Sepolia",
          explanation: "The name of the blockchain network you are deploying to (e.g., 'matic', 'sepolia').",
        },
        rpcUrl: {
          label: "Blockchain RPC URL",
          placeholder: "https://polygon-rpc.com or Infura/Alchemy URL",
          explanation: "The RPC endpoint URL for interacting with your chosen blockchain network. Set as `PROOFLIGHT_RPC_URL`.",
        },
        contractAddress: {
          label: "Prooflight NFT Smart Contract Address",
          placeholder: "0x...",
          explanation: "The deployed address of your main Prooflight NFT smart contract.",
        },
        issuerWalletPrivateKey: {
          label: "Issuer Wallet Private Key (Server-Side Minting - Handle with EXTREME caution)",
          placeholder: "0x... (Keep this highly secure and prefer client-side signing)",
          explanation: "Private key for the wallet that will pay gas fees for minting NFTs if your backend handles minting. CRITICAL: Store this as a highly secure secret in your hosting environment (e.g., Google Secret Manager, HashiCorp Vault) and access it via environment variables. Never commit to code. For enhanced security, consider a solution where users pay their own gas or use a relayer. Set as `PROOFLIGHT_ISSUER_PRIVATE_KEY`.",
        },
      },
      appConfig: {
        title: "Application Configuration (`src/config/production-settings.ts`)",
        desc: "These settings might be part of a configuration file within your application code. Create/update `src/config/production-settings.ts` based on `src/config/production-settings.example.ts`.",
        siteUrl: {
          label: "Production Site URL",
          placeholder: "https://your-prooflight-app.com",
          explanation: "The canonical URL of your live application.",
        },
        paymentReceiverAddress: {
          label: "Payment Receiving Wallet Address (Site Owner)",
          placeholder: "0x... (Your Ethereum/Polygon address)",
          explanation: "The public wallet address where you will receive payments, if applicable.",
        },
      },
      hosting: {
        title: "Hosting & Domain",
        desc: "Considerations for your hosting setup.",
        domainName: {
          label: "Custom Domain Name",
          placeholder: "prooflight.yourdomain.com",
          explanation: "Your configured custom domain for the application.",
        },
        firebaseAppHostingRegion: {
          label: "Firebase App Hosting Region",
          placeholder: "e.g., us-west1",
          explanation: "The region where your Firebase App Hosting backend is deployed.",
        }
      }
    }
  },
  ar: {
    title: "دليل وإعدادات الإنتاج",
    description: "يساعدك هذا الدليل على تكوين تحقيق (Prooflight) لبيئة إنتاج حية. أدخل قيمك الفعلية للرجوع إليها. يجب تطبيق هذه الإعدادات يدويًا في بيئة الاستضافة أو الكود كما هو موضح.",
    disclaimerTitle: "إخلاء مسؤولية هام",
    disclaimerDesc: "هذه الصفحة هي دليل فقط. حفظ الملاحظات هنا لا يقوم بتكوين تطبيقك تلقائيًا. يجب عليك أو على فريق التطوير الخاص بك تطبيق هذه الإعدادات يدويًا على بيئة الاستضافة والعقود الذكية والكود ذي الصلة.",
    loadingPermissions: "جار تحميل أذونات الوصول...",
    accessDeniedTitle: "تم رفض الوصول",
    accessDeniedDesc: "ليس لديك إذن لعرض هذه الصفحة. هذه المنطقة مخصصة لمسؤولي الموقع فقط.",
    saveNotesButton: "حفظ الملاحظات للرجوع إليها",
    notesSavedTitle: "تم حفظ الملاحظات",
    notesSavedDesc: "تم حفظ ملاحظات إعداد الإنتاج الخاصة بك في التخزين المحلي للمتصفح.",

    sections: {
      envVars: {
        title: "متغيرات البيئة (.env / مزود الاستضافة)",
        desc: "هذه قيم حاسمة يجب تعيينها كمتغيرات بيئة في مزود الاستضافة الخاص بك (مثل Firebase App Hosting). قم بإنشاء ملف `.env.production.local` لاختبار الإنتاج المحلي إذا لزم الأمر، ولكن لا تقم بإيداع مفاتيح حساسة في Git. ارجع إلى `.env.example`.",
        googleApiKey: {
          label: "مفتاح API لـ Google AI (لـ Genkit)",
          placeholder: "AIzaSy...",
          explanation: "مفتاح API الخاص بك لـ Google AI Studio / Vertex AI، المستخدم بواسطة Genkit لميزات الذكاء الاصطناعي. عيّن كـ `PROOFLIGHT_GOOGLE_AI_API_KEY`.",
        },
        firebaseConfig: {
          label: "تكوين Firebase (إذا كنت تستخدم Firebase Auth/DB)",
          placeholder: "{ apiKey: '...', authDomain: '...', ... }",
          explanation: "إذا كنت تستخدم خدمات Firebase مباشرة (وليس فقط App Hosting)، فقدم تكوين مشروع Firebase الخاص بك بتنسيق JSON. عادةً ما يتم تعيين مفاتيح فردية مثل `PROOFLIGHT_FIREBASE_API_KEY`، `PROOFLIGHT_FIREBASE_AUTH_DOMAIN`، وما إلى ذلك، كمتغيرات بيئة منفصلة.",
        },
        databaseUrl: {
          label: "عنوان URL لاتصال قاعدة البيانات (إذا لم يكن Firebase)",
          placeholder: "postgres://user:pass@host:port/db",
          explanation: "سلسلة الاتصال بقاعدة بيانات الإنتاج الخاصة بك (مثل PostgreSQL، MongoDB). عيّن كـ `PROOFLIGHT_DATABASE_URL`.",
        },
        ipfsApiKey: {
          label: "مفتاح API لخدمة تثبيت IPFS (مثل Pinata)",
          placeholder: "مفتاح Pinata API الخاص بك",
          explanation: "مفتاح API لخدمة تثبيت IPFS التي اخترتها لضمان بقاء المستندات متاحة. عيّن كـ `PROOFLIGHT_IPFS_PINATA_API_KEY` (أو ما شابه، حسب الخدمة).",
        },
        jwtSecret: {
          label: "مفتاح سري لـ JWT (للمصادقة المخصصة)",
          placeholder: "مفتاح_سري_عشوائي_قوي_جدا",
          explanation: "مفتاح سري قوي وعشوائي لتوقيع JWTs إذا قمت بتنفيذ مصادقة مخصصة. عيّن كـ `PROOFLIGHT_JWT_SECRET`.",
        },
      },
      blockchain: {
        title: "تكوين البلوكتشين و NFT",
        desc: "الإعدادات المتعلقة بعقودك الذكية وتفاعلات البلوكتشين. قد تكون هذه في `src/config/production-settings.ts` أو متغيرات البيئة.",
        networkName: {
          label: "اسم شبكة البلوكتشين المستهدفة",
          placeholder: "مثال: Polygon Mainnet, Ethereum Sepolia",
          explanation: "اسم شبكة البلوكتشين التي تقوم بالنشر عليها (مثل 'matic'، 'sepolia').",
        },
        rpcUrl: {
          label: "عنوان URL لـ RPC للبلوكتشين",
          placeholder: "https://polygon-rpc.com أو عنوان URL لـ Infura/Alchemy",
          explanation: "عنوان URL لنقطة نهاية RPC للتفاعل مع شبكة البلوكتشين التي اخترتها. عيّن كـ `PROOFLIGHT_RPC_URL`.",
        },
        contractAddress: {
          label: "عنوان العقد الذكي لـ Prooflight NFT",
          placeholder: "0x...",
          explanation: "العنوان المنشور للعقد الذكي الرئيسي لـ Prooflight NFT.",
        },
        issuerWalletPrivateKey: {
          label: "المفتاح الخاص بمحفظة المُصدر (سك من جانب الخادم - تعامل معه بحذر شديد)",
          placeholder: "0x... (حافظ على هذا آمنًا للغاية وفضل التوقيع من جانب العميل)",
          explanation: "المفتاح الخاص بالمحفظة التي ستدفع رسوم الغاز لسك NFTs إذا كان خادمك الخلفي يتعامل مع السك. هام للغاية: قم بتخزين هذا كمفتاح سري آمن للغاية في بيئة الاستضافة الخاصة بك (مثل Google Secret Manager، HashiCorp Vault) وقم بالوصول إليه عبر متغيرات البيئة. لا تقم أبدًا بإيداعه في الكود. لتعزيز الأمان، ضع في اعتبارك حلاً يدفع فيه المستخدمون رسوم الغاز الخاصة بهم أو يستخدمون مرحلًا. عيّن كـ `PROOFLIGHT_ISSUER_PRIVATE_KEY`.",
        },
      },
      appConfig: {
        title: "تكوين التطبيق (`src/config/production-settings.ts`)",
        desc: "قد تكون هذه الإعدادات جزءًا من ملف تكوين داخل كود التطبيق الخاص بك. قم بإنشاء/تحديث `src/config/production-settings.ts` بناءً على `src/config/production-settings.example.ts`.",
        siteUrl: {
          label: "عنوان URL لموقع الإنتاج",
          placeholder: "https://your-prooflight-app.com",
          explanation: "عنوان URL الأساسي لتطبيقك المباشر.",
        },
        paymentReceiverAddress: {
          label: "عنوان محفظة استلام المدفوعات (مالك الموقع)",
          placeholder: "0x... (عنوان Ethereum/Polygon الخاص بك)",
          explanation: "عنوان المحفظة العام حيث ستتلقى المدفوعات، إذا كان ذلك ممكنًا.",
        },
      },
      hosting: {
        title: "الاستضافة والنطاق",
        desc: "اعتبارات لإعداد الاستضافة الخاص بك.",
        domainName: {
          label: "اسم النطاق المخصص",
          placeholder: "prooflight.yourdomain.com",
          explanation: "النطاق المخصص الذي تم تكوينه للتطبيق.",
        },
        firebaseAppHostingRegion: {
          label: "منطقة Firebase App Hosting",
          placeholder: "مثال: us-west1",
          explanation: "المنطقة التي تم نشر خادم Firebase App Hosting الخلفي فيها.",
        }
      }
    }
  }
};

type ConfigFormData = {
  [section: string]: {
    [key: string]: string;
  };
};

const LOCAL_STORAGE_KEY = 'prooflightProductionSetupNotes';

export default function ProductionSetupPage() {
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');
  const [loggedInUserRole, setLoggedInUserRole] = useState<UserRole | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [formData, setFormData] = useState<ConfigFormData>({});
  const { toast } = useToast();

  const currentTexts = pageTexts[pageLang];

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) setPageLang(storedLang);

    const authDataString = localStorage.getItem('authToken');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        setLoggedInUserRole(authData.role);
      } catch (e) {
        console.error("Failed to parse auth token:", e);
        setLoggedInUserRole(null);
      }
    }
    setLoadingRole(false);

    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedNotes) {
      try {
        setFormData(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse saved production setup notes:", e);
      }
    }

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
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleInputChange = (section: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      }
    }));
  };

  const handleSaveNotes = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      toast({ title: currentTexts.notesSavedTitle, description: currentTexts.notesSavedDesc });
    } catch (e) {
      console.error("Failed to save production setup notes:", e);
      toast({ title: "Save Failed", description: "Could not save notes to local storage.", variant: "destructive" });
    }
  };

  if (loadingRole) {
    return <AppLayout><div className="text-center py-10">{currentTexts.loadingPermissions}</div></AppLayout>;
  }

  if (loggedInUserRole !== 'site_admin') {
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
          <p className="text-muted-foreground">{currentTexts.accessDeniedDesc}</p>
        </motion.div>
      </AppLayout>
    );
  }

  const renderSection = (sectionKey: keyof typeof currentTexts.sections, sectionIcon: React.ElementType) => {
    const sectionConfig = currentTexts.sections[sectionKey];
    return (
      <AccordionItem value={sectionKey} className="bg-card border border-border rounded-lg shadow-md">
        <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
          <div className="flex items-center">
            {React.createElement(sectionIcon, { className: pageLang === 'ar' ? "ml-3 h-7 w-7 text-primary" : "mr-3 h-7 w-7 text-primary" })} 
            {sectionConfig.title}
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-0 space-y-6">
          <p className="text-muted-foreground">{sectionConfig.desc}</p>
          {Object.entries(sectionConfig).filter(([key]) => key !== 'title' && key !== 'desc').map(([itemKey, itemConfig]: [string, any]) => (
            <div key={itemKey} className="space-y-2 border-t border-border/50 pt-4 first:border-t-0 first:pt-0">
              <Label htmlFor={`${sectionKey}-${itemKey}`}>{itemConfig.label}</Label>
              <Input
                id={`${sectionKey}-${itemKey}`}
                placeholder={itemConfig.placeholder}
                value={formData[sectionKey]?.[itemKey] || ''}
                onChange={(e) => handleInputChange(sectionKey, itemKey, e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">{itemConfig.explanation}</p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <AppLayout>
      <motion.div 
        className="max-w-3xl mx-auto py-8 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Card className="shadow-xl border-border">
          <CardHeader className="text-center">
            <Settings className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-foreground">{currentTexts.title}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {currentTexts.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-6">
              <Info className={pageLang === 'ar' ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
              <AlertTitle className="font-semibold">{currentTexts.disclaimerTitle}</AlertTitle>
              <AlertDescription>{currentTexts.disclaimerDesc}</AlertDescription>
            </Alert>
            
            <Accordion type="multiple" className="w-full space-y-6">
              {renderSection('envVars', Key)}
              {renderSection('blockchain', LinkIconLucide)}
              {renderSection('appConfig', Settings)}
              {renderSection('hosting', Cloud)}
            </Accordion>

            <Button onClick={handleSaveNotes} className="w-full mt-8 bg-primary hover:bg-primary-hover text-primary-foreground text-lg py-3">
              {currentTexts.saveNotesButton}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
