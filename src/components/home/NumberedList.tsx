import s from './NumberedList.module.css';

type Item = { title: string; text: string };

/** The 01 / 02 / 03 list used by "Three Steps" (dark on white) and "Custom Program" (light on dark). */
export default function NumberedList({ items, tone }: { items: Item[]; tone: 'dark' | 'light' }) {
  return (
    <ol className={`${s.list} ${tone === 'light' ? s.light : ''}`}>
      {items.map((item, i) => (
        <li key={item.title} className={s.item}>
          <div className={s.head}>
            <img src={`/images/icons/num-0${i + 1}-${tone}.svg`} alt={`0${i + 1}`} className={s.num} />
            <h3 className={s.title}>{item.title}</h3>
          </div>
          <p className={s.text}>{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
