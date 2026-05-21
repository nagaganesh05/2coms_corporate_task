function RecognitionCard({ employee, badge, points }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">{employee}</h2>
          <p className="mt-2">{badge}</p>
        </div>

        <div className="text-4xl">🏆</div>
      </div>

      <div className="mt-6">
        <p className="text-sm">Recognition Points</p>
        <h3 className="text-3xl font-bold">{points}</h3>
      </div>
    </div>
  );
}

export default RecognitionCard;
