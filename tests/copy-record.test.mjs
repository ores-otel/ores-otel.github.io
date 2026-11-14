import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {format_record} from "../public/copy-otel-record.js";

test("static sample copied as valid, redacted, indented JSON", () => {
  const json = format_record('{"schema":"next-loggers/v1","message":"invoice.created","context":{"customer_email":"[REDACTED]"}}');
  assert.deepEqual(JSON.parse(json), {
    schema: "next-loggers/v1", message: "invoice.created",
    context: {customer_email: "[REDACTED]"},
  });
  assert.match(json, /\n  "schema"/);
});

test("malformed and oversized examples fail closed", () => {
  for (const bad of ["", "not JSON", "[]", "{}", '{"schema":"wrong","message":"foo"}', "x".repeat(8193)]) {
    assert.throws(() => format_record(bad));
  }
});

test("UI uses an opt-in copy action and feedback, never automatic clipboard access", () => {
  const source = readFileSync("src/pages/index.astro", "utf8");
  const script = readFileSync("public/copy-otel-record.js", "utf8");
  assert.match(source, /id="copy-otel-record" type="button"/);
  assert.match(source, /id="copy-otel-status" role="status" aria-live="polite"/);
  assert.match(source, /id="otel-record-example"/);
  assert.match(script, /addEventListener\("click"/);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest/);
});
