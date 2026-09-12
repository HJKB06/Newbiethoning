  import { Globe2, Handshake, MapPinned, Sparkles } from "lucide-react";
  import PreferenceCard from "../components/PreferenceCard.jsx";
  import StepActions from "../components/StepActions.jsx";

  const OPTIONS = [
    { value: "international", title: "International", description: "A globally minded community with international residents", icon: Globe2 },
    { value: "local", title: "Local", description: "A neighborhood rooted in everyday Korean life", icon: MapPinned },
    { value: "mixed", title: "Mixed", description: "A comfortable balance of local and international life", icon: Handshake },
    { value: "none", title: "No preference", description: "Show me the strongest overall neighborhood match", icon: Sparkles },
  ];

  function CommunityPage({ value, onChange, onBack, onContinue }) {
    return <main className="choice-page page-enter"><div className="choice-heading"><span className="section-number">03</span><h1>Find your kind of community.</h1><p>This is a comfort preference, not a restriction. You can always choose no preference.</p></div><div className="preference-grid">{OPTIONS.map((option) => <PreferenceCard key={option.value} {...option} selected={value === option.value} onClick={() => onChange(option.value)} />)}</div><StepActions onBack={onBack} onContinue={onContinue} disabled={!value} /></main>;
  }

  export default CommunityPage;
