import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Star, Briefcase, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

const ICON_MAP: Record<string, any> = {
  Star, Briefcase, Award, TrendingUp
};

const defaultStats = [
  { icon: Star, value: 4.9, suffix: '/5', label: 'Average Rating', color: 'from-amber-400 to-orange-500' },
  { icon: Briefcase, value: 500, suffix: '+', label: 'Active Projects', color: 'from-blue-500 to-indigo-600' },
  { icon: Award, value: 1665, suffix: '', label: 'Expert Skills', color: 'from-purple-500 to-pink-500' },
  { icon: TrendingUp, value: 98, suffix: '%', label: 'Success Rate', color: 'from-emerald-400 to-teal-600' },
];

function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const isFloat = end % 1 !== 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const currentVal = progress * end;
      // Handle decimal formatting nicely if it's a float like 4.9
      setCount(isFloat ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function TrustStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const settings = useSiteSettings();

  const stats = settings.home_stats && settings.home_stats.length > 0
    ? settings.home_stats.map((s, i) => ({
        ...s,
        icon: ICON_MAP[s.label.split(' ')[0]] || [Star, Briefcase, Award, TrendingUp][i % 4],
        color: ['from-amber-400 to-orange-500', 'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-500', 'from-emerald-400 to-teal-600'][i % 4]
      }))
    : defaultStats;

  const trustBadges = settings.trust_badges && settings.trust_badges.length > 0
    ? settings.trust_badges
    : ['Featured on TechCrunch', 'Backed by Y Combinator', 'ISO 27001 Certified', 'SOC 2 Compliant'];

  return (
    <section
      ref={ref}
      className="relative py-1 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--background) 0%, var(--secondary) 50%, var(--background) 100%)',
      }}
    >
      {/* Background Glow Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#F24C20]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F24C20]/5 rounded-full blur-[120px]" />

        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F24C20" stopOpacity="0" />
              <stop offset="50%" stopColor="#F24C20" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F24C20" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${(i * 25)}%`}
              y1="0%"
              x2={`${(i * 25)}%`}
              y2="100%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{
                duration: 4,
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <div className="px-4 py-1.5 rounded-full bg-[#F24C20]/10 border border-[#F24C20]/20 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F24C20]">Trusted Globally</span>
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-foreground">Numbers That </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F24C20] to-orange-600">Define Excellence</span>
          </h2>

          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Join thousands of satisfied clients and verified experts building the future of work together.
          </p>
        </motion.div>

        {/* Stats Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Stat Card Body */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative h-full p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between overflow-hidden group-hover:shadow-[0_20px_40px_rgb(242,76,32,0.12)] group-hover:border-[#F24C20]/20 transition-all duration-500 z-10"
              >
                {/* Background watermark icon */}
                <div className="absolute -right-6 -top-6 opacity-[0.03] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none text-gray-900">
                  <stat.icon className="w-48 h-48" />
                </div>
                
                <div className="relative z-10">
                  {/* Icon Block */}
                  <div className="mb-8 flex">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/10 text-white transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <stat.icon className="w-7 h-7 relative z-10" />
                    </div>
                  </div>

                  {/* Value Block */}
                  <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-2">
                    <Counter end={stat.value} duration={2} />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-br ${stat.color} ml-1 text-3xl sm:text-4xl`}>{stat.suffix}</span>
                  </div>
                </div>

                {/* Label */}
                <div className="text-neutral-500 font-bold text-xs sm:text-sm leading-relaxed mt-2 uppercase tracking-[0.2em] relative z-10">
                  {stat.label}
                </div>

                {/* Decorative Animated Line */}
                <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${stat.color} group-hover:w-full transition-all duration-500 ease-out`} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="hidden md:flex mt-8 flex-wrap items-center justify-center gap-6"
        >
          {trustBadges.map((trust) => (
            <div 
              key={trust}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-[#FFE0C2]/40 rounded-full shadow-sm hover:bg-white hover:border-[#F24C20]/30 transition-colors duration-200"
            >
              <CheckCircle className="w-4 h-4 text-[#F24C20] flex-shrink-0" />
              <span className="text-xs font-bold tracking-wider text-neutral-600 uppercase">{trust}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}