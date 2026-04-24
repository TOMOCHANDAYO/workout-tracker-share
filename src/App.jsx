import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const C = {
  bg: "#0c0b09",
  surface: "#131109",
  card: "#1a1812",
  card2: "#201d15",
  input: "#0f0d08",
  border: "#28241a",
  border2: "#352f22",
  glow: "rgba(240,165,0,0.12)",
  amber: "#f0a500",
  amberD: "#b87a00",
  amberG: "rgba(240,165,0,0.18)",
  red: "#e05540",
  orange: "#e08830",
  green: "#52b06a",
  blue: "#5aa8dc",
  purple: "#9478e0",
  teal: "#40aaa0",
  text: "#ede8dc",
  sub: "#9a9080",
  muted: "#504840",
  faint: "#302c24",
  inv: "#0c0b09",
};

const MG = {
  胸: {
    abbr: "CH",
    color: "#e07060",
    exs: ["ベンチプレス", "インクラインベンチ", "ダンベルフライ", "ディップス", "チェストプレス", "ケーブルフライ", "プッシュアップ"],
  },
  背中: {
    abbr: "BK",
    color: "#40aaa0",
    exs: ["デッドリフト", "懸垂", "ラットプルダウン", "ベントオーバーロウ", "シーテッドロウ", "チンニング", "バックエクステンション"],
  },
  肩: {
    abbr: "SH",
    color: "#e08830",
    exs: ["ショルダープレス", "サイドレイズ", "フロントレイズ", "フェイスプル", "アーノルドプレス", "アップライトロウ"],
  },
  脚: {
    abbr: "LG",
    color: "#52b06a",
    exs: ["スクワット", "レッグプレス", "レッグカール", "レッグエクステンション", "ルーマニアンDL", "カーフレイズ", "ブルガリアンスクワット"],
  },
  腕: {
    abbr: "AR",
    color: "#9478e0",
    exs: ["ダンベルカール", "バーベルカール", "ハンマーカール", "トライセプスプレスダウン", "スカルクラッシャー", "コンセントレーションカール"],
  },
  腹: {
    abbr: "AB",
    color: "#5aa8dc",
    exs: ["クランチ", "レッグレイズ", "プランク", "アブローラー", "ロシアンツイスト", "ハンギングレッグレイズ"],
  },
  全身: {
    abbr: "FU",
    color: "#e05540",
    exs: ["バーピー", "ケトルベルスイング", "クリーン＆ジャーク", "スナッチ"],
  },
};

const ALL_MG = Object.keys(MG);

const MG_DETAIL = {
  胸: { jp: "大胸筋", note: "押す種目の主役", front: true, back: false, short: "PUSH" },
  背中: { jp: "広背筋", note: "引く種目の主役", front: false, back: true, short: "PULL" },
  肩: { jp: "三角筋", note: "プレスとレイズ", front: true, back: true, short: "DELT" },
  脚: { jp: "大腿四頭筋 / ハム", note: "下半身全体", front: true, back: true, short: "LEGS" },
  腕: { jp: "上腕二頭筋 / 三頭筋", note: "補助種目で積む", front: true, back: true, short: "ARMS" },
  腹: { jp: "腹直筋", note: "体幹の安定", front: true, back: false, short: "CORE" },
  全身: { jp: "全身連動", note: "高強度コンパウンド", front: true, back: true, short: "FULL" },
};

const CARDIO = [
  { name: "ランニング", icon: "▶", color: C.red, hasDist: true },
  { name: "ウォーキング", icon: "◆", color: C.orange, hasDist: true },
  { name: "サイクリング", icon: "◉", color: C.blue, hasDist: true },
  { name: "水泳", icon: "〜", color: C.teal, hasDist: false },
  { name: "HIIT", icon: "⚡", color: C.purple, hasDist: false },
  { name: "縄跳び", icon: "∞", color: C.green, hasDist: false },
];

const SYS = `-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif`;
const DISP = `"Syne", ${SYS}`;
const FS = { xs: 9, sm: 11, md: 13, base: 14, lg: 16, xl: 20, "2xl": 28, "3xl": 38, "4xl": 48 };
const FW = { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 };
const typo = {
  label: { fontFamily: SYS, fontSize: FS.xs, fontWeight: FW.semibold, letterSpacing: ".12em", textTransform: "uppercase" },
  caption: { fontFamily: SYS, fontSize: FS.sm, fontWeight: FW.normal },
  body: { fontFamily: SYS, fontSize: FS.base, fontWeight: FW.normal },
  bodyMed: { fontFamily: SYS, fontSize: FS.base, fontWeight: FW.medium },
  bodySemi: { fontFamily: SYS, fontSize: FS.base, fontWeight: FW.semibold },
  listItem: { fontFamily: SYS, fontSize: FS.base, fontWeight: FW.medium },
  statNum: { fontFamily: DISP, fontSize: FS.xl, fontWeight: FW.extrabold, fontFeatureSettings: '"tnum"' },
  heroNum: { fontFamily: DISP, fontSize: FS["2xl"], fontWeight: FW.extrabold, fontFeatureSettings: '"tnum"' },
  timerNum: { fontFamily: DISP, fontSize: FS["4xl"], fontWeight: FW.extrabold, letterSpacing: "-.04em", fontFeatureSettings: '"tnum"' },
  h1: { fontFamily: DISP, fontSize: 24, fontWeight: FW.extrabold, letterSpacing: "-.02em", lineHeight: 1.1 },
  brand: { fontFamily: DISP, fontSize: 13, fontWeight: FW.bold, letterSpacing: ".04em" },
};

const toDS = (d) => new Date(d).toISOString().slice(0, 10);
const today = () => toDS(Date.now());
const fmt = (d) => {
  const x = new Date(d);
  return `${x.getMonth() + 1}/${x.getDate()}`;
};
const pad2 = (n) => String(n).padStart(2, "0");
const WDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const epley = (w, r) => (r === 1 ? w : Math.round(w * (1 + r / 30) * 10) / 10);
const ago = (ds) => {
  const d = Math.floor((Date.now() - new Date(`${ds}T00:00:00`).getTime()) / 86400000);
  return d === 0 ? "今日" : d === 1 ? "昨日" : `${d}日前`;
};
const jpd = (ds) => {
  const d = new Date(`${ds}T00:00:00`);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};
const daysSince = (ds) => Math.floor((Date.now() - new Date(`${ds}T00:00:00`).getTime()) / 86400000);

const readStorage = (k) => {
  try {
    const raw = window.localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStorage = (k, v) => {
  try {
    window.localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const sGet = async (k) => readStorage(k);
const sSet = async (k, v) => writeStorage(k, v);
const SK = { logs: "v9-logs", sleep: "v9-sleep", cardio: "v9-cardio", photos: "v9-photos", custom: "v9-custom", nutri: "v9-nutri" };

const compress = (file, px = 900, q = 0.72) =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(px / img.width, px / img.height, 1);
        const cv = document.createElement("canvas");
        cv.width = img.width * ratio;
        cv.height = img.height * ratio;
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        res(cv.toDataURL("image/jpeg", q));
      };
      img.onerror = rej;
      img.src = e.target.result;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

const rndW = (w, u = 2.5) => Math.round(w / u) * u;
const smolovJr = (rm, wks = 3, inc = 2.5, unit = 2.5, tm = false) => {
  const prog = [
    { d: "Day 1", s: 6, r: 6, p: 0.7 },
    { d: "Day 2", s: 7, r: 5, p: 0.75 },
    { d: "Day 3", s: 8, r: 4, p: 0.8 },
    { d: "Day 4", s: 10, r: 3, p: 0.85 },
  ];
  const base = tm ? rm * 0.9 : rm;
  return Array.from({ length: wks }, (_, wi) => ({
    week: wi + 1,
    menu: prog.map((p) => ({
      day: p.d,
      sets: p.s,
      reps: p.r,
      pct: Math.round(p.p * 100),
      weight: rndW(base * p.p + inc * wi, unit),
    })),
  }));
};

const injectCSS = () => {
  if (document.getElementById("v9-css")) return;
  const s = document.createElement("style");
  s.id = "v9-css";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased}
    body{background:#0c0b09;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic",sans-serif}
    input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
    input[type=number]{-moz-appearance:textfield}
    select option{background:#1a1812}
    ::-webkit-scrollbar{display:none}
    @keyframes su{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    @keyframes glow-pulse{0%,100%{box-shadow:0 0 0 0 rgba(240,165,0,0)}50%{box-shadow:0 0 16px 0 rgba(240,165,0,0.2)}}
    @keyframes timer-done{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes scale-in{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
    .su{animation:su .22s cubic-bezier(.2,.8,.3,1) both}
    .fi{animation:fi .18s ease both}
    .si{animation:scale-in .18s cubic-bezier(.2,.8,.3,1) both}
    .tap:active{opacity:.6;transform:scale(.96);transition:transform .08s,opacity .08s}
    .row-tap:active{background:#201d15!important}
    .glow-anim{animation:glow-pulse 2.5s ease infinite}
  `;
  document.head.appendChild(s);
};

export default function App() {
  injectCSS();
  const [tab, setTab] = useState("calendar");
  const [logs, setLogs] = useState([]);
  const [sleep, setSl] = useState([]);
  const [cardio, setCd] = useState([]);
  const [photos, setPh] = useState([]);
  const [custom, setCu] = useState({});
  const [nutri, setNu] = useState({ weight: "", activity: "moderate", bodyWeights: [] });
  const [selDate, setSel] = useState(today());
  const [ready, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      setLogs((await sGet(SK.logs)) || []);
      setSl((await sGet(SK.sleep)) || []);
      setCd((await sGet(SK.cardio)) || []);
      setPh((await sGet(SK.photos)) || []);
      setCu((await sGet(SK.custom)) || {});
      setNu((await sGet(SK.nutri)) || { weight: "", activity: "moderate", bodyWeights: [] });
      setOk(true);
    })();
  }, []);

  const saveLogs = useCallback(async (n) => {
    setLogs(n);
    await sSet(SK.logs, n);
  }, []);
  const saveSleep = useCallback(async (n) => {
    setSl(n);
    await sSet(SK.sleep, n);
  }, []);
  const saveCardio = useCallback(async (n) => {
    setCd(n);
    await sSet(SK.cardio, n);
  }, []);
  const savePhotos = useCallback(async (n) => {
    setPh(n);
    await sSet(SK.photos, n);
  }, []);
  const saveCustom = useCallback(async (n) => {
    setCu(n);
    await sSet(SK.custom, n);
  }, []);
  const saveNutri = useCallback(async (n) => {
    setNu(n);
    await sSet(SK.nutri, n);
  }, []);

  const getMG = useCallback((m) => ({ ...MG[m], exs: [...MG[m].exs, ...(custom[m] || [])] }), [custom]);
  const addCustomEx = (muscle, name) => {
    const t = name.trim();
    if (!t) return;
    saveCustom({ ...custom, [muscle]: [...(custom[muscle] || []), t] });
  };

  if (!ready) {
    return (
      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.muted,
          ...typo.body,
        }}
      >
        Loading...
      </div>
    );
  }

  const wDays = new Set([...logs.map((l) => toDS(l.date)), ...cardio.map((c) => toDS(c.date))]);
  const phDays = new Set(photos.map((p) => p.date));

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, ...typo.body, maxWidth: 430, margin: "0 auto", paddingBottom: 76 }}>
      {tab === "calendar" && <CalScreen logs={logs} cardio={cardio} photos={photos} wDays={wDays} phDays={phDays} selDate={selDate} setSel={setSel} setTab={setTab} savePhotos={savePhotos} />}
      {tab === "log" && <LogScreen logs={logs} saveLogs={saveLogs} selDate={selDate} getMG={getMG} addCustomEx={addCustomEx} />}
      {tab === "cardio" && <CardioScreen cardio={cardio} saveCardio={saveCardio} selDate={selDate} />}
      {tab === "photo" && <PhotoScreen photos={photos} savePhotos={savePhotos} selDate={selDate} setSel={setSel} />}
      {tab === "graph" && <GraphScreen logs={logs} cardio={cardio} sleep={sleep} nutri={nutri} />}
      {tab === "tools" && <ToolsScreen sleep={sleep} saveSleep={saveSleep} nutri={nutri} saveNutri={saveNutri} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

const NAVS = [
  { id: "calendar", sym: "◫", lbl: "ホーム" },
  { id: "log", sym: "✦", lbl: "記録" },
  { id: "cardio", sym: "◌", lbl: "有酸素" },
  { id: "photo", sym: "◈", lbl: "フォト" },
  { id: "graph", sym: "▣", lbl: "分析" },
  { id: "tools", sym: "◎", lbl: "ツール" },
];

function BottomNav({ tab, setTab }) {
  return (
    <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(10,9,7,.94)", borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 200, backdropFilter: "blur(24px)", boxShadow: "0 -10px 30px rgba(0,0,0,.35)" }}>
      {NAVS.map((n) => {
        const on = n.id === tab;
        return (
          <button key={n.id} onClick={() => setTab(n.id)} className="tap" style={{ flex: 1, background: "none", border: "none", padding: "9px 0 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: on ? C.inv : C.muted, background: on ? `linear-gradient(135deg,${C.amber} 0%,${C.amberD} 100%)` : "transparent", border: on ? "none" : `1px solid transparent`, transition: "all .15s", boxShadow: on ? `0 0 14px ${C.amber}50` : "none" }}>{n.sym}</span>
            <span style={{ ...typo.label, fontSize: 8, color: on ? C.text : C.muted, transition: "color .15s", textTransform: "none", letterSpacing: ".01em" }}>{n.lbl}</span>
            {on && <span style={{ position: "absolute", top: 2, width: 4, height: 4, borderRadius: "50%", background: C.amber }} />}
          </button>
        );
      })}
    </nav>
  );
}

function CalScreen({ logs, cardio, photos, wDays, phDays, selDate, setSel, setTab, savePhotos }) {
  const now = new Date();
  const [yr, setYr] = useState(now.getFullYear());
  const [mo, setMo] = useState(now.getMonth());
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const movMo = (d) => {
    let m = mo + d;
    let y = yr;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setMo(m);
    setYr(y);
  };

  const first = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo + 1, 0).getDate();
  const cells = Array(first)
    .fill(null)
    .concat(Array.from({ length: dim }, (_, i) => i + 1));
  while (cells.length % 7) cells.push(null);

  const volByDay = {};
  logs.forEach((l) => {
    const ds = toDS(l.date);
    volByDay[ds] = (volByDay[ds] || 0) + l.weight * l.reps;
  });
  const maxVol = Math.max(1, ...Object.values(volByDay));

  const mLogs = logs.filter((l) => {
    const d = new Date(l.date);
    return d.getFullYear() === yr && d.getMonth() === mo;
  });
  const mDays = new Set(mLogs.map((l) => toDS(l.date))).size;
  const mVol = Math.round((mLogs.reduce((s, l) => s + l.weight * l.reps, 0) / 1000) * 10) / 10;

  const weekVol = (() => {
    const n2 = new Date();
    const wd = n2.getDay();
    const mon = new Date(n2);
    mon.setDate(n2.getDate() - (wd === 0 ? 6 : wd - 1));
    return Math.round((logs.filter((l) => new Date(l.date) >= mon).reduce((s, l) => s + l.weight * l.reps, 0) / 1000) * 10) / 10;
  })();

  const selLogs = logs.filter((l) => toDS(l.date) === selDate).sort((a, b) => b.id - a.id);
  const selCard = cardio.filter((c) => toDS(c.date) === selDate);
  const selPhotos = photos.filter((p) => p.date === selDate).sort((a, b) => b.id - a.id);
  const hasData = selLogs.length > 0 || selCard.length > 0 || selPhotos.length > 0;
  const isToday = selDate === today();
  const dayExs = new Set(selLogs.map((l) => l.exercise)).size;
  const daySets = selLogs.length;
  const dayReps = selLogs.reduce((s, l) => s + l.reps, 0);
  const dayVol = selLogs.reduce((s, l) => s + l.weight * l.reps, 0);
  const selDO = new Date(`${selDate}T00:00:00`);
  const partStats = ALL_MG.map((key) => {
    const items = logs.filter((l) => l.muscle === key);
    const lastDate = items.length ? toDS(items.sort((a, b) => b.id - a.id)[0].date) : null;
    return {
      key,
      color: MG[key].color,
      sets30: items.filter((l) => daysSince(toDS(l.date)) <= 30).length,
      lastDate,
      restDays: lastDate ? daysSince(lastDate) : 999,
    };
  }).sort((a, b) => b.restDays - a.restDays);
  const nextPart = partStats[0];
  const hotParts = partStats.filter((p) => p.sets30 > 0).slice(0, 4);
  const recentRecords = logs.slice().sort((a, b) => b.id - a.id).slice(0, 5);
  const trainedToday = [...new Set(selLogs.map((l) => l.muscle))];
  const focusParts = partStats.slice(0, 6);
  const recentSessions = [...new Set(logs.slice().sort((a, b) => b.id - a.id).map((l) => toDS(l.date)))].slice(0, 3).map((date) => {
    const dayLogs = logs.filter((l) => toDS(l.date) === date);
    return {
      date,
      parts: [...new Set(dayLogs.map((l) => l.muscle))],
      volume: dayLogs.reduce((sum, l) => sum + l.weight * l.reps, 0),
      top: dayLogs[0],
    };
  });

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const b = await compress(f);
      await savePhotos([{ id: Date.now(), src: b, date: selDate, note: "", tags: [] }, ...photos]);
    } catch {}
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="su">
      <div style={{ padding: "34px 16px 0" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: "14px 14px 14px", marginBottom: 12, boxShadow: `0 18px 44px rgba(0,0,0,.28)` }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ ...typo.bodySemi, fontSize: 13, color: C.amber, marginBottom: 4 }}>トレーニングメモ</div>
              <div style={{ ...typo.h1, fontSize: 20, marginBottom: 4 }}>{yr}年 {mo + 1}月のホーム</div>
              <div style={{ ...typo.caption, color: C.sub, marginBottom: 6 }}>次にやるなら {nextPart?.key || "胸"} / 今日 {trainedToday.length ? `${trainedToday.join("・")}` : "未記録"}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Chip color={nextPart?.color || C.amber}>休養 {nextPart?.restDays ?? 0}日</Chip>
                <Chip color={trainedToday.length ? C.teal : C.orange}>{trainedToday.length ? "実施あり" : "未実施"}</Chip>
              </div>
            </div>
            <div style={{ minWidth: 82, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "10px 10px 9px", textAlign: "center" }}>
              <div style={{ ...typo.statNum, color: C.amber, fontSize: 23, lineHeight: 1 }}>{weekVol}<span style={{ ...typo.caption, color: C.sub, marginLeft: 2 }}>t</span></div>
              <div style={{ ...typo.caption, color: C.muted, marginTop: 4 }}>今週</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
            {[
              [`${mDays}`, "実施日", C.amber],
              [`${mVol}t`, "月間Vol", C.orange],
              [`${focusParts.filter((p) => p.lastDate).length}`, "部位数", C.teal],
            ].map(([v, l, col]) => (
              <div key={l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ ...typo.statNum, color: col, fontSize: 19, marginBottom: 4 }}>{v}</div>
                <div style={{ ...typo.caption, color: C.muted }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button className="tap" onClick={() => setTab("log")} style={{ flex: 1, background: C.amber, color: C.inv, border: "none", borderRadius: 16, padding: "12px 0", ...typo.bodySemi, fontSize: 13, cursor: "pointer" }}>筋トレを記録</button>
            <button className="tap" onClick={() => setTab("cardio")} style={{ flex: 1, background: C.surface, color: C.red, border: `1px solid ${C.border}`, borderRadius: 16, padding: "12px 0", ...typo.bodySemi, fontSize: 13, cursor: "pointer" }}>有酸素を記録</button>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "12px 12px 10px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ ...typo.bodySemi, fontSize: 13 }}>部位一覧</div>
                <div style={{ ...typo.caption, color: C.muted }}>前回日と休養日をすぐ確認</div>
              </div>
              {nextPart?.lastDate && <Chip color={nextPart.color}>最優先 {nextPart.key}</Chip>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {focusParts.map((part) => (
                <button key={part.key} onClick={() => setSel(part.lastDate || today())} className="tap" style={{ background: trainedToday.includes(part.key) ? `${part.color}14` : C.card, border: `1px solid ${trainedToday.includes(part.key) ? `${part.color}45` : C.border}`, borderRadius: 14, padding: "10px 10px 9px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ ...typo.bodySemi, fontSize: 13, color: part.color }}>{part.key}</span>
                    <span style={{ ...typo.caption, color: C.muted }}>{part.lastDate ? `${part.restDays}日` : "-"}</span>
                  </div>
                  <div style={{ ...typo.caption, color: C.sub, marginBottom: 3 }}>{part.lastDate ? `前回 ${jpd(part.lastDate)}` : "前回記録なし"}</div>
                  <div style={{ ...typo.caption, color: C.muted }}>{part.sets30}set / 30日</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "12px 12px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ ...typo.bodySemi, fontSize: 13 }}>前回メニュー</div>
                <div style={{ ...typo.caption, color: C.muted }}>直近の重量と回数をすぐ確認</div>
              </div>
              <Chip color={C.amber}>{recentRecords.length}種目</Chip>
            </div>
            {recentRecords.length ? recentRecords.map((record, idx) => (
              <button
                key={record.id}
                className="tap"
                onClick={() => setSel(toDS(record.date))}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  background: "transparent",
                  border: "none",
                  borderTop: idx === 0 ? "none" : `1px solid ${C.border}`,
                  padding: idx === 0 ? "0 0 10px" : "10px 0",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ ...typo.bodySemi, fontSize: 13, color: MG[record.muscle]?.color || C.text, marginBottom: 2 }}>{record.exercise}</div>
                  <div style={{ ...typo.caption, color: C.muted }}>{record.muscle} / {jpd(toDS(record.date))}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...typo.bodySemi, fontSize: 13, color: C.sub }}>{record.weight}kg × {record.reps}</div>
                  <div style={{ ...typo.caption, color: C.muted }}>{ago(toDS(record.date))}</div>
                </div>
              </button>
            )) : <div style={{ ...typo.caption, color: C.muted }}>まだ種目記録がありません</div>}
          </div>
        </div>
      </div>

      <div style={{ margin: "0 16px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, overflow: "hidden", boxShadow: `0 8px 26px rgba(0,0,0,.36)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => movMo(-1)} className="tap" style={ibStyle}>‹</button>
          <span style={{ ...typo.bodySemi, fontSize: 13 }}>{yr}年 {mo + 1}月</span>
          <button onClick={() => movMo(1)} className="tap" style={ibStyle}>›</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
          {WDAYS.map((d, i) => (
            <div key={d} style={{ textAlign: "center", padding: "8px 0", ...typo.label, fontSize: FS.xs, color: i === 0 ? C.red : i === 6 ? C.blue : C.muted, textTransform: "none", letterSpacing: ".02em" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 6px 10px" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const ds = `${yr}-${pad2(mo + 1)}-${pad2(day)}`;
            const isT = ds === today();
            const isSel = ds === selDate;
            const vol = volByDay[ds] || 0;
            const intensity = vol > 0 ? Math.min(vol / maxVol, 1) : 0;
            const hasW = wDays.has(ds);
            const hasC = cardio.some((c) => toDS(c.date) === ds);
            const hasP = phDays.has(ds);
            const isSun = i % 7 === 0;
            const isSat = i % 7 === 6;

            return (
              <div key={ds} onClick={() => setSel(ds)} className="tap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3px 1px", cursor: "pointer", borderRadius: 10, background: isSel ? `${C.amber}18` : "transparent", transition: "background .1s", position: "relative" }}>
                {vol > 0 && !isSel && <div style={{ position: "absolute", inset: "3px", borderRadius: 8, background: C.amber, opacity: 0.03 + intensity * 0.1, pointerEvents: "none" }} />}
                <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", ...typo.body, fontSize: 12, fontWeight: isSel || isT ? FW.bold : FW.normal, background: isSel ? C.amber : "transparent", color: isSel ? C.inv : isSun ? C.red : isSat ? C.blue : C.text, border: isT && !isSel ? `1.5px solid ${C.amber}` : "none", boxShadow: isSel ? `0 0 12px ${C.amber}60` : "none" }}>
                  {day}
                </div>
                <div style={{ display: "flex", gap: 2, marginTop: 2, height: 4, alignItems: "center" }}>
                  {hasW && <div style={{ width: 4, height: 4, borderRadius: 2, background: isSel ? C.inv : C.amber, boxShadow: !isSel ? `0 0 4px ${C.amber}80` : "" }} />}
                  {hasC && <div style={{ width: 4, height: 4, borderRadius: 2, background: isSel ? C.inv : C.red }} />}
                  {hasP && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? C.inv : C.orange }} />}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, padding: "8px 16px 12px", borderTop: `1px solid ${C.border}` }}>
          {[[C.amber, "筋トレ", false], [C.red, "有酸素", false], [C.orange, "写真", true]].map(([color, label, round]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: round ? "50%" : "2px", background: color, boxShadow: color === C.amber ? `0 0 5px ${color}80` : "" }} />
              <span style={{ ...typo.caption, fontSize: FS.xs, color: C.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 12 }}>
          <SCard style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ ...typo.bodySemi, fontSize: 13, marginBottom: 2 }}>最近の記録</div>
                <div style={{ ...typo.caption, color: C.muted }}>直近のトレーニングを一覧表示</div>
              </div>
              <Chip color={nextPart?.color || C.amber}>{recentSessions.length}件</Chip>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 10 }}>
              <div>
                {recentSessions.length ? recentSessions.map((session, idx) => (
                  <div key={session.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: idx < recentSessions.length - 1 ? "0 0 10px" : "0", marginBottom: idx < recentSessions.length - 1 ? 10 : 0, borderBottom: idx < recentSessions.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div>
                      <div style={{ ...typo.bodySemi, fontSize: 13, marginBottom: 3 }}>{jpd(session.date)}</div>
                      <div style={{ ...typo.caption, color: C.muted }}>{session.parts.join("・")} / {session.top?.exercise || "種目なし"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...typo.bodySemi, fontSize: 12, color: C.amber }}>{Math.round(session.volume)}kg</div>
                      <div style={{ ...typo.caption, color: C.muted }}>{ago(session.date)}</div>
                    </div>
                  </div>
                )) : <div style={{ ...typo.caption, color: C.muted, paddingTop: 8 }}>まだ記録がありません</div>}
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 10 }}>
                <div style={{ ...typo.bodySemi, fontSize: 12, marginBottom: 8 }}>効く部位</div>
                <MuscleMapCard parts={hotParts.length ? hotParts.map((p) => p.key) : ["胸", "脚"]} compact />
              </div>
            </div>
          </SCard>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...typo.bodySemi, fontSize: 15 }}>{selDO.getMonth() + 1}月{selDO.getDate()}日（{WDAYS[selDO.getDay()]}）</span>
            {isToday && <span style={{ ...typo.label, fontSize: 8, color: C.amber, background: C.amberG, border: `1px solid ${C.amber}40`, borderRadius: 6, padding: "2px 8px", textShadow: `0 0 8px ${C.amber}60` }}>TODAY</span>}
          </div>
          <button className="tap" onClick={() => setTab("log")} style={{ background: C.surface, color: C.amber, border: `1px solid ${C.border}`, borderRadius: 16, padding: "7px 12px", ...typo.bodySemi, fontSize: 12, cursor: "pointer" }}>種目を追加</button>
        </div>

        {selLogs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 12 }}>
            {[["種目", dayExs], ["セット", daySets], ["レップ", dayReps], ["Vol", dayVol]].map(([l, v]) => (
              <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ ...typo.statNum, fontSize: 18, color: C.amber, lineHeight: 1 }}>{v}</div>
                <div style={{ ...typo.label, fontSize: FS.xs, color: C.muted, marginTop: 4, textTransform: "none" }}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {(selLogs.length > 0 || selCard.length > 0) && (
          <SCard style={{ marginBottom: 12 }}>
            {selLogs.map((l, i) => {
              const mg = Object.entries(MG).find(([, v]) => v.exs.includes(l.exercise));
              const col = mg ? mg[1].color : C.amber;
              return (
                <div key={l.id} style={{ display: "flex", alignItems: "center", padding: "11px 14px", borderBottom: i < selLogs.length - 1 || selCard.length > 0 ? `1px solid ${C.border}` : "none", gap: 10 }}>
                  <div style={{ width: 3, height: 34, borderRadius: 2, background: col, boxShadow: `0 0 8px ${col}60`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...typo.label, fontSize: FS.xs, color: col, marginBottom: 2, textTransform: "none", letterSpacing: ".03em" }}>{mg ? mg[0] : ""}</div>
                    <div style={{ ...typo.listItem }}>{l.exercise}</div>
                  </div>
                  <div style={{ ...typo.bodySemi, fontSize: 13, color: col }}>{l.weight}kg×{l.reps}</div>
                </div>
              );
            })}
            {selCard.map((c, i) => {
              const ct = CARDIO.find((t) => t.name === c.type) || CARDIO[0];
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "11px 14px", borderBottom: i < selCard.length - 1 ? `1px solid ${C.border}` : "none", gap: 10 }}>
                  <div style={{ width: 3, height: 34, borderRadius: 2, background: ct.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...typo.label, fontSize: FS.xs, color: ct.color, marginBottom: 2, textTransform: "none" }}>有酸素</div>
                    <div style={{ ...typo.listItem }}>{c.type}</div>
                  </div>
                  <div style={{ ...typo.bodySemi, fontSize: 13, color: ct.color }}>{c.duration}分</div>
                </div>
              );
            })}
          </SCard>
        )}

        {!hasData && (
          <div style={{ background: C.card, border: `1.5px dashed ${C.border2}`, borderRadius: 18, padding: "32px 20px", textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.35 }}>🏋</div>
            <div style={{ ...typo.bodyMed, color: C.sub, marginBottom: 6 }}>この日の記録なし</div>
            <div style={{ ...typo.caption, color: C.muted }}>筋トレMEMO風に、まずは部位か種目を選んで1セット目を残そう</div>
          </div>
        )}

        <SCard style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: selPhotos.length > 0 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ ...typo.bodyMed, fontSize: 13 }}>フォト</span>
              {selPhotos.length > 0 && <Chip color={C.orange}>{selPhotos.length}枚</Chip>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            <button className="tap" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...typo.caption, fontSize: 12, color: C.orange, background: `${C.orange}15`, border: `1px solid ${C.orange}40`, borderRadius: 14, padding: "5px 11px", cursor: "pointer", opacity: uploading ? 0.6 : 1 }}>
              {uploading ? "処理中" : "＋写真"}
            </button>
          </div>
          {selPhotos.length > 0 ? (
            <div style={{ display: "flex", gap: 8, padding: "12px 14px", overflowX: "auto" }}>
              {selPhotos.map((p) => (
                <PThumb key={p.id} photo={p} photos={photos} savePhotos={savePhotos} />
              ))}
            </div>
          ) : (
            <div style={{ padding: "14px", textAlign: "center", ...typo.caption, color: C.muted }}>この日の写真なし</div>
          )}
        </SCard>
      </div>
    </div>
  );
}

function PThumb({ photo, photos, savePhotos }) {
  const [open, setOpen] = useState(false);
  const TAGS = ["胸", "背中", "肩", "脚", "腕", "腹", "正面", "背面", "側面"];
  if (open) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(12,11,9,.97)", zIndex: 300, overflowY: "auto", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={() => setOpen(false)} className="tap" style={{ ...ibStyle, ...typo.body, fontSize: 13 }}>‹ 閉じる</button>
          <button onClick={() => { savePhotos(photos.filter((p) => p.id !== photo.id)); setOpen(false); }} className="tap" style={{ background: `${C.red}18`, border: `1px solid ${C.red}35`, borderRadius: 9, color: C.red, padding: "6px 12px", ...typo.bodySemi, fontSize: 12, cursor: "pointer" }}>削除</button>
        </div>
        <img src={photo.src} alt="" style={{ width: "100%", borderRadius: 14, objectFit: "cover", maxHeight: 360, display: "block", marginBottom: 12 }} />
        <SCard style={{ padding: 14 }}>
          <div style={{ ...typo.caption, color: C.muted, marginBottom: 8 }}>{jpd(photo.date)}</div>
          <input style={{ ...inpStyle, marginBottom: 10 }} placeholder="メモ…" value={photo.note || ""} onChange={(e) => savePhotos(photos.map((p) => (p.id === photo.id ? { ...p, note: e.target.value } : p)))} />
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {TAGS.map((t) => {
              const has = (photo.tags || []).includes(t);
              return (
                <button key={t} className="tap" onClick={() => savePhotos(photos.map((p) => (p.id === photo.id ? { ...p, tags: has ? (p.tags || []).filter((x) => x !== t) : [...(p.tags || []), t] } : p)))} style={{ padding: "4px 10px", borderRadius: 12, border: `1px solid ${has ? C.orange : C.border}`, background: has ? `${C.orange}18` : "transparent", color: has ? C.orange : C.muted, ...typo.caption, fontSize: 12, cursor: "pointer" }}>
                  {t}
                </button>
              );
            })}
          </div>
        </SCard>
      </div>
    );
  }

  return (
    <div onClick={() => setOpen(true)} style={{ flexShrink: 0, width: 96, cursor: "pointer", position: "relative" }}>
      <img src={photo.src} alt="" style={{ width: 96, height: 112, objectFit: "cover", borderRadius: 10, display: "block", border: `1px solid ${C.border}` }} />
      {photo.note && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3px 6px", background: "rgba(12,11,9,.82)", ...typo.caption, fontSize: FS.xs, color: C.muted, borderRadius: "0 0 9px 9px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{photo.note}</div>}
    </div>
  );
}

function LogScreen({ logs, saveLogs, selDate, getMG, addCustomEx }) {
  const [phase, setPhase] = useState("select");
  const [muscle, setMuscle] = useState(null);
  const [exercise, setExercise] = useState(null);
  const goEntry = (m, e) => {
    setMuscle(m);
    setExercise(e);
    setPhase("entry");
  };
  if (phase === "entry") {
    return <SetEntry muscle={muscle} exercise={exercise} logs={logs} saveLogs={saveLogs} selDate={selDate} getMG={getMG} goBack={() => setPhase("select")} />;
  }
  return <ExSelect logs={logs} selDate={selDate} getMG={getMG} addCustomEx={addCustomEx} onSelect={goEntry} />;
}

function ExSelect({ logs, selDate, getMG, addCustomEx, onSelect }) {
  const [addingTo, setAddingTo] = useState(null);
  const [newName, setNewName] = useState("");
  const recentEx = (() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const seen = new Set();
    return logs
      .filter((l) => new Date(l.date) >= cutoff)
      .sort((a, b) => b.id - a.id)
      .filter((l) => {
        if (seen.has(l.exercise)) return false;
        seen.add(l.exercise);
        return true;
      })
      .slice(0, 5);
  })();

  const lastTrained = {};
  logs.forEach((l) => {
    if (!lastTrained[l.muscle] || l.date > lastTrained[l.muscle]) lastTrained[l.muscle] = toDS(l.date);
  });
  const submitAdd = (m) => {
    if (!newName.trim()) return;
    addCustomEx(m, newName);
    setNewName("");
    setAddingTo(null);
  };
  const selDO = new Date(`${selDate}T00:00:00`);

  return (
    <div className="su" style={{ paddingBottom: 16 }}>
      <div style={{ padding: "48px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...typo.label, color: C.amber, marginBottom: 6 }}>{selDO.getMonth() + 1}月{selDO.getDate()}日</div>
        <h1 style={typo.h1}>種目を選択</h1>
      </div>
      <div style={{ padding: "14px" }}>
        {recentEx.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionLbl>最近使った種目</SectionLbl>
            <SCard>
              {recentEx.map((l, i) => {
                const mg = Object.entries(MG).find(([, v]) => v.exs.includes(l.exercise));
                const col = mg ? mg[1].color : C.amber;
                const lastEx = logs.filter((x) => x.exercise === l.exercise && toDS(x.date) < selDate).sort((a, b) => b.date.localeCompare(a.date))[0];
                return (
                  <button key={l.exercise} className="row-tap tap" onClick={() => onSelect(mg ? mg[0] : "全身", l.exercise)} style={{ width: "100%", background: "none", border: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px", borderBottom: i < recentEx.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", textAlign: "left", minHeight: 54 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: col, boxShadow: `0 0 6px ${col}80`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ ...typo.listItem, color: C.text, marginBottom: 2 }}>{l.exercise}</div>
                      {lastEx && <div style={{ ...typo.caption, color: C.muted }}>前回 {ago(toDS(lastEx.date))} — <strong style={{ color: C.sub }}>{lastEx.weight}kg × {lastEx.reps}rep</strong></div>}
                    </div>
                    <span style={{ color: C.muted, fontSize: 16 }}>›</span>
                  </button>
                );
              })}
            </SCard>
          </div>
        )}

        <SectionLbl>部位から選ぶ</SectionLbl>
        {ALL_MG.map((muscleKey) => {
          const mg = getMG(muscleKey);
          const lt = lastTrained[muscleKey];
          const dayCount = logs.filter((l) => l.muscle === muscleKey && toDS(l.date) === selDate).length;
          return (
            <div key={muscleKey} style={{ marginBottom: 12 }}>
              <SCard>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid ${C.border}`, background: `linear-gradient(90deg,${mg.color}10 0%,transparent 60%)`, borderRadius: "14px 14px 0 0", borderLeft: `3px solid ${mg.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${mg.color}18`, border: `1.5px solid ${mg.color}40`, display: "flex", alignItems: "center", justifyContent: "center", ...typo.label, fontSize: 9, color: mg.color, letterSpacing: ".06em", textTransform: "none" }}>{mg.abbr}</div>
                    <span style={{ ...typo.bodySemi, fontSize: 14, color: mg.color }}>{muscleKey}</span>
                    {dayCount > 0 && <Chip color={mg.color}>{dayCount}set ✓</Chip>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{lt && <span style={{ ...typo.caption, fontSize: 11, color: C.muted }}>{ago(lt)}</span>}</div>
                </div>

                {mg.exs.map((ex, i) => {
                  const lastEx = logs.filter((l) => l.exercise === ex && toDS(l.date) < selDate).sort((a, b) => b.date.localeCompare(a.date))[0];
                  return (
                    <button key={ex} className="row-tap tap" onClick={() => onSelect(muscleKey, ex)} style={{ width: "100%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px", borderBottom: i < mg.exs.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", textAlign: "left", minHeight: 52, transition: "background .1s" }}>
                      <div>
                        <div style={{ ...typo.listItem, color: C.text, marginBottom: lastEx ? 2 : 0 }}>{ex}</div>
                        {lastEx && <div style={{ ...typo.caption, color: C.muted }}>{ago(toDS(lastEx.date))} — <strong style={{ color: C.sub, fontWeight: FW.medium }}>{lastEx.weight}kg × {lastEx.reps}</strong></div>}
                      </div>
                      <span style={{ color: C.muted, fontSize: 16, flexShrink: 0 }}>›</span>
                    </button>
                  );
                })}

                {addingTo === muscleKey ? (
                  <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                    <input autoFocus style={{ ...inpStyle, flex: 1, fontSize: 13, padding: "9px 12px" }} placeholder="種目名を入力…" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitAdd(muscleKey); if (e.key === "Escape") { setAddingTo(null); setNewName(""); } }} />
                    <button onClick={() => submitAdd(muscleKey)} className="tap" style={{ background: `${mg.color}20`, color: mg.color, border: `1px solid ${mg.color}40`, borderRadius: 9, padding: "9px 14px", ...typo.bodySemi, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>追加</button>
                    <button onClick={() => { setAddingTo(null); setNewName(""); }} className="tap" style={{ background: C.card2, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 11px", ...typo.body, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => { setAddingTo(muscleKey); setNewName(""); }} className="row-tap tap" style={{ width: "100%", background: "none", border: "none", borderTop: `1px solid ${C.border}`, color: C.muted, padding: "11px 14px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8, ...typo.caption, fontSize: 12 }}>
                    <span style={{ fontSize: 15, color: mg.color, lineHeight: 1 }}>＋</span>
                    新しい種目を追加…
                  </button>
                )}
              </SCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SetEntry({ muscle, exercise, logs, saveLogs, selDate, getMG, goBack }) {
  const mg = getMG(muscle);
  const prevSessions = (() => {
    const prev = logs.filter((l) => l.exercise === exercise && toDS(l.date) < selDate).sort((a, b) => b.date.localeCompare(a.date));
    const dates = [...new Set(prev.map((l) => toDS(l.date)))].slice(0, 2);
    return dates.map((d) => ({ date: d, sets: prev.filter((l) => toDS(l.date) === d) }));
  })();
  const todaySets = logs.filter((l) => l.exercise === exercise && toDS(l.date) === selDate).sort((a, b) => a.id - b.id);
  const lastFirst = prevSessions[0]?.sets[0];
  const [curW, setCurW] = useState(lastFirst?.weight || 20);
  const [curR, setCurR] = useState(lastFirst?.reps || 10);
  const [memo, setMemo] = useState("");
  const [showMemo, setShowMemo] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerPre, setTp] = useState(120);
  const [timerRem, setTr] = useState(120);
  const [timerRun, setRun] = useState(false);
  const [timerDone, setTD] = useState(false);
  const tiRef = useRef(null);

  useEffect(() => {
    if (timerRun) {
      tiRef.current = setInterval(() => {
        setTr((r) => {
          if (r <= 1) {
            clearInterval(tiRef.current);
            setRun(false);
            setTD(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(tiRef.current);
    }
    return () => clearInterval(tiRef.current);
  }, [timerRun]);

  const setPreset = (p) => {
    setTp(p);
    setTr(p);
    setRun(false);
    setTD(false);
  };
  const tCol = timerDone ? C.red : { 60: C.red, 120: C.amber, 180: C.blue }[timerPre];
  const tiDisp = `${pad2(Math.floor(timerRem / 60))}:${pad2(timerRem % 60)}`;
  const adjW = (step) => setCurW((x) => Math.max(0, Math.round((x + step) * 10) / 10));
  const adjR = (step) => setCurR((x) => Math.max(1, x + step));
  const addSet = () => {
    if (!curW || !curR) return;
    saveLogs([...logs, { id: Date.now(), muscle, exercise, weight: curW, reps: curR, memo, date: `${selDate}T${new Date().toTimeString().slice(0, 8)}` }]);
    setMemo("");
    setShowMemo(false);
  };
  const copyLast = () => {
    if (!lastFirst) return;
    setCurW(lastFirst.weight);
    setCurR(lastFirst.reps);
  };
  const rm1 = epley(curW, curR);
  const todayVol = todaySets.reduce((s, l) => s + l.weight * l.reps, 0);

  return (
    <div className="su">
      <div style={{ padding: "48px 20px 14px", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={goBack} className="tap" style={{ background: "none", border: "none", color: C.sub, ...typo.body, fontSize: 12, cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>‹ 種目選択</button>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${mg.color}18`, border: `1.5px solid ${mg.color}45`, display: "flex", alignItems: "center", justifyContent: "center", ...typo.label, fontSize: 9, color: mg.color, letterSpacing: ".05em", textTransform: "none" }}>{mg.abbr}</div>
              <span style={{ ...typo.label, fontSize: 11, color: mg.color, textTransform: "none" }}>{muscle}</span>
            </div>
            <h1 style={{ ...typo.h1, fontSize: 20, lineHeight: 1.2 }}>{exercise}</h1>
          </div>
          <button onClick={() => setTimerOpen((o) => !o)} className="tap" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: timerOpen ? `${tCol}18` : C.card, border: `1.5px solid ${timerOpen || timerRun ? tCol : C.border}`, borderRadius: 14, padding: "8px 13px", cursor: "pointer", transition: "all .18s", minWidth: 64, boxShadow: timerRun ? `0 0 14px ${tCol}40` : "none" }}>
            <span style={{ ...typo.brand, fontSize: 13, color: timerOpen || timerRun ? tCol : C.sub, animation: timerDone ? "timer-done .6s ease infinite" : "none" }}>{tiDisp}</span>
            <span style={{ ...typo.label, fontSize: 8, color: timerRun ? tCol : C.muted, textTransform: "none", letterSpacing: ".03em" }}>{timerRun ? "休憩中" : "タイマー"}</span>
          </button>
        </div>
      </div>

      {timerOpen && (
        <div style={{ background: `${tCol}0c`, borderBottom: `1px solid ${tCol}28`, padding: "12px 16px" }} className="fi">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, display: "flex", gap: 6 }}>
              {[60, 120, 180].map((p) => {
                const pc = { 60: C.red, 120: C.amber, 180: C.blue }[p];
                return (
                  <button key={p} onClick={() => setPreset(p)} className="tap" style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: `1.5px solid ${timerPre === p ? pc : C.border}`, background: timerPre === p ? `${pc}18` : "transparent", color: timerPre === p ? pc : C.muted, ...typo.bodySemi, fontSize: 12, cursor: "pointer" }}>{p}s</button>
                );
              })}
            </div>
            <div style={{ ...typo.brand, fontSize: 24, color: tCol, minWidth: 72, textAlign: "center" }}>{tiDisp}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setTr(timerPre); setRun(false); setTD(false); }} className="tap" style={{ flex: 1, background: C.card2, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px", ...typo.bodySemi, fontSize: 12, cursor: "pointer" }}>リセット</button>
            <button onClick={() => { setRun((r) => !r); setTD(false); }} className="tap" style={{ flex: 2, background: timerRun ? C.card2 : tCol, color: timerRun ? C.text : C.inv, border: "none", borderRadius: 9, padding: "10px", ...typo.bodySemi, fontSize: 14, cursor: "pointer", transition: "all .18s", boxShadow: !timerRun ? `0 0 14px ${tCol}50` : "none" }}>{timerRun ? "一時停止" : "スタート"}</button>
          </div>
        </div>
      )}

      <div style={{ padding: "14px" }}>
        {prevSessions.length > 0 && (
          <SCard style={{ marginBottom: 14 }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionLbl style={{ margin: 0 }}>過去の記録</SectionLbl>
              <button onClick={copyLast} className="tap" style={{ ...typo.caption, fontSize: 12, color: mg.color, background: `${mg.color}15`, border: `1px solid ${mg.color}35`, borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: FW.semibold }}>前回をコピー</button>
            </div>
            {prevSessions.map((sess, si) => (
              <div key={sess.date} style={{ padding: "11px 14px", borderBottom: si < prevSessions.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: si === 0 ? `${mg.color}35` : C.faint, border: si === 0 ? `1px solid ${mg.color}50` : `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", ...typo.label, fontSize: 8, color: si === 0 ? mg.color : C.muted, textTransform: "none" }}>{si + 1}</div>
                  <span style={{ ...typo.caption, fontSize: 12, color: si === 0 ? mg.color : C.muted, fontWeight: si === 0 ? FW.semibold : FW.normal }}>{ago(sess.date)} — {jpd(sess.date)}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingLeft: 22 }}>
                  {sess.sets.map((s, i) => (
                    <div key={i} style={{ background: si === 0 ? `${mg.color}10` : C.faint, border: `1px solid ${si === 0 ? `${mg.color}28` : C.border}`, borderRadius: 9, padding: "5px 11px" }}>
                      <span style={{ ...typo.bodySemi, fontSize: 13, color: si === 0 ? mg.color : C.sub }}>{s.weight}<span style={{ fontWeight: FW.normal, fontSize: 10, marginLeft: 1 }}>kg</span> × {s.reps}</span>
                      {s.memo && <div style={{ ...typo.caption, fontSize: 10, color: C.muted, marginTop: 1 }}>{s.memo}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </SCard>
        )}

        <SCard style={{ marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ padding: "16px 14px", borderRight: `1px solid ${C.border}` }}>
              <SectionLbl>重量 kg</SectionLbl>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <button onClick={() => adjW(-2.5)} className="tap" style={adjBigStyle}>−</button>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ ...typo.heroNum, fontSize: 40, color: C.text, lineHeight: 1 }}>{curW}</div>
                </div>
                <button onClick={() => adjW(2.5)} className="tap" style={{ ...adjBigStyle, background: `${mg.color}18`, borderColor: `${mg.color}45`, color: mg.color, boxShadow: `0 0 10px ${mg.color}30` }}>＋</button>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {[-5, -2.5, 2.5, 5].map((v) => (
                  <button key={v} onClick={() => adjW(v)} className="tap" style={{ flex: 1, padding: "5px 0", borderRadius: 7, border: `1px solid ${C.border}`, background: C.card2, color: v > 0 ? mg.color : C.sub, ...typo.label, fontSize: 9, cursor: "pointer", textTransform: "none", letterSpacing: 0 }}>{v > 0 ? `+${v}` : v}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: "16px 14px" }}>
              <SectionLbl>回数</SectionLbl>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <button onClick={() => adjR(-1)} className="tap" style={adjBigStyle}>−</button>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ ...typo.heroNum, fontSize: 40, color: C.text, lineHeight: 1 }}>{curR}</div>
                </div>
                <button onClick={() => adjR(1)} className="tap" style={{ ...adjBigStyle, background: `${mg.color}18`, borderColor: `${mg.color}45`, color: mg.color, boxShadow: `0 0 10px ${mg.color}30` }}>＋</button>
              </div>
              <div style={{ textAlign: "center", background: C.faint, borderRadius: 8, padding: "6px 0" }}>
                <div style={{ ...typo.label, fontSize: FS.xs, color: C.muted, marginBottom: 2 }}>推定 1RM</div>
                <div style={{ ...typo.statNum, fontSize: 16, color: mg.color, textShadow: `0 0 10px ${mg.color}50` }}>{rm1} kg</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
            {showMemo ? <input style={{ ...inpStyle }} autoFocus placeholder="セットのメモ（調子、気づきなど）" value={memo} onChange={(e) => setMemo(e.target.value)} /> : <button onClick={() => setShowMemo(true)} style={{ background: "none", border: "none", color: C.muted, ...typo.caption, fontSize: 13, cursor: "pointer", padding: 0 }}>＋ メモを追加</button>}
          </div>
          <div style={{ padding: "13px 14px" }}>
            <button onClick={addSet} className="tap glow-anim" style={{ width: "100%", background: `linear-gradient(135deg,${mg.color} 0%,${mg.color}cc 100%)`, color: C.inv, border: "none", borderRadius: 13, padding: "16px", ...typo.bodySemi, fontSize: 15, cursor: "pointer", boxShadow: `0 0 20px ${mg.color}35` }}>セット {todaySets.length + 1} を追加</button>
          </div>
        </SCard>

        {todaySets.length > 0 && (
          <SCard>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionLbl style={{ margin: 0 }}>今日のセット</SectionLbl>
              <span style={{ ...typo.bodySemi, fontSize: 12, color: mg.color }}>Vol {todayVol} kg</span>
            </div>
            {todaySets.map((l, i) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: i < todaySets.length - 1 ? `1px solid ${C.border}` : "none", gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${mg.color}18`, border: `1px solid ${mg.color}38`, display: "flex", alignItems: "center", justifyContent: "center", ...typo.label, fontSize: 9, color: mg.color, flexShrink: 0, textTransform: "none" }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ ...typo.bodySemi, fontSize: 16 }}>{l.weight}<span style={{ ...typo.body, fontSize: 11, marginLeft: 2 }}>kg</span></span>
                  <span style={{ color: C.muted, margin: "0 6px", fontSize: 12 }}>×</span>
                  <span style={{ ...typo.bodySemi, fontSize: 16 }}>{l.reps}<span style={{ ...typo.body, fontSize: 11, marginLeft: 2 }}>rep</span></span>
                  {l.memo && <div style={{ ...typo.caption, color: C.muted, marginTop: 1 }}>{l.memo}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ ...typo.caption, color: C.muted, fontSize: 11 }}>RM {epley(l.weight, l.reps)}</span>
                  <button onClick={() => saveLogs(logs.filter((x) => x.id !== l.id))} style={{ background: "none", border: "none", color: C.muted, fontSize: 16, cursor: "pointer", padding: 4, lineHeight: 1 }}>×</button>
                </div>
              </div>
            ))}
          </SCard>
        )}

        {!prevSessions.length && !todaySets.length && <div style={{ textAlign: "center", padding: "20px 0", ...typo.body, color: C.muted }}>初めての種目です。最初のセットを記録しましょう！</div>}
      </div>
    </div>
  );
}

function CardioScreen({ cardio, saveCardio, selDate }) {
  const [type, setType] = useState(CARDIO[0].name);
  const [dur, setDur] = useState("");
  const [dist, setDist] = useState("");
  const [cal, setCal] = useState("");
  const [memo, setMemo] = useState("");
  const ct = CARDIO.find((t) => t.name === type) || CARDIO[0];
  const dayC = cardio.filter((c) => toDS(c.date) === selDate);
  const add = () => {
    if (!dur) return;
    saveCardio([...cardio, { id: Date.now(), type, duration: parseInt(dur, 10), distance: dist ? parseFloat(dist) : null, calories: cal ? parseInt(cal, 10) : null, memo, date: `${selDate}T${new Date().toTimeString().slice(0, 8)}` }]);
    setDur("");
    setDist("");
    setCal("");
    setMemo("");
  };

  return (
    <div className="su">
      <div style={{ padding: "48px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...typo.label, color: C.red, marginBottom: 6 }}>Cardio</div>
        <h1 style={typo.h1}>有酸素記録</h1>
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {CARDIO.map((t) => {
            const a = type === t.name;
            return (
              <button key={t.name} onClick={() => setType(t.name)} className="tap" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${a ? t.color : C.border}`, background: a ? `${t.color}15` : "transparent", color: a ? t.color : C.sub, ...typo.bodyMed, fontSize: 12, cursor: "pointer", textAlign: "left" }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: t.color }}>{t.icon}</span>
                {t.name}
              </button>
            );
          })}
        </div>
        <SCard style={{ marginBottom: 12, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <SectionLbl>時間（分）</SectionLbl>
              <input style={{ ...inpStyle, textAlign: "center", ...typo.heroNum, fontSize: 24 }} type="number" placeholder="30" value={dur} onChange={(e) => setDur(e.target.value)} />
            </div>
            {ct.hasDist ? (
              <div>
                <SectionLbl>距離（km）</SectionLbl>
                <input style={{ ...inpStyle, textAlign: "center", ...typo.heroNum, fontSize: 24 }} type="number" step=".1" placeholder="5.0" value={dist} onChange={(e) => setDist(e.target.value)} />
              </div>
            ) : (
              <div>
                <SectionLbl>カロリー</SectionLbl>
                <input style={{ ...inpStyle, textAlign: "center", ...typo.heroNum, fontSize: 24 }} type="number" placeholder="200" value={cal} onChange={(e) => setCal(e.target.value)} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <SectionLbl>メモ</SectionLbl>
            <input style={inpStyle} placeholder="ペースなど" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>
          <button onClick={add} className="tap" style={{ width: "100%", background: ct.color, color: C.inv, border: "none", borderRadius: 12, padding: "14px", ...typo.bodySemi, fontSize: 14, cursor: "pointer", opacity: !dur ? 0.4 : 1 }}>記録する</button>
        </SCard>
        {dayC.length > 0 && (
          <SCard>
            {dayC.map((c, i) => {
              const ci = CARDIO.find((t) => t.name === c.type) || CARDIO[0];
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: i < dayC.length - 1 ? `1px solid ${C.border}` : "none", gap: 10 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: `${ci.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: ci.color }}>{ci.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...typo.bodySemi, fontSize: 13, color: ci.color }}>{c.type}</div>
                    <div style={{ ...typo.caption, color: C.muted }}>{c.duration}分{c.distance ? ` · ${c.distance}km` : ""}{c.memo ? ` · ${c.memo}` : ""}</div>
                  </div>
                  <button onClick={() => saveCardio(cardio.filter((x) => x.id !== c.id))} style={{ background: "none", border: "none", color: C.muted, fontSize: 16, cursor: "pointer", padding: 4 }}>×</button>
                </div>
              );
            })}
          </SCard>
        )}
      </div>
    </div>
  );
}

function PhotoScreen({ photos, savePhotos, selDate, setSel }) {
  const fileRef = useRef(null);
  const [uploading, setU] = useState(false);
  const [filter, setF] = useState("すべて");
  const [view, setV] = useState("timeline");
  const TAGS = ["すべて", "胸", "背中", "肩", "脚", "腕", "腹", "正面", "背面", "側面"];
  const handle = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setU(true);
    try {
      const b = await compress(f);
      await savePhotos([{ id: Date.now(), src: b, date: selDate, note: "", tags: [] }, ...photos]);
    } catch {}
    setU(false);
    e.target.value = "";
  };
  const filtered = filter === "すべて" ? photos : photos.filter((p) => (p.tags || []).includes(filter));
  const byDate = {};
  [...filtered].sort((a, b) => b.date.localeCompare(a.date)).forEach((p) => {
    if (!byDate[p.date]) byDate[p.date] = [];
    byDate[p.date].push(p);
  });
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="su">
      <div style={{ padding: "48px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...typo.label, color: C.orange, marginBottom: 6 }}>Body Progress</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <h1 style={typo.h1}>フォト記録</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...typo.caption, color: C.muted }}>{photos.length}枚</span>
            <div style={{ display: "flex", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
              {[["timeline", "≡"], ["grid", "▦"]].map(([m, ic]) => (
                <button key={m} onClick={() => setV(m)} style={{ background: view === m ? `${C.orange}20` : "transparent", border: "none", color: view === m ? C.orange : C.muted, padding: "6px 10px", fontSize: 13, cursor: "pointer" }}>{ic}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "14px" }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handle} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="tap" style={{ width: "100%", background: uploading ? C.card2 : C.orange, color: C.inv, border: "none", borderRadius: 12, padding: "13px", ...typo.bodySemi, fontSize: 13, cursor: "pointer", marginBottom: 4, opacity: uploading ? 0.6 : 1 }}>{uploading ? "処理中…" : "写真を追加"}</button>
        <div style={{ textAlign: "center", ...typo.caption, color: C.muted, marginBottom: 14 }}>選択日 <strong style={{ color: C.orange }}>{new Date(`${selDate}T00:00:00`).getMonth() + 1}月{new Date(`${selDate}T00:00:00`).getDate()}日</strong> に記録</div>
        {photos.length > 0 && (
          <>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
              {TAGS.map((t) => (
                <button key={t} onClick={() => setF(t)} className="tap" style={{ padding: "4px 10px", borderRadius: 12, border: `1px solid ${filter === t ? C.orange : C.border}`, background: filter === t ? `${C.orange}18` : "transparent", color: filter === t ? C.orange : C.muted, ...typo.caption, fontSize: 12, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
            {view === "timeline" ? (
              dates.map((ds) => (
                <div key={ds} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 2, height: 16, borderRadius: 1, background: C.orange }} />
                      <span style={{ ...typo.bodySemi, fontSize: 13 }}>{jpd(ds)}</span>
                      <span style={{ ...typo.caption, color: C.muted }}>{ago(ds)}</span>
                    </div>
                    <button onClick={() => setSel(ds)} className="tap" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, ...typo.caption, fontSize: 11, padding: "3px 8px", cursor: "pointer" }}>カレンダー</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                    {byDate[ds].map((p) => (
                      <PThumb key={p.id} photo={p} photos={photos} savePhotos={savePhotos} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[...filtered].sort((a, b) => b.id - a.id).map((p) => (
                  <PThumb key={p.id} photo={p} photos={photos} savePhotos={savePhotos} />
                ))}
              </div>
            )}
          </>
        )}
        {!photos.length && <div style={{ textAlign: "center", padding: "48px 0", ...typo.body, color: C.muted }}>まだ写真がありません</div>}
      </div>
    </div>
  );
}

function GraphScreen({ logs, cardio, sleep, nutri }) {
  const usedEx = [...new Set(logs.map((l) => l.exercise))];
  const [fEx, setFEx] = useState(usedEx[0] || "ベンチプレス");
  const [mode, setMode] = useState("overview");
  const [bodySide, setBodySide] = useState("front");
  const lmg = Object.entries(MG).find(([, v]) => v.exs.includes(fEx));
  const lCol = lmg ? lmg[1].color : C.amber;
  const wbd = {};
  logs.filter((l) => l.exercise === fEx).forEach((l) => {
    const ds = toDS(l.date);
    if (!wbd[ds] || l.weight > wbd[ds].最大重量) wbd[ds] = { date: ds, 最大重量: l.weight, ボリューム: 0, 推定1RM: 0, セット数: 0 };
    wbd[ds].ボリューム += l.weight * l.reps;
    wbd[ds].推定1RM = Math.max(wbd[ds].推定1RM || 0, epley(l.weight, l.reps));
    wbd[ds].セット数 += 1;
  });
  const weightD = Object.values(wbd).sort((a, b) => a.date.localeCompare(b.date)).slice(-20).map((d) => ({ ...d, date: fmt(d.date) }));
  const cardioD = [...cardio].sort((a, b) => a.id - b.id).slice(-14).map((c) => ({ date: fmt(c.date), 時間: c.duration }));
  const sleepD = [...sleep].sort((a, b) => a.date.localeCompare(b.date)).slice(-14).map((s) => ({ date: fmt(`${s.date}T12:00:00`), 睡眠: s.hours }));
  const bwD = (nutri.bodyWeights || []).sort((a, b) => a.date.localeCompare(b.date)).slice(-20).map((b) => ({ date: fmt(`${b.date}T12:00:00`), 体重: b.weight }));
  const tt = { contentStyle: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, ...typo.caption, color: C.text } };
  const totalVol = logs.reduce((s, l) => s + l.weight * l.reps, 0);
  const prs = logs.reduce((acc, l) => {
    acc[l.exercise] = Math.max(acc[l.exercise] || 0, epley(l.weight, l.reps));
    return acc;
  }, {});
  const topPrs = Object.entries(prs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const partLoad = ALL_MG.map((m) => ({
    key: m,
    sets: logs.filter((l) => l.muscle === m).length,
    last: logs.filter((l) => l.muscle === m).sort((a, b) => b.id - a.id)[0],
  })).filter((m) => m.sets > 0).sort((a, b) => b.sets - a.sets);
  const activeParts = partLoad.slice(0, 4).map((p) => p.key);

  return (
    <div className="su" style={{ padding: "34px 14px 0" }}>
      <div style={{ padding: "0 6px 14px" }}>
        <div style={{ ...typo.label, color: C.amber, marginBottom: 6 }}>Strong style analytics</div>
        <h1 style={typo.h1}>分析</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[["総セット", logs.length, "sets"], ["有酸素", cardio.length, "回"], ["累計Vol", `${Math.round((totalVol / 1000) * 10) / 10}`, "t"]].map(([l, v, u]) => (
          <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
            <div style={{ ...typo.statNum, color: C.amber, lineHeight: 1 }}>{v}<span style={{ ...typo.caption, fontSize: 9, color: C.muted, marginLeft: 2 }}>{u}</span></div>
            <div style={{ ...typo.label, fontSize: FS.xs, color: C.muted, marginTop: 4, textTransform: "none" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 3, marginBottom: 14 }}>
        {[["overview", "概要"], ["weight", "筋トレ"], ["bodymap", "部位"], ["body", "体重"]].map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: mode === m ? C.surface : "transparent", color: mode === m ? C.amber : C.muted, ...typo.caption, fontSize: 11, fontWeight: mode === m ? FW.semibold : FW.normal, cursor: "pointer", transition: "all .15s" }}>{l}</button>
        ))}
      </div>
      {mode === "overview" && (
        <>
          <GCard title="ハイライト" sub="筋トレMEMOの一覧性 + Strongの分析感">
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10, padding: "0 8px 8px" }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12 }}>
                <div style={{ ...typo.bodySemi, fontSize: 12, marginBottom: 6 }}>よく鍛えている部位</div>
                <MuscleMapCard parts={activeParts.length ? activeParts : ["胸", "脚"]} side={bodySide} onSideChange={setBodySide} compact />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {topPrs.length ? topPrs.slice(0, 3).map(([exName, pr]) => (
                  <div key={exName} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 11px" }}>
                    <div style={{ ...typo.caption, color: C.muted, marginBottom: 4 }}>推定1RM</div>
                    <div style={{ ...typo.bodySemi, fontSize: 12 }}>{exName}</div>
                    <div style={{ ...typo.statNum, fontSize: 20, color: C.amber, marginTop: 4 }}>{Math.round(pr)}<span style={{ ...typo.caption, color: C.muted, marginLeft: 3 }}>kg</span></div>
                  </div>
                )) : <Empty text="まずは数セット記録すると分析が出ます" />}
              </div>
            </div>
          </GCard>
          {cardioD.length >= 2 && <GCard title="有酸素（分）"><ResponsiveContainer width="100%" height={150}><BarChart data={cardioD} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} /><XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip {...tt} /><Bar dataKey="時間" fill={C.red} radius={[4, 4, 0, 0]} opacity={0.88} /></BarChart></ResponsiveContainer></GCard>}
          {sleepD.length >= 2 && <GCard title="睡眠時間（h）"><ResponsiveContainer width="100%" height={150}><LineChart data={sleepD} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 10]} tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip {...tt} /><Line type="monotone" dataKey="睡眠" stroke={C.purple} strokeWidth={2.5} dot={{ fill: C.purple, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></GCard>}
        </>
      )}
      {mode === "weight" && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {(usedEx.length ? usedEx : ["ベンチプレス"]).map((e) => {
              const m2 = Object.entries(MG).find(([, v]) => v.exs.includes(e));
              const col = m2 ? m2[1].color : C.amber;
              return (
                <button key={e} onClick={() => setFEx(e)} className="tap" style={{ padding: "4px 10px", borderRadius: 12, border: `1px solid ${fEx === e ? col : C.border}`, background: fEx === e ? `${col}18` : "transparent", color: fEx === e ? col : C.muted, ...typo.caption, fontSize: 12, cursor: "pointer" }}>{e}</button>
              );
            })}
          </div>
          {weightD.length === 0 ? (
            <Empty />
          ) : (
            <>
              <GCard title="日別最大重量" sub={`${fEx} — 各日のベスト`}>
                <ResponsiveContainer width="100%" height={155}>
                  <ComposedChart data={weightD} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip {...tt} />
                    <Area type="monotone" dataKey="最大重量" fill={`${lCol}12`} stroke={lCol} strokeWidth={2.5} dot={{ fill: lCol, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </GCard>
              <GCard title="推定1RM" sub={`${fEx} — rep数から自動計算`}>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={weightD} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip {...tt} />
                    <Line type="monotone" dataKey="推定1RM" stroke={C.amber} strokeWidth={2.5} dot={{ fill: C.amber, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </GCard>
              <GCard title="日別ボリューム" sub={fEx}>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={weightD} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip {...tt} />
                    <Bar dataKey="ボリューム" fill={C.orange} radius={[4, 4, 0, 0]} opacity={0.88} />
                  </BarChart>
                </ResponsiveContainer>
              </GCard>
              <GCard title="セット数推移" sub={fEx}>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={weightD} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip {...tt} />
                    <Bar dataKey="セット数" fill={lCol} radius={[4, 4, 0, 0]} opacity={0.88} />
                  </BarChart>
                </ResponsiveContainer>
              </GCard>
            </>
          )}
        </>
      )}
      {mode === "bodymap" && (
        <>
          <GCard title="効く部位マップ" sub="Strongの分析情報を部位表示に寄せたビュー">
            <div style={{ padding: "0 8px 10px" }}>
              <MuscleMapCard parts={activeParts.length ? activeParts : ["胸", "背中"]} side={bodySide} onSideChange={setBodySide} />
            </div>
          </GCard>
          <SCard style={{ marginBottom: 10 }}>
            {partLoad.length ? partLoad.map((part, idx) => (
              <div key={part.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: idx < partLoad.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <div style={{ ...typo.bodySemi, fontSize: 13, color: MG[part.key].color }}>{part.key}</div>
                  <div style={{ ...typo.caption, color: C.muted }}>{MG_DETAIL[part.key].jp} / {part.last ? `${ago(toDS(part.last.date))}` : "未記録"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...typo.statNum, fontSize: 18, color: MG[part.key].color }}>{part.sets}</div>
                  <div style={{ ...typo.caption, color: C.muted }}>total sets</div>
                </div>
              </div>
            )) : <div style={{ padding: 20 }}><Empty text="筋肉マップは筋トレ記録後に表示されます" /></div>}
          </SCard>
        </>
      )}
      {mode === "body" && (bwD.length < 2 ? <Empty text="体重データが少ないです。ツール→栄養から記録できます" /> : <GCard title="体重推移（kg）"><ResponsiveContainer width="100%" height={150}><LineChart data={bwD} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip {...tt} /><Line type="monotone" dataKey="体重" stroke={C.teal} strokeWidth={2.5} dot={{ fill: C.teal, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></GCard>)}
    </div>
  );
}

function GCard({ title, sub, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 8px 10px", marginBottom: 10 }}>
      <div style={{ ...typo.bodySemi, fontSize: 12, paddingLeft: 8, marginBottom: sub ? 2 : 12 }}>{title}</div>
      {sub && <div style={{ ...typo.caption, color: C.muted, paddingLeft: 8, marginBottom: 12 }}>{sub}</div>}
      {children}
    </div>
  );
}

function Empty({ text = "データが少ないです" }) {
  return <div style={{ textAlign: "center", color: C.muted, padding: "28px 0", ...typo.caption }}>{text}</div>;
}

function MuscleMapCard({ parts, side = "front", onSideChange, compact = false }) {
  const uniqParts = [...new Set(parts || [])];
  return (
    <div>
      {onSideChange && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10, justifyContent: compact ? "flex-start" : "center" }}>
          {["front", "back"].map((v) => (
            <button key={v} onClick={() => onSideChange(v)} className="tap" style={{ padding: compact ? "5px 10px" : "7px 12px", borderRadius: 999, border: `1px solid ${side === v ? C.amber : C.border}`, background: side === v ? `${C.amber}16` : C.surface, color: side === v ? C.amber : C.muted, ...typo.caption, fontSize: 11, cursor: "pointer" }}>
              {v === "front" ? "前面" : "背面"}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1.1fr .9fr", gap: 12, alignItems: "center" }}>
        <BodySilhouette side={side} activeParts={uniqParts} compact={compact} />
        {!compact && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {uniqParts.map((part) => (
              <div key={part} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "9px 10px" }}>
                <div style={{ ...typo.bodySemi, fontSize: 12, color: MG[part].color }}>{part}</div>
                <div style={{ ...typo.caption, color: C.muted, marginTop: 3 }}>{MG_DETAIL[part].jp} / {MG_DETAIL[part].note}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {compact && uniqParts.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {uniqParts.slice(0, 4).map((part) => (
            <span key={part} style={{ padding: "4px 9px", borderRadius: 999, background: `${MG[part].color}16`, border: `1px solid ${MG[part].color}32`, color: MG[part].color, ...typo.caption, fontSize: 11 }}>
              {part}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function BodySilhouette({ side, activeParts, compact = false }) {
  const base = compact ? 170 : 220;
  const active = new Set(activeParts);
  const fullBody = active.has("全身");
  const isOn = (part) => fullBody || active.has(part);
  const zoneColor = (part) => (isOn(part) ? (fullBody && !active.has(part) ? MG.全身.color : MG[part].color) : "#221e16");
  const zoneOpacity = (part) => (isOn(part) ? 0.9 : 0.42);
  const common = { stroke: "#2c271d", strokeWidth: 2 };
  const frontParts = (
    <>
      <path d="M75 63 C62 68,60 92,68 114 C73 125,84 130,95 127 C103 125,108 117,110 108 C112 118,117 125,125 127 C136 130,147 125,152 114 C160 92,158 68,145 63 C136 59,122 58,110 67 C98 58,84 59,75 63 Z" fill={zoneColor("胸")} opacity={zoneOpacity("胸")} />
      <path d="M88 130 C82 145,80 160,84 180 C87 196,96 205,104 207 L104 129 Z" fill={zoneColor("腹")} opacity={zoneOpacity("腹")} />
      <path d="M116 129 L116 207 C124 205,133 196,136 180 C140 160,138 145,132 130 Z" fill={zoneColor("腹")} opacity={zoneOpacity("腹")} />
      <path d="M52 68 C42 76,37 90,37 108 C37 124,46 134,59 138 C66 126,68 108,66 89 C64 80,60 72,52 68 Z" fill={zoneColor("肩")} opacity={zoneOpacity("肩")} />
      <path d="M168 68 C178 76,183 90,183 108 C183 124,174 134,161 138 C154 126,152 108,154 89 C156 80,160 72,168 68 Z" fill={zoneColor("肩")} opacity={zoneOpacity("肩")} />
      <path d="M56 136 C46 152,43 170,48 188 C53 205,64 214,74 210 C79 206,80 196,77 183 C74 170,72 152,73 139 Z" fill={zoneColor("腕")} opacity={zoneOpacity("腕")} />
      <path d="M164 136 C174 152,177 170,172 188 C167 205,156 214,146 210 C141 206,140 196,143 183 C146 170,148 152,147 139 Z" fill={zoneColor("腕")} opacity={zoneOpacity("腕")} />
      <path d="M86 212 C73 224,68 246,72 270 C76 291,89 309,101 312 C109 300,110 268,107 213 Z" fill={zoneColor("脚")} opacity={zoneOpacity("脚")} />
      <path d="M134 212 C147 224,152 246,148 270 C144 291,131 309,119 312 C111 300,110 268,113 213 Z" fill={zoneColor("脚")} opacity={zoneOpacity("脚")} />
    </>
  );
  const backParts = (
    <>
      <path d="M75 65 C63 72,62 89,68 106 C74 121,89 128,102 126 L102 72 C93 62,83 61,75 65 Z" fill={zoneColor("肩")} opacity={zoneOpacity("肩")} />
      <path d="M145 65 C157 72,158 89,152 106 C146 121,131 128,118 126 L118 72 C127 62,137 61,145 65 Z" fill={zoneColor("肩")} opacity={zoneOpacity("肩")} />
      <path d="M74 111 C73 139,84 162,101 179 C107 164,109 145,107 110 C98 103,84 103,74 111 Z" fill={zoneColor("背中")} opacity={zoneOpacity("背中")} />
      <path d="M146 111 C147 139,136 162,119 179 C113 164,111 145,113 110 C122 103,136 103,146 111 Z" fill={zoneColor("背中")} opacity={zoneOpacity("背中")} />
      <path d="M86 176 C82 191,83 204,88 213 C94 224,102 229,110 230 C118 229,126 224,132 213 C137 204,138 191,134 176 Z" fill={zoneColor("全身")} opacity={zoneOpacity("全身")} />
      <path d="M56 136 C46 152,43 170,48 188 C53 205,64 214,74 210 C79 206,80 196,77 183 C74 170,72 152,73 139 Z" fill={zoneColor("腕")} opacity={zoneOpacity("腕")} />
      <path d="M164 136 C174 152,177 170,172 188 C167 205,156 214,146 210 C141 206,140 196,143 183 C146 170,148 152,147 139 Z" fill={zoneColor("腕")} opacity={zoneOpacity("腕")} />
      <path d="M86 212 C73 224,68 246,72 270 C76 291,89 309,101 312 C109 300,110 268,107 213 Z" fill={zoneColor("脚")} opacity={zoneOpacity("脚")} />
      <path d="M134 212 C147 224,152 246,148 270 C144 291,131 309,119 312 C111 300,110 268,113 213 Z" fill={zoneColor("脚")} opacity={zoneOpacity("脚")} />
    </>
  );

  return (
    <div style={{ background: `radial-gradient(circle at 50% 16%, rgba(240,165,0,.10), transparent 40%), ${C.surface}`, border: `1px solid ${C.border}`, borderRadius: 18, padding: compact ? "8px 4px" : "14px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 220 330" width={base} height={(base * 330) / 220} aria-label="muscle-map">
        <g>
          <circle cx="110" cy="34" r="24" fill="#17130d" {...common} />
          <path d="M79 60 C65 66,58 80,58 98 L58 142 C58 163,74 179,88 188 L92 210 L128 210 L132 188 C146 179,162 163,162 142 L162 98 C162 80,155 66,141 60 C131 56,122 56,110 66 C98 56,89 56,79 60 Z" fill="#17130d" {...common} />
          <path d="M92 210 L86 320" fill="none" {...common} strokeLinecap="round" />
          <path d="M128 210 L134 320" fill="none" {...common} strokeLinecap="round" />
          <path d="M58 100 L46 204" fill="none" {...common} strokeLinecap="round" />
          <path d="M162 100 L174 204" fill="none" {...common} strokeLinecap="round" />
          {side === "front" ? frontParts : backParts}
        </g>
      </svg>
    </div>
  );
}

function ToolsScreen({ sleep, saveSleep, nutri, saveNutri }) {
  const [sub, setSub] = useState("timer");
  return (
    <div className="su">
      <div style={{ padding: "48px 20px 14px", borderBottom: `1px solid ${C.border}` }}>
        <h1 style={typo.h1}>ツール</h1>
      </div>
      <div style={{ display: "flex", gap: 3, padding: "12px 14px 0", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        {[["timer", "タイマー"], ["sleep", "睡眠"], ["smolov", "スモロフJr"], ["nutri", "栄養"]].map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} className="tap" style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", background: sub === k ? C.surface : "transparent", color: sub === k ? C.amber : C.muted, ...typo.caption, fontSize: 11, fontWeight: sub === k ? FW.semibold : FW.normal, cursor: "pointer", transition: "all .15s" }}>{l}</button>
        ))}
      </div>
      <div style={{ padding: "14px" }}>
        {sub === "timer" && <TimerPanel />}
        {sub === "sleep" && <SleepPanel sleep={sleep} saveSleep={saveSleep} />}
        {sub === "smolov" && <SmolovPanel />}
        {sub === "nutri" && <NutriPanel nutri={nutri} saveNutri={saveNutri} />}
      </div>
    </div>
  );
}

function TimerPanel() {
  const [pre, setPre] = useState(120);
  const [rem, setRem] = useState(120);
  const [run, setRun] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const COL = { 60: C.red, 120: C.amber, 180: C.blue };
  const col = COL[pre];
  const R = 82;
  const CIRC = 2 * Math.PI * R;
  useEffect(() => { setRem(pre); setRun(false); setDone(false); }, [pre]);
  useEffect(() => {
    if (run) {
      ref.current = setInterval(() => {
        setRem((r) => {
          if (r <= 1) {
            clearInterval(ref.current);
            setRun(false);
            setDone(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [run]);
  const m = Math.floor(rem / 60);
  const s = rem % 60;
  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
        {[60, 120, 180].map((p) => (
          <button key={p} onClick={() => setPre(p)} className="tap" style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1.5px solid ${pre === p ? COL[p] : C.border}`, background: pre === p ? `${COL[p]}15` : "transparent", color: pre === p ? COL[p] : C.muted, ...typo.bodySemi, fontSize: 12, cursor: "pointer" }}>{p}秒</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div style={{ position: "relative", width: 204, height: 204 }}>
          <svg width="204" height="204" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="102" cy="102" r={R} fill="none" stroke={C.border} strokeWidth="9" />
            <circle cx="102" cy="102" r={R} fill="none" stroke={col} strokeWidth="9" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - rem / pre)} strokeLinecap="round" style={{ transition: "stroke-dashoffset .9s linear,stroke .3s", filter: `drop-shadow(0 0 6px ${col}70)` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ ...typo.timerNum, color: done ? C.red : C.text, animation: done ? "timer-done .6s ease infinite" : "none" }}>{pad2(m)}:{pad2(s)}</div>
            <div style={{ ...typo.caption, color: done ? C.red : C.muted, marginTop: 6 }}>{done ? "完了！" : run ? "レスト中" : "スタンバイ"}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => { setRem(pre); setRun(false); setDone(false); }} className="tap" style={{ ...ghostStyle, width: 88 }}>リセット</button>
        <button onClick={() => setRun(!run)} className="tap" style={{ background: run ? C.card2 : col, color: run ? C.text : C.inv, border: "none", borderRadius: 12, padding: "14px 0", ...typo.bodySemi, fontSize: 14, cursor: "pointer", width: 128, transition: "all .18s", boxShadow: !run ? `0 0 16px ${col}50` : "none" }}>{run ? "一時停止" : "スタート"}</button>
      </div>
    </>
  );
}

function SleepPanel({ sleep, saveSleep }) {
  const [h, setH] = useState("");
  const [q, setQ] = useState(3);
  const td = today();
  const tl = sleep.find((s) => s.date === td);
  const recent = [...sleep].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  const avg = recent.length ? (recent.reduce((s, l) => s + l.hours, 0) / recent.length).toFixed(1) : "--";
  const EM = ["", "😴", "😐", "😊", "😄", "🤩"];
  const add = () => {
    if (!h) return;
    saveSleep(
      tl
        ? sleep.map((s) => (s.date === td ? { ...s, hours: parseFloat(h), quality: q } : s))
        : [{ id: Date.now(), date: td, hours: parseFloat(h), quality: q }, ...sleep],
    );
    setH("");
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[["平均睡眠", `${avg}h`, C.purple], ["記録日数", `${sleep.length}日`, C.blue]].map(([l, v, col]) => (
          <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...typo.statNum, color: col }}>{v}</div>
            <div style={{ ...typo.label, fontSize: FS.xs, color: C.muted, marginTop: 4, textTransform: "none" }}>{l}</div>
          </div>
        ))}
      </div>
      <SCard style={{ padding: 16, marginBottom: 12 }}>
        <SectionLbl>{tl ? "今日を更新" : "今日の睡眠（h）"}</SectionLbl>
        <input style={{ ...inpStyle, textAlign: "center", ...typo.heroNum, fontSize: 26, marginBottom: 12 }} type="number" step=".5" placeholder="7.5" value={h} onChange={(e) => setH(e.target.value)} />
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 14 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setQ(n)} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", opacity: n <= q ? 1 : 0.2, transition: "opacity .15s" }}>{EM[n]}</button>
          ))}
        </div>
        <button onClick={add} className="tap" style={{ width: "100%", background: C.purple, color: "#fff", border: "none", borderRadius: 12, padding: "13px", ...typo.bodySemi, fontSize: 13, cursor: "pointer", opacity: !h ? 0.4 : 1 }}>{tl ? "更新" : "記録する"}</button>
      </SCard>
      {recent.map((s, i) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: C.card, borderRadius: i === 0 ? "12px 12px 0 0" : i === recent.length - 1 ? "0 0 12px 12px" : "0", border: `1px solid ${C.border}`, borderTop: i > 0 ? "none" : undefined }}>
          <div>
            <div style={{ ...typo.bodyMed, fontSize: 13 }}>{new Date(`${s.date}T12:00:00`).getMonth() + 1}月{new Date(`${s.date}T12:00:00`).getDate()}日{s.date === td && <Chip color={C.amber} style={{ marginLeft: 7 }}>TODAY</Chip>}</div>
            <div style={{ fontSize: 13, marginTop: 1 }}>{EM[s.quality]}</div>
          </div>
          <div style={{ background: `${C.purple}15`, border: `1px solid ${C.purple}35`, borderRadius: 8, padding: "4px 11px", ...typo.bodySemi, fontSize: 13, color: C.purple }}>{s.hours}h</div>
        </div>
      ))}
    </>
  );
}

function NutriPanel({ nutri, saveNutri }) {
  const [bw, setBw] = useState(nutri.weight || "");
  const [act, setAct] = useState(nutri.activity || "moderate");
  const w = parseFloat(bw) || 0;
  const actM = { low: 1.375, moderate: 1.55, high: 1.725, very_high: 1.9 };
  const actL = { low: "低（週1-2）", moderate: "中（週3-4）", high: "高（週5-6）", very_high: "超高（毎日）" };
  const actCol = { low: C.blue, moderate: C.amber, high: C.orange, very_high: C.red };
  const TDEE = Math.round(w * 22 * actM[act]);
  const saveW = () => {
    if (!bw) return;
    const bws = nutri.bodyWeights || [];
    const td = today();
    const ex = bws.find((b) => b.date === td);
    saveNutri({
      ...nutri,
      weight: bw,
      activity: act,
      bodyWeights: ex ? bws.map((b) => (b.date === td ? { ...b, weight: parseFloat(bw) } : b)) : [...bws, { date: td, weight: parseFloat(bw) }],
    });
  };

  return (
    <>
      <SCard style={{ padding: 16, marginBottom: 14 }}>
        <SectionLbl>今日の体重（kg）</SectionLbl>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input style={{ ...inpStyle, flex: 1, textAlign: "center", ...typo.heroNum, fontSize: 26 }} type="number" step=".1" placeholder="70.0" value={bw} onChange={(e) => setBw(e.target.value)} />
          <button onClick={saveW} className="tap" style={{ background: C.teal, color: C.inv, border: "none", borderRadius: 10, padding: "0 16px", ...typo.bodySemi, fontSize: 13, cursor: "pointer", flexShrink: 0, opacity: !bw ? 0.4 : 1 }}>記録</button>
        </div>
        <SectionLbl>活動量</SectionLbl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
          {Object.entries(actL).map(([k, l]) => (
            <button key={k} onClick={() => { setAct(k); saveNutri({ ...nutri, activity: k }); }} className="tap" style={{ padding: "8px 10px", borderRadius: 10, border: `1.5px solid ${act === k ? actCol[k] : C.border}`, background: act === k ? `${actCol[k]}15` : "transparent", color: act === k ? actCol[k] : C.muted, ...typo.caption, fontSize: 11, fontWeight: act === k ? FW.semibold : FW.normal, cursor: "pointer", textAlign: "left" }}>{l}</button>
          ))}
        </div>
      </SCard>
      {w > 0 ? (
        <>
          <SCard style={{ padding: 16, marginBottom: 12 }}>
            <SectionLbl>必要タンパク質量</SectionLbl>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
              <span style={{ ...typo.heroNum, fontSize: 36, color: C.green }}>{Math.round(w * 1.8)}</span>
              <span style={{ ...typo.bodySemi, color: C.muted }}>〜</span>
              <span style={{ ...typo.heroNum, fontSize: 36, color: C.amber }}>{Math.round(w * 2.5)}</span>
              <span style={{ ...typo.body, color: C.muted }}>g/日</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["×1.8", Math.round(w * 1.8), C.green], ["×2.0", Math.round(w * 2), C.amber], ["×2.5", Math.round(w * 2.5), C.orange]].map(([l, v, col]) => (
                <div key={l} style={{ flex: 1, background: `${col}10`, border: `1px solid ${col}25`, borderRadius: 10, padding: "9px 8px", textAlign: "center" }}>
                  <div style={{ ...typo.caption, color: C.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ ...typo.statNum, fontSize: 18, color: col }}>{v}g</div>
                </div>
              ))}
            </div>
            <div style={{ ...typo.caption, color: C.muted, lineHeight: 1.7 }}>鶏胸肉100g≈23g / 卵1個≈6g / プロテイン1杯≈20-25g</div>
          </SCard>
          <SCard style={{ padding: 16, marginBottom: 12 }}>
            <SectionLbl>推定TDEE</SectionLbl>
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ ...typo.heroNum, fontSize: 42, color: C.amber, textShadow: `0 0 20px ${C.amber}40` }}>{TDEE}<span style={{ ...typo.body, fontSize: 14, color: C.muted, marginLeft: 4 }}>kcal</span></div>
              <div style={{ ...typo.caption, color: C.muted, marginTop: 4 }}>{actL[act]}の場合</div>
            </div>
            <div style={{ ...typo.caption, color: C.muted, lineHeight: 1.7 }}>体重のみの簡易計算です</div>
          </SCard>
          {(nutri.bodyWeights || []).length > 0 && (
            <SCard>
              {[...nutri.bodyWeights].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7).map((bwItem, i, arr) => (
                <div key={bwItem.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ ...typo.bodyMed, fontSize: 13 }}>{new Date(`${bwItem.date}T12:00:00`).getMonth() + 1}月{new Date(`${bwItem.date}T12:00:00`).getDate()}日{bwItem.date === today() && <Chip color={C.teal} style={{ marginLeft: 7 }}>TODAY</Chip>}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {i < arr.length - 1 && (() => {
                      const diff = Math.round((bwItem.weight - arr[i + 1].weight) * 10) / 10;
                      return diff !== 0 ? <span style={{ ...typo.caption, fontSize: 11, color: diff > 0 ? C.red : C.green, fontWeight: FW.semibold }}>{diff > 0 ? `+${diff}` : diff}kg</span> : null;
                    })()}
                    <div style={{ background: `${C.teal}15`, border: `1px solid ${C.teal}30`, borderRadius: 8, padding: "4px 11px", ...typo.bodySemi, fontSize: 13, color: C.teal }}>{bwItem.weight}kg</div>
                    <button onClick={() => saveNutri({ ...nutri, bodyWeights: (nutri.bodyWeights || []).filter((b) => b.date !== bwItem.date) })} style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", padding: 3 }}>×</button>
                  </div>
                </div>
              ))}
            </SCard>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", ...typo.body, color: C.muted, padding: "24px 0" }}>体重を入力すると計算結果が表示されます</div>
      )}
    </>
  );
}

function SmolovPanel() {
  const [rm, setRm] = useState("");
  const [inc, setInc] = useState(2.5);
  const [unit, setUnit] = useState(2.5);
  const [useTM, setTM] = useState(false);
  const [wks, setWks] = useState(3);
  const [sch, setSch] = useState(null);
  const [ex, setEx] = useState("ベンチプレス");
  const WC = ["#5aa8dc", "#e08830", "#e05540", "#9478e0"];
  const DN = ["6×6 ベース", "7×5 強度↑", "8×4 ボリューム", "10×3 高強度"];

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {["ベンチプレス", "スクワット", "デッドリフト", "ショルダープレス"].map((e) => (
          <button key={e} onClick={() => setEx(e)} className="tap" style={{ padding: "5px 10px", borderRadius: 12, border: `1px solid ${ex === e ? C.red : C.border}`, background: ex === e ? `${C.red}15` : "transparent", color: ex === e ? C.red : C.muted, ...typo.caption, fontSize: 12, cursor: "pointer" }}>{e}</button>
        ))}
      </div>
      <SCard style={{ padding: 14, marginBottom: 12 }}>
        <SectionLbl>1RM — {ex}（kg）</SectionLbl>
        <input style={{ ...inpStyle, textAlign: "center", ...typo.heroNum, fontSize: 28, marginBottom: 12 }} type="number" placeholder="100" value={rm} onChange={(e) => setRm(e.target.value)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <SectionLbl>週次加重</SectionLbl>
            <div style={{ display: "flex", gap: 6 }}>
              {[2.5, 5].map((v) => (
                <button key={v} onClick={() => setInc(v)} className="tap" style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${inc === v ? C.orange : C.border}`, background: inc === v ? `${C.orange}15` : "transparent", color: inc === v ? C.orange : C.muted, ...typo.bodySemi, fontSize: 12, cursor: "pointer" }}>{v}kg</button>
              ))}
            </div>
          </div>
          <div>
            <SectionLbl>刻み</SectionLbl>
            <div style={{ display: "flex", gap: 6 }}>
              {[1.25, 2.5].map((v) => (
                <button key={v} onClick={() => setUnit(v)} className="tap" style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${unit === v ? C.teal : C.border}`, background: unit === v ? `${C.teal}15` : "transparent", color: unit === v ? C.teal : C.muted, ...typo.bodySemi, fontSize: 11, cursor: "pointer" }}>{v}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <SectionLbl>週数</SectionLbl>
            <div style={{ display: "flex", gap: 6 }}>
              {[3, 4].map((v) => (
                <button key={v} onClick={() => setWks(v)} className="tap" style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${wks === v ? C.blue : C.border}`, background: wks === v ? `${C.blue}15` : "transparent", color: wks === v ? C.blue : C.muted, ...typo.bodySemi, fontSize: 12, cursor: "pointer" }}>{v}週</button>
              ))}
            </div>
          </div>
          <div>
            <SectionLbl>ベース</SectionLbl>
            <button onClick={() => setTM(!useTM)} className="tap" style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1.5px solid ${useTM ? C.purple : C.border}`, background: useTM ? `${C.purple}15` : "transparent", color: useTM ? C.purple : C.muted, ...typo.caption, fontSize: 10, fontWeight: FW.semibold, cursor: "pointer" }}>{useTM ? "TM 90%" : "1RMそのまま"}</button>
          </div>
        </div>
        <button onClick={() => { if (rm) setSch(smolovJr(parseFloat(rm), wks, inc, unit, useTM)); }} className="tap" style={{ width: "100%", background: C.red, color: C.inv, border: "none", borderRadius: 12, padding: "14px", ...typo.bodySemi, fontSize: 14, cursor: "pointer", opacity: !rm ? 0.4 : 1 }}>スケジュール生成</button>
      </SCard>
      {sch && sch.map((w, wi) => (
        <div key={w.week} style={{ background: C.card, border: `1px solid ${WC[wi]}38`, borderRadius: 13, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ padding: "10px 14px", background: `${WC[wi]}0c`, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ ...typo.brand, color: WC[wi] }}>Week {w.week}</span>
            {wi > 0 && <span style={{ ...typo.caption, color: C.muted }}>+{inc * wi}kg</span>}
          </div>
          {w.menu.map((d, di) => (
            <div key={d.day} style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", alignItems: "center", gap: 8, padding: "12px 14px", borderBottom: di < 3 ? `1px solid ${C.border}` : "none" }}>
              <div>
                <div style={{ ...typo.bodySemi, fontSize: 11, color: WC[wi] }}>{d.day}</div>
                <div style={{ ...typo.caption, fontSize: 10, color: C.muted, marginTop: 1 }}>{DN[di]}</div>
              </div>
              <div style={{ ...typo.body, fontSize: 11, color: C.sub }}><span style={{ ...typo.bodySemi, color: C.text }}>{d.sets}×{d.reps}</span> ({d.pct}%)</div>
              <div style={{ background: `${WC[wi]}15`, border: `1px solid ${WC[wi]}40`, borderRadius: 8, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ ...typo.statNum, fontSize: 15, color: WC[wi] }}>{d.weight}</div>
                <div style={{ ...typo.label, fontSize: 8, color: C.muted, textTransform: "none" }}>kg</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function SCard({ children, style = {} }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", ...style }}>{children}</div>;
}

function Chip({ children, color, style = {} }) {
  return <span style={{ ...typo.label, fontSize: 8, color, background: `${color}18`, border: `1px solid ${color}35`, borderRadius: 6, padding: "2px 7px", textTransform: "none", letterSpacing: ".02em", ...style }}>{children}</span>;
}

function SectionLbl({ children, style = {} }) {
  return <div style={{ ...typo.label, color: C.muted, marginBottom: 8, ...style }}>{children}</div>;
}

const ibStyle = {
  background: "none",
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  color: C.text,
  width: 30,
  height: 30,
  fontSize: 17,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const inpStyle = {
  width: "100%",
  background: C.input,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  color: C.text,
  fontFamily: SYS,
  fontSize: 14,
  fontWeight: FW.medium,
  padding: "11px 13px",
  outline: "none",
  boxSizing: "border-box",
};

const ghostStyle = {
  background: "transparent",
  color: C.sub,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "13px",
  fontFamily: SYS,
  fontSize: 13,
  fontWeight: FW.medium,
  cursor: "pointer",
};

const adjBigStyle = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  background: C.card2,
  color: C.sub,
  fontSize: 22,
  fontWeight: FW.medium,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
