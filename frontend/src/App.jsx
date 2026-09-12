import { useState } from "react";
import "./App.css";

function App() {
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [commute, setCommute] = useState("30");
  const [job, setJob] = useState("IT / Software");
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

  const userBudget = Number(budget);
  const maxCommute = Number(commute);

  const rankedAreas = areas
    .map((area) => {
      const housingScore =
        area.rent <= userBudget
          ? 100
          : Math.max(0, 100 - ((area.rent - userBudget) / userBudget) * 100);

      const transportScore =
        area.commute <= maxCommute
          ? 100
          : Math.max(0, 100 - (area.commute - maxCommute) * 3);

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
};

  return (
    <div className="app">
      <header className="navbar">
        <h2>LifeFit Seoul</h2>
        <span>주거 · 교통 · 일자리</span>
      </header>

      <main className="hero">
        <section className="intro">
          <p className="tag">YOUR LIFE, YOUR NEIGHBORHOOD</p>

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

        <form className="search-card" onSubmit={handleSubmit}>
          <h2>Find your area</h2>

          <label>
            🏠 Monthly housing budget
            <input
              type="number"
              placeholder="₩ 700,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </label>

          <label>
            📍 School / Workplace
            <input
              type="text"
              placeholder="e.g. Korea University"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>

          <label>
            🚇 Maximum commute
            <select
              value={commute}
              onChange={(e) => setCommute(e.target.value)}
            >
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="40">40 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>

          <label>
            💼 Job field
            <select value={job} onChange={(e) => setJob(e.target.value)}>
              <option>IT / Software</option>
              <option>Business</option>
              <option>Engineering</option>
              <option>Healthcare</option>
              <option>Education</option>
            </select>
          </label>

          <button type="submit">Find My Area →</button>
        </form>
      </main>
      {results.length > 0 && (
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

          <strong>₩{area.rent.toLocaleString()} / month</strong>
          <p>{area.commute} min commute</p>
        </div>
      ))}
    </div>
  </section>
)}
    </div>
  );
}

export default App;