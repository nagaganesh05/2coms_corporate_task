import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useId, useRef } from "react";

// Modal whose PANEL stays anchored on the screen — only the BODY inside
// it scrolls. Single scroll container *inside* the panel:
//
//   Layer 1 (outer):  fixed inset-0 + flex items-center           ← centers, no scroll
//   Layer 2 (panel):  flex flex-col + max-h-full + overflow-hidden ← bounded box
//     ├─ header:  shrink-0 (always visible, never moves)
//     └─ body:    flex-1 min-h-0 overflow-y-auto (scrolls internally)
//
// In addition to the layout fix the component handles:
//   • Focus trap (Tab / Shift+Tab cycle inside the panel)
//   • Focus restoration (focus returns to the trigger when the modal closes)
//   • aria-labelledby wired to the title <h2>
//   • Mouse-down + mouse-up backdrop guard so dragging text out of the
//     panel never accidentally closes the modal
//   • Scrollbar-gutter compensation so the page underneath doesn't
//     jump right when scroll-lock kicks in
//   • 100dvh max-height (dynamic viewport) for iOS Safari URL-bar safety

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusable(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null,
  );
}

function Modal({ open, onClose, title, children, size = "md" }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  // Tracks whether the most recent mousedown happened on the backdrop.
  // Without this guard, dragging a text selection out of the panel and
  // releasing on the backdrop closes the modal — surprising behaviour.
  const mouseDownOnBackdrop = useRef(false);

  // Keyboard: Escape closes, Tab traps focus inside the panel.
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable(panelRef.current);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll-lock (with scrollbar-gutter compensation to prevent
  // the layout-shift "jump" when the scrollbar disappears).
  useEffect(() => {
    if (!open) return undefined;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Focus management: remember the trigger, focus the panel on open,
  // restore focus to the trigger on close.
  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = document.activeElement;
    // Defer one frame so the panel is mounted before we focus it.
    const id = window.requestAnimationFrame(() => {
      const items = getFocusable(panelRef.current);
      // Prefer the first interactive thing INSIDE the body — falling
      // back to the close button — falling back to the panel itself.
      const target =
        items.find(
          (el) => el !== panelRef.current?.querySelector('[data-modal-close="true"]'),
        ) || items[0] || panelRef.current;
      target?.focus?.({ preventScroll: true });
    });
    return () => {
      window.cancelAnimationFrame(id);
      const trigger = previouslyFocused.current;
      if (trigger && typeof trigger.focus === "function") {
        // Restore focus on the next tick so the modal has fully unmounted.
        setTimeout(() => trigger.focus({ preventScroll: true }), 0);
      }
    };
  }, [open]);

  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  function handleBackdropMouseDown(e) {
    mouseDownOnBackdrop.current = e.target === e.currentTarget;
  }
  function handleBackdropMouseUp(e) {
    if (mouseDownOnBackdrop.current && e.target === e.currentTarget) {
      onClose?.();
    }
    mouseDownOnBackdrop.current = false;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overscroll-contain"
          onMouseDown={handleBackdropMouseDown}
          onMouseUp={handleBackdropMouseUp}
          aria-modal="true"
          role="dialog"
          aria-labelledby={titleId}
        >
          <motion.div
            ref={panelRef}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            // Stop click bubbling so a click inside the panel never closes
            // the modal even if it would otherwise reach the backdrop.
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            tabIndex={-1}
            // 100dvh keeps the panel within the visible viewport on iOS
            // Safari even when the URL bar collapses.
            style={{ maxHeight: "calc(100dvh - 2rem)" }}
            className={
              "relative w-full flex flex-col overflow-hidden bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-100 dark:border-ink-800 outline-none " +
              (widths[size] || widths.md)
            }
          >
            <div className="shrink-0 flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-t-2xl">
              <h2
                id={titleId}
                className="font-display font-bold text-base sm:text-lg text-ink-900 dark:text-ink-100 truncate"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                data-modal-close="true"
                className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

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
