"use client";

import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import styles from '../admin.module.css';

export default function ClassroomsPage() {
  const { classrooms, addClassroom, deleteClassroom } = useAdmin();
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [addError, setAddError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [venueError, setVenueError] = useState('');
  const [extraVenues, setExtraVenues] = useState<string[]>([]); // venues with no rooms yet

  const handleAddClassroom = () => {
    setAddError('');
    if (!newName.trim() || !newLocation.trim()) {
      setAddError('Please fill in Classroom Name and Location.');
      return;
    }
    const exists = classrooms.some(c => c.name.toLowerCase() === newName.trim().toLowerCase());
    if (exists) {
      setAddError(`A classroom named "${newName.trim()}" already exists.`);
      return;
    }
    const cap = newCapacity ? parseInt(newCapacity) : undefined;
    addClassroom(newName.trim(), newLocation.trim(), cap);
    // Remove from extraVenues if a room is now added there
    setExtraVenues(prev => prev.filter(v => v.toLowerCase() !== newLocation.trim().toLowerCase()));
    setNewName('');
    setNewLocation('');
    setNewCapacity('');
  };

  const handleAddVenue = () => {
    setVenueError('');
    if (!newVenue.trim()) {
      setVenueError('Please enter a venue name.');
      return;
    }
    const allLocations = [...new Set([...classrooms.map(c => c.location), ...extraVenues])];
    const alreadyExists = allLocations.some(l => l.toLowerCase() === newVenue.trim().toLowerCase());
    if (alreadyExists) {
      setVenueError(`Venue "${newVenue.trim()}" already exists.`);
      return;
    }
    setExtraVenues(prev => [...prev, newVenue.trim()]);
    setNewVenue('');
  };

  // Group by location (include empty venues)
  const grouped: Record<string, typeof classrooms> = {};
  extraVenues.forEach(v => { grouped[v] = []; });
  classrooms.forEach(c => {
    if (!grouped[c.location]) grouped[c.location] = [];
    grouped[c.location].push(c);
  });

  const filtered = searchTerm
    ? classrooms.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  // All locations for autocomplete
  const locations = [...new Set([...classrooms.map(c => c.location), ...extraVenues])];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Classrooms & Venues</h1>
        <p className={styles.pageSubtitle}>{classrooms.length} rooms across {Object.keys(grouped).length} venues</p>
      </div>

      {/* Two-column: Add Venue + Add Room */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Add Venue */}
        <div className={styles.card} style={{ marginBottom: 0 }}>
          <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <svg width="18" height="18" fill="none" stroke="#FBBF24" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Add Venue / Location
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" value={newVenue} onChange={e => { setNewVenue(e.target.value); setVenueError(''); }}
              placeholder="e.g., New Academic Block"
              onKeyDown={e => e.key === 'Enter' && handleAddVenue()}
              style={{ flex: 1, padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${venueError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
            />
            <button onClick={handleAddVenue}
              style={{ padding: '0.65rem 1rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', color: '#FBBF24', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
            >+ Add</button>
          </div>
          {venueError && (
            <p style={{ margin: '0.5rem 0 0 0', color: '#F87171', fontSize: '0.8rem' }}>{venueError}</p>
          )}
        </div>
        {/* Add Room */}
        <div className={styles.card} style={{ marginBottom: 0 }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" fill="none" stroke="#A78BFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4-3v3"></path></svg>
            Add New Classroom
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Room Name (e.g., LH-7, CR-602)"
              style={{ flex: '1 1 140px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
            />
            <div style={{ flex: '1 1 180px', position: 'relative' }}>
              <input
                list="location-list" type="text" value={newLocation}
                onChange={e => { setNewLocation(e.target.value); setAddError(''); }}
                placeholder="Venue / Location"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${addError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
              />
              <datalist id="location-list">
                {locations.map(l => <option key={l} value={l} />)}
              </datalist>
            </div>
            <input
              type="number" value={newCapacity} onChange={e => setNewCapacity(e.target.value)}
              placeholder="Capacity"
              onKeyDown={e => e.key === 'Enter' && handleAddClassroom()}
              style={{ flex: '0 1 90px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
            />
            <button onClick={handleAddClassroom}
              style={{ padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
            >
              + Add Room
            </button>
          </div>
          {addError && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {addError}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by room name or location..."
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
        />
      </div>

      {/* Classroom List */}
      {filtered ? (
        <div>
          {filtered.length === 0 && (
            <div className={styles.card} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No classrooms found matching &quot;{searchTerm}&quot;.</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
            {filtered.map(room => (
              <RoomCard key={room.id} room={room} deleteClassroom={deleteClassroom} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {Object.entries(grouped).map(([loc, rooms]) => (
            <div key={loc}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.12)', color: '#FBBF24', fontWeight: 700, fontSize: '0.9rem' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{loc}</h2>
                <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {rooms.length} room{rooms.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                {rooms.map(room => (
                  <RoomCard key={room.id} room={room} deleteClassroom={deleteClassroom} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomCard({ room, deleteClassroom }: { room: { id: string; name: string; location: string; capacity?: number }; deleteClassroom: (id: string) => void }) {
  return (
    <div className={styles.card} style={{ marginBottom: 0, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {/* Room Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(59,130,246,0.12)', color: '#60A5FA',
      }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
      </div>
      {/* Name + Location */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{room.name}</p>
        <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{room.location}</p>
      </div>
      {/* Capacity badge */}
      {room.capacity && (
        <span style={{ padding: '0.25rem 0.6rem', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {room.capacity} seats
        </span>
      )}
      {/* Delete */}
      <button onClick={() => deleteClassroom(room.id)} title={`Delete ${room.name}`}
        style={{ flexShrink: 0, padding: '0.4rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14H7L5 6m5-3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"></path></svg>
      </button>
    </div>
  );
}
