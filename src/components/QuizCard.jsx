import { useEffect, useMemo, useState } from 'react';
import { kuisService } from '../services';
import { getErrorMessage } from '../services/api';
import { CheckIcon } from './Icons';
import { EmptyState, ErrorState, Loading } from './States';

function ResultPanel({ result, onRetry }) {
  const passed = result.passed;
  return (
    <div className={`rounded-3xl p-8 text-center sm:p-12 ${passed ? 'bg-brand-100' : 'bg-sand/40'}`}>
      <p className="eyebrow">{passed ? 'Lulus' : 'Belum lulus'}</p>
      <p className="mt-4 font-serif text-[96px] leading-none text-ink sm:text-[128px]">{result.score}</p>
      <h3 className="mt-2 font-serif text-3xl text-ink">
        {passed ? 'Selamat, kamu lulus!' : 'Belum lulus, coba lagi.'}
      </h3>
      <p className="lead mt-3">
        KKM {result.passingScore ?? 70} — benar {result.correctCount} dari {result.totalQuestions} soal.
      </p>
      <button type="button" onClick={onRetry} className="btn-outline mt-6">
        Kerjakan ulang
      </button>
    </div>
  );
}

export default function QuizCard({ materiId, hasKuis = true }) {
  const [kuis, setKuis] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  async function loadKuis() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await kuisService.get(materiId);
      setKuis(data);
      setAnswers(new Array(data.questions.length).fill(-1));
    } catch (err) {
      const message = getErrorMessage(err, 'Kuis tidak tersedia.');
      if (err?.response?.status === 404) {
        setKuis(null);
        setError('');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasKuis) loadKuis();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiId, hasKuis]);

  const answeredCount = useMemo(() => answers.filter((item) => item >= 0).length, [answers]);
  const allAnswered = kuis ? answeredCount === kuis.questions.length : false;

  function selectAnswer(questionIndex, optionIndex) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
    setSubmitError('');
  }

  async function handleSubmit() {
    if (!allAnswered) {
      setSubmitError('Jawab semua pertanyaan terlebih dahulu.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const data = await kuisService.submit(materiId, answers);
      setResult(data);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Gagal mengirim jawaban.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!hasKuis) {
    return <EmptyState title="Belum ada kuis" description="Materi ini belum memiliki kuis. Silakan pelajari konten materinya." />;
  }

  if (loading) return <Loading label="Memuat kuis..." />;
  if (error) return <ErrorState message={error} onRetry={loadKuis} />;
  if (!kuis) return <EmptyState title="Belum ada kuis" description="Materi ini belum memiliki kuis." />;
  if (result) return <ResultPanel result={result} onRetry={loadKuis} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-serif text-3xl text-ink">{kuis.title}</h3>
          <p className="mt-1 font-mono text-xs text-muted">
            {kuis.questions.length} pertanyaan · KKM {kuis.passingScore}
          </p>
        </div>
        <span className="badge bg-brand-100 text-brand-800">
          {answeredCount}/{kuis.questions.length} terjawab
        </span>
      </div>

      <ol>
        {kuis.questions.map((question, questionIndex) => (
          <li key={questionIndex} className="grid gap-4 border-t border-line py-6 sm:grid-cols-[56px_minmax(0,1fr)]">
            <span className="font-mono text-sm text-muted">{String(questionIndex + 1).padStart(2, '0')}</span>
            <div>
              <p className="text-[17px] font-medium text-ink">{question.question}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const checked = answers[questionIndex] === optionIndex;
                  return (
                    <label
                      key={optionIndex}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[15px] transition ${
                        checked ? 'border-brand-600 bg-brand-100 text-ink' : 'border-line hover:border-ink/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={checked}
                        onChange={() => selectAnswer(questionIndex, optionIndex)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-neutral-300'
                        }`}
                        aria-hidden="true"
                      >
                        {checked ? <CheckIcon className="h-3 w-3" /> : null}
                      </span>
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {submitError ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-full border border-white/60 bg-white/70 py-2 pl-6 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <span className="text-sm text-muted">
          {allAnswered ? 'Semua pertanyaan terjawab.' : `Sisa ${kuis.questions.length - answeredCount} pertanyaan.`}
        </span>
        <button type="button" onClick={handleSubmit} disabled={submitting || !allAnswered} className="btn-primary">
          {submitting ? 'Mengirim...' : 'Kumpulkan jawaban'}
        </button>
      </div>
    </div>
  );
}
