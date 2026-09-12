import { useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import BasicInfoPage from "./pages/BasicInfoPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import HousingPage from "./pages/HousingPage.jsx";
import LifestylePage from "./pages/LifestylePage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import { fetchRecommendations } from "./services/recommendations.js";
import "./App.css";

const INITIAL_FORM = {
  budget: "",
  location: "",
  commute: "30",
  job: "IT / Software",
  housingType: "",
  community: "",
  lifestyles: [],
};

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const goToStep = (nextStep) => {
    setStep(nextStep);
    window.scrollTo({ top: 0 });
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleLifestyle = (value) => {
    setFormData((current) => ({
      ...current,
      lifestyles: current.lifestyles.includes(value)
        ? current.lifestyles.filter((item) => item !== value)
        : [...current.lifestyles, value],
    }));
  };

  const generateResults = async () => {
    setIsLoading(true);
    setError("");
    try {
      const matches = await fetchRecommendations(formData);
      setResults(matches);
      goToStep(5);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setFormData(INITIAL_FORM);
    setResults([]);
    setError("");
    setStep(0);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="app">
      <AppHeader step={step} onHome={restart} />
      {step === 0 && <WelcomePage onStart={() => goToStep(1)} />}
      {step === 1 && <BasicInfoPage data={formData} onChange={updateField} onContinue={() => goToStep(2)} />}
      {step === 2 && <HousingPage value={formData.housingType} onChange={(value) => updateField("housingType", value)} onBack={() => goToStep(1)} onContinue={() => goToStep(3)} />}
      {step === 3 && <CommunityPage value={formData.community} onChange={(value) => updateField("community", value)} onBack={() => goToStep(2)} onContinue={() => goToStep(4)} />}
      {step === 4 && <LifestylePage values={formData.lifestyles} onToggle={toggleLifestyle} onBack={() => goToStep(3)} onSubmit={generateResults} isLoading={isLoading} error={error} />}
      {step === 5 && <ResultsPage results={results} preferences={formData} onEdit={() => goToStep(1)} onRestart={restart} />}
    </div>
  );
}

export default App;
