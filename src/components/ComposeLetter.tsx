import { motion } from "framer-motion";
import type { ChangeEvent } from "react";
import { useMemo } from "react";

export interface LetterData {
  recipient: string;
  opening: string;
  body: string;
  signature: string;
  postscript: string;
  sticker: string;
  tone: number;
}

export const defaultLetter: LetterData = {
  recipient: "",
  opening:
    "I've been wanting to ask you something special for a while now. You make every day brighter and I love spending time with you.",
  body:
    "Being with you feels like sunshine and cotton candy all at once. I can't help but smile every time I think of you, and I hope this little note makes you smile too.",
  signature: "Your secret admirer",
  postscript: "Also, I saved you the last piece of chocolate.",
  sticker: "💌",
  tone: 70,
};

interface ComposeLetterProps {
  data: LetterData;
  onChange: (data: LetterData) => void;
  onSeal: () => void;
}

const stickers = ["💌", "🌹", "🐻", "🍓", "🧸", "🎈", "💫", "🎀"];

const getToneLabel = (tone: number) => {
  if (tone < 25) return "Playful";
  if (tone < 50) return "Sweet";
  if (tone < 75) return "Melted";
  return "Hopeless romantic";
};

const ComposeLetter = ({ data, onChange, onSeal }: ComposeLetterProps) => {
  const toneLabel = useMemo(() => getToneLabel(data.tone), [data.tone]);

  const handleInput = (
    field: keyof LetterData,
    value: string | number,
  ) => {
    onChange({ ...data, [field]: value } as LetterData);
  };

  const handleTextArea = (
    event: ChangeEvent<HTMLTextAreaElement>,
    field: keyof LetterData,
  ) => {
    handleInput(field, event.target.value);
  };

  const bodyCount = `${data.body.length}/600`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="love-card love-card--frosted love-card--elevated w-full max-w-5xl mx-3 sm:mx-4 p-4 sm:p-6 md:p-8 lg:p-10 relative"
    >
      {/* Decorative corner flourishes */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-burgundy/20 rounded-tl-sm" />
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-burgundy/20 rounded-tr-sm" />
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-b-2 border-burgundy/20 rounded-bl-sm" />
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-burgundy/20 rounded-br-sm" />

      {/* Header */}
      <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-center relative z-10 pt-3">
        <motion.div
          className="text-4xl sm:text-5xl"
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {data.sticker || "💌"}
        </motion.div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-burgundy tracking-tight">
          Craft Your Love Note
        </h2>
        <p className="text-soft-ink text-sm sm:text-base max-w-md px-2">
          Pour your heart onto paper. Every word becomes a treasure.
        </p>
        <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-deep-rose/40 to-transparent mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 relative z-10">
        {/* Form Section */}
        <div className="space-y-4 sm:space-y-5 order-2 lg:order-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-burgundy mb-2">
              To, My Dearest
            </label>
            <input
              className="love-input"
              placeholder="Their name..."
              value={data.recipient}
              onChange={(e) => handleInput("recipient", e.target.value)}
              maxLength={40}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-burgundy mb-2">
              Opening Words
            </label>
            <textarea
              className="love-textarea"
              rows={3}
              value={data.opening}
              onChange={(event) => handleTextArea(event, "opening")}
              maxLength={200}
              placeholder="Begin your confession..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-burgundy">
                The Heart of It
              </label>
              <span className="text-xs text-soft-ink/60 font-medium tabular-nums">{bodyCount}</span>
            </div>
            <textarea
              className="love-textarea min-h-[140px] sm:min-h-[160px]"
              value={data.body}
              onChange={(event) => handleTextArea(event, "body")}
              maxLength={600}
              placeholder="Let your feelings flow..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-burgundy mb-2">
                Signed With Love
              </label>
              <input
                className="love-input"
                placeholder="Your name..."
                value={data.signature}
                onChange={(e) => handleInput("signature", e.target.value)}
                maxLength={40}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-burgundy mb-2">
                P.S.
              </label>
              <input
                className="love-input"
                placeholder="One more thing..."
                value={data.postscript}
                onChange={(e) => handleInput("postscript", e.target.value)}
                maxLength={120}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-burgundy mb-3">
              Seal With
            </label>
            <div className="flex flex-wrap gap-2">
              {stickers.map((sticker, idx) => (
                <motion.button
                  key={sticker}
                  type="button"
                  onClick={() => handleInput("sticker", sticker)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`love-chip text-lg sm:text-xl px-3 sm:px-4 ${data.sticker === sticker ? "is-active" : ""
                    }`}
                >
                  {sticker}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="love-panel love-panel--ink p-4 sm:p-6 flex flex-col paper-texture order-1 lg:order-2 min-h-[280px] sm:min-h-[320px]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-burgundy">
              Preview
            </h3>
            <motion.span
              className="text-xl sm:text-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {data.sticker || "💌"}
            </motion.span>
          </div>

          <div className="relative flex-1 overflow-y-auto">
            <div className="font-handwriting text-xl sm:text-2xl text-soft-ink leading-relaxed whitespace-pre-line">
              {data.recipient ? `Hey ${data.recipient}!` : "Hey there!"}

              {"\n\n"}
              {data.opening || defaultLetter.opening}

              {"\n\n"}
              {data.body || defaultLetter.body}

              {"\n\n"}
              <span className="text-deep-rose">
                {data.signature ? `❤️ ${data.signature}` : defaultLetter.signature}
              </span>

              {data.postscript ? `\n\nP.S. ${data.postscript}` : ""}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
            <motion.button
              type="button"
              onClick={onSeal}
              className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Seal & Send ✉️
            </motion.button>
            <button
              type="button"
              onClick={() => onChange(defaultLetter)}
              className="w-full py-2.5 sm:py-3 rounded-md border-2 border-burgundy/20 text-burgundy font-semibold bg-white/50 hover:bg-white/80 hover:border-burgundy/30 transition-all text-sm sm:text-base"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComposeLetter;
