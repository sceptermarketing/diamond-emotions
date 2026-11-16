import type { CSSProperties } from 'react';
import s from './TrustBar.module.css';

// Each icon is a crop of one Figma sprite (trust-icons.png); the numbers are the Figma fill crop.
const ITEMS = [
  {
    title: 'Wholesale Only',
    text: 'We never sell direct to consumers.',
    box: { width: 32.416, height: 25.731 },
    crop: { top: '-131.44%', left: '-44.68%', width: '575.78%', height: '241.79%' },
  },
  {
    title: 'Since 2009',
    text: 'Family-founded in East Lansing, Michigan.',
    box: { width: 32.416, height: 26.284 },
    crop: { top: '-126.57%', left: '-168.97%', width: '575.78%', height: '236.71%' },
  },
  {
    title: 'U.S. & Canada',
    text: 'Partnering with jewelers across the Midwest and beyond.',
    box: { width: 32.416, height: 27.055 },
    crop: { top: '-122.14%', left: '-300.01%', width: '575.78%', height: '229.96%' },
    wide: true,
  },
  {
    title: 'Custom, Start To Finish',
    text: "From your customer's sketch to a finished ring.",
    box: { width: 32.416, height: 27.709 },
    crop: { top: '-117.24%', left: '-430.72%', width: '575.78%', height: '224.53%' },
  },
];

export default function TrustBar() {
  return (
    <section className={s.bar} aria-label="Why Diamond Emotions">
      <div className={s.inner}>
        {ITEMS.map((item) => (
          <div key={item.title} className={`${s.item} ${item.wide ? s.wide : ''}`}>
            <div className={s.head}>
              <span className={s.circle} aria-hidden>
                <span className={s.icon} style={item.box as CSSProperties}>
                  <img src="/images/trust-icons.png" alt="" style={item.crop as CSSProperties} />
                </span>
              </span>
              <h2 className={s.title}>{item.title}</h2>
            </div>
            <p className={s.text}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
