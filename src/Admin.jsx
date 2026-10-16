import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LV, COL } from './data.js';
import * as XLSX from 'xlsx';
import { semua, hapusSemua, isAdmin, login, logout, onUpdate } from './store.js';

const tgl = () => new Date().toISOString().slice(0, 10);
const Bd = ({ v, l }) => <span className="bd" style={{ color: COL[l], borderColor: COL[l] }}>{v} · {LV[l]}</span>;

function Login({ onOk }) {
  const [u, setU] = useState(''), [p, setP] = useState(''), [err, setErr] = useState('');
  const go = async (e) => { e.preventDefault(); (await login(u, p)) ? onOk() : setErr('Email atau password salah'); };
  return (
    <div className="login">
      <form onSubmit={go}>
        <h1>Login Psikolog</h1>
        {err && <p style={{ color: '#dc2626' }}>{err}</p>}
        Username<input value={u} onChange={(e) => setU(e.target.value)} autoFocus />
        Password<input type="password" value={p} onChange={(e) => setP(e.target.value)} />
        <button>Masuk</button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [ok, setOk] = useState(null), [rows, setRows] = useState([]), [q, setQ] = useState('');
  const [st, setSt] = useState('Memuat…'), [hi, setHi] = useState(Infinity);
  const seen = useRef(null);

    const load = async () => {
    if (!(await isAdmin())) { setOk(false); return; }
    setOk(true);
    try {
      const r = await semua();
      setHi(seen.current === null ? Infinity : seen.current);
      seen.current = r[0] ? r[0].id : 0;
      setRows(r);
      setSt('Realtime · diperbarui ' + new Date().toLocaleTimeString('id-ID'));
    } catch { setSt('Gagal memuat data'); }
  };

  useEffect(() => onUpdate(load), []);

  if (ok === null) return <div className="w">Memuat…</div>;
  if (ok === false) return <Login onOk={load} />;

  const f = rows.filter((r) => r.nama.toLowerCase().includes(q.toLowerCase()));
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Makassar' });
  const head = ['No', 'Waktu', 'Nama', 'Usia', 'TTL', 'WhatsApp', 'Skor Depresi', 'Kriteria Depresi', 'Skor Cemas', 'Kriteria Cemas', 'Skor Stres', 'Kriteria Stres', 'Perhatian'];
  const line = (r) => [r.no, r.dibuat, r.nama, r.usia, r.ttl, r.wa, r.d, LV[r.ld], r.a, LV[r.la], r.s, LV[r.ls], r.flag == 1 ? 'Ya' : ''];

  const NM = ['Depresi', 'Kecemasan', 'Stres'];
  const rekap = ['d', 'a', 's'].map((k, i) => [NM[i], ...LV.map((_, l) => f.filter((r) => r['l' + k] === l).length)]);
  const perhatian = f.filter((r) => r.flag == 1).length;

  const xlsx = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([head, ...f.map(line)]);
    ws['!cols'] = head.map((h) => ({ wch: Math.max(h.length + 2, 14) }));
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Rekap Total DASS-42'], ['Total Peserta', f.length], ['Perlu Perhatian', perhatian], [], ['Dimensi', ...LV], ...rekap]), 'Rekap');
    XLSX.writeFile(wb, 'hasil-dass42-' + tgl() + '.xlsx');
  };
  const pdf = () => {
    const d = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    d.setFontSize(14); d.text('Rekap Hasil Skrining DASS-42', 40, 38);
    d.setFontSize(9); d.text('Dicetak: ' + new Date().toLocaleString('id-ID') + ' · Total ' + f.length + ' peserta · Bukan diagnosis klinis', 40, 54);
    autoTable(d, {
      startY: 66, head: [['Dimensi', ...LV]], body: rekap, styles: { fontSize: 9 }, headStyles: { fillColor: [33, 103, 63] },
      foot: [['Total peserta: ' + f.length + ' · Perlu perhatian: ' + perhatian, '', '', '', '', '']], footStyles: { fillColor: [232, 249, 239], textColor: [12, 54, 30] },
    });
    autoTable(d, {
      startY: d.lastAutoTable.finalY + 16,
      head: [['No', 'Waktu', 'Nama', 'Usia', 'TTL', 'WhatsApp', 'Depresi', 'Kecemasan', 'Stres', 'Perhatian']],
      body: f.map((r) => [r.no, r.dibuat, r.nama, r.usia, r.ttl, r.wa, `${r.d} (${LV[r.ld]})`, `${r.a} (${LV[r.la]})`, `${r.s} (${LV[r.ls]})`, r.flag == 1 ? 'YA' : '']),
      styles: { fontSize: 8 }, headStyles: { fillColor: [33, 103, 63] },
      didParseCell: (h) => { if (h.section === 'body' && h.column.index === 9 && h.cell.raw === 'YA') { h.cell.styles.textColor = [200, 0, 0]; h.cell.styles.fontStyle = 'bold'; } },
    });
    d.save('hasil-dass42-' + tgl() + '.pdf');
  };
  const keluar = async () => { await logout(); setOk(false); };
  const hapus = async () => {
  if (confirm('Hapus SEMUA data di database? Unduh Excel dulu bila perlu.')) { await hapusSemua(); load(); }
  };

  return (
    <div className="w">
      <div className="top">
        <div><h1>Dashboard Hasil DASS-42</h1><span className="live"><i></i><span>{st}</span></span></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={xlsx}>Unduh Excel</button>
          <button onClick={pdf}>Unduh PDF</button>
          <button className="sec" onClick={hapus}>Hapus Semua</button>
          <button className="sec" onClick={keluar}>Keluar</button>
        </div>
      </div>
      <div className="stats">
        <div className="st1"><small>Total Peserta</small><b>{rows.length}</b></div>
        <div className="st1"><small>Masuk Hari Ini</small><b>{rows.filter((r) => r.dibuat.slice(0, 10) === today).length}</b></div>
        <div className="st1 w"><small>⚠ Perlu Perhatian</small><b>{rows.filter((r) => r.flag == 1).length}</b></div>
      </div>
      <div className="rk">
        {rekap.map((r) => (
          <div key={r[0]}><h3>{r[0]} · rekap total</h3>
            <div className="ch">{LV.map((l, i) => <span key={l} style={{ color: COL[i] }}>{l}<b>{r[i + 1]}</b></span>)}</div>
          </div>
        ))}
      </div>
      <p style={{ color: '#4d6657', fontSize: '.85rem', margin: '4px 0' }}><span className="fl">⚠ Perhatian</span> = menjawab "Sering/Selalu" pada soal 21 atau 38 (hidup tidak berharga/berarti); mohon ditindaklanjuti.</p>
      <div className="tw"><table>
        <thead><tr><th>#</th><th>Waktu</th><th>Nama</th><th>Usia</th><th>TTL</th><th>WhatsApp</th><th>Depresi</th><th>Kecemasan</th><th>Stres</th><th></th></tr></thead>
        <tbody>
          {f.length === 0 && <tr><td colSpan={10} style={{ textAlign: 'center', color: '#6b6891' }}>Belum ada data</td></tr>}
          {f.map((r) => (
            <tr key={r.id} className={r.id > hi ? 'new' : ''}>
              <td>{r.no}</td><td>{r.dibuat}</td><td><b>{r.nama}</b></td><td>{r.usia}</td><td>{r.ttl}</td><td>{r.wa}</td>
              <td><Bd v={r.d} l={r.ld} /></td><td><Bd v={r.a} l={r.la} /></td><td><Bd v={r.s} l={r.ls} /></td>
              <td>{r.flag == 1 && <span className="fl">⚠ Perhatian</span>}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}
