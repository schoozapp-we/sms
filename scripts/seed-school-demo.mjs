import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const PASSWORD = "Admin@12345";
const DAY_MS = 24 * 60 * 60 * 1000;
const ObjectId = mongoose.Types.ObjectId;

const now = new Date();
const stamp = (doc) => ({ ...doc, createdAt: now, updatedAt: now });
const daysFromNow = (days) => new Date(Date.now() + days * DAY_MS);
const fixedDate = (year, month, day) => new Date(year, month - 1, day);

function grade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  return "D";
}

function attendanceStatus(studentIndex, dayOffset) {
  const bucket = (studentIndex + dayOffset + 30) % 12;
  if (bucket === 0) return "absent";
  if (bucket === 1) return "late";
  if (bucket === 2) return "leave";
  return "present";
}

async function resetCollections(db) {
  await Promise.all(
    [
      "users",
      "staff",
      "staffs",
      "students",
      "classrooms",
      "attendances",
      "exams",
      "fees",
      "notices",
      "homeworks",
      "admissionapplications",
      "mediaassets"
    ].map((name) => db.collection(name).deleteMany({}))
  );
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  await resetCollections(db);

  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const staff = [
    {
      _id: new ObjectId(),
      employeeCode: "EMP-001",
      name: "Neha Sharma",
      role: "teacher",
      department: "Science",
      subjects: ["Physics", "Chemistry"],
      phone: "9876501001",
      email: "teacher.science@school.test",
      qualification: "M.Sc Physics, B.Ed",
      experience: "8 years",
      bio: "Science faculty focused on activity-based learning and lab discipline.",
      showOnWebsite: true,
      status: "active"
    },
    {
      _id: new ObjectId(),
      employeeCode: "EMP-002",
      name: "Amit Verma",
      role: "teacher",
      department: "Mathematics",
      subjects: ["Mathematics", "Computer"],
      phone: "9876501002",
      email: "teacher.math@school.test",
      qualification: "M.Sc Mathematics, B.Ed",
      experience: "10 years",
      bio: "Mentors board exam preparation and logical reasoning clubs.",
      showOnWebsite: true,
      status: "active"
    },
    {
      _id: new ObjectId(),
      employeeCode: "EMP-003",
      name: "Farah Khan",
      role: "teacher",
      department: "English",
      subjects: ["English", "Social Studies"],
      phone: "9876501003",
      email: "teacher.english@school.test",
      qualification: "M.A English, B.Ed",
      experience: "7 years",
      bio: "Runs reading circles, debates and language enrichment sessions.",
      showOnWebsite: true,
      status: "active"
    },
    {
      _id: new ObjectId(),
      employeeCode: "EMP-004",
      name: "Rahul Meena",
      role: "teacher",
      department: "Primary",
      subjects: ["EVS", "Hindi", "General Knowledge"],
      phone: "9876501004",
      email: "teacher.primary@school.test",
      qualification: "B.Ed, CTET",
      experience: "6 years",
      bio: "Primary class mentor for foundational literacy and numeracy.",
      showOnWebsite: true,
      status: "active"
    },
    {
      _id: new ObjectId(),
      employeeCode: "EMP-005",
      name: "Priya Nair",
      role: "teacher",
      department: "Computer Science",
      subjects: ["Computer", "Robotics"],
      phone: "9876501005",
      email: "teacher.computer@school.test",
      qualification: "MCA, B.Ed",
      experience: "5 years",
      bio: "Coordinates coding club, digital safety and robotics practice.",
      showOnWebsite: true,
      status: "active"
    },
    {
      _id: new ObjectId(),
      employeeCode: "EMP-006",
      name: "Ramesh Yadav",
      role: "reception",
      department: "Admissions",
      subjects: [],
      phone: "9876501006",
      email: "reception@school.test",
      qualification: "B.Com",
      experience: "9 years",
      bio: "Handles reception, admission enquiries and document verification.",
      showOnWebsite: false,
      status: "active"
    },
    {
      _id: new ObjectId(),
      employeeCode: "EMP-007",
      name: "Kavita Soni",
      role: "accountant",
      department: "Accounts",
      subjects: [],
      phone: "9876501007",
      email: "accountant@school.test",
      qualification: "M.Com",
      experience: "11 years",
      bio: "Manages fee counter, ledgers and due follow-ups.",
      showOnWebsite: false,
      status: "active"
    },
    {
      _id: new ObjectId(),
      employeeCode: "EMP-008",
      name: "Iqbal Singh",
      role: "driver",
      department: "Transport",
      subjects: [],
      phone: "9876501008",
      email: "transport@school.test",
      qualification: "Certified School Transport Driver",
      experience: "12 years",
      bio: "Senior transport staff for route safety.",
      showOnWebsite: false,
      status: "active"
    }
  ].map(stamp);

  await db.collection("staffs").insertMany(staff);
  const teachers = staff.filter((item) => item.role === "teacher");

  const classPlan = [
    { name: "6", section: "A", teacher: teachers[3], subjects: ["English", "Maths", "EVS"] },
    { name: "6", section: "B", teacher: teachers[3], subjects: ["Hindi", "Maths", "GK"] },
    { name: "7", section: "A", teacher: teachers[2], subjects: ["English", "SST", "Hindi"] },
    { name: "7", section: "B", teacher: teachers[2], subjects: ["English", "SST", "GK"] },
    { name: "8", section: "A", teacher: teachers[4], subjects: ["Computer", "Maths", "Science"] },
    { name: "8", section: "B", teacher: teachers[4], subjects: ["Robotics", "Computer", "Maths"] },
    { name: "9", section: "A", teacher: teachers[0], subjects: ["Physics", "Chemistry", "Biology"] },
    { name: "9", section: "B", teacher: teachers[0], subjects: ["Science", "Maths", "Computer"] },
    { name: "10", section: "A", teacher: teachers[1], subjects: ["Mathematics", "Physics", "English"] },
    { name: "10", section: "B", teacher: teachers[1], subjects: ["Mathematics", "Computer", "Chemistry"] }
  ];

  const classrooms = classPlan.map((item) =>
    stamp({
      _id: new ObjectId(),
      name: item.name,
      section: item.section,
      classTeacher: item.teacher._id,
      capacity: 42,
      timetable: item.subjects.map((subject, index) => ({
        day: ["Monday", "Tuesday", "Wednesday"][index],
        period: index + 1,
        subject,
        teacher: item.teacher._id
      }))
    })
  );
  await db.collection("classrooms").insertMany(classrooms);

  const firstNames = [
    "Aarav",
    "Anaya",
    "Vivaan",
    "Diya",
    "Kabir",
    "Meera",
    "Ishaan",
    "Sara",
    "Arjun",
    "Kiara",
    "Rohan",
    "Tanya",
    "Dev",
    "Aisha",
    "Nikhil",
    "Riya",
    "Yash",
    "Myra",
    "Aditya",
    "Sanya",
    "Kunal",
    "Avni",
    "Harsh",
    "Naina",
    "Om",
    "Pihu",
    "Laksh",
    "Sejal",
    "Manav",
    "Ira"
  ];
  const lastNames = ["Mehta", "Singh", "Sharma", "Khan", "Patel", "Gupta", "Rao", "Das", "Verma", "Nair"];

  const students = firstNames.map((firstName, index) => {
    const classInfo = classPlan[index % classPlan.length];
    const lastName = lastNames[index % lastNames.length];
    const guardianFirst =
      index % 2 === 0
        ? ["Rohit", "Suresh", "Vikas", "Mohan", "Deepak"][index % 5]
        : ["Kavita", "Sunita", "Pooja", "Rekha", "Nisha"][index % 5];
    return stamp({
      _id: new ObjectId(),
      admissionNo: `ADM-2026-${String(index + 1).padStart(3, "0")}`,
      name: `${firstName} ${lastName}`,
      gender: index % 2 === 0 ? "male" : "female",
      dob: fixedDate(2010 + (index % 5), (index % 12) + 1, (index % 24) + 2),
      className: classInfo.name,
      section: classInfo.section,
      rollNo: String(Math.floor(index / classPlan.length) + 1),
      phone: `988000${String(index + 1).padStart(4, "0")}`,
      address: `${22 + index}, Green Avenue, Jaipur`,
      guardian: {
        name: `${guardianFirst} ${lastName}`,
        phone: `977000${String(index + 1).padStart(4, "0")}`,
        email: `parent${String((index % 15) + 1).padStart(2, "0")}@school.test`,
        relation: index % 2 === 0 ? "father" : "mother"
      },
      status: "active"
    });
  });
  await db.collection("students").insertMany(students);

  const studentsByClass = new Map();
  students.forEach((student) => {
    const key = `${student.className}-${student.section}`;
    studentsByClass.set(key, [...(studentsByClass.get(key) || []), student]);
  });

  const attendanceDocs = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    classPlan.forEach((classInfo) => {
      const classStudents = studentsByClass.get(`${classInfo.name}-${classInfo.section}`) || [];
      attendanceDocs.push(
        stamp({
          _id: new ObjectId(),
          date: daysFromNow(offset),
          className: classInfo.name,
          section: classInfo.section,
          records: classStudents.map((student, index) => ({
            student: student._id,
            status: attendanceStatus(index, offset),
            note: attendanceStatus(index, offset) === "late" ? "Late bus arrival" : ""
          }))
        })
      );
    });
  }
  await db.collection("attendances").insertMany(attendanceDocs);

  const feeMonths = ["April-2026", "May-2026", "June-2026"];
  const fees = [];
  students.forEach((student, studentIndex) => {
    feeMonths.forEach((month, monthIndex) => {
      const amount = Number(student.className) >= 9 ? 5600 : Number(student.className) >= 8 ? 5200 : 4800;
      const pattern = (studentIndex + monthIndex) % 5;
      const paidAmount = pattern === 0 || pattern >= 3 ? amount : pattern === 1 ? Math.floor(amount / 2) : 0;
      const status = paidAmount === amount ? "paid" : pattern === 2 ? "overdue" : "partial";
      fees.push(
        stamp({
          _id: new ObjectId(),
          student: student._id,
          invoiceNo: `INV-2026-${String(studentIndex + 1).padStart(3, "0")}-${monthIndex + 1}`,
          month,
          amount,
          paidAmount,
          dueDate: daysFromNow(monthIndex === 2 ? 7 : -25 + monthIndex * 12),
          paidAt: paidAmount === amount ? daysFromNow(-10 + monthIndex) : null,
          status
        })
      );
    });
  });
  await db.collection("fees").insertMany(fees);

  const exams = [];
  classPlan.forEach((classInfo, classIndex) => {
    const classStudents = studentsByClass.get(`${classInfo.name}-${classInfo.section}`) || [];
    ["Mathematics", classInfo.subjects[0]].forEach((subject, subjectIndex) => {
      exams.push(
        stamp({
          _id: new ObjectId(),
          title: subjectIndex === 0 ? "Unit Test 1" : "Monthly Assessment",
          className: classInfo.name,
          section: classInfo.section,
          subject,
          examDate: daysFromNow(4 + classIndex + subjectIndex * 7),
          maxMarks: 100,
          results: classStudents.map((student, studentIndex) => {
            const marks = 58 + ((classIndex * 7 + studentIndex * 11 + subjectIndex * 5) % 38);
            return {
              student: student._id,
              marks,
              grade: grade(marks),
              remarks: marks >= 80 ? "Strong performance" : marks >= 65 ? "Steady progress" : "Needs revision"
            };
          })
        })
      );
    });
  });
  await db.collection("exams").insertMany(exams);

  const homework = classPlan.map((classInfo, classIndex) => {
    const classStudents = studentsByClass.get(`${classInfo.name}-${classInfo.section}`) || [];
    return stamp({
      _id: new ObjectId(),
      teacher: classInfo.teacher._id,
      className: classInfo.name,
      section: classInfo.section,
      subject: classInfo.subjects[0],
      title: `${classInfo.subjects[0]} practice worksheet`,
      description: `Complete chapter revision questions for Class ${classInfo.name}-${classInfo.section}.`,
      dueDate: daysFromNow(3 + (classIndex % 4)),
      scheduleAt: daysFromNow(-2),
      attachmentType: "link",
      attachmentUrl: "https://example.com/demo-homework",
      status: "active",
      submissions: classStudents.map((student, studentIndex) => {
        const state = (studentIndex + classIndex) % 3;
        return {
          student: student._id,
          status: state === 0 ? "reviewed" : state === 1 ? "submitted" : "pending",
          submittedAt: state === 2 ? null : daysFromNow(-1),
          marks: state === 0 ? 7 + ((studentIndex + classIndex) % 4) : null,
          feedback: state === 0 ? "Checked. Improve presentation and diagrams." : ""
        };
      })
    });
  });
  await db.collection("homeworks").insertMany(homework);

  const notices = [
    ["PTM Scheduled", "Parent teacher meeting is scheduled this Friday from 10:00 AM to 1:00 PM.", "parents", "high", -1],
    ["Unit Test Calendar Published", "Unit test timetable is live on student and parent portals.", "students", "normal", -2],
    ["Staff Briefing", "Weekly operations briefing at 8:30 AM in the conference hall.", "staff", "normal", -1],
    ["Science Exhibition", "Inter-house science exhibition entries close on Monday.", "all", "high", -3],
    ["Fee Reminder", "Please clear pending June fee dues before the due date.", "parents", "normal", 1],
    ["Holiday List Updated", "Updated holiday calendar is available in downloads.", "all", "low", -5]
  ].map(([title, body, audience, priority, day]) =>
    stamp({ _id: new ObjectId(), title, body, audience, priority, publishAt: daysFromNow(day) })
  );
  await db.collection("notices").insertMany(notices);

  const adminId = new ObjectId();
  const users = [
    stamp({ _id: adminId, name: "School Admin", email: "admin@school.test", passwordHash, role: "admin", status: "active" }),
    ...teachers.map((teacher, index) =>
      stamp({
        _id: new ObjectId(),
        name: teacher.name,
        email: `teacher${index + 1}@school.test`,
        passwordHash,
        role: "teacher",
        status: "active",
        staffProfile: teacher._id
      })
    ),
    stamp({
      _id: new ObjectId(),
      name: "Reception Desk",
      email: "reception@school.test",
      passwordHash,
      role: "reception",
      status: "active",
      staffProfile: staff.find((item) => item.role === "reception")._id
    }),
    stamp({
      _id: new ObjectId(),
      name: "Accounts Desk",
      email: "accountant@school.test",
      passwordHash,
      role: "accountant",
      status: "active",
      staffProfile: staff.find((item) => item.role === "accountant")._id
    }),
    stamp({
      _id: new ObjectId(),
      name: "Transport Desk",
      email: "staff@school.test",
      passwordHash,
      role: "staff",
      status: "active",
      staffProfile: staff.find((item) => item.role === "driver")._id
    }),
    ...Array.from({ length: 15 }, (_, index) =>
      stamp({
        _id: new ObjectId(),
        name: `Parent ${String(index + 1).padStart(2, "0")}`,
        email: `parent${String(index + 1).padStart(2, "0")}@school.test`,
        passwordHash,
        role: "parent",
        status: "active",
        childrenProfiles: students.filter((_, studentIndex) => studentIndex % 15 === index).map((student) => student._id)
      })
    ),
    ...students.map((student, index) =>
      stamp({
        _id: new ObjectId(),
        name: student.name,
        email: `student${String(index + 1).padStart(2, "0")}@school.test`,
        passwordHash,
        role: "student",
        status: "active",
        studentProfile: student._id
      })
    ),
    stamp({
      _id: new ObjectId(),
      name: "Pending Teacher Approval",
      email: "pending.teacher@school.test",
      passwordHash,
      role: "teacher",
      status: "pending"
    }),
    stamp({
      _id: new ObjectId(),
      name: "Pending Parent Approval",
      email: "pending.parent@school.test",
      passwordHash,
      role: "parent",
      status: "pending"
    })
  ];
  await db.collection("users").insertMany(users);

  const applications = [
    ["APP-2026-001", "Ahaan Bansal", "male", "6", "A", "new", "Interested in transport facility."],
    ["APP-2026-002", "Navya Joshi", "female", "8", "B", "verified", "Ready for admission confirmation."],
    ["APP-2026-003", "Zoya Ali", "female", "9", "A", "new", "Scholarship enquiry raised."]
  ].map(([applicationNo, studentName, gender, className, section, status, notes], index) =>
    stamp({
      _id: new ObjectId(),
      applicationNo,
      studentName,
      gender,
      dob: fixedDate(2012 + index, index + 1, 12 + index),
      className,
      section,
      previousSchool: ["Little Angels Public School", "City Montessori", "Rose Valley School"][index],
      bloodGroup: ["B+", "O+", "A+"][index],
      phone: `966000100${index + 1}`,
      address: `${14 + index}, Admission Lane, Jaipur`,
      guardian: {
        name: ["Ritu Bansal", "Anil Joshi", "Sameer Ali"][index],
        phone: `966000100${index + 1}`,
        email: `admission.parent${index + 1}@test.com`,
        relation: index === 0 ? "Mother" : "Father",
        occupation: ["Designer", "Engineer", "Business"][index]
      },
      documents: [
        { name: "Birth Certificate", status: index === 2 ? "received" : "verified" },
        { name: "Transfer Certificate", status: index === 0 ? "pending" : "received" },
        { name: "Report Card", status: index === 2 ? "pending" : "verified" }
      ],
      status,
      source: "online",
      notes
    })
  );
  await db.collection("admissionapplications").insertMany(applications);

  const galleryItems = [
    ["Science Lab Activity", "Students working on a guided science experiment.", "science-lab"],
    ["Annual Function Rehearsal", "Cultural team practice in the auditorium.", "annual-function"],
    ["Sports Day Practice", "Students preparing for athletics and team events.", "sports-day"],
    ["Library Reading Hour", "Middle school reading circle and book review session.", "library-reading"],
    ["Robotics Club Demo", "Computer science learners testing a robotics model.", "robotics-club"]
  ].map(([title, description, slug], index) =>
    stamp({
      _id: new ObjectId(),
      title,
      description,
      category: "gallery",
      ownerType: "school",
      url: "/images/school-portal-hero.png",
      secureUrl: "/images/school-portal-hero.png",
      publicId: `demo/gallery/${slug}`,
      resourceType: "image",
      format: "png",
      bytes: 180000 + index * 1000,
      width: 1200,
      height: 800,
      folder: "demo/gallery",
      isPublic: true,
      isActive: true,
      sortOrder: index + 1,
      createdBy: adminId
    })
  );

  const media = [
    ...galleryItems,
    ...students.slice(0, 6).map((student, index) =>
      stamp({
        _id: new ObjectId(),
        title: `${student.name} ID Document`,
        description: "Demo student document record.",
        category: "student-document",
        ownerType: "student",
        owner: student._id,
        ownerModel: "Student",
        url: "/images/school-portal-hero.png",
        secureUrl: "/images/school-portal-hero.png",
        publicId: `demo/student-documents/${student.admissionNo.toLowerCase()}`,
        resourceType: "image",
        format: "png",
        bytes: 90000 + index * 1000,
        width: 900,
        height: 600,
        folder: "demo/student-documents",
        isPublic: false,
        isActive: true,
        sortOrder: index + 1,
        createdBy: adminId
      })
    )
  ];
  await db.collection("mediaassets").insertMany(media);

  const counts = Object.fromEntries(
    await Promise.all(
      [
      "users",
        "staffs",
        "students",
        "classrooms",
        "attendances",
        "exams",
        "fees",
        "homeworks",
        "notices",
        "admissionapplications",
        "mediaassets"
      ].map(async (name) => [name === "staffs" ? "staff" : name, await db.collection(name).countDocuments()])
    )
  );

  console.log("Seed complete:", counts);
  console.log("Password for every demo login:", PASSWORD);
  console.log("Important logins:");
  [
    "admin@school.test",
    "teacher1@school.test",
    "teacher2@school.test",
    "teacher3@school.test",
    "teacher4@school.test",
    "teacher5@school.test",
    "reception@school.test",
    "accountant@school.test",
    "staff@school.test",
    "parent01@school.test",
    "student01@school.test",
    "student30@school.test"
  ].forEach((email) => console.log(`${email} / ${PASSWORD}`));
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
