import { Link } from "react-router";
import "./Landing.css";

function Landing() {
  return (
    <main className="landing-page">

      <div className="landing-content">

        <img
          src="/images/smartpakcoy-logo.png"
          alt="Smart Pakcoy"
          className="landing-logo"
        />


        <p className="landing-eyebrow">
          GREENHOUSE MONITORING SYSTEM
        </p>


        <h1>
          Smart Monitoring
          <br />
          for Pakcoy Greenhouse
        </h1>


        <p className="landing-description">
          Pantau kondisi suhu, kelembapan,
          dan intensitas cahaya greenhouse
          secara realtime.
        </p>


        <Link
          to="/dashboard"
          className="btn btn-success landing-button"
        >
          Masuk ke Dashboard
        </Link>

      </div>

    </main>
  );
}


export default Landing;