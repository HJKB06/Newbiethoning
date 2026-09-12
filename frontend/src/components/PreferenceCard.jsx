import { Check } from "lucide-react";

function PreferenceCard({ icon: Icon, title, description, selected, onClick }) {
  return (
    <button className={`preference-card${selected ? " selected" : ""}`} type="button" aria-pressed={selected} onClick={onClick}>
      <span className="preference-icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></span>
      {selected ? <span className="selection-mark" aria-hidden="true"><Check size={14} strokeWidth={2.3} /></span> : null}
      <strong>{title}</strong>
      <span className="preference-description">{description}</span>
    </button>
  );
}

export default PreferenceCard;
