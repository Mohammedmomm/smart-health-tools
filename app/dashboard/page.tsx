'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calculator, Activity, ArrowRight, Clock, BarChart3, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface HistoryItem {
  id: string;
  type: string;
  createdAt: string;
  result: Record<string, unknown>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, language, token } = useAuthStore();
  const t = translations[language];
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isRtl = language === 'ar';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/history');
        setHistory(res.data.history || []);
      } catch {
        // history fetch failed silently
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const tools = [
    {
      title: t.dashboard.ageCalc,
      desc: t.dashboard.ageDesc,
      icon: <Calculator className="w-10 h-10" />,
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      glow: 'hover:shadow-blue-500/30',
      href: '/dashboard/age-calculator',
      emoji: '🎂',
      stats: language === 'ar' ? 'سنوات، أشهر، أيام، ساعات' : 'Years, Months, Days, Hours',
    },
    {
      title: t.dashboard.bmiCalc,
      desc: t.dashboard.bmiDesc,
      icon: <Activity className="w-10 h-10" />,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      glow: 'hover:shadow-green-500/30',
      href: '/dashboard/bmi-calculator',
      emoji: '⚖️',
      stats: language === 'ar' ? 'مؤشر الوزن والفئة الصحية' : 'BMI Value & Health Category',
    },
  ];

  return (
    <div className={cn('min-h-screen animated-bg relative overflow-hidden flex flex-col', isRtl && 'rtl')}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-green-500/15 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <Navbar />

      <div className="flex-1 relative z-10 px-4 pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-4xl"
              >
                👋
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  {t.dashboard.welcome},{' '}
                  <span className="gradient-text">{user?.firstName}!</span>
                </h1>
                <p className="text-white/60 mt-1">{t.dashboard.subtitle}</p>
              </div>
            </div>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-6 mb-8 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-white/60 text-sm truncate">{user?.email}</p>
              {user?.phone && <p className="text-white/40 text-xs mt-0.5">{user.phone}</p>}
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>{history.length} {language === 'ar' ? 'حسابات' : 'calculations'}</span>
            </div>
          </motion.div>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={cn('card-glass p-8 cursor-pointer group transition-all duration-300 shadow-2xl', tool.glow)}
                onClick={() => router.push(tool.href)}
              >
                {/* Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className={cn('p-4 rounded-2xl bg-gradient-to-br text-white shadow-lg', tool.gradient)}>
                    {tool.icon}
                  </div>
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i }}
                    className="text-4xl"
                  >
                    {tool.emoji}
                  </motion.span>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-black text-white mb-3">{tool.title}</h2>
                <p className="text-white/60 mb-2 leading-relaxed">{tool.desc}</p>
                <p className="text-white/40 text-sm mb-6">{tool.stats}</p>

                {/* CTA */}
                <motion.div
                  className={cn('flex items-center gap-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r', tool.gradient)}
                  whileHover={{ x: isRtl ? -5 : 5 }}
                >
                  <span>{t.dashboard.openTool}</span>
                  <ArrowRight className={cn('w-5 h-5', isRtl && 'rotate-180')} style={{ color: '#3b82f6' }} />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Recent History */}
          {!loading && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                {language === 'ar' ? 'آخر الحسابات' : 'Recent Calculations'}
              </h2>
              <div className="space-y-3">
                {history.slice(0, 5).map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="card-glass p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                        item.type === 'age' ? 'bg-blue-500/20' : 'bg-green-500/20'
                      )}>
                        {item.type === 'age' ? '🎂' : '⚖️'}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {item.type === 'age'
                            ? (language === 'ar' ? 'حاسبة العمر' : 'Age Calculator')
                            : (language === 'ar' ? 'حاسبة BMI' : 'BMI Calculator')}
                        </p>
                        <p className="text-white/40 text-xs">
                          {new Date(item.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                    </div>
                    <div className="text-white/60 text-sm">
                      {item.type === 'bmi' && typeof (item.result as Record<string, unknown>).bmi !== 'undefined'
                        ? `BMI: ${(item.result as Record<string, unknown>).bmi}`
                        : item.type === 'age' && typeof (item.result as Record<string, unknown>).years !== 'undefined'
                        ? `${(item.result as Record<string, unknown>).years} ${language === 'ar' ? 'سنة' : 'years'}`
                        : ''}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
