'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Activity, Save, Loader2, Ruler, Weight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/i18n';
import { calculateBMI } from '@/lib/utils';
import { cn } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

interface BMIResult {
  bmi: number;
  category: string;
  categoryAr: string;
  color: string;
  tips: string[];
  tipsAr: string[];
  percentage: number;
}

export default function BMICalculatorPage() {
  const router = useRouter();
  const { language } = useAuthStore();
  const t = translations[language];
  const isRtl = language === 'ar';
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCalculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0 || h > 300 || w > 500) {
      toast.error(language === 'ar' ? 'الرجاء إدخال قيم صحيحة' : 'Please enter valid values');
      return;
    }
    const bmi = calculateBMI(w, h);
    setResult(bmi);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await axios.post('/api/history', {
        type: 'bmi',
        input: { height: parseFloat(height), weight: parseFloat(weight) },
        result,
      });
      toast.success(t.common.saved);
    } catch {
      toast.error(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const bmiRanges = [
    { label: t.bmi.underweight, range: '< 18.5', color: '#3b82f6', min: 0, max: 18.5 },
    { label: t.bmi.normal, range: '18.5 - 24.9', color: '#10b981', min: 18.5, max: 25 },
    { label: t.bmi.overweight, range: '25 - 29.9', color: '#f59e0b', min: 25, max: 30 },
    { label: t.bmi.obese, range: '≥ 30', color: '#ef4444', min: 30, max: 40 },
  ];

  return (
    <div className={cn('min-h-screen animated-bg relative overflow-hidden flex flex-col', isRtl && 'rtl')}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-500/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"
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
              <h1 className="text-3xl font-black text-white">{t.bmi.title}</h1>
              <p className="text-white/60">{t.bmi.subtitle}</p>
            </div>
          </motion.div>

          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-8 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white/80 font-medium mb-3 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-green-400" />
                  {t.bmi.height}
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: 175' : 'e.g. 175'}
                  min="50"
                  max="300"
                  className="input-glass"
                />
              </div>
              <div>
                <label className="block text-white/80 font-medium mb-3 flex items-center gap-2">
                  <Weight className="w-5 h-5 text-blue-400" />
                  {t.bmi.weight}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: 70' : 'e.g. 70'}
                  min="1"
                  max="500"
                  className="input-glass"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculate}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-3"
            >
              <Activity className="w-6 h-6" />
              {t.bmi.calculate}
            </motion.button>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* BMI Value Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-glass p-8 text-center"
                >
                  <p className="text-white/60 mb-4 font-medium">{t.bmi.yourBmi}</p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-8xl font-black mb-4"
                    style={{ color: result.color }}
                  >
                    {result.bmi}
                  </motion.div>
                  <div
                    className="text-2xl font-bold px-6 py-2 rounded-full inline-block mb-4"
                    style={{ backgroundColor: result.color + '20', color: result.color, border: `1px solid ${result.color}40` }}
                  >
                    {isRtl ? result.categoryAr : result.category}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="h-4 rounded-full bg-white/10 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.percentage}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        className="h-full rounded-full relative"
                        style={{
                          background: `linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #ef4444)`,
                        }}
                      />
                      <motion.div
                        initial={{ left: '0%' }}
                        animate={{ left: `${Math.min(result.percentage, 96)}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: result.color }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/40 mt-2">
                      <span>0</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40+</span>
                    </div>
                  </div>
                </motion.div>

                {/* BMI Scale */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card-glass p-6"
                >
                  <h3 className="text-white font-bold mb-4">{t.bmi.bmiScale}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {bmiRanges.map((range, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className={cn(
                          'p-4 rounded-xl text-center transition-all',
                          result.category === range.label || result.categoryAr === range.label
                            ? 'ring-2 scale-105'
                            : ''
                        )}
                        style={{
                          backgroundColor: range.color + '15',
                          border: `1px solid ${range.color}40`,
                        }}
                      >
                        <div className="text-sm font-bold mb-1" style={{ color: range.color }}>
                          {range.label}
                        </div>
                        <div className="text-white/50 text-xs">{range.range}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Health Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="card-glass p-6"
                >
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span>💡</span>
                    {t.bmi.healthTips}
                  </h3>
                  <div className="space-y-3">
                    {(isRtl ? result.tipsAr : result.tips).map((tip, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: result.color }}
                        />
                        <p className="text-white/70 text-sm leading-relaxed">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
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

      <Footer />
    </div>
  );
}
