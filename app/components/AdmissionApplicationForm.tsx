"use client";

import type React from "react";
import { useState } from "react";
import { Send } from "lucide-react";

const initialForm = {
  studentName: "",
  gender: "male",
  dob: "",
  className: "",
  section: "A",
  previousSchool: "",
  bloodGroup: "",
  phone: "",
  address: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  guardianRelation: "Father",
  guardianOccupation: "",
  notes: ""
};

export function AdmissionApplicationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof initialForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.studentName || !form.className || !form.guardianName || !form.guardianPhone) {
      setError("Student name, class, guardian name aur guardian phone required hai.");
      return;
    }

    setLoading(true);
    setStatus("");
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admissions/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: form.studentName,
          gender: form.gender,
          dob: form.dob || undefined,
          className: form.className,
          section: form.section,
          previousSchool: form.previousSchool,
          bloodGroup: form.bloodGroup,
          phone: form.phone,
          address: form.address,
          notes: form.notes,
          guardian: {
            name: form.guardianName,
            phone: form.guardianPhone,
            email: form.guardianEmail,
            relation: form.guardianRelation,
            occupation: form.guardianOccupation
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Application submit nahi ho payi.");
        return;
      }

      setStatus(`Application submitted. Application No: ${data.applicationNo}`);
      setForm(initialForm);
    } catch {
      setError("Server se connect nahi ho pa raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admissionFormSection" id="admission-form">
      <div className="sectionHeading">
        <p>Online Form</p>
        <h2>Student admission application</h2>
        <span>Reception team details verify karke admission confirm karegi.</span>
      </div>

      {status && <div className="successBox">{status}</div>}
      {error && <div className="errorBox">{error}</div>}

      <form className="admissionForm" onSubmit={onSubmit}>
        <div className="formGrid">
          <label>
            <span>Student Name</span>
            <input value={form.studentName} onChange={set("studentName")} placeholder="Aarav Sharma" />
          </label>
          <label>
            <span>Class Applying For</span>
            <input value={form.className} onChange={set("className")} placeholder="6" />
          </label>
          <label>
            <span>Section</span>
            <input value={form.section} onChange={set("section")} placeholder="A" />
          </label>
          <label>
            <span>Gender</span>
            <select value={form.gender} onChange={set("gender")}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            <span>Date of Birth</span>
            <input type="date" value={form.dob} onChange={set("dob")} />
          </label>
          <label>
            <span>Blood Group</span>
            <input value={form.bloodGroup} onChange={set("bloodGroup")} placeholder="B+" />
          </label>
          <label>
            <span>Previous School</span>
            <input value={form.previousSchool} onChange={set("previousSchool")} placeholder="Previous school name" />
          </label>
          <label>
            <span>Student Phone</span>
            <input value={form.phone} onChange={set("phone")} placeholder="Optional" />
          </label>
          <label>
            <span>Guardian Name</span>
            <input value={form.guardianName} onChange={set("guardianName")} placeholder="Parent/guardian name" />
          </label>
          <label>
            <span>Guardian Phone</span>
            <input value={form.guardianPhone} onChange={set("guardianPhone")} placeholder="Mobile number" />
          </label>
          <label>
            <span>Guardian Email</span>
            <input type="email" value={form.guardianEmail} onChange={set("guardianEmail")} placeholder="parent@email.com" />
          </label>
          <label>
            <span>Relation</span>
            <input value={form.guardianRelation} onChange={set("guardianRelation")} placeholder="Father/Mother/Guardian" />
          </label>
          <label>
            <span>Occupation</span>
            <input value={form.guardianOccupation} onChange={set("guardianOccupation")} placeholder="Occupation" />
          </label>
          <label className="wide">
            <span>Address</span>
            <textarea value={form.address} onChange={set("address")} placeholder="Full address" />
          </label>
          <label className="wide">
            <span>Notes</span>
            <textarea value={form.notes} onChange={set("notes")} placeholder="Transport need, sibling details, special note..." />
          </label>
        </div>

        <button className="heroPrimaryLink admissionSubmit" type="submit" disabled={loading}>
          <Send size={16} /> {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </section>
  );
}
