import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { cn } from "../../lib/utils";

// A full-bleed gallery lightbox with side navigators, keyboard arrows,
// touch/swipe (via Framer Motion drag), a thumbnail strip, and tasteful
// directional slide animations between items. Used by the Gallery page.

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  }),
};

function GalleryLightbox({ open, items, kind, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0);
  const [lastOpen, setLastOpen] = useState(open);

  // Reset to the requested start index when the lightbox opens.
  // Using the "adjust state during render" pattern (React docs recommend this
  // over an effect, and our react-hooks/set-state-in-effect lint enforces it).
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setIndex(startIndex);
      setDirection(0);
    }
  }

  const goTo = useCallback(
    (next) => {
      if (!items?.length) return;
      const total = items.length;
      const target = ((next % total) + total) % total;
      setDirection(target === index ? 0 : target > index ? 1 : -1);
      setIndex(target);
    },
    [items, index],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, next, prev, onClose]);

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const item = items?.[index];

  // Preload neighbors to keep transitions smooth
  useEffect(() => {
    if (!open || !items?.length || kind !== "photo") return;
    const neighborIndexes = [index + 1, index - 1].map(
      (i) => ((i % items.length) + items.length) % items.length,
    );
    neighborIndexes.forEach((i) => {
      const img = new Image();
      img.src = items[i].url;
    });
  }, [open, items, index, kind]);

  const KindBadge = useMemo(() => (kind === "video" ? Film : ImageIcon), [kind]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col"
          onClick={onClose}
        >
          {/* Top bar */}
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <KindBadge size={16} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-base truncate">
                  {item.title}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {item.event || (kind === "video" ? `${item.duration}` : "")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex text-xs tabular-nums text-white/80 bg-white/10 backdrop-blur rounded-full px-3 py-1">
                {index + 1} / {items.length}
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur transition"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>

          {/* Stage */}
          <div
            className="relative flex-1 flex items-center justify-center px-2 sm:px-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev */}
            {items.length > 1 && (
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition shadow-lg"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div className="relative w-full h-full max-w-[1200px] flex items-center justify-center overflow-hidden">
              <AnimatePresence custom={direction} initial={false} mode="popLayout">
                <motion.div
                  key={item.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80 || info.velocity.x < -400) next();
                    else if (info.offset.x > 80 || info.velocity.x > 400) prev();
                  }}
                  className="w-full h-full max-h-[78vh] flex items-center justify-center select-none"
                >
                  {kind === "photo" ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      draggable={false}
                      className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl pointer-events-none"
                    />
                  ) : (
                    <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={item.thumb}
                        alt={item.title}
                        draggable={false}
                        className="w-full h-full object-cover opacity-70 pointer-events-none"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                        <motion.div
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl"
                        >
                          <Play size={32} className="text-brand-700 ml-1" />
                        </motion.div>
                        <p className="text-sm">
                          Video preview · {item.duration}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next */}
            {items.length > 1 && (
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition shadow-lg"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {items.length > 1 && (
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="relative z-10 px-4 sm:px-6 pb-5 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 overflow-x-auto no-scrollbar justify-center">
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    onClick={() => goTo(i)}
                    aria-label={`Go to ${it.title}`}
                    className={cn(
                      "shrink-0 relative rounded-lg overflow-hidden border-2 transition w-16 h-12 sm:w-20 sm:h-14",
                      i === index
                        ? "border-white shadow-lg scale-105"
                        : "border-transparent opacity-50 hover:opacity-100",
                    )}
                  >
                    <img
                      src={kind === "video" ? it.thumb : it.url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {kind === "video" && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="sm:hidden text-center text-[11px] text-white/60 mt-2 tabular-nums">
                {index + 1} / {items.length} · swipe to navigate
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GalleryLightbox;
