const LOCATIONS = {
  안암동: { x: 49, y: 29 },
  회기동: { x: 69, y: 20 },
  성수동: { x: 70, y: 51 },
  신림동: { x: 31, y: 74 },
};

function ResultsMap({ results, activeName, onSelect }) {
  const activeArea = results.find((area) => area.name === activeName) ?? results[0];

  return (
    <section className="results-map-panel" aria-label="Recommended neighborhoods map">
      <div className="map-heading">
        <span>SEOUL · TOP MATCHES</span>
        <span>서울특별시</span>
      </div>
      <div className="results-map">
        <div className="river river-one" />
        <div className="river river-two" />
        {results.map((area, index) => {
          const position = LOCATIONS[area.name] ?? { x: 50, y: 50 };
          return (
            <button
              className={`result-marker${activeArea?.name === area.name ? " active" : ""}`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              type="button"
              onClick={() => onSelect(area.name)}
              key={area.name}
              aria-label={`#${index + 1} ${area.name}, LifeFit score ${area.score}`}
            >
              <span>{index + 1}</span>
              <strong>{area.name}</strong>
            </button>
          );
        })}
      </div>
      {activeArea ? (
        <div className="map-selection" aria-live="polite">
          <div><span>Selected area</span><strong>{activeArea.name}</strong></div>
          <div><span>LifeFit score</span><strong>{activeArea.score}</strong></div>
          <div><span>Monthly rent</span><strong>₩{activeArea.rent.toLocaleString()}</strong></div>
          <div><span>Commute</span><strong>{activeArea.commute} min</strong></div>
        </div>
      ) : null}
    </section>
  );
}

export default ResultsMap;
