import type { ReactNode } from "react";

// Plain inline-styled form controls. The admin app deliberately avoids Tailwind
// (its reset would clobber wp-admin), so everything is styled inline against the
// native wp-admin look.

const ROW: React.CSSProperties = { marginBottom: 16, maxWidth: 560 };
const LABEL: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 4,
  fontSize: 13,
  color: "#1d2327",
};
const HELP: React.CSSProperties = { color: "#646970", fontSize: 12, marginTop: 3 };
// Fixed height so text inputs and the native <select> line up in flex rows
// (a select with only padding renders taller than an input).
const INPUT: React.CSSProperties = {
  width: "100%",
  height: 36,
  padding: "0 10px",
  border: "1px solid #8c8f94",
  borderRadius: 4,
  fontSize: 14,
  boxSizing: "border-box",
};

export function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div style={ROW}>
      <label style={LABEL}>{label}</label>
      {children}
      {help ? <p style={HELP}>{help}</p> : null}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  return (
    <Field label={label} help={help}>
      <input style={INPUT} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  return (
    <Field label={label} help={help}>
      <textarea
        style={{ ...INPUT, height: "auto", minHeight: 64, padding: "8px 10px", resize: "vertical" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  step,
  min,
  max,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  help?: string;
}) {
  return (
    <Field label={label} help={help}>
      <input
        style={{ ...INPUT, maxWidth: 160 }}
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </Field>
  );
}

export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <input
          type="color"
          value={normalizeColor(value)}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 40, height: 36, padding: 0, border: "1px solid #8c8f94", borderRadius: 4 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...INPUT, width: 180 }}
        />
      </span>
    </Field>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  help,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  help?: string;
}) {
  return (
    <div style={ROW}>
      <label style={{ ...LABEL, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
      {help ? <p style={HELP}>{help}</p> : null}
    </div>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  help,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (v: T) => void;
  help?: string;
}) {
  return (
    <Field label={label} help={help}>
      <select
        style={{ ...INPUT, minWidth: 140, maxWidth: 240 }}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// <input type="color"> only accepts #rrggbb; fall back gracefully for rgba/etc.
function normalizeColor(v: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : "#000000";
}
