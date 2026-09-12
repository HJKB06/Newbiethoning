import { useState } from "react";
import "./App.css";

// Adjust these import paths depending on your folder structure (e.g., ./pages/BasicInfoPage)
import BasicInfoPage from "./pages/BasicInfoPage";
import HousingPage from "./pages/HousingPage";
import CommunityPage from "./pages/CommunityPage";
import LifestylePage from "./pages/LifestylePage";
import ResultsPage from "./pages/ResultsPage";

function ProgressBar({ step }) {
  const steps = ["Basic Info", "Housing", "Community", "Lifestyle"];

  return (
    <div className="progress-wrapper">
      <p className="progress-count">
        Step {step} of 4
      </p>

      <div className="progress-steps">
        {steps.map((label, index) => {
          const stepNumber = index + 1;

          return (
            <div
              key={label}
              className={`progress-step ${
                stepNumber === step ? "active" : ""
              } ${stepNumber < step ? "completed" : ""}`}
            >
              <div className="progress-circle">
                {stepNumber}
              </div>

              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
      // Step A: Save the User Profile to SQLite
      const userResponse = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: Number(data.budget),
          location: data.location,
          commute: Number(data.commute),
          job: data.job,
          housingType: data.housingType,
          community: data.community,
          lifestyles: data.lifestyles,
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to save user data. Is the backend running?");
      }

      const userData = await userResponse.json();
      const userId = userData.user.id;

      // Step B: Fetch the Algorithmic Recommendations
      const recResponse = await fetch(`http://localhost:8000/api/housing/${userId}`);
      
      if (!recResponse.ok) {
        throw new Error("Failed to fetch neighborhood matches.");
      }

      const recData = await recResponse.json();
      
      // Update results and transition to the final page
      setResults(recData.matches);
      setStep(5);
      
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
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
    return (
    <>
      <ProgressBar step={1} />

      <BasicInfoPage
        data={data}
        onChange={updateData}
        onContinue={() => setStep(2)}
      />
    </>
  );
  }
  if (step === 2) {
    return (
    <>
      <ProgressBar step={2} />

      <HousingPage
        value={data.housingType}
        onChange={(v) => updateData("housingType", v)}
        onBack={() => setStep(1)}
        onContinue={() => setStep(3)}
      />
    </>
  );
  }
  if (step === 3) {
    return (
    <>
      <ProgressBar step={3} />

      <CommunityPage
        value={data.community}
        onChange={(v) => updateData("community", v)}
        onBack={() => setStep(2)}
        onContinue={() => setStep(4)}
      />
    </>
  );
  }
  if (step === 4) {
    return (
    <>
      <ProgressBar step={4} />

      <LifestylePage
        values={data.lifestyles}
        onToggle={toggleLifestyle}
        onBack={() => setStep(3)}
        onSubmit={generateResults}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
  }
  if (step === 5) {
    return <ResultsPage results={results} preferences={data} onEdit={() => setStep(1)} onRestart={restartSearch} />;
  }

  return null;
}

export default App;