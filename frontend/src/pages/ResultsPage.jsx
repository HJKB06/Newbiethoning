import { useState } from "react";
import { RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import ResultCard from "../components/ResultCard.jsx";
import ResultsMap from "../components/ResultsMap.jsx";

const LABELS = { 
  "one-room": "One-room", 
  officetel: "Officetel", 
  "share-house": "Share house", 
  flexible: "Flexible housing", 
  international: "International community", 
  local: "Local community", 
  mixed: "Mixed community", 
  none: "No community preference" 
};

function ResultsPage({ results, preferences, onEdit, onRestart }) {
  const [activeArea, setActiveArea] = useState(results[0]?.name ?? "");
  const [showAll, setShowAll] = useState(false); // Controls the expansion toggle

  // Slice the array based on state
  const displayedResults = showAll ? results : results.slice(0, 3);

  return (
    <main className="results-page page-enter">
      <div className="results-overview">
        <header className="results-heading">
          <div>
            <span className="section-number">YOUR MATCHES</span>
            <h1>Seoul, narrowed down.</h1>
            <p>Ranked by budget, commute time and lifestyle access.</p>
          </div>
          <div className="preference-summary">
            <span>Up to ₩{Number(preferences.budget).toLocaleString()}</span>
            <span>{preferences.commute} min commute</span>
            <span>{LABELS[preferences.housingType]}</span>
            <span>{LABELS[preferences.community]}</span>
          </div>
        </header>
        <ResultsMap results={results} activeName={activeArea} onSelect={setActiveArea} />
      </div>
      
      <section className="result-grid" aria-label="Recommended neighborhoods">
        {displayedResults.map((area, index) => (
          <ResultCard key={area.name} area={area} rank={index + 1} />
        ))}
      </section>

      {/* Show More / Show Less Toggle Button */}
      {results.length > 3 && (
        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "20px" }}>
          <button 
            onClick={() => setShowAll(!showAll)} 
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "1px solid #dfe3dc",
              background: "white",
              color: "#1d4d35",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {showAll ? (
              <><ChevronUp size={16} /> Show Top 3 matches only</>
            ) : (
              <><ChevronDown size={16} /> Show {results.length - 3} more matches</>
            )}
          </button>
        </div>
      )}

      <div className="results-actions">
        <button className="back-button" type="button" onClick={onEdit}>
          <SlidersHorizontal size={16} />Change preferences
        </button>
        <button className="text-button" type="button" onClick={onRestart}>
          <RotateCcw size={15} />Start over
        </button>
      </div>
    </main>
  );
}

export default ResultsPage;