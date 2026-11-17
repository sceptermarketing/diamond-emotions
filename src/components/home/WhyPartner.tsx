import s from './WhyPartner.module.css';

const CARDS = [
  {
    img: '/images/why-bridal.jpg',
    title: 'Sell More Bridal',
    text: 'Engagement rings in the styles couples ask for by name — halo, solitaire, three-stone, vintage and more — with wedding bands to complete the set.',
  },
  {
    img: '/images/sketch.jpg',
    title: 'Say Yes To Custom',
    text: "When a couple can't find it in your case, send us their idea. We'll return a CAD for approval, then craft the\nfinished piece.",
  },
  {
    img: '/images/why-never.jpg',
    title: 'We Never Sell Around You',
    text: 'Diamond Emotions is wholesale only. When shoppers find us online, we send them to an authorized jeweler near them.',
  },
  {
    img: '/images/why-retailer.png',
    title: 'Built By a Retailer',
    text: 'Our founder spent years managing jewelry stores before starting Diamond Emotions. Every design is\nmade with your counter in\nmind.',
  },
];

export default function WhyPartner() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.head}>
          <p className="eyebrow">Why Jewelers Partner With Us</p>
          <h2 className="h2">
            Everything Your Bridal Case Needs.{' '}
            <br />
            Nothing That Competes With It.
          </h2>
          <p className={s.sub}>
            We&apos;ve stood behind the counter. We know what it takes to close a bridal sale — and what gets in the way.
          </p>
        </div>

        <div className={s.grid}>
          {CARDS.map((c) => (
            <article key={c.title} className={s.card}>
              <img src={c.img} alt="" className={s.img} loading="lazy" />
              <h3 className={s.title}>{c.title}</h3>
              <p className={s.text}>
                {c.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <>
                        {' '}
                        <br className={s.br} />
                      </>
                    )}
                    {line}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
