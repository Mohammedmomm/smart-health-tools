'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Heart, Mail, Lock, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, language } = useAuthStore();
  const t = translations[language];
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRtl = language === 'ar';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', data);
      setUser(response.data.user, response.data.token || '');
      toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!');
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

  return (
    <div className={cn('min-h-screen animated-bg relative overflow-hidden flex flex-col', isRtl && 'rtl')}>
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-green-500/15 blur-3xl"
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
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="card-glass p-8 md:p-10">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-glow">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-black text-white mb-2">{t.auth.loginTitle}</h1>
              <p className="text-white/60">{t.auth.loginSubtitle}</p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {t.auth.email}
                </label>
                <div className="relative">
                  <Mail className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40', isRtl ? 'right-3' : 'left-3')} />
                  <input
                    {...register('email')}
                    type="email"
                    className={cn('input-glass', isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4')}
                    placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'email@example.com'}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{language === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email'}</p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {t.auth.password}
                </label>
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
                  <p className="text-red-400 text-xs mt-1">{language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required'}</p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.common.loading}
                  </>
                ) : t.auth.loginBtn}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <span className="text-white/60">{t.auth.noAccount} </span>
              <button
                onClick={() => router.push('/register')}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
              >
                {t.auth.signUp}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
