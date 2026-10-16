import { jsPDF } from 'jspdf';
import QR_TTD from './ttdmami.png?inline';
import { LV, REC, REFS, RGB, SHORT } from './data.js';

// ====== DATA PSIKOLOG (tanda tangan) ======
const TTD_NAMA = 'Brigitta Tungawi, S.Psi., M.Psi., Psikolog';
const TTD_SIPPK = 'SIPPK : 440/26095/Rek.PK/DKK/II/2026';
// ==========================================

export function pdfHasil(j,p){
 const D=new jsPDF({unit:'pt',format:'a4'}),P=[33,103,63],G=[77,102,87],K=[12,54,30],L=[227,230,234];
 const tx=(t,x,y,o={})=>{D.setFont(o.f||'helvetica',o.s||'normal');D.setFontSize(o.z||9);D.setTextColor(...(o.c||K));D.text(t,x,y,{align:o.a||'left'})};
 const S=38; // seluruh konten bawah digeser ke atas agar muat blok tanda tangan
 tx('Skrining Kesehatan Mental Online',40,56,{z:18,s:'bold',c:G});
 D.setDrawColor(...L);D.line(40,76,555,76);
 tx('HASIL PSIKOTES',297.5,115,{z:22,s:'bold',a:'center'});
 tx('Self Assessment | Depression Anxiety Stress Scale (DASS-42)',297.5,131,{z:9,s:'italic',c:G,a:'center'});
 tx('Data Peserta',40,170,{z:13,s:'bold',c:P});D.line(40,177,555,177);
 const tgl=new Date().toLocaleString('id-ID',{timeZone:'Asia/Makassar',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' WITA';
 [['Tanggal',tgl],['Nama',p.nama],['Usia',p.usia],['Tempat, Tanggal Lahir',p.ttl]].forEach((r,i)=>{const y=198+i*16;tx(r[0],45,y,{s:'bold',c:P});tx(':',160,y);tx(r[1]||'-',172,y)});
 D.setFillColor(232,249,239);D.setDrawColor(190,232,208);D.roundedRect(170,297-S,255,22,11,11,'FD');
 tx('DEPRESSION ANXIETY STRESS SCALE (DASS-42)',297.5,311-S,{z:8,s:'bold',c:[33,103,63],a:'center'});
 const W=160,H=290,Y=335-S;
 ['d','a','s'].forEach((k,n)=>{const x=45+n*172,l=j['l'+k],c=RGB[l],tint=c.map(v=>Math.round(v*.1+255*.9));
  D.setFillColor(255,255,255);D.setDrawColor(...L);D.roundedRect(x,Y,W,H,8,8,'FD');
  D.setFillColor(...c);D.rect(x+4,Y,W-8,3,'F');
  tx(SHORT[k][0],x+14,Y+28,{z:12,s:'bold'});tx(SHORT[k][1],x+14,Y+41,{z:7.5,c:G});
  D.setFillColor(...tint);D.setDrawColor(...c);D.roundedRect(x+12,Y+56,W-24,72,6,6,'FD');
  tx('SKOR ANDA',x+W/2,Y+72,{z:7,s:'bold',c:G,a:'center'});
  tx(String(j[k]),x+W/2,Y+102,{z:28,f:'times',s:'bold',c:c,a:'center'});
  D.roundedRect(x+W/2-30,Y+108,60,14,4,4,'FD');tx(LV[l],x+W/2,Y+118,{z:8,s:'bold',c:c,a:'center'});
  D.setFillColor(246,252,248);D.setDrawColor(...L);D.roundedRect(x+12,Y+138,W-24,66,6,6,'FD');
  tx('REKOMENDASI:',x+20,Y+151,{z:7,s:'bold'});tx(D.splitTextToSize(REC[l](),W-40),x+20,Y+162,{z:7.5,c:G});
  tx('Rujukan Nilai:',x+14,Y+222,{z:7.5,s:'bold',c:P});
  REFS[k][1].split('|').forEach((t,i)=>{const y=Y+236+i*12,on=i==l,cc=on?c:G,st=on?'bold':'normal';tx('• '+t,x+14,y,{z:7.5,s:st,c:cc});tx(LV[i],x+W-14,y,{z:7.5,s:st,c:cc,a:'right'})});
 });
 D.setFillColor(246,252,248);D.setDrawColor(...L);D.roundedRect(45,640-S,505,100,8,8,'FD');
 tx('GRAFIK PERBANDINGAN DIMENSI DASS',60,659-S,{z:9,s:'bold',c:G});D.line(45,667-S,550,667-S);
 ['d','a','s'].forEach((k,i)=>{const y=685-S+i*20,c=RGB[j['l'+k]];tx(['Depresi (Depression)','Kecemasan (Anxiety)','Stres (Stress)'][i],60,y+3,{z:8.5,s:'bold'});
  D.setFillColor(241,242,244);D.setDrawColor(...L);D.rect(220,y-6,230,12,'FD');D.setFillColor(...c);D.rect(220,y-6,Math.max(230*j[k]/42,0.1),12,'F');tx(j[k]+' / 42',535,y+3,{z:8.5,s:'bold',a:'right'})});

 // ====== Garis pemisah ======
 D.setDrawColor(...P);D.line(40,752-S,555,752-S);

 // ====== Disclaimer (kolom kiri) ======
 tx('Disclaimer:',45,727,{z:9,s:'bold'});
 D.setFont('helvetica','normal');D.setFontSize(7.5);
 let by=739;
 ['Hasil ini merupakan skrining awal, bukan diagnosis klinis.','Hasil dapat dibaca oleh psikolog atau tenaga kesehatan yang terlatih.','Demi menjaga kerahasiaan, disarankan tidak mengunggah hasil ke media sosial.'].forEach((t)=>{
  const ls=D.splitTextToSize('•  '+t,300);
  tx(ls,50,by,{z:7.5});
  by+=ls.length*9.5;
 });

 // ====== Tanda tangan digital (kolom kanan): QR + nama + SIPPK ======
 const cx=460;
 tx('Ditandatangani secara digital oleh,',cx,726,{z:7.5,c:G,a:'center'});
 const q=54,x0=cx-q/2,y0=731; // ukuran QR (pt); ubah q untuk memperbesar/memperkecil
 D.setFillColor(255,255,255);D.setDrawColor(...L);D.rect(x0-4,y0-4,q+8,q+8,'FD');
 D.addImage(QR_TTD,'PNG',x0,y0,q,q);
 tx(TTD_NAMA,cx,800,{z:7.5,s:'bold',a:'center'});
 tx(TTD_SIPPK,cx,809,{z:7,c:G,a:'center'});

 // ====== Footer ======
 D.setFillColor(33,103,63);D.rect(40,814,515,24,'F');tx('Skrining Kesehatan Mental Online · DASS-42',297.5,829,{z:9,c:[255,255,255],a:'center'});
 D.save('hasil-dass42-'+(p.nama.trim().replace(/[^\w]+/g,'-')||'peserta')+'.pdf')}