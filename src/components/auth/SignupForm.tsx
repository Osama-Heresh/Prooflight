
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UserRole } from '@/lib/types'; 

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  role: z.enum(["proof_owner", "proof_issuer"], { required_error: "Please select a role" })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

type SignupFormData = z.infer<typeof signupSchema>;

const inputVariants = {
  focus: {
    borderColor: "hsl(var(--primary))",
    boxShadow: "0 0 0 2px hsl(var(--ring))",
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  blur: {
    borderColor: "hsl(var(--input))",
    boxShadow: "0 0 0 0px hsl(var(--ring))",
    scale: 1,
    transition: { duration: 0.2 }
  }
};

const buttonGlowVariants = {
  hover: { 
    boxShadow: "0 0 15px 3px hsl(var(--primary) / 0.7)",
    scale: 1.03,
    transition: { duration: 0.3, type: "spring", stiffness: 300 }
  },
  tap: {
    scale: 0.97
  },
  initial: {
    boxShadow: "0 0 0px 0px hsl(var(--primary) / 0.7)",
    scale: 1,
  }
};

const formTexts = {
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm Password",
    roleLabel: "Sign up as",
    rolePlaceholder: "Select your role",
    roleProofOwner: "Proof Owner",
    roleProofIssuer: "Proof Issuer",
    createAccountButton: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    logInLink: "Log In",
    toastSuccessTitle: "Account Created Successfully!",
    toastSuccessDesc: (role: string) => `Welcome to Prooflight as a ${role.replace('_', ' ')}. Redirecting to dashboard...`,
    errorEmailInvalid: "Invalid email address",
    errorPasswordMin: "Password must be at least 8 characters",
    errorPasswordsNoMatch: "Passwords do not match",
    errorRoleRequired: "Please select a role",
  },
  ar: {
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "تأكيد كلمة المرور",
    roleLabel: "التسجيل كـ",
    rolePlaceholder: "اختر دورك",
    roleProofOwner: "مالك إثبات",
    roleProofIssuer: "مُصدر إثبات",
    createAccountButton: "إنشاء حساب",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    logInLink: "تسجيل الدخول",
    toastSuccessTitle: "تم إنشاء الحساب بنجاح!",
    toastSuccessDesc: (role: string) => `مرحباً بك في تحقيق (Prooflight) كـ ${role === 'proof_owner' ? 'مالك إثبات' : 'مُصدر إثبات'}. جاري التوجيه إلى لوحة التحكم...`,
    errorEmailInvalid: "عنوان بريد إلكتروني غير صالح",
    errorPasswordMin: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    errorPasswordsNoMatch: "كلمتا المرور غير متطابقتين",
    errorRoleRequired: "يرجى اختيار دور",
  }
};

interface SignupFormProps {
  lang: 'en' | 'ar';
}

export function SignupForm({ lang }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const texts = formTexts[lang];

  const currentSignupSchema = z.object({
    email: z.string().email({ message: texts.errorEmailInvalid }),
    password: z.string().min(8, { message: texts.errorPasswordMin }),
    confirmPassword: z.string(),
    role: z.enum(["proof_owner", "proof_issuer"], { required_error: texts.errorRoleRequired })
  }).refine(data => data.password === data.confirmPassword, {
    message: texts.errorPasswordsNoMatch,
    path: ["confirmPassword"], 
  });

  const { register, handleSubmit, control, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(currentSignupSchema),
    defaultValues: {
      role: "proof_owner",
    }
  });

  const handleSignup: SubmitHandler<SignupFormData> = async (data) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      const authData = {
        token: `user_signup_${data.email}_${Date.now()}`,
        role: data.role as UserRole, 
      };
      localStorage.setItem('authToken', JSON.stringify(authData));
      
      toast({ title: texts.toastSuccessTitle, description: texts.toastSuccessDesc(data.role) });
      router.push('/dashboard');
    } catch (error) {
      console.error("Signup error:", error);
      toast({ title: "Signup Failed", description: "An unexpected error occurred during signup.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
        <div>
          <Label htmlFor="email">{texts.emailLabel}</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder={texts.emailPlaceholder}
              className="mt-1"
              autoComplete="email"
            />
          </motion.div>
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">{texts.passwordLabel}</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder={texts.passwordPlaceholder}
              className="mt-1"
              autoComplete="new-password"
            />
          </motion.div>
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
        </div>
         <div>
          <Label htmlFor="confirmPassword">{texts.confirmPasswordLabel}</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder={texts.passwordPlaceholder}
              className="mt-1"
              autoComplete="new-password"
            />
          </motion.div>
          {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <div>
            <Label htmlFor="role">{texts.roleLabel}</Label>
            <Controller
                name="role"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="role" className="w-full mt-1">
                            <SelectValue placeholder={texts.rolePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="proof_owner">{texts.roleProofOwner}</SelectItem>
                            <SelectItem value="proof_issuer">{texts.roleProofIssuer}</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
        </div>
        <motion.div
          variants={buttonGlowVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
            {isLoading && <Loader2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 animate-spin" />}
            {texts.createAccountButton}
          </Button>
        </motion.div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {texts.alreadyHaveAccount}{' '}
        <Link href="/login" className="font-medium text-primary hover:underline hover:text-primary-hover">
          {texts.logInLink}
        </Link>
      </p>
    </div>
  );
}
