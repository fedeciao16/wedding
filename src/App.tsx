import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Heart, Globe } from 'lucide-react';

type Lang = 'en' | 'de' | 'it';

const translations = {
  en: {
    nav: { ceremony: 'Ceremony', reception: 'Reception', rsvp: 'RSVP' },
    welcome: { subtitle: 'We are getting married', date: '19th September 2026', dateShort: '19th Sept 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'The Ceremony', map: 'View on Map' },
    reception: { title: 'The Reception', map: 'View on Map' },
    rsvp: { title: 'Join Us', desc: 'Please let us know if you can make it to our special day.', btn: 'RSVP Now' }
  },
  de: {
    nav: { ceremony: 'Trauung', reception: 'Feier', rsvp: 'Zusage' },
    welcome: { subtitle: 'Wir heiraten', date: '19. September 2026', dateShort: '19. Sept 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'Die Trauung', map: 'Auf Karte ansehen' },
    reception: { title: 'Die Feier', map: 'Auf Karte ansehen' },
    rsvp: { title: 'Feiert mit uns', desc: 'Bitte gebt uns Bescheid, ob ihr an unserem besonderen Tag dabei sein könnt.', btn: 'Jetzt zusagen' }
  },
  it: {
    nav: { ceremony: 'Cerimonia', reception: 'Ricevimento', rsvp: 'RSVP' },
    welcome: { subtitle: 'Ci sposiamo', date: '19 Settembre 2026', dateShort: '19 Sett 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'La Cerimonia', map: 'Vedi sulla mappa' },
    reception: { title: 'Il Ricevimento', map: 'Vedi sulla mappa' },
    rsvp: { title: 'Unisciti a noi', desc: 'Fateci sapere se potrete partecipare al nostro giorno speciale.', btn: 'Conferma ora' }
  }
};

const sections = [
  { id: 'welcome' },
  { id: 'ceremony' },
  { id: 'reception' },
  { id: 'rsvp' }
];

const getInitialLang = (): Lang => {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('de')) return 'de';
    if (browserLang.startsWith('it')) return 'it';
  }
  return 'en';
};

const SummaryItem = ({ children, showDot = true }: { children: React.ReactNode, showDot?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center gap-2 sm:gap-3"
  >
    {showDot && <span className="text-amber-200/40 text-[8px] sm:text-[10px]">•</span>}
    <span>{children}</span>
  </motion.div>
);

const FairyLights = () => {
  const [lights, setLights] = useState<{id: number, top: string, left: string, duration: number, delay: number, size: number}[]>([]);
  
  useEffect(() => {
    setLights(Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      size: Math.random() * 2.5 + 1,
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {lights.map((light) => (
        <motion.div
          key={light.id}
          className="absolute rounded-full bg-amber-200/40"
          style={{
            top: light.top,
            left: light.left,
            width: light.size,
            height: light.size,
            boxShadow: `0 0 ${light.size * 3}px ${light.size}px rgba(253, 230, 138, 0.2)`,
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: light.duration,
            delay: light.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(getInitialLang());
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) {
              setActiveSectionIndex(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const t = translations[lang];

  return (
    <div className="relative w-full">
      <div className="bg-noise" />
      <FairyLights />

      {/* Top Navigation (Not Sticky) */}
      <nav className="absolute top-0 left-0 right-0 z-40 flex justify-center gap-4 sm:gap-8 p-6 sm:p-8 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400">
        {sections.filter(s => s.id !== 'welcome').map(s => (
          <a key={s.id} href={`#${s.id}`} className="hover:text-amber-100 transition-colors">
            {t.nav[s.id as keyof typeof t.nav]}
          </a>
        ))}
      </nav>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative group">
          <button className="flex items-center gap-2 text-zinc-400 hover:text-amber-100 transition-colors text-[10px] sm:text-xs uppercase tracking-[0.2em]">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'EN' : lang === 'de' ? 'DE' : 'IT'}</span>
          </button>
          <div className="absolute right-0 mt-2 py-2 w-28 bg-[#050505]/90 backdrop-blur-md border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col">
            {(['en', 'de', 'it'] as Lang[]).map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 text-left text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-colors ${lang === l ? 'text-amber-200' : 'text-zinc-400'}`}
              >
                {l === 'en' ? 'English' : l === 'de' ? 'Deutsch' : 'Italiano'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Summary Header */}
      <div 
        className={`fixed top-0 left-0 right-0 z-30 flex flex-col items-center justify-center p-4 sm:p-5 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-700 ease-in-out ${
          activeSectionIndex > 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm md:text-base text-zinc-200 font-serif text-center">
          <AnimatePresence mode="popLayout">
            {activeSectionIndex >= 1 && (
              <SummaryItem key="names" showDot={false}>
                <span className="hidden sm:inline">Katharina & Federico</span>
                <span className="sm:hidden">K & F</span>
              </SummaryItem>
            )}
            {activeSectionIndex >= 1 && (
              <SummaryItem key="date">
                <span className="hidden sm:inline">{t.welcome.dateShort}</span>
                <span className="sm:hidden">{t.welcome.dateNumeric}</span>
              </SummaryItem>
            )}
            {activeSectionIndex >= 2 && (
              <SummaryItem key="ceremony">
                15:30 {t.nav.ceremony}
              </SummaryItem>
            )}
            {activeSectionIndex >= 3 && (
              <SummaryItem key="reception">
                19:00 {t.nav.reception}
              </SummaryItem>
            )}
          </AnimatePresence>
        </div>
      </div>

      <main>
        {/* Welcome Section */}
        <section id="welcome" className="min-h-screen flex flex-col items-center justify-center relative px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-8 sm:mb-12">
              {t.welcome.subtitle}
            </h2>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif font-light mb-8 sm:mb-12 tracking-tight leading-none">
              Katharina <br className="md:hidden" />
              <span className="text-amber-200/40 italic mx-4 text-5xl sm:text-7xl md:text-8xl">&</span> <br className="md:hidden" />
              Federico
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-lg sm:text-xl md:text-2xl font-serif text-zinc-300">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200/60" />
              <span className="tracking-wide">{t.welcome.date}</span>
            </div>
          </motion.div>
        </section>

        {/* Ceremony Section */}
        <section id="ceremony" className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center max-w-2xl w-full"
          >
            <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-8 sm:mb-12">
              {t.ceremony.title}
            </h2>
            <div className="text-6xl sm:text-8xl md:text-9xl font-serif font-light mb-8 sm:mb-12 text-zinc-100">
              15:30
            </div>
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-serif text-zinc-300 mb-10 sm:mb-14">
              <span>Salone Borsellino</span>
              <span className="text-zinc-400">Palazzo Vermexio, Siracusa</span>
            </div>
            <a 
              href="https://maps.app.goo.gl/FM1xH1HefZ9yHUss7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-300"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-amber-200/60" />
              {t.ceremony.map}
            </a>
          </motion.div>
        </section>

        {/* Reception Section */}
        <section id="reception" className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center max-w-2xl w-full"
          >
            <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-8 sm:mb-12">
              {t.reception.title}
            </h2>
            <div className="text-6xl sm:text-8xl md:text-9xl font-serif font-light mb-8 sm:mb-12 text-zinc-100">
              19:00
            </div>
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-serif text-zinc-300 mb-10 sm:mb-14">
              <span>Ristorante La Trota</span>
              <span className="text-zinc-400">Palazzolo Acreide</span>
            </div>
            <a 
              href="https://maps.app.goo.gl/szDuGBAqywC3kCAe9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-300"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-amber-200/60" />
              {t.reception.map}
            </a>
          </motion.div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center max-w-2xl w-full"
          >
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200/40 mx-auto mb-8 sm:mb-10" />
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light mb-6 sm:mb-8 text-zinc-100">
              {t.rsvp.title}
            </h2>
            <p className="text-zinc-400 mb-10 sm:mb-14 font-serif text-lg sm:text-xl md:text-2xl max-w-md mx-auto leading-relaxed">
              {t.rsvp.desc}
            </p>
            <button 
              className="inline-flex items-center justify-center gap-2 px-10 sm:px-12 py-4 sm:py-5 bg-zinc-100 text-[#050505] rounded-full hover:bg-amber-50 transition-colors text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium w-full sm:w-auto"
            >
              {t.rsvp.btn}
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
