
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types'; 

const GoogleIcon = () => (
  <svg className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

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
    signInEmailButton: "Sign In with Email",
    orContinueWith: "Or continue with",
    signInGoogleButton: "Sign In with Google",
    noAccount: "Don't have an account?",
    signUpLink: "Sign Up",
    hint: "Hint: Try",
    adminUser: "admin@example.com",
    issuerUser: "issuer@example.com",
    testUser: "test@example.com",
    withPassword: "with password",
    passwordHint: "password",
    forRoles: "for different roles.",
    loginSuccessTitle: "Login Successful",
    loginSuccessDesc: (role: string) => `Welcome back as ${role.replace('_', ' ')}!`,
    loginFailedTitle: "Login Failed",
    loginFailedDesc: "Invalid email or password.",
    googleLoginSimulatedTitle: "Google Login Simulated",
    googleLoginSimulatedDesc: "Redirecting to dashboard as Proof Owner.",
  },
  ar: {
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    signInEmailButton: "تسجيل الدخول بالبريد الإلكتروني",
    orContinueWith: "أو المتابعة باستخدام",
    signInGoogleButton: "تسجيل الدخول باستخدام جوجل",
    noAccount: "ليس لديك حساب؟",
    signUpLink: "إنشاء حساب",
    hint: "تلميح: جرب",
    adminUser: "admin@example.com",
    issuerUser: "issuer@example.com",
    testUser: "test@example.com",
    withPassword: "مع كلمة المرور",
    passwordHint: "password",
    forRoles: "لأدوار مختلفة.",
    loginSuccessTitle: "تم تسجيل الدخول بنجاح",
    loginSuccessDesc: (role: string) => `مرحباً بعودتك كـ ${role === 'site_admin' ? 'مسؤول موقع' : role === 'proof_issuer' ? 'مُصدر إثباتات' : 'مالك إثبات'}!`,
    loginFailedTitle: "فشل تسجيل الدخول",
    loginFailedDesc: "البريد الإلكتروني أو كلمة المرور غير صالحة.",
    googleLoginSimulatedTitle: "محاكاة تسجيل الدخول بجوجل",
    googleLoginSimulatedDesc: "جاري التوجيه إلى لوحة التحكم كمالك إثبات.",
  }
};

interface LoginFormProps {
  lang: 'en' | 'ar';
}

export function LoginForm({ lang }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const texts = formTexts[lang];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let role: UserRole = 'proof_owner'; 
      let loginSuccess = false;

      if (email === "admin@example.com" && password === "password") {
        role = 'site_admin';
        loginSuccess = true;
      } else if (email === "issuer@example.com" && password === "password") {
        role = 'proof_issuer';
        loginSuccess = true;
      } else if (email === "test@example.com" && password === "password") {
        loginSuccess = true;
      }

      if (loginSuccess) {
        const authData = {
          token: `user_email_${email}_${Date.now()}`,
          role: role,
        };
        localStorage.setItem('authToken', JSON.stringify(authData));
        toast({ title: texts.loginSuccessTitle, description: texts.loginSuccessDesc(role) });
        router.push('/dashboard');
      } else {
        toast({ title: texts.loginFailedTitle, description: texts.loginFailedDesc, variant: "destructive"});
      }
    } catch (error) {
      console.error("Email login error:", error);
      toast({ title: texts.loginFailedTitle, description: texts.loginFailedDesc, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const authData = {
        token: `user_google_${Date.now()}`,
        role: 'proof_owner' as UserRole,
      };
      localStorage.setItem('authToken', JSON.stringify(authData));
      toast({ title: texts.googleLoginSimulatedTitle, description: texts.googleLoginSimulatedDesc });
      router.push('/dashboard');
    } catch (error) {
      console.error("Google login error:", error);
      toast({ title: texts.loginFailedTitle, description: texts.loginFailedDesc, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">{texts.emailLabel}</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={texts.emailPlaceholder}
              required
              className="mt-1"
              autoComplete="email"
            />
          </motion.div>
        </div>
        <div>
          <Label htmlFor="password">{texts.passwordLabel}</Label>
          <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={texts.passwordPlaceholder}
              required
              className="mt-1"
              autoComplete="current-password"
            />
          </motion.div>
        </div>
        <motion.div
          variants={buttonGlowVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
            {isLoading && <Loader2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 animate-spin" />}
            {texts.signInEmailButton}
          </Button>
        </motion.div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {texts.orContinueWith}
          </span>
        </div>
      </div>
      <motion.div
         variants={buttonGlowVariants}
         initial="initial"
         whileHover="hover"
         whileTap="tap"
      >
        <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 animate-spin" /> : <GoogleIcon />}
          {texts.signInGoogleButton}
        </Button>
      </motion.div>
      <p className="text-center text-sm text-muted-foreground">
        {texts.noAccount}{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline hover:text-primary-hover">
          {texts.signUpLink}
        </Link>
      </p>
       <p className="text-xs text-center text-muted-foreground pt-2">
        {texts.hint}: <code className="bg-muted p-1 rounded">{texts.adminUser}</code>, <code className="bg-muted p-1 rounded">{texts.issuerUser}</code>, {lang === 'ar' ? 'أو' : 'or'} <code className="bg-muted p-1 rounded">{texts.testUser}</code> {texts.withPassword} <code className="bg-muted p-1 rounded">{texts.passwordHint}</code> {texts.forRoles}
      </p>
    </div>
  );
}
