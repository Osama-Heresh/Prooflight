
"use client";

import { useState } from 'react';
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

const addUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(userRoles, { required_error: "Role is required" }),
  status: z.enum(userStatuses, { required_error: "Status is required" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: Omit<AppUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  lang: 'en' | 'ar';
}

const dialogTexts = {
  en: {
    title: "Add New User",
    description: "Fill in the details below to create a new user account. Click save when you're done.",
    nameLabel: "Full Name (Optional)",
    namePlaceholder: "e.g., John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "user@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm Password",
    roleLabel: "Role",
    rolePlaceholder: "Select a role",
    statusLabel: "Status",
    statusPlaceholder: "Select a status",
    cancel: "Cancel",
    save: "Save User",
    saving: "Saving...",
    passwordsDoNotMatch: "Passwords do not match",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    roleRequired: "Role is required",
    statusRequired: "Status is required",
  },
  ar: {
    title: "إضافة مستخدم جديد",
    description: "املأ التفاصيل أدناه لإنشاء حساب مستخدم جديد. انقر فوق حفظ عند الانتهاء.",
    nameLabel: "الاسم الكامل (اختياري)",
    namePlaceholder: "مثال: جون دو",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "user@example.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "تأكيد كلمة المرور",
    roleLabel: "الدور",
    rolePlaceholder: "اختر دورًا",
    statusLabel: "الحالة",
    statusPlaceholder: "اختر حالة",
    cancel: "إلغاء",
    save: "حفظ المستخدم",
    saving: "جار الحفظ...",
    passwordsDoNotMatch: "كلمتا المرور غير متطابقتين",
    emailRequired: "البريد الإلكتروني مطلوب",
    passwordRequired: "كلمة المرور مطلوبة",
    roleRequired: "الدور مطلوب",
    statusRequired: "الحالة مطلوبة",
  }
};


export function AddUserDialog({ isOpen, onClose, onUserAdded, lang }: AddUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const texts = dialogTexts[lang];

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      role: 'proof_owner',
      status: 'pending_verification',
    },
  });

  const onSubmit: SubmitHandler<AddUserFormData> = (data) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const { confirmPassword, ...userData } = data; // Exclude confirmPassword
      onUserAdded(userData);
      setIsLoading(false);
      reset();
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-[480px]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{texts.title}</DialogTitle>
          <DialogDescription>{texts.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">{texts.nameLabel}</Label>
            <Input id="name" {...register("name")} placeholder={texts.namePlaceholder} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">{texts.emailLabel}</Label>
            <Input id="email" type="email" {...register("email")} placeholder={texts.emailPlaceholder} className="mt-1" />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">{texts.passwordLabel}</Label>
              <Input id="password" type="password" {...register("password")} placeholder={texts.passwordPlaceholder} className="mt-1" />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">{texts.confirmPasswordLabel}</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder={texts.passwordPlaceholder} className="mt-1" />
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">{texts.roleLabel}</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="role" className="mt-1">
                      <SelectValue placeholder={texts.rolePlaceholder} />
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
              <Label htmlFor="status">{texts.statusLabel}</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder={texts.statusPlaceholder} />
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
