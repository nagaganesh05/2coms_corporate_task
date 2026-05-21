function Moderation() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Moderation Queue</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center border p-4 rounded-xl">
          <div>
            <h2 className="font-bold">Marketing Team Event Post</h2>
            <p className="text-slate-500">Pending Approval</p>
          </div>

          <div className="flex gap-3">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Approve
            </button>

            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Moderation;
