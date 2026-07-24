'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Lock, User, Shield } from 'lucide-react';
import { ToastProvider, useToast, PageHeader, FormField } from '@/components/admin/ui';
import { authService } from '@/services';
import apiClient from '@/api/client';
import { cn } from '@/utils/helpers';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

function formatMemberSince(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
}

function ProfileContent() {
  const toast = useToast();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    role: 'admin' | 'superadmin';
    createdAt: string;
  } | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        const user = response.data.data;
        setUserData(user);
        resetProfile({
          name: user.name,
          email: user.email,
        });
      } catch {
        // If API fails, fall back to cached data
        const cached = authService.currentUser;
        if (cached) {
          setUserData(cached);
          resetProfile({
            name: cached.name,
            email: cached.email,
          });
        }
      }
    };

    // Prefill from authService.currentUser immediately if available
    const cached = authService.currentUser;
    if (cached) {
      setUserData(cached);
      resetProfile({
        name: cached.name,
        email: cached.email,
      });
    }

    fetchUser();
  }, [resetProfile]);

  const onProfileSubmit = useCallback(
    async (data: ProfileFormData) => {
      setIsSavingProfile(true);
      try {
        await apiClient.put('/auth/profile', {
          name: data.name,
          email: data.email,
        });

        // Update cached user
        if (authService.currentUser) {
          authService.currentUser = {
            ...authService.currentUser,
            name: data.name,
            email: data.email,
          };
        }
        setUserData((prev) =>
          prev ? { ...prev, name: data.name, email: data.email } : prev,
        );

        toast.success('Profile updated', 'Your profile information has been saved.');
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || 'Failed to update profile. Please try again.';
        toast.error('Update failed', message);
      } finally {
        setIsSavingProfile(false);
      }
    },
    [toast],
  );

  const onPasswordSubmit = useCallback(
    async (data: PasswordFormData) => {
      setIsSavingPassword(true);
      try {
        await apiClient.put('/auth/change-password', {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        toast.success('Password changed', 'Your password has been updated successfully.');
        resetPassword();
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || 'Failed to change password. Please try again.';
        toast.error('Password change failed', message);
      } finally {
        setIsSavingPassword(false);
      }
    },
    [toast, resetPassword],
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account settings"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Profile' },
        ]}
      />

      {/* Account Info Bar */}
      {userData && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Email</span>
            <span className="text-sm font-medium text-white/80">
              {userData.email}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Role</span>
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-xs font-medium',
                userData.role === 'superadmin'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                  : 'bg-purple-500/15 text-purple-400 border-purple-500/20',
              )}
            >
              {userData.role === 'superadmin' ? (
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Member since</span>
            <span className="text-sm text-white/70">
              {formatMemberSince(userData.createdAt)}
            </span>
          </div>
        </div>
      )}

      {/* Card 1: Profile Information */}
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/15">
              <User className="h-4.5 w-4.5 text-purple-400" />
            </div>
            <h2 className="text-base font-semibold text-white/90">
              Profile Information
            </h2>
          </div>
          <button
            type="button"
            onClick={handleProfileSubmit(onProfileSubmit)}
            disabled={isSavingProfile}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200',
              'bg-purple-600 hover:bg-purple-500 shadow-[0_0_16px_rgba(139,92,246,0.2)]',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
          >
            {isSavingProfile ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </button>
        </div>

        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="space-y-5 p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Name"
              required
              error={profileErrors.name?.message}
              placeholder="Enter your name"
              {...registerProfile('name')}
            />
            <FormField
              label="Email"
              required
              error={profileErrors.email?.message}
              type="email"
              placeholder="Enter your email"
              {...registerProfile('email')}
            />
          </div>
        </form>
      </div>

      {/* Card 2: Change Password */}
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/15">
              <Lock className="h-4.5 w-4.5 text-purple-400" />
            </div>
            <h2 className="text-base font-semibold text-white/90">
              Change Password
            </h2>
          </div>
          <button
            type="button"
            onClick={handlePasswordSubmit(onPasswordSubmit)}
            disabled={isSavingPassword}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200',
              'bg-purple-600 hover:bg-purple-500 shadow-[0_0_16px_rgba(139,92,246,0.2)]',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
          >
            {isSavingPassword ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </button>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-5 p-6"
        >
          <div className="grid gap-5 sm:grid-cols-1">
            <FormField
              label="Current Password"
              required
              error={passwordErrors.currentPassword?.message}
              type="password"
              placeholder="Enter your current password"
              {...registerPassword('currentPassword')}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="New Password"
                required
                error={passwordErrors.newPassword?.message}
                type="password"
                placeholder="Enter new password"
                {...registerPassword('newPassword')}
              />
              <FormField
                label="Confirm Password"
                required
                error={passwordErrors.confirmPassword?.message}
                type="password"
                placeholder="Confirm new password"
                {...registerPassword('confirmPassword')}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ToastProvider>
      <ProfileContent />
    </ToastProvider>
  );
}