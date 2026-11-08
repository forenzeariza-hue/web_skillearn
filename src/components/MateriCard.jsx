import { Link } from 'react-router-dom';
import { ArrowIcon, TYPE_ICONS } from './Icons';

const TYPE_LABELS = {
  artikel: 'Artikel',
  video: 'Video',
  kuis: 'Kuis',
  latihan: 'Latihan',
};

export function typeLabel(type) {
  return TYPE_LABELS[type] || type;
}

function Thumbnail({ src, alt, type }) {
  const Icon = TYPE_ICONS[type];
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-sand/40">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-ink/30">
          {Icon ? <Icon className="h-10 w-10" /> : null}
        </div>
      )}
      <span className="badge absolute left-4 top-4 bg-white/85 text-ink backdrop-blur">{typeLabel(type)}</span>
    </div>
  );
}

export default function MateriCard({ materi, footer = null }) {
  const { _id, title, description, category, type, durationMinutes, thumbnail, level } = materi;

  return (
    <article className="group flex flex-col">
      <Link to={`/materi/${_id}`} className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        <Thumbnail src={thumbnail} alt={title} type={type} />
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <p className="font-mono text-xs text-brand-700">
          {category}
          <span className="text-muted">
            {' '}
            · <span className="capitalize">{level}</span>
            {durationMinutes ? ` · ${durationMinutes} menit` : ''}
          </span>
        </p>

        <h3 className="mt-3 line-clamp-2 font-serif text-2xl leading-snug text-ink">
          <Link to={`/materi/${_id}`} className="hover:text-brand-700">
            {title}
          </Link>
        </h3>

        <p className="lead mt-2 line-clamp-2 flex-1">{description}</p>

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-4">
          <Link to={`/materi/${_id}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-brand-700">
            Lihat materi <ArrowIcon />
          </Link>
          {footer}
        </div>
      </div>
    </article>
  );
}
