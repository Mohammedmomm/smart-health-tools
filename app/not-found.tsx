'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';

export default function NotFound() {
  const router = useRouter();
  const { language } = useAuthStore();
  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen animated-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-8xl mb-8"
          >
            🔍
          </motion.div>
          <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h2>
          <p className="text-white/60 mb-8">
            {language === 'ar'
              ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.'
              : "Sorry, the page you're looking for doesn't exist."}
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white border border-white/20"
            >
              <ArrowLeft className={isRtl ? 'rotate-180' : ''} />
              {language === 'ar' ? 'رجوع' : 'Go Back'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold"
            >
              <Home className="w-4 h-4" />
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
