import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://equran.id/api/doa', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Gagal mengambil daftar doa: layanan mengembalikan ${response.status}`);
      return NextResponse.json(
        { message: 'Daftar doa sementara tidak tersedia.' },
        { status: 502 },
      );
    }

    const result: unknown = await response.json();
    if (
      typeof result !== 'object'
      || result === null
      || !('status' in result)
      || result.status !== 'success'
      || !('data' in result)
      || !Array.isArray(result.data)
    ) {
      console.error('Gagal mengambil daftar doa: format respons tidak valid.');
      return NextResponse.json(
        { message: 'Format daftar doa tidak valid.' },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Gagal mengambil daftar doa:', error);
    return NextResponse.json(
      { message: 'Daftar doa sementara tidak dapat dimuat.' },
      { status: 502 },
    );
  }
}
