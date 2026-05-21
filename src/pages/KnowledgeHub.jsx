function KnowledgeHub() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Knowledge Hub</h1>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold">Employee Handbook</h2>
          <p className="mt-2 text-slate-500">Company PDF Document</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold">HR Policies</h2>
          <p className="mt-2 text-slate-500">Company Guidelines</p>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeHub;
