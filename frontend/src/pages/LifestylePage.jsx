import { BookOpen, Coffee, Dumbbell, MoonStar, ShieldCheck, Trees } from "lucide-react";
import PreferenceCard from "../components/PreferenceCard.jsx";
import StepActions from "../components/StepActions.jsx";

const OPTIONS = [
  { value: "quiet", title: "Quiet streets", description: "Calm evenings and less neighborhood noise", icon: Trees },
  { value: "cafes", title: "Café culture", description: "Good coffee and places to work or meet", icon: Coffee },
  { value: "nightlife", title: "Nightlife", description: "Restaurants, bars and energy after dark", icon: MoonStar },
  { value: "fitness", title: "Active living", description: "Gyms, parks and convenient exercise options", icon: Dumbbell },
  { value: "study", title: "Study friendly", description: "Libraries and focused places to study", icon: BookOpen },
  { value: "safety", title: "Safety first", description: "Well-lit streets and a comfortable atmosphere", icon: ShieldCheck },
];

function LifestylePage({ values, onToggle, onBack, onSubmit, isLoading, error }) {
  return <main className="choice-page lifestyle-page page-enter"><div className="choice-heading"><span className="section-number">04</span><h1>How do you want to live?</h1><p>Choose everything that matters. We’ll use it to explain why each neighborhood fits.</p></div><div className="preference-grid lifestyle-grid">{OPTIONS.map((option) => <PreferenceCard key={option.value} {...option} selected={values.includes(option.value)} onClick={() => onToggle(option.value)} />)}</div>{error ? <p className="error-message" role="alert">{error}</p> : null}<StepActions onBack={onBack} onContinue={onSubmit} disabled={values.length === 0} loading={isLoading} label="See my results" /></main>;
}

export default LifestylePage;
