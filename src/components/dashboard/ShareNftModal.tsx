
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShareNftModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftName: string;
  verificationLink: string;
}

const modalTexts = {
  en: {
    title: "Share",
    description: "Share this link or QR code to allow others to verify this digital proof.",
    linkCopiedTitle: "Link Copied!",
    linkCopiedDesc: "Verification link copied to clipboard.",
  },
  ar: {
    title: "مشاركة",
    description: "شارك هذا الرابط أو رمز الاستجابة السريعة للسماح للآخرين بالتحقق من هذا الإثبات الرقمي.",
    linkCopiedTitle: "تم نسخ الرابط!",
    linkCopiedDesc: "تم نسخ رابط التحقق إلى الحافظة.",
  }
};

export function ShareNftModal({ isOpen, onClose, nftName, verificationLink }: ShareNftModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [fullVerificationLink, setFullVerificationLink] = useState('');
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) {
      setPageLang(storedLang);
    }
    // Listener for language changes could be added here if needed for modals open during lang switch
  }, []);
  
  const currentTexts = modalTexts[pageLang];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullVerificationLink(`${window.location.origin}${verificationLink}`);
    }
  }, [verificationLink]);


  const handleCopy = async () => {
    if (fullVerificationLink) {
      try {
        await navigator.clipboard.writeText(fullVerificationLink);
        setCopied(true);
        toast({ title: currentTexts.linkCopiedTitle, description: currentTexts.linkCopiedDesc });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy verification link to clipboard:", error);
        toast({ title: "Copy Failed", description: "Unable to copy link to clipboard.", variant: "destructive" });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir={pageLang === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{currentTexts.title} "{nftName}"</DialogTitle>
          <DialogDescription>
            {currentTexts.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Input id="link" value={fullVerificationLink} readOnly dir="ltr" />
            <Button type="button" size="sm" onClick={handleCopy} variant="outline">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <div className="flex justify-center mt-4 p-4 bg-white rounded-md">
            {fullVerificationLink && (
              <QRCodeSVG 
                value={fullVerificationLink} 
                size={180} 
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

