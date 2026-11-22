
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import type { AppUser } from '@/lib/types';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser;
  onConfirmDelete: (userId: string) => void;
  lang: 'en' | 'ar';
}

const dialogTexts = {
  en: {
    title: "Delete User",
    description: (userNameOrEmail: string) => `Are you sure you want to delete the user "${userNameOrEmail}"? This action cannot be undone.`,
    cancel: "Cancel",
    delete: "Delete User",
    deleting: "Deleting...",
  },
  ar: {
    title: "حذف المستخدم",
    description: (userNameOrEmail: string) => `هل أنت متأكد أنك تريد حذف المستخدم "${userNameOrEmail}"؟ لا يمكن التراجع عن هذا الإجراء.`,
    cancel: "إلغاء",
    delete: "حذف المستخدم",
    deleting: "جار الحذف...",
  }
};

export function DeleteUserDialog({ isOpen, onClose, user, onConfirmDelete, lang }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const texts = dialogTexts[lang];
  const userNameOrEmail = user.name || user.email;

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onConfirmDelete(user.id);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{texts.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {texts.description(userNameOrEmail)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>{texts.cancel}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? texts.deleting : texts.delete}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
