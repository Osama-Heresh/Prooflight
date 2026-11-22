
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { AppUser, UserRole, UserStatus } from '@/lib/types';

const userRoles: UserRole[] = ["proof_owner", "proof_issuer", "site_admin"];
const userStatuses: UserStatus[] = ["active", "suspended", "pending_verification"];

const editUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  role: z.enum(userRoles, { required_error: "Role is required" }),
  status: z.enum(userStatuses, { required_error: "Status is required" }),
  // Password change could be handled separately if needed
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser;
  onUserUpdated: (user: AppUser) => void;
  lang: 'en' | 'ar';
}

const dialogTexts = {
  en: {
    title: "Edit User",
    description: "Modify the user details below. Click save when you're done.",
    nameLabel: "Full Name (Optional)",
    emailLabel: "Email Address",
    roleLabel: "Role",
    statusLabel: "Status",
    cancel: "Cancel",
    save: "Save Changes",
    saving: "Saving...",
  },
  ar: {
    title: "تعديل المستخدم",
    description: "قم بتعديل تفاصيل المستخدم أدناه. انقر فوق حفظ عند الانتهاء.",
    nameLabel: "الاسم الكامل (اختياري)",
    emailLabel: "البريد الإلكتروني",
    roleLabel: "الدور",
    statusLabel: "الحالة",
    cancel: "إلغاء",
    save: "حفظ التغييرات",
    saving: "جار الحفظ...",
  }
};

export function EditUserDialog({ isOpen, onClose, user, onUserUpdated, lang }: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const texts = dialogTexts[lang];

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset, isOpen]); // Reset form when user or isOpen changes

  const onSubmit: SubmitHandler<EditUserFormData> = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      onUserUpdated({ ...user, ...data });
      setIsLoading(false);
      onClose();
    }, 1000);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form state when dialog is closed, ensures fresh data if reopened for same user after a failed attempt or for a new user
      reset({ 
        name: user.name || '', 
        email: user.email, 
        role: user.role, 
        status: user.status 
      });
      onClose();
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{texts.title} - {user.name || user.email}</DialogTitle>
          <DialogDescription>{texts.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="edit-name">{texts.nameLabel}</Label>
            <Input id="edit-name" {...register("name")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="edit-email">{texts.emailLabel}</Label>
            <Input id="edit-email" type="email" {...register("email")} className="mt-1" />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-role">{texts.roleLabel}</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-role" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map(role => (
                        <SelectItem key={role} value={role}>{role.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
            </div>
            <div>
              <Label htmlFor="edit-status">{texts.statusLabel}</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </div>
          </div>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">{texts.cancel}</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-hover text-primary-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? texts.saving : texts.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
