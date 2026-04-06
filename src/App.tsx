import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Heart, Globe, CalendarPlus, Shirt, SquareParking, X, ChevronRight, ChevronLeft, Check, Plus, Trash2, Utensils, AlertCircle, User, Copy, CheckCircle2, Gift, Delete } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import coupleImg from './assets/couple.jpg';

type Lang = 'en' | 'de' | 'it';

const translations = {
  en: {
    nav: { ceremony: 'Ceremony', reception: 'Reception', rsvp: 'RSVP' },
    welcome: { subtitle: 'We are getting married', date: '19th September 2026', dateShort: '19th Sept 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'The Ceremony', map: 'View on Map', calendar: 'Add to Calendar', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formal', parkingLabel: 'Parking', parkingOr: 'or' },
    reception: { title: 'The Reception', map: 'View on Map', calendar: 'Add to Calendar', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formal, but bring something warm as Palazzolo Acreide gets cool at night.', parkingLabel: 'Parking', parkingInfo: 'Free on-site parking' },
    rsvp: { 
      title: 'Join Us', 
      desc: 'Please let us know if you can make it to our special day.', 
      btn: 'RSVP Now', 
      giftsTitle: 'A note on Wedding Gifts', 
      giftsDesc: 'Your presence at our wedding is the greatest gift we could ask for! If you would still like to gift us something, then a contribution toward our honeymoon and start into our joint life together would be sincerely appreciated.',
      revealDetails: 'Reveal details',
      copied: 'Copied!',
      form: {
        familyName: 'Family Name',
        familyNamePlaceholder: 'e.g. Schenk/Midolo',
        ceremony: 'Will you attend the ceremony?',
        reception: 'Will you attend the reception?',
        yes: 'Yes',
        no: 'No',
        guestTitle: 'Guest {{n}}',
        firstName: 'First Name',
        lastName: 'Last Name',
        menu: 'Menu Preference',
        menuFish: 'Fish Menu',
        menuMeat: 'Meat Alternative',
        menuChild: 'Children\'s Menu',
        allergies: 'Allergies or Intolerances',
        addGuest: 'Add another guest',
        removeGuest: 'Remove guest',
        next: 'Next',
        back: 'Back',
        submit: 'Submit RSVP',
        success: 'Thank you very much for letting us know!',
        successSub: 'Your response has been recorded.',
        error: 'Something went wrong. Please try again.',
        oneFormPerFamily: 'Please fill out one form per family.'
      }
    },
    countdown: { days: 'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs' }
  },
  de: {
    nav: { ceremony: 'Trauung', reception: 'Feier', rsvp: 'Zusage' },
    welcome: { subtitle: 'Wir heiraten', date: '19. September 2026', dateShort: '19. Sept 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'Die Trauung', map: 'Auf Karte ansehen', calendar: 'Zum Kalender hinzufügen', dressCodeLabel: 'Dresscode', dressCodeInfo: 'Festlich', parkingLabel: 'Parken', parkingOr: 'oder' },
    reception: { title: 'Die Feier', map: 'Auf Karte ansehen', calendar: 'Zum Kalender hinzufügen', dressCodeLabel: 'Dresscode', dressCodeInfo: 'Festlich, aber bringt etwas Warmes mit, da es in Palazzolo Acreide abends kühl wird.', parkingLabel: 'Parken', parkingInfo: 'Kostenlose Parkplätze vor Ort' },
    rsvp: { 
      title: 'Feiert mit uns', 
      desc: 'Bitte gebt uns Bescheid, ob ihr an unserem besonderen Tag dabei sein könnt.', 
      btn: 'Jetzt zusagen', 
      giftsTitle: 'Ein paar Worte zu Geschenken', 
      giftsDesc: 'Eure Anwesenheit auf unserer Hochzeit ist das größte Geschenk, das wir uns wünschen können! Solltet ihr uns dennoch etwas schenken wollen, würden wir uns über einen Beitrag zu unseren Flitterwochen und unserem gemeinsamen Start ins Eheleben sehr freuen.',
      revealDetails: 'Details anzeigen',
      copied: 'Kopiert!',
      form: {
        familyName: 'Familienname',
        familyNamePlaceholder: 'z.B. Schenk/Midolo',
        ceremony: 'Teilnahme an der Trauung?',
        reception: 'Teilnahme an der Feier?',
        yes: 'Ja',
        no: 'Nein',
        guestTitle: 'Gast {{n}}',
        firstName: 'Vorname',
        lastName: 'Nachname',
        menu: 'Menüpräferenz',
        menuFish: 'Fischmenü',
        menuMeat: 'Fleischalternative',
        menuChild: 'Kindermenü',
        allergies: 'Allergien oder Lebensmittelunverträglichkeiten',
        addGuest: 'Weiteren Gast hinzufügen',
        removeGuest: 'Gast entfernen',
        next: 'Weiter',
        back: 'Zurück',
        submit: 'Zusage absenden',
        success: 'Vielen Dank für eure Rückmeldung!',
        successSub: 'Eure Antwort wurde gespeichert.',
        error: 'Etwas ist schief gelaufen. Bitte versuche es erneut.',
        oneFormPerFamily: 'Bitte ein Formular pro Familie ausfüllen.'
      }
    },
    countdown: { days: 'Tage', hours: 'Stunden', mins: 'Min', secs: 'Sek' }
  },
  it: {
    nav: { ceremony: 'Cerimonia', reception: 'Ricevimento', rsvp: 'Conferma' },
    welcome: { subtitle: 'Ci sposiamo', date: '19 Settembre 2026', dateShort: '19 Sett 2026', dateNumeric: '19.09.26' },
    ceremony: { title: 'La Cerimonia', map: 'Vedi sulla mappa', calendar: 'Aggiungi al Calendario', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formale', parkingLabel: 'Parcheggio', parkingOr: 'o' },
    reception: { title: 'Il Ricevimento', map: 'Vedi sulla mappa', calendar: 'Aggiungi al Calendario', dressCodeLabel: 'Dress Code', dressCodeInfo: 'Formale, ma portate qualcosa di caldo poiché a Palazzolo Acreide fa fresco la sera.', parkingLabel: 'Parcheggio', parkingInfo: 'Gratuito in loco' },
    rsvp: { 
      title: 'Unitevi a noi', 
      desc: 'Fateci sapere se potrete partecipare al nostro giorno speciale.', 
      btn: 'Conferma ora', 
      giftsTitle: 'Un appunto sui Regali', 
      giftsDesc: 'La vostra presenza al matrimonio è il regalo più grande che potessimo desiderare! Se desiderate comunque farci un regalo, un contributo per la nostra luna di miele e per l\'inizio della nostra vita insieme sarà sinceramente apprezzato.',
      revealDetails: 'Mostra dettagli',
      copied: 'Copiato!',
      form: {
        familyName: 'Nome della famiglia',
        familyNamePlaceholder: 'ad esempio Schenk/Midolo',
        ceremony: 'Parteciperete alla cerimonia?',
        reception: 'Parteciperete al ricevimento?',
        yes: 'Sì',
        no: 'No',
        guestTitle: 'Ospite {{n}}',
        firstName: 'Vorname',
        lastName: 'Cognome',
        menu: 'Preferenza menù',
        menuFish: 'Menu di pesce',
        menuMeat: 'Alternativa di carne',
        menuChild: 'Menu per bambini',
        allergies: 'Allergie o intolleranze alimentari',
        addGuest: 'Aggiungere un altro ospite',
        removeGuest: 'Rimuovi ospite',
        next: 'Avanti',
        back: 'Indietro',
        submit: 'Invia conferma',
        success: 'Grazie mille per avercelo fatto sapere!',
        successSub: 'La vostra risposta è stata registrata.',
        error: 'Qualcosa è andato storto. Per favore riprova.',
        oneFormPerFamily: 'Compilare un modulo per famiglia per favore.'
      }
    },
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

const CopyButton = ({ text, t }: { text: string, t: any }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-3 p-2 text-zinc-400 hover:text-amber-200 transition-colors" title={copied ? t.rsvp.copied : "Copy"}>
      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const RotateOnClick = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [rotation, setRotation] = useState(0);
  return (
    <motion.div
      className={className}
      onClick={() => setRotation(r => r + 360)}
      animate={{ rotateY: rotation }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d", cursor: "pointer" }}
    >
      {children}
    </motion.div>
  );
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

const ENTRY_IDS = {
  familyName: 'entry.44399872',
  ceremony: 'entry.493036937',
  reception: 'entry.1536182294',
  guests: [
    { firstName: 'entry.873285286', lastName: 'entry.68954905', menu: 'entry.56052562', allergies: 'entry.7359624', addAnother: 'entry.1883133536' },
    { firstName: 'entry.1728709375', lastName: 'entry.1436763885', menu: 'entry.777587009', allergies: 'entry.148975984', addAnother: 'entry.1707085550' },
    { firstName: 'entry.1661057067', lastName: 'entry.216828863', menu: 'entry.1119623677', allergies: 'entry.1747123524', addAnother: 'entry.1632607731' },
    { firstName: 'entry.1948607450', lastName: 'entry.1805637810', menu: 'entry.475243490', allergies: 'entry.250674452', addAnother: 'entry.51474314' },
    { firstName: 'entry.1484714026', lastName: 'entry.903536142', menu: 'entry.554775842', allergies: 'entry.863671942', addAnother: 'entry.1257320432' },
    { firstName: 'entry.1867500885', lastName: 'entry.699296044', menu: 'entry.1978884413', allergies: 'entry.1774313050', addAnother: 'entry.2029054108' },
    { firstName: 'entry.597057835', lastName: 'entry.1422554480', menu: 'entry.636134820', allergies: 'entry.2112936650', addAnother: 'entry.64972178' },
    { firstName: 'entry.10936418', lastName: 'entry.88822188', menu: 'entry.108785113', allergies: 'entry.1038949119', addAnother: 'entry.1178997103' },
    { firstName: 'entry.650804760', lastName: 'entry.393313103', menu: 'entry.334562974', allergies: 'entry.1401946989', addAnother: 'entry.835758670' },
    { firstName: 'entry.1957369302', lastName: 'entry.499329917', menu: 'entry.494731702', allergies: 'entry.1462187285', addAnother: '' }
  ]
};

const RSVPModal = ({ isOpen, onClose, t }: { isOpen: boolean, onClose: () => void, t: any }) => {
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState('');
  const [ceremony, setCeremony] = useState<boolean | null>(null);
  const [reception, setReception] = useState<boolean | null>(null);
  const [guests, setGuests] = useState([{ firstName: '', lastName: '', menu: '', allergies: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form when closed
      setTimeout(() => {
        setStep(0);
        setFamilyName('');
        setCeremony(null);
        setReception(null);
        setGuests([{ firstName: '', lastName: '', menu: '', allergies: '' }]);
        setIsSuccess(false);
      }, 300);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleAddGuest = () => {
    if (guests.length < 10) {
      setGuests([...guests, { firstName: '', lastName: '', menu: '', allergies: '' }]);
    }
  };

  const handleRemoveGuest = (index: number) => {
    if (guests.length > 1) {
      const newGuests = [...guests];
      newGuests.splice(index, 1);
      setGuests(newGuests);
    }
  };

  const updateGuest = (index: number, field: string, value: string) => {
    const newGuests = [...guests];
    (newGuests[index] as any)[field] = value;
    setGuests(newGuests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeQDie7Kp1wwK2CbpsYXtUii9IjaKgHKb-DCS-_FrAc3l65Qw/formResponse';
    
    const params = new URLSearchParams();
    params.append(ENTRY_IDS.familyName, familyName);
    params.append(ENTRY_IDS.ceremony, ceremony ? 'Ja / Sì' : 'Nein / No');
    params.append(ENTRY_IDS.reception, reception ? 'Ja / Sì' : 'Nein / No');

    if (reception === false) {
      params.append('pageHistory', '0');
    } else {
      const history = Array.from({ length: guests.length + 1 }, (_, i) => i).join(',');
      params.append('pageHistory', history);

      guests.forEach((guest, index) => {
        const ids = ENTRY_IDS.guests[index];
        params.append(ids.firstName, guest.firstName);
        params.append(ids.lastName, guest.lastName);
        
        let menuValue = '';
        if (guest.menu === 'fish') menuValue = 'Fischmenü / Menu di pesce';
        else if (guest.menu === 'meat') menuValue = 'Fleischalternative / Alternativa di carne';
        else if (guest.menu === 'child') menuValue = 'Kindermenü / Menu per bambini';
        
        params.append(ids.menu, menuValue);
        params.append(ids.allergies, guest.allergies);
        
        if (ids.addAnother) {
          params.append(ids.addAnother, index < guests.length - 1 ? 'Ja / Sì' : 'Nein / No');
        }
      });
    }

    try {
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.action = formUrl;
      form.method = 'POST';
      form.target = 'hidden_iframe';

      params.forEach((value, key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        setIsSuccess(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert(t.rsvp.form.error);
    }
  };

  const isStepValid = () => {
    if (step === 0) return familyName.trim() !== '' && ceremony !== null && reception !== null;
    return guests.every(g => g.firstName.trim() !== '' && g.lastName.trim() !== '' && g.menu !== '');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-transparent"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85dvh]"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-serif text-zinc-100">{t.rsvp.title}</h3>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">{t.rsvp.form.oneFormPerFamily}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-amber-200/20 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-amber-200" />
                  </div>
                  <h4 className="text-2xl font-serif text-zinc-100 mb-2">{t.rsvp.form.success}</h4>
                  <p className="text-zinc-300 max-w-xs mx-auto">{t.rsvp.form.successSub}</p>
                  <button 
                    onClick={onClose}
                    className="mt-8 px-8 py-3 bg-white text-zinc-950 rounded-full font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {step === 0 ? (
                    <motion.div 
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                          <User className="w-4 h-4 text-amber-200/80" />
                          {t.rsvp.form.familyName}
                        </label>
                        <input 
                          type="text"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          placeholder={t.rsvp.form.familyNamePlaceholder}
                          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-200/50 transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm font-medium text-zinc-300">{t.rsvp.form.ceremony}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCeremony(true)}
                            className={`py-3 rounded-xl border transition-all ${ceremony === true ? 'bg-amber-200/10 border-amber-200/50 text-amber-200' : 'bg-zinc-800 border-white/10 text-zinc-400 hover:border-white/20'}`}
                          >
                            {t.rsvp.form.yes}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCeremony(false)}
                            className={`py-3 rounded-xl border transition-all ${ceremony === false ? 'bg-amber-200/10 border-amber-200/50 text-amber-200' : 'bg-zinc-800 border-white/10 text-zinc-400 hover:border-white/20'}`}
                          >
                            {t.rsvp.form.no}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm font-medium text-zinc-300">{t.rsvp.form.reception}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setReception(true)}
                            className={`py-3 rounded-xl border transition-all ${reception === true ? 'bg-amber-200/10 border-amber-200/50 text-amber-200' : 'bg-zinc-800 border-white/10 text-zinc-400 hover:border-white/20'}`}
                          >
                            {t.rsvp.form.yes}
                          </button>
                          <button
                            type="button"
                            onClick={() => setReception(false)}
                            className={`py-3 rounded-xl border transition-all ${reception === false ? 'bg-amber-200/10 border-amber-200/50 text-amber-200' : 'bg-zinc-800 border-white/10 text-zinc-400 hover:border-white/20'}`}
                          >
                            {t.rsvp.form.no}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      {guests.map((guest, index) => (
                        <div key={index} className="space-y-6 relative">
                          <div className="flex items-center justify-between">
                            <h4 className="text-amber-200 font-serif text-lg">
                              {t.rsvp.form.guestTitle.replace('{{n}}', (index + 1).toString())}
                            </h4>
                            {guests.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => handleRemoveGuest(index)}
                                className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{t.rsvp.form.firstName}</label>
                              <input 
                                type="text"
                                value={guest.firstName}
                                onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:border-amber-200/50 transition-colors"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{t.rsvp.form.lastName}</label>
                              <input 
                                type="text"
                                value={guest.lastName}
                                onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:border-amber-200/50 transition-colors"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                              <Utensils className="w-3 h-3 text-amber-200/80" />
                              {t.rsvp.form.menu}
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                { id: 'fish', label: t.rsvp.form.menuFish },
                                { id: 'meat', label: t.rsvp.form.menuMeat },
                                { id: 'child', label: t.rsvp.form.menuChild }
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => updateGuest(index, 'menu', option.id)}
                                  className={`px-4 py-2.5 rounded-xl border text-sm text-left transition-all ${guest.menu === option.id ? 'bg-amber-200/10 border-amber-200/50 text-amber-200' : 'bg-zinc-800 border-white/10 text-zinc-400 hover:border-white/20'}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                              <AlertCircle className="w-3 h-3 text-amber-200/80" />
                              {t.rsvp.form.allergies}
                            </label>
                            <textarea 
                              value={guest.allergies}
                              onChange={(e) => updateGuest(index, 'allergies', e.target.value)}
                              rows={2}
                              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:border-amber-200/50 transition-colors resize-none"
                            />
                          </div>
                          
                          {index < guests.length - 1 && <div className="h-px bg-white/5 w-full mt-8" />}
                        </div>
                      ))}

                      {guests.length < 10 && (
                        <button
                          type="button"
                          onClick={handleAddGuest}
                          className="w-full py-4 bg-zinc-800/50 border border-dashed border-white/10 rounded-2xl text-zinc-400 hover:text-amber-200/60 hover:border-amber-200/20 transition-all flex items-center justify-center gap-2 group"
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          {t.rsvp.form.addGuest}
                        </button>
                      )}
                    </motion.div>
                  )}
                </form>
              )}
            </div>

            {!isSuccess && (
              <div className="p-6 border-t border-white/5 bg-zinc-950 shrink-0 flex gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="px-6 py-3 border border-white/10 rounded-full text-zinc-400 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t.rsvp.form.back}
                  </button>
                )}
                
                {step === 0 ? (
                  reception === false ? (
                    <button
                      type="submit"
                      disabled={!isStepValid() || isSubmitting}
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-3 bg-amber-200 text-amber-950 rounded-full font-medium hover:bg-amber-300 transition-all disabled:opacity-50 disabled:hover:bg-amber-200 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-amber-950/30 border-t-amber-950 rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          {t.rsvp.form.submit}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!isStepValid()}
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 bg-white text-zinc-950 rounded-full font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:hover:bg-white flex items-center justify-center gap-2"
                    >
                      {t.rsvp.form.next}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid() || isSubmitting}
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-amber-200 text-amber-950 rounded-full font-medium hover:bg-amber-300 transition-all disabled:opacity-50 disabled:hover:bg-amber-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-amber-950/30 border-t-amber-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {t.rsvp.form.submit}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const downloadICS = (event: 'ceremony' | 'reception') => {
  let title, description, location, startUTC, endUTC;

  if (event === 'ceremony') {
    title = 'Wedding Ceremony - Katharina & Federico';
    description = 'Wedding Ceremony at Salone Borsellino, Palazzo Vermexio. Map: https://maps.app.goo.gl/FM1xH1HefZ9yHUss7';
    location = 'Palazzo del Vermexio, Piazza Duomo, 4, 96100 Siracusa SR, Italy';
    startUTC = '20260919T130000Z'; // 15:00 CEST
    endUTC = '20260919T140000Z'; // 16:00 CEST
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
    // 19th September 2026 15:00 CEST (UTC+2) -> 13:00 UTC
    const targetDate = new Date('2026-09-19T13:00:00Z').getTime();

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, delay: 2.5 }}
      className="fixed inset-0 w-full h-[100lvh] overflow-hidden pointer-events-none z-0"
    >
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
    </motion.div>
  );
};

const BurstAnimation = ({ delay }: { delay: number }) => {
  const [sparkles, setSparkles] = useState<any[]>([]);
  
  useEffect(() => {
    setSparkles(Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 20; // distance in vmin
      return {
        id: `burst-${i}`,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: Math.random() * 0.8 + 0.4,
        delay: delay + Math.random() * 0.8
      };
    }));
  }, [delay]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <style>{`
        @keyframes burst-sparkle {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(var(--s)); opacity: 0; }
        }
      `}</style>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-amber-200 rounded-full shadow-[0_0_15px_rgba(253,230,138,1)]"
          style={{
            '--tx': `${sparkle.x}vmin`,
            '--ty': `${sparkle.y}vmin`,
            '--s': sparkle.scale,
            animation: `burst-sparkle 3s ease-out ${sparkle.delay}s forwards`,
            opacity: 0,
            willChange: 'transform, opacity'
          } as any}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

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
    <div className="relative w-full bg-zinc-950 overflow-x-hidden">
      <div className="bg-noise" />
      {isUnlocked && <FairyLights />}

      {isUnlocked && (
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.0, duration: 1 }}
          className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center p-6 sm:p-8 pointer-events-none"
        >
        <nav className="flex gap-3 sm:gap-8 text-[10px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400 pointer-events-auto">
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
      </motion.header>
      )}

      {/* Sticky Summary Header */}
      {isUnlocked && (
      <div 
        className={`fixed top-0 left-0 right-0 z-30 flex flex-col items-center justify-center p-4 sm:p-5 bg-[#050505]/30 backdrop-blur-md border-b border-white/5 transition-all duration-700 ease-in-out ${
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
                15:00 {t.nav.ceremony}
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
      )}

      <main>
        {/* Welcome Section */}
        <section id="welcome" className="min-h-screen flex flex-col items-center justify-center relative px-6 pt-12 pb-12 sm:pb-20 z-10">
          
          {/* Couple Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
            className="z-20 mt-auto relative mb-6 sm:mb-8"
          >
            {isUnlocked && <BurstAnimation delay={0.5} />}
            <RotateOnClick className="relative z-20 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mb-8 sm:mb-10 rounded-full overflow-hidden border-2 border-amber-200/20 shadow-[0_0_40px_rgba(253,230,138,0.1)] bg-zinc-900">
              <img 
                src={coupleImg} 
                alt="Katharina & Federico" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </RotateOnClick>
          </motion.div>

          <div className="w-full relative mb-auto">
            <AnimatePresence>
              {!isUnlocked && (
                <motion.div
                  key="password-input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 2.0, ease: "easeOut" } }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.4, delay: 0, ease: "easeIn" } }}
                  className="absolute inset-0 flex items-center justify-center z-30"
                >
                <div className="flex flex-col gap-6 items-center w-full max-w-xs text-center">
                  {/* Password Dots */}
                  <div className="flex gap-3 mb-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${i < password.length ? 'bg-amber-200 shadow-[0_0_8px_rgba(253,230,138,0.8)]' : 'border border-amber-200/30 bg-transparent'}`}
                      />
                    ))}
                  </div>

                  {showPasswordError && (
                    <span className="text-red-400 text-sm absolute -top-6">Incorrect PIN</span>
                  )}

                  {/* Numpad */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={async () => {
                          if (password.length >= 6) return;
                          const newPassword = password + num;
                          setPassword(newPassword);
                          setShowPasswordError(false);
                          
                          if (newPassword.length === 6) {
                            try {
                              const encoder = new TextEncoder();
                              const data = encoder.encode(newPassword);
                              const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                              const hashArray = Array.from(new Uint8Array(hashBuffer));
                              const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                              
                              if (hashHex === '57367e207dbd56a32e08943ed1c736bf6b59e20819fef47d83faa7c16d9400ea') {
                                setIsUnlocked(true);
                                setShowPasswordError(false);
                              } else {
                                setShowPasswordError(true);
                                setPassword('');
                              }
                            } catch (err) {
                              if (newPassword === '190926') {
                                setIsUnlocked(true);
                                setShowPasswordError(false);
                              } else {
                                setShowPasswordError(true);
                                setPassword('');
                              }
                            }
                          }
                        }}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center text-xl sm:text-2xl text-zinc-200 hover:bg-white/10 active:bg-white/20 transition-colors font-light"
                      >
                        {num}
                      </button>
                    ))}
                    <div className="w-14 h-14 sm:w-16 sm:h-16" /> {/* Empty cell */}
                    <button
                      onClick={async () => {
                        if (password.length >= 6) return;
                        const newPassword = password + '0';
                        setPassword(newPassword);
                        setShowPasswordError(false);
                        
                        if (newPassword.length === 6) {
                          try {
                            const encoder = new TextEncoder();
                            const data = encoder.encode(newPassword);
                            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                            const hashArray = Array.from(new Uint8Array(hashBuffer));
                            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                            
                            if (hashHex === '57367e207dbd56a32e08943ed1c736bf6b59e20819fef47d83faa7c16d9400ea') {
                              setIsUnlocked(true);
                              setShowPasswordError(false);
                            } else {
                              setShowPasswordError(true);
                              setPassword('');
                            }
                          } catch (err) {
                            if (newPassword === '190926') {
                              setIsUnlocked(true);
                              setShowPasswordError(false);
                            } else {
                              setShowPasswordError(true);
                              setPassword('');
                            }
                          }
                        }
                      }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center text-xl sm:text-2xl text-zinc-200 hover:bg-white/10 active:bg-white/20 transition-colors font-light"
                    >
                      0
                    </button>
                    <button
                      onClick={() => {
                        setPassword(p => p.slice(0, -1));
                        setShowPasswordError(false);
                      }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              key="welcome-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isUnlocked ? 1 : 0, y: isUnlocked ? 0 : 20 }}
              transition={{ duration: 1.2, delay: isUnlocked ? 4.0 : 0, ease: "easeOut" }}
              className={`text-center w-full z-20 ${!isUnlocked ? 'pointer-events-none' : ''}`}
            >
                <h2 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-100/60 mb-6 sm:mb-8">
                  {t.welcome.subtitle}
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 mb-6 sm:mb-8 w-full max-w-5xl mx-auto px-2 text-5xl sm:text-7xl md:text-8xl font-serif font-light tracking-tight text-zinc-100">
                  <span className="text-center">Katharina</span>
                  <span className="text-amber-200/40 italic text-4xl sm:text-6xl md:text-7xl px-1">&</span>
                  <span className="text-center">Federico</span>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-serif text-zinc-300 mb-8 sm:mb-12">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200/60" />
                  <span className="tracking-wide">{t.welcome.date}</span>
                </div>
                <Countdown t={t} />
              </motion.div>
          </div>
        </section>

        {/* Ceremony Section */}
        {isUnlocked && (
        <>
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
              15:00
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
            
            <div className="flex flex-col gap-4 mb-10 sm:mb-14 text-zinc-400 text-sm sm:text-base font-serif w-full max-w-sm mx-auto text-left px-4">
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

            <div className="flex flex-col gap-4 mb-10 sm:mb-14 text-zinc-400 text-sm sm:text-base font-serif w-full max-w-sm mx-auto text-left px-4">
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
              onClick={() => setIsRSVPModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-10 sm:px-12 py-4 sm:py-5 bg-zinc-100 text-[#050505] rounded-full hover:bg-amber-50 transition-colors text-xs sm:text-sm uppercase tracking-[0.2em] font-medium w-full sm:w-auto mb-16 sm:mb-20"
            >
              {t.rsvp.btn}
            </button>
          </motion.div>
        </section>

        {/* Gifts Section */}
        <section id="gifts" className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center max-w-2xl w-full"
          >
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200/40 mx-auto mb-8 sm:mb-10" />
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light mb-6 sm:mb-8 text-zinc-100">
              {t.rsvp.giftsTitle}
            </h2>
            <p className="text-zinc-400 mb-10 sm:mb-14 font-serif text-xl sm:text-2xl md:text-3xl max-w-md mx-auto leading-relaxed">
              {t.rsvp.giftsDesc}
            </p>
            
            {!showBankDetails ? (
              <button 
                onClick={() => setShowBankDetails(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-300"
              >
                {t.rsvp.revealDetails}
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-zinc-950/50 rounded-2xl p-6 text-left border border-white/5 space-y-3 max-w-md mx-auto overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                  <span className="text-zinc-500 text-sm uppercase tracking-wider">IBAN</span>
                  <div className="flex items-center">
                    <span className="text-zinc-200 font-mono text-sm sm:text-base">GB45 REVO 0099 7012 249 61</span>
                    <CopyButton text="GB45 REVO 0099 7012 249 61" t={t} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                  <span className="text-zinc-500 text-sm uppercase tracking-wider">BIC</span>
                  <div className="flex items-center">
                    <span className="text-zinc-200 font-mono text-sm sm:text-base">REVOGB21</span>
                    <CopyButton text="REVOGB21" t={t} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                  <span className="text-zinc-500 text-sm uppercase tracking-wider">{lang === 'it' ? 'Beneficiario' : lang === 'de' ? 'Begünstigter' : 'Beneficiary'}</span>
                  <div className="flex items-center">
                    <span className="text-zinc-200 text-sm sm:text-base">Federico Midolo</span>
                    <CopyButton text="Federico Midolo" t={t} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <span className="text-zinc-500 text-sm uppercase tracking-wider">{lang === 'it' ? 'Banca' : lang === 'de' ? 'Bank' : 'Bank name'}</span>
                  <div className="flex items-center">
                    <span className="text-zinc-200 text-sm sm:text-base">Revolut</span>
                    <CopyButton text="Revolut" t={t} />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </section>
        </>
        )}
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

      {/* RSVP Modal */}
      <RSVPModal 
        isOpen={isRSVPModalOpen} 
        onClose={() => setIsRSVPModalOpen(false)} 
        t={t} 
      />
    </div>
  );
}
