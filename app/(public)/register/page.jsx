'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password too short').required('Password is required'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const handleRegister = async (values) => {
    setServerError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || 'Registration failed');
        return;
      }

      // Success: go to login or auto login and redirect
      router.push('/login');
    } catch (err) {
      setServerError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Create an Account</h2>

      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Field
              name="name"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="John Doe"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <Field
              type="email"
              name="email"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="you@example.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <Field
              type="password"
              name="password"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="********"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {serverError && (
            <div className="text-red-600 text-sm">{serverError}</div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Register
          </button>
        </Form>
      </Formik>
    </div>
  );
}
