// app/(admin)/login/page.tsx
import LoginForm from '@/components/forms/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <LoginForm type="admin" />
    </div>
  );
}
