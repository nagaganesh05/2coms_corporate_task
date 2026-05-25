import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

// Modal that always lets you read every line of content, no matter how
// tall the content or how small the screen.
//
// Strategy: separate the SCROLL container from the FLEX-CENTERING
// container.
//
//   Layer 1 (outer):  fixed inset-0 + overflow-y-auto   ← scrolls
//   Layer 2 (inner):  flex min-h-full items-center      ← centers
//   Layer 3 (panel):  natural height, no overflow       ← content
//
// Why this is bulletproof: when the panel is shorter than the viewport,
// `min-h-full` makes the centering wrapper exactly viewport-height, so
// `items-center` centers the panel. When the panel is TALLER than the
// viewport, the centering wrapper grows with the content (because of
// `min-h-full`, not `h-full`), pushing the panel above the fold; the
// OUTER container then scrolls naturally — the user can reach every
// pixel from the very top of the panel to the very bottom.
//
// The previous version put `overflow-y-auto` and `flex items-center`
// on the SAME element, which centered the panel above the scroll
// origin when content was tall — making the top of the modal
// unreachable. This is the canonical Headless UI / Tailwind UI pattern.

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
        // Layer 1 — backdrop AND scroll container.
        // Only fade-animated; layout is handled by the inner wrapper.
        // overscroll-contain keeps the page underneath from scrolling
        // when the user reaches the modal's edges.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm overflow-y-auto overscroll-contain"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/*
            Layer 2 — flex centering wrapper.
            min-h-full guarantees the wrapper is at LEAST as tall as the
            scroll container, so a short panel is centered. When the panel
            is taller than the viewport, this wrapper grows with the
            content and the OUTER container scrolls — meaning the user
            can scroll all the way to the top of the panel. This is the
            same pattern Headless UI / Tailwind UI use.
          */}
          <div className="flex min-h-full items-start sm:items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={
                "relative w-full bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-100 dark:border-ink-800 " +
                (widths[size] || widths.md)
              }
            >
              {/* Header — sticky so it stays visible while the modal scrolls */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-t-2xl">
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

              {/* Body — natural height, the outer container handles scroll */}
              <div className="p-4 sm:p-5">{children}</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
