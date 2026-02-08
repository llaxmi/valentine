import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LetterData } from "../components/ComposeLetter";
import ComposeLetter, { defaultLetter } from "../components/ComposeLetter";
import Envelope from "../components/Envelope";
import Letter from "../components/Letter";
import PageShell from "../components/PageShell";
import ShareActions from "../components/ShareActions";
import { saveLetter } from "../lib/api";
import { formatLetter } from "../lib/letter";

export default function ComposePage(): ReactNode {
  const [step, setStep] = useState(0);
  const [letterData, setLetterData] = useState<LetterData>(() => {
    const stored = window.localStorage.getItem("valentine-letter");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return defaultLetter;
  });

  const [letterId, setLetterId] = useState<string | null>(null);
  const [senderToken, setSenderToken] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      "valentine-letter",
      JSON.stringify(letterData),
    );
  }, [letterData]);

  const formattedLetter = useMemo(
    () => formatLetter(letterData),
    [letterData],
  );

  const handleSeal = useCallback(async () => {
    setStep(1);
    setLetterId(null);
    setSenderToken(null);
    setSaveError(false);
    setIsSaving(true);
    const result = await saveLetter(letterData);
    if (result) {
      setLetterId(result.id);
      setSenderToken(result.senderToken);
    } else {
      setSaveError(true);
    }
    setIsSaving(false);
  }, [letterData]);

  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <ComposeLetter
              key="compose"
              data={letterData}
              onChange={setLetterData}
              onSeal={handleSeal}
            />
          )}

          {step === 1 && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex items-center justify-center"
            >
              <Envelope onOpen={() => setStep(2)} variant="sender" />
            </motion.div>
          )}

          {step === 2 && (
            <Letter
              key="letter"
              text={formattedLetter}
              onNext={() => setStep(3)}
              buttonLabel="Looks good! Share it ✉️"
            />
          )}

          {step === 3 && (
            <div key="share" className="flex flex-col items-center gap-4 sm:gap-6 max-w-lg w-full mx-3 sm:mx-4 px-1">
              {saveError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="love-panel p-4 w-full text-center border-2 border-deep-rose/30"
                >
                  <p className="text-deep-rose font-semibold mb-2">
                    Could not save your letter
                  </p>
                  <p className="text-soft-ink text-sm mb-3">
                    Check your connection and try again.
                  </p>
                  <motion.button
                    onClick={async () => {
                      setSaveError(false);
                      setIsSaving(true);
                      const result = await saveLetter(letterData);
                      if (result) {
                        setLetterId(result.id);
                        setSenderToken(result.senderToken);
                      } else {
                        setSaveError(true);
                      }
                      setIsSaving(false);
                    }}
                    className="btn-primary px-6 py-2 text-sm"
                    whileTap={{ scale: 0.98 }}
                  >
                    Retry
                  </motion.button>
                </motion.div>
              )}
              <ShareActions
                letterText={formattedLetter}
                letterId={letterId}
                senderToken={senderToken}
                isSaving={isSaving}
                onEdit={() => setStep(0)}
                className="w-full"
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
