import { useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import ResultCard from "../components/ResultCard.jsx";
import ResultsMap from "../components/ResultsMap.jsx";

const LABELS = { "one-room": "One-room", officetel: "Officetel", "share-house": "Share house", flexible: "Flexible housing", international: "International community", local: "Local community", mixed: "Mixed community", none: "No community preference" };

function ResultsPage({ results, preferences, onEdit, onRestart }) {
  const [activeArea, setActiveArea] = useState(results[0]?.name ?? "");

  return (
    <main className="results-page page-enter">
      <div className="results-overview">
        <header className="results-heading">
          <div><span className="section-number">YOUR MATCHES</span><h1>Seoul, narrowed down.</h1><p>Ranked by budget, commute time and job access.</p></div>
          <div className="preference-summary"><span>Up to ₩{Number(preferences.budget).toLocaleString()}</span><span>{preferences.commute} min commute</span><span>{LABELS[preferences.housingType]}</span><span>{LABELS[preferences.community]}</span></div>
        </header>
        <ResultsMap results={results} activeName={activeArea} onSelect={setActiveArea} />
      </div>
      <section className="result-grid" aria-label="Recommended neighborhoods">{results.map((area, index) => <ResultCard key={area.name} area={area} rank={index + 1} />)}</section>
      <div className="results-actions"><button className="back-button" type="button" onClick={onEdit}><SlidersHorizontal size={16} />Change preferences</button><button className="text-button" type="button" onClick={onRestart}><RotateCcw size={15} />Start over</button></div>
    </main>
  );
}

export default ResultsPage;
