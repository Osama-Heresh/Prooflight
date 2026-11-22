
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import type { NftMetadata } from '@/lib/types';
import { mockNfts } from '@/lib/mockData'; 
import {
  Copy, Check, ExternalLink as LinkIcon, Download, QrCode, ShieldCheck, CalendarDays, Info, FileText, UserCircle, Hash, Fingerprint, MapPin, Briefcase
} from 'lucide-react';

const pageTexts = {
  en: {
    loading: "Loading NFT Details...",
    notFoundTitle: "NFT Not Found",
    notFoundDesc: "The NFT you are looking for does not exist or could not be loaded.",
    goToDashboard: "Go to Dashboard",
    category: "Category", 
    issuedBy: "Issued by:",
    downloadDocument: "Download Document",
    viewOnExplorer: "View on Explorer",
    showQrCode: "Show QR Code",
    qrDialogTitle: (name: string) => `Verify "${name}"`,
    copyTooltip: (type: string) => `Copy ${type}`,
    tokenId: "Token ID",
    contractAddress: "Contract Address",
    ownerAddress: "Owner Address",
    issuerName: "Issuer Name",
    dateIssued: "Date Issued",
    expiryDate: "Expiry Date",
    credentialType: "Credential Type",
    recipient: "Recipient",
    credentialDetail: "Credential Detail",
    property: "Property",
    documentType: "Document Type",
    viewOriginalDocument: "View Original Document",
    openPdf: "Open PDF",
    openDocument: "Open Document",
    nftNotFoundToastTitle: "NFT not found",
    nftNotFoundToastDesc: "The requested NFT could not be located.",
    copiedToastTitle: (type: string) => `${type} Copied!`,
    copiedToastDesc: (text: string) => `${text.substring(0, 15)}... copied to clipboard.`,
  },
  ar: {
    loading: "جار تحميل تفاصيل NFT...",
    notFoundTitle: "NFT غير موجود",
    notFoundDesc: "الـ NFT الذي تبحث عنه غير موجود أو لا يمكن تحميله.",
    goToDashboard: "اذهب إلى لوحة التحكم",
    category: "الفئة",
    issuedBy: "صادر عن:",
    downloadDocument: "تنزيل المستند",
    viewOnExplorer: "عرض على المستكشف",
    showQrCode: "عرض رمز الاستجابة السريعة",
    qrDialogTitle: (name: string) => `تحقق من "${name}"`,
    copyTooltip: (type: string) => `نسخ ${type}`,
    tokenId: "معرف الرمز",
    contractAddress: "عنوان العقد",
    ownerAddress: "عنوان المالك",
    issuerName: "اسم المُصدر",
    dateIssued: "تاريخ الإصدار",
    expiryDate: "تاريخ انتهاء الصلاحية",
    credentialType: "نوع بيانات الاعتماد",
    recipient: "المستلم",
    credentialDetail: "تفاصيل بيانات الاعتماد",
    property: "الملكية",
    documentType: "نوع المستند",
    viewOriginalDocument: "عرض المستند الأصلي",
    openPdf: "فتح PDF",
    openDocument: "فتح المستند",
    nftNotFoundToastTitle: "NFT غير موجود",
    nftNotFoundToastDesc: "لا يمكن تحديد موقع NFT المطلوب.",
    copiedToastTitle: (type: string) => `تم نسخ ${type}!`,
    copiedToastDesc: (text: string) => `تم نسخ ${text.substring(0, 15)}... إلى الحافظة.`,
  }
};

const NFTDetailPage = () => {
  const params = useParams();
  const nftId = params?.id as string;
  const { toast } = useToast();

  const [nft, setNft] = useState<NftMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState('');
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');

  const currentTexts = pageTexts[pageLang];

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

    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (nftId) {
      setLoading(true);
      setTimeout(() => {
        const foundNft = mockNfts.find(item => item.id === nftId);
        if (foundNft) {
          setNft({ ...foundNft, publicVerificationLink: `/nft/${foundNft.id}` });
        } else {
          toast({ title: currentTexts.nftNotFoundToastTitle, description: currentTexts.nftNotFoundToastDesc, variant: "destructive" });
        }
        setLoading(false);
      }, 1000);
    }
  }, [nftId, toast, currentTexts.nftNotFoundToastTitle, currentTexts.nftNotFoundToastDesc]);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(type);
      toast({ title: currentTexts.copiedToastTitle(type), description: currentTexts.copiedToastDesc(text) });
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (error) {
      console.error(`Failed to copy ${type} to clipboard:`, error);
      toast({ title: "Copy Failed", description: "Unable to access clipboard.", variant: "destructive" });
    }
  };

  const getMediaUrl = (nftItem: NftMetadata): string | null => {
    if (nftItem.imageUrl && !nftItem.imageUrl.includes('placehold.co')) return nftItem.imageUrl;
    if (nftItem.documentIpfsHash && !nftItem.documentIpfsHash.endsWith('Pdf')) return `https://ipfs.io/ipfs/${nftItem.documentIpfsHash}`;
    if (nftItem.imageUrl) return nftItem.imageUrl;
    return null;
  }

  const getDocumentUrl = (nftItem: NftMetadata): string | null => {
    if (nftItem.documentIpfsHash) return `https://ipfs.io/ipfs/${nftItem.documentIpfsHash}`;
    return null;
  }
  
  const mediaUrl = nft ? getMediaUrl(nft) : null;
  const documentUrl = nft ? getDocumentUrl(nft) : null;
  
  const isVideo = mediaUrl && (mediaUrl.match(/\.(mp4|webm|ogg)$/i) || mediaUrl.startsWith('data:video'));
  const isPdf = documentUrl && (documentUrl.match(/\.(pdf)$/i) || (nft?.documentIpfsHash && nft.documentIpfsHash.endsWith('Pdf'))) ;

  const category = useMemo(() => {
    if (!nft?.credentialType) return "General";
    if (["Diploma", "Certificate"].includes(nft.credentialType)) return "Education";
    if (["Deed", "Rental Agreement"].includes(nft.credentialType)) return "Real Estate";
    if (["ID", "License"].includes(nft.credentialType)) return "Identity";
    return nft.credentialType;
  }, [nft?.credentialType]);

  if (loading) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto py-8 px-4"
          dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <Skeleton className="w-full h-10 rounded-md" />
              <Skeleton className="w-full h-10 rounded-md" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="w-3/4 h-12 rounded-md" />
              <Skeleton className="w-1/2 h-6 rounded-md" />
              <Skeleton className="w-full h-24 rounded-md" />
              <div className="space-y-3 pt-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-8 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AppLayout>
    );
  }

  if (!nft) {
    return (
      <AppLayout>
        <div className="container mx-auto py-16 text-center" dir={pageLang === 'ar' ? 'rtl' : 'ltr'}>
          <Info className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold text-destructive">{currentTexts.notFoundTitle}</h1>
          <p className="text-muted-foreground mt-2">
            {currentTexts.notFoundDesc}
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">{currentTexts.goToDashboard}</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  const explorerUrl = nft.contractAddress && nft.id 
    ? `https://etherscan.io/token/${nft.contractAddress}?a=${nft.id}` 
    : null;

  const MetadataItem = ({ icon: Icon, label, value, onCopy, copyType, isLink, linkHref }: {
    icon: React.ElementType;
    label: string;
    value?: string | null;
    onCopy?: (value: string, type: string) => void;
    copyType?: string;
    isLink?: boolean;
    linkHref?: string | null;
  }) => {
    if (!value) return null;
    const displayLabel = currentTexts[label as keyof typeof currentTexts] || label;
    const displayCopyType = copyType ? (currentTexts[copyType as keyof typeof currentTexts] || copyType) : undefined;

    return (
      <div className="flex items-center justify-between py-3 border-b border-border/70 last:border-b-0">
        <div className="flex items-center">
          <Icon className={pageLang === 'ar' ? "ml-3 h-5 w-5 text-muted-foreground shrink-0" : "mr-3 h-5 w-5 text-muted-foreground shrink-0"} />
          <span className="text-sm font-medium text-foreground">{displayLabel}:</span>
        </div>
        <div className="flex items-center gap-2">
          {isLink && linkHref ? (
             <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
              <a href={linkHref} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-[150px] sm:max-w-xs">
                {value === "Open PDF" ? currentTexts.openPdf : value === "Open Document" ? currentTexts.openDocument : value}
              </a>
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-xs" title={value} dir={label === currentTexts.contractAddress || label === currentTexts.ownerAddress || label === currentTexts.tokenId ? "ltr" : undefined}>
              {value}
            </span>
          )}
          {onCopy && displayCopyType && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCopy(value, displayCopyType)}>
                    {copiedValue === displayCopyType ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{currentTexts.copyTooltip(displayCopyType)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4"
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Card className="overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-muted/30 p-6 flex flex-col items-center space-y-6">
              <motion.div 
                className="w-full aspect-video bg-card rounded-lg shadow-lg overflow-hidden relative border border-border"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {isPdf ? (
                  <iframe src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={`${nft.name} Document`} className="w-full h-full border-0" loading="lazy" />
                ) : isVideo ? (
                  <video src={mediaUrl!} controls className="w-full h-full object-contain" data-ai-hint="nft video content">
                    Your browser does not support the video tag.
                  </video>
                ) : mediaUrl ? (
                  <Image src={mediaUrl} alt={nft.name} layout="fill" objectFit="contain" className="transform hover:scale-105 transition-transform duration-300" data-ai-hint={nft.dataAiHint || "nft media preview"} />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <FileText className="h-24 w-24 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </motion.div>

              <div className="w-full space-y-3">
                {documentUrl && (
                  <Button className="w-full bg-primary hover:bg-primary-hover" asChild>
                    <a href={documentUrl} download={nft.name.replace(/\s+/g, '_') + (isPdf ? '.pdf' : '')} target="_blank" rel="noopener noreferrer">
                      <Download className={pageLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> {currentTexts.downloadDocument}
                    </a>
                  </Button>
                )}
                {explorerUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                      <ShieldCheck className={pageLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> {currentTexts.viewOnExplorer}
                    </a>
                  </Button>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <QrCode className={pageLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> {currentTexts.showQrCode}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xs bg-card" dir={pageLang === 'ar' ? 'rtl' : 'ltr'}>
                    <DialogHeader>
                      <DialogTitle className="text-center">{currentTexts.qrDialogTitle(nft.name)}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      {pageUrl && <QRCodeSVG value={pageUrl} size={200} includeMargin={true} imageSettings={{ src: "/favicon.ico", height:32, width:32, excavate: true }} />}
                    </div>
                    <p className="text-xs text-center text-muted-foreground break-all" dir="ltr">{pageUrl}</p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="md:col-span-3 p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, x: pageLang === 'ar' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Badge variant="secondary" className="mb-2">{category}</Badge> {/* Category name could be translated too if fixed list */}
                <CardTitle className="text-3xl font-bold font-headline mb-1 text-foreground">{nft.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Badge variant={nft.status === 'Issued' ? 'default' : nft.status === 'Expired' ? 'outline' : 'destructive'}>
                    {nft.status} {/* Status could be translated too */}
                  </Badge>
                  <span className="mx-2">•</span>
                  <span>{currentTexts.issuedBy} {nft.issuer}</span>
                </div>
                <CardDescription className="text-base text-foreground/80 leading-relaxed mb-6">
                  {nft.description}
                </CardDescription>

                <div className="space-y-1">
                  <MetadataItem icon={Fingerprint} label="tokenId" value={nft.id} onCopy={handleCopy} copyType="tokenId" />
                  {nft.contractAddress && <MetadataItem icon={Briefcase} label="contractAddress" value={nft.contractAddress} onCopy={handleCopy} copyType="contractAddress" />}
                  {nft.ownerAddress && <MetadataItem icon={UserCircle} label="ownerAddress" value={nft.ownerAddress} onCopy={handleCopy} copyType="ownerAddress" />}
                  <MetadataItem icon={UserCircle} label="issuerName" value={nft.issuer} />
                  <MetadataItem icon={CalendarDays} label="dateIssued" value={new Date(nft.issuedDate).toLocaleDateString(pageLang === 'ar' ? 'ar-EG' : 'en-US')} />
                  {nft.expiryDate && <MetadataItem icon={CalendarDays} label="expiryDate" value={new Date(nft.expiryDate).toLocaleDateString(pageLang === 'ar' ? 'ar-EG' : 'en-US')} />}
                  {nft.credentialType && <MetadataItem icon={Hash} label="credentialType" value={nft.credentialType} />}
                  
                  {nft.studentName && <MetadataItem icon={UserCircle} label="recipient" value={nft.studentName} />}
                  {nft.degreeName && <MetadataItem icon={Briefcase} label="credentialDetail" value={nft.degreeName} />}
                  {nft.propertyAddress && <MetadataItem icon={MapPin} label="property" value={nft.propertyAddress} />}
                  {nft.documentType && <MetadataItem icon={FileText} label="documentType" value={nft.documentType} />}
                  
                   {documentUrl && (
                    <MetadataItem 
                        icon={LinkIcon} 
                        label="viewOriginalDocument" 
                        value={isPdf ? "Open PDF" : "Open Document"} 
                        isLink={true}
                        linkHref={documentUrl} 
                    />
                   )}
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default NFTDetailPage;
