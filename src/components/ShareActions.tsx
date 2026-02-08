import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { buildRecipientUrl, buildStatusUrl } from "../lib/url";

interface ShareActionsProps {
  letterText: string;
  letterId?: string | null;
  senderToken?: string | null;
  isSaving?: boolean;
  onEdit: () => void;
  className?: string;
}

export default function ShareActions({
  letterText,
  letterId,
  senderToken,
  isSaving,
  onEdit,
  className,
}: ShareActionsProps): ReactNode {
  const [shared, setShared] = useState(false);
  const [statusCopied, setStatusCopied] = useState(false);

  const sharePayload = letterId ? buildRecipientUrl(letterId) : "";

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

  const handleCopyStatusLink = useCallback(async () => {
    if (!senderToken || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(buildStatusUrl(senderToken));
      setStatusCopied(true);
      setTimeout(() => setStatusCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [senderToken]);

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
        disabled={isSaving || !letterId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={!isSaving && letterId ? { y: -2 } : {}}
        whileTap={!isSaving && letterId ? { scale: 0.98 } : {}}
        className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              ⏳
            </motion.span>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <span>{shared ? "✓" : "🔗"}</span>
            <span>{shared ? "Link Copied!" : "Share with Your Valentine"}</span>
          </>
        )}
      </motion.button>

      {/* Status link section */}
      {senderToken && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-burgundy/10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-deep-rose mb-1">
            Your Private Status Link
          </p>
          <p className="text-soft-ink text-sm mb-3">
            Bookmark this to check if they responded:
          </p>
          <motion.button
            onClick={handleCopyStatusLink}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 sm:py-3 rounded-md border-2 border-burgundy/20 text-burgundy font-semibold bg-white/50 hover:bg-white/80 hover:border-burgundy/30 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>{statusCopied ? "✓" : "📋"}</span>
            <span>
              {statusCopied ? "Copied!" : "Copy Status Link"}
            </span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
