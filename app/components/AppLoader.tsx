import { ShieldCheck } from "lucide-react";

type AppLoaderProps = {
  title?: string;
  message?: string;
  compact?: boolean;
};

export default function AppLoader({
  title = "EduSphere",
  message = "Loading secure school workspace...",
  compact = false
}: AppLoaderProps) {
  return (
    <div className={compact ? "appLoader compact" : "appLoader"} role="status" aria-live="polite">
      <div className="appLoaderMark" aria-hidden="true">
        <span />
        <ShieldCheck size={34} />
      </div>
      <div className="appLoaderText">
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <div className="appLoaderBar" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
