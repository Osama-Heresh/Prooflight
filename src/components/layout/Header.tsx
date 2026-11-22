
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield, LayoutDashboard, ScanSearch, LogIn, UserPlus, Moon, Sun, BarChartHorizontalBig, LogOut, UserCircle, Users, MessageCircle, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types'; 
import * as React from "react"; // Added React import

interface AuthData {
  token: string;
  role: UserRole;
}

const MotionLink = motion(Link);

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(storedTheme || systemTheme);

    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) {
      setCurrentLang(storedLang);
    }

    const tokenString = localStorage.getItem('authToken');
    if (tokenString) {
      try {
        setAuthData(JSON.parse(tokenString));
      } catch (e) {
        console.error("Failed to parse auth token:", e);
        localStorage.removeItem('authToken'); 
      }
    }

    const handleAuthChange = () => {
      const currentTokenString = localStorage.getItem('authToken');
      if (currentTokenString) {
        try {
          setAuthData(JSON.parse(currentTokenString));
        } catch (e) {
          console.error("Failed to parse auth token on authChange:", e);
          localStorage.removeItem('authToken');
          setAuthData(null);
        }
      } else {
        setAuthData(null);
      }
    };
    
    const handleLangChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ newLang: 'en' | 'ar' }>;
      if (customEvent.detail && customEvent.detail.newLang) {
        setCurrentLang(customEvent.detail.newLang);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('langchange', handleLangChange);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'authToken') handleAuthChange();
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setCurrentLang(event.newValue);
      }
      if (event.key === 'theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
        setTheme(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorage);
    };

  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [currentLang, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const toggleLanguage = (lang: 'en' | 'ar') => {
    setCurrentLang(lang); 
    localStorage.setItem('lang', lang); 
    const langChangeEvent = new CustomEvent('langchange', { detail: { newLang: lang } });
    window.dispatchEvent(langChangeEvent); 
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthData(null);
    window.dispatchEvent(new Event('authChange')); 
    toast({ title: "Logged Out", description: "You have been successfully logged out."});
    router.push('/login');
  };
  
  if (!mounted) return <header className="sticky top-0 z-50 w-full h-16 border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60" />;


  const isAuthenticated = !!authData;
  const userRole = authData?.role;

  const baseNavLinksEn = [
    { href: '/verify', label: 'Verify Proof', icon: <ScanSearch className="mr-2 h-4 w-4" />, roles: ['proof_owner', 'proof_issuer', 'site_admin', null] }, 
    { href: '/chat', label: 'Chat', icon: <MessageCircle className="mr-2 h-4 w-4" />, roles: ['proof_owner', 'proof_issuer', 'site_admin', null] },
  ];
  const baseNavLinksAr = [
    { href: '/verify', label: 'تحقق من الإثبات', icon: <ScanSearch className="ml-2 h-4 w-4" />, roles: ['proof_owner', 'proof_issuer', 'site_admin', null] },
    { href: '/chat', label: 'الدردشة', icon: <MessageCircle className="ml-2 h-4 w-4" />, roles: ['proof_owner', 'proof_issuer', 'site_admin', null] },
  ];
  
  const authenticatedNavLinksEn = [
    { href: '/admin/issue-nft', label: 'Issue Proof', icon: <Shield className="mr-2 h-4 w-4" />, roles: ['proof_issuer', 'site_admin'] },
    { href: '/admin/analytics', label: 'Analytics', icon: <BarChartHorizontalBig className="mr-2 h-4 w-4" />, roles: ['site_admin'] },
    { href: '/admin/users', label: 'User Management', icon: <Users className="mr-2 h-4 w-4" />, roles: ['site_admin'] },
    { href: '/admin/production-setup', label: 'Production Setup', icon: <Settings className="mr-2 h-4 w-4" />, roles: ['site_admin'] },
  ];
  const authenticatedNavLinksAr = [
    { href: '/admin/issue-nft', label: 'إصدار إثبات', icon: <Shield className="ml-2 h-4 w-4" />, roles: ['proof_issuer', 'site_admin'] },
    { href: '/admin/analytics', label: 'التحليلات', icon: <BarChartHorizontalBig className="ml-2 h-4 w-4" />, roles: ['site_admin'] },
    { href: '/admin/users', label: 'إدارة المستخدمين', icon: <Users className="ml-2 h-4 w-4" />, roles: ['site_admin'] },
    { href: '/admin/production-setup', label: 'إعدادات الإنتاج', icon: <Settings className="ml-2 h-4 w-4" />, roles: ['site_admin'] },
  ];

  const getVisibleNavLinks = () => {
    const baseLinks = currentLang === 'ar' ? baseNavLinksAr : baseNavLinksEn;
    const authSpecificLinks = currentLang === 'ar' ? authenticatedNavLinksAr : authenticatedNavLinksEn;
    
    let links = [...baseLinks];
    if (isAuthenticated) {
      links.push(...authSpecificLinks);
    }
    
    return links.filter(link => {
      if (!link.roles) return true; 
      if (isAuthenticated && userRole) return link.roles.includes(userRole);
      if (!isAuthenticated) return link.roles.includes(null as any); 
      return false;
    }).sort((a,b) => (a.href === '/chat' || b.href === '/chat') ? (a.href === '/chat' ? 1 : -1) : 0);
  };

  const navLinks = getVisibleNavLinks();

  const loginText = currentLang === 'ar' ? 'تسجيل الدخول' : 'Log In';
  const signUpText = currentLang === 'ar' ? 'إنشاء حساب' : 'Sign Up';
  const dashboardLinkText = currentLang === 'ar' ? 'لوحة التحكم' : 'Dashboard';
  const logoutText = currentLang === 'ar' ? 'تسجيل الخروج' : 'Log Out';
  const siteNameArabic = "تحقيق";

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <MotionLink 
          href="/" 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Logo lang={currentLang} arabicName={siteNameArabic} />
        </MotionLink>

        <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
          {isAuthenticated && (
             <MotionLink
              href="/dashboard"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 flex items-center",
                pathname === "/dashboard" ? "text-primary bg-primary/10" : "text-foreground/70"
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <UserCircle className={currentLang === 'ar' ? "ml-1 h-4 w-4" : "mr-1 h-4 w-4"} /> {dashboardLinkText}
              </span>
            </MotionLink>
          )}
          {navLinks.map((link) => (
            <MotionLink
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10",
                pathname === link.href ? "text-primary bg-primary/10" : "text-foreground/70"
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label}
            </MotionLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" onClick={() => toggleLanguage('en')} className={cn(currentLang === 'en' && 'font-bold text-primary')}>EN</Button>
          <Button variant="ghost" size="sm" onClick={() => toggleLanguage('ar')} className={cn(currentLang === 'ar' && 'font-bold text-primary')}>AR</Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {isAuthenticated ? (
            <>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className={currentLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                {logoutText}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">{loginText}</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <Link href="/signup">{signUpText}</Link> 
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
           <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="mr-2 rtl:ml-2 rtl:mr-0">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={currentLang === 'ar' ? 'left' : 'right'} className="bg-background">
              <div className="flex flex-col space-y-4 p-4">
                <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                  <Logo lang={currentLang} arabicName={siteNameArabic} />
                </Link>
                 <div className="flex justify-center space-x-2 rtl:space-x-reverse my-2">
                    <Button variant="outline" size="sm" onClick={() => { toggleLanguage('en'); }} className={cn(currentLang === 'en' && 'font-bold text-primary')}>English</Button>
                    <Button variant="outline" size="sm" onClick={() => { toggleLanguage('ar'); }} className={cn(currentLang === 'ar' && 'font-bold text-primary')}>العربية</Button>
                 </div>
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      "flex items-center rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-foreground",
                      currentLang === 'ar' ? "flex-row-reverse text-right" : ""
                    )}
                  >
                    <span className="flex items-center w-full">
                      <UserCircle className={currentLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                      <span className={currentLang === 'ar' ? "mr-auto" : "ml-auto"}>{dashboardLinkText}</span>
                    </span>
                  </Link>
                )}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground",
                      currentLang === 'ar' ? "flex-row-reverse text-right" : ""
                    )}
                  >
                    <span className="flex items-center w-full">
                     {React.cloneElement(link.icon as React.ReactElement, { className: currentLang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4" })}
                     <span className={currentLang === 'ar' ? "mr-auto" : "ml-auto"}>{link.label}</span>
                    </span>
                  </Link>
                ))}
                <hr className="my-4 border-border" />
                {isAuthenticated ? (
                  <>
                    <Button onClick={handleLogout} variant="outline" className={cn("w-full justify-start p-3", currentLang === 'ar' && "flex-row-reverse text-right")}>
                      <span className="flex items-center w-full">
                        {currentLang === 'ar' ? <LogOut className="ml-2 h-4 w-4" /> : <LogOut className="mr-2 h-4 w-4" />}
                        <span className={currentLang === 'ar' ? "mr-auto" : "ml-auto"}>{logoutText}</span>
                       </span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className={cn("w-full justify-start p-3", currentLang === 'ar' && "flex-row-reverse text-right")}>
                      <Link href="/login">
                        <span className="flex items-center w-full">
                         {currentLang === 'ar' ? <LogIn className="ml-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
                         <span className={currentLang === 'ar' ? "mr-auto" : "ml-auto"}>{loginText}</span>
                        </span>
                      </Link>
                    </Button>
                    <Button asChild className={cn("w-full justify-start p-3 bg-primary hover:bg-primary-hover text-primary-foreground", currentLang === 'ar' && "flex-row-reverse text-right")}>
                      <Link href="/signup">
                        <span className="flex items-center w-full">
                          {currentLang === 'ar' ? <UserPlus className="ml-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                          <span className={currentLang === 'ar' ? "mr-auto" : "ml-auto"}>{signUpText}</span>
                        </span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
    

