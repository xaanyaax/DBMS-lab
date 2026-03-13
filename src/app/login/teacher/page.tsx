"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../login.module.css";

export default function TeacherLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.toLowerCase().endsWith("@nith.ac.in")) {
      setError("Please use your official college email (@nith.ac.in)");
      return;
    }

    // Redirect to the teacher dashboard with their email as a parameter
    console.log("Teacher login attempt with:", email);
    router.push(`/teacher/dashboard?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>Faculty Portal</h1>
            <p className={styles.subtitle}>Welcome back, Professor</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>College Email ID</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. professor@nith.ac.in"
              className={styles.input}
              autoComplete="email"
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>

          <button type="submit" className={styles.button}>
            Sign In
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
