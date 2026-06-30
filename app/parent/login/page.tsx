import PortalLoginForm from "../../components/PortalLoginForm";

export default function ParentLoginPage() {
  return (
    <PortalLoginForm
      portal="parent"
      title="Parent / User Login"
      subtitle="Child progress, attendance and fee insights"
      signupHref="/signup?role=parent"
    />
  );
}
