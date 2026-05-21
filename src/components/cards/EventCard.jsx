function EventCard({ title, date, location }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-2 text-slate-500">{date}</p>
          <p className="text-sm mt-1">{location}</p>
        </div>

        <button className="bg-primary text-white px-4 py-2 rounded-lg">
          RSVP
        </button>
      </div>
    </div>
  );
}

export default EventCard;
