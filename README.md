📅 TIME TABLE MANAGEMENT SYSTEM

🗄️ DATABASE MANAGEMENT SYSTEMS PROJECT

📘 **INTRODUCTION**
The Time Table Management System is a database-driven application designed to efficiently organize and manage academic schedules. It streamlines the process of planning lectures by maintaining structured data related to teachers, subjects, student sections, and classrooms.

A centralized timetable ensures optimal allocation of resources while preventing scheduling conflicts. The system is built using a well-designed relational database that guarantees data consistency, integrity, and scalability.

🎯 *OBJECTIVES*

The primary objectives of this project are:

📌 Design a normalized relational database for timetable management
📌 Efficiently allocate teachers and subjects
📌 Ensure conflict-free classroom and lab assignments
📌 Maintain section-wise lecture schedules
📌 Apply database normalization principles and constraints

🔍 **SCOPE OF THE SYSTEM**


The scope of the Time Table Management System includes:

🛠️ Administrative control over timetable operations
👨‍🏫 Teacher information management
📚 Subject management
🧑‍🎓 Section-wise scheduling
🏫 Classroom and laboratory allocation
🗓️ Timetable generation and maintenance

🗂️** DATABASE TABLES DESCRIPTION**

👤 ADMINS


Stores login credentials and administrative details.

Responsibilities:
• Manage teacher records
• Manage subject information
• Create, update, and delete timetable entries

👨‍🏫 TEACHERS


Stores information related to teaching staff.

Attributes:
• teacher_id (Primary Key)
• name
• email
• department

Role:
• Assigned subjects
• Allocated lecture slots through the timetable

📚 SUBJECTS

Contains details of academic subjects.

Attributes:
• subject_id (Primary Key)
• subject_name
• subject_code
• credits

Subjects are assigned to teachers and scheduled for multiple sections.

🧑‍🎓 **SECTIONS**

Represents student sections such as BCS-1A, BCS-2B, and BCA-3A.

Features:
• Each section has a unique timetable
• Linked with teachers and subjects

🏫** ROOMS**


Stores classroom and laboratory details.

Attributes:
• room_id (Primary Key)
• room_number
• capacity
• room_type (Classroom / Laboratory)

Used during lecture scheduling.

🗓️ **TIMETABLE**


The Timetable table is the core of the system, connecting all entities.

Attributes:

• timetable_id (Primary Key)
• section_id (Foreign Key)
• teacher_id (Foreign Key)
• subject_id (Foreign Key)
• room_id (Foreign Key)
• day
• time_slot

Purpose:
🚫 Prevent teacher schedule clashes
🚫 Prevent room allocation conflicts
🚫 Avoid overlapping lectures for sections

🔗 **RELATIONSHIPS OVERVIEW**

• One teacher can teach multiple subjects
• One subject can be assigned to multiple sections
• One section can have multiple timetable entries
• One room can host multiple lectures at different times
• The timetable acts as a bridge between teachers, subjects, sections, and rooms

⚠️ CONSTRAINTS AND ASSUMPTIONS

• A teacher cannot be scheduled for more than one lecture at the same time
• A room cannot be allocated to multiple sections simultaneously
• A section cannot have overlapping lectures
• Only administrators are authorized to modify timetable data

🧾 **CONCLUSION**


The Time Table Management System offers a structured and efficient solution for managing academic schedules. By using a centralized timetable and a normalized database design, the system minimizes conflicts, improves resource utilization, and maintains data integrity. This project highlights the practical implementation of core DBMS concepts in an academic environment.

👥 **AUTHORS**


Aanya Singh(23DCS002)

Akanksha (23DCS003)

Ankush Thakur (23DCS004)

Anmol Sharma (23DCS005)