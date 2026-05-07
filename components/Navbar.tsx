'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Globe, Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/i18n';
import axios from 'axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface NavbarProps {
  showAuth?: boolean;
}

export default function Navbar({ showAuth = true }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { user, language, setLanguage, logout } = useAuthStore();
  const router = useRouter();
  const t = translations[language];

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      logout();
      router.push('/');
      toast.success(language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out successfully');
    } catch {
      toast.error(t.common.error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className={cn("font-bold text-white text-lg", language === 'ar' && 'rtl')}>
              {language === 'ar' ? 'أدوات الصحة' : 'SmartHealth'}
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="p-2 rounded-xl glass text-white/80 hover:text-white transition-colors"
              title="Toggle language"
            >
              <Globe className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl glass text-white/80 hover:text-white transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {showAuth && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className={cn("text-white/80 text-sm hidden sm:block", language === 'ar' && 'rtl')}>
                      {language === 'ar' ? `مرحباً، ${user.firstName}` : `Hi, ${user.firstName}`}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:block">{t.nav.logout}</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/login')}
                      className="px-4 py-2 rounded-xl text-white/80 hover:text-white text-sm transition-colors"
                    >
                      {t.nav.login}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/register')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-green-600 transition-all"
                    >
                      {t.nav.register}
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
