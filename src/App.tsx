import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Heart, Globe, CalendarPlus, Shirt, SquareParking } from 'lucide-react';

type Lang = 'en' | 'de' | 'it';

const translations = {
  en: {
    nav: { ceremony: 'Ceremony', reception: 'Reception', rsvp: 'RSVP' },
    welcome: { subtitle: 'We are getting married', date: '19th September 2026', dateShort: '19th Sept 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'The Ceremony', map: 'View on Map', calendar: 'Add to Calendar', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formal', parkingLabel: 'Parking', parkingOr: 'or' },
    reception: { title: 'The Reception', map: 'View on Map', calendar: 'Add to Calendar', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formal, but bring something warm as Palazzolo Acreide gets cool at night.', parkingLabel: 'Parking', parkingInfo: 'Free on-site parking' },
    rsvp: { title: 'Join Us', desc: 'Please let us know if you can make it to our special day.', btn: 'RSVP Now', giftsTitle: 'Wedding Gifts', giftsDesc: 'Your presence at our wedding is the greatest gift we could ask for! If you would still like to gift us something, then a contribution toward our honeymoon and start into our joint life together would be sincerely appreciated.' },
    countdown: { days: 'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs' }
  },
  de: {
    nav: { ceremony: 'Trauung', reception: 'Feier', rsvp: 'Zusage' },
    welcome: { subtitle: 'Wir heiraten', date: '19. September 2026', dateShort: '19. Sept 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'Die Trauung', map: 'Auf Karte ansehen', calendar: 'Zum Kalender hinzufügen', dressCodeLabel: 'Dresscode', dressCodeInfo: 'Festlich', parkingLabel: 'Parken', parkingOr: 'oder' },
    reception: { title: 'Die Feier', map: 'Auf Karte ansehen', calendar: 'Zum Kalender hinzufügen', dressCodeLabel: 'Dresscode', dressCodeInfo: 'Festlich, aber bringt etwas Warmes mit, da es in Palazzolo Acreide abends kühl wird.', parkingLabel: 'Parken', parkingInfo: 'Kostenlose Parkplätze vor Ort' },
    rsvp: { title: 'Feiert mit uns', desc: 'Bitte gebt uns Bescheid, ob ihr an unserem besonderen Tag dabei sein könnt.', btn: 'Jetzt zusagen', giftsTitle: 'Geschenke', giftsDesc: 'Eure Anwesenheit auf unserer Hochzeit ist das größte Geschenk, das wir uns wünschen können! Solltet ihr uns dennoch etwas schenken wollen, würden wir uns über einen Beitrag zu unseren Flitterwochen und unserem gemeinsamen Start ins Eheleben sehr freuen.' },
    countdown: { days: 'Tage', hours: 'Stunden', mins: 'Min', secs: 'Sek' }
  },
  it: {
    nav: { ceremony: 'Cerimonia', reception: 'Ricevimento', rsvp: 'RSVP' },
    welcome: { subtitle: 'Ci sposiamo', date: '19 Settembre 2026', dateShort: '19 Sett 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'La Cerimonia', map: 'Vedi sulla mappa', calendar: 'Aggiungi al Calendario', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formale', parkingLabel: 'Parcheggio', parkingOr: 'o' },
    reception: { title: 'Il Ricevimento', map: 'Vedi sulla mappa', calendar: 'Aggiungi al Calendario', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formale, ma portate qualcosa di caldo poiché a Palazzolo Acreide fa fresco la sera.', parkingLabel: 'Parcheggio', parkingInfo: 'Gratuito in loco' },
    rsvp: { title: 'Unisciti a noi', desc: 'Fateci sapere se potrete partecipare al nostro giorno speciale.', btn: 'Conferma ora', giftsTitle: 'Regali di Nozze', giftsDesc: 'La vostra presenza al nostro matrimonio è il regalo più grande che potessimo desiderare! Se desiderate comunque farci un regalo, un contributo per la nostra luna di miele e per l\'inizio della nostra vita insieme sarà sinceramente apprezzato.' },
    countdown: { days: 'Giorni', hours: 'Ore', mins: 'Min', secs: 'Sec' }
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

const SummaryItem = ({ children, showDot = true }: { children: React.ReactNode, showDot?: boolean, key?: React.Key }) => (
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

const downloadICS = (event: 'ceremony' | 'reception') => {
  let title, description, location, startUTC, endUTC;

  if (event === 'ceremony') {
    title = 'Wedding Ceremony - Katharina & Federico';
    description = 'Wedding Ceremony at Salone Borsellino, Palazzo Vermexio. Map: https://maps.app.goo.gl/FM1xH1HefZ9yHUss7';
    location = 'Palazzo del Vermexio, Piazza Duomo, 4, 96100 Siracusa SR, Italy';
    startUTC = '20260919T131500Z'; // 15:15 CEST
    endUTC = '20260919T141500Z'; // 16:15 CEST
  } else {
    title = 'Wedding Reception - Katharina & Federico';
    description = 'Wedding Reception at Ristorante La Trota. Map: https://maps.app.goo.gl/szDuGBAqywC3kCAe9';
    location = 'Ristorante la Trota, Strada Mare Monti, 287, 96010 Palazzolo Acreide SR, Italy';
    startUTC = '20260919T170000Z'; // 19:00 CEST
    endUTC = '20260919T220000Z'; // 00:00 CEST (next day)
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startUTC}
DTEND:${endUTC}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Countdown = ({ t }: { t: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isReady, setIsReady] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    // 19th September 2026 15:15 CEST (UTC+2) -> 13:15 UTC
    const targetDate = new Date('2026-09-19T13:15:00Z').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((difference % (1000 * 60)) / 1000),
        });
        setIsReady(true);
      } else {
        setIsOver(true);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isOver) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-4 sm:gap-8 mt-10 sm:mt-14 text-zinc-300 font-serif justify-center"
    >
      <div className="flex flex-col items-center">
        <span className="text-3xl sm:text-4xl md:text-5xl">{timeLeft.days}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-200/60 mt-2">{t.countdown.days}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl sm:text-4xl md:text-5xl">{timeLeft.hours}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-200/60 mt-2">{t.countdown.hours}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl sm:text-4xl md:text-5xl">{timeLeft.mins}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-200/60 mt-2">{t.countdown.mins}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl sm:text-4xl md:text-5xl">{timeLeft.secs}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-200/60 mt-2">{t.countdown.secs}</span>
      </div>
    </motion.div>
  );
};

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
    <div className="fixed top-0 left-0 w-screen h-[100lvh] overflow-hidden pointer-events-none z-10">
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
                15:15 {t.nav.ceremony}
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
            <Countdown t={t} />
          </motion.div>
        </section>

        {/* Ceremony Section */}
        <section id="ceremony" className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20">
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
              15:15
            </div>
            <a 
              href="https://maps.app.goo.gl/FM1xH1HefZ9yHUss7"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:text-4xl font-serif text-zinc-300 mb-6 sm:mb-8 hover:text-amber-200/80 transition-colors"
            >
              <span className="flex items-center gap-3">
                Salone Borsellino
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200/60 group-hover:text-amber-200/80 transition-colors" />
              </span>
              <span className="text-zinc-400 group-hover:text-amber-200/60 transition-colors underline underline-offset-8 decoration-white/20 group-hover:decoration-amber-200/40">Palazzo Vermexio, Siracusa</span>
            </a>
            
            <div className="flex flex-col gap-4 mb-10 sm:mb-14 text-zinc-400 text-sm sm:text-base font-serif w-fit mx-auto text-left">
              <div className="flex items-start gap-3">
                <Shirt className="w-5 h-5 text-amber-200/60 shrink-0 mt-0.5" />
                <p><strong className="text-zinc-200 font-medium">{t.ceremony.dressCodeLabel}:</strong> {t.ceremony.dressCodeInfo}</p>
              </div>
              <div className="flex items-start gap-3">
                <SquareParking className="w-5 h-5 text-amber-200/60 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-zinc-200 font-medium">{t.ceremony.parkingLabel}:</strong>{' '}
                  <a href="https://maps.app.goo.gl/VA9QtitXcEBybxqo9" target="_blank" rel="noopener noreferrer" className="text-amber-200/80 hover:text-amber-200 underline underline-offset-4">Molo Sant'Antonio</a>
                  {' '}{t.ceremony.parkingOr}{' '}
                  <a href="https://maps.app.goo.gl/4BdZ1ruhQUUTUTuf9" target="_blank" rel="noopener noreferrer" className="text-amber-200/80 hover:text-amber-200 underline underline-offset-4">Talete</a>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => downloadICS('ceremony')}
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-300 w-full sm:w-auto justify-center"
              >
                <CalendarPlus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200/60" />
                {t.ceremony.calendar}
              </button>
            </div>
          </motion.div>
        </section>

        {/* Reception Section */}
        <section id="reception" className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20">
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
            <a 
              href="https://maps.app.goo.gl/szDuGBAqywC3kCAe9"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:text-4xl font-serif text-zinc-300 mb-6 sm:mb-8 hover:text-amber-200/80 transition-colors"
            >
              <span className="flex items-center gap-3">
                Ristorante La Trota
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200/60 group-hover:text-amber-200/80 transition-colors" />
              </span>
              <span className="text-zinc-400 group-hover:text-amber-200/60 transition-colors underline underline-offset-8 decoration-white/20 group-hover:decoration-amber-200/40">Palazzolo Acreide</span>
            </a>

            <div className="flex flex-col gap-4 mb-10 sm:mb-14 text-zinc-400 text-sm sm:text-base font-serif w-fit mx-auto text-left">
              <div className="flex items-start gap-3">
                <Shirt className="w-5 h-5 text-amber-200/60 shrink-0 mt-0.5" />
                <p><strong className="text-zinc-200 font-medium">{t.reception.dressCodeLabel}:</strong> {t.reception.dressCodeInfo}</p>
              </div>
              <div className="flex items-start gap-3">
                <SquareParking className="w-5 h-5 text-amber-200/60 shrink-0 mt-0.5" />
                <p><strong className="text-zinc-200 font-medium">{t.reception.parkingLabel}:</strong> {t.reception.parkingInfo}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => downloadICS('reception')}
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-300 w-full sm:w-auto justify-center"
              >
                <CalendarPlus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200/60" />
                {t.reception.calendar}
              </button>
            </div>
          </motion.div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20">
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
              className="inline-flex items-center justify-center gap-2 px-10 sm:px-12 py-4 sm:py-5 bg-zinc-100 text-[#050505] rounded-full hover:bg-amber-50 transition-colors text-xs sm:text-sm uppercase tracking-[0.2em] font-medium w-full sm:w-auto mb-16 sm:mb-20"
            >
              {t.rsvp.btn}
            </button>

            <div className="max-w-xl mx-auto border-t border-white/10 pt-12 sm:pt-16">
              <h3 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-6 sm:mb-8">
                {t.rsvp.giftsTitle}
              </h3>
              <p className="text-zinc-400 font-serif text-base sm:text-lg md:text-xl leading-relaxed">
                {t.rsvp.giftsDesc}
              </p>
            </div>
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
