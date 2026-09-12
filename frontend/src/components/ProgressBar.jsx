const STEPS = ["Basics", "Housing", "Community", "Lifestyle"];

function ProgressBar({ step }) {
  return (
    <div className="progress-shell" aria-label={`Step ${step} of ${STEPS.length}`}>
      <div className="progress-meta"><span>Step {step} of {STEPS.length}</span><strong>{STEPS[step - 1]}</strong></div>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${(step / STEPS.length) * 100}%` }} /></div>
    </div>
  );
}

export default ProgressBar;
