import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

// Modal whose PANEL stays anchored on the screen — only the BODY inside
// it scrolls. The previous designs used a scrollable backdrop, which
// works in theory but lets the entire panel slide up/down whenever the
// outer container scrolls (browser zoom, mobile URL-bar resize, sticky
// scrollbar gutters, etc.). Users see this as "the popup is moving".
//
// New strategy — one scroll container only, *inside* the panel:
//
//   Layer 1 (outer):  fixed inset-0 + flex items-center          ← centers, no scroll
//   Layer 2 (panel):  flex flex-col + max-h-full + overflow-hidden ← bounded box
//     ├─ header:  shrink-0 (always visible, never moves)
//     └─ body:    flex-1 min-h-0 overflow-y-auto (scrolls internally)
//
// Why this is bulletproof:
//   • Outer never scrolls because nothing inside it is taller than itself
//     (panel is capped at max-h-full of the available area).
//   • Panel is a flex column; the header takes its natural height and
//     the body fills the rest with `flex-1 min-h-0`. The `min-h-0` is
//     critical — without it, flex items refuse to shrink below their
//     content's intrinsic min size and the body overflows the panel.
//   • Body has its own overflow-y-auto, so long content scrolls
//     internally while the panel — and therefore the popup — stays put.

function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while the modal is open so the page underneath
  // doesn't scroll along with the modal.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <AnimatePresence>
      {open && (
        // Layer 1 — backdrop + centering layer. NO scroll here.
        // The padding gives the panel breathing room from the viewport
        // edges; combined with `max-h-full` on the panel it guarantees
        // the panel never overflows the outer.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overscroll-contain"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Layer 2 — the panel itself. flex-col so header + body stack. */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={
              "relative w-full max-h-full flex flex-col overflow-hidden bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-100 dark:border-ink-800 " +
              (widths[size] || widths.md)
            }
          >
            {/* Header — always visible because it's the first flex child
                and shrink-0 prevents it from collapsing when the body grows. */}
            <div className="shrink-0 flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-t-2xl">
              <h2 className="font-display font-bold text-base sm:text-lg text-ink-900 dark:text-ink-100 truncate">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 flex-shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body — flex-1 fills remaining space; min-h-0 unlocks
                shrinking so overflow-y-auto can actually scroll. */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
