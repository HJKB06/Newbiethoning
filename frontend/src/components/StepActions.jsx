import { ArrowLeft, ArrowRight } from "lucide-react";

function StepActions({ onBack, onContinue, disabled, label = "Continue", loading }) {
  return (
    <div className="step-actions">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={16} strokeWidth={1.8} />Back</button>
      <button className="primary-button" type="button" onClick={onContinue} disabled={disabled || loading}>
        {loading ? "Finding your fit…" : label}
        {!loading ? <ArrowRight size={17} strokeWidth={1.8} /> : null}
      </button>
    </div>
  );
}

export default StepActions;
