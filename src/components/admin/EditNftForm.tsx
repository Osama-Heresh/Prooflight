
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CredentialType, NftMetadata } from '@/lib/types';
import { Loader2, CheckCircle, File as FileIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const formTexts = (lang: 'en' | 'ar') => ({
  nameLabel: lang === 'ar' ? "اسم / عنوان الإثبات" : "Proof Name / Title",
  descriptionLabel: lang === 'ar' ? "الوصف" : "Description",
  credentialTypeLabel: lang === 'ar' ? "نوع بيانات الاعتماد" : "Credential Type",
  statusLabel: lang === 'ar' ? "الحالة" : "Status",
  recipientIdentifierLabel: lang === 'ar' ? "معرف المستلم" : "Recipient Identifier",
  recipientIdentifierPlaceholder: lang === 'ar' ? "عنوان المحفظة، البريد الإلكتروني، أو معرف المستخدم" : "Wallet Address, Email, or User ID",
  changeDocumentLabel: lang === 'ar' ? "تغيير المستند (اختياري، يحاكي تحميل IPFS)" : "Change Document (Optional, Simulates IPFS Upload)",
  currentDocumentLabel: (hash: string) => lang === 'ar' ? `الحالي: ${hash.substring(0,10)}...` : `Current: ${hash.substring(0,10)}...`,
  noDocument: lang === 'ar' ? "لا يوجد مستند" : "No document",
  clearFile: lang === 'ar' ? "مسح الملف المحدد" : "Clear selected file",
  ipfsHashLabel: lang === 'ar' ? "تجزئة IPFS للمستند" : "Document IPFS Hash",
  ipfsHashPlaceholder: lang === 'ar' ? "يُملأ تلقائيًا بالتحميل أو أدخل Qm... / bafy..." : "Auto-filled by upload or enter Qm... / bafy...",
  issuerNameLabel: lang === 'ar' ? "اسم المُصدر" : "Issuer Name",
  issuedDateLabel: lang === 'ar' ? "تاريخ الإصدار" : "Issued Date",
  expiryDateLabel: lang === 'ar' ? "تاريخ انتهاء الصلاحية (اختياري)" : "Expiry Date (Optional)",
  progressUpdating: lang === 'ar' ? "جار التحديث..." : "Updating...",
  buttonUpdate: lang === 'ar' ? "تحديث الإثبات (محاكاة)" : "Update Proof (Simulated)",
  buttonUpdating: lang === 'ar' ? "جاري تحديث الإثبات..." : "Updating Proof...",
  buttonProcessingFile: lang === 'ar' ? "جاري معالجة الملف..." : "Processing File...",
  toastSuccessTitle: lang === 'ar' ? "تم تحديث الإثبات بنجاح!" : "Proof Updated Successfully!",
  toastSuccessDesc: (name: string) => lang === 'ar' ? `تم تحديث '${name}'. (محاكاة)` : `'${name}' has been updated. (Simulation)`,
  toastFileProcessingTitle: lang === 'ar' ? "جاري معالجة الملف..." : "Processing file...",
  toastFileProcessingDesc: (fileName: string) => lang === 'ar' ? `محاكاة تحميل IPFS لـ ${fileName}. هذا عرض توضيحي.` : `Simulating IPFS upload for ${fileName}. This is a demo.`,
  toastFileProcessedTitle: lang === 'ar' ? "تمت معالجة الملف (محاكاة)" : "File Processed (Simulated)",
  toastFileProcessedDesc: (hash: string) => lang === 'ar' ? `تم تحديث تجزئة IPFS الوهمية: ${hash}.` : `Mock IPFS hash updated: ${hash}.`,
  toastFileCleared: lang === 'ar' ? "تم مسح اختيار الملف." : "File selection cleared.",
  successCardTitle: lang === 'ar' ? "تم تحديث الإثبات!" : "Proof Updated!",
  successCardDesc: lang === 'ar' ? "تم تحديث الإثبات الرقمي بنجاح (محاكاة)." : "The digital proof has been successfully updated (Simulated).",
});


const editNftSchema = z.object({
  name: z.string().min(3, "Proof name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  credentialType: z.enum(["Diploma", "Certificate", "Deed", "Rental Agreement", "ID", "License", "Other"], { required_error: "Credential type is required"}),
  recipientIdentifier: z.string().min(5, "Recipient identifier (e.g., wallet address, email) is required"), 
  issuerName: z.string().min(1, "Issuer name is required"),
  issuedDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Valid issued date is required" }),
  expiryDate: z.string().optional().refine((date) => date ? !isNaN(Date.parse(date)) : true, { message: "Invalid date format" }),
  documentIpfsHash: z.string().optional().refine(
    (val) => !val || val.startsWith('Qm') || val.startsWith('bafy'), 
    { message: "Invalid IPFS hash format (must start with Qm or bafy)" }
  ),
  status: z.enum(["Issued", "Expired", "Revoked", "Pending"]), 
});

type EditNftFormData = z.infer<typeof editNftSchema>;

const credentialTypes: CredentialType[] = ["Diploma", "Certificate", "Deed", "Rental Agreement", "ID", "License", "Other"];
const statusTypes: NftMetadata['status'][] = ["Issued", "Expired", "Revoked", "Pending"];

const inputVariants = {
  focus: { borderColor: "hsl(var(--primary))", boxShadow: "0 0 0 1px hsl(var(--ring))", scale: 1.01 },
  blur: { borderColor: "hsl(var(--input))", boxShadow: "0 0 0 0px hsl(var(--ring))", scale: 1 }
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

interface EditNftFormProps {
  nftData: NftMetadata;
  onUpdateSuccess: (updatedData: NftMetadata) => void; 
  lang: 'en' | 'ar';
}

export function EditNftForm({ nftData, onUpdateSuccess, lang }: EditNftFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const { toast } = useToast();
  const texts = formTexts(lang);

  const { register, handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm<EditNftFormData>({
    resolver: zodResolver(editNftSchema),
  });

  const documentIpfsHashValue = watch("documentIpfsHash");

  useEffect(() => {
    if (nftData) {
      reset({
        name: nftData.name,
        description: nftData.description,
        credentialType: nftData.credentialType || "Other",
        recipientIdentifier: nftData.studentName || nftData.ownerAddress || "", 
        issuerName: nftData.issuer,
        issuedDate: new Date(nftData.issuedDate).toISOString().split('T')[0],
        expiryDate: nftData.expiryDate ? new Date(nftData.expiryDate).toISOString().split('T')[0] : undefined,
        documentIpfsHash: nftData.documentIpfsHash || "",
        status: nftData.status,
      });
    }
  }, [nftData, reset]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsSimulatingUpload(true);
      setValue("documentIpfsHash", ""); 
      toast({ title: texts.toastFileProcessingTitle, description: texts.toastFileProcessingDesc(file.name) });

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const mockIpfsHash = `QmUpdated${Date.now().toString().slice(-8)}${fileExtension === 'pdf' ? 'Pdf' : file.name.replace(/[^a-zA-Z0-9]/g, '').slice(0,8)}`;
        setValue("documentIpfsHash", mockIpfsHash, { shouldValidate: true });
        toast({ title: texts.toastFileProcessedTitle, description: texts.toastFileProcessedDesc(mockIpfsHash) });
      } catch (error) {
        console.error("Failed to process file upload:", error);
        toast({ title: "File Processing Error", description: "Failed to process the selected file.", variant: "destructive" });
      } finally {
        setIsSimulatingUpload(false);
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setValue("documentIpfsHash", nftData.documentIpfsHash || ""); 
    const fileInput = document.getElementById('documentFileEdit') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ""; 
    }
    toast({ title: texts.toastFileCleared});
  };

  const onSubmit: SubmitHandler<EditNftFormData> = async (data) => {
    setIsLoading(true);
    setIsSuccess(false);
    setProgress(0);

    try {
      await new Promise(resolve => setTimeout(() => { setProgress(33); resolve(null); }, 500));
      console.log("Updating NFT - Step 1: Validating Data", data);
      await new Promise(resolve => setTimeout(() => { setProgress(66); resolve(null); }, 800));
      console.log("Updating NFT - Step 2: Saving to Database (Simulated)");
      await new Promise(resolve => setTimeout(() => { setProgress(100); resolve(null); }, 1000));
      
      const updatedNftData: NftMetadata = {
        ...nftData, 
        name: data.name,
        description: data.description,
        credentialType: data.credentialType,
        studentName: data.credentialType === "Diploma" || data.credentialType === "Certificate" ? data.recipientIdentifier : nftData.studentName,
        ownerAddress: data.credentialType !== "Diploma" && data.credentialType !== "Certificate" ? data.recipientIdentifier : nftData.ownerAddress,
        issuer: data.issuerName,
        issuedDate: data.issuedDate,
        expiryDate: data.expiryDate || undefined,
        documentIpfsHash: data.documentIpfsHash || undefined,
        status: data.status,
      };

      toast({ title: texts.toastSuccessTitle, description: texts.toastSuccessDesc(data.name) });
      setIsSuccess(true);
      onUpdateSuccess(updatedNftData); 
      
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error("Error updating NFT proof:", error);
      toast({ title: "Update Failed", description: "An unexpected error occurred while updating the proof.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-center"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">{texts.successCardTitle}</h3>
            <p className="text-green-600 dark:text-green-400">{texts.successCardDesc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSuccess && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div layout>
            <Label htmlFor="name">{texts.nameLabel}</Label>
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input id="name" {...register("name")} className="bg-card" />
            </motion.div>
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </motion.div>

          <motion.div layout>
            <Label htmlFor="description">{texts.descriptionLabel}</Label>
             <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Textarea id="description" {...register("description")} className="bg-card" />
            </motion.div>
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div layout>
              <Label htmlFor="credentialType">{texts.credentialTypeLabel}</Label>
              <Controller
                  name="credentialType"
                  control={control}
                  render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="credentialType" className="bg-card">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              {credentialTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  )}
              />
              {errors.credentialType && <p className="text-sm text-destructive mt-1">{errors.credentialType.message}</p>}
            </motion.div>

            <motion.div layout>
              <Label htmlFor="status">{texts.statusLabel}</Label>
              <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="status" className="bg-card">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              {statusTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  )}
              />
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </motion.div>
          </div>


          <motion.div layout>
            <Label htmlFor="recipientIdentifier">{texts.recipientIdentifierLabel}</Label>
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input id="recipientIdentifier" {...register("recipientIdentifier")} placeholder={texts.recipientIdentifierPlaceholder} className="bg-card"/>
            </motion.div>
            {errors.recipientIdentifier && <p className="text-sm text-destructive mt-1">{errors.recipientIdentifier.message}</p>}
          </motion.div>

          <motion.div layout>
            <Label htmlFor="documentFileEdit">{texts.changeDocumentLabel}</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Input 
                    id="documentFileEdit" 
                    type="file" 
                    onChange={handleFileChange} 
                    className="bg-card flex-grow"
                    disabled={isSimulatingUpload}
                />
                {isSimulatingUpload && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            </div>
            {(selectedFile || documentIpfsHashValue) && !isSimulatingUpload && (
                 <div className="mt-2 flex items-center justify-between p-2 bg-muted/50 rounded-md border border-border">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate max-w-xs">
                            {selectedFile ? selectedFile.name : (documentIpfsHashValue ? texts.currentDocumentLabel(documentIpfsHashValue) : texts.noDocument)}
                        </span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={clearSelectedFile} aria-label={texts.clearFile} className="text-destructive hover:bg-destructive/10">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
          </motion.div>

          <motion.div layout>
            <Label htmlFor="documentIpfsHash">{texts.ipfsHashLabel}</Label>
              <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
                <Input 
                    id="documentIpfsHash" 
                    {...register("documentIpfsHash")} 
                    placeholder={texts.ipfsHashPlaceholder} 
                    className="bg-card"
                    disabled={isSimulatingUpload || selectedFile !== null}
                    readOnly={selectedFile !== null}
                />
            </motion.div>
            {errors.documentIpfsHash && <p className="text-sm text-destructive mt-1">{errors.documentIpfsHash.message}</p>}
          </motion.div>


          <div className="grid md:grid-cols-2 gap-4">
            <motion.div layout>
              <Label htmlFor="issuerName">{texts.issuerNameLabel}</Label>
              <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
                <Input id="issuerName" {...register("issuerName")} className="bg-card"/>
              </motion.div>
              {errors.issuerName && <p className="text-sm text-destructive mt-1">{errors.issuerName.message}</p>}
            </motion.div>
             <motion.div layout> 
              <Label htmlFor="issuedDate">{texts.issuedDateLabel}</Label>
              <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
                <Input id="issuedDate" type="date" {...register("issuedDate")} className="bg-card"/>
              </motion.div>
              {errors.issuedDate && <p className="text-sm text-destructive mt-1">{errors.issuedDate.message}</p>}
            </motion.div>
          </div>

          <motion.div layout>
            <Label htmlFor="expiryDate">{texts.expiryDateLabel}</Label>
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input id="expiryDate" type="date" {...register("expiryDate")} className="bg-card"/>
            </motion.div>
            {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate.message}</p>}
          </motion.div>
          
          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full h-2" />
              <p className="text-sm text-muted-foreground text-center">{texts.progressUpdating} {progress}%</p>
            </div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" disabled={isLoading || isSimulatingUpload} className="w-full text-base py-3 bg-primary hover:bg-primary-hover text-primary-foreground">
              {isLoading ? <><Loader2 className={lang === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} /> {texts.buttonUpdating}</> : 
               isSimulatingUpload ? <><Loader2 className={lang === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} /> {texts.buttonProcessingFile}</> : texts.buttonUpdate}
            </Button>
          </motion.div>
        </form>
      )}
    </div>
  );
}

    