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

  // House data
  const houses = [
    {
      id: 1,
      title: "Cozy Studio Near Korea University",
      area: "안암동",
      rent: 550000,
      deposit: 5000000,
      rooms: "1 Room",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    },
    {
      id: 2,
      title: "Modern Studio in Anam",
      area: "안암동",
      rent: 650000,
      deposit: 10000000,
      rooms: "1 Room",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    },
    {
      id: 3,
      title: "Affordable Room in Hoegi",
      area: "회기동",
      rent: 480000,
      deposit: 5000000,
      rooms: "1 Room",
      image:
        "https://images.unsplash.com/photo-1560185008-b033106af5c3",
    },
    {
      id: 4,
      title: "Bright Apartment in Hoegi",
      area: "회기동",
      rent: 580000,
      deposit: 10000000,
      rooms: "2 Rooms",
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    },
    {
      id: 5,
      title: "Affordable Studio in Sillim",
      area: "신림동",
      rent: 450000,
      deposit: 3000000,
      rooms: "1 Room",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    },
    {
      id: 6,
      title: "Modern Apartment in Seongsu",
      area: "성수동",
      rent: 850000,
      deposit: 10000000,
      rooms: "1.5 Rooms",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
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

  // STEP 2
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

  // STEP 3
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

          {/* HOUSE LIST */}
          <h2 className="house-title">
            Recommended Houses
          </h2>

          <p className="description">
            Houses available in your recommended neighborhoods.
          </p>

          <div className="house-grid">
            {houses
              .filter((house) =>
                results.some(
                  (area) => area.name === house.area
                )
              )
              .map((house) => (
                <div
                  className="house-card"
                  key={house.id}
                >
                  <img
                    src={house.image}
                    alt={house.title}
                  />

                  <div className="house-info">
                    <h3>{house.title}</h3>

                    <p className="house-area">
                      📍 {house.area}
                    </p>

                    <p>
                      🏠 {house.rooms}
                    </p>

                    <p>
                      💰 ₩{house.rent.toLocaleString()} / month
                    </p>

                    <p>
                      💵 Deposit: ₩
                      {house.deposit.toLocaleString()}
                    </p>

                    <button
                      type="button"
                      className="primary-button"
                    >
                      View House
                    </button>
                  </div>
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

  // STEP 1
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