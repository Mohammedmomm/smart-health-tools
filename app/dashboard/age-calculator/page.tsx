'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Calendar, Clock, Save, Loader2, Calculator } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/i18n';
import { calculateAge } from '@/lib/utils';
import { cn } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const confettiModule = dynamic(() => import('canvas-confetti'), { ssr: false });

interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isBirthday: boolean;
  daysUntilBirthday: number;
}

export default function AgeCalculatorPage() {
  const router = useRouter();
  const { language } = useAuthStore();
  const t = translations[language];
  const isRtl = language === 'ar';
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [liveResult, setLiveResult] = useState<AgeResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fireConfetti = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default;
    const duration = 5 * 1000;
    const end = Date.now() + duration;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleCalculate = () => {
    if (!birthDate) {
      toast.error(language === 'ar' ? 'الرجاء إدخال تاريخ الميلاد' : 'Please enter your birth date');
      return;
    }
    const age = calculateAge(new Date(birthDate));
    setResult(age);
    setLiveResult(age);

    if (age.isBirthday) {
      setShowBirthdayModal(true);
      fireConfetti();
    }
  };

  useEffect(() => {
    if (result) {
      intervalRef.current = setInterval(() => {
        const updated = calculateAge(new Date(birthDate));
        setLiveResult(updated);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [result, birthDate]);

  const handleSave = async () => {
    if (!liveResult) return;
    setSaving(true);
    try {
      await axios.post('/api/history', {
        type: 'age',
        input: { birthDate },
        result: liveResult,
      });
      toast.success(t.common.saved);
    } catch {
      toast.error(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const statCards = liveResult ? [
    { label: t.age.years, value: liveResult.years, color: 'from-blue-500 to-cyan-500', emoji: '🗓️' },
    { label: t.age.months, value: liveResult.months, color: 'from-purple-500 to-pink-500', emoji: '📅' },
    { label: t.age.days, value: liveResult.days, color: 'from-green-500 to-emerald-500', emoji: '📆' },
    { label: t.age.hours, value: liveResult.hours, color: 'from-yellow-500 to-orange-500', emoji: '⏰' },
    { label: t.age.minutes, value: liveResult.minutes, color: 'from-red-500 to-pink-500', emoji: '⏱️' },
    { label: t.age.seconds, value: liveResult.seconds, color: 'from-indigo-500 to-blue-500', emoji: '⚡' },
  ] : [];

  const totalCards = liveResult ? [
    { label: t.age.totalDays, value: liveResult.totalDays.toLocaleString(), color: 'text-blue-400' },
    { label: t.age.totalHours, value: liveResult.totalHours.toLocaleString(), color: 'text-green-400' },
    { label: t.age.totalMinutes, value: liveResult.totalMinutes.toLocaleString(), color: 'text-yellow-400' },
  ] : [];

  return (
    <div className={cn('min-h-screen animated-bg relative overflow-hidden flex flex-col', isRtl && 'rtl')}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <Navbar />

      <div className="flex-1 relative z-10 px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-xl glass text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className={cn('w-6 h-6', isRtl && 'rotate-180')} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-black text-white">{t.age.title}</h1>
              <p className="text-white/60">{t.age.subtitle}</p>
            </div>
          </motion.div>

          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-white/80 font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  {t.age.birthDate}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="input-glass cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCalculate}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/30 whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t.age.calculate}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {liveResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {statCards.map((card, i) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="card-glass p-6 text-center"
                    >
                      <div className="text-3xl mb-2">{card.emoji}</div>
                      <motion.div
                        key={card.value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className={cn('text-4xl font-black mb-1 bg-gradient-to-r bg-clip-text text-transparent', card.color)}
                      >
                        {card.value}
                      </motion.div>
                      <div className="text-white/60 text-sm font-medium">{card.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Total Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="card-glass p-6 mb-6"
                >
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    {language === 'ar' ? 'إجماليات' : 'Totals'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {totalCards.map((card) => (
                      <div key={card.label} className="text-center p-4 rounded-xl bg-white/5">
                        <div className={cn('text-2xl font-black mb-1', card.color)}>
                          {card.value}
                        </div>
                        <div className="text-white/50 text-xs">{card.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Birthday Countdown */}
                {!liveResult.isBirthday && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card-glass p-6 mb-6 text-center"
                  >
                    <div className="text-4xl mb-3">🎂</div>
                    <div className="text-white/60">
                      <span className="text-3xl font-black gradient-text">{liveResult.daysUntilBirthday} </span>
                      {t.age.nextBirthday}
                    </div>
                  </motion.div>
                )}

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? t.common.loading : t.common.save}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Birthday Modal */}
      <AnimatePresence>
        {showBirthdayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBirthdayModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ type: 'spring', damping: 15 }}
              className="card-glass p-10 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="text-8xl mb-6"
              >
                🎂
              </motion.div>
              <motion.h2
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-4xl font-black gradient-text mb-4"
              >
                {t.age.birthday}
              </motion.h2>
              <p className="text-white/70 text-lg mb-8">{t.age.birthdayMsg}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['🎉', '🎊', '🎈', '🌟', '💫', '✨'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -20, 0], rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="text-3xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBirthdayModal(false)}
                className="btn-primary px-10 py-3"
              >
                {language === 'ar' ? 'شكراً! 🎉' : 'Thank You! 🎉'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
