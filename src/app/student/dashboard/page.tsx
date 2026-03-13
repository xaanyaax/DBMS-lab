"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Timetable from '@/components/Timetable';
import styles from './dashboard.module.css';

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  // Extract roll number/name part from email (e.g. 23dcs004@nith.ac.in -> 23dcs004)
  const studentIdentifier = emailParam ? emailParam.split('@')[0].toUpperCase() : "STUDENT";

  return (
    <div className={styles.dashboardContainer}>
      {/* Dashboard Header */}
      <header className={styles.header}>
        <div className={styles.welcomeSection}>
          <div className={styles.avatar}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <h1 className={styles.greeting}>Welcome, {studentIdentifier}</h1>
            <p className={styles.emailDisplay}>
              {emailParam || "student@nith.ac.in"} 
              <span className={styles.badge}>VERIFIED</span>
            </p>
          </div>
        </div>

        <Link href="/login/student" className={styles.logoutButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </Link>
      </header>

      {/* Main Content Area - Timetable */}
      <main className={styles.mainContent}>
        <Timetable identifier="A" role="student" />
      </main>
    </div>
  );
}
