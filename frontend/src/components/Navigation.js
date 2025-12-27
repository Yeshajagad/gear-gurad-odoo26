import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          GearGuard
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/equipment">Equipment</Link></li>
          <li><Link to="/requests">Requests</Link></li>
          <li><Link to="/calendar">Calendar</Link></li>
          <li><Link to="/teams">Teams</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;