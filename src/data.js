// Dihasilkan dari config.php & index.php versi PHP
export const Q = [
 "Menjadi marah karena hal-hal kecil/sepele",
 "Mulut terasa kering",
 "Tidak dapat melihat hal yang positif dari suatu kejadian",
 "Merasakan gangguan dalam bernapas (napas cepat, sulit bernapas)",
 "Merasa sepertinya tidak kuat lagi untuk melakukan suatu kegiatan",
 "Cenderung bereaksi berlebihan pada situasi",
 "Kelemahan pada anggota tubuh",
 "Kesulitan untuk relaksasi/bersantai",
 "Cemas yang berlebihan dalam suatu situasi namun bisa lega jika hal/situasi itu berakhir",
 "Pesimis",
 "Mudah merasa kesal",
 "Merasa banyak menghabiskan energi karena cemas",
 "Merasa sedih dan depresi",
 "Tidak sabaran",
 "Kelelahan",
 "Kehilangan minat pada banyak hal (misal: makan, ambulasi, sosialisasi)",
 "Merasa diri tidak layak",
 "Mudah tersinggung",
 "Berkeringat (misal: tangan berkeringat) tanpa stimulasi oleh cuaca maupun latihan fisik",
 "Ketakutan tanpa alasan yang jelas",
 "Merasa hidup tidak berharga",
 "Sulit untuk beristirahat",
 "Kesulitan dalam menelan",
 "Tidak dapat menikmati hal-hal yang saya lakukan",
 "Perubahan kegiatan jantung dan denyut nadi tanpa stimulasi oleh latihan fisik",
 "Merasa hilang harapan dan putus asa",
 "Mudah marah",
 "Mudah panik",
 "Kesulitan untuk tenang setelah sesuatu yang mengganggu",
 "Takut diri terhambat oleh tugas-tugas yang tidak biasa dilakukan",
 "Sulit untuk antusias pada banyak hal",
 "Sulit mentoleransi gangguan-gangguan terhadap hal yang sedang dilakukan",
 "Berada pada keadaan tegang",
 "Merasa tidak berharga",
 "Tidak dapat memaklumi hal apapun yang menghalangi anda untuk menyelesaikan hal yang sedang Anda lakukan",
 "Ketakutan",
 "Tidak ada harapan untuk masa depan",
 "Merasa hidup tidak berarti",
 "Mudah gelisah",
 "Khawatir dengan situasi saat diri Anda mungkin menjadi panik dan mempermalukan diri sendiri",
 "Gemetar",
 "Sulit untuk meningkatkan inisiatif dalam melakukan sesuatu"
];
export const OPT=['Tidak pernah','Kadang-kadang','Sering','Selalu'];
export const LV=['Normal','Ringan','Sedang','Berat','Sangat Berat'];
export const COL=['#10b981','#65a30d','#f97316','#ef4444','#be123c'];
export const REFS={d:['Depresi','0 - 9|10 - 13|14 - 20|21 - 27|>= 28'],a:['Cemas','0 - 7|8 - 9|10 - 14|15 - 19|>= 20'],s:['Stres','0 - 14|15 - 18|19 - 25|26 - 33|>= 34']};
export const TITLE={d:['Depresi (Depression)','Gejala suasana hati muram dan kehilangan minat.'],a:['Kecemasan (Anxiety)','Respon fisiologis tubuh terhadap rasa takut.'],s:['Stres (Stress)','Keadaan tegang, lelah mental, & sulit rileks.']};
export const REC=[l=>'Tidak ada gejala signifikan, tetap jaga kesehatan emosional Anda.',
 l=>'Terdeteksi gejala ringan. Jaga pola tidur, aktivitas, dan ceritakan perasaan Anda kepada orang yang dipercaya.',
 l=>'Terdeteksi gejala sedang. Batasi pemicu stres dan diskusikan dengan psikolog.',
 l=>'Terdeteksi gejala berat. Sangat disarankan segera berkonsultasi dengan psikolog.',
 l=>'Terdeteksi gejala sangat berat. Mohon segera temui psikolog atau psikiater untuk pendampingan.'];
let LAST=null;
export const RGB=[[16,185,129],[101,163,13],[249,115,22],[239,68,68],[190,18,60]];
export const SHORT={d:['Depresi','Gejala suasana emosi muram.'],a:['Kecemasan','Respon tubuh terhadap takut.'],s:['Stres','Tegang mental & sulit rileks.']};
export const SUB={
 d:[3,5,10,13,16,17,21,24,26,31,34,37,38,42],
 a:[2,4,7,9,15,19,20,23,25,28,30,36,40,41],
 s:[1,6,8,11,12,14,18,22,27,29,32,33,35,39]};
// batas atas tiap level: Normal, Ringan, Sedang, Berat (di atasnya = Sangat Berat)
export const CUT={d:[9,13,20,27],a:[7,9,14,19],s:[14,18,25,33]};
