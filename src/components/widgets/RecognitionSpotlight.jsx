import { Sparkles } from "lucide-react";
import useStore from "../../store/useStore";
import RecognitionCard from "../cards/RecognitionCard";
import SectionHeader from "../common/SectionHeader";

function RecognitionSpotlight() {
  const recognitions = useStore((s) => s.recognitions);
  const top = recognitions[0];

  if (!top) return null;

  return (
    <div>
      <SectionHeader
        icon={Sparkles}
        title="Recognition spotlight"
        subtitle="Celebrating great work"
      />
      <RecognitionCard recognition={top} />
    </div>
  );
}

export default RecognitionSpotlight;
