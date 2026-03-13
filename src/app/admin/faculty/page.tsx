"use client";

import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import styles from '../admin.module.css';

export default function FacultyPage() {
  const { faculty, departments, addFaculty, deleteFaculty, addSubjectToFaculty, deleteSubjectFromFaculty } = useAdmin();
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('');
  const [addError, setAddError] = useState('');
  const [subjectInputs, setSubjectInputs] = useState<Record<string, string>>({});
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddFaculty = () => {
    setAddError('');
    if (!newName.trim() || !newEmail.trim() || !newDept.trim()) {
      setAddError('Please fill in Name, Email, and Department.');
      return;
    }
    // Validate department exists
    const deptExists = departments.some(d => d.name.toLowerCase() === newDept.trim().toLowerCase());
    if (!deptExists) {
      setAddError(`No department named "${newDept.trim()}" exists. Please add it in the Departments section first, or choose from the list.`);
      return;
    }
    const matchedDept = departments.find(d => d.name.toLowerCase() === newDept.trim().toLowerCase())!;
    addFaculty(newName.trim(), newEmail.trim(), matchedDept.name);
    setNewName('');
    setNewEmail('');
    setNewDept('');
  };

  const handleAddSubject = (facultyId: string) => {
    const subject = subjectInputs[facultyId];
    if (subject && subject.trim()) {
      addSubjectToFaculty(facultyId, subject.trim());
      setSubjectInputs(prev => ({ ...prev, [facultyId]: '' }));
    }
  };

  // Group faculty by department
  const grouped: Record<string, typeof faculty> = {};
  faculty.forEach(f => {
    if (!grouped[f.department]) grouped[f.department] = [];
    grouped[f.department].push(f);
  });

  const filtered = searchTerm
    ? faculty.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : null; // null means show grouped view

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Faculty Management</h1>
        <p className={styles.pageSubtitle}>{faculty.length} registered faculty across {Object.keys(grouped).length} departments</p>
      </div>

      {/* Add New Faculty */}
      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" fill="none" stroke="#A78BFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Add New Faculty
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text" value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Faculty Name"
            style={{ flex: '1 1 200px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
          />
          <input
            type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
            placeholder="Email"
            style={{ flex: '1 1 200px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
          />
          {/* Department selector with datalist for autocomplete */}
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <input
              list="dept-suggestions" type="text" value={newDept} onChange={e => { setNewDept(e.target.value); setAddError(''); }}
              placeholder="Department"
              onKeyDown={e => e.key === 'Enter' && handleAddFaculty()}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${addError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
            />
            <datalist id="dept-suggestions">
              {departments.map(d => <option key={d.id} value={d.name} />)}
            </datalist>
          </div>
          <button onClick={handleAddFaculty}
            style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
          >
            + Add Faculty
          </button>
        </div>
        {addError && (
          <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {addError}
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, department, or subject..."
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
        />
      </div>

      {/* Faculty List — Grouped by Department or Flat Search */}
      {filtered ? (
        // Flat search results
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.length === 0 && (
            <div className={styles.card} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No faculty found matching &quot;{searchTerm}&quot;.</div>
          )}
          {filtered.map(fac => <FacultyCard key={fac.id} fac={fac} expandedFaculty={expandedFaculty} setExpandedFaculty={setExpandedFaculty} deleteFaculty={deleteFaculty} addSubjectToFaculty={addSubjectToFaculty} deleteSubjectFromFaculty={deleteSubjectFromFaculty} subjectInputs={subjectInputs} setSubjectInputs={setSubjectInputs} handleAddSubject={handleAddSubject} />)}
        </div>
      ) : (
        // Grouped by department view
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {Object.entries(grouped).map(([deptName, members]) => (
            <div key={deptName}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', fontWeight: 700, fontSize: '0.9rem' }}>
                  {deptName.charAt(0)}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{deptName}</h2>
                <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {members.map(fac => <FacultyCard key={fac.id} fac={fac} expandedFaculty={expandedFaculty} setExpandedFaculty={setExpandedFaculty} deleteFaculty={deleteFaculty} addSubjectToFaculty={addSubjectToFaculty} deleteSubjectFromFaculty={deleteSubjectFromFaculty} subjectInputs={subjectInputs} setSubjectInputs={setSubjectInputs} handleAddSubject={handleAddSubject} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Faculty Card Sub-Component ----
interface FacultyCardProps {
  fac: { id: string; name: string; email: string; department: string; subjects: string[] };
  expandedFaculty: string | null;
  setExpandedFaculty: (id: string | null) => void;
  deleteFaculty: (id: string) => void;
  addSubjectToFaculty: (id: string, sub: string) => void;
  deleteSubjectFromFaculty: (id: string, sub: string) => void;
  subjectInputs: Record<string, string>;
  setSubjectInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleAddSubject: (id: string) => void;
}

function FacultyCard({ fac, expandedFaculty, setExpandedFaculty, deleteFaculty, addSubjectToFaculty, deleteSubjectFromFaculty, subjectInputs, setSubjectInputs, handleAddSubject }: FacultyCardProps) {
  const isExpanded = expandedFaculty === fac.id;
  return (
    <div className={styles.card} style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => setExpandedFaculty(isExpanded ? null : fac.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(139,92,246,0.2))', border: '2px solid rgba(167,139,250,0.3)', color: '#A78BFA', fontWeight: 700, fontSize: '1rem' }}>
            {fac.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{fac.name}</h3>
            <p style={{ margin: '0.1rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{fac.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ padding: '0.25rem 0.6rem', background: 'rgba(16,185,129,0.12)', color: '#10B981', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
              {fac.subjects.length} subject{fac.subjects.length !== 1 ? 's' : ''}
            </span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-secondary)' }}>
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <button onClick={() => deleteFaculty(fac.id)} title="Remove Faculty"
          style={{ marginLeft: '0.75rem', padding: '0.45rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex' }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14H7L5 6m5-3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"></path></svg>
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subjects Can Teach</h4>
          {fac.subjects.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {fac.subjects.map(sub => (
                <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 500 }}>
                  {sub}
                  <button onClick={() => deleteSubjectFromFaculty(fac.id, sub)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '1px', display: 'flex', opacity: 0.7 }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>No subjects assigned yet.</p>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="text" value={subjectInputs[fac.id] || ''}
              onChange={e => setSubjectInputs(prev => ({ ...prev, [fac.id]: e.target.value }))}
              placeholder="Subject name (e.g., Machine Learning)"
              onKeyDown={e => e.key === 'Enter' && handleAddSubject(fac.id)}
              style={{ flex: 1, padding: '0.5rem 0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
            />
            <button onClick={() => handleAddSubject(fac.id)}
              style={{ padding: '0.5rem 0.9rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#10B981', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
            >
              + Add Subject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
