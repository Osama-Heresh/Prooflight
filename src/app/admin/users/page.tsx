
"use client";

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShieldAlert, Users as UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AppUser, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mockUsers';
import { UserTable } from '@/components/admin/users/UserTable';
import { AddUserDialog } from '@/components/admin/users/AddUserDialog';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { DeleteUserDialog } from '@/components/admin/users/DeleteUserDialog';
import { useToast } from '@/hooks/use-toast';

const pageTexts = {
  en: {
    title: "User Management",
    description: "View, add, edit, and delete users in the system.",
    addNewUser: "Add New User",
    accessDeniedTitle: "Access Denied",
    accessDeniedDesc: "You do not have permission to view this page. User management is restricted to Site Admins.",
    userAddedSuccess: "User Added Successfully!",
    userAddedDesc: (email: string) => `User ${email} has been created.`,
    userUpdatedSuccess: "User Updated Successfully!",
    userUpdatedDesc: (email: string) => `User ${email} has been updated.`,
    userDeletedSuccess: "User Deleted Successfully!",
    userDeletedDesc: (email: string) => `User ${email} has been deleted.`,
    loading: "Loading...",
    registeredUsers: (count: number) => `Registered Users (${count})`,
    userListDesc: "A list of all users in the Prooflight system.",
  },
  ar: {
    title: "إدارة المستخدمين",
    description: "عرض وإضافة وتعديل وحذف المستخدمين في النظام.",
    addNewUser: "إضافة مستخدم جديد",
    accessDeniedTitle: "تم رفض الوصول",
    accessDeniedDesc: "ليس لديك إذن لعرض هذه الصفحة. إدارة المستخدمين مقتصرة على مسؤولي الموقع.",
    userAddedSuccess: "تمت إضافة المستخدم بنجاح!",
    userAddedDesc: (email: string) => `تم إنشاء المستخدم ${email}.`,
    userUpdatedSuccess: "تم تحديث المستخدم بنجاح!",
    userUpdatedDesc: (email: string) => `تم تحديث المستخدم ${email}.`,
    userDeletedSuccess: "تم حذف المستخدم بنجاح!",
    userDeletedDesc: (email: string) => `تم حذف المستخدم ${email}.`,
    loading: "جار التحميل...",
    registeredUsers: (count: number) => `المستخدمون المسجلون (${count})`,
    userListDesc: "قائمة بجميع المستخدمين في نظام تحقيق (Prooflight).",
  }
};

export default function UserManagementPage() {
  const [pageLang, setPageLang] = useState<'en' | 'ar'>('en');
  const [loggedInUserRole, setLoggedInUserRole] = useState<UserRole | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AppUser | null>(null);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const { toast } = useToast();

  const currentTexts = pageTexts[pageLang];

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
    if (storedLang) setPageLang(storedLang);

    const authDataString = localStorage.getItem('authToken');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        setLoggedInUserRole(authData.role);
      } catch (e) {
        console.error("Failed to parse auth token:", e);
        setLoggedInUserRole(null);
      }
    }
    setLoadingRole(false);

    const handleLangChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ newLang: 'en' | 'ar' }>;
      if (customEvent.detail && customEvent.detail.newLang) {
        setPageLang(customEvent.detail.newLang);
      }
    };
    window.addEventListener('langchange', handleLangChange);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lang' && (event.newValue === 'en' || event.newValue === 'ar')) {
        setPageLang(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('langchange', handleLangChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAddUser = (newUser: Omit<AppUser, 'id' | 'createdAt'>) => {
    const createdUser: AppUser = {
      ...newUser,
      id: `user${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [createdUser, ...prev]);
    toast({ title: currentTexts.userAddedSuccess, description: currentTexts.userAddedDesc(createdUser.email) });
  };

  const handleOpenEditDialog = (user: AppUser) => {
    setUserToEdit(user);
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = (updatedUser: AppUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast({ title: currentTexts.userUpdatedSuccess, description: currentTexts.userUpdatedDesc(updatedUser.email) });
  };
  
  const handleOpenDeleteDialog = (user: AppUser) => {
    setUserToDelete(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (user) {
      toast({ title: currentTexts.userDeletedSuccess, description: currentTexts.userDeletedDesc(user.email), variant: "destructive" });
    }
  };

  if (loadingRole) {
    return <AppLayout><div className="text-center py-10">{currentTexts.loading}</div></AppLayout>;
  }

  if (loggedInUserRole !== 'site_admin') {
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
          <p className="text-muted-foreground">{currentTexts.accessDeniedDesc}</p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2 text-foreground">{currentTexts.title}</h1>
            <p className="text-muted-foreground">{currentTexts.description}</p>
          </div>
          <Button onClick={() => setIsAddUserDialogOpen(true)} className="mt-4 md:mt-0 bg-primary hover:bg-primary-hover text-primary-foreground">
            <PlusCircle className={pageLang === 'ar' ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
            {currentTexts.addNewUser}
          </Button>
        </div>

        <Card className="shadow-lg bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className={pageLang === 'ar' ? "ml-3 h-6 w-6 text-primary" : "mr-3 h-6 w-6 text-primary"} />
              {currentTexts.registeredUsers(users.length)}
            </CardTitle>
            <CardDescription>{currentTexts.userListDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable 
              users={users} 
              onEditUser={handleOpenEditDialog} 
              onDeleteUser={handleOpenDeleteDialog}
              lang={pageLang}
            />
          </CardContent>
        </Card>
      </motion.div>

      <AddUserDialog 
        isOpen={isAddUserDialogOpen} 
        onClose={() => setIsAddUserDialogOpen(false)}
        onUserAdded={handleAddUser}
        lang={pageLang}
      />
      {userToEdit && (
        <EditUserDialog
          isOpen={isEditUserDialogOpen}
          onClose={() => { setIsEditUserDialogOpen(false); setUserToEdit(null); }}
          user={userToEdit}
          onUserUpdated={handleUpdateUser}
          lang={pageLang}
        />
      )}
      {userToDelete && (
        <DeleteUserDialog
          isOpen={isDeleteUserDialogOpen}
          onClose={() => { setIsDeleteUserDialogOpen(false); setUserToDelete(null); }}
          user={userToDelete}
          onConfirmDelete={handleDeleteUser}
          lang={pageLang}
        />
      )}
    </AppLayout>
  );
}

    