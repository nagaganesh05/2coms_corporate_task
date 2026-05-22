import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Sparkles, Megaphone, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Editorial leadership-vision carousel for the dashboard.
const slides = [
  {
    eyebrow: "Vision 2026",
    title: "Building a culture that compounds",
    subtitle:
      "Three bets — AI-native products, customer obsession, and one-team culture across verticals.",
    icon: Sparkles,
    bg: "from-brand-700 via-brand-600 to-violet-600",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600",
  },
  {
    eyebrow: "Leadership Town Hall",
    title: "May Q&A — what we are doubling down on",
    subtitle:
      "Customer days, listening sessions and shadow programs across every vertical.",
    icon: Megaphone,
    bg: "from-indigo-700 via-indigo-600 to-blue-600",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600",
  },
  {
    eyebrow: "Quarterly OKRs",
    title: "Operational excellence, end to end",
    subtitle: "Reduced incident MTTR by 38% and shipped a public reliability dashboard.",
    icon: Target,
    bg: "from-fuchsia-700 via-violet-600 to-indigo-700",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600",
  },
];

function scrollToLeadership() {
  // The id is set on the LeadershipMessageWidget wrapper in Dashboard.
  const el = document.getElementById("leadership-messages");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="rounded-3xl overflow-hidden hero-carousel"
    >
      {slides.map((s, i) => {
        const Icon = s.icon;
        return (
          <SwiperSlide key={i}>
            <div
              className="relative h-[280px] sm:h-[340px] flex items-center"
              style={{
                backgroundImage: `linear-gradient(120deg, rgba(15,23,42,0.85), rgba(15,23,42,0.65)), url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className={`absolute inset-0 mix-blend-multiply opacity-80 bg-gradient-to-br ${s.bg}`}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 px-6 sm:px-10 max-w-3xl text-white"
              >
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  <Icon size={14} /> {s.eyebrow}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-4 leading-tight">
                  {s.title}
                </h2>
                <p className="mt-3 text-white/85 text-sm sm:text-base max-w-xl">
                  {s.subtitle}
                </p>
                <button
                  onClick={scrollToLeadership}
                  className="group mt-6 inline-flex items-center gap-2 bg-white text-ink-900 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition"
                >
                  Read the message
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </motion.div>
            </div>
          </SwiperSlide>
        );
      })}
      <style>{`
        .hero-carousel .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .hero-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          width: 22px;
          border-radius: 999px;
        }
      `}</style>
    </Swiper>
  );
}

export default HeroCarousel;
