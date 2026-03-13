"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Timetable from '@/components/Timetable';
import styles from '../../student/dashboard/dashboard.module.css';

export default function TeacherDashboard() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  // Extract name part from email (e.g. pradeep.kumar@nith.ac.in -> Pradeep Kumar)
  const namePart = emailParam ? emailParam.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') : "Faculty Member";

  return (
    <div className={styles.dashboardContainer}>
      {/* Dashboard Header */}
      <header className={styles.header}>
        <div className={styles.welcomeSection}>
          <div className={styles.avatar}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
               <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div>
            <h1 className={styles.greeting}>Welcome, Prof. {namePart}</h1>
            <p className={styles.emailDisplay}>
              {emailParam || "faculty@nith.ac.in"} 
              <span className={styles.badge}>VERIFIED FACULTY</span>
            </p>
          </div>
        </div>

        <Link href="/login/teacher" className={styles.logoutButton}>
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
        <Timetable identifier={namePart} role="teacher" />
      </main>
    </div>
  );
}
