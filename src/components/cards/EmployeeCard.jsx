function EmployeeCard({ name, role, department }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition">
      <div className="w-20 h-20 rounded-full bg-slate-200"></div>

      <h2 className="text-xl font-bold mt-4">{name}</h2>

      <p className="text-slate-500">{role}</p>

      <div className="mt-4 flex justify-between items-center">
        <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm">
          {department}
        </span>

        <button className="text-primary">View</button>
      </div>
    </div>
  );
}

export default EmployeeCard;
