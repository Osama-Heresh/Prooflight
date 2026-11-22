
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart3, LineChart, PieChartIcon, CheckSquare, Users, Activity, ListChecks, Eye, Search, Pencil, ShieldAlert } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Line as RechartsLine, LineChart as RechartsLineChart } from 'recharts';
import { mockNfts } from '@/lib/mockData';
import type { NftMetadata } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/components/auth/SignupForm';

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
];

const pageTexts = {
  en: {
    pageTitle: "Admin Analytics Dashboard",
    pageDescription: "Overview of issued credentials and trends.",
    totalIssued: "Total Issued",
    activeCredentials: "Active Credentials",
    credentialTypes: "Credential Types",
    issuedByTypeTitle: "Credentials by Type",
    issuedOverTimeTitle: "Issuance Trends (Last 30 days)",
    statusBreakdownTitle: "Credential Status Breakdown",
    recentIssuancesTitle: "Recent Issuances",
    credentials: "Credentials",
    types: "Types",
    name: "Name",
    type: "Type",
    issuer: "Issuer",
    status: "Status",
    issuedDate: "Issued Date",
    actions: "Actions",
    view: "View",
    edit: "Edit",
    searchPlaceholder: "Search by ID, Name, Recipient...",
    noResults: "No results found.",
    loadingPermissions: "Loading access permissions...",
    accessDeniedTitle: "Access Denied",
    accessDeniedDesc: "You do not have permission to view this page. This area is restricted to Site Admins.",
    activeCredentialsDescDynamic: (status: string) => `Credentials (${status})`,
    typesDesc: "types of credentials",
    statusIssued: "Issued",
    statusExpired: "Expired",
    statusRevoked: "Revoked",
    statusPending: "Pending",
    typeDiploma: "Diploma",
    typeCertificate: "Certificate",
    typeDeed: "Deed",
    typeRentalAgreement: "Rental Agreement",
    typeID: "ID",
    typeLicense: "License",
    typeOther: "Other",
    typeNA: "N/A",
  },
  ar: {
    pageTitle: "لوحة تحكم تحليلات المسؤول",
    pageDescription: "نظرة عامة على بيانات الاعتماد الصادرة واتجاهاتها.",
    totalIssued: "إجمالي المصدرة",
    activeCredentials: "الاعتمادات النشطة",
    credentialTypes: "أنواع الاعتمادات",
    issuedByTypeTitle: "الاعتمادات حسب النوع",
    issuedOverTimeTitle: "الاتجاهات الزمنية للإصدار (آخر 30 يومًا)",
    statusBreakdownTitle: "توزيع حالة الاعتماد",
    recentIssuancesTitle: "الإصدارات الأخيرة",
    credentials: "اعتمادات",
    types: "أنواع",
    name: "الاسم",
    type: "النوع",
    issuer: "المُصدر",
    status: "الحالة",
    issuedDate: "تاريخ الإصدار",
    actions: "إجراءات",
    view: "عرض",
    edit: "تعديل",
    searchPlaceholder: "ابحث عن طريق المعرف، الاسم، المستلم...",
    noResults: "لم يتم العثور على نتائج.",
    loadingPermissions: "جار تحميل أذونات الوصول...",
    accessDeniedTitle: "تم رفض الوصول",
    accessDeniedDesc: "ليس لديك إذن لعرض هذه الصفحة. هذه المنطقة مخصصة لمسؤولي الموقع فقط.",
    activeCredentialsDescDynamic: (status: string) => `اعتمادات (${status})`,
    typesDesc: "أنواع من الاعتمادات",
    statusIssued: "صادر",
    statusExpired: "منتهي الصلاحية",
    statusRevoked: "ملغى",
    statusPending: "قيد الإنتظار",
    typeDiploma: "دبلوم",
    typeCertificate: "شهادة",
    typeDeed: "صك ملكية",
    typeRentalAgreement: "عقد إيجار",
    typeID: "هوية شخصية",
    typeLicense: "رخصة",
    typeOther: "أخرى",
    typeNA: "غير متوفر",
  }
};


export default function AdminAnalyticsPage() {
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

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
    
    const authDataString = localStorage.getItem('authToken');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        setUserRole(authData.role);
      } catch (e) {
         console.error("Failed to parse auth token for role check:", e);
         setUserRole(null);
      }
    }
    setLoadingRole(false);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setPageLang(event.newValue);
      }
      if (event.key === 'authToken') {
        if (event.newValue) {
          try {
            const authData = JSON.parse(event.newValue);
            setUserRole(authData.role);
          } catch (e) {
            console.error("Failed to parse auth token from storage event:", e);
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredNfts = useMemo(() => {
    if (!searchTerm) return mockNfts;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return mockNfts.filter(nft => 
      nft.id.toLowerCase().includes(lowerSearchTerm) ||
      nft.name.toLowerCase().includes(lowerSearchTerm) ||
      (nft.studentName && nft.studentName.toLowerCase().includes(lowerSearchTerm)) ||
      (nft.ownerAddress && nft.ownerAddress.toLowerCase().includes(lowerSearchTerm)) ||
      (nft.issuer && nft.issuer.toLowerCase().includes(lowerSearchTerm)) ||
      (nft.credentialType && nft.credentialType.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm]); 

  const analyticsData = useMemo(() => {
    const totalIssued = mockNfts.length; 
    const activeCredentials = mockNfts.filter(nft => nft.status === 'Issued').length;
    
    const issuedByType: { [key: string]: number } = {};
    mockNfts.forEach(nft => {
      const typeKey = nft.credentialType || 'Other';
      issuedByType[typeKey] = (issuedByType[typeKey] || 0) + 1;
    });
    const issuedByTypeChartData = Object.entries(issuedByType).map(([typeKey, count]) => {
      let name = typeKey;
      if (pageLang === 'ar') {
        if (typeKey === 'Diploma') name = currentTexts.typeDiploma;
        else if (typeKey === 'Certificate') name = currentTexts.typeCertificate;
        else if (typeKey === 'Deed') name = currentTexts.typeDeed;
        else if (typeKey === 'Rental Agreement') name = currentTexts.typeRentalAgreement;
        else if (typeKey === 'ID') name = currentTexts.typeID;
        else if (typeKey === 'License') name = currentTexts.typeLicense;
        else if (typeKey === 'Other') name = currentTexts.typeOther;
      }
      return { name, count };
    });

    const statusBreakdown: { [key: string]: number } = {};
    mockNfts.forEach(nft => {
      statusBreakdown[nft.status] = (statusBreakdown[nft.status] || 0) + 1;
    });
    const statusBreakdownChartData = Object.entries(statusBreakdown).map(([statusKey, value], index) => {
      let name = statusKey;
      if (pageLang === 'ar') {
        if (statusKey === 'Issued') name = currentTexts.statusIssued;
        else if (statusKey === 'Expired') name = currentTexts.statusExpired;
        else if (statusKey === 'Revoked') name = currentTexts.statusRevoked;
        else if (statusKey === 'Pending') name = currentTexts.statusPending;
      }
      return { 
        name, 
        value, 
        fill: CHART_COLORS[index % CHART_COLORS.length] 
      };
    });

    const issuedOverTimeData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString(pageLang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 10) + (i > 20 ? Math.floor(Math.random() * 5) : 0), 
      };
    });

    const recentIssuancesTableData = [...filteredNfts] 
      .sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime())
      .slice(0, 10)
      .map(nft => {
        let translatedStatus = nft.status;
        let translatedCredentialType = nft.credentialType || currentTexts.typeNA;

        if (pageLang === 'ar') {
          if (nft.status === 'Issued') translatedStatus = currentTexts.statusIssued;
          else if (nft.status === 'Expired') translatedStatus = currentTexts.statusExpired;
          else if (nft.status === 'Revoked') translatedStatus = currentTexts.statusRevoked;
          else if (nft.status === 'Pending') translatedStatus = currentTexts.statusPending;

          if (nft.credentialType === 'Diploma') translatedCredentialType = currentTexts.typeDiploma;
          else if (nft.credentialType === 'Certificate') translatedCredentialType = currentTexts.typeCertificate;
          else if (nft.credentialType === 'Deed') translatedCredentialType = currentTexts.typeDeed;
          else if (nft.credentialType === 'Rental Agreement') translatedCredentialType = currentTexts.typeRentalAgreement;
          else if (nft.credentialType === 'ID') translatedCredentialType = currentTexts.typeID;
          else if (nft.credentialType === 'License') translatedCredentialType = currentTexts.typeLicense;
          else if (nft.credentialType === 'Other') translatedCredentialType = currentTexts.typeOther;
          else if (!nft.credentialType) translatedCredentialType = currentTexts.typeNA;
        } else {
            if (!nft.credentialType) translatedCredentialType = currentTexts.typeNA;
        }
        return { ...nft, translatedStatus, translatedCredentialType };
      });

    return {
      totalIssued,
      activeCredentials,
      issuedByTypeChartData,
      statusBreakdownChartData,
      issuedOverTimeData,
      recentIssuances: recentIssuancesTableData,
      uniqueCredentialTypes: Object.keys(issuedByType).length,
    };
  }, [pageLang, filteredNfts, currentTexts]); 

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  const barChartConfig = {
    count: { label: currentTexts.credentials, color: "hsl(var(--chart-1))" },
  };

  const lineChartConfig = {
    count: { label: currentTexts.credentials, color: "hsl(var(--chart-1))" },
  };
  
  const pieChartConfig = analyticsData.statusBreakdownChartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill }; 
    return acc;
  }, {} as any);

  if (loadingRole) {
    return <AppLayout><div className="text-center py-10">{currentTexts.loadingPermissions}</div></AppLayout>;
  }

  if (userRole !== 'site_admin') {
    return (
      <AppLayout>
        <motion.div
          className="max-w-lg mx-auto py-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
        >
          <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">{currentTexts.accessDeniedTitle}</h1>
          <p className="text-muted-foreground">
            {currentTexts.accessDeniedDesc}
          </p>
        </motion.div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        dir={pageLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="pb-6 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2 text-foreground">{currentTexts.pageTitle}</h1>
          <p className="text-muted-foreground">{currentTexts.pageDescription}</p>
        </div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{currentTexts.totalIssued}</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.totalIssued}</div>
                <p className="text-xs text-muted-foreground">{currentTexts.credentials}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{currentTexts.activeCredentials}</CardTitle>
                <CheckSquare className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.activeCredentials}</div>
                <p className="text-xs text-muted-foreground">
                  {currentTexts.activeCredentialsDescDynamic(pageLang === 'ar' ? currentTexts.statusIssued : "Issued")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{currentTexts.credentialTypes}</CardTitle>
                <ListChecks className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.uniqueCredentialTypes}</div>
                <p className="text-xs text-muted-foreground">{currentTexts.typesDesc}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className={pageLang === 'ar' ? "ml-2 h-6 w-6 text-primary" : "mr-2 h-6 w-6 text-primary"} /> {currentTexts.issuedByTypeTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] md:h-[350px]">
                <ChartContainer config={barChartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.issuedByTypeChartData} layout="vertical" margin={{ [pageLang === 'ar' ? 'right' : 'left']: 10, [pageLang === 'ar' ? 'left' : 'right']: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                       <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                       <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        width={pageLang === 'ar' ? 100 : 100} 
                        tick={{ dx: pageLang === 'ar' ? -5 : 0 }}
                        />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className={pageLang === 'ar' ? "ml-2 h-6 w-6 text-primary" : "mr-2 h-6 w-6 text-primary"} /> {currentTexts.issuedOverTimeTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] md:h-[350px]">
                <ChartContainer config={lineChartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analyticsData.issuedOverTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <RechartsLine type="monotone" dataKey="count" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--chart-1))" }} activeDot={{ r: 6 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className={pageLang === 'ar' ? "ml-2 h-6 w-6 text-primary" : "mr-2 h-6 w-6 text-primary"} /> {currentTexts.statusBreakdownTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[350px] flex items-center justify-center">
              <ChartContainer config={pieChartConfig} className="w-full max-w-xs h-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Pie data={analyticsData.statusBreakdownChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false}>
                        {analyticsData.statusBreakdownChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                  </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card text-card-foreground">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <CardTitle className="flex items-center mb-4 sm:mb-0">
                  <Activity className={pageLang === 'ar' ? "ml-2 h-6 w-6 text-primary" : "mr-2 h-6 w-6 text-primary"} /> {currentTexts.recentIssuancesTitle}
                </CardTitle>
                <div className="relative w-full sm:w-auto">
                  <Search className={pageLang === 'ar' ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                  <Input 
                    type="search"
                    placeholder={currentTexts.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={pageLang === 'ar' ? "pr-10 pl-3 w-full sm:w-64" : "pl-10 pr-3 w-full sm:w-64"} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {analyticsData.recentIssuances.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{currentTexts.name}</TableHead>
                      <TableHead className="hidden md:table-cell">{currentTexts.type}</TableHead>
                      <TableHead className="hidden lg:table-cell">{currentTexts.issuer}</TableHead>
                      <TableHead>{currentTexts.status}</TableHead>
                      <TableHead className="hidden md:table-cell text-right rtl:text-left">{currentTexts.issuedDate}</TableHead>
                      <TableHead className="text-right rtl:text-left">{currentTexts.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.recentIssuances.map((nft) => (
                      <TableRow key={nft.id}>
                        <TableCell className="font-medium truncate max-w-xs">{nft.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{nft.translatedCredentialType}</TableCell>
                        <TableCell className="hidden lg:table-cell">{nft.issuer}</TableCell>
                        <TableCell>
                          <Badge variant={
                            nft.status === 'Issued' ? 'default' :
                            nft.status === 'Expired' ? 'outline' :
                            nft.status === 'Revoked' ? 'destructive' : 'secondary'
                          }>
                            {nft.translatedStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right rtl:text-left">
                          {new Date(nft.issuedDate).toLocaleDateString(pageLang === 'ar' ? 'ar-EG' : 'en-US')}
                        </TableCell>
                        <TableCell className="text-right rtl:text-left">
                          <div className="flex justify-end items-center gap-1">
                            <Button variant="ghost" size="sm" asChild title={currentTexts.view}>
                              <Link href={`/nft/${nft.id}`} target="_blank"> 
                                <Eye className="h-4 w-4" /> 
                                <span className="sr-only">{currentTexts.view}</span>
                              </Link>
                            </Button>
                             <Button variant="ghost" size="sm" asChild title={currentTexts.edit}>
                              <Link href={`/admin/edit-proof/${nft.id}`}> 
                                <Pencil className="h-4 w-4" /> 
                                <span className="sr-only">{currentTexts.edit}</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="mx-auto h-10 w-10 mb-2" />
                  <p>{currentTexts.noResults}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </AppLayout>
  );
}
