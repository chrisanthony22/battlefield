import React from 'react';
import './GameRules.css'; // Make sure your CSS is saved here

const GameRules = () => {
  return (
    <div className="about-hero-bg">
      <div className="about-container">
        <div className="arena-title-box">
          <h2 className="about-title">Game Rules / Mga Patakaran</h2>
        </div>

        <p className="about-intro">
          Please read the following rules carefully. / <span className="highlight">Pakitandaan ang mga sumusunod na patakaran.</span>
        </p>

        <div className="about-section">
          <h2>1. Team Name / Pangalan ng Team</h2>
          <p>Each team must have a team name. / Bawat team ay dapat may pangalan.</p>
        </div>

        <div className="about-section">
          <h2>2. Agreed Game Time / Napagkasunduang Oras</h2>
          <p>
            Both teams must agree on the game schedule through chat. / Kailangang magkasundo ang dalawang team sa oras ng laro sa pamamagitan ng chat.
          </p>
        </div>

        <div className="about-section">
          <h2>3. Send Proof of Agreement / Magpadala ng Screenshot</h2>
          <p>
            Send a screenshot of the agreed time to the moderator named "d'moderator". / I-send sa moderator ang screenshot ng napagkasunduang oras.
          </p>
        </div>

        <div className="about-section">
          <h2>4. Betting Proof / Patunay ng Pustahan</h2>
          <p>
            Send a screenshot showing both teams sent the bet to the wallet address. / Ipadala ang screenshot na nagpapakita ng padalang coins sa wallet address.
          </p>
        </div>

        <div className="about-section">
          <h2>5. Minimum Players / Minimum na Manlalaro</h2>
          <p>
            Each team must have 5 players at the agreed time. / Dapat ay may 5 players ang bawat team sa oras ng laro.
          </p>
        </div>

        <div className="about-section">
          <h2>6. Grace Period / Palugit</h2>
          <p>
            A 10-minute grace period is allowed. If one team is incomplete after 10 minutes, the complete team wins by default. /
            May 10 minutong palugit. Kapag kulang pa rin ang isang team, panalo na ang kumpletong team.
          </p>
        </div>

        <div className="about-section">
          <h2>7. No-Show or Incomplete / Hindi Dumating o Kulang</h2>
          <p>
            If both teams are incomplete or do not show up, they can reschedule or request a refund. /
            Kapag parehong di nakumpleto ang teams, maaaring magpa-reschedule o humiling ng refund.
          </p>
        </div>

        <div className="about-section">
          <h2>8. Moderator’s Role / Gampanin ng Moderator</h2>
            <p>
            The moderator will arrange and create a custom match in Mobile Legends, invite players using their ML IDs, and monitor the game to verify the winner. /
            Ang moderator ang gagawa ng custom na laro sa Mobile Legends, mag-iimbita ng mga manlalaro gamit ang kanilang ML ID, at susubaybayan ang laro upang matukoy kung sino ang panalo.
            </p>
        </div>

        <div className="about-section">
          <h2>9. Winning and Payout / Panalo at Bayad</h2>
            <p>
            The winning team will receive <strong>90%</strong> of the total bet amount. The remaining <strong>10%</strong> goes to the system as a fee. 
            Payout is sent to the provided wallet address within 10 minutes to 2 hours. /
            Ang panalong team ay makakatanggap ng <strong>90%</strong> ng kabuuang taya. Ang <strong>10%</strong> ay mapupunta sa sistema bilang bayad.
            Maaaring matanggap ang panalo sa loob ng 10 minuto hanggang 2 oras.
            </p>
        </div>

        <div className="cta-box-red">
          <p className="about-cta">
            Always play fair and respect your opponents. / Laging maglaro ng patas at igalang ang kalaban.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameRules;
