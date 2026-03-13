"use client";

import { useState, useMemo } from 'react';
import { useAdmin, Timetable, TimetableSlot } from '../AdminContext';
import styles from '../admin.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // 9AM–6PM (17 = 5–6 PM)
const HOUR_LABELS: Record<number, string> = {
  9: '9:00', 10: '10:00', 11: '11:00', 12: '12:00',
  13: '1:00', 14: '2:00', 15: '3:00', 16: '4:00', 17: '5:00',
};

// Slot colors for subjects
const SLOT_COLORS = [
  { bg: 'rgba(99,102,241,0.18)', border: 'rgba(99,102,241,0.4)', text: '#A5B4FC' },
  { bg: 'rgba(16,185,129,0.18)', border: 'rgba(16,185,129,0.4)', text: '#6EE7B7' },
  { bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.4)', text: '#FCD34D' },
  { bg: 'rgba(236,72,153,0.18)', border: 'rgba(236,72,153,0.4)', text: '#F9A8D4' },
  { bg: 'rgba(59,130,246,0.18)', border: 'rgba(59,130,246,0.4)', text: '#93C5FD' },
  { bg: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.4)', text: '#C4B5FD' },
  { bg: 'rgba(20,184,166,0.18)', border: 'rgba(20,184,166,0.4)', text: '#5EEAD4' },
  { bg: 'rgba(244,63,94,0.18)', border: 'rgba(244,63,94,0.4)', text: '#FDA4AF' },
];

// ---- Subject-Faculty assignment for wizard ----
interface SubjectAssignment {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  hoursPerWeek: number;
  error?: string;
}

export default function TimetablesPage() {
  const { departments, subjects, faculty, classrooms, timetables, addTimetable, updateTimetable, deleteTimetable } = useAdmin();
  const [activeTab, setActiveTab] = useState<'section' | 'faculty'>('section');
  const [showWizard, setShowWizard] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedTT, setExpandedTT] = useState<string | null>(null);

  // ---- GROUP TIMETABLES BY DEPARTMENT ----
  const grouped: Record<string, Timetable[]> = {};
  timetables.forEach(tt => {
    if (!grouped[tt.department]) grouped[tt.department] = [];
    grouped[tt.department].push(tt);
  });

  // ---- FACULTY TIMETABLE DERIVATION ----
  const facultySchedules = useMemo(() => {
    const map: Record<string, { faculty: typeof faculty[0]; slots: (TimetableSlot & { department: string; section: string })[] }> = {};
    faculty.forEach(f => {
      map[f.id] = { faculty: f, slots: [] };
    });
    timetables.forEach(tt => {
      tt.slots.forEach(slot => {
        const matchedFac = faculty.find(f => f.name === slot.facultyName);
        if (matchedFac && map[matchedFac.id]) {
          map[matchedFac.id].slots.push({ ...slot, department: tt.department, section: tt.section });
        }
      });
    });
    return Object.values(map).filter(e => e.slots.length > 0);
  }, [timetables, faculty]);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Timetable Management</h1>
        <p className={styles.pageSubtitle}>{timetables.length} timetable{timetables.length !== 1 ? 's' : ''} generated</p>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setEditId(null); setShowWizard(true); }}
          style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Generate New Timetable
        </button>
        {timetables.length > 0 && (
          <select onChange={e => { if (e.target.value) { setEditId(e.target.value); setShowWizard(true); } }} value=""
            style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', cursor: 'pointer' }}>
            <option value="">Edit Existing...</option>
            {timetables.map(tt => (
              <option key={tt.id} value={tt.id}>{tt.department} — {tt.section}</option>
            ))}
          </select>
        )}

        {/* Tab Switcher */}
        <div style={{ marginLeft: 'auto', display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setActiveTab('section')}
            style={{ padding: '0.6rem 1.25rem', border: 'none', background: activeTab === 'section' ? 'rgba(79,70,229,0.2)' : 'transparent', color: activeTab === 'section' ? '#A5B4FC' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            Section View
          </button>
          <button onClick={() => setActiveTab('faculty')}
            style={{ padding: '0.6rem 1.25rem', border: 'none', background: activeTab === 'faculty' ? 'rgba(79,70,229,0.2)' : 'transparent', color: activeTab === 'faculty' ? '#A5B4FC' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            Faculty View
          </button>
        </div>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <TimetableWizard
          editTimetable={editId ? timetables.find(t => t.id === editId) || null : null}
          existingTimetables={timetables}
          onSave={(tt) => {
            const existingId = tt.id || timetables.find(t => t.department === tt.department && t.section === tt.section)?.id;
            if (existingId && (editId || timetables.some(t => t.id === existingId))) {
              updateTimetable(tt.id || existingId, tt);
            } else {
              addTimetable(tt);
            }
            setShowWizard(false);
            setEditId(null);
          }}
          onEditExisting={(id) => {
            setEditId(id);
          }}
          onCancel={() => { setShowWizard(false); setEditId(null); }}
          departments={departments}
          subjects={subjects}
          faculty={faculty}
          classrooms={classrooms}
        />
      )}

      {/* Content */}
      {timetables.length === 0 && !showWizard ? (
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem' }}>
          <svg width="48" height="48" fill="none" stroke="#A78BFA" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: '1rem', opacity: 0.6 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>No Timetables Yet</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Click &quot;Generate New Timetable&quot; to create your first schedule.</p>
        </div>
      ) : activeTab === 'section' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Object.entries(grouped).map(([dept, tts]) => (
            <div key={dept}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }}></div>
                {dept}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tts.map(tt => (
                  <div key={tt.id} className={styles.card} style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                      onClick={() => setExpandedTT(expandedTT === tt.id ? null : tt.id)}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(79,70,229,0.12)', color: '#A78BFA' }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{tt.section}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lunch: {tt.lunchSlot === '12-1' ? '12:00–1:00 PM' : '1:00–2:00 PM'} · {tt.slots.length} lectures/week</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteTimetable(tt.id); }}
                        style={{ padding: '0.4rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14H7L5 6m5-3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"></path></svg>
                      </button>
                      <svg width="20" height="20" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: expandedTT === tt.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    {expandedTT === tt.id && (
                      <div style={{ marginTop: '1rem' }}>
                        <TimetableGrid slots={tt.slots} lunchSlot={tt.lunchSlot} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Faculty View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {facultySchedules.length === 0 ? (
            <div className={styles.card} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No faculty schedules yet. Generate section timetables first.</div>
          ) : facultySchedules.map(({ faculty: fac, slots }) => (
            <div key={fac.id} className={styles.card} style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={() => setExpandedTT(expandedTT === fac.id ? null : fac.id)}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {fac.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{fac.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fac.department} · {slots.length} lectures/week</p>
                </div>
                <svg width="20" height="20" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: expandedTT === fac.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              {expandedTT === fac.id && (
                <div style={{ marginTop: '1rem' }}>
                  <TimetableGrid slots={slots} lunchSlot="12-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================================
// TIMETABLE GRID COMPONENT
// ================================
function TimetableGrid({ slots, lunchSlot }: { slots: TimetableSlot[]; lunchSlot: string }) {
  const subjectColorMap: Record<string, typeof SLOT_COLORS[0]> = {};
  let colorIdx = 0;
  slots.forEach(s => {
    if (!subjectColorMap[s.subjectCode]) {
      subjectColorMap[s.subjectCode] = SLOT_COLORS[colorIdx % SLOT_COLORS.length];
      colorIdx++;
    }
  });

  const getSlot = (day: string, hour: number) => slots.find(s => s.day === day && s.startHour === hour);
  const lunchHour = lunchSlot === '12-1' ? 12 : 13;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontWeight: 500, width: 70, textAlign: 'left' }}>Time</th>
            {DAYS.map(day => (
              <th key={day} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center' }}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map(hour => (
            <tr key={hour}>
              <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                {HOUR_LABELS[hour]} – {HOUR_LABELS[hour + 1] || '6:00'}
              </td>
              {DAYS.map(day => {
                if (hour === lunchHour) {
                  return (
                    <td key={day} style={{ padding: '0.3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                      <div style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.7rem', fontStyle: 'italic' }}>Lunch</div>
                    </td>
                  );
                }
                const slot = getSlot(day, hour);
                if (slot) {
                  const color = subjectColorMap[slot.subjectCode] || SLOT_COLORS[0];
                  return (
                    <td key={day} style={{ padding: '0.3rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ padding: '0.4rem 0.5rem', background: color.bg, border: `1px solid ${color.border}`, borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 600, color: color.text, fontSize: '0.75rem' }}>{slot.subjectCode}</p>
                        <p style={{ margin: '0.1rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.65rem' }}>{slot.facultyName.split(' ').slice(-1)[0]}</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.6rem', opacity: 0.7 }}>{slot.classroom}</p>
                      </div>
                    </td>
                  );
                }
                return (
                  <td key={day} style={{ padding: '0.3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', minHeight: 36 }}></div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Subject-Faculty assignment for wizard ----
interface SubjectAssignment {
  id: string; // unique client-side id for list rendering
  department: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  hoursPerWeek: number;
  venue: string;
  classroom: string;
  error?: string;
}

// ================================
// TIMETABLE GENERATION WIZARD
// ================================
function TimetableWizard({
  editTimetable,
  existingTimetables,
  onSave,
  onEditExisting,
  onCancel,
  departments,
  subjects: allSubjects,
  faculty: allFaculty,
  classrooms: allClassrooms,
}: {
  editTimetable: Timetable | null;
  existingTimetables: Timetable[];
  onSave: (tt: Timetable) => void;
  onEditExisting: (id: string) => void;
  onCancel: () => void;
  departments: { id: string; name: string; sections: { id: string; name: string }[] }[];
  subjects: { id: string; name: string; code: string; department: string }[];
  faculty: { id: string; name: string; email: string; department: string; subjects: string[] }[];
  classrooms: { id: string; name: string; location: string; capacity?: number }[];
}) {
  const [step, setStep] = useState(editTimetable ? 2 : 1);
  const [selectedDept, setSelectedDept] = useState(editTimetable?.department || '');
  const [selectedSection, setSelectedSection] = useState(editTimetable?.section || '');
  
  // existing timetable detection
  const existingForSection = useMemo(() => {
    return existingTimetables.find(t => t.department === selectedDept && t.section === selectedSection);
  }, [selectedDept, selectedSection, existingTimetables]);

  const [assignments, setAssignments] = useState<SubjectAssignment[]>(() => {
    if (!editTimetable) return [];
    // Convert editTimetable slots back into assignments
    const map: Record<string, SubjectAssignment> = {};
    editTimetable.slots.forEach(slot => {
      if (!map[slot.subjectCode]) {
        map[slot.subjectCode] = {
          id: Math.random().toString(),
          department: allSubjects.find(s => s.code === slot.subjectCode)?.department || '',
          subjectId: allSubjects.find(s => s.code === slot.subjectCode)?.id || '',
          subjectCode: slot.subjectCode,
          subjectName: slot.subjectName,
          facultyId: allFaculty.find(f => f.name === slot.facultyName)?.id || '',
          facultyName: slot.facultyName,
          hoursPerWeek: 0,
          venue: allClassrooms.find(c => c.name === slot.classroom)?.location || '',
          classroom: slot.classroom,
        };
      }
      map[slot.subjectCode].hoursPerWeek++;
    });
    return Object.values(map);
  });

  const [lunchSlot, setLunchSlot] = useState<'12-1' | '1-2'>(editTimetable?.lunchSlot || '12-1');
  const [avoidContinuous, setAvoidContinuous] = useState(true);
  const [maxConsecutive, setMaxConsecutive] = useState(2);
  const [generatedSlots, setGeneratedSlots] = useState<TimetableSlot[]>(editTimetable?.slots || []);
  const [assignError, setAssignError] = useState('');

  // Extract unique venues
  const venues = useMemo(() => Array.from(new Set(allClassrooms.map(c => c.location))), [allClassrooms]);

  const goToStep2 = () => {
    if (!selectedDept || !selectedSection || existingForSection) return;
    setStep(2);
  };

  const addSubjectRow = () => {
    setAssignments(prev => [...prev, {
      id: Math.random().toString(),
      department: selectedDept, // default to section's dept
      subjectId: '',
      subjectCode: '',
      subjectName: '',
      facultyId: '',
      facultyName: '',
      hoursPerWeek: 3,
      venue: '',
      classroom: '',
    }]);
  };

  const removeSubjectRow = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const updateAssignment = (id: string, field: string, value: string | number) => {
    setAssignments(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updated: SubjectAssignment = { ...a, [field]: value, error: undefined };
      
      if (field === 'department') {
        // Reset subject and faculty when department changes
        updated.subjectId = '';
        updated.subjectCode = '';
        updated.subjectName = '';
        updated.facultyId = '';
        updated.facultyName = '';
      } else if (field === 'subjectId') {
        const sub = allSubjects.find(s => s.id === value);
        if (sub) {
          updated.subjectCode = sub.code;
          updated.subjectName = sub.name;
        }
        updated.facultyId = '';
        updated.facultyName = '';
      } else if (field === 'facultyId') {
        const fac = allFaculty.find(f => f.id === value);
        if (fac) {
          updated.facultyName = fac.name;
        }
      } else if (field === 'venue') {
        updated.classroom = '';
      }
      return updated;
    }));
  };

  const goToStep3 = () => {
    if (assignments.length === 0) {
      setAssignError('Please add at least one subject.');
      return;
    }
    const missingFields = assignments.filter(a => !a.subjectId || !a.facultyId);
    if (missingFields.length > 0) {
      setAssignError('Please select a subject and faculty for all rows.');
      return;
    }
    setAssignError('');
    setStep(3);
  };

  const goToStep4 = () => {
    const missingRooms = assignments.filter(a => !a.venue || !a.classroom);
    if (missingRooms.length > 0) {
      setAssignError('Please assign a venue and classroom for all subjects.');
      return;
    }
    setAssignError('');
    generateTimetable();
  };

  // ---- AUTO-GENERATE TIMETABLE ----
  const generateTimetable = () => {
    const slots: TimetableSlot[] = [];
    const activeAssignments = assignments.filter(a => a.hoursPerWeek > 0 && a.facultyId && a.classroom);
    const lunchHour = lunchSlot === '12-1' ? 12 : 13;
    const availableHours = HOURS.filter(h => h !== lunchHour);

    // Track per-day usage to distribute evenly
    const dayUsage: Record<string, number[]> = {};
    DAYS.forEach(d => { dayUsage[d] = []; });

    // Distribute assignments across the week
    activeAssignments.forEach((assignment, assignIdx) => {
      let remaining = assignment.hoursPerWeek;
      let dayIdx = assignIdx % 5; // Start from different days for different subjects

      while (remaining > 0) {
        const day = DAYS[dayIdx % 5];
        // Find a free slot on this day
        const freeHour = availableHours.find(h => {
          if (dayUsage[day].includes(h)) return false;
          // If avoidContinuous, check neighbors
          if (avoidContinuous && dayUsage[day].length > 0) {
            const lastUsed = dayUsage[day][dayUsage[day].length - 1];
            if (Math.abs(h - lastUsed) <= 1) {
              // Allow if we can't find anything better (second pass)
              return false;
            }
          }
          return true;
        }) || availableHours.find(h => !dayUsage[day].includes(h)); // fallback: any free hour

        if (freeHour !== undefined) {
          slots.push({
            day,
            startHour: freeHour,
            endHour: freeHour + 1,
            subjectCode: assignment.subjectCode,
            subjectName: assignment.subjectName,
            facultyName: assignment.facultyName,
            classroom: assignment.classroom,
          });
          dayUsage[day].push(freeHour);
          dayUsage[day].sort((a, b) => a - b);
          remaining--;
        }
        dayIdx++;
        if (dayIdx > assignIdx % 5 + 25) break; // safety
      }
    });

    setGeneratedSlots(slots);
    setStep(4);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'var(--card-bg, #1a1a2e)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', maxWidth: 900, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{editTimetable ? 'Edit Timetable' : 'Generate New Timetable'}</h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {['Section', 'Subjects & Faculty', 'Constraints', 'Preview & Save'].map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, background: step > i + 1 ? 'rgba(16,185,129,0.2)' : step === i + 1 ? 'rgba(79,70,229,0.3)' : 'rgba(255,255,255,0.05)', color: step > i + 1 ? '#10B981' : step === i + 1 ? '#A5B4FC' : 'var(--text-secondary)', border: `2px solid ${step > i + 1 ? 'rgba(16,185,129,0.4)' : step === i + 1 ? 'rgba(79,70,229,0.5)' : 'rgba(255,255,255,0.1)'}` }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: step === i + 1 ? '#A5B4FC' : 'var(--text-secondary)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ---- STEP 1: SELECT DEPARTMENT & SECTION ---- */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Department</label>
                <select value={selectedDept} onChange={e => { setSelectedDept(e.target.value); setSelectedSection(''); }} disabled={!!editTimetable}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  <option value="">Select department...</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Section</label>
                <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} disabled={!selectedDept || !!editTimetable}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  <option value="">Select section...</option>
                  {departments.find(d => d.name === selectedDept)?.sections.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>
            
            {/* EXISTING TIMETABLE DETECTION */}
            {existingForSection && !editTimetable && (
              <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#FCD34D' }}>⚠️ Timetable Already Exists</h3>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>A timetable for <strong>{selectedSection}</strong> ({selectedDept}) is already present.</p>
                <button onClick={() => onEditExisting(existingForSection.id)}
                  style={{ padding: '0.6rem 1.5rem', background: '#F59E0B', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  Edit Existing Timetable
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={goToStep2} disabled={!selectedDept || !selectedSection || !!existingForSection}
                style={{ padding: '0.75rem 2rem', background: selectedDept && selectedSection && !existingForSection ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: selectedDept && selectedSection && !existingForSection ? 'pointer' : 'not-allowed', opacity: selectedDept && selectedSection && !existingForSection ? 1 : 0.5 }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ---- STEP 2: ASSIGN SUBJECTS & FACULTY ---- */}
        {step === 2 && (
          <div>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Add subjects to teach in <strong style={{ color: 'var(--text-primary)' }}>{selectedSection}</strong>. You can pick subjects from any department.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '45vh', overflowY: 'auto', marginBottom: '1rem' }}>
              {assignments.map((a) => {
                const depSubjects = allSubjects.filter(s => s.department === a.department);
                // Filter faculty who have THIS specific subject name in their subjects array
                const eligibleFaculty = a.subjectName 
                  ? allFaculty.filter(f => f.subjects.some(s => s.toLowerCase() === a.subjectName.toLowerCase()))
                  : [];
                  
                return (
                  <div key={a.id} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <select value={a.department} onChange={e => updateAssignment(a.id, 'department', e.target.value)}
                        style={{ flex: '1 1 120px', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        <option value="">Dept...</option>
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                      
                      <select value={a.subjectId} onChange={e => updateAssignment(a.id, 'subjectId', e.target.value)} disabled={!a.department}
                        style={{ flex: '1 1 150px', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        <option value="">Select subject...</option>
                        {depSubjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                      </select>

                      <select value={a.facultyId} onChange={e => updateAssignment(a.id, 'facultyId', e.target.value)} disabled={!a.subjectId}
                        style={{ flex: '1 1 150px', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        <option value="">Select teacher...</option>
                        {eligibleFaculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input type="number" min={1} max={8} value={a.hoursPerWeek}
                          onChange={e => updateAssignment(a.id, 'hoursPerWeek', parseInt(e.target.value) || 1)}
                          style={{ width: 50, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', textAlign: 'center' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>hr/wk</span>
                      </div>

                      <button onClick={() => removeSubjectRow(a.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                    {a.subjectId && eligibleFaculty.length === 0 && (
                       <p style={{ margin: '0.5rem 0 0 0', color: '#F87171', fontSize: '0.75rem' }}>⚠️ No faculty found who can teach this subject. Add it to a faculty's profile first.</p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <button onClick={addSubjectRow} style={{ padding: '0.6rem 1.2rem', background: 'rgba(79,70,229,0.15)', border: '1px dashed rgba(79,70,229,0.5)', borderRadius: '8px', color: '#A5B4FC', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Subject
            </button>

            {assignError && <p style={{ marginTop: '0.75rem', color: '#F87171', fontSize: '0.85rem' }}>{assignError}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button onClick={() => setStep(1)} disabled={!!editTimetable}
                style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', cursor: !!editTimetable ? 'not-allowed' : 'pointer', opacity: !!editTimetable ? 0.5 : 1 }}>
                ← Back
              </button>
              <button onClick={goToStep3}
                style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ---- STEP 3: CLASSROOMS & CONSTRAINTS ---- */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Classrooms */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>🏛️ Assign Classrooms</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {assignments.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ flex: '1 1 150px' }}>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{a.subjectName}</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{a.facultyName}</p>
                      </div>
                      <select value={a.venue} onChange={e => updateAssignment(a.id, 'venue', e.target.value)}
                        style={{ flex: '1 1 120px', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        <option value="">Select Venue...</option>
                        {venues.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <select value={a.classroom} onChange={e => updateAssignment(a.id, 'classroom', e.target.value)} disabled={!a.venue}
                        style={{ flex: '1 1 120px', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        <option value="">Select Room...</option>
                        {allClassrooms.filter(c => c.location === a.venue).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lunch Break */}
              <div>
                <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>🍽️ Lunch Break</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {(['12-1', '1-2'] as const).map(opt => (
                    <label key={opt} style={{ flex: 1, padding: '1rem', background: lunchSlot === opt ? 'rgba(79,70,229,0.15)' : 'rgba(255,255,255,0.03)', border: `2px solid ${lunchSlot === opt ? 'rgba(79,70,229,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <input type="radio" checked={lunchSlot === opt} onChange={() => setLunchSlot(opt)} style={{ display: 'none' }} />
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: lunchSlot === opt ? '#A5B4FC' : 'var(--text-primary)' }}>
                        {opt === '12-1' ? '12:00 – 1:00 PM' : '1:00 – 2:00 PM'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div>
                <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>📐 Scheduling Preferences</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <input type="checkbox" checked={avoidContinuous} onChange={e => setAvoidContinuous(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#6366F1' }} />
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500 }}>Avoid continuous classes</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Try to add gaps between lectures when possible</p>
                  </div>
                </label>
              </div>
            </div>

            {assignError && <p style={{ marginTop: '0.75rem', color: '#F87171', fontSize: '0.85rem' }}>{assignError}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={() => setStep(2)}
                style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                ← Back
              </button>
              <button onClick={goToStep4}
                style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Generate Timetable
              </button>
            </div>
          </div>
        )}

        {/* ---- STEP 4: PREVIEW & SAVE ---- */}
        {step === 4 && (
          <div>
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p style={{ margin: 0, color: '#6EE7B7', fontSize: '0.9rem' }}>
                ✅ Timetable generated for <strong>{editTimetable ? editTimetable.section : selectedSection}</strong> ({editTimetable ? editTimetable.department : selectedDept}) — {generatedSlots.length} lectures/week
              </p>
            </div>

            <TimetableGrid slots={generatedSlots} lunchSlot={lunchSlot} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              {!editTimetable && (
                <button onClick={() => setStep(3)}
                  style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  ← Back
                </button>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
                <button onClick={onCancel}
                  style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => {
                  const tt: Timetable = {
                    id: editTimetable?.id || `tt-${Date.now()}`,
                    department: editTimetable?.department || selectedDept,
                    section: editTimetable?.section || selectedSection,
                    lunchSlot,
                    slots: generatedSlots,
                    createdAt: editTimetable?.createdAt || new Date().toISOString(),
                  };
                  onSave(tt);
                }}
                  style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  💾 Save Timetable
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
