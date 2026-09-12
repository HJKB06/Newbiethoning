import { useState } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);

  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [commute, setCommute] = useState("30");
  const [job, setJob] = useState("IT / Software");

  const [community, setCommunity] = useState("");

  const [results, setResults] = useState([]);

  const areas = [
    {
      name: "안암동",
      rent: 650000,
      commute: 10,
      jobs: 72,
    },
    {
      name: "회기동",
      rent: 580000,
      commute: 25,
      jobs: 68,
    },
    {
      name: "신림동",
      rent: 520000,
      commute: 38,
      jobs: 85,
    },
    {
      name: "성수동",
      rent: 900000,
      commute: 30,
      jobs: 95,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Step 1 → Step 2
    setStep(2);
  };

  const generateResults = () => {
    const userBudget = Number(budget);
    const maxCommute = Number(commute);

    const rankedAreas = areas
      .map((area) => {
        const housingScore =
          area.rent <= userBudget
            ? 100
            : Math.max(
                0,
                100 -
                  ((area.rent - userBudget) / userBudget) * 100
              );

        const transportScore =
          area.commute <= maxCommute
            ? 100
            : Math.max(
                0,
                100 - (area.commute - maxCommute) * 3
              );

        const jobScore = area.jobs;

        const score =
          housingScore * 0.4 +
          transportScore * 0.35 +
          jobScore * 0.25;

        return {
          ...area,
          housingScore: Math.round(housingScore),
          transportScore: Math.round(transportScore),
          jobScore,
          score: Math.round(score),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults(rankedAreas);
    setStep(3);
  };

  // STEP 2 — Community Preference
  if (step === 2) {
    return (
      <div className="app">
        <header className="navbar">
          <h2>LifeFit Seoul</h2>
          <span>주거 · 교통 · 일자리</span>
        </header>

        <main className="preference-page">
          <p className="tag">STEP 2 OF 3 · COMMUNITY</p>

          <h1>What kind of neighborhood do you prefer?</h1>

          <p className="description">
            Choose the community style that feels most comfortable
            for you.
          </p>

          <div className="preference-grid">
            <button
              className={
                community === "international"
                  ? "preference-card selected"
                  : "preference-card"
              }
              onClick={() => setCommunity("international")}
            >
              <span className="preference-icon">🌍</span>
              <strong>International</strong>
              <span>More international residents nearby</span>
            </button>

            <button
              className={
                community === "local"
                  ? "preference-card selected"
                  : "preference-card"
              }
              onClick={() => setCommunity("local")}
            >
              <span className="preference-icon">🇰🇷</span>
              <strong>Local</strong>
              <span>More local Korean residents</span>
            </button>

            <button
              className={
                community === "mixed"
                  ? "preference-card selected"
                  : "preference-card"
              }
              onClick={() => setCommunity("mixed")}
            >
              <span className="preference-icon">🤝</span>
              <strong>Mixed</strong>
              <span>A balanced community</span>
            </button>

            <button
              className={
                community === "none"
                  ? "preference-card selected"
                  : "preference-card"
              }
              onClick={() => setCommunity("none")}
            >
              <span className="preference-icon">✨</span>
              <strong>No preference</strong>
              <span>Show me the best overall match</span>
            </button>
          </div>

          <div className="preference-actions">
            <button
              className="back-button"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>

            <button
              className="primary-button"
              onClick={generateResults}
              disabled={!community}
            >
              See My Results →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // STEP 3 — Results
  if (step === 3) {
    return (
      <div className="app">
        <header className="navbar">
          <h2>LifeFit Seoul</h2>
          <span>주거 · 교통 · 일자리</span>
        </header>

        <section className="results">
          <p className="tag">PERSONALIZED RESULTS</p>

          <h2>Best neighborhoods for you</h2>

          <div className="result-grid">
            {results.map((area, index) => (
              <div className="result-card" key={area.name}>
                <span className="rank">#{index + 1}</span>

                <h3>{area.name}</h3>

                <div className="score">{area.score}</div>
                <p>LifeFit Score</p>

                <hr />

                <p>🏠 Housing {area.housingScore}/100</p>
                <p>🚇 Transport {area.transportScore}/100</p>
                <p>💼 Jobs {area.jobScore}/100</p>

                <strong>
                  ₩{area.rent.toLocaleString()} / month
                </strong>

                <p>{area.commute} min commute</p>
              </div>
            ))}
          </div>

          <button
            className="back-button"
            onClick={() => setStep(2)}
          >
            ← Change preferences
          </button>
        </section>
      </div>
    );
  }

  // STEP 1 — Existing Basic Info Page
  return (
    <div className="app">
      <header className="navbar">
        <h2>LifeFit Seoul</h2>
        <span>주거 · 교통 · 일자리</span>
      </header>

      <main className="hero">
        <section className="intro">
          <p className="tag">
            STEP 1 OF 3 · BASIC INFORMATION
          </p>

          <h1>
            Where should
            <br />
            you live?
          </h1>

          <p className="description">
            Find a neighborhood that balances housing costs,
            transportation and job opportunities.
          </p>
        </section>

        <form
          className="search-card"
          onSubmit={handleSubmit}
        >
          <h2>Tell us about yourself</h2>

          <label>
            🏠 Monthly housing budget

            <input
              type="number"
              placeholder="₩ 700,000"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
              required
            />
          </label>

          <label>
            📍 School / Workplace

            <input
              type="text"
              placeholder="e.g. Korea University"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              required
            />
          </label>

          <label>
            🚇 Maximum commute

            <select
              value={commute}
              onChange={(e) =>
                setCommute(e.target.value)
              }
            >
              <option value="20">
                20 minutes
              </option>

              <option value="30">
                30 minutes
              </option>

              <option value="40">
                40 minutes
              </option>

              <option value="60">
                60 minutes
              </option>
            </select>
          </label>

          <label>
            💼 Job field

            <select
              value={job}
              onChange={(e) =>
                setJob(e.target.value)
              }
            >
              <option>IT / Software</option>
              <option>Business</option>
              <option>Engineering</option>
              <option>Healthcare</option>
              <option>Education</option>
            </select>
          </label>

          <button type="submit">
            Continue →
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;