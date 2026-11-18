'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEPARTMENTS, type CategoryTile, type Product, type TilesByDepartment } from '@/lib/collections';
import FilterDrawer, { NO_FILTERS, type Applied } from './FilterDrawer';
import s from './ProductGrid.module.css';

const PAGE = 16; // 4 rows of 4, as in the design
const SORTS = [
  { id: 'style-asc', label: 'Style number: low to high' },
  { id: 'style-desc', label: 'Style number: high to low' },
] as const;
type SortId = (typeof SORTS)[number]['id'];

type Props = {
  products: Product[];
  tilesByDept: TilesByDepartment;
  department: string;
  category: string;
  subTiles?: CategoryTile[];
  sub?: string;
  typeLabel?: string;
};

export default function ProductGrid({ products, tilesByDept, department, category, subTiles, sub = '', typeLabel }: Props) {
  const router = useRouter();
  const [shown, setShown] = useState(PAGE);
  const here = { department, category, sub };
  const [filters, setFilters] = useState<Applied>({ ...NO_FILTERS, ...here });
  const [sort, setSort] = useState<SortId>('style-asc');
  const [menu, setMenu] = useState<'sort' | null>(null);
  const [drawer, setDrawer] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const filterBtn = useRef<HTMLButtonElement>(null);

  const active = (['types', 'stones', 'shapes', 'settings', 'metals', 'colors'] as const).reduce(
    (n, k) => n + filters[k].length,
    0,
  );

  const closeDrawer = useCallback(() => {
    setDrawer(false);
    filterBtn.current?.focus();
  }, []);

  const apply = (next: Applied) => {
    // another department, category or product type lives on its own page
    const deptChanged = next.department !== department;
    if (next.category && (deptChanged || next.category !== category)) {
      const t = tilesByDept[next.department]?.find((x) => x.slug === next.category);
      if (t) router.push(t.href);
    } else if (deptChanged) {
      const d = DEPARTMENTS.find((x) => x.label === next.department);
      if (d) router.push(d.href);
    } else if (next.sub !== sub) {
      const t = subTiles?.find((x) => x.slug === next.sub);
      if (t) router.push(t.href);
    }
    setFilters({ ...next, ...here });
    setShown(PAGE);
    closeDrawer();
  };

  const list = useMemo(() => {
    const { types, stones, shapes, settings, metals, colors } = filters;
    const filtered = products.filter(
      (p) =>
        (!types.length || p.types.some((x) => types.includes(x))) &&
        (!metals.length || p.metals.some((x) => metals.includes(x))) &&
        (!colors.length || p.colors.some((x) => colors.includes(x))) &&
        (!stones.length || p.stones.some((x) => stones.includes(x))) &&
        (!shapes.length || p.shapes.some((x) => shapes.includes(x))) &&
        (!settings.length || p.settings.some((x) => settings.includes(x))),
    );
    const sorted = [...filtered].sort((a, b) => a.style.localeCompare(b.style, undefined, { numeric: true }));
    return sort === 'style-desc' ? sorted.reverse() : sorted;
  }, [products, filters, sort]);

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

  return (
    <section className={s.section}>
      <div className={s.toolbar}>
        <p className={s.count}>
          {list.length} {list.length === 1 ? 'Style' : 'Styles'} Found
        </p>
        <div className={s.tools} ref={toolsRef}>
          <div className={s.tool}>
            <button
              ref={filterBtn}
              type="button"
              className={`${s.btn} ${active ? s.btnActive : ''}`}
              aria-expanded={drawer}
              aria-haspopup="dialog"
              onClick={() => {
                setMenu(null);
                setDrawer(true);
              }}
            >
              Filter{active ? ` (${active})` : ''}
              <img src="/images/icons/filter.svg" alt="" width={24} height={24} />
            </button>
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

      <FilterDrawer open={drawer} onClose={closeDrawer} onApply={apply} applied={filters} products={products} tilesByDept={tilesByDept} subTiles={subTiles} typeLabel={typeLabel} />

      <hr className={s.rule} />

      <ul className={s.grid}>
        {visible.map((p) => (
          <li key={p.slug}>
            <Link href={p.href} className={s.card}>
              <span className={s.photo}>
                {p.image ? (
                  <img src={p.image} alt={p.alt} loading="lazy" />
                ) : (
                  <span className={s.noPhoto}>Photo coming soon</span>
                )}
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

      {list.length === 0 && (
        <p className={s.empty}>
          No styles match these filters.{' '}
          <button type="button" onClick={() => setFilters({ ...NO_FILTERS, ...here })}>
            Clear filters
          </button>
        </p>
      )}

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
