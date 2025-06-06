import React from 'react';
import { FaSearch, FaBullseye, FaShieldAlt } from 'react-icons/fa';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-hero-bg">
      <div className="about-container">

        {/* BLUE GLOW HEADER */}
        <div className="arena-title-box">
          <h2 className="about-title">🎮 Welcome to The BattleField</h2>
        </div>

        <p className="about-intro">
          At <span className="highlight">The BattleField</span>, we turn your Mobile Legends squad into a force to be feared.
          Our system sets up <strong>real battles</strong> with real stakes—powered by smart matchmaking and strategic betting.
        </p>

        <div className="about-section">
          <h2>💥 Who We Are</h2>
          <p>
            We’re not your average gaming community—we’re a squad of tech-savvy gamers who live for the adrenaline of competition.
            Our platform connects warriors like you with fair, intense, and thrilling matches.
          </p>
        </div>

        <div className="about-section">
          <h2>🛠 What We Do</h2>
          <ul className="about-list">
            <li>
              <FaSearch className="about-icon" />
              Match You Up: Smart, skill-based matchmaking that ensures every game is a real test.
            </li>
            <li>
              <FaBullseye className="about-icon" />
              Add the Stakes: Optional betting system so you can raise the pressure and the payoff.
            </li>
            <li>
              <FaShieldAlt className="about-icon" />
              Keep It Clean: We’re serious about fair play—no exploits, no excuses.
            </li>
          </ul>
        </div>

        <div className="about-section">
          <h2>🔥 Why We Do It</h2>
          <p>
            We believe competition should be earned, not given. Whether you’re a rising star or a team looking to dominate,
            we provide the battleground where legends are made.
          </p>
        </div>

        {/* RED GLOW CTA BOX */}
        <div className="cta-box-red">
          <p className="about-cta">
            <strong>Squad up. Bet smart. Win with pride.</strong><br />
            Are you ready to fight for glory?
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default AboutPage;
