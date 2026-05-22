import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock background scroll while open so the page behind doesn't jump.
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
        <>
          {/* Backdrop. Separate from the panel so its animation can't
              interfere with the panel's scroll calculations. Click anywhere
              on the backdrop closes the modal. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm"
          />

          {/* Centering wrapper. pointer-events-none lets clicks fall
              through to the backdrop unless they hit the panel itself. */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className={
                "w-full bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-100 dark:border-ink-800 flex flex-col pointer-events-auto " +
                (widths[size] || widths.md)
              }
              // Inline maxHeight guarantees the height cap regardless of
              // any cascade weirdness — the body's overflow-y-auto needs
              // this hard ceiling to actually clip and scroll.
              // 100dvh = dynamic viewport height (handles mobile URL bar).
              style={{ maxHeight: "calc(100dvh - 1.5rem)" }}
            >
              {/* Header — pinned, never scrolls */}
              <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-ink-100 dark:border-ink-800 flex-shrink-0">
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

              {/* Body — the scroll container.
                  flex-1: take remaining vertical space after the header.
                  inline minHeight: 0: override the default flex-item
                    min-height: auto so the body can actually shrink to
                    the parent's available space (the flexbox-with-overflow
                    gotcha) — using inline style so it can't be purged.
                  overflow-y-auto: vertical scrollbar when content overflows.
                  overscroll-contain: scroll inside the modal stays inside
                    the modal (doesn't bleed to the page). */}
              <div
                className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
                style={{ minHeight: 0 }}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
