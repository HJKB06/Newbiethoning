import { ArrowRight } from "lucide-react";

const AREAS = [["anam", "안암", "Anam"], ["hoegi", "회기", "Hoegi"], ["seongsu", "성수", "Seongsu"], ["sillim", "신림", "Sillim"]];

function WelcomePage({ onStart }) {
  return (
    <main className="welcome page-enter">
      <section className="welcome-copy">
        <h1>Where in Seoul<br />fits your life?</h1>
        <p>Tell us where you need to go, what you can spend, and how you want to live. We’ll narrow down the neighborhoods that fit.</p>
        <button className="start-button" type="button" onClick={onStart}>Start recommendation<ArrowRight size={17} strokeWidth={1.8} /></button>
      </section>
      <section className="seoul-visual" aria-label="Featured Seoul neighborhoods">
        <div className="map-heading"><span>SEOUL</span><span>서울특별시</span></div>
        <div className="seoul-map">
          <div className="river river-one" /><div className="river river-two" />
          {AREAS.map(([className, korean, english]) => <div className={`area-point ${className}`} key={english}><span className="dot" /><strong>{korean}</strong><small>{english}</small></div>)}
        </div>
        <div className="map-footer"><span>4 neighborhoods to start</span><span>More areas coming soon</span></div>
      </section>
    </main>
  );
}

export default WelcomePage;
