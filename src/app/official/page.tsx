import OfficialConsole from "@/components/official-console";
import { fetchApplications } from "@/lib/api";

export default async function OfficialPortal() {
  const applications = await fetchApplications();
  return <OfficialConsole initialApplications={applications} />;
}
