'use client';

import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm type="user" />
    </div>
  );
}
