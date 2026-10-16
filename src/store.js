// Penyimpanan data via Supabase (database online, bisa diakses dari semua perangkat).
import { createClient } from '@supabase/supabase-js';
import { SUB, CUT } from './data.js';

const sb = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const cut = (s, n) => String(s || '').trim().slice(0, n);

export const level = (k, v) => CUT[k].filter((c) => v > c).length;

export function skor(ans) {
  const sc = {};
  for (const k in SUB) sc[k] = SUB[k].reduce((t, n) => t + ans[n - 1], 0);
  return { ...sc, ld: level('d', sc.d), la: level('a', sc.a), ls: level('s', sc.s), flag: ans[20] >= 2 || ans[37] >= 2 ? 1 : 0 }; // soal 21 & 38
}

// Responden: hanya mengirim data (tidak bisa membaca data orang lain).
export async function simpan(f, ans) {
  if (!cut(f.nama, 100)) throw new Error('Nama wajib diisi');
  if (ans.length !== 42 || ans.some((v) => ![0, 1, 2, 3].includes(v))) throw new Error('Semua 42 soal harus dijawab');
  const { error } = await sb.from('hasil').insert({
    nama: cut(f.nama, 100),
    usia: cut(f.usia, 3),
    ttl: cut(f.ttl, 100),
    wa: cut(f.wa, 20),
    jawaban: ans.join(''),
  });
  if (error) throw new Error('Data gagal dikirim. Periksa koneksi internet lalu coba lagi.');
  return skor(ans);
}

// Admin: hanya berhasil jika sudah login (diatur oleh RLS di Supabase).
export async function semua() {
  const { data, error } = await sb.from('hasil').select('*').order('dibuat', { ascending: false });
  if (error) throw error;
  const rows = data.map((r) => {
    const ans = r.jawaban.split('').map(Number);
    const ms = new Date(r.dibuat).getTime();
    return {
      id: ms,
      uid: r.id,
      dibuat: new Date(r.dibuat).toLocaleString('sv-SE', { timeZone: 'Asia/Makassar' }),
      nama: r.nama,
      usia: r.usia,
      ttl: r.ttl,
      wa: r.wa,
      ...skor(ans),
    };
  });
  return rows.map((r, i) => ({ ...r, no: rows.length - i }));
}

export async function hapusSemua() {
  const { error } = await sb.from('hasil').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}

export async function isAdmin() {
  const { data } = await sb.auth.getSession();
  return !!data.session;
}

// Username diganti email akun admin yang dibuat di Supabase.
export async function login(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  return !error;
}

export async function logout() {
  await sb.auth.signOut();
}

// Realtime: langganan perubahan tabel + cek ulang berkala sebagai cadangan.
export function onUpdate(cb) {
  cb();
  const ch = sb
    .channel('hasil-baru')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'hasil' }, () => cb())
    .subscribe();
  const t = setInterval(cb, 15000);
  return () => { clearInterval(t); sb.removeChannel(ch); };
}