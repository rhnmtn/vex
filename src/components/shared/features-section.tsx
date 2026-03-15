import { Check, Home, Shield, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: Star,
    title: '50.000+ Gerçek Misafir Yorumu',
    description:
      "KiralaKal'da gördüğünüz yorumların tamamı o villada konaklamış gerçek misafirlerimize aittir.",
    bullets: [
      "50.000'den fazla doğrulanmış yorum",
      'Ortalama 9,32 / 10 memnuniyet puanı',
      'Şeffaf değerlendirme sistemi'
    ],
    footer: 'Bu sayede villa seçerken gerçek deneyimlere göre karar verirsiniz.'
  },
  {
    icon: Shield,
    title: 'Güvenli Rezervasyon',
    description:
      'KiralaKal rezervasyonları Nimi Turizm güvencesi ile yapılmaktadır.',
    badge: { text: 'Nimi Turizm', sub: 'TÜRSAB Belge No: 13504' },
    bullets: [
      'Tüm ödemeler şirket hesabına yapılır',
      'Online kredi kartı ile güvenli ödeme',
      'Resmi seyahat acentesi güvencesi'
    ],
    footer: 'Rezervasyon süreciniz tamamen güvenli ve kayıtlıdır.'
  },
  {
    icon: Home,
    title: 'Özenle Seçilmiş Villalar',
    description:
      "KiralaKal'da yayınlanan her villa detaylı saha kontrolünden geçer.",
    bullets: [
      'Fotoğraf ve videolar KiralaKal ekibi tarafından çekilir',
      'Görseller filtre veya yanıltıcı düzenleme içermez',
      'Villalar düzenli olarak kontrol edilir'
    ],
    footer:
      'Böylece rezervasyon yaptığınız villa ile karşılaştığınız villa aynı olur.'
  },
  {
    icon: Zap,
    title: 'Anında Müsait Villalar',
    description: 'KiralaKal arama sistemi sayesinde:',
    bullets: [
      'Tarihinizi seçersiniz',
      'Gerçek müsait villaları görürsünüz',
      'Anında rezervasyon yapabilirsiniz'
    ],
    footer:
      'Saatlerce teklif beklemezsiniz. Gördüğünüz villayı hemen kiralayabilirsiniz.'
  }
];

const STEPS = [
  { num: 1, text: 'Tarihinizi seçin' },
  { num: 2, text: 'Villanızı bulun' },
  { num: 3, text: 'Güvenle rezervasyon yapın' }
];

export function FeaturesSection() {
  return (
    <section className='bg-muted/30' aria-labelledby='features-heading'>
      <div className='mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pt-10 lg:pb-20'>
        {/* Intro */}
        <div className='mx-auto max-w-3xl text-center'>
          <h2
            id='features-heading'
            className='text-foreground text-2xl font-bold sm:text-3xl lg:text-4xl'
          >
            Hayalinizdeki Villa Tatiline KiralaKal ile Ulaşın
          </h2>
          <p className='text-foreground/80 mt-4 text-lg'>
            Türkiye&apos;nin en özel tatil villalarını güvenli, hızlı ve kolay
            şekilde kiralayın. Tüm rezervasyonlar Nimi Turizm güvencesiyle
            yapılır.
          </p>
          <ul className='text-foreground mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm sm:text-base'>
            <li className='flex items-center gap-2'>
              <Check className='text-primary size-5 shrink-0' aria-hidden />
              Doğrulanmış villalar
            </li>
            <li className='flex items-center gap-2'>
              <Check className='text-primary size-5 shrink-0' aria-hidden />
              Gerçek misafir yorumları
            </li>
            <li className='flex items-center gap-2'>
              <Check className='text-primary size-5 shrink-0' aria-hidden />
              Anında müsaitlik kontrolü
            </li>
            <li className='flex items-center gap-2'>
              <Check className='text-primary size-5 shrink-0' aria-hidden />
              Güvenli ödeme altyapısı
            </li>
          </ul>
          <Link
            href='#'
            className='bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-8 inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          >
            Şimdi villanızı seçin, tatilinizi planlayın.
          </Link>
        </div>

        {/* Neden KiralaKal? */}
        <div className='mt-16'>
          <h3 className='text-foreground text-center text-xl font-semibold'>
            Neden KiralaKal?
          </h3>
          <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className='bg-card border-border flex flex-col rounded-xl border p-6 shadow-sm'
              >
                <div className='flex items-start gap-4'>
                  <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg'>
                    <feature.icon className='size-5' aria-hidden />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h4 className='text-foreground font-semibold'>
                      {feature.title}
                    </h4>
                    {feature.badge && (
                      <p className='text-foreground/70 mt-1 text-xs'>
                        {feature.badge.text}
                        <br />
                        <span className='font-medium'>{feature.badge.sub}</span>
                      </p>
                    )}
                  </div>
                </div>
                <p className='text-foreground/80 mt-4 text-sm leading-relaxed'>
                  {feature.description}
                </p>
                <ul className='text-foreground/80 mt-3 space-y-1.5 text-sm'>
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className='flex items-start gap-2'>
                      <Check
                        className='text-primary mt-0.5 size-4 shrink-0'
                        aria-hidden
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className='text-foreground/70 mt-4 text-sm'>
                  {feature.footer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tatilinizi Planlamak Çok Kolay */}
        <div className='mt-16 text-center'>
          <h3 className='text-foreground text-xl font-semibold'>
            Tatilinizi Planlamak Çok Kolay
          </h3>
          <div className='mt-8 flex flex-wrap justify-center gap-10 sm:gap-16'>
            {STEPS.map((step) => (
              <div key={step.num} className='flex flex-col items-center'>
                <span
                  className='bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl text-base font-bold'
                  aria-hidden
                >
                  {step.num}
                </span>
                <span className='text-foreground mt-2 text-sm font-medium'>
                  {step.text}
                </span>
              </div>
            ))}
          </div>
          <p className='text-foreground/70 mt-6 text-sm'>
            Hepsi sadece birkaç dakika.
          </p>
        </div>

        {/* Final CTA */}
        <div className='border-border bg-card mt-16 rounded-xl border px-6 py-12 text-center sm:px-10'>
          <h3 className='text-foreground text-xl font-semibold'>
            Hemen Villanızı Bulun
          </h3>
          <p className='text-foreground/80 mt-3'>
            Türkiye&apos;nin en güzel tatil bölgelerinde yüzlerce villa sizi
            bekliyor.
          </p>
          <p className='text-foreground mt-1 font-medium'>
            KiralaKal ile hayalinizdeki tatili planlayın.
          </p>
          <Link
            href='#'
            className='bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-6 inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          >
            Villaları Keşfet
          </Link>
        </div>
      </div>
    </section>
  );
}
