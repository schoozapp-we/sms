import PortalLoginForm from "../../components/PortalLoginForm";

export default function TeacherLoginPage() {
  return (
    <PortalLoginForm
      portal="teacher"
      title="Teacher Login"
      subtitle="Classroom and academic workflow access"
      signupHref="/signup?role=teacher"
    />
  );
}
