'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Metal, Product } from '@/lib/collections';
import s from './ProductGrid.module.css';

const PAGE = 16; // 4 rows of 4, as in the design
const SORTS = [
  { id: 'style-asc', label: 'Style number: low to high' },
  { id: 'style-desc', label: 'Style number: high to low' },
] as const;
type SortId = (typeof SORTS)[number]['id'];

type Props = { products: Product[]; basePath: string };

export default function ProductGrid({ products, basePath }: Props) {
  const [shown, setShown] = useState(PAGE);
  const [metals, setMetals] = useState<Metal[]>([]);
  const [sort, setSort] = useState<SortId>('style-asc');
  const [menu, setMenu] = useState<'filter' | 'sort' | null>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  const allMetals = useMemo(() => Array.from(new Set(products.map((p) => p.metal))), [products]);

  const list = useMemo(() => {
    const filtered = metals.length ? products.filter((p) => metals.includes(p.metal)) : products;
    const sorted = [...filtered].sort((a, b) => a.style.localeCompare(b.style, undefined, { numeric: true }));
    return sort === 'style-desc' ? sorted.reverse() : sorted;
  }, [products, metals, sort]);

  const visible = list.slice(0, shown);

  // close the open menu on outside click or Escape
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  const toggleMetal = (m: Metal) => {
    setMetals((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
    setShown(PAGE);
  };

  return (
    <section className={s.section}>
      <div className={s.toolbar}>
        <p className={s.count}>
          {list.length} {list.length === 1 ? 'Style' : 'Styles'} Found
        </p>
        <div className={s.tools} ref={toolsRef}>
          <div className={s.tool}>
            <button
              type="button"
              className={`${s.btn} ${metals.length ? s.btnActive : ''}`}
              aria-expanded={menu === 'filter'}
              aria-haspopup="true"
              onClick={() => setMenu(menu === 'filter' ? null : 'filter')}
            >
              Filter{metals.length ? ` (${metals.length})` : ''}
              <img src="/images/icons/filter.svg" alt="" width={24} height={24} />
            </button>
            {menu === 'filter' && (
              <div className={s.pop} role="group" aria-label="Filter by metal">
                <p className={s.popTitle}>Metal</p>
                {allMetals.map((m) => (
                  <label key={m} className={s.check}>
                    <input type="checkbox" checked={metals.includes(m)} onChange={() => toggleMetal(m)} />
                    {m}
                  </label>
                ))}
                {metals.length > 0 && (
                  <button type="button" className={s.clear} onClick={() => setMetals([])}>
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
          <div className={s.tool}>
            <button
              type="button"
              className={s.btn}
              aria-expanded={menu === 'sort'}
              aria-haspopup="listbox"
              onClick={() => setMenu(menu === 'sort' ? null : 'sort')}
            >
              Sort By
              <img src="/images/icons/chevron-sort.svg" alt="" width={20} height={20} className={s.chev} />
            </button>
            {menu === 'sort' && (
              <ul className={s.pop} role="listbox" aria-label="Sort styles">
                {SORTS.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sort === o.id}
                      className={`${s.option} ${sort === o.id ? s.optionOn : ''}`}
                      onClick={() => {
                        setSort(o.id);
                        setMenu(null);
                      }}
                    >
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <hr className={s.rule} />

      <ul className={s.grid}>
        {visible.map((p) => (
          <li key={p.style}>
            <Link href={`${basePath}${p.style.toLowerCase()}/`} className={s.card}>
              <span className={s.photo}>
                <img src={p.image} alt={`${p.style} ${p.name}`} loading="lazy" />
              </span>
              <span className={s.body}>
                <span className={s.style}>{p.style}</span>
                <span className={s.name}>{p.name}</span>
                <span className={s.row}>
                  <span className={s.price}>Call For Price</span>
                  <span className={s.details}>View details&nbsp;&nbsp;↗</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={s.more}>
        <p className={s.showing} aria-live="polite">
          Showing {visible.length} of {list.length} {list.length === 1 ? 'style' : 'styles'}
        </p>
        {visible.length < list.length && (
          <button type="button" className={s.load} onClick={() => setShown((n) => n + 8)}>
            Load More Styles
          </button>
        )}
      </div>
    </section>
  );
}
