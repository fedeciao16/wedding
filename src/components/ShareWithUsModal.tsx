import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dices, Check, MessageSquare } from 'lucide-react';

const SHARE_ENTRY_IDS = {
  prompt: 'entry.41587986',
  answer: 'entry.1527287205'
};

const PROMPTS = [
  "In what ways are the newlyweds super similar, and how are they polar opposites? / In cosa si somigliano tantissimo e in cosa sono agli opposti gli sposi? / In welcher Sache sind sich die beiden super ähnlich - und worin komplett verschieden?",
  "If the couple's life were a movie or a song, what would the title be? / Che titolo avrebbe la vita degli sposi, se fosse un film o una canzone? / Wenn das Leben des Paares ein Film oder ein Song wäre, wie würde der Titel lauten?",
  "What went through your mind when you first met or heard about the bride or groom? / Cosa hai pensato la prima volta che hai incontrato o sentito parlare della sposa o dello sposo? / Was hast du gedacht, als du die Braut oder den Bräutigam zum allerersten Mal getroffen oder von ihnen gehört hast?",
  "Where do you see the couple in 10 years? (Let your imagination run wild!) / Dove vedi gli sposi tra 10 anni? (Spazio alla fantasia!) / Wo siehst du die beiden in 10 Jahren? (Egal wie verrückt!)",
  "What is your favorite memory of the bride or groom? / Qual è il tuo ricordo preferito della sposa o dello sposo? / Was ist deine schönste Erinnerung an die Braut oder den Bräutigam?",
  "What is the best (or funniest) piece of advice for a happy marriage? / Qual è il consiglio migliore, o più spiritoso, per un matrimonio felice? / Was ist der beste (oder lustigste) Ratschlag für eine lange, glückliche Ehe?"
];

export const ShareWithUsModal = ({ isOpen, onClose, t, lang }: { isOpen: boolean, onClose: () => void, t: any, lang: string }) => {
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const langIndex = lang === 'de' ? 2 : lang === 'it' ? 1 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrompt || !answer.trim()) return;

    setIsSubmitting(true);

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd_u08pP1DDv440NApOO2l-aA2e3PYBnNrcHeRthbk1uKbqTQ/formResponse';
    
    const params = new URLSearchParams();
    params.append(SHARE_ENTRY_IDS.prompt, selectedPrompt);
    params.append(SHARE_ENTRY_IDS.answer, answer);

    try {
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      
      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert(t.rsvp.form.error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8">
              <Dices className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200 opacity-40 mb-4" />
              <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2">{t.share.title}</h3>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-amber-200/20 text-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-serif text-white mb-2">{t.share.successTitle}</h4>
                <p className="text-zinc-400">{t.share.successDesc}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <select 
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-200/50 transition-colors"
                    required
                  >
                    <option value="" disabled>{t.share.chooseQuestion}</option>
                    {PROMPTS.map((prompt, idx) => (
                      <option key={idx} value={prompt}>{prompt.split(' / ')[langIndex]}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">{t.share.answerLabel}</label>
                  <textarea 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-200/50 transition-colors min-h-[120px]"
                    placeholder={t.share.answerPlaceholder}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedPrompt || !answer.trim() || isSubmitting}
                  className="w-full px-6 py-3 bg-amber-200 text-amber-950 rounded-full font-medium hover:bg-amber-300 transition-all disabled:opacity-50 disabled:hover:bg-amber-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-amber-950/30 border-t-amber-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {t.share.submit}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
