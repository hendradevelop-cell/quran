This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Instal dan akses offline

Quran Web dapat dipasang dari browser yang mendukung PWA melalui tombol **Instal aplikasi**. Tombol otomatis disembunyikan setelah aplikasi terpasang. Di iPhone atau iPad, buka situs menggunakan Safari, ketuk **Bagikan**, lalu pilih **Tambahkan ke Layar Utama**. Situs perlu disajikan melalui HTTPS saat digunakan di perangkat; `localhost` tetap bisa digunakan untuk pengembangan.

Service worker menyimpan halaman beranda dan aset aplikasi agar beranda dapat dibuka kembali saat offline. Fitur yang mengambil data dari internet, seperti jadwal shalat, tetap memerlukan koneksi.

## Mode siang dan malam

Gunakan tombol tema di bagian atas untuk memilih mode **Siang**, **Malam**, atau **Otomatis**. Mode otomatis mengikuti pengaturan tampilan perangkat; pilihan manual disimpan di browser ini.

Quran Web dibuat oleh [Hendra](mailto:hendra.develop@gmail.com).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
