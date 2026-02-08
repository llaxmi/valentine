import confetti from "canvas-confetti";

export const CONFETTI_COLORS = ["#6B1B3D", "#D4698C", "#E8A5B8", "#FFF9F5"];

export function fireCelebrationConfetti(): void {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: CONFETTI_COLORS,
  });

  const end = Date.now() + 3000;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: CONFETTI_COLORS,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: CONFETTI_COLORS,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
