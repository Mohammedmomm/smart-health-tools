'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Calculator, Heart, Shield, Zap, ArrowRight, Star, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const FloatingParticle = ({ delay, duration, size, color }: { delay: number; duration: number; size: number; color: string }) => (
  <motion.div
    className="absolute rounded-full opacity-20"
    style={{ width: size, height: size, backgroundColor: color, left: `${Math.random() * 100}%` }}
    animate={{ y: [window.innerHeight, -100], opacity: [0, 0.3, 0.3, 0], rotate: [0, 360] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
  />
);

export default function LandingPage() {
  const router = useRouter();
  const { language, user } = useAuthStore();
  const t = translations[language];
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) router.push('/dashboard');
  }, [user, router]);

  const isRtl = language === 'ar';

  const featureCards = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: t.landing.features.age.title,
      desc: t.landing.features.age.desc,
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/20',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t.landing.features.bmi.title,
      desc: t.landing.features.bmi.desc,
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/20',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.landing.features.secure.title,
      desc: t.landing.features.secure.desc,
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/20',
    },
  ];

  if (!mounted) return null;

  return (
    <div className={cn('min-h-screen animated-bg relative overflow-hidden', isRtl && 'rtl')}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-green-500/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y, opacity }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/80 mb-8"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{language === 'ar' ? 'أداة الصحة الأكثر دقة' : 'Most Accurate Health Tool'}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            <span className="gradient-text">{t.landing.heroTitle}</span>
            <br />
            <motion.span
              className="text-white text-3xl md:text-4xl font-semibold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {t.landing.heroSubtitle}
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t.landing.heroDesc}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              <Zap className="w-5 h-5" />
              {t.landing.getStarted}
              <ArrowRight className={cn('w-5 h-5 group-hover:translate-x-1 transition-transform', isRtl && 'rotate-180')} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl glass text-white font-bold text-lg border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              {t.landing.login}
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { value: '100%', label: language === 'ar' ? 'دقيق' : 'Accurate' },
              { value: '2', label: language === 'ar' ? 'أدوات قوية' : 'Powerful Tools' },
              { value: '∞', label: language === 'ar' ? 'حسابات' : 'Calculations' },
              { value: 'Free', label: language === 'ar' ? 'مجاناً' : 'Forever' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div className="text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t.landing.features.title}
            </h2>
            <p className="text-white/60 text-lg">{t.landing.features.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className={cn('card-glass p-8 cursor-pointer shadow-2xl', card.glow)}
              >
                <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6 shadow-lg', card.gradient)}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                <p className="text-white/60 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center card-glass p-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            🏥
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {language === 'ar' ? 'ابدأ رحلتك الصحية اليوم' : 'Start Your Health Journey Today'}
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            {language === 'ar'
              ? 'انضم إلى آلاف المستخدمين الذين يراقبون صحتهم معنا'
              : 'Join thousands of users monitoring their health with us'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className="btn-primary text-lg px-10 py-4"
          >
            {t.landing.register}
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
