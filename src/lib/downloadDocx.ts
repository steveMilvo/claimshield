function safeName(title: string): string {
  return (
    title
      .replace(/[^a-zA-Z0-9 _.-]/g, "")
      .replace(/\s+/g, "_")
      .replace(/^\.+/, "")
      .slice(0, 80) || "ClaimShield_document"
  );
}

export async function downloadDocx(
  title: string,
  body: string,
  kind?: "appeal" | "demand" | "complaint",
): Promise<void> {
  const res = await fetch("/api/document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, kind }),
  });
  if (!res.ok) {
    let msg = `Download failed (${res.status}).`;
    try {
      msg = (await res.json())?.error ?? msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName(title)}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
