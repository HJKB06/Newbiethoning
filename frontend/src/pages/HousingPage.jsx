import { Building2, Home, UsersRound, WandSparkles } from "lucide-react";
import PreferenceCard from "../components/PreferenceCard.jsx";
import StepActions from "../components/StepActions.jsx";

const OPTIONS = [
  { value: "one-room", title: "One-room", description: "A compact private home with everything in one place", icon: Home },
  { value: "officetel", title: "Officetel", description: "A modern studio with convenient building facilities", icon: Building2 },
  { value: "share-house", title: "Share house", description: "A private room with shared social spaces", icon: UsersRound },
  { value: "flexible", title: "I’m flexible", description: "Prioritize the strongest overall neighborhood match", icon: WandSparkles },
];

function HousingPage({ value, onChange, onBack, onContinue }) {
  return <main className="choice-page page-enter"><div className="choice-heading"><span className="section-number">02</span><h1>What feels like home?</h1><p>Pick the housing style you would feel most comfortable coming back to.</p></div><div className="preference-grid">{OPTIONS.map((option) => <PreferenceCard key={option.value} {...option} selected={value === option.value} onClick={() => onChange(option.value)} />)}</div><StepActions onBack={onBack} onContinue={onContinue} disabled={!value} /></main>;
}

export default HousingPage;
