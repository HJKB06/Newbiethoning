import { BriefcaseBusiness, House, TrainFront, Sparkles } from "lucide-react";

function ResultCard({ area, rank }) {
  return (
    <article className={`result-card${rank === 1 ? " top-result" : ""}`}>
      <div className="result-card-head">
        <span className="rank">#{rank}</span>
        {rank === 1 ? <span className="best-match">Best match</span> : null}
      </div>
      
      <h3>{area.name}</h3>
      <p className="match-copy">A strong balance of monthly rent, commute time and job access.</p>

      {/* Dynamic Reasons from Backend */}
      {area.reasons?.length > 0 && (
        <ul className="reasons-list" style={{ listStyle: "none", padding: 0, margin: "12px 0", textAlign: "left" }}>
          {area.reasons.map((reason, idx) => (
            <li key={idx} style={{ fontSize: "13px", color: "#47755b", marginBottom: "4px" }}>
              ✨ {reason}
            </li>
          ))}
        </ul>
      )}

      <div className="score-line">
        <strong className="score">{area.score}</strong>
        <span>LifeFit<br />Score</span>
      </div>

      <div className="score-breakdown">
        <p><House size={16} />Housing <strong>{area.housingScore}/100</strong></p>
        <p><TrainFront size={16} />Transport <strong>{area.transportScore}/100</strong></p>
        <p><BriefcaseBusiness size={16} />Jobs <strong>{area.jobScore}/100</strong></p>
      </div>

      <footer>
        <strong>₩{area.rent.toLocaleString()} / month</strong>
        <span>{area.commute} min commute</span>
      </footer>
    </article>
  );
}

export default ResultCard;