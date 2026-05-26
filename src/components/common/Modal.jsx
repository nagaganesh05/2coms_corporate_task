import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useId, useRef } from "react";

// Modal supports two placements:
//
//   placement="center" (default) — classic centered popup.
//     Outer:  fixed inset-0 + h-[100dvh] + flex items-center
//     Panel:  flex flex-col + max-h-[calc(100dvh-2rem)] + overflow-hidden
//
//   placement="right" — slide-over / drawer from the right edge.
//     Backdrop:  fixed inset-0 (sibling to panel)
//     Panel:     fixed inset-y-0 right-0 + flex flex-col
//                Full viewport height — header + scrollable body + footer.
//                Best for forms with a primary action button: the footer
//                is physically anchored at the bottom of the viewport
//                and cannot scroll out of view at any zoom or window size.
//
// Common behaviour for both placements:
//   • Optional `footer` slot rendered OUTSIDE the scrollable body
//   • Focus trap (Tab / Shift+Tab cycle inside the panel)
//   • Default focus = the close button (avoids mobile-keyboard popup)
//   • Focus restoration to the trigger on close
//   • aria-labelledby wired to the title <h2>
//   • Mouse-down + mouse-up backdrop guard (drag-to-select doesn't close)
//   • Body scroll-lock with scrollbar-gutter compensation

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

const CENTER_WIDTHS = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

const RIGHT_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  footer,
  placement = "center",
}) {
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
      if (
        e.shiftKey &&
        (active === first || !panelRef.current?.contains(active))
      ) {
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
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Focus management: remember the trigger, focus the close button
  // on open, restore focus to the trigger on close.
  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = document.activeElement;
    const id = window.requestAnimationFrame(() => {
      const closeBtn = panelRef.current?.querySelector(
        '[data-modal-close="true"]',
      );
      const target = closeBtn || panelRef.current;
      target?.focus?.({ preventScroll: true });
    });
    return () => {
      window.cancelAnimationFrame(id);
      const trigger = previouslyFocused.current;
      if (trigger && typeof trigger.focus === "function") {
        setTimeout(() => trigger.focus({ preventScroll: true }), 0);
      }
    };
  }, [open]);

  function handleBackdropMouseDown(e) {
    mouseDownOnBackdrop.current = e.target === e.currentTarget;
  }
  function handleBackdropMouseUp(e) {
    if (mouseDownOnBackdrop.current && e.target === e.currentTarget) {
      onClose?.();
    }
    mouseDownOnBackdrop.current = false;
  }

  const isRight = placement === "right";

  // Reusable panel contents (header / body / optional footer).
  const headerEl = (
    <div
      className={
        "shrink-0 flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 " +
        (isRight ? "" : "rounded-t-2xl")
      }
    >
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
  );

  const bodyEl = (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
      {children}
    </div>
  );

  const footerEl = footer ? (
    <div
      className={
        "shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 sm:p-5 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 " +
        (isRight ? "" : "rounded-b-2xl")
      }
    >
      {footer}
    </div>
  ) : null;

  // ─── Right-side drawer ───────────────────────────────────────────────
  if (isRight) {
    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop is a sibling of the drawer panel, not a parent.
                That makes it trivial to anchor the panel to the right
                edge with `fixed right-0` and slide it in. */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm"
              onMouseDown={handleBackdropMouseDown}
              onMouseUp={handleBackdropMouseUp}
              aria-hidden="true"
            />
            <motion.div
              key="panel"
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={
                "fixed inset-y-0 right-0 z-[101] flex flex-col w-full bg-white dark:bg-ink-900 shadow-2xl border-l border-ink-100 dark:border-ink-800 outline-none " +
                (RIGHT_WIDTHS[size] || RIGHT_WIDTHS.md)
              }
            >
              {headerEl}
              {bodyEl}
              {footerEl}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // ─── Centered popup (default) ────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] h-[100dvh] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overscroll-contain"
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
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            tabIndex={-1}
            className={
              "relative w-full flex flex-col overflow-hidden bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-100 dark:border-ink-800 outline-none " +
              "max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] " +
              (CENTER_WIDTHS[size] || CENTER_WIDTHS.md)
            }
          >
            {headerEl}
            {bodyEl}
            {footerEl}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
