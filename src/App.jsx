import { useState, useEffect } from 'react';
import { Q, OPT, LV, COL, REFS, TITLE, REC } from './data.js';
import { pdfHasil } from './pdf.js';
import { simpan } from './store.js';
import './dialog.css';

const KOSONG = { nama: '', usia: '', ttl: '', wa: '' };

function Dialog({ judul, pesan, onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="ov" onClick={onClose}>
      <div className="dlg" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="ic">!</div>
        <h3>{judul}</h3>
        <p>{pesan}</p>
        <button autoFocus onClick={onClose}>Mengerti</button>
      </div>
    </div>
  );
}

function Result({ j, p }) {
  return (
    <div>
      <h1>Hasil Skrining Anda</h1>
      <p className="mut">Terima kasih, {p.nama}. Hasil Anda sudah tersimpan.</p>
      <div className="cards">
        {['d', 'a', 's'].map((k) => {
          const l = j['l' + k], c = COL[l], nm = REFS[k][0];
          return (
            <div key={k} className="rc" style={{ '--c': c }}>
              <h3>{TITLE[k][0]}</h3>
              <p className="mut">{TITLE[k][1]}</p>
              <div className="sc"><small>SKOR {nm.toUpperCase()}</small><b>{j[k]}</b><span className="pill">{LV[l]}</span></div>
              <div className="rec"><b>REKOMENDASI {nm.toUpperCase()}:</b><br />{REC[l]()}</div>
              <div className="ref">
                <b style={{ color: '#389a62' }}>Rujukan Nilai {nm}:</b>
                {REFS[k][1].split('|').map((t, i) => (
                  <div key={i} className={i === l ? 'on' : ''} style={i === l ? { '--c': c } : null}><span>• {t}</span><span>{LV[i]}</span></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ margin: '18px 0', textAlign: 'center' }}><button onClick={() => pdfHasil(j, p)}>⬇ Unduh Hasil (PDF)</button></div>
      <div className="box warn mut">Hasil ini hanya skrining awal, bukan diagnosis. Jika Anda merasa tidak nyaman atau butuh teman bicara, temui psikolog.</div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(1);
  const [f, setF] = useState(KOSONG);
  const [ans, setAns] = useState(Array(42).fill(null));
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [open, setOpen] = useState(false);
  const [dlg, setDlg] = useState(null);
  const done = ans.filter((v) => v !== null).length;

  const notif = (pesan, judul = 'Perhatian') => setDlg({ judul, pesan });
  const tutup = () => setDlg(null);

  const set = (i, v) => { setAns((a) => { const b = [...a]; b[i] = v; return b; }); if (err === i) setErr(null); };
  const go = (p) => { setPage(p); window.scrollTo(0, 0); };
  const miss = (a, b) => {
    for (let i = a; i < b; i++) if (ans[i] === null) {
      setErr(i);
      document.getElementById('q' + i)?.scrollIntoView({ block: 'center' });
      notif(`Masih ada soal yang belum dijawab (soal ${i + 1}).`, 'Soal Belum Lengkap');
      return true;
    }
    return false;
  };
  const next = () => {
    if (!f.nama.trim()) { notif('Nama wajib diisi.', 'Data Belum Lengkap'); return; }
    if (!miss(0, 21)) go(2);
  };
  const submit = () => {
    if (miss(21, 42)) return;
    setBusy(true);
    try { setRes(simpan(f, ans)); window.scrollTo(0, 0); }
    catch (e) { notif('Gagal menyimpan: ' + e.message, 'Terjadi Kesalahan'); setBusy(false); }
  };

  const field = (k, label, ph, extra) => (
    <label className="f">{label}
      <input type="text" maxLength={100} value={f[k]} placeholder={ph} onChange={(e) => setF({ ...f, [k]: e.target.value })} {...extra} />
    </label>
  );
  const list = (from) => Array.from({ length: 21 }, (_, k) => from + k).map((i) => (
    <div key={i} id={'q' + i} className={'q' + (err === i ? ' err' : ans[i] !== null ? ' done' : '')}>
      <div className="qh"><span className="no">{i + 1}</span><b>{Q[i]}</b></div>
      <div className="opts">
        {OPT.map((o, v) => (
          <label key={v}><input type="radio" name={'r' + i} checked={ans[i] === v} onChange={() => set(i, v)} /><span>{o}</span></label>
        ))}
      </div>
    </div>
  ));

  return (
    <div className="wrap">
      {!res && (
        <div>
          <div className="hero">
            <h1>Skrining Kesehatan Mental</h1>
            <div className="sub">DEPRESSION ANXIETY STRESS SCALE · DASS-42</div>
            <div className="mut">Kenali kondisi stres, cemas, dan depresi Anda</div>
          </div>
          <div className={'card' + (open ? ' open' : '')}>
            <div className="intro">
              <svg viewBox="0 0 200 150">
                <rect x="8" y="10" width="184" height="130" rx="16" fill="#e8f9ef" />
                <rect x="28" y="30" width="30" height="8" rx="4" fill="#a9dcc0" />
                <rect x="28" y="52" width="110" height="10" rx="5" fill="#10b981" />
                <rect x="28" y="72" width="70" height="10" rx="5" fill="#f97316" />
                <rect x="28" y="92" width="90" height="10" rx="5" fill="#389a62" />
                <circle cx="150" cy="104" r="24" fill="#fff" stroke="#389a62" strokeWidth="4" />
                <circle cx="142" cy="98" r="3" fill="#389a62" /><circle cx="158" cy="98" r="3" fill="#389a62" />
                <path d="M140 110q10 9 20 0" stroke="#389a62" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <h3 style={{ margin: '0 0 8px' }}>Apa itu DASS-42?</h3>
                <p>DASS-42 (<i>Depression Anxiety Stress Scales</i>) adalah alat skrining mandiri yang dirancang untuk mengukur tingkat emosi negatif pada tiga area utama: <b>Depresi, Kecemasan (Anxiety), dan Stres</b>.</p>
                <div className="more">
                  <p>Hasil tes ini <b>bukan merupakan diagnosis klinis</b> dan tidak dapat menggantikan evaluasi profesional dari psikolog atau psikiater. Hasil skrining ini berfungsi sebagai langkah awal untuk mengenali indikasi distres atau tekanan emosional yang berpotensi memicu masalah kesehatan mental, sehingga Anda dapat mengambil langkah pencegahan atau penanganan yang tepat lebih dini.</p>
                  <p className="mut src">Referensi: Lovibond, S.H. &amp; Lovibond, P.F. (1995). <i>Manual for the Depression Anxiety Stress Scales</i> (2nd ed.). Sydney: Psychology Foundation.</p>
                </div>
                <button className="tg" onClick={() => setOpen(!open)}>{open ? 'Tutup selengkapnya ▲' : 'Baca selengkapnya ▼'}</button>
              </div>
            </div>
          </div>
          <div className="guide">
            <h3>ⓘ Petunjuk Pengisian</h3>
            <ol>
              <li>Pilihlah jawaban yang paling menggambarkan kondisi fisik dan emosional yang Anda rasakan atau alami sepanjang <b>1 minggu terakhir</b>.</li>
              <li>Semakin jujur Anda menilai diri sendiri, semakin akurat hasil skrining ini dalam menggambarkan kondisi Anda saat ini.</li>
              <li>Periksa kembali jawaban Anda dan pastikan seluruh 42 pernyataan telah dijawab tanpa ada yang terlewat atau dikosongkan.</li>
              <li>Setelah semua pernyataan terisi, tekan tombol <b>"Cek Hasil Tes"</b> untuk melihat ringkasan kondisi Anda.</li>
            </ol>
          </div>
        </div>
      )}

      <div className="sticky">
        <div className="bar"><i style={{ width: (res ? 100 : (done / 42) * 100) + '%' }} /></div>
        {!res && <p className="mut" id="pl">Halaman {page} dari 2 · soal {page === 1 ? '1–21' : '22–42'}</p>}
      </div>

      {res ? <Result j={res} p={f} /> : page === 1 ? (
        <div>
          <div className="card">
            <h3 style={{ margin: '0 0 14px' }}>👤 Data Diri</h3>
            <div className="g2">
              {field('nama', 'Nama *', 'Nama lengkap')}
              {field('usia', 'Usia', 'Contoh: 16', { inputMode: 'numeric', maxLength: 3 })}
              {field('ttl', 'Tempat, Tanggal Lahir', 'Makassar, 12 Mei 2010')}
              {field('wa', 'Kontak No. WA (WhatsApp yang aktif)', '08xxxxxxxxxx', { type: 'tel', maxLength: 20 })}
            </div>
          </div>
          <div className="sect">Pertanyaan Asesmen</div>
          {list(0)}
          <div className="nav"><span /><button onClick={next}>Lanjut ke Halaman 2 →</button></div>
        </div>
      ) : (
        <div>
          <div className="sect">Pertanyaan Asesmen (lanjutan)</div>
          {list(21)}
          <div className="nav">
            <button className="sec" onClick={() => go(1)}>← Kembali</button>
            <button disabled={busy} onClick={submit}>{busy ? 'Menyimpan...' : 'Cek Hasil Tes'}</button>
          </div>
        </div>
      )}

      {dlg && <Dialog judul={dlg.judul} pesan={dlg.pesan} onClose={tutup} />}
    </div>
  );
}