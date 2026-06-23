import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import api, { getImgUrl } from '@/app/utils/api';
import logoFallback from '@/assets/0772c85ef8b5349a958c92c3b3261c8a881ce229.png';

export default function Footer() {
  const settings = useSiteSettings();
  const { footer_logo, site_logo, site_name } = settings;
  const logoUrl = getImgUrl(footer_logo || site_logo) || logoFallback;

  const XIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
    </svg>
  );

  const AppleStoreIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.77 12.95c.02 2.24 1.96 2.99 1.98 3-.02.05-.31 1.07-1.02 2.12-.61.91-1.25 1.81-2.25 1.83-.98.02-1.29-.58-2.41-.58-1.12 0-1.47.56-2.39.6-.97.04-1.71-.98-2.33-1.88-1.26-1.83-2.22-5.16-.93-7.4.64-1.11 1.78-1.81 3.02-1.83.94-.02 1.82.63 2.39.63.57 0 1.64-.78 2.77-.66.47.02 1.79.19 2.64 1.44-.07.04-1.57.92-1.55 2.73ZM14 4.5c.51-.62.86-1.48.77-2.34-.73.03-1.61.48-2.13 1.09-.47.54-.88 1.41-.77 2.24.81.06 1.63-.42 2.13-.99Z" />
    </svg>
  );

  const PlayStoreIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.7 3.8c-.29.3-.45.73-.45 1.28v13.84c0 .55.16.98.45 1.28l.07.06 7.78-7.78v-.19L4.77 3.74l-.07.06Z" />
      <path d="M15.14 14.97 12.55 12.38v-.19l2.59-2.59.06.03 3.07 1.74c.88.5.88 1.31 0 1.81l-3.07 1.74-.06.05Z" />
      <path d="M15.2 14.92 12.55 12.27 4.7 20.12c.46.47 1.18.53 1.99.08l8.5-4.83" />
      <path d="M15.2 9.56 6.69 4.73c-.81-.46-1.53-.39-1.99.08l7.85 7.85 2.65-2.65Z" />
    </svg>
  );

 const socialLinks = [
  {
    Icon: XIcon,
    url: settings.social_twitter,
    name: 'X',
    color: 'text-gray-900'
  },
  {
    Icon: Linkedin,
    url: settings.social_linkedin,
    name: 'LinkedIn',
    color: 'text-[#0A66C2]'
  },
  {
    Icon: Facebook,
    url: settings.social_facebook,
    name: 'Facebook',
    color: 'text-[#1877F2]'
  },
  {
    Icon: Instagram,
    url: settings.social_instagram,
    name: 'Instagram',
    color: 'text-[#E4405F]'
  },
  
  {
    Icon: Mail,
    url: settings.contact_email ? `mailto:${settings.contact_email}` : '',
    name: 'Email',
    color: 'text-[#EA4335]'
  }
].filter(link => link.url);

  const orderFooterColumns = (cols: any[]) => {
    const company = cols.find((col: any) => col.title?.toLowerCase().includes('company'));
    const investors = cols.find((col: any) => col.title?.toLowerCase().includes('investor'));
    const others = cols.filter((col: any) => col !== company && col !== investors);
    return [...others, ...(investors ? [investors] : []), ...(company ? [company] : [])];
  };

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) { }
    }
  }, []);

  const [footerColumns, setFooterColumns] = useState<any[]>([]);

  useEffect(() => {
    const clientCol = {
      title: 'For Clients',
      links: [
        { label: 'Post a Project', path: user?.role === 'client' ? '/dashboard/create-project' : '/projects' },
        { label: 'Go Talent', path: '/talent' },
        { label: 'Client Dashboard', path: user ? '/dashboard' : '/signin' },
      ]
    };

    const freelancerCol = {
      title: 'For Freelancers',
      links: [
        { label: 'Go Projects', path: '/projects' },
        { label: 'Freelancer Dashboard', path: user ? '/dashboard' : '/signin' },
        // { label: 'Service Gigs', path: '/gigs' },
      ]
    };






    const companyCol = {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about-us' },
        { label: 'Contact Us', path: '/contact-us' },
        { label: 'FAQs', path: '/faqs' },
      ]
    };



    const investorCol = {
      title: 'For Investors',
      links: [
        { label: 'Invest in Projects', path: '/investments' },
        { label: 'Investor Dashboard', path: user ? '/dashboard' : '/signin' },
        // { label: 'Service Gigs', path: '/gigs' },
      ]
    };

    const defaultCols = user?.role === 'freelancer'
      ? [freelancerCol, clientCol, investorCol, companyCol]
      : [clientCol, freelancerCol, investorCol, companyCol];

    const fetchMenus = async () => {
      try {
        const res = await api.get('/cms/menus');
        if (res.data.success && res.data.menus) {
          const allFooter = res.data.menus.filter((m: any) => m.location === 'footer' && m.is_active);
          const topLevel = allFooter.filter((m: any) => !m.parent).sort((a: any, b: any) => a.order - b.order);

          if (topLevel.length > 0) {
            const cols = topLevel.map((parent: any) => {
              const subs = allFooter
                .filter((m: any) => {
                  const pId = typeof m.parent === 'object' ? m.parent?._id : m.parent;
                  return pId === parent._id;
                })
                .sort((a: any, b: any) => a.order - b.order);

              return {
                title: parent.label,
                links: subs.map((sub: any) => ({
                  label: sub.label,
                  path: sub.url,
                  open_in_new_tab: sub.open_in_new_tab
                }))
              };
            });

            const hasInvestor = cols.some((col: any) => col.title?.toLowerCase().includes('investor'));
            setFooterColumns(orderFooterColumns(hasInvestor ? cols : [...cols, investorCol]));
          } else {
            setFooterColumns(orderFooterColumns(defaultCols));
          }
        } else {
          setFooterColumns(orderFooterColumns(defaultCols));
        }
      } catch (err) {
        console.warn('Failed to fetch footer menus', err);
        setFooterColumns(orderFooterColumns(defaultCols));
      }
    };
    fetchMenus();
  }, [user]);

  return (
    <footer 
      className="relative pt-5 pb-6 overflow-hidden border-t border-[#FFE0C2]"
      style={{ background: 'linear-gradient(to bottom, #FFF7F0, #FFE6D4)' }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#FFEAD4] to-transparent rounded-full blur-[100px] opacity-70 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#F24C20]/90 to-transparent rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#F24C20 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 xl:px-16 max-w-[1400px] mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
          
          {/* Brand - Span 4 */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div>
              <div className="mb-4">
                <img
                  src={logoUrl}
                  alt={site_name || "Go Experts"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== logoFallback) {
                      target.src = logoFallback;
                    }
                  }}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-700 mb-2 leading-relaxed text-sm font-medium">
                {settings.site_tagline || 'Find verified experts. Get work done faster. The future of freelancing is here.'}
              </p>
            </div>
            
           <div className="flex flex-wrap gap-3 mt-auto">
  {socialLinks.map(({ Icon, url, name, color }, index) => (
    <motion.a
      key={index}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -4 }}
      className="group relative w-10 h-10 rounded-xl bg-white border border-[#FFE0C2] flex items-center justify-center shadow-sm transition-all duration-300"
    >
      <Icon className={`w-5 h-5 ${color}`} />

      {/* Tooltip */}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        {name}
      </span>
    </motion.a>
  ))}
</div>
          </div>

          {/* Links - Span 8 */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] grid grid-cols-2 sm:grid-cols-4 gap-6">
            {footerColumns.map((col, idx) => (
              <div key={idx}>
                <h3 className="font-extrabold mb-4 text-gray-900 tracking-wider uppercase text-sm">{col.title}</h3>
                <ul className="space-y-3 text-sm font-medium">
                  {col.links.map((item: any) => (
                    <li key={item.label} className="overflow-hidden">
                      <Link
                        to={item.path}
                        target={item.open_in_new_tab ? '_blank' : '_self'}
                        rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                        className="text-gray-500 hover:text-[#F24C20] transition-all duration-300 flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-200 group-hover:bg-[#F24C20] transition-colors duration-300 shrink-0 scale-0 group-hover:scale-100" />
                        <span className="transform -translate-x-3 group-hover:translate-x-0 transition-transform duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* App Download Section - Vibrant Call to Action */}
        <div className="mb-1">
          <div className="relative overflow-hidden rounded-[2rem] bg-white/20 p-2 md:p-5 shadow-[0_20px_40px_-15px_rgba(242,76,32,0.5)]">
            {/* Background Graphic for CTA */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-22 h-22 bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-5 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h4 className="text-white font-black text-lg md:text-lg mb-2 tracking-tight">Take Go Experts With You</h4>
                <p className="text-gray-600 text-xs md:text-base  max-w-xl">Available Shortly on Android and iOS Platform</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-3 bg-[#F24C20] hover:bg-[#F24C20] border border-white/20 backdrop-blur-md rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl"
                >
                  <AppleStoreIcon className="w-6 h-6 shrink-0 text-white" />
                  <div className="text-left leading-none">
                    <div className="text-[9px] text-white/70 font-semibold mb-0.5 uppercase tracking-wider">Download on</div>
                    <div className="font-bold text-white text-sm">App Store</div>
                  </div>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-3 bg-[#F24C20] hover:bg-[#F24C20] border border-white/20 backdrop-blur-md rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl"
                >
                  <PlayStoreIcon className="w-6 h-6 shrink-0 text-white" />
                  <div className="text-left leading-none">
                    <div className="text-[9px] text-white/70 font-semibold mb-0.5 uppercase tracking-wider">Get it on</div>
                    <div className="font-bold text-white text-sm">Google Play</div>
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#FFE0C2]/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F24C20] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F24C20]"></span>
              </div>
              <span>{settings.footer_copyright || `© ${new Date().getFullYear()} Go Experts. All rights reserved.`}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/privacy" className="hover:text-[#F24C20] transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#F24C20] transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-[#F24C20] transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
