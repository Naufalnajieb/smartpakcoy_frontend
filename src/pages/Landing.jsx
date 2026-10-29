import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import "./Landing.css";

function Landing() {
  return (
    <main className="landing-page">
      <div className="landing-shape landing-shape-one" />
      <div className="landing-shape landing-shape-two" />
      <div className="landing-shape landing-shape-three" />

      <section className="landing-content">
        <div className="landing-logo-wrap">
          <img
            src="/images/smartpakcoy-logo.png"
            alt="Logo Smart Greenhouse"
            className="landing-logo"
          />
        </div>

        <p className="landing-eyebrow">
          SMART GREENHOUSE
        </p>

        <h1>
          Smart Monitoring
          <br />
          <span>for Pakcoy Greenhouse</span>
        </h1>

        <p className="landing-description">
          Pantau kondisi suhu, kelembapan, dan intensitas cahaya
          greenhouse secara real-time melalui dashboard.
        </p>

        <Link
          to="/dashboard"
          className="landing-button"
        >
          <span>Masuk ke Dashboard</span>
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default Landing;