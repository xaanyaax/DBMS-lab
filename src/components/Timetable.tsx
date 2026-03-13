import styles from './Timetable.module.css';

// Mock schedule data for a Student (Section A)
const STUDENT_SCHEDULE = [
  { day: 1, startHour: 9, duration: 2, subject: "Data Structures", room: "LT-1", teacher: "Dr. Sharma", color: "colorBlue" },
  { day: 1, startHour: 11, duration: 1, subject: "Algorithms", room: "LT-2", teacher: "Prof. Gupta", color: "colorPurple" },
  { day: 1, startHour: 14, duration: 2, subject: "DBMS Lab", room: "Lab-3", teacher: "Mr. Verma", color: "colorGreen" },
  
  { day: 2, startHour: 10, duration: 2, subject: "Operating Systems", room: "LT-1", teacher: "Dr. Singh", color: "colorOrange" },
  { day: 2, startHour: 13, duration: 1, subject: "Computer Networks", room: "LT-3", teacher: "Dr. Kumar", color: "colorRed" },
  { day: 2, startHour: 15, duration: 2, subject: "Software Eng", room: "LT-2", teacher: "Prof. Das", color: "colorPink" },
  
  { day: 3, startHour: 9, duration: 1, subject: "Algorithms", room: "LT-2", teacher: "Prof. Gupta", color: "colorPurple" },
  { day: 3, startHour: 10, duration: 2, subject: "OS Lab", room: "Lab-1", teacher: "Dr. Singh", color: "colorOrange" },
  { day: 3, startHour: 14, duration: 2, subject: "Data Structures", room: "LT-1", teacher: "Dr. Sharma", color: "colorBlue" },

  { day: 4, startHour: 11, duration: 2, subject: "DBMS", room: "LT-4", teacher: "Mr. Verma", color: "colorGreen" },
  { day: 4, startHour: 14, duration: 2, subject: "Computer Networks", room: "LT-3", teacher: "Dr. Kumar", color: "colorRed" },
  
  { day: 5, startHour: 9, duration: 2, subject: "Software Eng", room: "LT-2", teacher: "Prof. Das", color: "colorPink" },
  { day: 5, startHour: 13, duration: 3, subject: "Networks Lab", room: "Lab-2", teacher: "Dr. Kumar", color: "colorRed" },
];

// Mock schedule data for a Teacher
const TEACHER_SCHEDULE = [
  { day: 1, startHour: 10, duration: 2, subject: "Compiler Design", room: "LT-3", section: "CSE-A", color: "colorOrange" },
  { day: 1, startHour: 15, duration: 1, subject: "Compiler Design", room: "LT-4", section: "CSE-B", color: "colorOrange" },
  
  { day: 2, startHour: 9, duration: 3, subject: "CD Lab", room: "Lab-1", section: "CSE-A", color: "colorGreen" },
  { day: 2, startHour: 14, duration: 2, subject: "Theory of Computing", room: "LT-1", section: "IT-A", color: "colorPurple" },
  
  { day: 3, startHour: 11, duration: 2, subject: "Compiler Design", room: "LT-3", section: "CSE-A", color: "colorOrange" },
  { day: 3, startHour: 14, duration: 3, subject: "CD Lab", room: "Lab-2", section: "CSE-B", color: "colorGreen" },

  { day: 4, startHour: 9, duration: 2, subject: "Theory of Computing", room: "LT-2", section: "IT-B", color: "colorPurple" },
  { day: 4, startHour: 13, duration: 2, subject: "Compiler Design", room: "LT-4", section: "CSE-B", color: "colorOrange" },
  
  { day: 5, startHour: 10, duration: 2, subject: "Theory of Computing", room: "LT-1", section: "IT-A", color: "colorPurple" },
  { day: 5, startHour: 14, duration: 2, subject: "Theory of Computing", room: "LT-2", section: "IT-B", color: "colorPurple" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const START_HOUR = 9;
const END_HOUR = 18;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

interface TimetableProps {
  identifier: string; // The Name, Section, or Email representing the context
  role: "student" | "teacher";
}

export default function Timetable({ identifier, role }: TimetableProps) {
  
  const scheduleData = role === "teacher" ? TEACHER_SCHEDULE : STUDENT_SCHEDULE;

  // Helper to find if a class exists for a given day and hour
  const getClassForSlot = (dayIndex: number, hour: number) => {
    const scheduleDay = dayIndex + 1; 
    return scheduleData.find(c => c.day === scheduleDay && c.startHour === hour);
  };

  // Helper to check if an hour should be skipped because a previous class spans across it
  const isSlotCovered = (dayIndex: number, hour: number) => {
    const scheduleDay = dayIndex + 1;
    return scheduleData.some(c => 
      c.day === scheduleDay && 
      hour > c.startHour && 
      hour < (c.startHour + c.duration)
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.timetableHeader}>
        <div>
          <h2 className={styles.title}>Weekly Timetable</h2>
          <p className={styles.subtitle}>{role === "teacher" ? `Faculty: ${identifier}` : `Section: ${identifier}`}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.8, fontSize: '0.85rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div> Core
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981', marginLeft: '0.5rem' }}></div> Labs
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B', marginLeft: '0.5rem' }}></div> Electives
        </div>
      </div>

      <div className={styles.grid}>
        {/* Header Row: Empty top-left, then Days */}
        <div className={styles.cell} style={{ background: 'transparent' }}></div>
        {DAYS.map((day) => (
          <div key={day} className={styles.headerCell}>
            {day}
          </div>
        ))}

        {/* Time Rows */}
        {HOURS.map((hour) => (
          <div key={hour} style={{ display: 'contents' }}>
            {/* Time Column */}
            <div className={`${styles.cell} ${styles.timeCell}`}>
              {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
            </div>

            {/* Days Columns for this hour */}
            {DAYS.map((_, dayIndex) => {
              
              if (isSlotCovered(dayIndex, hour)) {
                return <div key={`${dayIndex}-${hour}`} className={styles.cell} style={{ borderTop: 'none' }}></div>;
              }

              const currentClass = getClassForSlot(dayIndex, hour);

              return (
                <div key={`${dayIndex}-${hour}`} className={styles.cell}>
                  {currentClass && (
                    <div 
                      className={`${styles.classBlock} ${styles[currentClass.color]}`}
                      style={{ 
                        height: `calc(${currentClass.duration * 100}% + ${(currentClass.duration - 1) * 1}px - 8px)`
                      }}
                    >
                      <span className={styles.subjectName}>{currentClass.subject}</span>
                      <span className={styles.roomName}>{currentClass.room}</span>
                      {/* For teachers, show which section they are teaching. For students, show the teacher name. */}
                      <span className={styles.teacherName}>
                        {role === "teacher" ? `Section: ${(currentClass as any).section}` : (currentClass as any).teacher}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
