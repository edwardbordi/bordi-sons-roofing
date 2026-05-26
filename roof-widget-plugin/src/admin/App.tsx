import { useEffect, useState } from "react";

import { DEFAULT_CONFIG } from "../widget/defaults";
import { mergeConfig } from "../widget/merge-config";
import type { FrameCountMode, RoofConfig } from "../widget/types";
import { loadConfig, saveConfig } from "./api";
import { ColorInput, NumberInput, Select, TextArea, TextInput, Toggle } from "./controls";

type Tab = "content" | "labels" | "animation" | "colors" | "typography" | "layout";
type Status = "loading" | "idle" | "saving" | "saved" | "error";

const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: "content", label: "Content" },
  { id: "labels", label: "Labels" },
  { id: "animation", label: "Animation" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "layout", label: "Layout" },
];

const FRAME_MODES: ReadonlyArray<{ value: FrameCountMode; label: string }> = [
  { value: "smooth", label: "Smooth (151 frames)" },
  { value: "balanced", label: "Balanced (100 frames)" },
  { value: "lite", label: "Lite (75 frames)" },
];

export function App() {
  const [config, setConfig] = useState<RoofConfig>(DEFAULT_CONFIG);
  const [tab, setTab] = useState<Tab>("content");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadConfig()
      .then((raw) => {
        setConfig(mergeConfig(raw));
        setStatus("idle");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Failed to load settings.");
      });
  }, []);

  const updateTheme = (patch: Partial<RoofConfig["theme"]>) =>
    setConfig((c) => ({ ...c, theme: { ...c.theme, ...patch } }));
  const updateAnimation = (patch: Partial<RoofConfig["animation"]>) =>
    setConfig((c) => ({ ...c, animation: { ...c.animation, ...patch } }));
  const updateLayout = (patch: Partial<RoofConfig["layout"]>) =>
    setConfig((c) => ({ ...c, layout: { ...c.layout, ...patch } }));
  const updateTypography = (patch: Partial<RoofConfig["typography"]>) =>
    setConfig((c) => ({ ...c, typography: { ...c.typography, ...patch } }));
  const updateLabel = (i: number, patch: Partial<RoofConfig["labels"][number]>) =>
    setConfig((c) => ({ ...c, labels: c.labels.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) }));
  const updateContent = (sub: keyof RoofConfig["content"], patch: object) =>
    setConfig(
      (c) => ({ ...c, content: { ...c.content, [sub]: { ...c.content[sub], ...patch } } }) as RoofConfig,
    );

  const save = () => {
    setStatus("saving");
    setMessage("");
    saveConfig(config)
      .then((res) => {
        setConfig(mergeConfig(res.config));
        setStatus("saved");
        setMessage("Settings saved.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Failed to save settings.");
      });
  };

  const resetDefaults = () => setConfig(DEFAULT_CONFIG);

  if (status === "loading") {
    return <p>Loading settings…</p>;
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Save bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "8px 0 16px",
          padding: "10px 12px",
          background: "#fff",
          border: "1px solid #c3c4c7",
          borderRadius: 4,
        }}
      >
        <button
          type="button"
          className="button button-primary"
          onClick={save}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Save settings"}
        </button>
        <button type="button" className="button" onClick={resetDefaults}>
          Reset to defaults
        </button>
        {message ? (
          <span style={{ color: status === "error" ? "#d63638" : "#00a32a", fontSize: 13 }}>
            {message}
          </span>
        ) : null}
      </div>

      {/* Tabs */}
      <nav className="nav-tab-wrapper" style={{ marginBottom: 16 }}>
        {TABS.map((t) => (
          <a
            key={t.id}
            href="#"
            className={`nav-tab${tab === t.id ? " nav-tab-active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setTab(t.id);
            }}
          >
            {t.label}
          </a>
        ))}
      </nav>

      {tab === "content" && (
        <section>
          <TextInput
            label="Eyebrow text"
            value={config.content.eyebrow.text}
            onChange={(v) => updateContent("eyebrow", { text: v })}
          />
          <Toggle
            label="Show eyebrow"
            checked={config.content.eyebrow.show}
            onChange={(v) => updateContent("eyebrow", { show: v })}
          />
          <TextInput
            label="Heading"
            value={config.content.heading.text}
            onChange={(v) => updateContent("heading", { text: v })}
          />
          <TextArea
            label="Subhead"
            value={config.content.subhead.text}
            onChange={(v) => updateContent("subhead", { text: v })}
          />
          <Toggle
            label="Show subhead"
            checked={config.content.subhead.show}
            onChange={(v) => updateContent("subhead", { show: v })}
          />
        </section>
      )}

      {tab === "labels" && (
        <section>
          <p style={{ color: "#646970", fontSize: 13, marginBottom: 12 }}>
            The six layers, in install order. (A visual drag-to-position editor is coming; for now
            positions are numeric, in the 1284×716 canvas space.)
          </p>
          {config.labels.map((label, i) => (
            <fieldset
              key={i}
              style={{ border: "1px solid #c3c4c7", borderRadius: 4, padding: 12, marginBottom: 14 }}
            >
              <legend style={{ fontWeight: 600, padding: "0 6px" }}>
                #{label.step} — {label.title || "(untitled)"}
              </legend>
              <TextInput label="Title" value={label.title} onChange={(v) => updateLabel(i, { title: v })} />
              <TextArea
                label="Description"
                value={label.description}
                onChange={(v) => updateLabel(i, { description: v })}
              />
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <NumberInput label="Step" value={label.step} onChange={(v) => updateLabel(i, { step: v })} />
                <Select
                  label="Side"
                  value={label.side}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                  ]}
                  onChange={(v) => updateLabel(i, { side: v })}
                />
                <NumberInput label="Dot X" value={label.dotX} onChange={(v) => updateLabel(i, { dotX: v })} />
                <NumberInput label="Dot Y" value={label.dotY} onChange={(v) => updateLabel(i, { dotY: v })} />
                <NumberInput
                  label="Reveal threshold (0–1)"
                  value={label.threshold}
                  step={0.01}
                  min={0}
                  max={1}
                  onChange={(v) => updateLabel(i, { threshold: v })}
                />
              </div>
            </fieldset>
          ))}
        </section>
      )}

      {tab === "animation" && (
        <section>
          <NumberInput
            label="Runway height (vh)"
            value={config.animation.runwayVh}
            min={100}
            onChange={(v) => updateAnimation({ runwayVh: v })}
            help="Total scroll length of the section."
          />
          <NumberInput
            label="Hold start (0–1)"
            value={config.animation.holdStart}
            step={0.01}
            min={0}
            max={1}
            onChange={(v) => updateAnimation({ holdStart: v })}
            help="Fraction of scroll after which the fully-exploded frame holds."
          />
          <NumberInput
            label="Fade duration (ms)"
            value={config.animation.fadeMs}
            onChange={(v) => updateAnimation({ fadeMs: v })}
          />
          <NumberInput
            label="Connector reveal — desktop (0–1)"
            value={config.animation.arrowThreshold}
            step={0.01}
            min={0}
            max={1}
            onChange={(v) => updateAnimation({ arrowThreshold: v })}
          />
          <NumberInput
            label="Connector reveal — mobile (0–1)"
            value={config.animation.mobileArrowThreshold}
            step={0.01}
            min={0}
            max={1}
            onChange={(v) => updateAnimation({ mobileArrowThreshold: v })}
          />
          <Select
            label="Smoothness"
            value={config.animation.frameCountMode}
            options={FRAME_MODES}
            onChange={(v) => updateAnimation({ frameCountMode: v })}
            help="Fewer frames = lighter payload, slightly less smooth."
          />
        </section>
      )}

      {tab === "colors" && (
        <section>
          <ColorInput label="Primary" value={config.theme.colorPrimary} onChange={(v) => updateTheme({ colorPrimary: v })} />
          <ColorInput label="Accent" value={config.theme.colorAccent} onChange={(v) => updateTheme({ colorAccent: v })} />
          <ColorInput label="Dot" value={config.theme.colorDot} onChange={(v) => updateTheme({ colorDot: v })} />
          <ColorInput label="Connector line" value={config.theme.colorLine} onChange={(v) => updateTheme({ colorLine: v })} />
          <ColorInput label="Section background" value={config.theme.sectionBg} onChange={(v) => updateTheme({ sectionBg: v })} />
          <ColorInput label="Heading text" value={config.theme.headingColor} onChange={(v) => updateTheme({ headingColor: v })} />
          <ColorInput label="Eyebrow text" value={config.theme.eyebrowColor} onChange={(v) => updateTheme({ eyebrowColor: v })} />
          <ColorInput label="Subhead text" value={config.theme.subheadColor} onChange={(v) => updateTheme({ subheadColor: v })} />
          <ColorInput label="Bubble background" value={config.theme.bubbleBg} onChange={(v) => updateTheme({ bubbleBg: v })} />
          <ColorInput label="Bubble border" value={config.theme.bubbleBorder} onChange={(v) => updateTheme({ bubbleBorder: v })} />
          <ColorInput label="Bubble text" value={config.theme.bubbleText} onChange={(v) => updateTheme({ bubbleText: v })} />
        </section>
      )}

      {tab === "typography" && (
        <section>
          <TextInput
            label="Font family"
            value={config.typography.fontFamily}
            onChange={(v) => updateTypography({ fontFamily: v })}
            help='CSS font stack, e.g. "Georgia, serif". Ignored if "Inherit host font" is on.'
          />
          <Toggle
            label="Inherit host font"
            checked={config.typography.inheritHostFont}
            onChange={(v) => updateTypography({ inheritHostFont: v })}
            help="Use the surrounding theme's font instead of the configured stack."
          />
          <NumberInput
            label="Heading scale"
            value={config.typography.headingScale}
            step={0.05}
            min={0.5}
            max={2}
            onChange={(v) => updateTypography({ headingScale: v })}
          />
        </section>
      )}

      {tab === "layout" && (
        <section>
          <NumberInput
            label="Max width (px)"
            value={config.layout.maxWidth}
            min={320}
            onChange={(v) => updateLayout({ maxWidth: v })}
          />
          <Toggle
            label="Desktop bubble labels"
            checked={config.layout.desktopLabels}
            onChange={(v) => updateLayout({ desktopLabels: v })}
          />
          <Toggle
            label="Mobile pill labels"
            checked={config.layout.mobilePills}
            onChange={(v) => updateLayout({ mobilePills: v })}
          />
        </section>
      )}
    </div>
  );
}
