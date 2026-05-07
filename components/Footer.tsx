'use client';

import { motion } from 'framer-motion';
import { Heart, Github } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function Footer() {
  const { language } = useAuthStore();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="relative z-10 py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          "glass rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4",
          language === 'ar' && 'rtl'
        )}>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>{language === 'ar' ? 'صنع بـ' : 'Made with'}</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>{language === 'ar' ? 'بواسطة أدوات الصحة الذكية' : 'by Smart Health Tools'}</span>
          </div>
          <div className="text-white/40 text-sm">
            {language === 'ar' ? '© 2024 جميع الحقوق محفوظة' : '© 2024 All rights reserved'}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
