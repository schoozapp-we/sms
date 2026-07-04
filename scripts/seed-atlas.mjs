import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const guardianSchema = new Schema(
  {
    name: String,
    phone: String,
    email: String,
    relation: String
  },
  { _id: false }
);

const staffSchema = new Schema(
  {
    employeeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["teacher", "accountant", "reception", "driver", "admin"], required: true },
    department: String,
    subjects: [String],
    phone: String,
    email: String,
    profileImageUrl: String,
    qualification: String,
    experience: String,
    bio: String,
    showOnWebsite: { type: Boolean, default: true },
    joinedAt: Date,
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

const studentSchema = new Schema(
  {
    admissionNo: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: Date,
    className: { type: String, required: true },
    section: { type: String, default: "A" },
    rollNo: String,
    phone: String,
    address: String,
    profileImageUrl: String,
    guardian: guardianSchema,
    status: { type: String, enum: ["active", "inactive", "alumni"], default: "active" }
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", admissionNo: "text", className: "text" });

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "accountant", "reception", "staff", "parent", "student"],
      default: "admin"
    },
    status: { type: String, enum: ["active", "pending", "blocked"], default: "active" },
    staffProfile: { type: Schema.Types.ObjectId, ref: "Staff", default: null },
    studentProfile: { type: Schema.Types.ObjectId, ref: "Student", default: null },
    childrenProfiles: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const classRoomSchema = new Schema(
  {
    name: { type: String, required: true },
    section: { type: String, required: true },
    classTeacher: { type: Schema.Types.ObjectId, ref: "Staff" },
    capacity: { type: Number, default: 40 },
    timetable: [
      {
        day: String,
        period: Number,
        subject: String,
        teacher: { type: Schema.Types.ObjectId, ref: "Staff" }
      }
    ]
  },
  { timestamps: true }
);

const attendanceSchema = new Schema(
  {
    date: { type: Date, required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    records: [
      {
        student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
        status: { type: String, enum: ["present", "absent", "late", "leave"], required: true },
        note: String
      }
    ]
  },
  { timestamps: true }
);

const examSchema = new Schema(
  {
    title: { type: String, required: true },
    className: { type: String, required: true },
    section: String,
    subject: { type: String, required: true },
    examDate: Date,
    maxMarks: { type: Number, default: 100 },
    results: [
      {
        student: { type: Schema.Types.ObjectId, ref: "Student" },
        marks: Number,
        grade: String,
        remarks: String
      }
    ]
  },
  { timestamps: true }
);

const feeSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    invoiceNo: { type: String, required: true, unique: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: Date,
    paidAt: Date,
    status: { type: String, enum: ["paid", "partial", "pending", "overdue"], default: "pending" }
  },
  { timestamps: true }
);

const noticeSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    audience: { type: String, enum: ["all", "students", "parents", "staff"], default: "all" },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    publishAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Staff = mongoose.models.Staff || mongoose.model("Staff", staffSchema);
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const ClassRoom = mongoose.models.ClassRoom || mongoose.model("ClassRoom", classRoomSchema);
const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
const Notice = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(uri, { autoIndex: true });

  await Promise.all([
    User.deleteMany(),
    Staff.deleteMany(),
    Student.deleteMany(),
    ClassRoom.deleteMany(),
    Attendance.deleteMany(),
    Exam.deleteMany(),
    Fee.deleteMany(),
    Notice.deleteMany()
  ]);

  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const teacherStaff = await Staff.create({
    employeeCode: "EMP-001",
    name: "Neha Teacher",
    role: "teacher",
    department: "Science",
    subjects: ["Physics", "Chemistry"],
    phone: "9999999999",
    email: "teacher@school.test"
  });

  const officeStaff = await Staff.create({
    employeeCode: "EMP-002",
    name: "Ramesh Staff",
    role: "reception",
    department: "Administration",
    subjects: [],
    phone: "9888888888",
    email: "staff@school.test"
  });

  await ClassRoom.insertMany([
    { name: "10", section: "A", classTeacher: teacherStaff._id, capacity: 45 },
    { name: "10", section: "B", classTeacher: teacherStaff._id, capacity: 45 }
  ]);

  const students = await Student.insertMany([
    {
      admissionNo: "ADM-1001",
      name: "Aarav Mehta",
      gender: "male",
      className: "10",
      section: "A",
      rollNo: "1",
      guardian: { name: "Rohit Mehta", phone: "9880000001", relation: "father" }
    },
    {
      admissionNo: "ADM-1002",
      name: "Anaya Singh",
      gender: "female",
      className: "10",
      section: "A",
      rollNo: "2",
      guardian: { name: "Kavita Singh", phone: "9880000002", relation: "mother" }
    }
  ]);

  await Attendance.create({
    date: new Date(),
    className: "10",
    section: "A",
    records: [
      { student: students[0]._id, status: "present" },
      { student: students[1]._id, status: "late" }
    ]
  });

  await Exam.create({
    title: "Unit Test 1",
    className: "10",
    section: "A",
    subject: "Mathematics",
    examDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    maxMarks: 100,
    results: []
  });

  await Fee.insertMany([
    {
      student: students[0]._id,
      invoiceNo: "INV-2026-001",
      month: "June-2026",
      amount: 4200,
      paidAmount: 4200,
      status: "paid",
      dueDate: new Date()
    },
    {
      student: students[1]._id,
      invoiceNo: "INV-2026-002",
      month: "June-2026",
      amount: 4200,
      paidAmount: 2000,
      status: "partial",
      dueDate: new Date()
    }
  ]);

  await Notice.insertMany([
    {
      title: "PTM Scheduled",
      body: "Parent teacher meeting is scheduled this Friday at 11:00 AM.",
      audience: "parents",
      priority: "high"
    },
    {
      title: "Unit Test Calendar",
      body: "Unit test timetable has been published on student portal.",
      audience: "students",
      priority: "normal"
    },
    {
      title: "Staff Briefing",
      body: "Weekly operations briefing at 8:30 AM in conference hall.",
      audience: "staff",
      priority: "normal"
    },
    {
      title: "School Foundation Day",
      body: "Foundation day celebration rehearsal starts from Monday.",
      audience: "all",
      priority: "low"
    }
  ]);

  await User.create([
    {
      name: "School Admin",
      email: "admin@school.test",
      passwordHash,
      role: "admin"
    },
    {
      name: "Neha Teacher",
      email: "teacher@school.test",
      passwordHash,
      role: "teacher",
      staffProfile: teacherStaff._id
    },
    {
      name: "Ramesh Staff",
      email: "staff@school.test",
      passwordHash,
      role: "staff",
      staffProfile: officeStaff._id
    },
    {
      name: "Sunita Parent",
      email: "parent@school.test",
      passwordHash,
      role: "parent",
      childrenProfiles: [students[0]._id, students[1]._id]
    },
    {
      name: "Aarav Student",
      email: "student@school.test",
      passwordHash,
      role: "student",
      studentProfile: students[0]._id
    }
  ]);

  const counts = {
    users: await User.countDocuments(),
    staff: await Staff.countDocuments(),
    students: await Student.countDocuments(),
    classes: await ClassRoom.countDocuments(),
    attendance: await Attendance.countDocuments(),
    exams: await Exam.countDocuments(),
    fees: await Fee.countDocuments(),
    notices: await Notice.countDocuments()
  };

  console.log("Seed complete:", counts);
  console.log("Logins:");
  console.log("admin@school.test / Admin@12345");
  console.log("teacher@school.test / Admin@12345");
  console.log("staff@school.test / Admin@12345");
  console.log("parent@school.test / Admin@12345");
  console.log("student@school.test / Admin@12345");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
