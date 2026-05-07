import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birthDate: Date) {
  const now = new Date();
  const birth = new Date(birthDate);

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMs = now.getTime() - birth.getTime();
  const totalSeconds = Math.floor(totalMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const hours = now.getHours() - birth.getHours();
  const minutes = now.getMinutes() - birth.getMinutes();
  const seconds = now.getSeconds() - birth.getSeconds();

  const isBirthday = now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate();

  const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    hours: Math.abs(hours),
    minutes: Math.abs(minutes),
    seconds: Math.abs(seconds),
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    isBirthday,
    daysUntilBirthday: isBirthday ? 0 : daysUntilBirthday,
  };
}

export function calculateBMI(weight: number, height: number) {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let category: string;
  let categoryAr: string;
  let color: string;
  let tips: string[];
  let tipsAr: string[];

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryAr = 'نقص الوزن';
    color = '#3b82f6';
    tips = [
      'Increase caloric intake with nutrient-dense foods',
      'Include protein-rich foods in every meal',
      'Consider strength training to build muscle mass',
      'Consult a nutritionist for personalized advice',
    ];
    tipsAr = [
      'زيادة السعرات الحرارية بالأطعمة الغنية بالمغذيات',
      'تضمين الأطعمة الغنية بالبروتين في كل وجبة',
      'التفكير في تمارين القوة لبناء كتلة عضلية',
      'استشارة أخصائي تغذية للحصول على نصائح شخصية',
    ];
  } else if (bmi < 25) {
    category = 'Normal Weight';
    categoryAr = 'وزن طبيعي';
    color = '#10b981';
    tips = [
      'Maintain your healthy lifestyle',
      'Exercise regularly (150 minutes/week)',
      'Eat a balanced diet with plenty of vegetables',
      'Stay hydrated and get enough sleep',
    ];
    tipsAr = [
      'حافظ على نمط حياتك الصحي',
      'ممارسة الرياضة بانتظام (150 دقيقة/أسبوع)',
      'تناول نظام غذائي متوازن مع الكثير من الخضروات',
      'اشرب الماء الكافي واحصل على نوم كافٍ',
    ];
  } else if (bmi < 30) {
    category = 'Overweight';
    categoryAr = 'زيادة الوزن';
    color = '#f59e0b';
    tips = [
      'Reduce daily caloric intake by 500 calories',
      'Increase physical activity to 300 minutes/week',
      'Focus on whole foods and reduce processed foods',
      'Consider consulting a healthcare provider',
    ];
    tipsAr = [
      'تقليل السعرات الحرارية اليومية بمقدار 500 سعرة',
      'زيادة النشاط البدني إلى 300 دقيقة/أسبوع',
      'التركيز على الأطعمة الكاملة وتقليل المعالجة',
      'التفكير في استشارة مقدم الرعاية الصحية',
    ];
  } else {
    category = 'Obese';
    categoryAr = 'سمنة مفرطة';
    color = '#ef4444';
    tips = [
      'Consult a doctor for a personalized weight loss plan',
      'Start with low-impact exercises like walking or swimming',
      'Monitor your food intake and track calories',
      'Consider joining a support group or working with a dietitian',
    ];
    tipsAr = [
      'استشر طبيباً للحصول على خطة إنقاص وزن شخصية',
      'ابدأ بتمارين خفيفة مثل المشي أو السباحة',
      'راقب تناول الطعام وتتبع السعرات الحرارية',
      'فكر في الانضمام إلى مجموعة دعم أو العمل مع اختصاصي تغذية',
    ];
  }

  const percentage = Math.min((bmi / 40) * 100, 100);

  return {
    bmi: rounded,
    category,
    categoryAr,
    color,
    tips,
    tipsAr,
    percentage,
  };
}
