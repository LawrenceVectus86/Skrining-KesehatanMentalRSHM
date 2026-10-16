// Penyimpanan data via cookie (tanpa PHP/database). 1 hasil = 1 cookie "dass_<id>".
import { SUB, CUT } from './data.js';

// ====== GANTI USERNAME & PASSWORD PSIKOLOG DI SINI ======
// Catatan: ini hanya pembatas tampilan; kode JS bisa dibaca siapa pun.
const ADMIN_USER = 'brigitta';
const ADMIN_PASS = 'admin123';
// ========================================================

const P = 'dass_';
const MAX = 7000; // batas aman total ukuran cookie (header cookie umumnya dibatasi ~8KB)

const setC = (n, v, age) => { document.cookie = `${n}=${v};path=/;SameSite=Lax` + (age === undefined ? '' : `;max-age=${age}`); };
const getAll = () => Object.fromEntries(document.cookie.split('; ').filter(Boolean).map((c) => { const i = c.indexOf('='); return [c.slice(0, i), c.slice(i + 1)]; }));
const cut = (s, n) => String(s || '').trim().slice(0, n);

export const level = (k, v) => CUT[k].filter((c) => v > c).length;

export function skor(ans) {
  const sc = {};
  for (const k in SUB) sc[k] = SUB[k].reduce((t, n) => t + ans[n - 1], 0);
  return { ...sc, ld: level('d', sc.d), la: level('a', sc.a), ls: level('s', sc.s), flag: ans[20] >= 2 || ans[37] >= 2 ? 1 : 0 }; // soal 21 & 38
}

export function simpan(f, ans) {
  if (!cut(f.nama, 100)) throw new Error('Nama wajib diisi');
  if (ans.length !== 42 || ans.some((v) => ![0, 1, 2, 3].includes(v))) throw new Error('Semua 42 soal harus dijawab');
  const id = Date.now().toString(36);
  const val = [id, ...[cut(f.nama, 100), cut(f.usia, 3), cut(f.ttl, 100), cut(f.wa, 20)].map(encodeURIComponent), ans.join('')].join('|');
  if (document.cookie.length + P.length + val.length + 2 > MAX) throw new Error('Penyimpanan cookie browser penuh. Unduh CSV lalu hapus data lama di dashboard.');
  setC(P + id, val, 31536000); // 1 tahun
  try { const bc = new BroadcastChannel('dass'); bc.postMessage('baru'); bc.close(); } catch {} // beri tahu tab dashboard
  return skor(ans);
}

export function semua() {
  const rows = Object.entries(getAll()).filter(([k]) => k.startsWith(P)).map(([, v]) => {
    const [id, nama, usia, ttl, wa, a] = v.split('|');
    const ans = (a || '').split('').map(Number);
    if (ans.length !== 42) return null;
    const ms = parseInt(id, 36);
    return { id: ms, dibuat: new Date(ms).toLocaleString('sv-SE', { timeZone: 'Asia/Makassar' }), nama: decodeURIComponent(nama), usia: decodeURIComponent(usia), ttl: decodeURIComponent(ttl), wa: decodeURIComponent(wa), ...skor(ans) };
  }).filter(Boolean).sort((x, y) => y.id - x.id);
  return rows.map((r, i) => ({ ...r, no: rows.length - i }));
}

export const hapusSemua = () => Object.keys(getAll()).filter((k) => k.startsWith(P)).forEach((k) => setC(k, '', 0));

export const isAdmin = () => getAll().dass_admin === '1';
export const login = (u, p) => { if (u === ADMIN_USER && p === ADMIN_PASS) { setC('dass_admin', '1'); return true; } return false; }; // cookie sesi
export const logout = () => setC('dass_admin', '', 0);

// Realtime: BroadcastChannel (instan antar-tab) + cek cookie berkala. cb dipanggil saat ada perubahan.
export function onUpdate(cb) {
  let last = document.cookie, bc = null;
  try { bc = new BroadcastChannel('dass'); bc.onmessage = () => { last = document.cookie; cb(); }; } catch {}
  cb();
  const t = setInterval(() => { if (document.cookie !== last) { last = document.cookie; cb(); } }, 1500);
  return () => { clearInterval(t); bc && bc.close(); };
}
