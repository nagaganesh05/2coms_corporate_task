import FeedCard from "../components/cards/FeedCard";

const posts = [
  {
    title: "CEO Leadership Vision",
    description: "Driving digital transformation across all verticals.",
    author: "CEO Office",
  },
  {
    title: "Project Phoenix Milestone",
    description: "Engineering team successfully launched enterprise AI module.",
    author: "Engineering Team",
  },
  {
    title: "Employee Wellness Campaign",
    description: "Join the upcoming wellness and mindfulness week.",
    author: "HR Team",
  },
];

function Feed() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Organization Feed</h1>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <FeedCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
