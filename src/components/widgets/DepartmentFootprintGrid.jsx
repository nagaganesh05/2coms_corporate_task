import { Layers } from "lucide-react";
import useStore from "../../store/useStore";
import FootprintCard from "../cards/FootprintCard";
import SectionHeader from "../common/SectionHeader";

function DepartmentFootprintGrid({ limit }) {
  const footprints = useStore((s) => s.footprints);
  const list = limit ? footprints.slice(0, limit) : footprints;

  return (
    <div>
      <SectionHeader
        icon={Layers}
        title="Department footprints"
        subtitle="Visible impact across teams this month"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((f) => (
          <FootprintCard key={f.departmentId} footprint={f} />
        ))}
      </div>
    </div>
  );
}

export default DepartmentFootprintGrid;
