// app/(public)/login/page.tsx
import LoginForm from '@/components/forms/LoginForm';

export default function PublicLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <LoginForm type="user" />
    </div>
  );
}
