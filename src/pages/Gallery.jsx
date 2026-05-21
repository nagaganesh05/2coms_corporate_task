import { useState } from "react";
import { Image as ImageIcon, Film, Play } from "lucide-react";
import useStore from "../store/useStore";
import Modal from "../components/common/Modal";
import Tag from "../components/common/Tag";
import { cn } from "../lib/utils";

function Gallery() {
  const photos = useStore((s) => s.galleryPhotos);
  const videos = useStore((s) => s.galleryVideos);
  const [tab, setTab] = useState("photos");
  const [active, setActive] = useState(null);

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
        <div className="inline-flex bg-ink-100 dark:bg-ink-800 rounded-xl p-1 text-sm">
          {[
            { id: "photos", label: "Photos", icon: ImageIcon },
            { id: "videos", label: "Videos", icon: Film },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-1.5",
                tab === id
                  ? "bg-white dark:bg-ink-900 shadow-sm"
                  : "text-ink-500",
              )}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "photos" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive({ kind: "photo", item: p })}
              className="group relative rounded-2xl overflow-hidden aspect-square card-hover"
            >
              <img
                src={p.url}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <div className="text-left">
                  <p className="text-white font-semibold text-sm leading-tight">
                    {p.title}
                  </p>
                  <p className="text-white/80 text-[11px]">{p.event}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive({ kind: "video", item: v })}
              className="card overflow-hidden card-hover text-left"
            >
              <div className="relative aspect-video">
                <img
                  src={v.thumb}
                  alt={v.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center">
                    <Play size={22} className="text-brand-700 ml-1" />
                  </div>
                </div>
                <Tag tone="ghost" className="!absolute top-3 right-3 !bg-black/50 !text-white !border-white/20">
                  {v.duration}
                </Tag>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm">{v.title}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.item?.title || ""}
        size="lg"
      >
        {active?.kind === "photo" && (
          <img
            src={active.item.url}
            alt={active.item.title}
            className="w-full max-h-[70vh] object-contain rounded-xl bg-ink-100 dark:bg-ink-950"
          />
        )}
        {active?.kind === "video" && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-950">
            <img
              src={active.item.thumb}
              alt={active.item.title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <Play size={48} />
              <p className="text-sm">Video player placeholder · {active.item.duration}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Gallery;
