
"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Home, ScanSearch, UserCheck, Zap, ShieldCheck, Users, UserCog, SearchCheck, ArrowRight, Blocks, Gem, Package, Brain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils'; // Ensure cn is imported

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const howToVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const howToItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TechIcon = ({ icon: Icon, className, style }: { icon: React.ElementType, className?: string, style?: React.CSSProperties }) => (
  <Icon className={cn("absolute text-white/10 animate-subtle-tech-pulse", className)} style={style} />
);

const pageTexts = {
  en: {
    heroTitle1: "Own Your Credentials.",
    heroTitle2: "Verify Your Identity.",
    heroTitle3: "On the Blockchain.",
    heroSubtitle: "Prooflight empowers you with secure, verifiable digital proofs for credentials, ownership, and identity, all powered by cutting-edge technology.",
    goToDashboard: "Go to Dashboard",
    verifyProof: "Verify a Proof",
    whyProoflightTitle: "Why Prooflight?",
    features: [
      { mainIcon: Award, secondaryIcon: Gem, title: "Educational Credentials", desc: "Issue and verify diplomas, certificates, and academic achievements as tamper-proof digital assets.", hint:"education certificate"},
      { mainIcon: Home, secondaryIcon: Blocks, title: "Real Estate & Ownership", desc: "Represent property deeds and rental agreements as NFTs for transparent and secure ownership records.", hint:"property document"},
      { mainIcon: UserCheck, secondaryIcon: Gem, title: "Identity Verification", desc: "Manage digital IDs and licenses, enhancing security and personal control over identification.", hint:"id card"},
      { mainIcon: ShieldCheck, secondaryIcon: Blocks, title: "Unmatched Security", desc: "Leverage blockchain for immutable and trustworthy records, protecting against fraud and forgery.", hint:"security shield"},
      { mainIcon: Zap, secondaryIcon: Brain, title: "AI-Powered Insights", desc: "Our AI provides an extra layer of reasoning for proof validation, boosting confidence in verification.", hint:"artificial intelligence"},
      { mainIcon: ScanSearch, secondaryIcon: Package, title: "Simple Verification & Storage", desc: "Easily verify any proof using NFT IDs or wallet addresses, with documents linked via decentralized storage (IPFS).", hint:"magnifying glass search"},
    ],
    howProoflightWorksTitle: "How Prooflight Works for You",
    userRoles: [
      {
        icon: Users,
        title: "For Proof Holders",
        desc: "Securely manage and present your digital credentials. Access your verified achievements, licenses,and ownership documents anytime, anywhere from your personal dashboard.",
        cta: "Access Your Dashboard",
        link: "/dashboard",
        hint: "digital wallet"
      },
      {
        icon: UserCog,
        title: "For Issuers & Admins",
        desc: "Easily create, distribute, and manage tamper-proof digital credentials. Streamline your issuance process with our secure and intuitive admin tools.",
        cta: "Issue a New Proof",
        link: "/admin/issue-nft",
        hint: "certificate creation"
      },
      {
        icon: SearchCheck,
        title: "For Verifiers",
        desc: "Quickly and reliably confirm the authenticity of any digital proof. Utilize NFT IDs or wallet addresses for instant verification, backed by blockchain and AI reasoning.",
        cta: "Verify a Proof",
        link: "/verify",
        hint: "document check"
      },
    ],
    aiVerificationTitle: "Intelligent Verification with AI",
    aiVerificationDesc: "Prooflight utilizes advanced AI to analyze the context of a digital proof against the claimed identity. This offers deeper insights and confidence scores, making your verification process more robust and intelligent than ever before.",
    exploreAiReasoning: "Explore AI Reasoning",
  },
  ar: {
    heroTitle1: "امتلك بيانات اعتمادك.",
    heroTitle2: "تحقق من هويتك.",
    heroTitle3: "على البلوكتشين.",
    heroSubtitle: "يمكّنك تحقيق (Prooflight) من إثباتات رقمية آمنة يمكن التحقق منها لبيانات الاعتماد والملكية والهوية، وكلها مدعومة بتقنيات متطورة.",
    goToDashboard: "اذهب إلى لوحة التحكم",
    verifyProof: "تحقق من إثبات",
    whyProoflightTitle: "لماذا تحقيق (Prooflight)؟",
    features: [
      { mainIcon: Award, secondaryIcon: Gem, title: "بيانات الاعتماد التعليمية", desc: "إصدار والتحقق من الدبلومات والشهادات والإنجازات الأكاديمية كأصول رقمية مقاومة للتلاعب.", hint:"education certificate"},
      { mainIcon: Home, secondaryIcon: Blocks, title: "العقارات والملكية", desc: "تمثيل صكوك الملكية وعقود الإيجار كرموز غير قابلة للاستبدال (NFTs) لسجلات ملكية شفافة وآمنة.", hint:"property document"},
      { mainIcon: UserCheck, secondaryIcon: Gem, title: "التحقق من الهوية", desc: "إدارة بطاقات الهوية الرقمية والرخص، مما يعزز الأمان والتحكم الشخصي في الهوية.", hint:"id card"},
      { mainIcon: ShieldCheck, secondaryIcon: Blocks, title: "أمان لا مثيل له", desc: "استفد من البلوكتشين لسجلات غير قابلة للتغيير وجديرة بالثقة، مما يحمي من الاحتيال والتزوير.", hint:"security shield"},
      { mainIcon: Zap, secondaryIcon: Brain, title: "رؤى مدعومة بالذكاء الاصطناعي", desc: "يوفر الذكاء الاصطناعي لدينا طبقة إضافية من الاستدلال للتحقق من صحة الإثبات، مما يعزز الثقة في التحقق.", hint:"artificial intelligence"},
      { mainIcon: ScanSearch, secondaryIcon: Package, title: "تحقق وتخزين بسيط", desc: "تحقق بسهولة من أي إثبات باستخدام معرفات NFT أو عناوين المحفظة، مع ربط المستندات عبر التخزين اللامركزي (IPFS).", hint:"magnifying glass search"},
    ],
    howProoflightWorksTitle: "كيف يعمل تحقيق (Prooflight) من أجلك",
    userRoles: [
      {
        icon: Users,
        title: "لحاملي الإثباتات",
        desc: "إدارة وتقديم بيانات اعتمادك الرقمية بشكل آمن. يمكنك الوصول إلى إنجازاتك ورخصك ووثائق ملكيتك التي تم التحقق منها في أي وقت ومن أي مكان من لوحة التحكم الشخصية الخاصة بك.",
        cta: "الوصول إلى لوحة التحكم",
        link: "/dashboard",
        hint: "digital wallet"
      },
      {
        icon: UserCog,
        title: "للمُصدرين والمسؤولين",
        desc: "إنشاء وتوزيع وإدارة بيانات اعتماد رقمية مقاومة للتلاعب بسهولة. قم بتبسيط عملية الإصدار الخاصة بك باستخدام أدوات الإدارة الآمنة والبديهية لدينا.",
        cta: "إصدار إثبات جديد",
        link: "/admin/issue-nft",
        hint: "certificate creation"
      },
      {
        icon: SearchCheck,
        title: "للمُحققين",
        desc: "تأكيد صحة أي إثبات رقمي بسرعة وموثوقية. استخدم معرفات NFT أو عناوين المحافظ للتحقق الفوري، مدعومًا بالبلوكتشين واستدلال الذكاء الاصطناعي.",
        cta: "تحقق من إثبات",
        link: "/verify",
        hint: "document check"
      },
    ],
    aiVerificationTitle: "تحقق ذكي باستخدام الذكاء الاصطناعي",
    aiVerificationDesc: "يستخدم تحقيق (Prooflight) الذكاء الاصطناعي المتقدم لتحليل سياق الإثبات الرقمي مقابل الهوية المطالب بها. وهذا يوفر رؤى أعمق ودرجات ثقة، مما يجعل عملية التحقق الخاصة بك أكثر قوة وذكاءً من أي وقت مضى.",
    exploreAiReasoning: "استكشف استدلال الذكاء الاصطناعي",
  }
};

export default function HomePage() {
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
      <div dir={pageLang === 'ar' ? 'rtl' : 'ltr'}>
        <motion.section 
          className="py-20 md:py-32 text-center relative overflow-hidden min-h-[70vh] flex flex-col justify-center items-center animated-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/30 z-0"></div>
          
          <div className="absolute inset-0 z-[5] overflow-hidden">
            <TechIcon icon={Blocks} className="h-16 w-16" style={{ top: '10%', left: '15%', animationDelay: '0s' }} />
            <TechIcon icon={Gem} className="h-12 w-12" style={{ top: '20%', left: '80%', animationDelay: '1s' }} />
            <TechIcon icon={Package} className="h-20 w-20" style={{ top: '70%', left: '10%', animationDelay: '2s' }} />
            <TechIcon icon={Blocks} className="h-10 w-10" style={{ top: '80%', left: '85%', animationDelay: '0.5s' }} />
            <TechIcon icon={Gem} className="h-14 w-14" style={{ top: '40%', left: '45%', animationDelay: '1.5s' }} />
             <TechIcon icon={Package} className="h-16 w-16" style={{ top: '5%', left: '55%', animationDelay: '2.5s' }} />
             <TechIcon icon={Blocks} className="h-12 w-12" style={{ top: '65%', left: '60%', animationDelay: '0.2s' }} />
             <TechIcon icon={Gem} className="h-16 w-16" style={{ top: '30%', left: '5%', animationDelay: '1.2s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold font-headline mb-6 text-white"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {currentTexts.heroTitle1} <span className="block md:inline">{currentTexts.heroTitle2}</span> <span className="block text-accent">{currentTexts.heroTitle3}</span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {currentTexts.heroSubtitle}
            </motion.p>
            <motion.div 
              className="space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button size="lg" asChild className="bg-primary hover:bg-primary-hover text-primary-foreground w-full sm:w-auto">
                <Link href="/dashboard">{currentTexts.goToDashboard}</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent text-white border-white/70 hover:bg-white/10 hover:text-white hover:border-white w-full sm:w-auto" 
                asChild
              >
                <Link href="/verify">{currentTexts.verifyProof}</Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className="py-16 md:py-24 bg-background"
          variants={featureVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-headline text-center mb-12 text-foreground">{currentTexts.whyProoflightTitle}</h2>
            <motion.div className="grid md:grid-cols-3 gap-8" variants={featureVariants}>
              {currentTexts.features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow h-full bg-card text-card-foreground border-border hover:border-primary">
                    <CardHeader>
                      <div className="flex justify-center items-center mb-4 relative">
                        <feature.mainIcon className="h-12 w-12 text-primary" />
                        {feature.secondaryIcon && (
                          <feature.secondaryIcon className="h-6 w-6 text-primary/70 absolute -top-1 -right-1 rtl:-left-1 rtl:-right-auto transform translate-x-1/4 -translate-y-1/4" />
                        )}
                      </div>
                      <CardTitle className="text-center text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-card-foreground/80">
                        {feature.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="py-16 md:py-24 bg-muted/30"
          variants={howToVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-headline text-center mb-12 text-foreground">{currentTexts.howProoflightWorksTitle}</h2>
            <motion.div className="grid md:grid-cols-3 gap-8" variants={howToVariants}>
              {currentTexts.userRoles.map((item, idx) => (
                <motion.div key={idx} variants={howToItemVariants}>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow h-full bg-card text-card-foreground border-border hover:border-accent group">
                    <CardHeader className="items-center text-center">
                      <div className="p-3 bg-accent/10 rounded-full inline-block mb-3 group-hover:bg-accent/20 transition-colors">
                        <item.icon className="h-10 w-10 text-accent" />
                      </div>
                      <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-card-foreground/80 mb-6">
                        {item.desc}
                      </CardDescription>
                    </CardContent>
                    <CardContent className="text-center pt-0">
                      <Button asChild variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <Link href={item.link}>
                          {item.cta} <ArrowRight className={pageLang === 'ar' ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className="py-16 md:py-24 bg-background"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className={pageLang === 'ar' ? 'md:order-2' : ''}>
              <h2 className="text-3xl font-bold font-headline mb-6 text-foreground">{currentTexts.aiVerificationTitle}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {currentTexts.aiVerificationDesc}
              </p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-hover" asChild>
                <Link href="/verify#ai-reasoning">{currentTexts.exploreAiReasoning}</Link>
              </Button>
            </div>
            <motion.div
              className={pageLang === 'ar' ? 'md:order-1' : ''}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="AI Verification Process" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl"
                data-ai-hint="futuristic technology abstract" 
              />
            </motion.div>
          </div>
        </motion.section>
      </div>
    </AppLayout>
  );
}
    

    