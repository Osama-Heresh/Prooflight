
"use client";

import type { NftMetadata } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Share2, ExternalLink, CheckCircle2, XCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
import { ShareNftModal } from './ShareNftModal';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NftCardProps {
  nft: NftMetadata & { dataAiHint?: string };
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }
};

const cardTexts = {
  en: {
    issuedBy: "Issued by:",
    issuedOn: "Issued on:",
    expiresOn: "Expires on:",
    share: "Share",
    verify: "Verify",
    ipfs: "IPFS:",
  },
  ar: {
    issuedBy: "صادر عن:",
    issuedOn: "صادر في:",
    expiresOn: "ينتهي في:",
    share: "مشاركة",
    verify: "تحقق",
    ipfs: "IPFS:",
  }
};

export function NftCard({ nft }: NftCardProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) {
      setPageLang(storedLang);
    }
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setPageLang(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const currentTexts = cardTexts[pageLang];

  const getStatusVariant = (status: NftMetadata['status']) => {
    switch (status) {
      case 'Issued': return 'default';
      case 'Expired': return 'outline';
      case 'Revoked': return 'destructive';
      case 'Pending': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: NftMetadata['status']) => {
    const commonClass = pageLang === 'ar' ? "ml-1 h-3 w-3" : "mr-1 h-3 w-3";
    switch (status) {
      case 'Issued': return <CheckCircle2 className={`${commonClass} text-green-500`} />;
      case 'Expired': return <AlertTriangle className={`${commonClass} text-yellow-500`} />;
      case 'Revoked': return <XCircle className={`${commonClass} text-red-500`} />;
      case 'Pending': return <Clock className={`${commonClass} text-gray-500`} />;
      default: return null;
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="h-full"
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-card text-card-foreground border-border">
          <CardHeader className="p-4">
            <motion.div 
              className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden"
              layoutId={`nft-image-${nft.id}`}
            >
              <Image 
                src={nft.imageUrl} 
                alt={nft.name} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={nft.dataAiHint || "abstract item"}
                className="rounded-md"
              />
            </motion.div>
            <CardTitle className="font-headline text-xl leading-tight">{nft.name}</CardTitle>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {getStatusIcon(nft.status)}
              <Badge variant={getStatusVariant(nft.status)}>{nft.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4 pt-0">
            <CardDescription className="text-sm mb-1 text-card-foreground/80">
              {currentTexts.issuedBy} {nft.issuer}
            </CardDescription>
            <CardDescription className="text-sm mb-1 text-card-foreground/80">
              {currentTexts.issuedOn} {new Date(nft.issuedDate).toLocaleDateString(pageLang === 'ar' ? 'ar-EG' : 'en-US')}
            </CardDescription>
            {nft.expiryDate && (
              <CardDescription className="text-sm text-card-foreground/80">
                {currentTexts.expiresOn} {new Date(nft.expiryDate).toLocaleDateString(pageLang === 'ar' ? 'ar-EG' : 'en-US')}
              </CardDescription>
            )}
            <CardDescription className="text-sm mt-2 line-clamp-2 text-card-foreground/80">
              {nft.description}
            </CardDescription>
            {nft.documentIpfsHash && (
              <CardDescription className="text-xs mt-2 text-muted-foreground truncate">
                <FileText className={pageLang === 'ar' ? "inline-block h-3 w-3 ml-1 align-middle" : "inline-block h-3 w-3 mr-1 align-middle"} />
                {currentTexts.ipfs} <a href={`https://ipfs.io/ipfs/${nft.documentIpfsHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{`${nft.documentIpfsHash.substring(0, 6)}...${nft.documentIpfsHash.substring(nft.documentIpfsHash.length - 6)}`}</a>
              </CardDescription>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4 border-t border-border/50">
            <Button variant="ghost" size="sm" onClick={() => setIsShareModalOpen(true)} className="text-primary hover:text-primary-hover hover:bg-primary/10">
              <Share2 className={pageLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              {currentTexts.share}
            </Button>
            <Button variant="outline" size="sm" asChild className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:text-primary-hover">
              <a href={nft.publicVerificationLink} target="_blank" rel="noopener noreferrer">
                {currentTexts.verify} <ExternalLink className={pageLang === 'ar' ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <ShareNftModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        nftName={nft.name}
        verificationLink={nft.publicVerificationLink} 
      />
    </>
  );
}

