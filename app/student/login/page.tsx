import PortalLoginForm from "../../components/PortalLoginForm";

export default function StudentLoginPage() {
  return (
    <PortalLoginForm
      portal="student"
      title="Student Login"
      subtitle="Attendance, homework and exam status"
      signupHref="/signup?role=student"
    />
  );
}
