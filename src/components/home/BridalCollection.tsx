import Link from 'next/link';
import { LINKS } from '@/lib/links';
import s from './BridalCollection.module.css';

type Style = { name: string; img: string; offset?: string };

const TOP: Style[] = [
  { name: 'Classic', img: 'classic', offset: '8.36%' },
  { name: 'Halo', img: 'halo' },
  { name: 'Solitaire', img: 'solitaire', offset: '8.49%' },
];
const ROWS: Style[][] = [
  [
    { name: '3-Stone', img: 'three-stone' },
    { name: 'Bypass', img: 'bypass' },
    { name: 'Carved', img: 'carved' },
    { name: 'Fancy', img: 'fancy' },
    { name: 'Invisible', img: 'invisible' },
  ],
  [
    { name: 'Split', img: 'split' },
    { name: 'Twist', img: 'twist' },
    { name: 'Two-Stone', img: 'two-stone' },
    { name: 'Vintage', img: 'vintage' },
    { name: 'Custom', img: 'custom' },
  ],
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function Ring({ style, large }: { style: Style; large?: boolean }) {
  return (
    <li>
      <Link href={`${LINKS.engagementRings}${slug(style.name)}/`} className={`${s.ring} ${large ? s.large : ''}`}>
        <span className={s.ringImg}>
          <img
            src={`/images/ring-${style.img}.jpg`}
            alt=""
            loading="lazy"
            style={style.offset ? { top: style.offset } : undefined}
          />
        </span>
        <span className={s.ringName}>{style.name}</span>
      </Link>
    </li>
  );
}

export default function BridalCollection() {
  return (
    <section className={s.section}>
      <div className={s.left}>
        <div className={s.copy}>
          <p className="eyebrow">The Bridal Collection</p>
          <h2 className="h2">Engagement Settings Couples Ask For By Name</h2>
          <p className={s.sub}>Browse every style in the line, with wedding bands to complete the set.</p>
          <Link href={LINKS.engagementRings} className="btn btn-sm btn-dark">
            View all Engagement Rings
          </Link>
        </div>
      </div>

      <div className={s.right}>
        <ul className={`${s.row} ${s.row3}`}>
          {TOP.map((r) => (
            <Ring key={r.name} style={r} large />
          ))}
        </ul>
        {ROWS.map((row, i) => (
          <ul key={i} className={`${s.row} ${s.row5}`}>
            {row.map((r) => (
              <Ring key={r.name} style={r} />
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
