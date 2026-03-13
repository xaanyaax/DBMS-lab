"use client";

import { useAdmin } from '../AdminContext';
import styles from '../admin.module.css';

export default function AdminOverviewPage() {
  const { departments, faculty, subjects, classrooms, timetables } = useAdmin();
  const totalSections = departments.reduce((acc, d) => acc + d.sections.length, 0);
  const totalFacultySubjects = faculty.reduce((acc, f) => acc + f.subjects.length, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
         <h1 className={styles.pageTitle}>Admin Overview</h1>
         <p className={styles.pageSubtitle}>System status and metrics for NIT Hamirpur TimeFlow</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        
        {/* Departments Count - LIVE */}
        <div className={styles.card} style={{ padding: '1.5rem', marginBottom: 0 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: '12px' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
             </div>
             <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>Departments</h3>
           </div>
           <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{departments.length}</p>
           <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#10B981' }}>Active departments</p>
        </div>

        {/* Total Sections - LIVE */}
        <div className={styles.card} style={{ padding: '1.5rem', marginBottom: 0 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: 'rgba(167, 139, 250, 0.1)', color: '#A78BFA', borderRadius: '12px' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
             </div>
             <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>Total Sections</h3>
           </div>
           <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalSections}</p>
           <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Across all departments</p>
        </div>

        {/* Registered Faculty - LIVE */}
        <div className={styles.card} style={{ padding: '1.5rem', marginBottom: 0 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '12px' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             </div>
             <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>Registered Faculty</h3>
           </div>
           <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{faculty.length}</p>
           <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{totalFacultySubjects} subjects assigned</p>
        </div>

        {/* Registered Subjects - LIVE */}
        <div className={styles.card} style={{ padding: '1.5rem', marginBottom: 0 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: '12px' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
             </div>
             <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>Total Subjects</h3>
           </div>
           <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{subjects.length}</p>
           <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Across all departments</p>
        </div>

        {/* Classrooms - LIVE */}
        <div className={styles.card} style={{ padding: '1.5rem', marginBottom: 0 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', borderRadius: '12px' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
             </div>
             <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>Classrooms</h3>
           </div>
           <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{classrooms.length}</p>
           <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rooms & venues</p>
        </div>

        {/* Timetables - LIVE */}
        <div className={styles.card} style={{ padding: '1.5rem', marginBottom: 0 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', borderRadius: '12px' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
             </div>
             <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>Timetables</h3>
           </div>
           <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{timetables.length}</p>
           <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Generated schedules</p>
        </div>
      </div>

      {/* Quick Department Breakdown */}
      <div className={styles.card}>
         <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Department Breakdown</h2>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {departments.map(dept => (
               <div key={dept.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }}></div>
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>{dept.name}</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '6px' }}>
                    {dept.sections.length} section{dept.sections.length !== 1 ? 's' : ''}
                  </span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
