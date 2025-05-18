import React, { useState } from "react";
import { db, ref } from "../firebase/firebase";
import { get, child } from "firebase/database";
import { useNavigate } from "react-router-dom";
import TronAlert from "../components/TronAlert";

function LoginForm() {
  const [credentials, setCredentials] = useState({ teamname: "", password: "" });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const snapshot = await get(child(ref(db), "Teams"));
    let userFound = false;

    if (snapshot.exists()) {
      snapshot.forEach((childSnap) => {
        const data = childSnap.val();
        if (
          data.teamname === credentials.teamname &&
          data.password === credentials.password
        ) {
          localStorage.setItem("loggedInUser", JSON.stringify(data));
          window.dispatchEvent(new Event("userLoggedIn"));
          userFound = true;

          // Show success alert first
          setAlert({ message: "Login successful. Welcome!", type: "success" });

          // Navigate after 3 seconds delay to allow alert to show
          setTimeout(() => {
            setAlert(null);
            navigate("/"); // Or wherever you want to redirect
          }, 3000);
        }
      });
    }

    if (!userFound) {
      setAlert({ message: "Invalid credentials!", type: "error" });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div>
      {alert && (
        <TronAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          name="teamname"
          placeholder="Team Name"
          value={credentials.teamname}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
