import type { ReactElement } from "react";
import { NavLink } from "react-router-dom";

function Nav(): ReactElement {
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <NavLink to="/" aria-label="Home" className="navbar-brand">
        <img
          src="https://cdn1.sportngin.com/attachments/logo_graphic/ff67-141939651/Mason_Football_Logo_medium.png"
          alt="Mason Middle School Football Logo"
          className="navbar-logo"
        />

        <div className="navbar-title">
          Mason Middle School
          <span>Football</span>
        </div>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/green" className={linkClass}>
          <span className="nav-dot nav-dot-green" />
          8th Grade Green
        </NavLink>

        <NavLink to="/white" className={linkClass}>
          <span className="nav-dot nav-dot-white" />
          8th Grade White
        </NavLink>

        <NavLink to="/roster" className={linkClass}>
          <span className="nav-dot nav-dot-grey" />
          Roster
        </NavLink>
      </div>
    </nav>
  );
}

export default Nav;
