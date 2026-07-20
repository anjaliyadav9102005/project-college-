import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="badge">
        ⚖ AI-Powered Legal Access For India
      </div>

      <h1>
        Simplifying Law & Justice through
        <br />
        <span>AI Copilots</span>
      </h1>

      <p>
        LegalEase is a legal assistant that automates police complaints,
        analyzes evidence via OCR, and indexes BNS 2023 legal codes with
        cited sources.
      </p>

      <div className="buttons">
        <button className="primary">
          Get Started For Free →
        </button>

        <button className="secondary">
          See Live Demo
        </button>
      </div>
    </section>
  );
}