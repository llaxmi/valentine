import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps): ReactNode {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 sm:w-96 sm:h-96 bg-blush/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 sm:w-80 sm:h-80 bg-soft-blush/30 rounded-full blur-3xl" />
        <div className="absolute top-[60%] left-[50%] w-40 h-40 sm:w-64 sm:h-64 bg-deep-rose/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
