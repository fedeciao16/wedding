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
    setLights(Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      size: Math.random() * 2.5 + 1.5,
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {lights.map((light) => (
        <motion.div
          key={light.id}
          className="absolute rounded-full bg-amber-100/80"
          style={{
            top: light.top,
            left: light.left,
            width: light.size,
            height: light.size,
            boxShadow: `0 0 ${light.size * 4}px ${light.size * 1.5}px rgba(253, 230, 138, 0.4)`,
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.3, 1],
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
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setLang(getInitialLang());
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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

      {/* Header: Top Navigation & Language Switcher */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center p-6 sm:p-8 pointer-events-none">
        <nav className="flex gap-4 sm:gap-8 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-400 pointer-events-auto">
          {sections.filter(s => s.id !== 'welcome').map(s => (
            <a key={s.id} href={`#${s.id}`} className="hover:text-amber-100 transition-colors">
              {t.nav[s.id as keyof typeof t.nav]}
            </a>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="absolute right-6 sm:right-8 pointer-events-auto">
          {isLangMenuOpen && (
            <div className="fixed inset-0" onClick={() => setIsLangMenuOpen(false)} />
          )}
          <div className="relative z-50">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 text-zinc-400 hover:text-amber-100 transition-colors text-xs sm:text-sm uppercase tracking-[0.2em] p-2"
            >
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">{lang === 'en' ? 'EN' : lang === 'de' ? 'DE' : 'IT'}</span>
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 py-2 w-36 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-lg flex flex-col shadow-xl"
                >
                  {(['en', 'de', 'it'] as Lang[]).map(l => (
                    <button 
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsLangMenuOpen(false);
                      }}
                      className={`px-5 py-3 text-left text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-white/5 transition-colors ${lang === l ? 'text-amber-200' : 'text-zinc-400'}`}
                    >
                      {l === 'en' ? 'English' : l === 'de' ? 'Deutsch' : 'Italiano'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Sticky Summary Header */}
      <div 
        className={`fixed top-0 left-0 right-0 z-30 flex flex-col items-center justify-center p-4 sm:p-5 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-700 ease-in-out ${
          activeSectionIndex > 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 gap-y-1 text-sm sm:text-base md:text-lg text-zinc-200 font-serif text-center">
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
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-8 sm:mb-12">
              {t.welcome.subtitle}
            </h2>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif font-light mb-8 sm:mb-12 tracking-tight leading-none">
              Katharina <br className="md:hidden" />
              <span className="text-amber-200/40 italic mx-4 text-5xl sm:text-7xl md:text-8xl">&</span> <br className="md:hidden" />
              Federico
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-serif text-zinc-300">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200/60" />
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
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-8 sm:mb-12">
              {t.ceremony.title}
            </h2>
            <div className="text-6xl sm:text-8xl md:text-9xl font-serif font-light mb-8 sm:mb-12 text-zinc-100">
              15:30
            </div>
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:text-4xl font-serif text-zinc-300 mb-10 sm:mb-14">
              <span>Salone Borsellino</span>
              <span className="text-zinc-400">Palazzo Vermexio, Siracusa</span>
            </div>
            <a 
              href="https://maps.app.goo.gl/FM1xH1HefZ9yHUss7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-300"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200/60" />
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
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-8 sm:mb-12">
              {t.reception.title}
            </h2>
            <div className="text-6xl sm:text-8xl md:text-9xl font-serif font-light mb-8 sm:mb-12 text-zinc-100">
              19:00
            </div>
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:text-4xl font-serif text-zinc-300 mb-10 sm:mb-14">
              <span>Ristorante La Trota</span>
              <span className="text-zinc-400">Palazzolo Acreide</span>
            </div>
            <a 
              href="https://maps.app.goo.gl/szDuGBAqywC3kCAe9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-300"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200/60" />
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
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200/40 mx-auto mb-8 sm:mb-10" />
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light mb-6 sm:mb-8 text-zinc-100">
              {t.rsvp.title}
            </h2>
            <p className="text-zinc-400 mb-10 sm:mb-14 font-serif text-xl sm:text-2xl md:text-3xl max-w-md mx-auto leading-relaxed">
              {t.rsvp.desc}
            </p>
            <button 
              onClick={() => setToastMessage('Coming soon!')}
              className="inline-flex items-center justify-center gap-2 px-10 sm:px-12 py-4 sm:py-5 bg-zinc-100 text-[#050505] rounded-full hover:bg-amber-50 transition-colors text-xs sm:text-sm uppercase tracking-[0.2em] font-medium w-full sm:w-auto"
            >
              {t.rsvp.btn}
            </button>
          </motion.div>
        </section>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-zinc-100 text-[#050505] px-6 py-3 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] font-medium shadow-2xl whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
