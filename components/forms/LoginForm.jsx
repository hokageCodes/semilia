'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios'; // custom axios instance

const LoginForm = ({ type }) => {
  const router = useRouter();
  const { login } = useAuth();

  const isAdmin = type === 'admin';

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'At least 6 characters').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await api.post('/auth/login', values);
      const { user, token } = res.data;

      localStorage.setItem('token', token);
      login(user);

      toast.success('Login successful');

      router.push(user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-white p-8 shadow rounded"
    >
      <h2 className="text-xl font-bold mb-6 text-center">
        {isAdmin ? 'Admin Login' : 'Sign in to your account'}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isAdmin ? 'Login as Admin' : 'Sign In'}
            </button>

            {!isAdmin && (
              <div className="text-sm text-center mt-4">
                Don’t have an account?{' '}
                <a href="/register" className="text-blue-600 hover:underline">
                  Register
                </a>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default LoginForm;
