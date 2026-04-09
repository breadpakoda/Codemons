import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000";
const GEMINI_KEY = "your api key"; // 🔑 Replace with your key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

/* ── helpers ── */
async function fileToBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function isPDF(filename) {
  return filename?.toLowerCase().endsWith(".pdf");
}

export default function ERPChatbot() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null); // { type, item }
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm your ERP Assistant. Select a note or assignment above, then ask me anything — I can summarise it or answer questions based on its content.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const bottomRef = useRef(null);

  /* fetch notes + assignments on mount */
  useEffect(() => {
    Promise.all([
      axios.get(`${API}/notes`).catch(() => ({ data: { notes: [] } })),
      axios.get(`${API}/assignment`).catch(() => ({ data: { assignments: [] } })),
    ]).then(([n, a]) => {
      setNotes(n.data.notes || []);
      setAssignments(a.data.assignments || []);
      setFetching(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let parts = [];

      /* ── attach file context ── */
      if (selected) {
        const { type, item } = selected;
        const fileField = item.file;
        const folder = type === "note" ? "notes" : "assignment-teacher";

        if (fileField) {
          const fileUrl = `${API}/uploads/${folder}/${fileField}`;

          if (isPDF(fileField)) {
            try {
              const b64 = await fileToBase64(fileUrl);
              parts.push({
                inline_data: { mime_type: "application/pdf", data: b64 },
              });
            } catch {
              parts.push({
                text: `[Could not load PDF for "${item.title}". Answer based on its title and description if possible.]`,
              });
            }
          } else {
            parts.push({
              text: `File attached: ${fileField}`,
            });
          }
        }

        const context =
          type === "note"
            ? `Note title: "${item.title}"\nCourse: ${item.course_code || "N/A"}\nContent: ${item.content || "No text content"}`
            : `Assignment title: "${item.title}"\nCourse: ${item.course_code || "N/A"}\nInstructions: ${item.instructions || "No instructions"}`;

        parts.push({ text: `Context:\n${context}\n\nUser question: ${trimmed}` });
      } else {
        parts.push({ text: trimmed });
      }

      const body = {
        contents: [{ role: "user", parts }],
        generationConfig: { maxOutputTokens: 1024 },
      };

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // 🔍 DEBUG — open DevTools Console to see the real Gemini response
      console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

      // surface real Gemini errors
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `⚠️ Gemini error: ${data.error.message}` },
        ]);
        return;
      }

      // safety block
      if (data.promptFeedback?.blockReason) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `⚠️ Blocked by Gemini: ${data.promptFeedback.blockReason}` },
        ]);
        return;
      }

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Gemini returned an empty response. Check console for details.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `⚠️ Network error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ───────── styles ───────── */
  const S = {
    toggle: {
      position: "fixed",
      bottom: 28,
      right: 24,
      zIndex: 9999,
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 24px rgba(99,102,241,0.55)",
      transition: "transform 0.2s",
    },
    panel: {
      position: "fixed",
      top: 0,
      right: open ? 0 : -420,
      width: 400,
      height: "100vh",
      zIndex: 9998,
      display: "flex",
      flexDirection: "column",
      background: "#0d1117",
      borderLeft: "1px solid #21262d",
      boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.6)" : "none",
      transition: "right 0.3s cubic-bezier(0.4,0,0.2,1)",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    },
    header: {
      padding: "14px 16px",
      borderBottom: "1px solid #21262d",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#161b22",
    },
    headerTitle: {
      color: "#e6edf3",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.04em",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#6366f1",
      boxShadow: "0 0 8px #6366f1",
    },
    closeBtn: {
      background: "none",
      border: "none",
      color: "#8b949e",
      cursor: "pointer",
      fontSize: 16,
      lineHeight: 1,
      padding: "2px 6px",
    },
    selectArea: {
      padding: "10px 14px",
      borderBottom: "1px solid #21262d",
      background: "#0d1117",
    },
    selectLabel: {
      color: "#8b949e",
      fontSize: 10,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 6,
    },
    select: {
      width: "100%",
      background: "#161b22",
      border: "1px solid #30363d",
      borderRadius: 6,
      color: "#e6edf3",
      fontSize: 12,
      padding: "6px 10px",
      outline: "none",
      cursor: "pointer",
    },
    selectedBadge: {
      marginTop: 6,
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "#1f2937",
      borderRadius: 4,
      padding: "4px 8px",
      fontSize: 11,
      color: "#a78bfa",
      border: "1px solid #374151",
    },
    messages: {
      flex: 1,
      overflowY: "auto",
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      scrollbarWidth: "thin",
      scrollbarColor: "#21262d #0d1117",
    },
    bubble: (role) => ({
      maxWidth: "88%",
      alignSelf: role === "user" ? "flex-end" : "flex-start",
      background: role === "user" ? "#1e3a5f" : "#161b22",
      border: `1px solid ${role === "user" ? "#1d4ed8" : "#21262d"}`,
      borderRadius: role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
      padding: "10px 13px",
      color: "#e6edf3",
      fontSize: 12.5,
      lineHeight: 1.65,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }),
    roleTag: (role) => ({
      fontSize: 9.5,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: role === "user" ? "#60a5fa" : "#a78bfa",
      marginBottom: 4,
      fontWeight: 700,
    }),
    typingDot: {
      display: "inline-block",
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#6366f1",
      animation: "erp-bounce 1.2s infinite",
    },
    inputArea: {
      padding: "12px 14px",
      borderTop: "1px solid #21262d",
      background: "#161b22",
      display: "flex",
      gap: 8,
      alignItems: "flex-end",
    },
    textarea: {
      flex: 1,
      background: "#0d1117",
      border: "1px solid #30363d",
      borderRadius: 8,
      color: "#e6edf3",
      fontSize: 12.5,
      padding: "8px 12px",
      resize: "none",
      outline: "none",
      fontFamily: "inherit",
      lineHeight: 1.5,
      minHeight: 38,
      maxHeight: 100,
    },
    sendBtn: {
      background: loading
        ? "#374151"
        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
      border: "none",
      borderRadius: 8,
      color: "#fff",
      cursor: loading ? "not-allowed" : "pointer",
      padding: "8px 14px",
      fontSize: 16,
      lineHeight: 1,
      flexShrink: 0,
      height: 38,
      transition: "opacity 0.2s",
    },
    quickActions: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      padding: "0 14px 10px",
    },
    chip: {
      background: "#161b22",
      border: "1px solid #30363d",
      borderRadius: 20,
      color: "#8b949e",
      fontSize: 11,
      padding: "4px 10px",
      cursor: "pointer",
      transition: "border-color 0.15s, color 0.15s",
    },
  };

  const quickActions = ["Summarise this", "What are the key points?", "Explain simply", "List main topics"];

  return (
    <>
      <style>{`
        @keyframes erp-bounce {
          0%,80%,100%{transform:translateY(0)}
          40%{transform:translateY(-5px)}
        }
        #erp-panel *::-webkit-scrollbar{width:4px}
        #erp-panel *::-webkit-scrollbar-track{background:#0d1117}
        #erp-panel *::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}
      `}</style>

      {/* toggle FAB */}
      <button
        style={S.toggle}
        onClick={() => setOpen((v) => !v)}
        title="ERP Assistant"
      >
        {open ? (
          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="10" r="1" fill="#fff" />
            <circle cx="12" cy="10" r="1" fill="#fff" />
            <circle cx="15" cy="10" r="1" fill="#fff" />
          </svg>
        )}
      </button>

      {/* side panel */}
      <div id="erp-panel" style={S.panel}>
        {/* header */}
        <div style={S.header}>
          <div style={S.headerTitle}>
            <span style={S.dot} />
            ERP Assistant
            <span style={{ color: "#8b949e", fontWeight: 400 }}>· Gemini</span>
          </div>
          <button style={S.closeBtn} onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* file selector */}
        <div style={S.selectArea}>
          <div style={S.selectLabel}>Context · Select a note or assignment</div>
          {fetching ? (
            <div style={{ color: "#8b949e", fontSize: 11 }}>Loading files…</div>
          ) : (
            <select
              style={S.select}
              value={selected ? `${selected.type}::${selected.item._id}` : ""}
              onChange={(e) => {
                if (!e.target.value) { setSelected(null); return; }
                const [type, id] = e.target.value.split("::");
                const list = type === "note" ? notes : assignments;
                const item = list.find((x) => x._id === id);
                setSelected({ type, item });
              }}
            >
              <option value="">— None (general chat) —</option>
              {notes.length > 0 && (
                <optgroup label="📝 Notes">
                  {notes.map((n) => (
                    <option key={n._id} value={`note::${n._id}`}>
                      {n.title} {n.course_code ? `(${n.course_code})` : ""}
                    </option>
                  ))}
                </optgroup>
              )}
              {assignments.length > 0 && (
                <optgroup label="📋 Assignments">
                  {assignments.map((a) => (
                    <option key={a._id} value={`assignment::${a._id}`}>
                      {a.title} {a.course_code ? `(${a.course_code})` : ""}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          )}
          {selected && (
            <div style={S.selectedBadge}>
              {selected.type === "note" ? "📝" : "📋"} &nbsp;
              <strong>{selected.item.title}</strong>
              {selected.item.file && (
                <span style={{ color: "#6ee7b7", marginLeft: "auto" }}>
                  {isPDF(selected.item.file) ? "📄 PDF attached" : "📎 File attached"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* quick actions */}
        {selected && (
          <div style={S.quickActions}>
            {quickActions.map((q) => (
              <button
                key={q}
                style={S.chip}
                onClick={() => { setInput(q); }}
                onMouseEnter={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.color = "#a78bfa"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#30363d"; e.target.style.color = "#8b949e"; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* messages */}
        <div style={S.messages}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
              <div style={S.roleTag(m.role)}>{m.role === "user" ? "You" : "Assistant"}</div>
              <div style={S.bubble(m.role)}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start" }}>
              <div style={S.roleTag("bot")}>Assistant</div>
              <div style={{ ...S.bubble("bot"), display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{ ...S.typingDot, animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* input */}
        <div style={S.inputArea}>
          <textarea
            style={S.textarea}
            rows={1}
            placeholder={selected ? `Ask about "${selected.item.title}"…` : "Ask anything…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
          />
          <button style={S.sendBtn} onClick={sendMessage} disabled={loading}>
            {loading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* backdrop on mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9997,
            background: "rgba(0,0,0,0.35)",
            display: window.innerWidth < 500 ? "block" : "none",
          }}
        />
      )}
    </>
  );
}