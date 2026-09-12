import { useState } from "react";
import { BriefcaseBusiness, House, TrainFront, ChevronDown, ChevronUp, Globe, User } from "lucide-react";

function ResultCard({ area, rank }) {
  // State to handle the accordion dropdown for properties
  const [showProps, setShowProps] = useState(false);

  return (
    <article className={`result-card${rank === 1 ? " top-result" : ""}`}>
      <div className="result-card-head">
        <span className="rank">#{rank}</span>
        {rank === 1 ? <span className="best-match">Best match</span> : null}
      </div>
      
      <h3>{area.name}</h3>
      <p className="match-copy">A strong balance of monthly rent, commute time and lifestyle access.</p>

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

      {/* NEW: In-depth Housing Dropdown */}
      <div style={{ marginTop: "20px", borderTop: "1px solid #dfe3dc", paddingTop: "15px", textAlign: "left" }}>
        <button 
          onClick={() => setShowProps(!showProps)}
          style={{ width: "100%", background: "none", border: "none", color: "#1d4d35", fontWeight: "700", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "8px 0" }}
        >
          View specific housing listings
          {showProps ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showProps && area.properties && (
          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {area.properties.map(prop => (
              <div key={prop.id} style={{ padding: "16px", background: "#f6f7f2", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <strong style={{ color: "#17251c", fontSize: "15px" }}>{prop.title}</strong>
                  <span style={{ textTransform: "capitalize", fontSize: "12px", color: "#47755b", border: "1px solid #95aa9e", padding: "4px 8px", borderRadius: "6px", whiteSpace: "nowrap", marginLeft: "10px" }}>
                    {prop.type}
                  </span>
                </div>
                
                <div style={{ marginBottom: "12px", color: "#1d4d35", fontWeight: "700", fontSize: "14px" }}>
                  Deposit ₩{prop.deposit.toLocaleString()} <br/> Rent ₩{prop.rent.toLocaleString()}
                </div>

                <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "#657168" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", color: prop.foreigner_friendly ? "#47755b" : "inherit" }}>
                    <Globe size={15} /> 
                    {prop.foreigner_friendly ? "Foreigner Friendly" : "Korean Speaking"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <User size={15} /> 
                    {prop.gender}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default ResultCard;