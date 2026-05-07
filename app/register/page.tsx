'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Heart, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, language } = useAuthStore();
  const t = translations[language];
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRtl = language === 'ar';

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = data;
      const response = await axios.post('/api/auth/register', submitData);
      setUser(response.data.user, response.data.token || '');
      toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.error
        : t.common.error;
      toast.error(msg || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'firstName' as const, label: t.auth.firstName, icon: User, type: 'text', placeholder: language === 'ar' ? 'الاسم الأول' : 'John' },
    { name: 'lastName' as const, label: t.auth.lastName, icon: User, type: 'text', placeholder: language === 'ar' ? 'اسم العائلة' : 'Doe' },
    { name: 'email' as const, label: t.auth.email, icon: Mail, type: 'email', placeholder: 'email@example.com' },
    { name: 'phone' as const, label: t.auth.phone, icon: Phone, type: 'tel', placeholder: language === 'ar' ? 'رقم الهاتف (اختياري)' : 'Phone (optional)' },
  ];

  return (
    <div className={cn('min-h-screen animated-bg relative overflow-hidden flex flex-col', isRtl && 'rtl')}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <Navbar showAuth={false} />

      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <div className="card-glass p-8 md:p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-glow-green">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-black text-white mb-2">{t.auth.registerTitle}</h1>
              <p className="text-white/60">{t.auth.registerSubtitle}</p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {inputFields.slice(0, 2).map((field, i) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <label className="block text-white/80 text-sm font-medium mb-2">{field.label}</label>
                    <div className="relative">
                      <field.icon className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/40', isRtl ? 'right-3' : 'left-3')} />
                      <input
                        {...register(field.name)}
                        type={field.type}
                        className={cn('input-glass text-sm', isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3')}
                        placeholder={field.placeholder}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="text-red-400 text-xs mt-1">{t.common.required}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {inputFields.slice(2).map((field, i) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <label className="block text-white/80 text-sm font-medium mb-2">{field.label}</label>
                  <div className="relative">
                    <field.icon className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40', isRtl ? 'right-3' : 'left-3')} />
                    <input
                      {...register(field.name)}
                      type={field.type}
                      className={cn('input-glass', isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4')}
                      placeholder={field.placeholder}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-white/80 text-sm font-medium mb-2">{t.auth.password}</label>
                <div className="relative">
                  <Lock className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40', isRtl ? 'right-3' : 'left-3')} />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={cn('input-glass', isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10')}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn('absolute top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors', isRtl ? 'left-3' : 'right-3')}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters'}</p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-white/80 text-sm font-medium mb-2">{t.auth.confirmPassword}</label>
                <div className="relative">
                  <Lock className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40', isRtl ? 'right-3' : 'left-3')} />
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className={cn('input-glass', isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4')}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'}</p>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.common.loading}
                  </>
                ) : t.auth.registerBtn}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-6 text-center"
            >
              <span className="text-white/60">{t.auth.hasAccount} </span>
              <button
                onClick={() => router.push('/login')}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors hover:underline"
              >
                {t.auth.signIn}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
