"use client";

import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import styles from '../admin.module.css';

export default function SubjectsPage() {
  const { subjects, departments, addSubject, deleteSubject } = useAdmin();
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDept, setNewDept] = useState('');
  const [addError, setAddError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddSubject = () => {
    setAddError('');
    if (!newName.trim() || !newCode.trim() || !newDept.trim()) {
      setAddError('Please fill in Subject Name, Code, and Department.');
      return;
    }
    const deptExists = departments.some(d => d.name.toLowerCase() === newDept.trim().toLowerCase());
    if (!deptExists) {
      setAddError(`No department named "${newDept.trim()}" exists. Please add it in the Departments section first.`);
      return;
    }
    // Check for duplicate code
    const codeExists = subjects.some(s => s.code.toLowerCase() === newCode.trim().toLowerCase());
    if (codeExists) {
      setAddError(`A subject with code "${newCode.trim().toUpperCase()}" already exists.`);
      return;
    }
    const matchedDept = departments.find(d => d.name.toLowerCase() === newDept.trim().toLowerCase())!;
    addSubject(newName.trim(), newCode.trim().toUpperCase(), matchedDept.name);
    setNewName('');
    setNewCode('');
    setNewDept('');
  };

  // Group subjects by department
  const grouped: Record<string, typeof subjects> = {};
  subjects.forEach(s => {
    if (!grouped[s.department]) grouped[s.department] = [];
    grouped[s.department].push(s);
  });

  const filtered = searchTerm
    ? subjects.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Subjects Management</h1>
        <p className={styles.pageSubtitle}>{subjects.length} subjects across {Object.keys(grouped).length} departments</p>
      </div>

      {/* Add New Subject */}
      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" fill="none" stroke="#A78BFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          Add New Subject
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text" value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Subject Name (e.g., Artificial Intelligence)"
            style={{ flex: '1 1 220px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
          />
          <input
            type="text" value={newCode} onChange={e => setNewCode(e.target.value)}
            placeholder="Code (e.g., CS502)"
            style={{ flex: '0 1 140px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', textTransform: 'uppercase' }}
          />
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <input
              list="subj-dept-list" type="text" value={newDept}
              onChange={e => { setNewDept(e.target.value); setAddError(''); }}
              placeholder="Department"
              onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${addError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
            />
            <datalist id="subj-dept-list">
              {departments.map(d => <option key={d.id} value={d.name} />)}
            </datalist>
          </div>
          <button onClick={handleAddSubject}
            style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
          >
            + Add Subject
          </button>
        </div>
        {addError && (
          <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {addError}
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by subject name, code, or department..."
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
        />
      </div>

      {/* Subject List */}
      {filtered ? (
        /* Flat search results */
        <div>
          {filtered.length === 0 && (
            <div className={styles.card} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No subjects found matching &quot;{searchTerm}&quot;.</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.75rem' }}>
            {filtered.map(sub => (
              <SubjectCard key={sub.id} sub={sub} deleteSubject={deleteSubject} />
            ))}
          </div>
        </div>
      ) : (
        /* Grouped by department */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {Object.entries(grouped).map(([deptName, subs]) => (
            <div key={deptName}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.12)', color: '#60A5FA', fontWeight: 700, fontSize: '0.9rem' }}>
                  {deptName.charAt(0)}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{deptName}</h2>
                <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {subs.length} subject{subs.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.75rem' }}>
                {subs.map(sub => (
                  <SubjectCard key={sub.id} sub={sub} deleteSubject={deleteSubject} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Subject Card Component ----
function SubjectCard({ sub, deleteSubject }: { sub: { id: string; name: string; code: string; department: string }; deleteSubject: (id: string) => void }) {
  return (
    <div className={styles.card} style={{ marginBottom: 0, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {/* Code Badge */}
      <div style={{
        padding: '0.4rem 0.7rem', background: 'rgba(79,70,229,0.12)',
        border: '1px solid rgba(79,70,229,0.25)', borderRadius: '8px',
        color: '#A78BFA', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace',
        whiteSpace: 'nowrap', letterSpacing: '0.5px',
      }}>
        {sub.code}
      </div>
      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.name}</p>
      </div>
      {/* Delete */}
      <button onClick={() => deleteSubject(sub.id)} title={`Delete ${sub.name}`}
        style={{ flexShrink: 0, padding: '0.4rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14H7L5 6m5-3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"></path></svg>
      </button>
    </div>
  );
}
