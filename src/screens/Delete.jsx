import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axi } from "../context/AuthContext";

const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Log the user in
      const loginResponse = await axi.post("/auth/login", { email, password });

      if (loginResponse.status === 200) {
        // Step 2: Ask for confirmation before deleting the account
        const confirmed = window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (confirmed) {
          // Step 3: Delete the account after confirmation
          const deleteResponse = await axi.delete("/user/delete-account", {
            data: { email, password }, // Pass the data here correctly
          });

          if (deleteResponse.status === 200) {
            alert("Account successfully deleted.");
            navigate("/login"); // Redirect the user to the login page
          }
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("Failed to delete account. Please try again.");
      console.error("Account deletion error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.headerText}>Delete Account</h2>
      <p style={styles.subText}>
        Please provide your email and password to delete your account
      </p>

      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        style={{
          ...styles.button,
          ...(loading ? styles.disabledButton : {}),
        }}
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Processing..." : "Delete Account"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  headerText: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  subText: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#777",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#ff6347",
    padding: "12px",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  disabledButton: {
    opacity: "0.7",
    cursor: "not-allowed",
  },
};

export default DeleteAccount;
