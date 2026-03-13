"use client";

import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import styles from '../admin.module.css';

export default function DepartmentsPage() {
  const { departments, addDepartment, deleteDepartment, addSection, deleteSection } = useAdmin();
  const [newDeptName, setNewDeptName] = useState('');
  const [newSectionInputs, setNewSectionInputs] = useState<Record<string, string>>({});
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const handleAddDepartment = () => {
    if (newDeptName.trim()) {
      addDepartment(newDeptName.trim());
      setNewDeptName('');
    }
  };

  const handleAddSection = (deptId: string) => {
    const name = newSectionInputs[deptId];
    if (name && name.trim()) {
      addSection(deptId, name.trim());
      setNewSectionInputs(prev => ({ ...prev, [deptId]: '' }));
    }
  };

  const totalSections = departments.reduce((acc, d) => acc + d.sections.length, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Departments & Sections</h1>
        <p className={styles.pageSubtitle}>Manage institutional structures — {departments.length} departments, {totalSections} total sections</p>
      </div>

      {/* Add New Department */}
      <div className={styles.card} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <svg width="24" height="24" fill="none" stroke="#A78BFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"></path></svg>
        <input
          type="text"
          value={newDeptName}
          onChange={e => setNewDeptName(e.target.value)}
          placeholder="New Department Name (e.g., Biotechnology)"
          onKeyDown={e => e.key === 'Enter' && handleAddDepartment()}
          style={{
            flex: 1, padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
            color: 'var(--text-primary)', fontSize: '1rem', outline: 'none',
          }}
        />
        <button
          onClick={handleAddDepartment}
          style={{
            padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600,
            cursor: 'pointer', fontSize: '0.95rem', whiteSpace: 'nowrap',
            transition: 'opacity 0.2s',
          }}
        >
          + Add Department
        </button>
      </div>

      {/* Department Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        {departments.map(dept => {
          const isExpanded = expandedDept === dept.id;
          return (
            <div key={dept.id} className={styles.card} style={{ marginBottom: 0, transition: 'all 0.3s ease' }}>
              {/* Department Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}
                >
                  <div style={{ 
                    width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(79, 70, 229, 0.15)', color: '#A78BFA', fontSize: '1.2rem', fontWeight: 700,
                  }}>
                    {dept.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{dept.name}</h3>
                    <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {dept.sections.length} section{dept.sections.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <svg
                    width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ marginLeft: 'auto', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-secondary)' }}
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                <button
                  onClick={() => deleteDepartment(dept.id)}
                  title="Delete Department"
                  style={{
                    marginLeft: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px',
                    color: '#EF4444', cursor: 'pointer', display: 'flex', transition: 'all 0.2s',
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14H7L5 6m5-3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"></path>
                  </svg>
                </button>
              </div>

              {/* Expanded: Sections List */}
              {isExpanded && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                  {/* Sections */}
                  {dept.sections.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {dept.sections.map(sec => (
                        <div key={sec.id} style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.5rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px',
                          color: '#60A5FA', fontSize: '0.9rem', fontWeight: 500,
                        }}>
                          {sec.name}
                          <button
                            onClick={() => deleteSection(dept.id, sec.id)}
                            title={`Remove ${sec.name}`}
                            style={{
                              background: 'none', border: 'none', color: '#EF4444',
                              cursor: 'pointer', padding: '2px', display: 'flex', opacity: 0.7,
                            }}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>No sections yet. Add one below.</p>
                  )}

                  {/* Add Section Input */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={newSectionInputs[dept.id] || ''}
                      onChange={e => setNewSectionInputs(prev => ({ ...prev, [dept.id]: e.target.value }))}
                      placeholder="Section name (e.g., CSE-C)"
                      onKeyDown={e => e.key === 'Enter' && handleAddSection(dept.id)}
                      style={{
                        flex: 1, padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
                        color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => handleAddSection(dept.id)}
                      style={{
                        padding: '0.6rem 1.2rem', background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px',
                        color: '#10B981', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      + Add Section
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
