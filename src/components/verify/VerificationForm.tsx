
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VerificationResultDisplay } from './VerificationResultDisplay';
import type { NftMetadata } from '@/lib/types'; // Ensure this type is defined
import { mockNfts } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const formTexts = {
  en: {
    label: "NFT ID or Wallet Address",
    placeholder: "e.g., NFT001 or 0x123...abc",
    buttonVerify: "Verify Proof",
    buttonVerifying: "Verifying...",
    toastInputRequiredTitle: "Input Required",
    toastInputRequiredDesc: "Please enter an NFT ID or wallet address.",
    toastVerificationCompleteTitle: "Verification Complete",
    toastVerificationCompleteDesc: (name: string) => `Details for '${name}' retrieved.`,
    toastNotFoundTitle: "Not Found",
    toastNotFoundDesc: "No matching NFT found for the provided ID/address.",
  },
  ar: {
    label: "معرّف NFT أو عنوان المحفظة",
    placeholder: "مثال: NFT001 أو 0x123...abc",
    buttonVerify: "تحقق من الإثبات",
    buttonVerifying: "جار التحقق...",
    toastInputRequiredTitle: "الإدخال مطلوب",
    toastInputRequiredDesc: "يرجى إدخال معرّف NFT أو عنوان المحفظة.",
    toastVerificationCompleteTitle: "اكتمل التحقق",
    toastVerificationCompleteDesc: (name: string) => `تم استرداد تفاصيل '${name}'.`,
    toastNotFoundTitle: "غير موجود",
    toastNotFoundDesc: "لم يتم العثور على NFT مطابق للمعرّف/العنوان المقدم.",
  }
};

interface VerificationFormProps {
  lang: 'en' | 'ar';
}

export function VerificationForm({ lang }: VerificationFormProps) {
  const [inputId, setInputId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<NftMetadata | null | 'not_found'>(null);
  const { toast } = useToast();
  const currentTexts = formTexts[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputId.trim()) {
      toast({ title: currentTexts.toastInputRequiredTitle, description: currentTexts.toastInputRequiredDesc, variant: "destructive"});
      return;
    }
    setIsLoading(true);
    setVerificationResult(null);

    try {
      // Mock verification logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundNft = mockNfts.find(nft => nft.id === inputId || nft.ownerAddress === inputId);

      if (foundNft) {
        setVerificationResult(foundNft);
        toast({ title: currentTexts.toastVerificationCompleteTitle, description: currentTexts.toastVerificationCompleteDesc(foundNft.name)});
      } else {
        setVerificationResult('not_found');
        toast({ title: currentTexts.toastNotFoundTitle, description: currentTexts.toastNotFoundDesc, variant: "destructive"});
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({ title: "Verification Error", description: "An error occurred while verifying the proof.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nftId" className="text-base">{currentTexts.label}</Label>
          <Input
            id="nftId"
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder={currentTexts.placeholder}
            className="mt-1 text-base"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full text-base py-3">
          {isLoading ? currentTexts.buttonVerifying : currentTexts.buttonVerify}
        </Button>
      </form>

      {verificationResult && (
        <VerificationResultDisplay result={verificationResult} lang={lang} />
      )}
    </div>
  );
}

    