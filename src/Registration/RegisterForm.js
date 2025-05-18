import React, { useState } from "react";
import { db, ref, push } from '../firebase/firebase';
import './RegisterForm.css'; // Import the CSS

function RegisterForm() {
  const [formData, setFormData] = useState({
    teamname: "",
    password: "",
    username: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usersRef = ref(db, "Teams/");
    push(usersRef, formData)
      .then(() => {
        alert("User registered successfully!");
        setFormData({ teamname: "", password: "", username: "" });
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  return (
    <div className="register-container">
      <div className="left-pane">
        <h2>Register Your Team Now!</h2>
        <hr
  style={{
    borderColor: "white",
    borderWidth: "1px",
    borderStyle: "solid",
    boxShadow: "0 0 5px #00f0ff, 0 0 10px #00f0ff"
  }}
/>
        <div className="textCont">
            <p style={{ fontSize: '18px' }}>
            Your team's login credentials will be used for all transactions, game registration, 
            match selection, and communication via chat with other teams and the platform moderators.
            </p>
        </div>
      </div>
      <div className="right-pane">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            name="teamname"
            placeholder="Team Name"
            value={formData.teamname}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
