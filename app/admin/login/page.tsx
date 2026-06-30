import PortalLoginForm from "../../components/PortalLoginForm";

export default function AdminLoginPage() {
  return (
    <PortalLoginForm
      portal="admin"
      title="Admin Login"
      subtitle="Restricted management access"
      signupHref="/signup?role=admin"
    />
  );
}
