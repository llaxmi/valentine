import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface LetterProps {
  onNext: () => void;
  text: string;
  buttonLabel?: string;
}

export default function Letter({
  onNext,
  text,
  buttonLabel = "Continue to the Question ❤️",
}: LetterProps): ReactNode {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 45);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  const isComplete = index >= text.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg mx-3 sm:mx-4 relative"
    >
      {/* Shadow beneath */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-10 bg-burgundy/8 blur-2xl rounded-full" />

      {/* Main letter card */}
      <div className="love-letter-card paper-texture p-5 sm:p-6 md:p-8 relative overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-burgundy/15" />
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2 border-burgundy/15" />
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2 border-burgundy/15" />
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-burgundy/15" />

        {/* Pin decoration */}
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="relative">
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gradient-to-b from-burgundy/60 to-transparent" />
          </div>
        </motion.div>

        {/* Decorative header line */}
        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4 pt-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-burgundy/20 to-transparent" />
          <span className="text-xl sm:text-2xl">💌</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-burgundy/20 to-transparent" />
        </div>

        {/* Letter content */}
        <div className="min-h-[200px] sm:min-h-[240px] md:min-h-[280px] relative">
          <p className="font-handwriting text-xl sm:text-2xl md:text-[1.65rem] text-soft-ink leading-[1.7] whitespace-pre-wrap">
            {displayedText}
            {!isComplete && (
              <motion.span
                className="inline-block w-0.5 h-5 sm:h-6 bg-deep-rose ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </p>

          {/* Ink blot decoration - appears when complete */}
          {isComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.04 }}
              transition={{ duration: 0.5 }}
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-burgundy blur-sm"
            />
          )}
        </div>

        {/* Continue button */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 sm:mt-8"
          >
            <motion.button
              onClick={onNext}
              className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {buttonLabel}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
