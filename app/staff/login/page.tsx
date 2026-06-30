import PortalLoginForm from "../../components/PortalLoginForm";

export default function StaffLoginPage() {
  return (
    <PortalLoginForm
      portal="staff"
      title="Staff Login"
      subtitle="Back-office and records operations"
      signupHref="/signup?role=staff"
    />
  );
}
