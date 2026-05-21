function Forum() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Employee Community Forum</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-[28px] p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            How can we improve hybrid collaboration?
          </h2>

          <p className="mt-4 text-slate-600">
            Share your thoughts and experiences about remote and hybrid
            workflows.
          </p>

          <div className="flex gap-5 mt-6 text-slate-500">
            <span>💬 45 Replies</span>
            <span>❤️ 120 Likes</span>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-8 shadow-sm">
          <h2 className="text-2xl font-bold">AI Tools for Productivity</h2>

          <p className="mt-4 text-slate-600">
            Discuss how teams are using AI internally.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Forum;
