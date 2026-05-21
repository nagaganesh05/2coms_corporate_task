import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Sparkles, MapPin } from "lucide-react";
import useStore from "../../store/useStore";
import { useNewJoinees } from "../../store/selectors";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import SectionHeader from "../common/SectionHeader";

function NewJoineeWidget() {
  const newJoinees = useNewJoinees(60);
  const getDepartment = useStore((s) => s.getDepartment);

  return (
    <div className="card p-5">
      <SectionHeader
        icon={Sparkles}
        title="Welcome our new colleagues"
        subtitle={`${newJoinees.length} joined in the last 60 days`}
      />
      {newJoinees.length === 0 ? (
        <p className="text-sm muted">No new joinees yet.</p>
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-1"
        >
          {newJoinees.map((e) => {
            const dept = getDepartment(e.departmentId);
            return (
              <SwiperSlide key={e.id}>
                <div className="rounded-2xl border border-ink-100 dark:border-ink-800 p-4 bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-500/10 dark:to-violet-500/10">
                  <div className="flex items-center gap-3">
                    <Avatar name={e.name} size="lg" ring />
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900 dark:text-ink-100 truncate">
                        {e.name}
                      </p>
                      <p className="text-xs muted truncate">{e.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Tag tone="brand">{dept?.name}</Tag>
                    <Tag tone="ghost" icon={<MapPin size={10} />}>
                      {e.location}
                    </Tag>
                  </div>
                  <p className="text-xs muted mt-3 line-clamp-2">
                    {e.bio || "Excited to be here!"}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}

export default NewJoineeWidget;
