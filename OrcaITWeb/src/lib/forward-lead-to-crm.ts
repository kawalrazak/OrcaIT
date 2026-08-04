/**
 * Forward a website enquiry/booking to the CRM so it appears in Manage Leads.
 * Failures are logged but do not break the public form response.
 */
export async function forwardLeadToCrm(payload: Record<string, unknown>) {
  const baseUrl = (
    process.env.CRM_INTERNAL_URL ||
    process.env.CRM_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[crm-forward] ${response.status}: ${text}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[crm-forward] failed:", error);
    return false;
  }
}
