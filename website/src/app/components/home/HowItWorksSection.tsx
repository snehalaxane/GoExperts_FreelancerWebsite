import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { FileText, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: FileText,
    title: 'Post Your Project',
    description: 'Describe your project needs and budget. Our AI helps you create the perfect brief.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Match with Experts',
    description: 'Get matched with verified experts who have the exact skills you need.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: CheckCircle,
    title: 'Pay Securely & Deliver',
    description: 'Release payment only when you\'re 100% satisfied with the delivered work.',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  return (
    <section 
      ref={ref} 
      className="relative py-10 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, var(--secondary) 0%, var(--background) 100%)',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#F24C20]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="px-5 py-2.5 rounded-full bg-[#F24C20]/10 border border-[#F24C20]/30 backdrop-blur-sm">
              <span className="text-sm font-medium text-[#F24C20]">Simple Process</span>
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">How It </span>
            <span className="text-[#F24C20]">Works</span>
          </h2>
          
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Three simple steps to unlock the future of collaboration
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
            <motion.div
              className="h-full w-full bg-gradient-to-b from-transparent via-[#F24C20] to-transparent"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 2, delay: 0.5 }}
              style={{ transformOrigin: 'top' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                className={`relative flex items-center gap-4 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.03, x: index % 2 === 0 ? -10 : 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative p-8 rounded-[2rem] bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_20px_40px_rgb(242,76,32,0.12)] hover:border-[#F24C20]/20 transition-all duration-500"
                  >
                    {/* Huge Background Step Number */}
                    <div className={`absolute ${index % 2 === 0 ? '-left-8' : '-right-8'} -bottom-12 text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-neutral-200/50 to-neutral-100/10 select-none pointer-events-none transform group-hover:scale-110 group-hover:${index % 2 === 0 ? 'rotate-6' : '-rotate-6'} transition-transform duration-700`}>
                      {index + 1}
                    </div>

                    {/* Subtle Glow Sweep */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                    <div className="relative z-10 flex flex-col h-full justify-center">
                      <div className={`flex items-center gap-6 mb-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row md:flex-row-reverse text-left md:text-right'}`}>
                        {/* Icon */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={isInView ? { scale: 1, rotate: 0 } : {}}
                          transition={{ duration: 0.6, delay: index * 0.3 + 0.3, type: 'spring' }}
                        >
                          <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg shadow-black/10 text-white transform group-hover:scale-110 ${index % 2 === 0 ? 'group-hover:rotate-3' : 'group-hover:-rotate-3'} transition-all duration-300 overflow-hidden`}>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <step.icon className="w-8 h-8 relative z-10" />
                          </div>
                        </motion.div>
                        
                        {/* Title */}
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#F24C20] transition-colors tracking-tight">
                          {step.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className={`text-neutral-500 text-base sm:text-lg leading-relaxed max-w-[95%] font-medium ${index % 2 === 0 ? 'text-left' : 'text-left md:text-right ml-auto'}`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Decorative side accent line */}
                    <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-1.5 h-0 bg-gradient-to-b ${step.color} group-hover:h-full transition-all duration-500 ease-out`} />
                  </motion.div>
                </div>

                {/* Center Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.3 + 0.2, type: 'spring' }}
                  className="relative flex-shrink-0 hidden md:block"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F24C20] to-orange-600 flex items-center justify-center shadow-2xl shadow-[#F24C20]/50 border-4 border-white">
                    <motion.div
                      className="text-white font-bold text-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    >
                      {index + 1}
                    </motion.div>
                  </div>

                  {/* Pulse Rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#F24C20]"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                </motion.div>

                {/* Empty Space for Alignment */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-10"
        >
          <motion.button
            onClick={handleCTA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-3 bg-[#044071] hover:bg-[#055a99] text-white rounded-2xl font-semibold transition-all duration-300 shadow-2xl shadow-[#044071]/40 text-lg"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}