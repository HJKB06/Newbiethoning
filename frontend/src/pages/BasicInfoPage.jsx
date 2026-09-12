import { ArrowRight, BriefcaseBusiness, House, MapPin, TrainFront } from "lucide-react";

function BasicInfoPage({ data, onChange, onContinue }) {
  const submit = (event) => { event.preventDefault(); onContinue(); };
  return (
    <main className="basic-layout page-enter">
      <section className="step-intro"><span className="section-number">01</span><h1>Start with<br />the essentials.</h1><p>Your daily route and budget shape every recommendation that follows.</p></section>
      <form className="form-panel" onSubmit={submit}>
        <div className="panel-heading"><span>Basic information</span><span>Required</span></div>
        <label><span className="field-label"><House size={16} />Monthly housing budget</span><div className="currency-field"><span>₩</span><input type="number" min="1" placeholder="700,000" value={data.budget} onChange={(event) => onChange("budget", event.target.value)} required /></div></label>
        
        <label><span className="field-label"><MapPin size={16} />School</span>
          <select value={data.location} onChange={(event) => onChange("location", event.target.value)} required>
            <option value="" disabled hidden>Select your university</option>
            <option value="Korea University">Korea University</option>
            <option value="Seoul National University">Seoul National University</option>
            <option value="Yonsei University">Yonsei University</option>
            <option value="Hanyang University">Hanyang University</option>
            <option value="Sungkyunkwan University">Sungkyunkwan University</option>
          </select>
        </label>

        <div className="field-pair">
          <label><span className="field-label"><TrainFront size={16} />Maximum commute</span><select value={data.commute} onChange={(event) => onChange("commute", event.target.value)}><option value="20">20 minutes</option><option value="30">30 minutes</option><option value="40">40 minutes</option><option value="60">60 minutes</option></select></label>
          <label><span className="field-label"><BriefcaseBusiness size={16} />Job field</span><select value={data.job} onChange={(event) => onChange("job", event.target.value)}><option>IT / Software</option><option>Business</option><option>Engineering</option><option>Healthcare</option><option>Education</option></select></label>
        </div>
        <button className="form-submit" type="submit">Continue to housing<ArrowRight size={17} /></button>
      </form>
    </main>
  );
}

export default BasicInfoPage;