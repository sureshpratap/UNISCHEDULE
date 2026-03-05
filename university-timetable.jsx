import { useState, useCallback } from "react";

// ─── Palette & helpers ────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0f1117",
  surface: "#1a1d27",
  card: "#21253a",
  border: "#2e3352",
  accent: "#6c63ff",
  accentLight: "#8b85ff",
  accentDim: "#2d2b5e",
  gold: "#f5c542",
  green: "#34d399",
  red: "#f87171",
  text: "#e8eaf6",
  muted: "#8892b0",
  teal: "#22d3ee",
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const subjectColors = [
  "#6c63ff","#22d3ee","#f5c542","#34d399","#f87171","#fb923c",
  "#a78bfa","#38bdf8","#4ade80","#facc15","#f472b6","#818cf8",
];

let subjectColorMap = {};
const getSubjectColor = (name) => {
  if (!subjectColorMap[name]) {
    const keys = Object.keys(subjectColorMap);
    subjectColorMap[name] = subjectColors[keys.length % subjectColors.length];
  }
  return subjectColorMap[name];
};

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
    fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0",
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.card} 100%)`,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: "20px 32px", display: "flex", alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: COLORS.text },
  logoAccent: { color: COLORS.accent },
  nav: { display: "flex", gap: 4 },
  navBtn: (active) => ({
    padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
    fontWeight: 600, fontSize: 13, transition: "all 0.2s",
    background: active ? COLORS.accent : "transparent",
    color: active ? "#fff" : COLORS.muted,
  }),
  main: { padding: "32px", maxWidth: 1400, margin: "0 auto" },
  sectionTitle: {
    fontSize: 24, fontWeight: 800, color: COLORS.text,
    marginBottom: 8, letterSpacing: "-0.5px",
  },
  sectionSub: { color: COLORS.muted, fontSize: 14, marginBottom: 28 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 },
  card: {
    background: COLORS.card, border: `1px solid ${COLORS.border}`,
    borderRadius: 14, padding: 24,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, marginBottom: 16, color: COLORS.accentLight },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6 },
  input: {
    width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 14,
    outline: "none", boxSizing: "border-box",
  },
  select: {
    width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 14,
    outline: "none", boxSizing: "border-box", cursor: "pointer",
  },
  btn: (variant = "primary") => ({
    padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
    fontWeight: 700, fontSize: 13, transition: "all 0.2s",
    background: variant === "primary" ? COLORS.accent
      : variant === "green" ? "#059669"
      : variant === "danger" ? "#dc2626"
      : variant === "ghost" ? "transparent"
      : COLORS.surface,
    color: variant === "ghost" ? COLORS.muted : "#fff",
    marginLeft: variant !== "primary" ? 0 : 0,
  }),
  tag: (color) => ({
    display: "inline-block", background: color + "22", color,
    border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px",
    fontSize: 12, fontWeight: 600, marginRight: 4, marginBottom: 4,
  }),
  chip: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: COLORS.accentDim, color: COLORS.accentLight,
    borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600,
    marginRight: 6, marginBottom: 6,
  },
  tableWrap: { overflowX: "auto", borderRadius: 12, border: `1px solid ${COLORS.border}` },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    background: COLORS.surface, color: COLORS.muted, fontWeight: 700,
    padding: "12px 16px", textAlign: "left", borderBottom: `1px solid ${COLORS.border}`,
    fontSize: 11, letterSpacing: "0.5px", textTransform: "uppercase",
  },
  td: {
    padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}22`,
    color: COLORS.text, verticalAlign: "top",
  },
  ttCell: (color) => ({
    background: color ? color + "22" : COLORS.surface,
    border: `1px solid ${color ? color + "55" : COLORS.border}`,
    borderRadius: 6, padding: "6px 8px", fontSize: 11,
    color: color || COLORS.muted, minWidth: 90, textAlign: "center",
  }),
  badge: (color) => ({
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700,
  }),
  alert: (type) => ({
    background: type === "error" ? "#dc262622" : "#059669" + "22",
    border: `1px solid ${type === "error" ? "#dc2626" : "#059669"}44`,
    borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13,
    color: type === "error" ? COLORS.red : COLORS.green,
  }),
  progress: {
    background: COLORS.border, borderRadius: 99, height: 6, marginTop: 8, overflow: "hidden",
  },
  progressBar: (pct, color) => ({
    height: "100%", width: `${Math.min(pct, 100)}%`,
    background: pct > 90 ? COLORS.red : pct > 70 ? COLORS.gold : COLORS.green,
    borderRadius: 99, transition: "width 0.3s",
  }),
};

// ─── Small reusable UI ────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={S.label}>{label}</label>
    {children}
  </div>
);

const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ ...S.btn("danger"), padding: "4px 10px", fontSize: 11 }}>✕</button>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("setup");

  // ── Department state
  const [deptName, setDeptName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selDept, setSelDept] = useState("");

  // ── Faculty state
  const [faculty, setFaculty] = useState([]); // {id, name, deptId, subjects:[{name,hoursPerWeek}], loadPerWeek}
  const [facForm, setFacForm] = useState({ name: "", deptId: "", loadPerWeek: 16 });
  const [facSubForm, setFacSubForm] = useState({ facultyId: "", subjectName: "", hoursPerWeek: 4 });

  // ── Subject catalog
  const [subjects, setSubjects] = useState([]);
  const [subForm, setSubForm] = useState({ name: "", hoursPerClass: 1, hoursPerWeek: 4, isLab: false });

  // ── Sections / Semesters
  const [sections, setSections] = useState([]);
  const [secForm, setSecForm] = useState({ name: "", room: "", deptId: "", facultyIds: [], subjectIds: [] });

  // ── Timing config
  const [timing, setTiming] = useState({
    classDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    lunchStart: "13:00", lunchEnd: "14:00",
    slots: [
      { id: uid(), label: "Period 1", start: "09:00", end: "10:00" },
      { id: uid(), label: "Period 2", start: "10:00", end: "11:00" },
      { id: uid(), label: "Period 3", start: "11:00", end: "12:00" },
      { id: uid(), label: "Period 4", start: "12:00", end: "13:00" },
      { id: uid(), label: "Period 5", start: "14:00", end: "15:00" },
      { id: uid(), label: "Period 6", start: "15:00", end: "16:00" },
    ],
  });
  const [newSlot, setNewSlot] = useState({ label: "", start: "", end: "" });

  // ── Generated timetable
  const [timetable, setTimetable] = useState(null); // { sectionId -> { day -> { slotId -> {subjectName, facultyId, isLab} } } }
  const [genError, setGenError] = useState("");
  const [genLog, setGenLog] = useState([]);

  // ─── Department helpers
  const addDept = () => {
    if (!deptName.trim()) return;
    setDepartments(d => [...d, { id: uid(), name: deptName.trim() }]);
    setDeptName("");
  };

  // ─── Subject helpers
  const addSubject = () => {
    if (!subForm.name.trim()) return;
    setSubjects(s => [...s, { ...subForm, id: uid(), name: subForm.name.trim() }]);
    setSubForm({ name: "", hoursPerClass: 1, hoursPerWeek: 4, isLab: false });
  };

  // ─── Faculty helpers
  const addFaculty = () => {
    if (!facForm.name.trim() || !facForm.deptId) return;
    setFaculty(f => [...f, { ...facForm, id: uid(), name: facForm.name.trim(), subjects: [] }]);
    setFacForm({ name: "", deptId: facForm.deptId, loadPerWeek: 16 });
  };
  const addFacSubject = () => {
    if (!facSubForm.facultyId || !facSubForm.subjectName.trim()) return;
    setFaculty(f => f.map(fac =>
      fac.id === facSubForm.facultyId
        ? { ...fac, subjects: [...fac.subjects, { name: facSubForm.subjectName, hoursPerWeek: Number(facSubForm.hoursPerWeek) }] }
        : fac
    ));
    setFacSubForm(s => ({ ...s, subjectName: "" }));
  };

  // ─── Section helpers
  const addSection = () => {
    if (!secForm.name.trim() || !secForm.room.trim() || !secForm.deptId) return;
    setSections(s => [...s, { ...secForm, id: uid(), name: secForm.name.trim() }]);
    setSecForm({ name: "", room: "", deptId: secForm.deptId, facultyIds: [], subjectIds: [] });
  };
  const toggleSecFaculty = (fid) => {
    setSecForm(s => ({
      ...s,
      facultyIds: s.facultyIds.includes(fid)
        ? s.facultyIds.filter(x => x !== fid)
        : [...s.facultyIds, fid],
    }));
  };
  const toggleSecSubject = (sid) => {
    setSecForm(s => ({
      ...s,
      subjectIds: s.subjectIds.includes(sid)
        ? s.subjectIds.filter(x => x !== sid)
        : [...s.subjectIds, sid],
    }));
  };

  // ─── Slot helpers
  const addSlot = () => {
    if (!newSlot.label || !newSlot.start || !newSlot.end) return;
    setTiming(t => ({ ...t, slots: [...t.slots, { ...newSlot, id: uid() }] }));
    setNewSlot({ label: "", start: "", end: "" });
  };
  const removeSlot = (id) => setTiming(t => ({ ...t, slots: t.slots.filter(s => s.id !== id) }));
  const toggleDay = (d) => setTiming(t => ({
    ...t,
    classDays: t.classDays.includes(d) ? t.classDays.filter(x => x !== d) : [...t.classDays, d],
  }));

  // ─── Timetable Generator ──────────────────────────────────────────────────
  const generateTimetable = useCallback(() => {
    setGenError(""); setGenLog([]);
    const log = [];

    if (!sections.length) { setGenError("Add at least one section."); return; }
    if (!timing.slots.length) { setGenError("Add time slots."); return; }
    if (!timing.classDays.length) { setGenError("Select at least one class day."); return; }

    // Sort slots by start time
    const sortedSlots = [...timing.slots].sort((a, b) => a.start.localeCompare(b.start));

    // Build faculty load tracker: facultyId -> {day -> [slotId]}
    const facultyBusy = {}; // facultyId -> Set of "day|slotId"
    faculty.forEach(f => { facultyBusy[f.id] = new Set(); });

    // Build timetable structure
    const tt = {};
    sections.forEach(sec => { tt[sec.id] = {}; timing.classDays.forEach(d => { tt[sec.id][d] = {}; }); });

    // For each section, schedule its subjects
    let success = true;
    sections.forEach(sec => {
      // Get subjects for this section
      const secSubjects = subjects.filter(s => sec.subjectIds.includes(s.id));
      const secFaculty = faculty.filter(f => sec.facultyIds.includes(f.id));

      // Build assignment list: {subject, faculty, sessions} where sessions = hoursPerWeek / hoursPerClass
      const assignments = [];
      secSubjects.forEach(sub => {
        const sessions = Math.ceil(sub.hoursPerWeek / sub.hoursPerClass);
        // Find a faculty who teaches this subject
        const eligibleFac = secFaculty.filter(f =>
          f.subjects.some(fs => fs.name.toLowerCase() === sub.name.toLowerCase())
        );
        if (!eligibleFac.length) {
          log.push(`⚠ No faculty assigned for "${sub.name}" in section "${sec.name}". Skipping.`);
          return;
        }
        assignments.push({ sub, fac: eligibleFac[0], sessions, slotsNeeded: sub.hoursPerClass });
      });

      // Faculty load tracking per section gen
      const facultySessionCount = {};
      secFaculty.forEach(f => { facultySessionCount[f.id] = 0; });

      // Schedule each assignment
      assignments.forEach(({ sub, fac, sessions, slotsNeeded }) => {
        let scheduled = 0;
        const isLab = sub.isLab || slotsNeeded > 1;

        outerLoop:
        for (let attempt = 0; attempt < 100 && scheduled < sessions; attempt++) {
          for (const day of timing.classDays) {
            if (scheduled >= sessions) break;
            // Find consecutive free slots on this day for this section
            for (let i = 0; i <= sortedSlots.length - slotsNeeded; i++) {
              const slotGroup = sortedSlots.slice(i, i + slotsNeeded);
              // Check all slots free for section
              const secFree = slotGroup.every(sl => !tt[sec.id][day][sl.id]);
              // Check all slots free for faculty (global)
              const facFree = slotGroup.every(sl => !facultyBusy[fac.id].has(`${day}|${sl.id}`));
              // Check not during lunch
              const notLunch = slotGroup.every(sl => sl.end <= timing.lunchStart || sl.start >= timing.lunchEnd);

              if (secFree && facFree && notLunch) {
                slotGroup.forEach(sl => {
                  tt[sec.id][day][sl.id] = {
                    subjectName: sub.name,
                    facultyId: fac.id,
                    isLab,
                    color: getSubjectColor(sub.name),
                  };
                  facultyBusy[fac.id].add(`${day}|${sl.id}`);
                });
                scheduled++;
                facultySessionCount[fac.id] = (facultySessionCount[fac.id] || 0) + slotsNeeded;
                break;
              }
            }
          }
        }

        if (scheduled < sessions) {
          log.push(`⚠ Could only schedule ${scheduled}/${sessions} sessions for "${sub.name}" in "${sec.name}".`);
          success = false;
        } else {
          log.push(`✓ Scheduled all ${sessions} sessions for "${sub.name}" in "${sec.name}".`);
        }
      });
    });

    setTimetable(tt);
    setGenLog(log);
    if (!success) setGenError("Some sessions could not be scheduled due to conflicts. See log.");
    setTab("timetable");
  }, [sections, subjects, faculty, timing]);

  // ─── Excel Export ─────────────────────────────────────────────────────────
  const exportExcel = async () => {
    if (!timetable) return;
    const { default: fetchDynamic } = await import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js").catch(() => null);
    // Use SheetJS if available; otherwise build CSV
    alert("To export Excel: Copy the timetable data and use the 'Download CSV' button instead, or run the app locally with the Python export script bundled.");
  };

  // Build CSV export
  const downloadCSV = () => {
    if (!timetable) return;
    const sortedSlots = [...timing.slots].sort((a, b) => a.start.localeCompare(b.start));
    let rows = [];
    sections.forEach(sec => {
      const dept = departments.find(d => d.id === sec.deptId);
      rows.push([`Section: ${sec.name}`, `Room: ${sec.room}`, `Dept: ${dept?.name || ""}`]);
      const header = ["Day/Slot", ...sortedSlots.map(s => `${s.label} (${s.start}-${s.end})`)];
      rows.push(header);
      timing.classDays.forEach(day => {
        const row = [day];
        sortedSlots.forEach(sl => {
          const cell = timetable[sec.id]?.[day]?.[sl.id];
          if (cell) {
            const fac = faculty.find(f => f.id === cell.facultyId);
            row.push(`${cell.subjectName}${cell.isLab ? " [LAB]" : ""}\n${fac?.name || ""}`);
          } else {
            row.push("—");
          }
        });
        rows.push(row);
      });
      rows.push([]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "university_timetable.csv"; a.click();
  };

  // ─── Render helpers ───────────────────────────────────────────────────────
  const getDeptName = (id) => departments.find(d => d.id === id)?.name || "—";
  const getFacName = (id) => faculty.find(f => f.id === id)?.name || "—";
  const sortedSlots = [...timing.slots].sort((a, b) => a.start.localeCompare(b.start));

  const TABS = [
    { id: "setup", label: "🏛 Departments" },
    { id: "subjects", label: "📚 Subjects" },
    { id: "faculty", label: "👨‍🏫 Faculty" },
    { id: "sections", label: "🏫 Sections" },
    { id: "timing", label: "⏰ Timing" },
    { id: "timetable", label: "📅 Timetable" },
  ];

  // ─── TABS render ─────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <span style={S.logoAccent}>UNI</span>SCHEDULE
          <span style={{ fontSize: 12, fontWeight: 400, color: COLORS.muted, marginLeft: 12 }}>
            Open Source University Timetable Generator
          </span>
        </div>
        <nav style={S.nav}>
          {TABS.map(t => (
            <button key={t.id} style={S.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={S.main}>

        {/* ── DEPARTMENTS ─────────────────────────────────────────────── */}
        {tab === "setup" && (
          <>
            <div style={S.sectionTitle}>Departments</div>
            <div style={S.sectionSub}>Add all departments in your university.</div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>Add Department</div>
                <Field label="Department Name">
                  <input style={S.input} value={deptName} onChange={e => setDeptName(e.target.value)}
                    placeholder="e.g. Computer Science" onKeyDown={e => e.key === "Enter" && addDept()} />
                </Field>
                <button style={S.btn()} onClick={addDept}>+ Add Department</button>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Departments ({departments.length})</div>
                {departments.length === 0 && <div style={{ color: COLORS.muted, fontSize: 13 }}>No departments yet.</div>}
                {departments.map(d => (
                  <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={S.chip}>{d.name}</span>
                    <DeleteBtn onClick={() => setDepartments(ds => ds.filter(x => x.id !== d.id))} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...S.card, marginTop: 8 }}>
              <div style={S.cardTitle}>Quick Start Guide</div>
              <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.8 }}>
                <b style={{ color: COLORS.text }}>1. Departments</b> — Add your departments here.<br />
                <b style={{ color: COLORS.text }}>2. Subjects</b> — Define all subjects with class hours and weekly frequency.<br />
                <b style={{ color: COLORS.text }}>3. Faculty</b> — Add faculty members, link them to departments and subjects they teach.<br />
                <b style={{ color: COLORS.text }}>4. Sections</b> — Create sections/semesters, assign rooms, faculty, and subjects.<br />
                <b style={{ color: COLORS.text }}>5. Timing</b> — Set class periods, lunch break, and working days.<br />
                <b style={{ color: COLORS.text }}>6. Generate</b> — Hit Generate on the Timetable tab. Conflicts are auto-resolved.<br />
              </div>
            </div>
          </>
        )}

        {/* ── SUBJECTS ────────────────────────────────────────────────── */}
        {tab === "subjects" && (
          <>
            <div style={S.sectionTitle}>Subject Catalog</div>
            <div style={S.sectionSub}>Define all subjects including labs and tutorials.</div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>Add Subject</div>
                <Field label="Subject Name">
                  <input style={S.input} value={subForm.name} onChange={e => setSubForm(s => ({ ...s, name: e.target.value }))}
                    placeholder="e.g. Data Structures" />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Hours per Session">
                    <input type="number" style={S.input} min={1} max={4} value={subForm.hoursPerClass}
                      onChange={e => setSubForm(s => ({ ...s, hoursPerClass: Number(e.target.value) }))} />
                  </Field>
                  <Field label="Hours per Week">
                    <input type="number" style={S.input} min={1} max={20} value={subForm.hoursPerWeek}
                      onChange={e => setSubForm(s => ({ ...s, hoursPerWeek: Number(e.target.value) }))} />
                  </Field>
                </div>
                <Field label="Type">
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: COLORS.text, fontSize: 13 }}>
                    <input type="checkbox" checked={subForm.isLab}
                      onChange={e => setSubForm(s => ({ ...s, isLab: e.target.checked }))} />
                    Lab / Practical (continuous slots required)
                  </label>
                </Field>
                <button style={S.btn()} onClick={addSubject}>+ Add Subject</button>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Subject List ({subjects.length})</div>
                <div style={S.tableWrap}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Subject</th>
                        <th style={S.th}>Per Session</th>
                        <th style={S.th}>Per Week</th>
                        <th style={S.th}>Type</th>
                        <th style={S.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map(s => (
                        <tr key={s.id}>
                          <td style={S.td}><span style={{ ...S.tag(getSubjectColor(s.name)), fontSize: 13 }}>{s.name}</span></td>
                          <td style={S.td}>{s.hoursPerClass}h</td>
                          <td style={S.td}>{s.hoursPerWeek}h</td>
                          <td style={S.td}><span style={S.badge(s.isLab ? COLORS.teal : COLORS.accent)}>{s.isLab ? "Lab" : "Theory"}</span></td>
                          <td style={S.td}><DeleteBtn onClick={() => setSubjects(xs => xs.filter(x => x.id !== s.id))} /></td>
                        </tr>
                      ))}
                      {!subjects.length && <tr><td colSpan={5} style={{ ...S.td, color: COLORS.muted }}>No subjects yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── FACULTY ─────────────────────────────────────────────────── */}
        {tab === "faculty" && (
          <>
            <div style={S.sectionTitle}>Faculty Management</div>
            <div style={S.sectionSub}>Add faculty members and assign their teaching subjects.</div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>Add Faculty Member</div>
                <Field label="Full Name">
                  <input style={S.input} value={facForm.name} onChange={e => setFacForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Dr. Priya Sharma" />
                </Field>
                <Field label="Department">
                  <select style={S.select} value={facForm.deptId} onChange={e => setFacForm(f => ({ ...f, deptId: e.target.value }))}>
                    <option value="">Select department...</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </Field>
                <Field label="Max Teaching Load (hours/week)">
                  <input type="number" style={S.input} min={1} max={40} value={facForm.loadPerWeek}
                    onChange={e => setFacForm(f => ({ ...f, loadPerWeek: Number(e.target.value) }))} />
                </Field>
                <button style={S.btn()} onClick={addFaculty}>+ Add Faculty</button>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Assign Subject to Faculty</div>
                <Field label="Select Faculty">
                  <select style={S.select} value={facSubForm.facultyId} onChange={e => setFacSubForm(f => ({ ...f, facultyId: e.target.value }))}>
                    <option value="">Select faculty...</option>
                    {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </Field>
                <Field label="Subject Name (must match subject catalog)">
                  <select style={S.select} value={facSubForm.subjectName} onChange={e => setFacSubForm(f => ({ ...f, subjectName: e.target.value }))}>
                    <option value="">Select subject...</option>
                    {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </Field>
                <Field label="Hours per Week">
                  <input type="number" style={S.input} min={1} value={facSubForm.hoursPerWeek}
                    onChange={e => setFacSubForm(f => ({ ...f, hoursPerWeek: Number(e.target.value) }))} />
                </Field>
                <button style={S.btn()} onClick={addFacSubject}>+ Assign Subject</button>
              </div>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Faculty List ({faculty.length})</div>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Name</th>
                      <th style={S.th}>Department</th>
                      <th style={S.th}>Max Load</th>
                      <th style={S.th}>Subjects</th>
                      <th style={S.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.map(f => (
                      <tr key={f.id}>
                        <td style={S.td}>{f.name}</td>
                        <td style={S.td}>{getDeptName(f.deptId)}</td>
                        <td style={S.td}>{f.loadPerWeek}h/wk</td>
                        <td style={S.td}>
                          {f.subjects.map((s, i) => (
                            <span key={i} style={S.tag(getSubjectColor(s.name))}>{s.name} ({s.hoursPerWeek}h)</span>
                          ))}
                        </td>
                        <td style={S.td}><DeleteBtn onClick={() => setFaculty(xs => xs.filter(x => x.id !== f.id))} /></td>
                      </tr>
                    ))}
                    {!faculty.length && <tr><td colSpan={5} style={{ ...S.td, color: COLORS.muted }}>No faculty yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── SECTIONS ────────────────────────────────────────────────── */}
        {tab === "sections" && (
          <>
            <div style={S.sectionTitle}>Sections / Semesters</div>
            <div style={S.sectionSub}>Define sections, assign rooms, faculty, and subjects they'll study.</div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>Create Section</div>
                <Field label="Section Name">
                  <input style={S.input} value={secForm.name} onChange={e => setSecForm(s => ({ ...s, name: e.target.value }))}
                    placeholder="e.g. CS-3A / Sem 5 Batch B" />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Room No">
                    <input style={S.input} value={secForm.room} onChange={e => setSecForm(s => ({ ...s, room: e.target.value }))}
                      placeholder="e.g. LH-302" />
                  </Field>
                  <Field label="Department">
                    <select style={S.select} value={secForm.deptId} onChange={e => setSecForm(s => ({ ...s, deptId: e.target.value }))}>
                      <option value="">Select...</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Assign Faculty (multi-select)">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {faculty.map(f => (
                      <button key={f.id} onClick={() => toggleSecFaculty(f.id)}
                        style={{
                          ...S.btn(secForm.facultyIds.includes(f.id) ? "primary" : "secondary"),
                          padding: "5px 12px", fontSize: 12,
                        }}>
                        {f.name}
                      </button>
                    ))}
                    {!faculty.length && <span style={{ color: COLORS.muted, fontSize: 12 }}>Add faculty first.</span>}
                  </div>
                </Field>
                <Field label="Assign Subjects (multi-select)">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {subjects.map(s => (
                      <button key={s.id} onClick={() => toggleSecSubject(s.id)}
                        style={{
                          padding: "5px 12px", fontSize: 12, borderRadius: 6, border: "none", cursor: "pointer",
                          background: secForm.subjectIds.includes(s.id) ? getSubjectColor(s.name) + "44" : COLORS.surface,
                          color: secForm.subjectIds.includes(s.id) ? getSubjectColor(s.name) : COLORS.muted,
                          border: `1px solid ${secForm.subjectIds.includes(s.id) ? getSubjectColor(s.name) : COLORS.border}`,
                        }}>
                        {s.name}
                      </button>
                    ))}
                    {!subjects.length && <span style={{ color: COLORS.muted, fontSize: 12 }}>Add subjects first.</span>}
                  </div>
                </Field>
                <button style={S.btn()} onClick={addSection}>+ Add Section</button>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Section List ({sections.length})</div>
                {sections.map(sec => (
                  <div key={sec.id} style={{ background: COLORS.surface, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span style={{ fontWeight: 700, color: COLORS.text }}>{sec.name}</span>
                        <span style={{ color: COLORS.muted, fontSize: 12, marginLeft: 10 }}>Room: {sec.room}</span>
                        <span style={{ color: COLORS.muted, fontSize: 12, marginLeft: 10 }}>{getDeptName(sec.deptId)}</span>
                      </div>
                      <DeleteBtn onClick={() => setSections(xs => xs.filter(x => x.id !== sec.id))} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      <span style={{ color: COLORS.muted }}>Faculty: </span>
                      {sec.facultyIds.map(fid => <span key={fid} style={S.chip}>{getFacName(fid)}</span>)}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      <span style={{ color: COLORS.muted }}>Subjects: </span>
                      {sec.subjectIds.map(sid => {
                        const s = subjects.find(x => x.id === sid);
                        return s ? <span key={sid} style={S.tag(getSubjectColor(s.name))}>{s.name}</span> : null;
                      })}
                    </div>
                  </div>
                ))}
                {!sections.length && <div style={{ color: COLORS.muted, fontSize: 13 }}>No sections yet.</div>}
              </div>
            </div>
          </>
        )}

        {/* ── TIMING ──────────────────────────────────────────────────── */}
        {tab === "timing" && (
          <>
            <div style={S.sectionTitle}>Timing Configuration</div>
            <div style={S.sectionSub}>Set class periods, lunch break, and working days.</div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>Class Days</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {days.map(d => (
                    <button key={d} onClick={() => toggleDay(d)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                        background: timing.classDays.includes(d) ? COLORS.accent : COLORS.surface,
                        color: timing.classDays.includes(d) ? "#fff" : COLORS.muted,
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
                <div style={S.cardTitle, { marginTop: 20, marginBottom: 12, fontSize: 14, fontWeight: 700, color: COLORS.accentLight }}>Lunch Break</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Lunch Start">
                    <input type="time" style={S.input} value={timing.lunchStart}
                      onChange={e => setTiming(t => ({ ...t, lunchStart: e.target.value }))} />
                  </Field>
                  <Field label="Lunch End">
                    <input type="time" style={S.input} value={timing.lunchEnd}
                      onChange={e => setTiming(t => ({ ...t, lunchEnd: e.target.value }))} />
                  </Field>
                </div>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Add Time Slot</div>
                <Field label="Label">
                  <input style={S.input} value={newSlot.label} placeholder="Period 7"
                    onChange={e => setNewSlot(s => ({ ...s, label: e.target.value }))} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Start Time">
                    <input type="time" style={S.input} value={newSlot.start}
                      onChange={e => setNewSlot(s => ({ ...s, start: e.target.value }))} />
                  </Field>
                  <Field label="End Time">
                    <input type="time" style={S.input} value={newSlot.end}
                      onChange={e => setNewSlot(s => ({ ...s, end: e.target.value }))} />
                  </Field>
                </div>
                <button style={S.btn()} onClick={addSlot}>+ Add Slot</button>
              </div>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Current Time Slots ({sortedSlots.length})</div>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>#</th>
                      <th style={S.th}>Label</th>
                      <th style={S.th}>Start</th>
                      <th style={S.th}>End</th>
                      <th style={S.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSlots.map((sl, i) => (
                      <tr key={sl.id}>
                        <td style={S.td}>{i + 1}</td>
                        <td style={S.td}>{sl.label}</td>
                        <td style={S.td}>{sl.start}</td>
                        <td style={S.td}>{sl.end}</td>
                        <td style={S.td}><DeleteBtn onClick={() => removeSlot(sl.id)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── TIMETABLE ───────────────────────────────────────────────── */}
        {tab === "timetable" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={S.sectionTitle}>Generated Timetable</div>
                <div style={S.sectionSub}>Auto-scheduled with conflict detection and lab continuity.</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button style={S.btn("green")} onClick={generateTimetable}>⚡ Generate Timetable</button>
                {timetable && <button style={S.btn("primary")} onClick={downloadCSV}>⬇ Download CSV</button>}
              </div>
            </div>

            {genError && <div style={S.alert("error")}>{genError}</div>}
            {genLog.length > 0 && (
              <div style={{ ...S.card, marginBottom: 24 }}>
                <div style={S.cardTitle}>Generation Log</div>
                {genLog.map((l, i) => (
                  <div key={i} style={{ fontSize: 12, color: l.startsWith("✓") ? COLORS.green : COLORS.gold, marginBottom: 3 }}>{l}</div>
                ))}
              </div>
            )}

            {!timetable && (
              <div style={{ ...S.card, textAlign: "center", padding: 60, color: COLORS.muted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Ready to generate</div>
                <div>Configure departments, faculty, sections and timing, then click Generate.</div>
              </div>
            )}

            {timetable && sections.map(sec => {
              const dept = departments.find(d => d.id === sec.deptId);
              return (
                <div key={sec.id} style={{ ...S.card, marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <span style={{ fontSize: 17, fontWeight: 800 }}>{sec.name}</span>
                      <span style={{ color: COLORS.muted, marginLeft: 12, fontSize: 13 }}>Room: {sec.room}</span>
                      <span style={{ color: COLORS.muted, marginLeft: 10, fontSize: 13 }}>Dept: {dept?.name}</span>
                    </div>
                  </div>
                  <div style={S.tableWrap}>
                    <table style={S.table}>
                      <thead>
                        <tr>
                          <th style={{ ...S.th, minWidth: 90 }}>Day</th>
                          {sortedSlots.map(sl => (
                            <th key={sl.id} style={S.th}>{sl.label}<br /><span style={{ fontWeight: 400, fontSize: 10 }}>{sl.start}–{sl.end}</span></th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timing.classDays.map(day => (
                          <tr key={day}>
                            <td style={{ ...S.td, fontWeight: 700, color: COLORS.accentLight, fontSize: 12 }}>{day.slice(0, 3).toUpperCase()}</td>
                            {sortedSlots.map(sl => {
                              const isLunchSlot = sl.end <= timing.lunchStart || sl.start >= timing.lunchEnd
                                ? false
                                : (sl.start < timing.lunchEnd && sl.end > timing.lunchStart);
                              const cell = timetable[sec.id]?.[day]?.[sl.id];
                              const fac = cell ? faculty.find(f => f.id === cell.facultyId) : null;
                              return (
                                <td key={sl.id} style={{ ...S.td, padding: 6 }}>
                                  {isLunchSlot ? (
                                    <div style={{ ...S.ttCell(COLORS.gold), fontSize: 10 }}>🍽 LUNCH</div>
                                  ) : cell ? (
                                    <div style={S.ttCell(cell.color)}>
                                      <div style={{ fontWeight: 700 }}>{cell.subjectName}</div>
                                      {cell.isLab && <div style={{ fontSize: 9, opacity: 0.8 }}>[LAB]</div>}
                                      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{fac?.name}</div>
                                    </div>
                                  ) : (
                                    <div style={S.ttCell(null)}>—</div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {/* Faculty load summary */}
            {timetable && (
              <div style={S.card}>
                <div style={S.cardTitle}>Faculty Load Summary</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {faculty.map(f => {
                    let scheduled = 0;
                    sections.forEach(sec => {
                      timing.classDays.forEach(day => {
                        sortedSlots.forEach(sl => {
                          const cell = timetable[sec.id]?.[day]?.[sl.id];
                          if (cell?.facultyId === f.id) scheduled++;
                        });
                      });
                    });
                    const pct = Math.round((scheduled / f.loadPerWeek) * 100);
                    return (
                      <div key={f.id} style={{ background: COLORS.surface, borderRadius: 10, padding: 14 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{f.name}</div>
                        <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{scheduled} / {f.loadPerWeek} hrs/wk</div>
                        <div style={S.progress}><div style={S.progressBar(pct)} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
