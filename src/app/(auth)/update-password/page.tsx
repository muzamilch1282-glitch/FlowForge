import type { Metadata } from 'next';
import { UpdatePasswordForm } from '@/features/auth/components/update-password-form';

export const metadata: Metadata = {
  title: 'Update Password',
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
