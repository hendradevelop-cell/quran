export const OBLIGATORY_PRAYERS = [
  { name: 'Subuh', arabic: 'الفجر', rakah: '2 rakaat', time: 'Sejak terbit fajar hingga sebelum matahari terbit.' },
  { name: 'Zuhur', arabic: 'الظهر', rakah: '4 rakaat', time: 'Setelah matahari tergelincir hingga masuk waktu Asar.' },
  { name: 'Asar', arabic: 'العصر', rakah: '4 rakaat', time: 'Sore hari hingga sebelum matahari terbenam.' },
  { name: 'Magrib', arabic: 'المغرب', rakah: '3 rakaat', time: 'Sejak matahari terbenam hingga hilangnya cahaya merah di ufuk.' },
  { name: 'Isya', arabic: 'العشاء', rakah: '4 rakaat', time: 'Setelah hilangnya cahaya merah hingga tengah malam; batas waktunya dibahas berbeda dalam fikih.' },
];

export const SUNNAH_PRAYERS = [
  {
    name: 'Rawatib',
    arabic: 'الرواتب',
    time: 'Mengiringi shalat fardu, sebelum atau sesudahnya.',
    rakah: 'Di antaranya 2 sebelum Subuh, 2 setelah Zuhur, 2 setelah Magrib, dan 2 setelah Isya. Ada riwayat dan praktik dengan jumlah lain.',
    source: 'Sahih Muslim 728',
  },
  {
    name: 'Witir',
    arabic: 'الوتر',
    time: 'Sesudah Isya hingga sebelum masuk Subuh.',
    rakah: 'Bilangan rakaat ganjil; cara pelaksanaan dan jumlahnya beragam dalam riwayat serta mazhab.',
    source: 'Sahih al-Bukhari 990; Sahih Muslim 749',
  },
  {
    name: 'Dhuha',
    arabic: 'الضحى',
    time: 'Setelah matahari terbit dan meninggi hingga menjelang Zuhur.',
    rakah: 'Paling sedikit 2 rakaat; terdapat variasi jumlah dalam riwayat.',
    source: 'Sahih Muslim 720',
  },
  {
    name: 'Tahajud',
    arabic: 'التهجد',
    time: 'Shalat malam setelah Isya; tahajud secara khusus lazim dipahami setelah tidur.',
    rakah: 'Dikerjakan dua rakaat demi dua rakaat; dapat ditutup dengan Witir.',
    source: 'Sahih al-Bukhari 990; Sahih Muslim 749',
  },
  {
    name: 'Tarawih',
    arabic: 'التراويح',
    time: 'Pada malam Ramadan setelah Isya.',
    rakah: 'Dilaksanakan berjamaah atau sendiri; jumlah rakaat memiliki praktik yang beragam di kalangan umat Islam.',
    source: 'Sahih al-Bukhari 2009; Sahih Muslim 759',
  },
  {
    name: 'Tahiyyatul masjid',
    arabic: 'تحية المسجد',
    time: 'Saat masuk masjid sebelum duduk, selama bukan waktu terlarang menurut fikih yang diikuti.',
    rakah: '2 rakaat.',
    source: 'Sahih al-Bukhari 444; Sahih Muslim 714',
  },
  {
    name: 'Istikharah',
    arabic: 'الاستخارة',
    time: 'Ketika memohon pilihan terbaik dalam perkara yang dibolehkan.',
    rakah: '2 rakaat, lalu membaca doa istikharah.',
    source: 'Sahih al-Bukhari 1166',
  },
];

export const SALAH_STEPS = [
  {
    title: '1. Persiapan dan niat',
    body: 'Pastikan waktu shalat telah masuk, bersuci, menutup aurat, dan menghadap kiblat. Niatkan shalat tertentu di dalam hati. Melafalkan niat bukan syarat yang disepakati; ikuti tuntunan yang Anda pelajari.',
  },
  {
    title: '2. Takbiratul ihram',
    body: 'Berdiri bagi yang mampu, lalu ucapkan “Allahu akbar” untuk memulai shalat. Mengangkat tangan pada takbir memiliki beberapa cara yang diriwayatkan.',
  },
  {
    title: '3. Berdiri dan membaca',
    body: 'Letakkan tangan dengan cara yang diajarkan dalam mazhab yang diikuti. Baca doa pembuka (sunnah), isti’adzah, Al-Fatihah, lalu ayat atau surah Al-Qur’an pada rakaat pertama dan kedua. Bacaan basmalah dan bacaan makmum di belakang imam memiliki perbedaan fikih.',
  },
  {
    title: '4. Rukuk dan i’tidal',
    body: 'Bertakbir dan rukuk dengan tenang, membaca tasbih rukuk, lalu bangkit hingga berdiri tegak sambil membaca “Sami’allahu liman hamidah” dan “Rabbana wa lakal hamd” sesuai tuntunan shalat sendiri atau berjamaah.',
  },
  {
    title: '5. Sujud pertama dan duduk di antara dua sujud',
    body: 'Bertakbir, sujud dengan anggota sujud, membaca tasbih sujud, lalu bertakbir untuk duduk dengan tenang. Berdoalah di antara dua sujud, kemudian sujud kembali.',
  },
  {
    title: '6. Rakaat berikutnya',
    body: 'Bangkit untuk rakaat selanjutnya dan ulangi bacaan serta gerakan. Pada shalat 3 atau 4 rakaat, duduk tasyahud awal setelah rakaat kedua. Rakaat ketiga dan keempat umumnya membaca Al-Fatihah; rincian bacaan berbeda menurut shalat dan mazhab.',
  },
  {
    title: '7. Tasyahud akhir dan salam',
    body: 'Pada rakaat terakhir, duduk untuk tasyahud akhir, membaca tasyahud dan shalawat Nabi, serta doa sebelum salam. Akhiri dengan salam. Bentuk duduk, isyarat jari, dan jumlah salam memiliki variasi yang dikenal dalam fikih.',
  },
];

export const AFTER_PRAYER_DHIKR = [
  {
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    latin: 'Astaghfirullah.',
    translation: 'Aku memohon ampun kepada Allah.',
    note: 'Dibaca tiga kali setelah salam.',
  },
  {
    arabic: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    latin: 'Allahumma antas-salaam wa minkas-salaam, tabaarakta yaa dzal-jalaali wal-ikraam.',
    translation: 'Ya Allah, Engkaulah Yang Maha Sejahtera, dari-Mu kesejahteraan, Mahaberkah Engkau, wahai Pemilik keagungan dan kemuliaan.',
    note: 'Dibaca setelah istigfar.',
  },
  {
    arabic: 'اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    latin: 'Allahumma laa maani‘a limaa a‘thaita, wa laa mu‘thiya limaa mana‘ta, wa laa yanfa‘u dzal-jaddi minkal-jadd.',
    translation: 'Ya Allah, tidak ada yang dapat mencegah apa yang Engkau beri, tidak ada yang dapat memberi apa yang Engkau cegah, dan tidak berguna kekayaan bagi pemiliknya di hadapan-Mu.',
    note: 'Salah satu doa yang diriwayatkan setelah shalat fardu.',
  },
  {
    arabic: 'سُبْحَانَ اللّٰهِ · الْحَمْدُ لِلّٰهِ · اللّٰهُ أَكْبَرُ',
    latin: 'Subhanallah, Alhamdulillah, Allahu akbar.',
    translation: 'Mahasuci Allah, segala puji bagi Allah, Allah Mahabesar.',
    note: 'Salah satu zikir yang diriwayatkan: masing-masing 33 kali, lalu menyempurnakan seratus dengan tahlil: “Laa ilaaha illallaahu wahdahu laa syariika lah, lahul-mulku wa lahul-hamdu wa huwa ‘alaa kulli syai’in qadiir.” Ada variasi bilangan dan susunan zikir yang sahih.',
  },
];
