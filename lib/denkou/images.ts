/**
 * ダミー現場写真。
 * 外部通信ゼロで動くよう、SVG を data URI として埋め込んで生成する。
 */

function toDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

function frame(inner: string, bg = "#e2e8f0"): string {
  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${bg}"/>
          <stop offset="1" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#sky)"/>
      ${inner}
      <rect x="0" y="360" width="640" height="40" fill="#0f172a" opacity="0.55"/>
      <circle cx="26" cy="380" r="6" fill="#f59e0b"/>
    </svg>`);
}

function label(text: string): string {
  return `<text x="46" y="386" font-family="sans-serif" font-size="16" fill="#f8fafc">${text}</text>`;
}

/** 動力盤・分電盤の結線 */
export const PHOTO_PANEL = frame(
  `
  <rect x="140" y="40" width="360" height="300" rx="10" fill="#94a3b8"/>
  <rect x="158" y="58" width="324" height="264" rx="6" fill="#e2e8f0"/>
  <rect x="176" y="76" width="130" height="60" rx="4" fill="#1e3a8a"/>
  <text x="188" y="113" font-family="sans-serif" font-size="22" fill="#f8fafc">MCCB</text>
  ${[0, 1, 2, 3].map((i) => `<rect x="${330 + i * 34}" y="76" width="26" height="60" rx="3" fill="#334155"/><rect x="${336 + i * 34}" y="88" width="14" height="20" rx="2" fill="#f59e0b"/>`).join("")}
  <path d="M190 150 C 240 200, 300 200, 350 250" stroke="#dc2626" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M215 150 C 265 210, 320 210, 375 255" stroke="#f8fafc" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M240 150 C 290 220, 340 220, 400 260" stroke="#0f172a" stroke-width="9" fill="none" stroke-linecap="round"/>
  <rect x="330" y="248" width="120" height="56" rx="5" fill="#475569"/>
  ${[0, 1, 2].map((i) => `<circle cx="${356 + i * 34}" cy="276" r="10" fill="#cbd5e1"/>`).join("")}
  ${label("動力盤 一次側結線")}
`,
  "#f1f5f9",
);

/** 天井裏の通線作業 */
export const PHOTO_CONDUIT = frame(
  `
  <rect x="0" y="0" width="640" height="150" fill="#475569"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${20 + i * 108}" y="0" width="14" height="150" fill="#334155"/>`).join("")}
  <rect x="0" y="150" width="640" height="16" fill="#64748b"/>
  <rect x="60" y="180" width="520" height="14" rx="7" fill="#cbd5e1"/>
  <path d="M70 194 C 180 240, 300 120, 420 210 S 560 250, 590 200" stroke="#f8fafc" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M70 206 C 180 252, 300 132, 420 222 S 560 262, 590 212" stroke="#eab308" stroke-width="6" fill="none" stroke-linecap="round"/>
  <rect x="250" y="250" width="140" height="90" rx="8" fill="#1e3a8a"/>
  <text x="266" y="304" font-family="sans-serif" font-size="20" fill="#f8fafc">VVF 2.0</text>
  <circle cx="480" cy="290" r="34" fill="#f59e0b"/>
  <rect x="466" y="276" width="28" height="28" rx="4" fill="#0f172a"/>
  ${label("間仕切り壁内 通線")}
`,
);

/** 接地抵抗測定 */
export const PHOTO_EARTH = frame(
  `
  <rect x="0" y="250" width="640" height="110" fill="#78716c"/>
  <rect x="0" y="240" width="640" height="14" fill="#a8a29e"/>
  <rect x="120" y="120" width="200" height="140" rx="10" fill="#facc15"/>
  <rect x="140" y="140" width="160" height="60" rx="5" fill="#0f172a"/>
  <text x="156" y="184" font-family="sans-serif" font-size="30" fill="#4ade80">108 Ω</text>
  ${[0, 1, 2].map((i) => `<circle cx="${162 + i * 60}" cy="228" r="12" fill="#0f172a"/>`).join("")}
  <path d="M330 230 C 400 230, 420 250, 440 300" stroke="#16a34a" stroke-width="7" fill="none"/>
  <path d="M330 240 C 420 250, 470 260, 520 300" stroke="#dc2626" stroke-width="7" fill="none"/>
  <rect x="434" y="296" width="10" height="60" fill="#57534e"/>
  <rect x="514" y="296" width="10" height="60" fill="#57534e"/>
  ${label("接地抵抗測定 (E-P-C)")}
`,
);

/** ペンチ2丁の比較 */
export const PHOTO_TOOLS = frame(
  `
  <rect x="40" y="40" width="560" height="300" rx="14" fill="#f8fafc"/>
  <g transform="translate(120,90) rotate(-8)">
    <rect x="0" y="0" width="34" height="150" rx="14" fill="#dc2626"/>
    <rect x="46" y="0" width="34" height="150" rx="14" fill="#dc2626"/>
    <path d="M8 0 L 40 -70 L 72 0 Z" fill="#94a3b8"/>
    <circle cx="40" cy="-8" r="12" fill="#64748b"/>
  </g>
  <g transform="translate(380,90) rotate(6)">
    <rect x="0" y="0" width="34" height="150" rx="14" fill="#1e3a8a"/>
    <rect x="46" y="0" width="34" height="150" rx="14" fill="#1e3a8a"/>
    <path d="M8 0 L 40 -70 L 72 0 Z" fill="#cbd5e1"/>
    <circle cx="40" cy="-8" r="12" fill="#475569"/>
  </g>
  <text x="128" y="290" font-family="sans-serif" font-size="20" fill="#0f172a">A社 偏芯</text>
  <text x="392" y="290" font-family="sans-serif" font-size="20" fill="#0f172a">B社 標準</text>
  ${label("工具 現場比較")}
`,
  "#e2e8f0",
);

/** ケーブルラック */
export const PHOTO_RACK = frame(
  `
  <rect x="0" y="60" width="640" height="26" fill="#64748b"/>
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${30 + i * 90}" y="86" width="12" height="40" fill="#94a3b8"/>`).join("")}
  <rect x="20" y="126" width="600" height="18" rx="4" fill="#94a3b8"/>
  ${["#dc2626", "#0f172a", "#f8fafc", "#16a34a", "#f59e0b"]
    .map((c, i) => `<rect x="30" y="${150 + i * 26}" width="580" height="18" rx="9" fill="${c}"/>`)
    .join("")}
  <rect x="240" y="300" width="160" height="46" rx="6" fill="#1e3a8a"/>
  <text x="258" y="331" font-family="sans-serif" font-size="20" fill="#f8fafc">CVT 38sq</text>
  ${label("ケーブルラック 敷設")}
`,
);

/** 高所・照明器具 */
export const PHOTO_LIGHT = frame(
  `
  <rect x="0" y="0" width="640" height="120" fill="#334155"/>
  ${[0, 1, 2].map(
    (i) =>
      `<rect x="${90 + i * 180}" y="100" width="120" height="30" rx="6" fill="#e2e8f0"/>
       <path d="M${100 + i * 180} 130 L ${200 + i * 180} 130 L ${230 + i * 180} 300 L ${70 + i * 180} 300 Z" fill="#fde68a" opacity="0.45"/>`,
  ).join("")}
  <rect x="470" y="180" width="80" height="180" fill="#f59e0b"/>
  <rect x="486" y="180" width="12" height="180" fill="#b45309"/>
  ${[0, 1, 2].map((i) => `<rect x="470" y="${210 + i * 50}" width="80" height="10" fill="#b45309"/>`).join("")}
  ${label("LED 器具 更新")}
`,
  "#cbd5e1",
);

export const PHOTO_LIBRARY = [
  PHOTO_PANEL,
  PHOTO_CONDUIT,
  PHOTO_EARTH,
  PHOTO_TOOLS,
  PHOTO_RACK,
  PHOTO_LIGHT,
];

/**
 * 端末で選んだ画像を縮小して data URL 化する。
 * LocalStorage の容量制限に収まるよう長辺 900px / JPEG 品質 0.7 に丸める。
 */
export function fileToDataUrl(file: File, maxEdge = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onerror = () => resolve(src);
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } catch {
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
