
"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, CheckSquare, ShieldPlus, Settings, UserCircle, Search, FileText, LogIn, Share2, BarChart2, Edit3, Eye, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 }, 
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HowItWorksArabicPage() {
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('ar'); // This page is Arabic

  useEffect(() => {
    // This page is Arabic, so we always set to 'ar' for content display consistency,
    // but we listen to global changes for dir attribute consistency with AppLayout.
    const globalLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    setPageLang(globalLang || 'ar'); // Set for dir, actual content remains Arabic.

    const handleLangChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ newLang: 'en' | 'ar' }>;
      if (customEvent.detail && customEvent.detail.newLang) {
        setPageLang(customEvent.detail.newLang); // Update for dir attribute
      }
    };
    window.addEventListener('langchange', handleLangChange);
    
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setPageLang(event.newValue); // Update for dir attribute
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);


  return (
    <AppLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-4xl mx-auto py-8 space-y-10"
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'} // Keep dir dynamic for consistency
      >
        <Card className="shadow-xl border-border">
          <CardHeader className="text-center">
            <motion.div
              className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full"
              animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }} 
              transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
            >
              <Users className="h-12 w-12 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-foreground">دليل مستخدم تحقيق (Prooflight)</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              دليلك خطوة بخطوة للاستفادة من تحقيق (Prooflight) للحصول على بيانات اعتماد رقمية آمنة.
            </CardDescription>
          </CardHeader>
        </Card>

        <motion.section variants={sectionVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center"><Info className="ml-3 h-6 w-6 text-primary" />فهم تحقيق (Prooflight)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-card-foreground/90">
              <p>يُحدث تحقيق (Prooflight) ثورة في كيفية إدارة بيانات الاعتماد والتحقق منها في عالم رقمي. باستخدام تقنية البلوكتشين (تحديدًا الرموز غير القابلة للاستبدال - NFTs) والذكاء الاصطناعي، يوفر تحقيق (Prooflight) منصة آمنة وشفافة يتحكم فيها المستخدم لإثباتاتك الرقمية.</p>
              <p><strong>الفوائد الرئيسية:</strong></p>
              <ul className="list-disc list-inside space-y-1 pr-4">
                <li><strong>ملكية حقيقية:</strong> أنت تملك وتتحكم حقًا في بيانات اعتمادك الرقمية كـ NFTs.</li>
                <li><strong>سجلات غير قابلة للتغيير:</strong> يتم تسجيل الإثباتات على البلوكتشين، مما يجعلها مقاومة للتلاعب.</li>
                <li><strong>تحقق شفاف:</strong> يمكن لأي شخص التحقق من الإثباتات بسرعة وسهولة.</li>
                <li><strong>استدلال معزز بالذكاء الاصطناعي:</strong> احصل على طبقة إضافية من الثقة مع تحليل سياقي مدعوم بالذكاء الاصطناعي للإثباتات.</li>
              </ul>
               <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    سيرشدك هذا الدليل عبر الميزات المتاحة بناءً
                    على دورك داخل نظام تحقيق (Prooflight).
                  </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <Accordion type="single" collapsible className="w-full space-y-6">
          {/* Proof Holder Section - Arabic */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="proof-holder" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <UserCircle className="ml-3 h-7 w-7 text-primary" /> لحاملي الإثباتات: إدارة بيانات اعتمادك الرقمية
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p>بصفتك حامل إثبات، لديك السيطرة الكاملة على بيانات اعتمادك الرقمية الصادرة لك.</p>
                <motion.ol className="list-decimal list-inside space-y-4 pr-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>الوصول إلى لوحة التحكم الخاصة بك:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>بعد <Link href="/login" className="text-primary hover:underline">تسجيل الدخول</Link>، سيتم توجيهك إلى <Link href="/dashboard" className="text-primary hover:underline">لوحة التحكم</Link> الخاصة بك.</li>
                      <li>هذه هي مساحتك الشخصية لعرض جميع إثباتاتك الرقمية (NFTs).</li>
                      <li>قد يُطلب منك "ربط المحفظة" للتفاعل مع ميزات البلوكتشين؛ هذه خطوة معيارية في Web3 (محاكاة في هذا العرض التوضيحي).</li>
                    </ul>
                    <Image src="https://placehold.co/600x300.png" alt="لوحة تحكم المستخدم" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="user dashboard UI" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>عرض إثباتاتك:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>يتم عرض إثباتاتك كبطاقات، تُظهر معلومات أساسية مثل الاسم والمُصدر والحالة.</li>
                      <li>انقر على بطاقة أو رابط "تحقق" الخاص بها لرؤية المزيد من التفاصيل على صفحتها المخصصة (على سبيل المثال، <code className="bg-muted px-1 rounded-sm">/nft/[id]</code>).</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>مشاركة إثباتاتك:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>تحتوي كل بطاقة إثبات على زر <Share2 className="inline h-4 w-4 text-primary" /> "مشاركة".</li>
                      <li>يؤدي النقر فوق هذا إلى فتح نافذة تحتوي على رابط تحقق فريد ورمز QR.</li>
                      <li>شارك هذا الرابط أو رمز QR مع أي شخص يحتاج إلى التحقق من بيانات اعتمادك.</li>
                    </ul>
                     <Image src="https://placehold.co/600x300.png" alt="نافذة مشاركة الإثبات" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="share proof modal" />
                  </motion.li>
                </motion.ol>
              </AccordionContent>
            </AccordionItem>
          </motion.div>

          {/* Proof Verifier Section - Arabic */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="proof-verifier" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <CheckSquare className="ml-3 h-7 w-7 text-green-500" /> للمُحققين: تأكيد الأصالة
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p>يمكن لأي شخص التحقق من بيانات الاعتماد الصادرة عن تحقيق (Prooflight) دون الحاجة إلى حساب.</p>
                <motion.ol className="list-decimal list-inside space-y-4 pr-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>الانتقال إلى صفحة التحقق:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>اذهب إلى صفحة <Link href="/verify" className="text-primary hover:underline">التحقق من الإثبات</Link>.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>إدخال مُعرّف الإثبات:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>في قسم "التحقق من الإثبات الرقمي"، أدخل مُعرّف NFT الفريد للإثبات (على سبيل المثال، <code className="bg-muted px-1 rounded-sm">NFT001</code>) أو عنوان المحفظة العام لحامل الإثبات.</li>
                      <li>انقر على "تحقق من الإثبات".</li>
                    </ul>
                    <Image src="https://placehold.co/600x300.png" alt="نموذج التحقق" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="verification process UI" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>مراجعة نتائج التحقق:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>سيعرض النظام تفاصيل الإثبات، بما في ذلك اسمه ومُصدره وتاريخ إصداره وحالته (صادر، منتهي الصلاحية، ملغى)، وأي معلومات مستند مرتبطة.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>استخدام الاستدلال المعزز بالذكاء الاصطناعي (اختياري):</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>في نفس صفحة <Link href="/verify" className="text-primary hover:underline">التحقق من الإثبات</Link>، قم بالتمرير لأسفل إلى قسم "استدلال الإثبات المعزز بالذكاء الاصطناعي".</li>
                      <li>أدخل تفاصيل حول الإثبات (مثل "دبلوم"، "معرف الشهادة") والهوية المطالب بها (مثل "طالب"، "جون دو").</li>
                      <li>سيقدم الذكاء الاصطناعي استدلالًا ودرجة ثقة حول ما إذا كان الإثبات يتوافق منطقيًا مع الهوية المطالب بها.</li>
                    </ul>
                     <Image src="https://placehold.co/600x300.png" alt="قسم الاستدلال بالذكاء الاصطناعي" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="AI analysis UI" />
                  </motion.li>
                </motion.ol>
              </AccordionContent>
            </AccordionItem>
          </motion.div>

          {/* Proof Issuer Section - Arabic */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="proof-issuer" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <ShieldPlus className="ml-3 h-7 w-7 text-accent" /> لمُصدري الإثباتات: إنشاء إثباتات رقمية
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p>يمكن لمُصدري الإثباتات (ومسؤولي الموقع) إنشاء وتوزيع إثباتات رقمية جديدة.</p>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-700 dark:text-yellow-300">
                  <Info className="inline h-4 w-4 ml-1" /> يجب أن تكون قد سجلت الدخول بدور "مُصدر" أو "مسؤول". يمكنك تحديد "مُصدر إثبات" أثناء <Link href="/signup" className="text-primary hover:underline">التسجيل</Link> أو استخدام حساب الاختبار: <code className="bg-muted px-1 rounded-sm">issuer@example.com</code> / <code className="bg-muted px-1 rounded-sm">password</code>.
                </div>
                <motion.ol className="list-decimal list-inside space-y-4 pr-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>الانتقال إلى صفحة إصدار الإثبات:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>بمجرد تسجيل الدخول بالأذونات المناسبة، سترى رابط "إصدار إثبات" في الرأس. انقر عليه للذهاب إلى صفحة <Link href="/admin/issue-nft" className="text-primary hover:underline">إصدار إثبات رقمي جديد</Link>.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>إكمال نموذج الإصدار:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>املأ جميع الحقول المطلوبة: اسم الإثبات، الوصف، نوع بيانات الاعتماد، مُعرّف المستلم (على سبيل المثال، عنوان المحفظة، البريد الإلكتروني، أو معرّف المستخدم)، اسم المُصدر (غالبًا ما يتم ملؤه مسبقًا)، تاريخ الإصدار.</li>
                      <li>اختياريًا، قم بتعيين تاريخ انتهاء الصلاحية.</li>
                      <li>اختياريًا، قم بتحميل مستند. سيؤدي هذا إلى محاكاة التحميل إلى IPFS وملء حقل "تجزئة IPFS للمستند". يمكنك أيضًا إدخال تجزئة IPFS يدويًا.</li>
                    </ul>
                     <Image src="https://placehold.co/600x400.png" alt="نموذج إصدار الإثبات" width={600} height={400} className="mt-2 rounded-md shadow-sm" data-ai-hint="proof issuance form" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>إصدار الإثبات:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>تحقق جيدًا من جميع التفاصيل. انقر على "إصدار الإثبات (محاكاة)".</li>
                      <li>ستؤكد رسالة نجاح الإصدار (المحاكاة). في تطبيق بلوكتشين حقيقي، ستتضمن هذه الخطوة معاملة.</li>
                    </ul>
                  </motion.li>
                </motion.ol>
              </AccordionContent>
            </AccordionItem>
          </motion.div>

          {/* Site Administrator Section - Arabic */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="site-admin" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <Settings className="ml-3 h-7 w-7 text-destructive" /> لمسؤولي الموقع: الإشراف على المنصة
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p> يتمتع مسؤولو الموقع بأعلى مستوى من الوصول، بما في ذلك جميع إمكانيات المُصدر وأدوات إدارة المنصة الإضافية.</p>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-700 dark:text-yellow-300">
                  <Info className="inline h-4 w-4 ml-1" /> للوصول إلى ميزات المسؤول، قم بتسجيل الدخول باستخدام حساب الاختبار: <code className="bg-muted px-1 rounded-sm">admin@example.com</code> / <code className="bg-muted px-1 rounded-sm">password</code>.
                </div>
                <motion.ol className="list-decimal list-inside space-y-4 pr-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>جميع وظائف المُصدر:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>يمكن لمسؤولي الموقع تنفيذ جميع الإجراءات المتاحة لمُصدري الإثباتات، مثل إصدار إثباتات جديدة عبر صفحة <Link href="/admin/issue-nft" className="text-primary hover:underline">إصدار إثبات رقمي جديد</Link>.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>الوصول إلى التحليلات:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>انتقل إلى <Link href="/admin/analytics" className="text-primary hover:underline">لوحة تحكم تحليلات المسؤول</Link> عبر الرابط الموجود في الرأس.</li>
                      <li>عرض إحصائيات حول إجمالي بيانات الاعتماد الصادرة، وبيانات الاعتماد النشطة، وأنواع بيانات الاعتماد، واتجاهات الإصدار، وتوزيعات الحالة.</li>
                      <li>يسمح جدول "الإصدارات الأخيرة" بالبحث والوصول السريع لعرض أو تعديل الإثباتات.</li>
                    </ul>
                     <Image src="https://placehold.co/600x350.png" alt="لوحة تحكم التحليلات" width={600} height={350} className="mt-2 rounded-md shadow-sm" data-ai-hint="admin dashboard UI" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>تعديل الإثباتات الحالية:</strong>
                    <ul className="list-disc list-inside pr-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>من صفحة التحليلات، في جدول "الإصدارات الأخيرة"، انقر على أيقونة <Edit3 className="inline h-4 w-4" /> (تعديل) بجوار الإثبات.</li>
                      <li>سينقلك هذا إلى صفحة <code className="bg-muted px-1 rounded-sm">/admin/edit-proof/[id]</code>.</li>
                      <li>قم بتعديل التفاصيل مثل الاسم والوصف والحالة والمستلم وتجزئة IPFS للمستند (عن طريق تحميل ملف جديد أو مسح الملف الحالي) والتواريخ.</li>
                      <li>انقر على "تحديث الإثبات (محاكاة)" لحفظ التغييرات (محاكاة).</li>
                    </ul>
                  </motion.li>
                </motion.ol>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        </Accordion>

      </motion.div>
    </AppLayout>
  );
}
