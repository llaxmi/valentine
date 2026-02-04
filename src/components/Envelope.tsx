import { motion } from "framer-motion";
import { useState } from "react";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] cursor-pointer px-4 w-full"
      onClick={handleOpen}
    >
      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl opacity-15"
            style={{ left: `${15 + i * 18}%` }}
            initial={{ top: "105%" }}
            animate={{ top: "-5%" }}
            transition={{
              duration: 14 + i * 3,
              repeat: Infinity,
              delay: i * 2.5,
              ease: "linear",
            }}
          >
            {["💕", "💗", "💓", "💖", "💝"][i]}
          </motion.div>
        ))}
      </div>

      {/* Envelope container */}
      <div className="relative z-10">
        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-burgundy/10 blur-xl rounded-full" />

        <motion.div
          className="relative w-64 h-48 rounded-lg shadow-xl"
          whileHover={!isOpen ? { scale: 1.02, y: -4 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Envelope body/back */}
          <div className="absolute inset-0 bg-[#C9908A] rounded-lg" />

          {/* Flap (top triangle pointing down) - z-30 to be above letter */}
          <motion.div
            className="absolute z-30 top-0 rounded-lg left-0 w-full origin-top"
            style={{
              height: 40,
              borderLeft: "128px solid transparent",
              borderRight: "128px solid transparent",
              borderTop: "96px solid #BF8680",
            }}
            animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Letter inside */}
          <motion.div
            className="absolute inset-4 bg-white rounded shadow-sm z-10 flex items-center justify-center"
            animate={isOpen ? { y: -140, opacity: 0 } : { y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >

          </motion.div>

          {/* Front pocket - Left */}
          <div
            className="absolute bottom-0 left-0 w-0 h-0 z-20"
            style={{
              borderBottom: "186px solid #BF8680",
              borderRight: "200px solid transparent",
            }}
          />

          {/* Front pocket - Right */}
          <div
            className="absolute bottom-0 right-0 w-0 h-0 z-20"
            style={{
              borderBottom: "186px solid #c9908a ",
              borderLeft: "200px solid transparent",
            }}
          />


        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        className="mt-10 text-center z-10"
        animate={isOpen ? { opacity: 0, y: 10 } : { opacity: 1 }}
      >
        <motion.p
          className="font-serif text-xl sm:text-2xl text-burgundy font-semibold"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Tap to break the seal
        </motion.p>
        <p className="text-soft-ink/50 text-sm mt-2">A love letter awaits...</p>
      </motion.div>
    </motion.div>
  );
};

export default Envelope;
