export type RTIStatus = "Submitted" | "Assigned" | "In Review" | "Replied" | "Overdue";
export interface RTILog { status: string; timestamp: string; remarks: string; officer?: string }
export interface RTIReply { reply_text: string; replied_at: string }
export interface RTIApplication {
  id: string; tracking_number: string; citizen_id: string; department_id: string; assigned_pio_id: string | null;
  subject: string; description: string; is_urgent: boolean; status: RTIStatus; created_at: string; due_date: string;
  department: string; assigned_pio: string | null; logs: RTILog[]; reply: RTIReply | null;
}
const now = new Date();
const dateOffset = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();
export const departments = ["Public Works", "Revenue", "Municipal Admin", "Health"];
export const mockApplications: RTIApplication[] = [
  { id: "rti-001", tracking_number: "RTI-2026-0001", citizen_id: "citizen-01", department_id: "public-works", assigned_pio_id: "pio-12", subject: "Road repair timeline — MG Road, Ward 14", description: "Requesting the approved timeline and contractor details for ongoing road repairs on MG Road, Ward 14.", is_urgent: false, status: "In Review", created_at: dateOffset(-12), due_date: dateOffset(18), department: "Public Works", assigned_pio: "Priya Menon", logs: [{ status: "Submitted", timestamp: dateOffset(-12), remarks: "Application received and acknowledged." }, { status: "Assigned", timestamp: dateOffset(-11), remarks: "Forwarded to the roads & infrastructure division.", officer: "Priya Menon" }, { status: "In Review", timestamp: dateOffset(-7), remarks: "Records are being collated from the ward office.", officer: "Priya Menon" }], reply: null },
  { id: "rti-002", tracking_number: "RTI-2026-0002", citizen_id: "citizen-01", department_id: "revenue", assigned_pio_id: "pio-08", subject: "Property tax assessment records, 2023–24", description: "Seeking a copy of the property tax assessment and revision records for the 2023–24 financial year.", is_urgent: false, status: "Replied", created_at: dateOffset(-26), due_date: dateOffset(4), department: "Revenue", assigned_pio: "Rohan Desai", logs: [{ status: "Submitted", timestamp: dateOffset(-26), remarks: "Application received and acknowledged." }, { status: "Assigned", timestamp: dateOffset(-25), remarks: "Assigned to the property assessment desk.", officer: "Rohan Desai" }, { status: "Replied", timestamp: dateOffset(-8), remarks: "Response issued with the requested records attached.", officer: "Rohan Desai" }], reply: { reply_text: "The requested assessment records for FY 2023–24 are available. A certified copy has been prepared and is attached to this response.", replied_at: dateOffset(-8) } },
];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export async function fetchApplications(): Promise<RTIApplication[]> {
  try { const response = await fetch(`${API_URL}/api/applications`, { cache: "no-store", signal: AbortSignal.timeout(1800) }); if (!response.ok) throw new Error("API unavailable"); return await response.json(); }
  catch { return mockApplications; }
}
export async function submitApplication(input: Pick<RTIApplication, "department_id" | "subject" | "description" | "is_urgent">): Promise<RTIApplication> {
  try { const response = await fetch(`${API_URL}/api/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(1800) }); if (!response.ok) throw new Error("API unavailable"); return await response.json(); }
  catch {
    const sequence = Math.floor(1000 + Math.random() * 9000);
    const department = departments.find((name) => name.toLowerCase().replaceAll(" ", "-") === input.department_id) ?? input.department_id;
    const created = new Date();
    return { ...input, id: `rti-${sequence}`, tracking_number: `RTI-2026-${String(sequence).padStart(4, "0")}`, citizen_id: "citizen-01", assigned_pio_id: null, status: "Submitted", created_at: created.toISOString(), due_date: new Date(created.getTime() + (input.is_urgent ? 2 : 30) * 86400000).toISOString(), department, assigned_pio: null, logs: [{ status: "Submitted", timestamp: created.toISOString(), remarks: "Application received and acknowledged." }], reply: null };
  }
}
