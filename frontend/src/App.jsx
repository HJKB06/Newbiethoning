import { useState } from "react";
import "./App.css";

// Adjust these import paths depending on your folder structure (e.g., ./pages/BasicInfoPage)
import BasicInfoPage from "./pages/BasicInfoPage";
import HousingPage from "./pages/HousingPage";
import CommunityPage from "./pages/CommunityPage";
import LifestylePage from "./pages/LifestylePage";
import ResultsPage from "./pages/ResultsPage";
import { fetchRecommendations } from "./services/recommendations.js";

function App() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Centralized State matches the backend's UserCreate schema
  const [data, setData] = useState({
    budget: "",
    location: "",
    commute: "30",
    job: "IT / Software",
    housingType: "",
    community: "",
    lifestyles: [],
  });

  const [results, setResults] = useState([]);

  // 2. State Handlers
  const updateData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleLifestyle = (value) => {
    setData((prev) => {
      const exists = prev.lifestyles.includes(value);
      return {
        ...prev,
        lifestyles: exists
          ? prev.lifestyles.filter((item) => item !== value)
          : [...prev.lifestyles, value],
      };
    });
  };

  const restartSearch = () => {
    setStep(1);
    setResults([]);
    setData({
      budget: "",
      location: "",
      commute: "30",
      job: "IT / Software",
      housingType: "",
      community: "",
      lifestyles: [],
    });
  };

  // 3. API Integration
  const generateResults = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const matches = await fetchRecommendations(data);
      setResults(matches);
      setStep(5);
    } catch (err) {
      setError(err.message || "We couldn’t connect to the recommendation service.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Page Router
  // HOMEPAGE
  if (step === 0) {
    return (
      <div className="homepage">
        <div className="homepage-content">
          <h1 className="homepage-title">
            Life<span>Fit</span>
          </h1>

          <h2 className="homepage-subtitle">
            Find a home that fits your life.
          </h2>

          <p className="homepage-description">
            Tell us your preferences — from budget to lifestyle —
            and we'll recommend neighborhoods that match you best.
          </p>

          <button
            className="begin-button"
            onClick={() => setStep(1)}
          >
            Begin <span>→</span>
          </button>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return <BasicInfoPage data={data} onChange={updateData} onContinue={() => setStep(2)} />;
  }
  if (step === 2) {
    return <HousingPage value={data.housingType} onChange={(v) => updateData("housingType", v)} onBack={() => setStep(1)} onContinue={() => setStep(3)} />;
  }
  if (step === 3) {
    return <CommunityPage value={data.community} onChange={(v) => updateData("community", v)} onBack={() => setStep(2)} onContinue={() => setStep(4)} />;
  }
  if (step === 4) {
    return <LifestylePage values={data.lifestyles} onToggle={toggleLifestyle} onBack={() => setStep(3)} onSubmit={generateResults} isLoading={isLoading} error={error} />;
  }
  if (step === 5) {
    return <ResultsPage results={results} preferences={data} onEdit={() => setStep(1)} onRestart={restartSearch} />;
  }

  return null;
}

export default App;
