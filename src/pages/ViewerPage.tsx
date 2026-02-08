import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BlurText from "../components/BlurText";
import type { LetterData } from "../components/ComposeLetter";
import Envelope from "../components/Envelope";
import Letter from "../components/Letter";
import PageShell from "../components/PageShell";
import { fetchLetter, markOpened, recordResponse } from "../lib/api";
import { fireCelebrationConfetti } from "../lib/confetti";
import { formatLetter, letterRowToData } from "../lib/letter";

const NO_BUTTON_PHRASES = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely certain?",
  "This could be a mistake!",
  "Have a heart!",
  "Don't be so cold!",
  "Change of heart?",
  "Wouldn't you reconsider?",
  "Is that your final answer?",
  "You're breaking my heart ;(",
];

export default function ViewerPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const [step, setStep] = useState(1); // 1=envelope, 2=letter, 3=question, 4=celebration
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [letterData, setLetterData] = useState<LetterData | null>(null);

  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [cursorHearts, setCursorHearts] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (!id) {
      setFetchError(true);
      setIsLoading(false);
      return;
    }
    fetchLetter(id).then((row) => {
      if (row) {
        setLetterData(letterRowToData(row));
      } else {
        setFetchError(true);
      }
      setIsLoading(false);
    });
  }, [id]);

  const formattedLetter = useMemo(
    () => (letterData ? formatLetter(letterData) : ""),
    [letterData],
  );

  const handleEnvelopeOpen = useCallback(async () => {
    setStep(2);
    if (id) {
      const ok = await markOpened(id);
      if (!ok) console.error("markOpened failed for letter", id);
    }
  }, [id]);

  function handleNoHover(): void {
    setNoButtonPos({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
    setNoCount((c) => c + 1);
  }

  async function handleYesClick(): Promise<void> {
    setStep(4);
    fireCelebrationConfetti();

    if (id) {
      const ok = await recordResponse(id, "yes");
      if (!ok) {
        // Retry once after a short delay
        await new Promise((r) => setTimeout(r, 1000));
        await recordResponse(id, "yes");
      }
    }
  }

  function handleCardMouseMove(e: React.MouseEvent<HTMLDivElement>): void {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorHearts((prev) => [
      ...prev.slice(-20),
      {
        id: Date.now() + Math.random(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    ]);
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <motion.div
            className="text-6xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            💌
          </motion.div>
          <p className="text-soft-ink text-lg">Loading your letter...</p>
        </div>
      </PageShell>
    );
  }

  if (fetchError) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="love-card love-card--frosted love-card--elevated p-6 sm:p-8 max-w-md w-full text-center">
            <p className="text-4xl mb-4">😢</p>
            <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">
              Letter Not Found
            </h2>
            <p className="text-soft-ink mb-4">
              This love letter seems to have gotten lost in the mail.
            </p>
            <Link
              to="/"
              className="btn-primary inline-block px-6 py-3"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const noButtonText = NO_BUTTON_PHRASES[Math.min(noCount, NO_BUTTON_PHRASES.length - 1)];

  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Envelope */}
          {step === 1 && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex items-center justify-center"
            >
              <Envelope onOpen={handleEnvelopeOpen} />
            </motion.div>
          )}

          {/* Step 2: Letter */}
          {step === 2 && (
            <Letter
              key="letter"
              text={formattedLetter}
              onNext={() => setStep(3)}
            />
          )}

          {/* Step 3: The Question */}
          {step === 3 && (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="love-card love-card--frosted love-card--elevated p-6 sm:p-8 md:p-12 max-w-lg w-full mx-3 sm:mx-4 text-center relative overflow-hidden"
              onMouseMove={handleCardMouseMove}
            >
              {/* Corner decorations */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 border-l-2 border-t-2 border-burgundy/15" />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 border-r-2 border-t-2 border-burgundy/15" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 border-l-2 border-b-2 border-burgundy/15" />
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 border-r-2 border-b-2 border-burgundy/15" />

              {/* Floating hearts on cursor */}
              {cursorHearts.map((heart) => (
                <motion.span
                  key={heart.id}
                  initial={{ opacity: 1, scale: 1, x: heart.x, y: heart.y }}
                  animate={{ opacity: 0, scale: 0, y: heart.y - 50 }}
                  transition={{ duration: 0.8 }}
                  className="absolute text-lg sm:text-xl pointer-events-none"
                  style={{ left: 0, top: 0 }}
                >
                  💕
                </motion.span>
              ))}

              <motion.div
                className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                💖
              </motion.div>

              <BlurText
                text="Will you be my Valentine?"
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-burgundy mb-6 sm:mb-8 justify-center"
                delay={100}
                animateBy="words"
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center relative z-10">
                <motion.button
                  onClick={handleYesClick}
                  className="btn-primary px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes!
                </motion.button>

                <motion.button
                  onMouseEnter={handleNoHover}
                  onClick={handleNoHover}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-parchment text-soft-ink rounded-md font-semibold transition-all border-2 border-burgundy/15 hover:border-burgundy/25 text-sm sm:text-base"
                  animate={{
                    x: noButtonPos.x,
                    y: noButtonPos.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {noButtonText}
                </motion.button>
              </div>

              {noCount > 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 sm:mt-6 text-deep-rose/70 text-xs sm:text-sm font-medium italic"
                >
                  The "No" button seems to be running away...
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Step 4: Celebration */}
          {step === 4 && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 sm:gap-6 max-w-lg w-full mx-3 sm:mx-4 px-1"
            >
              <motion.div
                className="text-6xl sm:text-7xl md:text-8xl"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🥰
              </motion.div>

              <div className="love-card love-card--frosted love-card--elevated p-5 sm:p-6 md:p-8 text-center w-full relative">
                {/* Corner decorations */}
                <div className="absolute top-3 left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-burgundy/15" />
                <div className="absolute top-3 right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2 border-burgundy/15" />
                <div className="absolute bottom-3 left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2 border-burgundy/15" />
                <div className="absolute bottom-3 right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-burgundy/15" />

                <BlurText
                  text="Yay! You made my heart skip a beat!"
                  className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-burgundy mb-3 sm:mb-4 justify-center pt-2"
                  delay={80}
                />

                <p className="text-soft-ink text-base sm:text-lg mb-2">
                  Can't wait to celebrate with you! 💕
                </p>

                <div className="flex justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-4xl my-4 sm:my-6">
                  {["🌹", "💝", "🍫", "💌", "🧸"].map((emoji, i) => (
                    <motion.span
                      key={emoji}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
