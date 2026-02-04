import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import BlurText from "./components/BlurText";
import type { LetterData } from "./components/ComposeLetter";
import ComposeLetter, { defaultLetter } from "./components/ComposeLetter";
import Envelope from "./components/Envelope";
import Letter from "./components/Letter";
import ShareActions from "./components/ShareActions";

function App() {
  const [step, setStep] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [cursorHearts, setCursorHearts] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [letterData, setLetterData] = useState<LetterData>(() => defaultLetter);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const shared = params.get("letter");

    if (shared) {
      try {
        const decoded = JSON.parse(
          decodeURIComponent(window.atob(shared)),
        ) as Partial<LetterData>;
        setLetterData({ ...defaultLetter, ...decoded });
        params.delete("letter");
        const query = params.toString();
        const newUrl = `${window.location.pathname}${query ? `?${query}` : ""
          }${window.location.hash}`;
        window.history.replaceState({}, "", newUrl);
        return;
      } catch (error) {
        console.error("Failed to decode shared letter", error);
      }
    }

    const stored = window.localStorage.getItem("valentine-letter");
    if (stored) {
      try {
        setLetterData(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse stored letter", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("valentine-letter", JSON.stringify(letterData));
  }, [letterData]);

  const formattedLetter = useMemo(() => {
    const parts = [
      letterData.recipient
        ? `Hey ${letterData.recipient.trim()}!`
        : "Hey there!",
      letterData.opening || defaultLetter.opening,
      letterData.body || defaultLetter.body,
      letterData.signature
        ? `❤️ ${letterData.signature.trim()}`
        : defaultLetter.signature,
    ];

    if (letterData.postscript) parts.push(`P.S. ${letterData.postscript}`);
    if (letterData.sticker) parts.push(letterData.sticker);

    return parts.join("\n\n");
  }, [letterData]);

  const handleNoHover = () => {
    setNoButtonPos({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
    setNoCount((c) => c + 1);
  };

  const handleYesClick = () => {
    setStep(4);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6B1B3D", "#D4698C", "#E8A5B8", "#FFF9F5"],
    });

    const end = Date.now() + 3000;
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#6B1B3D", "#D4698C", "#E8A5B8", "#FFF9F5"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#6B1B3D", "#D4698C", "#E8A5B8", "#FFF9F5"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorHearts((prev) => [
      ...prev.slice(-20),
      {
        id: Date.now() + Math.random(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    ]);
  };

  const getNoButtonText = () => {
    const phrases = [
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
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 sm:w-96 sm:h-96 bg-blush/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 sm:w-80 sm:h-80 bg-soft-blush/30 rounded-full blur-3xl" />
        <div className="absolute top-[60%] left-[50%] w-40 h-40 sm:w-64 sm:h-64 bg-deep-rose/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {/* Step 0: Compose Letter */}
          {step === 0 && (
            <ComposeLetter
              key="compose"
              data={letterData}
              onChange={setLetterData}
              onSeal={() => setStep(1)}
            />
          )}

          {/* Step 1: Envelope */}
          {step === 1 && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex items-center justify-center"
            >
              <Envelope onOpen={() => setStep(2)} />
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
                  {getNoButtonText()}
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

              <ShareActions
                letterText={formattedLetter}
                data={letterData}
                onEdit={() => {
                  setStep(0);
                  setNoCount(0);
                  setNoButtonPos({ x: 0, y: 0 });
                }}
                className="w-full"
              />

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => {
                  setStep(0);
                  setNoCount(0);
                  setNoButtonPos({ x: 0, y: 0 });
                }}
                className="text-burgundy hover:text-deep-rose font-semibold underline underline-offset-4 decoration-burgundy/30 hover:decoration-deep-rose/50 transition-colors text-sm sm:text-base"
              >
                Create another letter
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
