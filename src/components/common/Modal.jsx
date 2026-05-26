import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

// Modal that always lets you read every line of content, no matter how
// tall the content or how small the screen.
//
// Strategy: instead of trying to scroll *inside* the modal panel
// (the flex + min-h-0 + overflow-y-auto pattern, which is fragile and
// often gets shadowed by parent constraints), we make the entire
// modal-and-backdrop layer scrollable. The panel just sits inside a
// vertically-scrollable fixed wrapper. When content is short the panel
// is centered; when it's tall, the user scrolls naturally and the whole
// panel moves up/down. This is the same pattern Tailwind UI, Stripe,
// and Linear use.

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          // The backdrop IS the scroll container.
          // - fixed inset-0 → covers the viewport
          // - overflow-y-auto → vertical scroll when content is tall
          // - overscroll-contain → scroll stays inside this container
          // - p-3 sm:p-6 → breathing room around the panel
          // - flex items-start sm:items-center justify-center →
          //     panel is centered when short, top-anchored when tall
          //     (so a tall panel doesn't get hidden above the fold)
          className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm overflow-y-auto overscroll-contain flex items-start sm:items-center justify-center p-3 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={
              "relative w-full bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-100 dark:border-ink-800 my-auto " +
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

            {/* Body — natural height, the outer wrapper handles scroll */}
            <div className="p-4 sm:p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
