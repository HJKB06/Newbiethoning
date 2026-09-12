import { useState } from "react";
import {
  House,
  TrainFront,
  BriefcaseBusiness,
  Sparkles,
  Globe2,
  MapPinned,
  Handshake,
  MapPin,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import "./App.css";

function App() {
  const [step, setStep] = useState(0);

  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [commute, setCommute] = useState("30");
  const [job, setJob] = useState("IT / Software");

  const [community, setCommunity] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const user_id = 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const generateResults = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/housing/${user_id}`
      );
    const rankedAreas = areas
      .map((area) => {
        const housingScore =
          area.rent <= userBudget
            ? 100
            : Math.max(
                0,
                100 - ((area.rent - userBudget) / userBudget) * 100
              );

      if (!response.ok) {
        throw new Error("Unable to load recommendations.");
      }

      const data = await response.json();
      setResults(data.matches);
      setStep(3);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

// STEP 0 — Welcome
if (step === 0) {
  return (
    <div className="app">
      <header className="navbar">
        <h2>LifeFit Seoul</h2>

        <nav className="nav-links">
          <span>주거</span>
          <span>교통</span>
          <span>일자리</span>
        </nav>
      </header>

      <main className="seoul-welcome">
        <section className="seoul-welcome-copy">
          <h1>
            Where in Seoul
            <br />
            fits your life?
          </h1>

          <p>
            Tell us where you need to go, what you can spend,
            and how you want to live. We’ll help you narrow down
            the neighborhoods that fit.
          </p>

          <button
            className="start-button"
            onClick={() => setStep(1)}
          >
            Start recommendation
            <ArrowRight size={17} strokeWidth={1.8} />
          </button>
        </section>

        <section className="seoul-visual">
          <div className="map-heading">
            <span>SEOUL</span>
            <span>서울특별시</span>
          </div>

          <div className="seoul-map">
            <div className="river river-one" />
            <div className="river river-two" />

            <button className="area-point anam">
              <span className="dot" />
              <strong>안암</strong>
              <small>Anam</small>
            </button>

            <button className="area-point hoegi">
              <span className="dot" />
              <strong>회기</strong>
              <small>Hoegi</small>
            </button>

            <button className="area-point seongsu">
              <span className="dot" />
              <strong>성수</strong>
              <small>Seongsu</small>
            </button>

            <button className="area-point sillim">
              <span className="dot" />
              <strong>신림</strong>
              <small>Sillim</small>
            </button>
          </div>

          <div className="map-footer">
            <span>4 neighborhoods to start</span>
            <span>More areas coming soon</span>
          </div>
        </section>
      </main>
    </div>
  );
}

  // STEP 1 — Basic Information
  if (step === 1) {
    return (
      <div className="app">
        <header className="navbar">
          <h2>LifeFit Seoul</h2>
          <span>주거 · 교통 · 일자리</span>
        </header>

        <main className="hero">
          <section className="intro">
            <p className="tag">STEP 1 OF 3 · BASIC INFORMATION</p>

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
            <h2>Tell us about yourself</h2>

            <label>
              <span className="field-label">
                <House size={16} strokeWidth={1.8} />
                Monthly housing budget
              </span>

              <input
                type="number"
                placeholder="₩ 700,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </label>

            <label>
              <span className="field-label">
                <MapPin size={16} strokeWidth={1.8} />
                School / Workplace
              </span>

              <input
                type="text"
                placeholder="e.g. Korea University"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </label>

            <label>
              <span className="field-label">
                <TrainFront size={16} strokeWidth={1.8} />
                Maximum commute
              </span>

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
              <span className="field-label">
                <BriefcaseBusiness size={16} strokeWidth={1.8} />
                Job field
              </span>

              <select
                value={job}
                onChange={(e) => setJob(e.target.value)}
              >
                <option>IT / Software</option>
                <option>Business</option>
                <option>Engineering</option>
                <option>Healthcare</option>
                <option>Education</option>
              </select>
            </label>

            <button type="submit">
              Continue
              <ArrowRight size={17} strokeWidth={1.8} />
            </button>
          </form>
        </main>
      </div>
    );
  }

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

          <h1>
            What kind of neighborhood do you prefer?
          </h1>

          <p className="description">
            Choose the community style that feels most comfortable for you.
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
              <span className="preference-icon">
                <Globe2 size={26} strokeWidth={1.8} />
              </span>

              <strong>International</strong>

              <span>
                More international residents nearby
              </span>
            </button>

            <button
              className={
                community === "local"
                  ? "preference-card selected"
                  : "preference-card"
              }
              onClick={() => setCommunity("local")}
            >
              <span className="preference-icon">
                <MapPinned size={26} strokeWidth={1.8} />
              </span>

              <strong>Local</strong>

              <span>
                More local Korean residents
              </span>
            </button>

            <button
              className={
                community === "mixed"
                  ? "preference-card selected"
                  : "preference-card"
              }
              onClick={() => setCommunity("mixed")}
            >
              <span className="preference-icon">
                <Handshake size={26} strokeWidth={1.8} />
              </span>

              <strong>Mixed</strong>

              <span>
                A balanced community
              </span>
            </button>

            <button
              className={
                community === "none"
                  ? "preference-card selected"
                  : "preference-card"
              }
              onClick={() => setCommunity("none")}
            >
              <span className="preference-icon">
                <Sparkles size={26} strokeWidth={1.8} />
              </span>

              <strong>No preference</strong>

              <span>
                Show me the best overall match
              </span>
            </button>
          </div>

          <div className="preference-actions">
            <button
              className="back-button"
              onClick={() => setStep(1)}
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              Back
            </button>

            <button
              className="primary-button"
              onClick={generateResults}
              disabled={!community || isLoading}
            >
<<<<<<< HEAD
              {isLoading ? "Loading..." : "See My Results →"}
=======
              See My Results
              <ArrowRight size={17} strokeWidth={1.8} />
>>>>>>> cf2eb5bf4d6025e9c6a20f098f299749f492a338
            </button>
          </div>

          {error && <p role="alert">{error}</p>}
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
          <p className="tag">
            PERSONALIZED RESULTS
          </p>

          <h2>
            Best neighborhoods for you
          </h2>

          <div className="result-grid">
            {results.map((area, index) => (
              <div
                className="result-card"
                key={area.name}
              >
                <span className="rank">
                  #{index + 1}
                </span>

                <h3>
                  {area.name}
                </h3>

                <div className="score">
                  {area.score}
                </div>

                <p>
                  LifeFit Score
                </p>

                <hr />

                <p className="score-row">
                  <House size={16} strokeWidth={1.8} />
                  Housing {area.housingScore}/100
                </p>

                <p className="score-row">
                  <TrainFront size={16} strokeWidth={1.8} />
                  Transport {area.transportScore}/100
                </p>

                <p className="score-row">
                  <BriefcaseBusiness size={16} strokeWidth={1.8} />
                  Jobs {area.jobScore}/100
                </p>

                <strong>
                  ₩{area.rent.toLocaleString()} / month
                </strong>

                <p>
                  {area.commute} min commute
                </p>
              </div>
            ))}
          </div>

          <button
            className="back-button"
            onClick={() => setStep(2)}
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Change preferences
          </button>
        </section>
      </div>
    );
  }

  return null;
}

export default App;