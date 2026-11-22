
import { BadgeCheck } from 'lucide-react'; // Changed from ShieldCheck
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; 

interface LogoProps {
  lang?: 'en' | 'ar';
  arabicName?: string;
}

export function Logo({ lang = 'en', arabicName = "تحقيق" }: LogoProps) { // Changed default arabicName
  const siteName = lang === 'ar' ? arabicName : 'Prooflight';

  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }} // Adjust animation for RTL
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <BadgeCheck className="h-7 w-7 text-primary" /> {/* Changed from ShieldCheck */}
      <span className={cn("text-xl font-bold font-headline text-foreground", lang === 'ar' ? "mr-2" : "ml-2")}>
        {siteName}
      </span>
    </motion.div>
  );
}
