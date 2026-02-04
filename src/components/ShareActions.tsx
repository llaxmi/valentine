import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import type { LetterData } from "./ComposeLetter";

interface ShareActionsProps {
  letterText: string;
  data: LetterData;
  onEdit: () => void;
  className?: string;
}

const ShareActions = ({
  letterText,
  data,
  onEdit,
  className,
}: ShareActionsProps) => {
  const [shared, setShared] = useState(false);

  const sharePayload = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const encoded = window.btoa(encodeURIComponent(JSON.stringify(data)));
      const url = new URL(window.location.href);
      url.searchParams.set("letter", encoded);
      return url.toString();
    } catch (error) {
      console.error("Failed to generate share payload", error);
      return window.location.href;
    }
  }, [data]);

  const handleShare = useCallback(async () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Valentine Letter",
          text: letterText,
          url: sharePayload,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Web Share failed", error);
      }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(sharePayload);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        console.error("Fallback share copy failed", error);
      }
    }
  }, [letterText, sharePayload]);

  return (
    <motion.div
      className={`love-panel p-4 sm:p-5 md:p-6 relative overflow-hidden ${className ?? ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-soft-blush/50 to-transparent transform rotate-45 translate-x-8 -translate-y-8" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-5 relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-deep-rose mb-1">
            Share the Love
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
            Send This Letter
          </h3>
        </div>
        <motion.button
          onClick={onEdit}
          className="text-sm font-semibold text-burgundy hover:text-deep-rose transition-colors underline underline-offset-4 decoration-burgundy/30 hover:decoration-deep-rose/50"
          whileHover={{ x: 2 }}
        >
          Edit letter →
        </motion.button>
      </div>

      <motion.button
        onClick={handleShare}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2"
      >
        <span>{shared ? "✓" : "🔗"}</span>
        <span>{shared ? "Link Copied!" : "Share with Your Valentine"}</span>
      </motion.button>
    </motion.div>
  );
};

export default ShareActions;
