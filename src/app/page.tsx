import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="TimeFlow Logo" width={40} height={40} className={styles.logoImage} />
          <span className={styles.logoText}>TimeFlow</span>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Master Your Schedule with <span className={styles.highlight}>TimeFlow</span>
          </h1>
          <p className={styles.subtitle}>
            The ultimate intelligent time table management system designed for educational institutions. Seamlessly organize classes, manage resources, and stay perfectly synchronized.
          </p>
        </div>

        <div className={styles.loginGrid}>
          {/* Admin Login */}
          <Link href="/login/admin" className={styles.loginCard}>
            <div className={styles.iconWrapper}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Administrator</h2>
              <p className={styles.cardDesc}>Manage global schedules, system parameters, and institutional settings.</p>
            </div>
            <button className={styles.loginButton}>Admin Login</button>
          </Link>

          {/* Teacher Login */}
          <Link href="/login/teacher" className={styles.loginCard}>
            <div className={styles.iconWrapper}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Teacher</h2>
              <p className={styles.cardDesc}>View your assigned classes, manage your availability, and track progress.</p>
            </div>
            <button className={styles.loginButton}>Teacher Login</button>
          </Link>

          {/* Student Login */}
          <Link href="/login/student" className={styles.loginCard}>
            <div className={styles.iconWrapper}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Student</h2>
              <p className={styles.cardDesc}>Access your personal timetable, upcoming classes, and room assignments.</p>
            </div>
            <button className={styles.loginButton}>Student Login</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
