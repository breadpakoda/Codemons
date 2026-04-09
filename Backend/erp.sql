-- 1. Students (already correct)
CREATE TABLE Students (
    roll_no VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    department VARCHAR(50),
    year INT,
    password VARCHAR(255) NOT NULL,
    residence_type ENUM('Hostel','Day Scholar'),
    transport_type ENUM('Bus','Self','None')
);

-- 2. Faculty
CREATE TABLE Faculty (
    email VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50)
);

-- 3. Courses
CREATE TABLE Courses (
    course_code VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(100),
    credits INT,
    faculty_email VARCHAR(100),
    FOREIGN KEY (faculty_email) REFERENCES Faculty(email)
);

-- 4. Enrollments (no numeric dependency on student id)
CREATE TABLE Enrollments (
    enrollment_no INT PRIMARY KEY AUTO_INCREMENT,
    student_roll_no VARCHAR(20),
    course_code VARCHAR(20),
    semester VARCHAR(20),
    FOREIGN KEY (student_roll_no) REFERENCES Students(roll_no),
    FOREIGN KEY (course_code) REFERENCES Courses(course_code),
    UNIQUE (student_roll_no, course_code, semester)
);

-- 5. Attendance
CREATE TABLE Attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_roll_no VARCHAR(20),
    course_code VARCHAR(20),
    date DATE,
    status ENUM('Present','Absent','Late'),
    FOREIGN KEY (student_roll_no) REFERENCES Students(roll_no),
    FOREIGN KEY (course_code) REFERENCES Courses(course_code),
    UNIQUE (student_roll_no, course_code, date)
);

-- 6. Results
CREATE TABLE Results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_roll_no VARCHAR(20),
    course_code VARCHAR(20),
    internal_marks INT,
    external_marks INT,
    grade VARCHAR(5),
    FOREIGN KEY (student_roll_no) REFERENCES Students(roll_no),
    FOREIGN KEY (course_code) REFERENCES Courses(course_code)
);

-- Hostel System

-- 7. Hostels
CREATE TABLE Hostels (
    hostel_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_name VARCHAR(100),
    number_of_rooms INT,
    type ENUM('Boys','Girls'),
    warden_name VARCHAR(100),
    warden_contact VARCHAR(15)
);

-- 8. Rooms (fixed composite key)
CREATE TABLE Rooms (
    room_no VARCHAR(10),
    hostel_id INT,
    capacity INT,
    occupied_count INT DEFAULT 0,
    PRIMARY KEY (room_no, hostel_id),
    FOREIGN KEY (hostel_id) REFERENCES Hostels(hostel_id)
);

-- 9. Room Allocations (roll_no used directly)
CREATE TABLE RoomAllocations (
    allocation_id INT PRIMARY KEY AUTO_INCREMENT,
    student_roll_no VARCHAR(20),
    room_no VARCHAR(10),
    hostel_id INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (student_roll_no) REFERENCES Students(roll_no),
    FOREIGN KEY (room_no, hostel_id) REFERENCES Rooms(room_no, hostel_id)
);

-- Bus System

-- 10. Buses
CREATE TABLE Buses (
    bus_id INT PRIMARY KEY AUTO_INCREMENT,
    bus_number VARCHAR(20),
    driver_name VARCHAR(100),
    driver_contact VARCHAR(15),
    capacity INT
);

-- 11. Bus Routes
CREATE TABLE BusRoutes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    bus_id INT,
    route_name VARCHAR(100),
    start_point VARCHAR(100),
    end_point VARCHAR(100),
    FOREIGN KEY (bus_id) REFERENCES Buses(bus_id)
);

-- 12. Bus Allocations (roll_no used directly)
CREATE TABLE BusAllocations (
    allocation_id INT PRIMARY KEY AUTO_INCREMENT,
    student_roll_no VARCHAR(20),
    route_id INT,
    FOREIGN KEY (student_roll_no) REFERENCES Students(roll_no),
    FOREIGN KEY (route_id) REFERENCES BusRoutes(route_id)
);

-- 13. Fees
CREATE TABLE Fees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_roll_no VARCHAR(20),
    room_allocation_id INT NULL,
    bus_allocation_id INT NULL,
    amount DECIMAL(10,2),
    type ENUM('tuition','hostel','bus','misc'),
    notes TEXT,
    status ENUM('paid','pending','overdue'),
    due_date DATE,
    FOREIGN KEY (student_roll_no) REFERENCES Students(roll_no),
    FOREIGN KEY (room_allocation_id) REFERENCES RoomAllocations(allocation_id),
    FOREIGN KEY (bus_allocation_id) REFERENCES BusAllocations(allocation_id)
);

-- 14. Notices
CREATE TABLE Notices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    content TEXT,
    created_by VARCHAR(100),
    target_audience ENUM('all','hostel','bus','department'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Faculty(email)
);