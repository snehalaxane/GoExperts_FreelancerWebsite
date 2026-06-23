import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { getImgUrl } from '@/app/utils/api';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export default function TalentSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  // Adjusted mock data to show 3 items naturally if API falls back
  const mockTalents = [
    { id: '1', full_name: 'Sarah Johnson', role: 'Full Stack Developer', rating: '4.9', reviews: 124, location: 'San Francisco, CA', skills: ['React', 'Node.js', 'PostgreSQL'], hourly_rate: '1,500', verified: true, profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: '2', full_name: 'David Chen', role: 'UI/UX Designer', rating: '4.8', reviews: 89, location: 'Austin, TX', skills: ['Figma', 'UI Design', 'Systems'], hourly_rate: '2,000', verified: true, profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: '3', full_name: 'Michel Williams', role: 'DevOps Engineer', rating: '5.0', reviews: 56, location: 'London, UK', skills: ['Docker', 'AWS', 'Kubernetes'], hourly_rate: '2,500', verified: true, profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
  ];

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const currentUser = userStr ? JSON.parse(userStr) : null;
        const currentUserId = currentUser?._id;

        const res = await api.get('/users/freelancers');
        if (res.data.success && res.data.data.length > 0) {
          const filtered = res.data.data.filter((t: any) => t._id !== currentUserId);

          if (filtered.length > 3) {
            setHasMore(true);
          }

          // Taking up to 6 to fill up two clean rows of 3 if available
          const processed = filtered.slice(0, 6).map((t: any) => ({
            ...t,
            id: t._id,
            rating: t.review_score > 0 ? t.review_score : null,
            reviews: t.review_count || 0,
            location: t.location || 'Remote',
            skills: t.skills || ['Expertise', 'Quality'],
            role: t.role || 'Expert Professional',
            profile_image: getImgUrl(t.profile_image) || null,
            hourly_rate: t.hourly_rate || '1200'
          }));
          setTalents(processed);
        } else {
          setTalents(mockTalents);
          setHasMore(true);
        }
      } catch (error) {
        console.error('Error fetching talents:', error);
        setTalents(mockTalents);
        setHasMore(true);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchTalents();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-10 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at bottom, var(--secondary) 0%, var(--background) 100%)',
      }}
    >
      {/* Background Grid Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#F24C20]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]" />

        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F24C20" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <div className="px-4 py-1.5 rounded-full bg-[#F24C20]/10 border border-[#F24C20]/20 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F24C20]">Top 1% Verified</span>
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
            <span className="text-foreground">Meet World-Class </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F24C20] to-orange-600">Talent</span>
          </h2>

          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Work with hand-vetted professionals who have proven track records.
          </p>
        </motion.div>

        {/* 3 Columns Grid Layout (lg:grid-cols-3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {(loading ? mockTalents : talents).map((talent, index) => (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative group ${loading ? 'animate-pulse pointer-events-none' : ''}`}
            >
              {/* Blur Hover Backdrop Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFE0C2] to-[#F24C20]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm pointer-events-none" />

              <Link to={`/f/${talent.username || talent.id}`} className="block h-full">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="relative p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#FFE0C2]/60 shadow-md shadow-orange-500/[0.02] flex flex-col xl:flex-row gap-4 items-center justify-between overflow-hidden group-hover:bg-white group-hover:shadow-xl transition-all duration-300 h-full"
                >
                  {/* Avatar, Bio and Skills Content Wrapper */}
                  <div className="flex flex-col xl:flex-row items-center gap-4 text-center xl:text-left flex-1 min-w-0 w-full">
                    
                    {/* Avatar Container */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F24C20] to-orange-600 p-[2px] shadow-md shadow-[#F24C20]/5">
                        <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100">
                          <ImageWithFallback
                            src={getImgUrl(talent.profile_image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.full_name || talent.name)}&size=128&background=random&color=fff`}
                            alt={talent.full_name || talent.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Micro Verified Check Badge */}
                      {talent.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Meta Strings Container */}
                    <div className="min-w-0 flex-1 w-full">
                      <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-1 sm:gap-2 mb-0.5">
                        <h3 className="text-base font-bold text-[#F24C20] truncate max-w-[160px] group-hover:text-[#F24C20] transition-colors">
                          {talent.full_name || talent.name}
                        </h3>
                        {talent.topRated && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[9px] font-extrabold border border-purple-100/80 flex-shrink-0 tracking-wide">
                            TOP RATED
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-neutral-400 mb-2 truncate max-w-[200px] mx-auto xl:mx-0">{talent.role}</p>

                      {/* Ratings & Placement row */}
                      <div className="flex items-center justify-center xl:justify-start gap-3 text-xs text-neutral-400 mb-3">
                        <div className="flex items-center gap-0.5">
                          <Star className={`w-3.5 h-3.5 ${talent.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                          <span className="font-bold text-[#F24C20]">{talent.rating ?? 'New'}</span>
                          {talent.reviews > 0 && <span className="text-[10px] text-neutral-400">({talent.reviews})</span>}
                        </div>
                        <div className="flex items-center gap-0.5 min-w-0">
                          <MapPin className="w-3 h-3 text-[#F24C20] flex-shrink-0" />
                          <span className="truncate text-[11px]">{talent.location}</span>
                        </div>
                      </div>

                      {/* Dynamic Skill Badges */}
                      <div className="flex flex-wrap justify-center xl:justify-start gap-1">
                        {talent.skills?.slice(0, 2).map((skill: any) => {
                          const skillName = typeof skill === 'object' ? skill.name : skill;
                          if (!skillName) return null;
                          return (
                            <span
                              key={typeof skill === 'object' ? skill._id : skill}
                              className="px-2 py-0.5 rounded-md bg-neutral-50 text-[10px] font-medium text-neutral-600 border border-neutral-200/50 truncate max-w-[100px]"
                              title={skillName}
                            >
                              {skillName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal / Breakout Card Actions & Rate Section */}
                  <div className="flex xl:flex-col items-center xl:items-end justify-between xl:justify-center w-full xl:w-auto pt-1 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-4 border-neutral-100 flex-shrink-0 gap-1.5">
                    <div className="text-left xl:text-right">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block">Starts From</span>
                      <span className="text-lg font-black text-[#F24C20] tracking-tight">₹{talent.hourly_rate}</span>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F24C20] to-orange-600 flex items-center justify-center shadow-md shadow-[#F24C20]/10 text-white transform group-hover:translate-x-1 transition-transform duration-300">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button CTA */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Link to="/talent">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#F24C20] to-orange-600 hover:from-[#F24C20]/90 hover:to-orange-600/90 text-white rounded-xl font-semibold transition-all duration-300 shadow-xl shadow-[#F24C20]/20 group text-base"
              >
                <span>Discover All Talent</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}