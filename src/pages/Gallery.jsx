import { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Film, Play } from "lucide-react";
import useStore from "../store/useStore";
import GalleryLightbox from "../components/widgets/GalleryLightbox";
import Tag from "../components/common/Tag";
import { cn } from "../lib/utils";

// Stagger children so the grid feels alive on first render and tab switch.
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

function Gallery() {
  const photos = useStore((s) => s.galleryPhotos);
  const videos = useStore((s) => s.galleryVideos);
  const [tab, setTab] = useState("photos");
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const items = tab === "photos" ? photos : videos;

  function open(index) {
    setLightbox({ open: true, index });
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
            Office gallery
          </h1>
          <p className="muted text-sm">
            Photos and videos from events and celebrations across the company.
          </p>
        </div>

        {/* Animated tab switcher with sliding pill background */}
        <div className="inline-flex relative bg-ink-100 dark:bg-ink-800 rounded-xl p-1 text-sm">
          {[
            { id: "photos", label: "Photos", icon: ImageIcon, count: photos.length },
            { id: "videos", label: "Videos", icon: Film, count: videos.length },
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="relative px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-1.5 z-10"
            >
              {tab === id && (
                <motion.span
                  layoutId="gallery-tab-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-white dark:bg-ink-900 rounded-lg shadow-sm"
                />
              )}
              <span
                className={cn(
                  "relative inline-flex items-center gap-1.5",
                  tab === id ? "text-ink-900 dark:text-ink-100" : "text-ink-500",
                )}
              >
                <Icon size={14} /> {label}
                <span className="text-[10px] muted tabular-nums">{count}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {tab === "photos" ? (
        <motion.div
          key="photos-grid"
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {photos.map((p, i) => (
            <motion.button
              key={p.id}
              variants={tileVariants}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              onClick={() => open(i)}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-card hover:shadow-card-hover"
            >
              <img
                src={p.url}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                <div className="text-left">
                  <p className="text-white font-semibold text-sm leading-tight">
                    {p.title}
                  </p>
                  <p className="text-white/80 text-[11px]">{p.event}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="videos-grid"
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {videos.map((v, i) => (
            <motion.button
              key={v.id}
              variants={tileVariants}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              onClick={() => open(i)}
              className="card overflow-hidden text-left shadow-card hover:shadow-card-hover"
            >
              <div className="relative aspect-video group">
                <img
                  src={v.thumb}
                  alt={v.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Play size={22} className="text-brand-700 ml-1" />
                  </div>
                </div>
                <Tag
                  tone="ghost"
                  className="!absolute top-3 right-3 !bg-black/55 !text-white !border-white/20 backdrop-blur"
                >
                  {v.duration}
                </Tag>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm">{v.title}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      <GalleryLightbox
        open={lightbox.open}
        items={items}
        kind={tab === "photos" ? "photo" : "video"}
        startIndex={lightbox.index}
        onClose={() => setLightbox({ open: false, index: 0 })}
      />
    </div>
  );
}

export default Gallery;
