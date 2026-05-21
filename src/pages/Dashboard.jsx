import StatsCard from "../components/cards/StatsCard";
import EngagementChart from "../components/charts/EngagementChart";
import LeaderboardWidget from "../components/widgets/LeaderboardWidget";
import NewJoineeWidget from "../components/widgets/NewJoineeWidget";

function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatsCard title="Employees" value="2,430" />
        <StatsCard title="Engagement" value="87%" />
        <StatsCard title="Recognitions" value="562" />
        <StatsCard title="Events" value="18" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <EngagementChart />
        </div>

        <LeaderboardWidget />
      </div>

      <div className="mt-5">
        <NewJoineeWidget />
      </div>
    </div>
  );
}

export default Dashboard;
