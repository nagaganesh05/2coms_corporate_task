function FeedCard({ title, description, author }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{author}</p>
        </div>

        <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">
          Featured
        </button>
      </div>

      <p className="mt-4 text-slate-600">{description}</p>

      <div className="flex gap-5 mt-5 text-sm text-slate-500">
        <button>❤️ 245</button>
        <button>💬 52</button>
        <button>🔗 Share</button>
      </div>
    </div>
  );
}

export default FeedCard;
