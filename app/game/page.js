'use client';

import { useState } from 'react';
import { FiAward, FiCheck, FiChevronRight, FiRotateCw, FiShare2, FiZap } from 'react-icons/fi';

const QUESTIONS = [
  {
    question: 'Apa surah terpanjang dalam Al-Qur’an?',
    options: ['Ali ‘Imran', 'Al-Baqarah', 'An-Nisa', 'Al-Ma’idah'],
    answer: 1,
    explanation: 'Surah Al-Baqarah terdiri dari 286 ayat dan merupakan surah terpanjang dalam Al-Qur’an.',
    source: 'Al-Baqarah, surah ke-2',
  },
  {
    question: 'Ayat Kursi terdapat dalam surah apa?',
    options: ['Al-Fatihah', 'Al-Ikhlas', 'Al-Baqarah', 'Ar-Rahman'],
    answer: 2,
    explanation: 'Ayat Kursi adalah ayat ke-255 dalam Surah Al-Baqarah.',
    source: 'Al-Baqarah 2:255',
  },
  {
    question: 'Berapa jumlah surah dalam Al-Qur’an?',
    options: ['99', '110', '114', '120'],
    answer: 2,
    explanation: 'Al-Qur’an terdiri dari 114 surah, dari Al-Fatihah hingga An-Nas.',
    source: 'Daftar surah Al-Qur’an',
  },
  {
    question: 'Lima ayat pertama yang diturunkan terdapat pada surah apa?',
    options: ['Al-‘Alaq', 'Al-Muddaththir', 'Al-Fatihah', 'Al-Qadr'],
    answer: 0,
    explanation: 'Wahyu pertama adalah ayat 1–5 Surah Al-‘Alaq.',
    source: 'Al-‘Alaq 96:1–5; Sahih al-Bukhari 3',
  },
  {
    question: 'Dalam surah apa disebutkan bahwa Al-Qur’an diturunkan pada bulan Ramadan?',
    options: ['Al-Baqarah', 'Maryam', 'Yunus', 'Al-Qadr'],
    answer: 0,
    explanation: 'Ayat 185 Surah Al-Baqarah menyebut bulan Ramadan sebagai bulan diturunkannya Al-Qur’an.',
    source: 'Al-Baqarah 2:185',
  },
  {
    question: 'Apa nama surah pertama dalam susunan mushaf Al-Qur’an?',
    options: ['Al-Baqarah', 'Al-Fatihah', 'An-Nas', 'Al-‘Alaq'],
    answer: 1,
    explanation: 'Surah Al-Fatihah berada di urutan pertama dalam susunan mushaf.',
    source: 'Al-Fatihah, surah ke-1',
  },
  {
    question: 'Surah apakah yang dikenal dengan nama Ummul Kitab?',
    options: ['Al-Fatihah', 'Al-Kahf', 'Al-Mulk', 'Al-Ikhlas'],
    answer: 0,
    explanation: 'Al-Fatihah dikenal dengan beberapa nama, di antaranya Ummul Kitab.',
    source: 'Sahih al-Bukhari 4474',
  },
  {
    question: 'Berapa jumlah ayat dalam Surah Al-Ikhlas?',
    options: ['3', '4', '5', '7'],
    answer: 1,
    explanation: 'Surah Al-Ikhlas terdiri dari empat ayat.',
    source: 'Al-Ikhlas, surah ke-112',
  },
];

const QUESTIONS_PER_ROUND = 5;
const BEST_SCORE_KEY = 'quran-web-quiz-best-score';

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand('copy');
  textArea.remove();
  return copied ? Promise.resolve() : Promise.reject(new Error('Browser menolak menyalin teks.'));
}

export default function GamePage() {
  const [phase, setPhase] = useState('intro');
  const [round, setRound] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(null);
  const [shareMessage, setShareMessage] = useState('');

  const currentQuestion = round[questionIndex];
  const isCorrect = selectedOption === currentQuestion?.answer;

  function startRound() {
    setRound(shuffle(QUESTIONS).slice(0, QUESTIONS_PER_ROUND));
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShareMessage('');
    setPhase('playing');
  }

  function continueRound() {
    const finalScore = score + (isCorrect ? 1 : 0);
    setScore(finalScore);
    setSelectedOption(null);

    if (questionIndex + 1 < QUESTIONS_PER_ROUND) {
      setQuestionIndex((index) => index + 1);
      return;
    }

    setScore(finalScore);
    setPhase('result');

    try {
      const previousBest = Number(window.localStorage.getItem(BEST_SCORE_KEY)) || 0;
      const nextBest = Math.max(previousBest, finalScore);
      window.localStorage.setItem(BEST_SCORE_KEY, String(nextBest));
      setBestScore(nextBest);
    } catch (error) {
      console.error('Gagal menyimpan skor terbaik:', error);
    }
  }

  async function shareScore() {
    const message = `Skor kuis Al-Qur’an saya: ${score}/${QUESTIONS_PER_ROUND} 🌙\nYuk, coba tantangannya di Quran Web!`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Kuis Al-Qur’an', text: message, url: window.location.href });
        setShareMessage('Hasil berhasil dibagikan.');
      } else {
        await copyText(message);
        setShareMessage('Hasil disalin. Bagikan ke temanmu!');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Gagal membagikan skor:', error);
      setShareMessage('Hasil tidak dapat dibagikan dari browser ini.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-[#124e43] px-6 py-9 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Tantangan ringan</p>
        <h1 className="relative mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Kuis ilmu Al-Qur’an</h1>
        <p className="relative mt-4 max-w-xl leading-7 text-emerald-50/80">
          Uji pengetahuanmu lewat lima pertanyaan singkat. Belajar bareng, lalu bagikan skormu.
        </p>
      </header>

      {phase === 'intro' && (
        <section className="rounded-[2rem] border border-[#e6e2d7] bg-white p-6 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4dc] text-2xl text-[#b6812e]">
            <FiZap aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold text-[#173d35]">Siap ikut tantangan?</h2>
          <p className="mx-auto mt-3 max-w-lg leading-7 text-[#748179]">
            Setiap ronde berisi 5 soal pilihan ganda. Setelah menjawab, kamu akan melihat penjelasan dan rujukan singkat.
          </p>
          <button
            type="button"
            onClick={startRound}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#124e43] px-7 py-3 font-semibold text-white transition hover:bg-[#0c4037] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
          >
            Mulai bermain
            <FiChevronRight aria-hidden="true" />
          </button>
        </section>
      )}

      {phase === 'playing' && currentQuestion && (
        <section className="rounded-[2rem] border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-[#327b68]">Pertanyaan {questionIndex + 1} dari {QUESTIONS_PER_ROUND}</p>
            <p className="rounded-full bg-[#edf3ec] px-3 py-1.5 text-sm font-semibold text-[#276553]">Skor {score}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf0e8]" aria-label={`Progres ${questionIndex + 1} dari ${QUESTIONS_PER_ROUND}`}>
            <div className="h-full rounded-full bg-[#327b68] transition-all" style={{ width: `${((questionIndex + 1) / QUESTIONS_PER_ROUND) * 100}%` }} />
          </div>

          <h2 className="mt-7 text-xl font-semibold leading-8 text-[#173d35] sm:text-2xl">{currentQuestion.question}</h2>

          <div role="group" aria-label="Pilih jawaban" className="mt-6 grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const selected = selectedOption === index;
              const correctOption = selectedOption !== null && index === currentQuestion.answer;
              const wrongSelection = selected && !isCorrect;
              const optionStyle = correctOption
                ? 'border-[#327b68] bg-[#edf5ee] text-[#1f624f]'
                : wrongSelection
                  ? 'border-[#c8816d] bg-[#fff3ef] text-[#8e4939]'
                  : selected
                    ? 'border-[#327b68] bg-[#f3f7f1] text-[#173d35]'
                    : 'border-[#e6e2d7] bg-white text-[#52675f] hover:border-[#adc6b8] hover:bg-[#fbfaf6]';

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectedOption === null && setSelectedOption(index)}
                  disabled={selectedOption !== null}
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68] disabled:cursor-default ${optionStyle}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/5 text-xs font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {correctOption && <FiCheck aria-label="Jawaban benar" className="shrink-0 text-lg" />}
                  {wrongSelection && <span aria-label="Jawabanmu" className="shrink-0 text-lg">×</span>}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div aria-live="polite" className={`mt-5 rounded-2xl p-4 ${isCorrect ? 'bg-[#edf5ee] text-[#1f624f]' : 'bg-[#fff4e9] text-[#81572c]'}`}>
              <p className="font-semibold">{isCorrect ? 'Tepat sekali!' : 'Belum tepat, yuk pelajari jawabannya.'}</p>
              <p className="mt-2 text-sm leading-6">{currentQuestion.explanation}</p>
              <p className="mt-2 text-xs font-medium opacity-80">Rujukan: {currentQuestion.source}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={continueRound}
              disabled={selectedOption === null}
              className="inline-flex items-center gap-2 rounded-full bg-[#124e43] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c4037] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {questionIndex + 1 === QUESTIONS_PER_ROUND ? 'Lihat hasil' : 'Lanjut'}
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      {phase === 'result' && (
        <section className="rounded-[2rem] border border-[#e6e2d7] bg-white p-6 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4dc] text-2xl text-[#b6812e]">
            <FiAward aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#a77b2e]">Ronde selesai</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#173d35]">Skormu {score} dari {QUESTIONS_PER_ROUND}</h2>
          <p className="mt-3 text-[#748179]">
            {score === QUESTIONS_PER_ROUND
              ? 'Masyaallah, sempurna! Pengetahuanmu makin mantap.'
              : score >= 3
                ? 'Bagus! Terus belajar dan ajak teman ikut mencoba.'
                : 'Terima kasih sudah mencoba. Sedikit demi sedikit, ilmu bertambah.'}
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#edf3ec] px-4 py-2 text-sm font-semibold text-[#276553]">
              <FiAward aria-hidden="true" />
              Skor terbaik di perangkat ini: {bestScore}/{QUESTIONS_PER_ROUND}
            </p>
          )}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={startRound}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#124e43] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c4037] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
            >
              <FiRotateCw aria-hidden="true" />
              Main lagi
            </button>
            <button
              type="button"
              onClick={shareScore}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9dfd5] px-6 py-3 text-sm font-semibold text-[#327b68] transition hover:bg-[#edf3ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
            >
              <FiShare2 aria-hidden="true" />
              Bagikan skor
            </button>
          </div>
          {shareMessage && <p role="status" className="mt-4 text-sm text-[#327b68]">{shareMessage}</p>}
        </section>
      )}
    </div>
  );
}
