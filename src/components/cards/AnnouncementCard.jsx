function AnnouncementCard({ title, description }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between">
        <h2 className="font-bold text-lg">{title}</h2>

        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs">
          Important
        </span>
      </div>

      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}

export default AnnouncementCard;
