import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const slides = [
  {
    title: "Leadership Vision 2026",
    subtitle: "Driving innovation and collaboration across all departments.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    title: "Quarterly Business Growth",
    subtitle: "Company growth increased by 24% this quarter.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  },
  {
    title: "Employee Engagement Week",
    subtitle: "Celebrating collaboration and culture.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
];

function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000 }}
      loop
      className="rounded-[32px] overflow-hidden"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="h-[380px] bg-cover bg-center relative flex items-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 px-12 text-white max-w-2xl">
              <h1 className="text-5xl font-bold">{slide.title}</h1>

              <p className="mt-5 text-xl">{slide.subtitle}</p>

              <button className="mt-8 bg-white text-black px-6 py-3 rounded-2xl font-semibold">
                Explore More
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HeroCarousel;
