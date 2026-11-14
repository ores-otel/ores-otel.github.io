/**
 * Standalone, dependency-free sample copy. The product never reads page
 * telemetry or contacts an API when the operator copies the static example.
 */
export function format_record(text) {
  if (typeof text !== "string" || text.length > 8192) throw new Error("invalid_example");
  const value = JSON.parse(text);
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      value.schema !== "next-loggers/v1" || typeof value.message !== "string") {
    throw new Error("invalid_example");
  }
  return JSON.stringify(value, null, 2);
}

if (typeof document !== "undefined") {
  const button = document.getElementById("copy-otel-record");
  const status = document.getElementById("copy-otel-status");
  button?.addEventListener("click", async () => {
    try {
      const source = document.getElementById("otel-record-example");
      if (!source || !navigator.clipboard?.writeText) throw new Error("clipboard_unavailable");
      await navigator.clipboard.writeText(format_record(source.textContent ?? ""));
      if (status) status.textContent = "Copied illustrative JSON";
    } catch {
      if (status) status.textContent = "Copy unavailable";
    }
  });
}
