// Tata letak halaman masuk/daftar: form di kiri, panel visual ala template di kanan
export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <section className="container-page pb-20 pt-6 sm:pt-10">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col justify-center border-t border-line py-12 lg:pr-16">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="heading mt-8">{title}</h1>
          <p className="lead mt-5 max-w-md">{description}</p>
          <div className="mt-10 max-w-md">{children}</div>
          <div className="mt-8 max-w-md text-[15px] text-muted">{footer}</div>
        </div>

        <div className="relative hidden min-h-[640px] overflow-hidden rounded-4xl bg-sage lg:block">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/15" aria-hidden="true" />
          <div className="absolute -bottom-32 left-10 h-[420px] w-[420px] rounded-full bg-brand-700/30" aria-hidden="true" />
          <div className="absolute bottom-40 right-20 h-40 w-40 rounded-full bg-sand/80" aria-hidden="true" />
          <figure className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/30 bg-white/20 p-8 text-white backdrop-blur-md">
            <p className="font-serif text-3xl leading-snug">
              Belajar keterampilan praktis, siap dipakai — dari artikel, video, kuis, sampai latihan.
            </p>
            <figcaption className="mt-5 font-mono text-xs text-white/80">SkillLearn</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
