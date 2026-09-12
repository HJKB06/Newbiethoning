import ProgressBar from "./ProgressBar.jsx";

function AppHeader({ step, onHome }) {
  return (
    <>
      <header className="navbar">
        <button className="brand" type="button" onClick={onHome}>LifeFit Seoul</button>
        <span className="nav-caption">주거 · 교통 · 일자리</span>
      </header>
      {step >= 1 && step <= 4 ? <ProgressBar step={step} /> : null}
    </>
  );
}

export default AppHeader;
