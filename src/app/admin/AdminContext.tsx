"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Section {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  sections: Section[];
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
}

export interface Classroom {
  id: string;
  name: string;     // e.g., "LH-1", "CSE Lab-1"
  location: string; // e.g., "Lecture Hall Complex", "CSE Department"
  capacity?: number;
}

export interface TimetableSlot {
  day: string;
  startHour: number;
  endHour: number;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  classroom: string;
}

export interface Timetable {
  id: string;
  department: string;
  section: string;
  lunchSlot: '12-1' | '1-2';
  slots: TimetableSlot[];
  createdAt: string;
}

interface AdminContextType {
  departments: Department[];
  addDepartment: (name: string) => void;
  deleteDepartment: (id: string) => void;
  addSection: (deptId: string, sectionName: string) => void;
  deleteSection: (deptId: string, sectionId: string) => void;

  faculty: Faculty[];
  addFaculty: (name: string, email: string, department: string) => void;
  deleteFaculty: (id: string) => void;
  addSubjectToFaculty: (facultyId: string, subject: string) => void;
  deleteSubjectFromFaculty: (facultyId: string, subject: string) => void;

  subjects: Subject[];
  addSubject: (name: string, code: string, department: string) => void;
  deleteSubject: (id: string) => void;

  classrooms: Classroom[];
  addClassroom: (name: string, location: string, capacity?: number) => void;
  deleteClassroom: (id: string) => void;

  timetables: Timetable[];
  addTimetable: (tt: Timetable) => void;
  updateTimetable: (id: string, tt: Timetable) => void;
  deleteTimetable: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Default departments
const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "dept-1yr", name: "1st Year", sections: Array.from({ length: 10 }, (_, i) => ({ id: `1yr-s${i+1}`, name: `Section ${i+1}` })) },
  { id: "dept-cse", name: "Computer Science & Engineering (CSE)", sections: [
    { id: "cse-a", name: "CSE-A" }, { id: "cse-b", name: "CSE-B" }, { id: "cse-dd", name: "Dual Degree CSE" }
  ]},
  { id: "dept-ece", name: "Electronics & Communication (ECE)", sections: [
    { id: "ece-a", name: "ECE-A" }, { id: "ece-b", name: "ECE-B" }, { id: "ece-dd", name: "Dual Degree ECE" }
  ]},
  { id: "dept-civil", name: "Civil Engineering", sections: [
    { id: "ce-a", name: "CE-A" }, { id: "ce-b", name: "CE-B" }
  ]},
  { id: "dept-ee", name: "Electrical Engineering", sections: [
    { id: "ee-a", name: "EE-A" }, { id: "ee-b", name: "EE-B" }
  ]},
  { id: "dept-me", name: "Mechanical Engineering", sections: [
    { id: "me-a", name: "ME-A" }, { id: "me-b", name: "ME-B" }
  ]},
  { id: "dept-phy", name: "Physics & Photonic Science", sections: [
    { id: "phy-a", name: "PHY" }
  ]},
  { id: "dept-mnc", name: "Mathematics & Computing (MNC)", sections: [
    { id: "mnc-a", name: "MNC" }
  ]},
  { id: "dept-mat", name: "Material Science", sections: [
    { id: "mat-a", name: "MAT" }
  ]},
  { id: "dept-chem", name: "Chemical Engineering", sections: [
    { id: "chem-a", name: "CHEM" }
  ]},
];

// Default faculty
const DEFAULT_FACULTY: Faculty[] = [
  { id: "fac-1", name: "Dr. R.K. Sharma", email: "rk.sharma@nith.ac.in", department: "Computer Science & Engineering (CSE)", subjects: ["Data Structures", "Algorithms"] },
  { id: "fac-2", name: "Prof. Anita Gupta", email: "anita.gupta@nith.ac.in", department: "Computer Science & Engineering (CSE)", subjects: ["Algorithms", "Discrete Mathematics"] },
  { id: "fac-3", name: "Dr. Rajesh Singh", email: "rajesh.singh@nith.ac.in", department: "Computer Science & Engineering (CSE)", subjects: ["Operating Systems", "Computer Architecture"] },
  { id: "fac-4", name: "Dr. Pradeep Kumar", email: "pradeep.kumar@nith.ac.in", department: "Electronics & Communication (ECE)", subjects: ["Computer Networks", "Network Security"] },
  { id: "fac-5", name: "Prof. Neha Das", email: "neha.das@nith.ac.in", department: "Electronics & Communication (ECE)", subjects: ["Software Engineering", "Software Testing"] },
  { id: "fac-6", name: "Mr. Arun Verma", email: "arun.verma@nith.ac.in", department: "Civil Engineering", subjects: ["DBMS", "Data Warehousing"] },
  { id: "fac-7", name: "Dr. Sanjay Mehta", email: "sanjay.mehta@nith.ac.in", department: "Electrical Engineering", subjects: ["Compiler Design", "Theory of Computing"] },
  { id: "fac-8", name: "Prof. Kavita Joshi", email: "kavita.joshi@nith.ac.in", department: "Electronics & Communication (ECE)", subjects: ["Digital Electronics", "VLSI Design"] },
  { id: "fac-9", name: "Dr. Vikram Rao", email: "vikram.rao@nith.ac.in", department: "Electrical Engineering", subjects: ["Signals & Systems", "Control Systems"] },
  { id: "fac-10", name: "Prof. Deepa Nair", email: "deepa.nair@nith.ac.in", department: "Mechanical Engineering", subjects: ["Thermodynamics", "Heat Transfer"] },
];

// Default subjects — ~5 per department for a good starting set
const DEFAULT_SUBJECTS: Subject[] = [
  // CSE
  { id: "sub-1", name: "Data Structures", code: "CS201", department: "Computer Science & Engineering (CSE)" },
  { id: "sub-2", name: "Algorithms", code: "CS301", department: "Computer Science & Engineering (CSE)" },
  { id: "sub-3", name: "Operating Systems", code: "CS302", department: "Computer Science & Engineering (CSE)" },
  { id: "sub-4", name: "Database Management Systems", code: "CS303", department: "Computer Science & Engineering (CSE)" },
  { id: "sub-5", name: "Computer Networks", code: "CS401", department: "Computer Science & Engineering (CSE)" },
  { id: "sub-6", name: "Compiler Design", code: "CS402", department: "Computer Science & Engineering (CSE)" },
  { id: "sub-7", name: "Machine Learning", code: "CS501", department: "Computer Science & Engineering (CSE)" },
  { id: "sub-8", name: "Discrete Mathematics", code: "MA201", department: "Computer Science & Engineering (CSE)" },
  // ECE
  { id: "sub-9", name: "Digital Electronics", code: "EC201", department: "Electronics & Communication (ECE)" },
  { id: "sub-10", name: "Signals & Systems", code: "EC301", department: "Electronics & Communication (ECE)" },
  { id: "sub-11", name: "VLSI Design", code: "EC302", department: "Electronics & Communication (ECE)" },
  { id: "sub-12", name: "Microprocessors", code: "EC303", department: "Electronics & Communication (ECE)" },
  { id: "sub-13", name: "Communication Systems", code: "EC401", department: "Electronics & Communication (ECE)" },
  { id: "sub-14", name: "Electromagnetic Theory", code: "EC202", department: "Electronics & Communication (ECE)" },
  // Civil
  { id: "sub-15", name: "Structural Analysis", code: "CE201", department: "Civil Engineering" },
  { id: "sub-16", name: "Fluid Mechanics", code: "CE202", department: "Civil Engineering" },
  { id: "sub-17", name: "Geotechnical Engineering", code: "CE301", department: "Civil Engineering" },
  { id: "sub-18", name: "Transportation Engineering", code: "CE302", department: "Civil Engineering" },
  { id: "sub-19", name: "Environmental Engineering", code: "CE401", department: "Civil Engineering" },
  // EE
  { id: "sub-20", name: "Power Systems", code: "EE201", department: "Electrical Engineering" },
  { id: "sub-21", name: "Control Systems", code: "EE301", department: "Electrical Engineering" },
  { id: "sub-22", name: "Electrical Machines", code: "EE302", department: "Electrical Engineering" },
  { id: "sub-23", name: "Power Electronics", code: "EE401", department: "Electrical Engineering" },
  { id: "sub-24", name: "High Voltage Engineering", code: "EE402", department: "Electrical Engineering" },
  // ME
  { id: "sub-25", name: "Thermodynamics", code: "ME201", department: "Mechanical Engineering" },
  { id: "sub-26", name: "Heat Transfer", code: "ME301", department: "Mechanical Engineering" },
  { id: "sub-27", name: "Fluid Dynamics", code: "ME302", department: "Mechanical Engineering" },
  { id: "sub-28", name: "Manufacturing Processes", code: "ME303", department: "Mechanical Engineering" },
  { id: "sub-29", name: "Machine Design", code: "ME401", department: "Mechanical Engineering" },
  // Physics
  { id: "sub-30", name: "Quantum Mechanics", code: "PH201", department: "Physics & Photonic Science" },
  { id: "sub-31", name: "Optics & Photonics", code: "PH301", department: "Physics & Photonic Science" },
  { id: "sub-32", name: "Solid State Physics", code: "PH302", department: "Physics & Photonic Science" },
  { id: "sub-33", name: "Nuclear Physics", code: "PH401", department: "Physics & Photonic Science" },
  // MNC
  { id: "sub-34", name: "Linear Algebra", code: "MC201", department: "Mathematics & Computing (MNC)" },
  { id: "sub-35", name: "Numerical Methods", code: "MC301", department: "Mathematics & Computing (MNC)" },
  { id: "sub-36", name: "Probability & Statistics", code: "MC302", department: "Mathematics & Computing (MNC)" },
  { id: "sub-37", name: "Graph Theory", code: "MC401", department: "Mathematics & Computing (MNC)" },
  // Material Science
  { id: "sub-38", name: "Material Engineering", code: "MT201", department: "Material Science" },
  { id: "sub-39", name: "Polymer Science", code: "MT301", department: "Material Science" },
  { id: "sub-40", name: "Ceramic Materials", code: "MT302", department: "Material Science" },
  { id: "sub-41", name: "Nano Materials", code: "MT401", department: "Material Science" },
  // Chemical
  { id: "sub-42", name: "Chemical Reaction Engineering", code: "CH201", department: "Chemical Engineering" },
  { id: "sub-43", name: "Process Control", code: "CH301", department: "Chemical Engineering" },
  { id: "sub-44", name: "Mass Transfer", code: "CH302", department: "Chemical Engineering" },
  { id: "sub-45", name: "Chemical Thermodynamics", code: "CH401", department: "Chemical Engineering" },
];

// Default classrooms
const DEFAULT_CLASSROOMS: Classroom[] = [
  { id: "cr-1", name: "LH-1", location: "Lecture Hall Complex", capacity: 200 },
  { id: "cr-2", name: "LH-2", location: "Lecture Hall Complex", capacity: 200 },
  { id: "cr-3", name: "LH-3", location: "Lecture Hall Complex", capacity: 150 },
  { id: "cr-4", name: "LH-4", location: "Lecture Hall Complex", capacity: 150 },
  { id: "cr-5", name: "LH-5", location: "Lecture Hall Complex", capacity: 120 },
  { id: "cr-6", name: "LH-6", location: "Lecture Hall Complex", capacity: 120 },
  { id: "cr-7", name: "CR-101", location: "CSE Department", capacity: 60 },
  { id: "cr-8", name: "CR-102", location: "CSE Department", capacity: 60 },
  { id: "cr-9", name: "CR-201", location: "ECE Department", capacity: 60 },
  { id: "cr-10", name: "CR-202", location: "ECE Department", capacity: 60 },
  { id: "cr-11", name: "CR-301", location: "Civil Engineering Department", capacity: 50 },
  { id: "cr-12", name: "CR-401", location: "Electrical Engineering Department", capacity: 50 },
  { id: "cr-13", name: "CR-501", location: "Mechanical Engineering Department", capacity: 50 },
  { id: "cr-14", name: "Tutorial Room 1", location: "Academic Block", capacity: 40 },
  { id: "cr-15", name: "Tutorial Room 2", location: "Academic Block", capacity: 40 },
  { id: "cr-16", name: "Seminar Hall", location: "Library Building", capacity: 100 },
  { id: "cr-17", name: "CS Lab-1", location: "CSE Department", capacity: 40 },
  { id: "cr-18", name: "CS Lab-2", location: "CSE Department", capacity: 40 },
  { id: "cr-19", name: "Physics Lab", location: "Physics Department", capacity: 30 },
  { id: "cr-20", name: "Chemistry Lab", location: "Chemical Engineering Department", capacity: 30 },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPARTMENTS);
  const [faculty, setFaculty] = useState<Faculty[]>(DEFAULT_FACULTY);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(DEFAULT_CLASSROOMS);

  // ---- Department Operations ----
  const addDepartment = (name: string) => {
    setDepartments(prev => [...prev, { id: `dept-${Date.now()}`, name, sections: [] }]);
  };
  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };
  const addSection = (deptId: string, sectionName: string) => {
    setDepartments(prev => prev.map(d => d.id === deptId
      ? { ...d, sections: [...d.sections, { id: `sec-${Date.now()}`, name: sectionName }] }
      : d
    ));
  };
  const deleteSection = (deptId: string, sectionId: string) => {
    setDepartments(prev => prev.map(d => d.id === deptId
      ? { ...d, sections: d.sections.filter(s => s.id !== sectionId) }
      : d
    ));
  };

  // ---- Faculty Operations ----
  const addFaculty = (name: string, email: string, department: string) => {
    setFaculty(prev => [...prev, { id: `fac-${Date.now()}`, name, email, department, subjects: [] }]);
  };
  const deleteFaculty = (id: string) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
  };
  const addSubjectToFaculty = (facultyId: string, subject: string) => {
    setFaculty(prev => prev.map(f => f.id === facultyId
      ? { ...f, subjects: [...f.subjects, subject] }
      : f
    ));
  };
  const deleteSubjectFromFaculty = (facultyId: string, subject: string) => {
    setFaculty(prev => prev.map(f => f.id === facultyId
      ? { ...f, subjects: f.subjects.filter(s => s !== subject) }
      : f
    ));
  };

  // ---- Subject Operations ----
  const addSubject = (name: string, code: string, department: string) => {
    setSubjects(prev => [...prev, { id: `sub-${Date.now()}`, name, code, department }]);
  };
  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // ---- Classroom Operations ----
  const addClassroom = (name: string, location: string, capacity?: number) => {
    setClassrooms(prev => [...prev, { id: `cr-${Date.now()}`, name, location, capacity }]);
  };
  const deleteClassroom = (id: string) => {
    setClassrooms(prev => prev.filter(c => c.id !== id));
  };

  // ---- Timetable Operations ----
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const addTimetable = (tt: Timetable) => {
    setTimetables(prev => [...prev, tt]);
  };
  const updateTimetable = (id: string, tt: Timetable) => {
    setTimetables(prev => prev.map(t => t.id === id ? tt : t));
  };
  const deleteTimetable = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      departments, addDepartment, deleteDepartment, addSection, deleteSection,
      faculty, addFaculty, deleteFaculty, addSubjectToFaculty, deleteSubjectFromFaculty,
      subjects, addSubject, deleteSubject,
      classrooms, addClassroom, deleteClassroom,
      timetables, addTimetable, updateTimetable, deleteTimetable,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}
