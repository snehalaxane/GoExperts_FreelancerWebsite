import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { motion, AnimatePresence } from "motion/react";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

const { Loader2, ArrowRight, Check, BadgeCheck, Mail, MessageCircle, ShieldCheck, Star, Database } = LucideIcons;

const defaultHighlights = [
  "No bidding system",
  "No commission charges",
  "Direct hiring and direct investor contact",
  "Yearly subscription model",
  "Admin email support included",
  "Private chat support between clients and freelancers",
];

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Star;
  return <IconComponent className={className} />;
};

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center rounded-full border border-[#F24C20]/30 bg-[#F24C20]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F24C20]">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl text-[#1f120d] tracking-tight">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-[#6f5548] sm:text-base">{description}</p>
    </div>
  );
}

function PlanCard({ plan, buying, onChoose, currentPlanId }: { plan: any; buying: string | null; onChoose: (id: string, name?: string) => void; currentPlanId?: string | null }) {
  const isBuying = buying === plan._id;
  const isCurrentPlan = currentPlanId && String(currentPlanId) === String(plan._id);

  const themes: any = {
    green: {
        border: "border-emerald-500/30",
        glow: "from-emerald-500/10",
        shadow: "shadow-emerald-500/10",
        badge: "bg-emerald-500",
        iconContainer: "bg-emerald-500/10 text-emerald-500",
        accent: "text-emerald-500",
        btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
        tick: "bg-emerald-500/10 text-emerald-500"
    },
    blue: {
        border: "border-blue-500/30",
        glow: "from-blue-500/10",
        shadow: "shadow-blue-500/10",
        badge: "bg-blue-500",
        iconContainer: "bg-blue-500/10 text-blue-500",
        accent: "text-blue-500",
        btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
        tick: "bg-blue-500/10 text-blue-500"
    },
    gold: {
        border: "border-amber-400/30",
        glow: "from-amber-500/10",
        shadow: "shadow-amber-500/10",
        badge: "bg-amber-500",
        iconContainer: "bg-amber-500/10 text-amber-500",
        accent: "text-amber-500",
        btn: "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20",
        tick: "bg-amber-500/10 text-amber-500"
    },
    orange: {
        border: "border-orange-500/30",
        glow: "from-orange-500/10",
        shadow: "shadow-orange-500/10",
        badge: "bg-[#F24C20]",
        iconContainer: "bg-[#F24C20]/10 text-[#F24C20]",
        accent: "text-[#F24C20]",
        btn: "bg-[#F24C20] hover:bg-[#d4431b] shadow-[#F24C20]/20",
        tick: "bg-[#F24C20]/10 text-[#F24C20]"
    }
  };

  const theme = themes[plan.color_theme] || themes.orange;

  return (
    <div
      className={`relative rounded-[40px] border p-8 shadow-2xl transition-all duration-500 flex flex-col h-full ${
        isCurrentPlan
          ? `border-[#F24C20] bg-gradient-to-br from-orange-200/40 via-rose-100/30 to-blue-100/40 backdrop-blur-2xl shadow-[#F24C20]/20`
          : plan.featured
            ? `${theme.border} bg-gradient-to-br ${theme.glow} via-purple-100/30 to-cyan-100/30 backdrop-blur-2xl ${theme.shadow}`
            : "border-white/80 bg-gradient-to-br from-blue-100/90 via-fuchsia-100/90 to-orange-100/90 backdrop-blur-2xl hover:border-orange-300/50 shadow-black/5 hover:shadow-orange-500/10"
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F24C20] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg z-10 whitespace-nowrap">
          Your Active Plan
        </div>
      )}

      {plan.badge ? (
        <div className={`absolute right-6 top-6 rounded-full border border-white/10 ${theme.badge} px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white`}>
          {plan.badge}
        </div>
      ) : null}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${plan.featured ? theme.iconContainer : 'bg-[#F24C20]/10 text-[#F24C20]'}`}>
                <DynamicIcon name={plan.icon || 'Star'} className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#1f120d]">{plan.name}</h3>
        </div>
        <p className="text-[#6f5548] text-sm mt-2 line-clamp-2 min-h-[40px]">{plan.description || 'Professional features for your growth.'}</p>
      </div>

      <div className="flex items-end gap-1 mb-8">
        <span className="text-4xl font-black text-[#1f120d]">₹{plan.price.toLocaleString()}</span>
        <span className="pb-1 text-sm font-medium text-[#8b6b5a] capitalize">/{plan.billing_cycle || 'year'}</span>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {plan.features?.map((feature: string, idx: number) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className={`mt-1 p-0.5 rounded-full ${theme.tick} group-hover:scale-110 transition-transform`}>
                <Check className="h-3 w-3 shrink-0" />
            </div>
            <span className="text-sm leading-6 text-[#4f3b31] group-hover:text-[#1f120d] transition-colors">{feature}</span>
          </div>
        ))}
        {plan.target_role !== 'investor' && (
           <div className="space-y-3 mt-4 pt-4 border-t border-[#f2d7c2]">
               {plan.project_post_limit > 0 && (
                <div className="flex items-start gap-3 text-xs text-[#6f5548]">
                    <div className={`mt-1 p-0.5 rounded-full ${theme.tick.replace('500', '400')}`}>
                        <BadgeCheck className="h-3 w-3 shrink-0" />
                    </div>
                    <span>{plan.project_post_limit} Project Submissions</span>
                </div>
               )}
               {plan.task_post_limit > 0 && (
                <div className="flex items-start gap-3 text-xs text-[#6f5548]">
                    <div className="mt-1 p-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                        <BadgeCheck className="h-3 w-3 shrink-0" />
                    </div>
                    <span>{plan.task_post_limit} Task Postings</span>
                </div>
               )}
               {plan.chat_limit > 0 && (
                <div className="flex items-start gap-3 text-xs text-[#6f5548]">
                    <div className="mt-1 p-0.5 rounded-full bg-orange-500/10 text-orange-400">
                        <MessageCircle className="h-3 w-3 shrink-0" />
                    </div>
                    <span>{plan.chat_limit} Direct Chat Slots</span>
                </div>
               )}
               {plan.database_access_limit > 0 && (
                <div className="flex items-start gap-3 text-xs text-[#6f5548]">
                    <div className="mt-1 p-0.5 rounded-full bg-purple-500/10 text-purple-400">
                        <Database className="h-3 w-3 shrink-0" />
                    </div>
                    <span>{plan.database_access_limit} Expert Database Hits</span>
                </div>
               )}
           </div>
        )}
      </div>

      <motion.button 
        whileHover={!isCurrentPlan ? { scale: 1.02 } : {}}
        whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
        disabled={!!buying || isCurrentPlan}
        onClick={() => onChoose(plan._id, plan.name)}
        className={`w-full rounded-[20px] px-5 py-4 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            isCurrentPlan
            ? "bg-white/10 text-slate-400 border border-white/10 cursor-default"
            : plan.featured 
              ? `${theme.btn} text-white shadow-xl` 
              : "border border-[#F24C20]/30 bg-white text-[#1f120d] hover:bg-[#F24C20] hover:text-white"
        }`}
      >
        {isBuying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
        ) : isCurrentPlan ? (
            <>
                <BadgeCheck className="w-5 h-5 mr-1 text-[#F24C20]" />
                Current Plan
            </>
        ) : (
            <>
                {plan.cta || 'Choose Plan'}
                <ArrowRight className="w-4 h-4 ml-1" />
            </>
        )}
      </motion.button>
    </div>
  );
}

export default function SubscriptionPlansPricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [currentPlanName, setCurrentPlanName] = useState<string | null>(null);
  const [pendingPlanChange, setPendingPlanChange] = useState<{ planId: string; planName: string } | null>(null);
  const settings = useSiteSettings();

  useEffect(() => {
    // Immediate fallback from localStorage
    const localUser = localStorage.getItem('user');
    if (localUser) {
        try {
            const userData = JSON.parse(localUser);
            if (userData.subscription_details?.plan_id) {
                setCurrentPlanId(userData.subscription_details.plan_id);
            }
            if (userData.subscription_details?.plan_name) {
                setCurrentPlanName(userData.subscription_details.plan_name);
            }
        } catch (e) {}
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Plans
        const plansRes = await api.get('/subscription-plans');
        if (plansRes.data.success) {
          setPlans(plansRes.data.data.filter((p: any) => p.status === 'enabled'));
        }

        // Fetch User Subscription (only if token exists)
        if (localStorage.getItem('token')) {
            const subRes = await api.get('/subscription/my-status');
            if (subRes.data.success && subRes.data.subscription) {
                const sub = subRes.data.subscription;
                const planId = sub.plan_id?._id || sub.plan_id;
                setCurrentPlanId(planId);
                setCurrentPlanName(sub.plan_name || sub.plan_id?.name || null);
            }
        }
      } catch (error) {
        console.error("Error fetching pricing data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const proceedChoosePlan = async (planId: string) => {
    try {
      setBuying(planId);
      const res = await api.post('/payment/initiate', { planId });
      if (res.data.success && res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
    } finally {
      setBuying(null);
    }
  };

  const handleChoosePlan = async (planId: string, planName?: string) => {
    if (currentPlanId && String(currentPlanId) !== String(planId)) {
      setPendingPlanChange({ planId, planName: planName || 'this new plan' });
      return;
    }
    await proceedChoosePlan(planId);
  };

  const groupedPlans = plans.reduce((acc: any, plan: any) => {
    const isAuthed = !!localStorage.getItem('token') || !!localStorage.getItem('user');
    const isFreeTrial = plan.price === 0 || (typeof plan.group === 'string' && plan.group.includes('Trial')) || (Array.isArray(plan.group) && plan.group.some((g: any) => g.includes('Trial')));

    // If user is logged in, never show them a "Free Trial" option (they already had/have it)
    if (isAuthed && isFreeTrial) {
      return acc;
    }

    const group = Array.isArray(plan.group) ? plan.group[0] : (plan.group || "Other Plans");
    if (!acc[group]) acc[group] = [];
    acc[group].push(plan);
    return acc;
  }, {});

  const highlights = settings?.subscription_highlights?.filter((h: any) => h.enabled)?.map((h: any) => h.label) || defaultHighlights;

  // Use dynamic groups from settings if available, else fallback
  const dynamicGroups = settings?.subscription_groups && settings.subscription_groups.length > 0 
    ? settings.subscription_groups 
    : [
        { name: 'Freelancer Plans', label: 'Freelancer', icon: 'Briefcase', description: 'Built for professionals who want direct access to projects.' },
        { name: 'Client Plans', label: 'Client', icon: 'Building2', description: 'Designed for businesses and hiring teams.' },
        { name: 'Start-Up Idea Creator Plans', label: 'Startup Creator', icon: 'Rocket', description: 'Perfect for founders who want to publish ideas.' },
        { name: 'Investor Plans', label: 'Investor', icon: 'Users', description: 'Created for investors who want access to ideas.' },
        { name: 'Combo Plan', label: 'Combo / All Access', icon: 'Layers', description: 'Full access to all platform features.' }
      ];

  const comboPlanGroup = dynamicGroups.find((g: any) => g.name === "Combo Plan");
  const otherGroups = dynamicGroups.filter((g: any) => g.name !== "Combo Plan" && groupedPlans[g.name]);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || (userData.roles ? userData.roles[0] : 'freelancer'));
      } catch (e) {}
    }
  }, []);

  // Filter groups based on user role
  const filteredGroups = otherGroups.filter(group => {
    if (!userRole) return true; // Show all to guests or if role not detected
    
    // Role-specific visibility mapping
    const roleMap: any = {
      'freelancer': ['Freelancer Plans'],
      'client': ['Client Plans'],
      'investor': ['Investor Plans'],
      'startup_creator': ['Start-Up Idea Creator Plans', 'Startup Creator Plans']
    };

    const allowedGroups = roleMap[userRole] || [];
    return allowedGroups.includes(group.name);
  });

  const sortedGroups = filteredGroups;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#F24C20] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-20 pb-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 lg:py-16 bg-gradient-to-b from-secondary to-background border-b border-border">
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center rounded-full border border-[#F24C20]/30 bg-[#F24C20]/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-[#F24C20] mb-8"
              >
                Subscription-Based Platform
              </motion.div>
              <h1 className="text-2xl font-black leading-tight sm:text-6xl lg:text-3xl uppercase tracking-tighter mb-2  text-[#1f120d]">
                {settings?.subscription_title || "The New Standard of Direct Networking."}
              </h1>
              <p className="text-lg leading-8 text-[#6f5548] max-w-2xl">
                {settings?.subscription_description || "GoExperts runs on a clean yearly subscription model. No bidding, no commissions, just direct access to the world's best talent, founders, and investors."}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {highlights.map((item: string, i: number) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-[20px] border border-[#f2d7c2] bg-white/80 p-4 backdrop-blur-xl group hover:border-[#F24C20]/30 transition-all font-bold shadow-sm"
                  >
                    <div className="flex-shrink-0 p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold leading-tight text-[#5f4a3f] group-hover:text-[#1f120d] transition-colors">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[48px] border border-orange-200/60 bg-gradient-to-br from-[#FFE0C2] via-[#FFF2E5] to-[#FAFAF9] p-2 shadow-[0_20px_80px_-15px_rgba(242,76,32,0.15)]"
            >
              <div className="rounded-[42px] border border-white/80 bg-gradient-to-br from-[#FFE0C2]/70 via-[#FFF0E5]/80 to-white/90 backdrop-blur-2xl p-8 shadow-inner">
                <div className="flex items-center justify-between gap-4 mb-10">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F24C20] mb-1">Base Annual Entry</div>
                    <div className="text-4xl font-black text-[#1f120d]">₹3,650</div>
                  </div>
                  <div className="rounded-2xl bg-[#F24C20]/10 backdrop-blur-md px-4 py-2 text-xs font-black text-[#F24C20] border border-[#F24C20]/20 uppercase tracking-widest shadow-sm">
                    ₹10 / day
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: Mail, title: "Email Support", desc: "Admin assistance included." },
                    { icon: MessageCircle, title: "Built-in Chat", desc: "Direct communication access." },
                    { icon: ShieldCheck, title: "No Fees", desc: "Keep 100% of your value." },
                    { icon: Star, title: "Scale Up", desc: "Upgrade as your needs grow." }
                  ].map((feat, i) => (
                    <div key={i} className="rounded-3xl border border-orange-500/10 bg-white/50 backdrop-blur-md p-5 group hover:bg-white/90 hover:border-orange-500/30 hover:shadow-[0_12px_40px_rgba(242,76,32,0.1)] transition-all h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                      <feat.icon className="h-6 w-6 text-[#F24C20] mb-3 group-hover:scale-110 group-hover:text-orange-600 transition-transform relative z-10" />
                      <div className="font-bold text-[#1f120d] text-sm mb-1 relative z-10">{feat.title}</div>
                      <p className="text-[11px] text-[#7a5a49] leading-normal relative z-10">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div id="pricing-sections">
        {sortedGroups.map((group) => {
          return (
            <section key={group.name} className="border-t border-[#f0d7c7] py-2">
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#F24C20]/20 bg-[#F24C20]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#F24C20]">
                      <DynamicIcon name={group.icon} className="h-3.5 w-3.5" />
                      {group.name}
                    </div>
                    <h2 className="mt-4 md:mt-6 text-xl font-black tracking-tighter sm:text-5xl text-[#1f120d]">
                      {group.label}
                    </h2>
                    <p className="mt-3 md:mt-4 text-sm leading-7 text-[#6f5548] sm:text-base">{group.description}
                    </p>
                  </div>
                
                  {/* <div className="w-fit rounded-2xl border border-[#f2d7c2] bg-white/80 px-4 py-3 text-[10px] md:text-xs font-bold text-[#7a5a49] uppercase tracking-widest">
                    Annual subscription pricing
                  </div> */}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                  {groupedPlans[group.name].sort((a: any, b: any) => a.price - b.price).map((plan: any) => (
                    <PlanCard key={plan._id} plan={plan} buying={buying} onChoose={handleChoosePlan} currentPlanId={currentPlanId} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {comboPlanGroup && groupedPlans[comboPlanGroup.name] && (
        <section className="border-t border-[#f0d7c7] bg-white/45 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow={comboPlanGroup.label}
              title="Best for multi-role users"
              description={comboPlanGroup.description}
            />

            {groupedPlans[comboPlanGroup.name].map((plan: any) => {
              const isCurrentPlan = currentPlanId && String(currentPlanId) === String(plan._id);
              return (
                <motion.div 
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`mx-auto mt-12 max-w-4xl rounded-[48px] border p-8 shadow-2xl shadow-[#F24C20]/10 sm:p-10 ${
                    isCurrentPlan ? 'border-[#F24C20] bg-gradient-to-r from-[#F24C20]/15 via-white to-[#eaf3ff]' : 'border-[#F24C20]/30 bg-gradient-to-r from-[#F24C20]/10 via-white to-[#eaf3ff]'
                  }`}
                >
                  <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between mb-10">
                    <div>
                      <div className="inline-flex rounded-full border border-[#F24C20]/30 bg-[#F24C20]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F24C20] mb-4">
                          <DynamicIcon name={plan.icon || 'Star'} className="w-3.5 h-3.5 mr-2 inline" />
                          {isCurrentPlan ? 'YOUR CURRENT PLAN' : (plan.badge || 'Best Seller')}
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1f120d]">{plan.name}</h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f5548] sm:text-base">
                        {plan.description || "Ideal for freelancers who are also founders, or clients who also invest. Get access across different roles in one bundled subscription."}
                      </p>
                    </div>

                    <div className="rounded-[32px] border border-[#f2d7c2] bg-white p-6 md:p-8 text-center min-w-[240px] shadow-sm">
                      <div className="text-xs font-black uppercase tracking-widest text-[#F24C20] mb-2">Yearly Price</div>
                      <div className="text-4xl font-black text-[#1f120d] ">₹{plan.price.toLocaleString()}</div>
                      <button 
                        onClick={() => handleChoosePlan(plan._id, plan.name)}
                        disabled={!!buying || isCurrentPlan}
                        className={`mt-6 w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition flex items-center justify-center gap-2 ${
                          isCurrentPlan 
                            ? 'bg-white/10 text-slate-400 border border-white/10 cursor-default' 
                            : 'bg-[#F24C20] hover:bg-[#F24C20]/80'
                        }`}
                      >
                        {buying === plan._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isCurrentPlan ? (
                          <>
                            <BadgeCheck className="w-5 h-5 mr-1 text-[#F24C20]" />
                            Current Plan
                          </>
                        ) : (
                          (plan.cta || 'Choose All Access')
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {plan.features.map((item: string) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#f2d7c2] bg-white/80 p-4 text-sm text-[#4f3b31]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F24C20]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

     <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-[#f0d7c7]">
  <SectionTitle
    eyebrow="Feature comparison"
    title="Simple comparison across the platform"
    description="A transparent subscription structure makes it easy for users to understand what is included at each level."
  />

  <div className="mt-2 overflow-x-auto rounded-[24px] md:rounded-[40px] border border-[#f2d7c2] bg-white/90 custom-scrollbar shadow-sm">
    <div className="min-w-[800px]">
      {/* Header Row */}
      <div className="grid grid-cols-5 border-b border-[#f2d7c2] bg-[#fff8f3] text-[10px] md:text-xs font-black uppercase tracking-widest text-[#1f120d]">
        <div className="p-4 md:p-6">Feature</div>
        {/* CHANGED: Subtle background variants for the header cells to align with column grouping */}
        <div className="p-4 md:p-6 text-center">Freelancer</div>
        <div className="p-4 md:p-6 text-center bg-[#fff2e8]/30">Client</div>
        <div className="p-4 md:p-6 text-center">Creator</div>
        <div className="p-4 md:p-6 text-center bg-[#fff2e8]/30">Investor</div>
      </div>
      
      {/* Body Rows */}
      {compareRows.map((row) => (
        <div key={row.label} className="grid grid-cols-5 border-b border-[#f7e5da] text-xs md:text-sm text-[#6f5548] last:border-b-0 hover:bg-[#fff5ee] transition-colors">
          <div className="p-4 md:p-6 font-bold text-[#1f120d]">{row.label}</div>
          
          {row.values.map((value, index) => (
            <div 
              key={`${row.label}-${index}`} 
              /* CHANGED: Added dynamic conditional styling based on column index (1 and 3 are client and investor) */
              className={`p-4 md:p-6 text-center transition-colors ${
                index === 1 || index === 3 
                  ? 'bg-[#fffbf9]/60 font-medium text-[#1f120d]' 
                  : ''
              }`}
            >
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
  
  <div className="mt-4 flex justify-center lg:hidden">
    <p className="text-[10px] uppercase font-bold text-[#8b6b5a] tracking-widest animate-pulse">Swipe left to see more →</p>
  </div>
</section>

      <section className="mx-auto max-w-7xl sm:px-2 lg:px-2 mb-2">
        <div className="rounded-[48px] border border-[#f2d7c2] bg-gradient-to-r from-[#F24C20]/12 via-white to-[#eaf3ff] p-5 shadow-2xl shadow-[#F24C20]/10 sm:p-16 lg:p-10 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-[#F24C20]/20 bg-[#F24C20]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#F24C20] mb-4">
              GoExperts Pricing Strategy
            </div>
            <h2 className="text-4xl tracking-tighter sm:text-4xl text-[#1f120d] mb-4">Zero commission. <br/>Direct connections.</h2>
            <p className="text-lg leading-8 text-[#6f5548] mb-6 max-w-3xl">
              Position GoExperts as a clean subscription-first marketplace where freelancers, clients, founders, and investors get predictable pricing and better-quality connections.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row justify-center lg:justify-start">
            <button className="rounded-2xl bg-[#F24C20] px-3 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#F24C20]/80 shadow-xl shadow-[#F24C20]/20">
              Start Annual Plan
            </button>
            <button className="rounded-2xl border border-[#f2d7c2] bg-white px-3 py-3 text-sm font-black uppercase tracking-widest text-[#1f120d] transition hover:border-[#F24C20]/40 hover:bg-[#fff8f3]">
              Request Demo
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {pendingPlanChange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setPendingPlanChange(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-[#f2d7c2] bg-[#fdf7f2] p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-[#F24C20]/10 p-3">
                  <DynamicIcon name="Crown" className="h-6 w-6 text-[#F24C20]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1f120d]">Confirm Plan Change</h3>
                  <p className="mt-3 text-sm leading-6 text-[#6f5548]">
                    You already have an active subscription{currentPlanName ? ` (${currentPlanName})` : ''}. If you switch to <span className="font-bold text-[#1f120d]">{pendingPlanChange.planName}</span>, your current package benefits and remaining points or limits will be removed, and only the new plan points or limits will be updated.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#f2d7c2] bg-white/80 p-4 text-sm text-[#6f5548]">
                This replaces the current package. Old benefits do not carry over into the new plan.
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setPendingPlanChange(null)}
                  style={{ color: '#1f120d' }}
                  className="rounded-2xl border border-gray-200 px-5 py-3 font-bold transition-all hover:bg-white hover:text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const nextPlan = pendingPlanChange;
                    setPendingPlanChange(null);
                    if (nextPlan) {
                      await proceedChoosePlan(nextPlan.planId);
                    }
                  }}
                  className="rounded-2xl bg-[#F24C20] px-5 py-3 font-bold text-white transition-all hover:bg-[#d4431b]"
                >
                  Continue Upgrade
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
}

const compareRows = [
  { label: "Bidding System", values: ["No", "No", "No", "No"] },
  { label: "Commission Charges", values: ["No", "No", "No", "No"] },
  { label: "Direct Chat", values: ["Yes", "Yes", "Yes", "Yes"] },
  { label: "Email Support", values: ["Yes", "Yes", "Yes", "Yes"] },
  { label: "Priority Visibility", values: ["Pro+", "Pro+", "Growth+", "Pro+"] },
  { label: "Unlimited Access", values: ["Pro+", "Pro+", "Growth+", "Pro+"] },
];
