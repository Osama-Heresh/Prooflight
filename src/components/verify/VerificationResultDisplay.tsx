
"use client";
import type { NftMetadata } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle, Info, FileText, CalendarDays, Tag, UserCircle, MapPin, Award, ShieldCheck, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface VerificationResultDisplayProps {
  result: NftMetadata | null | 'not_found';
  lang: 'en' | 'ar';
}

const resultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const displayTexts = {
  en: {
    notFoundTitle: "Proof Not Found",
    notFoundDesc: "The provided NFT ID or wallet address does not match any known digital proofs in our system. Please check the input and try again.",
    statusIssued: "This proof is authentic and currently valid.",
    statusExpired: "This proof was authentic but has expired.",
    statusRevoked: "This proof has been revoked by the issuer and is no longer valid.",
    statusPending: "The status of this proof is pending or unknown.",
    verificationStatus: "Verification Status:",
    description: "Description",
    issuer: "Issuer",
    issuedDate: "Issued Date",
    expiryDate: "Expiry Date",
    type: "Type",
    recipient: "Recipient",
    credential: "Credential",
    property: "Property",
    document: "Document",
    ownerAddress: "Owner Address",
    ipfsDocument: "IPFS Document",
  },
  ar: {
    notFoundTitle: "الإثبات غير موجود",
    notFoundDesc: "معرّف NFT أو عنوان المحفظة المقدم لا يتطابق مع أي إثباتات رقمية معروفة في نظامنا. يرجى التحقق من الإدخال والمحاولة مرة أخرى.",
    statusIssued: "هذا الإثبات أصلي وصالح حاليًا.",
    statusExpired: "كان هذا الإثبات أصليًا ولكنه انتهت صلاحيته.",
    statusRevoked: "تم إلغاء هذا الإثبات من قبل المُصدر ولم يعد صالحًا.",
    statusPending: "حالة هذا الإثبات معلقة أو غير معروفة.",
    verificationStatus: "حالة التحقق:",
    description: "الوصف",
    issuer: "المُصدر",
    issuedDate: "تاريخ الإصدار",
    expiryDate: "تاريخ انتهاء الصلاحية",
    type: "النوع",
    recipient: "المستلم",
    credential: "بيانات الاعتماد",
    property: "الملكية",
    document: "المستند",
    ownerAddress: "عنوان المالك",
    ipfsDocument: "مستند IPFS",
  }
};


const DetailItem = ({ icon: Icon, label, value, isCode = false, isLink = false, lang }: { icon: React.ElementType, label: string, value?: string, isCode?: boolean, isLink?: boolean, lang: 'en' | 'ar' }) => {
  if (!value) return null;
  
  let linkValue = value;
  if (isLink && (value.startsWith('Qm') || value.startsWith('bafy')) && !value.startsWith('http')) {
    linkValue = `https://ipfs.io/ipfs/${value}`;
  }

  return (
    <motion.div
      className="flex items-start space-x-3 rtl:space-x-0 rtl:space-x-reverse py-2 border-b border-border/50 last:border-b-0"
      variants={{ hidden: { opacity: 0, x: lang === 'ar' ? 10 : -10 }, visible: { opacity: 1, x: 0 } }}
    >
      <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
      <div className={lang === 'ar' ? 'mr-3 rtl:ml-0' : 'ml-0 rtl:mr-3'}>
        <p className="font-medium text-sm text-foreground">{label}</p>
        {isLink ? (
          <a href={linkValue} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
            {value} 
          </a>
        ) : isCode ? (
          <code className="text-xs text-muted-foreground bg-muted/50 px-1 py-0.5 rounded break-all" dir="ltr">{value}</code>
        ) : (
          <p className="text-sm text-muted-foreground">{value}</p>
        )}
      </div>
    </motion.div>
  );
};


export function VerificationResultDisplay({ result, lang }: VerificationResultDisplayProps) {
  const currentTexts = displayTexts[lang];

  if (result === 'not_found') {
    return (
      <motion.div variants={resultVariants} initial="hidden" animate="visible" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Alert variant="destructive" className="mt-6">
          <XCircle className={lang === 'ar' ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
          <AlertTitle className="font-semibold">{currentTexts.notFoundTitle}</AlertTitle>
          <AlertDescription>
            {currentTexts.notFoundDesc}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!result) {
    return null;
  }

  const nft = result;

  const getStatusVariant = (status: NftMetadata['status']): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
    switch (status) {
      case 'Issued': return 'default';
      case 'Expired': return 'outline';
      case 'Revoked': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusTextAndIcon = (status: NftMetadata['status']) => {
    const iconClass = lang === 'ar' ? "ml-2 h-6 w-6" : "mr-2 h-6 w-6";
    switch (status) {
      case 'Issued': return { text: currentTexts.statusIssued, icon: <CheckCircle2 className={`${iconClass} text-green-500`} />, alertVariant: "default" as "default" | "destructive", badgeVariant: "default" as "default" | "destructive" | "secondary" | "outline" | null | undefined};
      case 'Expired': return { text: currentTexts.statusExpired, icon: <AlertTriangle className={`${iconClass} text-yellow-500`} />, alertVariant: "default" as "default" | "destructive", badgeVariant: "outline" as "default" | "destructive" | "secondary" | "outline" | null | undefined };
      case 'Revoked': return { text: currentTexts.statusRevoked, icon: <XCircle className={`${iconClass} text-red-500`} />, alertVariant: "destructive" as "default" | "destructive", badgeVariant: "destructive" as "default" | "destructive" | "secondary" | "outline" | null | undefined};
      default: return { text: currentTexts.statusPending, icon: <Info className={`${iconClass} text-gray-500`} />, alertVariant: "default" as "default" | "destructive", badgeVariant: "secondary" as "default" | "destructive" | "secondary" | "outline" | null | undefined};
    }
  };

  const overallStatus = getStatusTextAndIcon(nft.status);

  return (
    <motion.div variants={resultVariants} initial="hidden" animate="visible" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="mt-6 shadow-lg bg-card text-card-foreground border-border overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0]}}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              {overallStatus.icon}
            </motion.div>
            <CardTitle className="text-2xl font-bold font-headline">{nft.name}</CardTitle>
          </div>
          <Alert variant={overallStatus.alertVariant} className="bg-opacity-50">
            <AlertTitle className="font-semibold text-base">{currentTexts.verificationStatus} <Badge variant={overallStatus.badgeVariant} className="ml-2 rtl:mr-2 rtl:ml-0 px-2 py-0.5 text-xs">{nft.status}</Badge></AlertTitle>
            <AlertDescription className="mt-1">{overallStatus.text}</AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <motion.div
              className="w-full md:w-1/3 flex-shrink-0"
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                width={300}
                height={180}
                className="rounded-lg object-cover shadow-md border border-border/20 w-full"
                data-ai-hint={nft.dataAiHint || "document verified"}
              />
            </motion.div>
            <motion.div
              className="w-full md:w-2/3 space-y-1"
              variants={{ visible: { transition: { staggerChildren: 0.07 }}}}
              initial="hidden"
              animate="visible"
            >
              <DetailItem icon={FileText} label={currentTexts.description} value={nft.description} lang={lang} />
              <DetailItem icon={UserCircle} label={currentTexts.issuer} value={nft.issuer} lang={lang} />
              <DetailItem icon={CalendarDays} label={currentTexts.issuedDate} value={new Date(nft.issuedDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')} lang={lang} />
              {nft.expiryDate && <DetailItem icon={CalendarDays} label={currentTexts.expiryDate} value={new Date(nft.expiryDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')} lang={lang} />}
              {nft.credentialType && <DetailItem icon={Tag} label={currentTexts.type} value={nft.credentialType} lang={lang} />}
              {nft.studentName && <DetailItem icon={UserCircle} label={currentTexts.recipient} value={nft.studentName} lang={lang} />}
              {nft.degreeName && <DetailItem icon={Award} label={currentTexts.credential} value={nft.degreeName} lang={lang} />}
              {nft.propertyAddress && <DetailItem icon={MapPin} label={currentTexts.property} value={nft.propertyAddress} lang={lang} />}
              {nft.documentType && <DetailItem icon={FileText} label={currentTexts.document} value={nft.documentType} lang={lang} />}
              {nft.ownerAddress && <DetailItem icon={ShieldCheck} label={currentTexts.ownerAddress} value={nft.ownerAddress} isCode={true} lang={lang} />}
              {nft.documentIpfsHash && <DetailItem icon={LinkIcon} label={currentTexts.ipfsDocument} value={nft.documentIpfsHash} isLink={true} lang={lang} />}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

    