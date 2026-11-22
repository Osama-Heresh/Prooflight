
"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, CheckSquare, ShieldPlus, Settings, UserCircle, Info, Edit3 } from 'lucide-react'; 
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HowItWorksEnglishPage() {
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en'); // This page is English, but state helps dir

  useEffect(() => {
    // This page is English, so we always set to 'en' for content display consistency,
    // but we listen to global changes for dir attribute consistency with AppLayout.
    const globalLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    setPageLang(globalLang || 'en'); // Set for dir, actual content remains English.

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
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Card className="shadow-xl border-border">
          <CardHeader className="text-center">
            <motion.div
              className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
            >
              <Users className="h-12 w-12 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-foreground">Prooflight User Guide</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Your step-by-step guide to leveraging Prooflight for secure digital credentials.
            </CardDescription>
          </CardHeader>
        </Card>

        <motion.section variants={sectionVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center"><Info className="mr-3 h-6 w-6 text-primary" />Understanding Prooflight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-card-foreground/90">
              <p>Prooflight is revolutionizing how we manage and verify credentials in a digital world. By using blockchain technology (specifically Non-Fungible Tokens - NFTs) and Artificial Intelligence, Prooflight provides a secure, transparent, and user-controlled platform for your digital proofs.</p>
              <p><strong>Key Benefits:</strong></p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li><strong>True Ownership:</strong> You truly own and control your digital credentials as NFTs.</li>
                <li><strong>Immutable Records:</strong> Proofs are recorded on the blockchain, making them tamper-proof.</li>
                <li><strong>Transparent Verification:</strong> Anyone can verify proofs quickly and easily.</li>
                <li><strong>AI-Enhanced Reasoning:</strong> Get an additional layer of confidence with AI-powered contextual analysis for proofs.</li>
              </ul>
               <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This guide will walk you through the features available based on your role within the Prooflight system.
                  </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <Accordion type="single" collapsible className="w-full space-y-6">
          {/* Proof Holder Section */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="proof-holder" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <UserCircle className="mr-3 h-7 w-7 text-primary" /> For Proof Holders: Managing Your Credentials
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p>As a Proof Holder, you have full control over your digital credentials issued to you.</p>
                <motion.ol className="list-decimal list-inside space-y-4 pl-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>Access Your Dashboard:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>After <Link href="/login" className="text-primary hover:underline">logging in</Link>, you'll be directed to your <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link>.</li>
                      <li>This is your personal space to view all your digital proofs (NFTs).</li>
                      <li>You might be prompted to "Connect Wallet" to interact with blockchain features; this is a standard Web3 step (simulated in this demo).</li>
                    </ul>
                    <Image src="https://placehold.co/600x300.png" alt="User Dashboard" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="user dashboard UI" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>View Your Proofs:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Your proofs are displayed as cards, showing key information like name, issuer, and status.</li>
                      <li>Click on a card or its "Verify" link to see more details on its dedicated page (e.g., <code className="bg-muted px-1 rounded-sm">/nft/[id]</code>).</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Share Your Proofs:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Each proof card has a <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2 inline h-4 w-4 text-primary"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg> "Share" button.</li>
                      <li>Clicking this opens a modal with a unique verification link and a QR code.</li>
                      <li>Share this link or QR code with anyone who needs to verify your credential.</li>
                    </ul>
                     <Image src="https://placehold.co/600x300.png" alt="Share Proof Modal" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="share proof modal" />
                  </motion.li>
                </motion.ol>
              </AccordionContent>
            </AccordionItem>
          </motion.div>

          {/* Proof Verifier Section */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="proof-verifier" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <CheckSquare className="mr-3 h-7 w-7 text-green-500" /> For Proof Verifiers: Confirming Authenticity
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p>Anyone can verify a Prooflight-issued credential without needing an account.</p>
                <motion.ol className="list-decimal list-inside space-y-4 pl-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>Navigate to the Verify Page:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Go to the <Link href="/verify" className="text-primary hover:underline">Verify Proof</Link> page.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Enter Proof Identifier:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>In the "Verify Digital Proof" section, enter the unique NFT ID of the proof (e.g., <code className="bg-muted px-1 rounded-sm">NFT001</code>) or the public wallet address of the proof holder.</li>
                      <li>Click "Verify Proof".</li>
                    </ul>
                    <Image src="https://placehold.co/600x300.png" alt="Verification Form" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="verification process UI" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Review Verification Results:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>The system will display the proof's details, including its name, issuer, issuance date, status (Issued, Expired, Revoked), and any linked document information.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Use AI-Assisted Reasoning (Optional):</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>On the same <Link href="/verify" className="text-primary hover:underline">Verify Proof</Link> page, scroll down to the "AI-Assisted Proof Reasoning" section.</li>
                      <li>Enter details about the proof (e.g., "Diploma", "Certificate ID") and the identity being claimed (e.g., "Student", "John Doe").</li>
                      <li>The AI will provide reasoning and a confidence score on whether the proof logically corresponds to the claimed identity.</li>
                    </ul>
                     <Image src="https://placehold.co/600x300.png" alt="AI Reasoning Section" width={600} height={300} className="mt-2 rounded-md shadow-sm" data-ai-hint="AI analysis UI" />
                  </motion.li>
                </motion.ol>
              </AccordionContent>
            </AccordionItem>
          </motion.div>

          {/* Proof Issuer Section */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="proof-issuer" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <ShieldPlus className="mr-3 h-7 w-7 text-accent" /> For Proof Issuers: Creating Digital Proofs
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p>Proof Issuers (and Site Admins) can create and distribute new digital proofs.</p>
                 <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-700 dark:text-yellow-300">
                  <Info className="inline h-4 w-4 mr-1" /> You must be logged in with an "Issuer" or "Admin" role. You can select "Proof Issuer" during <Link href="/signup" className="text-primary hover:underline">Sign Up</Link> or use the test account: <code className="bg-muted px-1 rounded-sm">issuer@example.com</code> / <code className="bg-muted px-1 rounded-sm">password</code>.
                </div>
                <motion.ol className="list-decimal list-inside space-y-4 pl-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>Navigate to Issue Proof Page:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Once logged in with appropriate permissions, you'll see an "Issue Proof" link in the header. Click it to go to the <Link href="/admin/issue-nft" className="text-primary hover:underline">Issue New Digital Proof</Link> page.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Complete the Issuance Form:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Fill in all required fields: Proof Name, Description, Credential Type, Recipient Identifier (e.g., wallet address, email, or user ID), Issuer Name (often pre-filled), Issued Date.</li>
                      <li>Optionally, set an Expiry Date.</li>
                      <li>Optionally, upload a document. This will simulate uploading to IPFS and populate the "Document IPFS Hash" field. You can also manually enter an IPFS hash.</li>
                    </ul>
                     <Image src="https://placehold.co/600x400.png" alt="Issue Proof Form" width={600} height={400} className="mt-2 rounded-md shadow-sm" data-ai-hint="proof issuance form" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Issue the Proof:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Double-check all details. Click "Issue Proof (Simulated)".</li>
                      <li>A success message will confirm the (simulated) issuance. In a real blockchain application, this step would involve a transaction.</li>
                    </ul>
                  </motion.li>
                </motion.ol>
              </AccordionContent>
            </AccordionItem>
          </motion.div>

          {/* Site Administrator Section */}
          <motion.div variants={sectionVariants}>
            <AccordionItem value="site-admin" className="bg-card border border-border rounded-lg shadow-md">
              <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline focus:no-underline">
                <div className="flex items-center">
                  <Settings className="mr-3 h-7 w-7 text-destructive" /> For Site Administrators: Platform Oversight
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-6">
                <p>Site Administrators have the highest level of access, including all Issuer capabilities and additional platform management tools.</p>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-700 dark:text-yellow-300">
                  <Info className="inline h-4 w-4 mr-1" /> To access Admin features, log in with the test account: <code className="bg-muted px-1 rounded-sm">admin@example.com</code> / <code className="bg-muted px-1 rounded-sm">password</code>.
                </div>
                <motion.ol className="list-decimal list-inside space-y-4 pl-4" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                  <motion.li variants={itemVariants}>
                    <strong>All Issuer Functions:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Site Admins can perform all actions available to Proof Issuers, such as issuing new proofs via the <Link href="/admin/issue-nft" className="text-primary hover:underline">Issue New Digital Proof</Link> page.</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Access Analytics:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>Navigate to the <Link href="/admin/analytics" className="text-primary hover:underline">Admin Analytics Dashboard</Link> via the header link.</li>
                      <li>View statistics on total issued credentials, active credentials, types of credentials, issuance trends, and status breakdowns.</li>
                      <li>The "Recent Issuances" table allows for searching and quick access to view or edit proofs.</li>
                    </ul>
                     <Image src="https://placehold.co/600x350.png" alt="Analytics Dashboard" width={600} height={350} className="mt-2 rounded-md shadow-sm" data-ai-hint="admin dashboard UI" />
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <strong>Edit Existing Proofs:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>From the Analytics page, in the "Recent Issuances" table, click the <Edit3 className="inline h-4 w-4" /> (Edit) icon next to a proof.</li>
                      <li>This will take you to the <code className="bg-muted px-1 rounded-sm">/admin/edit-proof/[id]</code> page.</li>
                      <li>Modify details such as name, description, status, recipient, document IPFS hash (by uploading a new file or clearing the existing one), and dates.</li>
                      <li>Click "Update Proof (Simulated)" to save changes (simulated).</li>
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
