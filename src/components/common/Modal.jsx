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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Backdrop. No overflow-y-auto here — the panel handles its own
          // internal scroll. Letting the backdrop scroll would let the
          // modal panel scroll out of sight.
          className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18 }}
            // The panel itself is a flex column with a hard max-height.
            // The body inside is the only thing allowed to scroll.
            className={
              "card w-full bg-white dark:bg-ink-900 flex flex-col rounded-t-2xl sm:rounded-2xl max-h-[100vh] sm:max-h-[calc(100vh-2rem)] overflow-hidden " +
              (widths[size] || widths.md)
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — fixed, never scrolls */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-ink-100 dark:border-ink-800 shrink-0">
              <h2 className="font-display font-bold text-base sm:text-lg text-ink-900 dark:text-ink-100 truncate pr-3">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body — flex-1 + min-h-0 is the magic combo that lets a
                flex child shrink below its content size so the
                overflow-y-auto actually clips and scrolls. Without
                min-h-0 the child grows to fit its content and overflow
                has nothing to do. */}
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
