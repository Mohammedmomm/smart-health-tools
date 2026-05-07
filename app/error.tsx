'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { language } = useAuthStore();

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md card-glass p-10"
      >
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-black text-white mb-3">
          {language === 'ar' ? 'حدث خطأ ما' : 'Something went wrong'}
        </h1>
        <p className="text-white/60 mb-8">
          {language === 'ar'
            ? 'نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.'
            : "We're sorry for the inconvenience. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'ar' ? 'حاول مجدداً' : 'Try Again'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl glass text-white border border-white/20"
          >
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
