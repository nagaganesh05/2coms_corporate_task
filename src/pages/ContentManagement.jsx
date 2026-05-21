function ContentManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-5">
          <input
            className="w-full border rounded-xl p-3"
            placeholder="Announcement title"
          />

          <textarea
            className="w-full border rounded-xl p-3 h-40"
            placeholder="Write announcement here"
          ></textarea>

          <button className="bg-primary text-white px-5 py-3 rounded-xl">
            Publish Announcement
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;
