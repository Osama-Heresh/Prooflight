
"use client";

import type { AppUser } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface UserTableProps {
  users: AppUser[];
  onEditUser: (user: AppUser) => void;
  onDeleteUser: (user: AppUser) => void;
  lang: 'en' | 'ar';
}

const tableTexts = {
  en: {
    name: "Name",
    email: "Email",
    role: "Role",
    status: "Status",
    createdAt: "Created At",
    actions: "Actions",
    edit: "Edit User",
    delete: "Delete User",
    viewProfile: "View Profile (Soon)", // Placeholder
    noUsersFound: "No users found."
  },
  ar: {
    name: "الاسم",
    email: "البريد الإلكتروني",
    role: "الدور",
    status: "الحالة",
    createdAt: "تاريخ الإنشاء",
    actions: "الإجراءات",
    edit: "تعديل المستخدم",
    delete: "حذف المستخدم",
    viewProfile: "عرض الملف الشخصي (قريباً)",
    noUsersFound: "لم يتم العثور على مستخدمين."
  }
}

const getStatusVariant = (status: AppUser['status']) => {
  switch (status) {
    case 'active': return 'default';
    case 'suspended': return 'destructive';
    case 'pending_verification': return 'secondary';
    default: return 'outline';
  }
};

export function UserTable({ users, onEditUser, onDeleteUser, lang }: UserTableProps) {
  const texts = tableTexts[lang];
  const dateFormat = lang === 'ar' ? 'dd/MM/yyyy HH:mm' : 'MM/dd/yyyy h:mm a';

  if (users.length === 0) {
    return <p className="text-center text-muted-foreground py-8">{texts.noUsersFound}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{texts.name}</TableHead>
            <TableHead>{texts.email}</TableHead>
            <TableHead className="hidden md:table-cell">{texts.role}</TableHead>
            <TableHead>{texts.status}</TableHead>
            <TableHead className="hidden lg:table-cell text-right rtl:text-left">{texts.createdAt}</TableHead>
            <TableHead className="text-right rtl:text-left">{texts.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name || '-'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant={user.role === 'site_admin' ? 'secondary' : user.role === 'proof_issuer' ? 'outline' : 'default'}
                  className={user.role === 'site_admin' ? 'border-purple-500 text-purple-600' : ''}
                >
                  {user.role.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(user.status)}>
                  {user.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right rtl:text-left">
                {format(new Date(user.createdAt), dateFormat)}
              </TableCell>
              <TableCell className="text-right rtl:text-left">
                <DropdownMenu dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={lang === 'ar' ? 'start' : 'end'}>
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      <Edit className={lang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                      {texts.edit}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteUser(user)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className={lang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                      {texts.delete}
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem disabled>
                      <Eye className={lang === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                      {texts.viewProfile}
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
