import PortalLoginForm from "../../components/PortalLoginForm";

export default function UserLoginPage() {
  return (
    <PortalLoginForm
      portal="user"
      title="User Login"
      subtitle="Parent portal access"
      signupHref="/signup?role=parent"
    />
  );
}
