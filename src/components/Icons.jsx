const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function ArrowIcon({ className = 'h-2.5 w-2.5' }) {
  return (
    <svg viewBox="0 0 10 10" className={className} {...base} strokeWidth={1.4}>
      <path d="M2 8 8 2M3.5 2H8v4.5" />
    </svg>
  );
}

export function ArticleIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5M9 12h7M9 16h7" />
    </svg>
  );
}

export function VideoIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" />
    </svg>
  );
}

export function QuizIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.4M12 17h.01" />
    </svg>
  );
}

export function PracticeIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />
    </svg>
  );
}

export function TrendIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
    </svg>
  );
}

export function StarIcon({ filled = false, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} fill={filled ? 'currentColor' : 'none'}>
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function SearchIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export const TYPE_ICONS = {
  artikel: ArticleIcon,
  video: VideoIcon,
  kuis: QuizIcon,
  latihan: PracticeIcon,
};
