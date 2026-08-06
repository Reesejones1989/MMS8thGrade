import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function Home(): ReactElement {
  return (
    <div className="home">
      <div className="home-hero">
        <img
          src="https://cdn1.sportngin.com/attachments/logo_graphic/ff67-141939651/Mason_Football_Logo_medium.png"
          alt="Mason Middle School Football Logo"
          className="home-logo"
        />

        <h1>Mason Middle School Football</h1>
        <p>8th Grade Green &amp; White</p>
      </div>

      <div className="home-cards">
        <Link to="/green" className="home-card home-card-green">
          <h2>8th Grade Green</h2>
          <p>Schedule, scores &amp; game film</p>
        </Link>

        <Link to="/white" className="home-card home-card-white">
          <h2>8th Grade White</h2>
          <p>Schedule, scores &amp; game film</p>
        </Link>

        <Link to="/roster" className="home-card home-card-grey">
          <h2>Roster</h2>
          <p>Full team roster</p>
        </Link>
      </div>
    </div>
  );
}
