import { toEmbedUrl } from '../utils/format';

export default function VideoPlayer({ url, title = 'Video materi' }) {
  const embedUrl = toEmbedUrl(url);

  if (!url) return null;

  if (!embedUrl) {
    return (
      <div className="rounded-3xl bg-neutral-50 p-5 text-[15px] text-muted">
        Video tidak dapat diputar di sini.{' '}
        <a href={url} target="_blank" rel="noreferrer noopener" className="font-bold text-ink underline">
          Buka di tab baru
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] bg-ink p-2 sm:p-3">
      <div className="relative aspect-video overflow-hidden rounded-[20px]">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
