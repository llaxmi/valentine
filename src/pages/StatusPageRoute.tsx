import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import StatusPage from "../components/StatusPage";

export default function StatusPageRoute(): ReactNode {
  const { token } = useParams<{ token: string }>();

  if (!token) return null;

  return (
    <PageShell>
      <StatusPage senderToken={token} />
    </PageShell>
  );
}
