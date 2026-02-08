import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { LetterRow } from "../lib/api";
import { fetchStatus } from "../lib/api";
import { fireCelebrationConfetti } from "../lib/confetti";
import { buildRecipientUrl } from "../lib/url";
import BlurText from "./BlurText";

interface StatusPageProps {
  senderToken: string;
}

interface StatusInfo {
  emoji: string;
  label: string;
  color: string;
}

function getStatusInfo(letter: LetterRow): StatusInfo {
  if (letter.response === "yes") {
    return { emoji: "💖", label: "It's a match! They said yes", color: "text-deep-rose" };
  }
  if (letter.response === "no") {
    return { emoji: "💔", label: "They said no...", color: "text-soft-ink" };
  }
  if (letter.opened_at) {
    return { emoji: "👀", label: "Opened, awaiting response...", color: "text-burgundy" };
  }
  return { emoji: "✉️", label: "Not yet opened", color: "text-soft-ink" };
}

export default function StatusPage({ senderToken }: StatusPageProps): ReactNode {
  const [letter, setLetter] = useState<LetterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const celebratedRef = useRef(false);

  const load = useCallback(async () => {
    const row = await fetchStatus(senderToken);
    if (row) {
      setLetter(row);
      setError(false);
      if (row.response === "yes" && !celebratedRef.current) {
        celebratedRef.current = true;
        fireCelebrationConfetti();
      }
    } else {
      setError(true);
    }
    setLoading(false);
  }, [senderToken]);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-poll every 10s while tab is visible
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    function start(): void {
      interval = setInterval(load, 10_000);
    }
    function stop(): void {
      clearInterval(interval);
    }

    function onVisibility(): void {
      stop();
      if (document.visibilityState === "visible") {
        load();
        start();
      }
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  async function handleCopyLink(): Promise<void> {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(buildRecipientUrl(letter.id));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
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
    );
  }

  if (error || !letter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <div className="love-card love-card--frosted p-6 sm:p-8 max-w-md w-full text-center">
          <p className="text-4xl mb-4">😢</p>
          <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">
            Letter Not Found
          </h2>
          <p className="text-soft-ink mb-4">
            We couldn't find a letter with this status link.
          </p>
          <Link
            to="/"
            className="btn-primary inline-block px-6 py-3"
          >
            Create Your Own
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(letter);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 py-6 sm:py-8 gap-4 sm:gap-6 max-w-lg w-full mx-auto">
      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="love-card love-card--frosted love-card--elevated p-5 sm:p-6 md:p-8 w-full text-center relative"
      >
        <div className="absolute top-3 left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-burgundy/15" />
        <div className="absolute top-3 right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2 border-burgundy/15" />
        <div className="absolute bottom-3 left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2 border-burgundy/15" />
        <div className="absolute bottom-3 right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-burgundy/15" />

        <motion.div
          className="text-5xl sm:text-6xl mb-3"
          animate={
            letter.response === "yes"
              ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }
              : { scale: [1, 1.1, 1] }
          }
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {statusInfo.emoji}
        </motion.div>

        <BlurText
          text={statusInfo.label}
          className={`font-serif text-xl sm:text-2xl md:text-3xl font-bold ${statusInfo.color} mb-2 justify-center`}
          delay={80}
          animateBy="words"
        />

        <motion.button
          onClick={load}
          className="mt-3 text-sm text-burgundy hover:text-deep-rose font-semibold underline underline-offset-4 decoration-burgundy/30 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          Refresh status
        </motion.button>
      </motion.div>

      {/* Letter preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="love-panel love-panel--ink p-4 sm:p-6 paper-texture w-full"
      >
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-burgundy mb-3">
          Your Letter
        </h3>
        <div className="font-handwriting text-lg sm:text-xl text-soft-ink leading-relaxed whitespace-pre-line">
          {letter.recipient
            ? `Hey ${letter.recipient.trim()}!`
            : "Hey there!"}
          {"\n\n"}
          {letter.opening}
          {"\n\n"}
          {letter.body}
          {"\n\n"}
          <span className="text-deep-rose">
            {letter.signature
              ? `❤️ ${letter.signature.trim()}`
              : "Your secret admirer"}
          </span>
          {letter.postscript ? `\n\nP.S. ${letter.postscript}` : ""}
        </div>
      </motion.div>

      {/* Recipient link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="love-panel p-4 sm:p-5 w-full"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-deep-rose mb-2">
          Recipient Link
        </p>
        <p className="text-soft-ink text-sm mb-3">
          Share this link with your Valentine:
        </p>
        <motion.button
          onClick={handleCopyLink}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{copied ? "✓" : "🔗"}</span>
          <span>{copied ? "Copied!" : "Copy Recipient Link"}</span>
        </motion.button>
      </motion.div>

      <Link
        to="/"
        className="text-burgundy hover:text-deep-rose font-semibold underline underline-offset-4 decoration-burgundy/30 hover:decoration-deep-rose/50 transition-colors text-sm sm:text-base"
      >
        Create another letter
      </Link>
    </div>
  );
}
