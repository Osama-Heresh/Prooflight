
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { proofReasoning, type ProofReasoningInput, type ProofReasoningOutput } from '@/ai/flows/proof-reasoning';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';

const aiReasoningSchema = z.object({
  proofType: z.string().min(1, "Proof type is required"),
  proofData: z.string().min(1, "Proof data is required"),
  identityType: z.string().min(1, "Identity type is required"),
  identityData: z.string().min(1, "Identity data is required"),
  additionalContext: z.string().optional(),
});

type AiReasoningFormData = z.infer<typeof aiReasoningSchema>;

const sectionTexts = {
  en: {
    proofTypeLabel: "Proof Type",
    proofTypePlaceholder: "e.g., Diploma, Deed, ID Card",
    proofDataLabel: "Proof Data",
    proofDataPlaceholder: "e.g., NFT ID, Document Hash, Certificate No.",
    identityTypeLabel: "Identity Type",
    identityTypePlaceholder: "e.g., Student, Property Owner, Citizen",
    identityDataLabel: "Identity Data",
    identityDataPlaceholder: "e.g., Name, Address, ID Number",
    additionalContextLabel: "Additional Context (Optional)",
    additionalContextPlaceholder: "Any other relevant information",
    buttonAnalyze: "Get AI Reasoning",
    buttonAnalyzing: "Analyzing...",
    toastSuccessTitle: "AI Reasoning Complete",
    toastSuccessDesc: "AI analysis has finished.",
    toastErrorTitle: "AI Reasoning Failed",
    toastErrorDesc: "An error occurred while processing your request.",
    resultCardTitle: "AI Reasoning Analysis",
    resultValid: "Proof is considered Valid",
    resultInvalid: "Proof is considered Potentially Invalid",
    reasoningLabel: "Reasoning:",
    confidenceLabel: "Confidence Score:",
  },
  ar: {
    proofTypeLabel: "نوع الإثبات",
    proofTypePlaceholder: "مثال: دبلوم، صك، بطاقة هوية",
    proofDataLabel: "بيانات الإثبات",
    proofDataPlaceholder: "مثال: معرّف NFT، تجزئة المستند، رقم الشهادة",
    identityTypeLabel: "نوع الهوية",
    identityTypePlaceholder: "مثال: طالب، مالك عقار، مواطن",
    identityDataLabel: "بيانات الهوية",
    identityDataPlaceholder: "مثال: الاسم، العنوان، رقم الهوية",
    additionalContextLabel: "سياق إضافي (اختياري)",
    additionalContextPlaceholder: "أي معلومات أخرى ذات صلة",
    buttonAnalyze: "الحصول على استدلال الذكاء الاصطناعي",
    buttonAnalyzing: "جار التحليل...",
    toastSuccessTitle: "اكتمل استدلال الذكاء الاصطناعي",
    toastSuccessDesc: "انتهى تحليل الذكاء الاصطناعي.",
    toastErrorTitle: "فشل استدلال الذكاء الاصطناعي",
    toastErrorDesc: "حدث خطأ أثناء معالجة طلبك.",
    resultCardTitle: "تحليل استدلال الذكاء الاصطناعي",
    resultValid: "يعتبر الإثبات صالحًا",
    resultInvalid: "يعتبر الإثبات غير صالح بشكل محتمل",
    reasoningLabel: "الاستدلال:",
    confidenceLabel: "درجة الثقة:",
  }
};

interface AiReasoningSectionProps {
  lang: 'en' | 'ar';
}

export function AiReasoningSection({ lang }: AiReasoningSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<ProofReasoningOutput | null>(null);
  const { toast } = useToast();
  const currentTexts = sectionTexts[lang];

  const { register, handleSubmit, formState: { errors } } = useForm<AiReasoningFormData>({
    resolver: zodResolver(aiReasoningSchema),
  });

  const onSubmit: SubmitHandler<AiReasoningFormData> = async (data) => {
    setIsLoading(true);
    setAiResult(null);
    try {
      const result = await proofReasoning(data);
      setAiResult(result);
      toast({ title: currentTexts.toastSuccessTitle, description: currentTexts.toastSuccessDesc });
    } catch (error) {
      console.error("AI Reasoning Error:", error);
      toast({ title: currentTexts.toastErrorTitle, description: currentTexts.toastErrorDesc, variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="proofType">{currentTexts.proofTypeLabel}</Label>
            <Input id="proofType" {...register("proofType")} placeholder={currentTexts.proofTypePlaceholder} />
            {errors.proofType && <p className="text-sm text-destructive mt-1">{errors.proofType.message}</p>}
          </div>
          <div>
            <Label htmlFor="proofData">{currentTexts.proofDataLabel}</Label>
            <Input id="proofData" {...register("proofData")} placeholder={currentTexts.proofDataPlaceholder} />
            {errors.proofData && <p className="text-sm text-destructive mt-1">{errors.proofData.message}</p>}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="identityType">{currentTexts.identityTypeLabel}</Label>
            <Input id="identityType" {...register("identityType")} placeholder={currentTexts.identityTypePlaceholder} />
            {errors.identityType && <p className="text-sm text-destructive mt-1">{errors.identityType.message}</p>}
          </div>
          <div>
            <Label htmlFor="identityData">{currentTexts.identityDataLabel}</Label>
            <Input id="identityData" {...register("identityData")} placeholder={currentTexts.identityDataPlaceholder} />
            {errors.identityData && <p className="text-sm text-destructive mt-1">{errors.identityData.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="additionalContext">{currentTexts.additionalContextLabel}</Label>
          <Textarea id="additionalContext" {...register("additionalContext")} placeholder={currentTexts.additionalContextPlaceholder} />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full text-base py-3">
          {isLoading ? <><Loader2 className={lang === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} /> {currentTexts.buttonAnalyzing}</> : currentTexts.buttonAnalyze}
        </Button>
      </form>

      {aiResult && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-headline">{currentTexts.resultCardTitle}</CardTitle>
            <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
              {aiResult.isValid ? <CheckCircle className="h-6 w-6 text-green-500" /> : <XCircle className="h-6 w-6 text-red-500" />}
              <p className={`text-lg font-semibold ${aiResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {aiResult.isValid ? currentTexts.resultValid : currentTexts.resultInvalid}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="font-medium">{currentTexts.reasoningLabel}</Label>
              <p className="text-muted-foreground p-3 bg-muted rounded-md">{aiResult.reasoning}</p>
            </div>
            <div>
              <Label className="font-medium">{currentTexts.confidenceLabel} {Math.round(aiResult.confidenceScore * 100)}%</Label>
              <Progress value={aiResult.confidenceScore * 100} className="w-full h-3 mt-1" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    