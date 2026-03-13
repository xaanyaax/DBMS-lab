"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../login.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    // Hardcoded Admin Credentials Validation
    const normalizedEmail = email.toLowerCase();
    const isValidEmail = normalizedEmail === "23dcs004@nith.ac.in" || normalizedEmail === "23dcs004.nith.ac.in";
    
    if (isValidEmail && password === "23dcs004") {
      console.log("Admin authenticated successfully.");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid admin credentials. Access Denied.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>Admin Console</h1>
            <p className={styles.subtitle}>System Management Access restrictied.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Admin Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nith.ac.in"
              className={styles.input}
              autoComplete="email"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              autoComplete="current-password"
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>

          <button type="submit" className={styles.button}>
            Secure Sign In
          </button>
        </form>

        <Link href="/" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
