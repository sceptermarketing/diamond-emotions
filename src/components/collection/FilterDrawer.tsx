"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEPARTMENTS,
  SHAPE_ICONS,
  type CategoryTile,
  type Product,
  type TilesByDepartment,
} from "@/lib/collections";
import s from "./FilterDrawer.module.css";

export type Filters = {
  types: string[];
  stones: string[];
  shapes: string[];
  settings: string[];
  metals: string[];
  colors: string[];
};
export const NO_FILTERS: Filters = {
  types: [],
  stones: [],
  shapes: [],
  settings: [],
  metals: [],
  colors: [],
};

/** filters plus where they apply: department, category tile and (fashion lines) product type page */
export type Applied = Filters & { department: string; category: string; sub: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (next: Applied) => void;
  applied: Applied;
  products: Product[];
  tilesByDept: TilesByDepartment;
  subTiles?: CategoryTile[];
  typeLabel?: string;
};

type Section = "categories" | "sub" | "type" | "stone" | "shape" | "setting" | "metal" | "color";

// every value of one attribute across the page's products, A–Z, with how many products have it
function options(
  products: Product[],
  key: "types" | "stones" | "shapes" | "settings" | "metals" | "colors",
) {
  const counts = new Map<string, number>();
  for (const p of products)
    for (const v of new Set(p[key])) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort(([a], [b]) => a.localeCompare(b));
}

const toggle = <T,>(list: T[], v: T) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

export default function FilterDrawer({
  open,
  onClose,
  onApply,
  applied,
  products,
  tilesByDept,
  subTiles = [],
  typeLabel,
}: Props) {
  const types = useMemo(() => options(products, "types"), [products]);
  const metals = useMemo(() => options(products, "metals"), [products]);
  const colors = useMemo(() => options(products, "colors"), [products]);
  const stones = useMemo(() => options(products, "stones"), [products]);
  const shapes = useMemo(() => options(products, "shapes"), [products]);
  const settings = useMemo(() => options(products, "settings"), [products]);

  // choices stay pending until "View Results"
  const [draft, setDraft] = useState<Applied>(applied);
  const [closed, setClosed] = useState<Section[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(applied);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [open, applied, onClose]);

  // the drawer shows the categories of whichever department is chosen in it
  const tiles = tilesByDept[draft.department] ?? [];
  // product type links belong to the page's own line, so they only show while that line is chosen
  const showSub =
    subTiles.length > 0 &&
    draft.department === applied.department &&
    draft.category === applied.category;

  const isOpen = (sec: Section) => !closed.includes(sec);
  const flip = (sec: Section) => setClosed((c) => toggle(c, sec));

  const head = (sec: Section, title: string) => (
    <button
      type="button"
      className={s.head}
      aria-expanded={isOpen(sec)}
      aria-controls={`filter-${sec}`}
      onClick={() => flip(sec)}
    >
      {title}
      <img src="/images/filters/chevron-up.svg" alt="" width={18} height={18} />
    </button>
  );

  const check = (
    label: string,
    n: number,
    checked: boolean,
    onChange: () => void,
    medium = false,
  ) => (
    <label className={`${s.check} ${medium ? s.medium : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={s.label}>{label}</span>
      <span className={s.num}>({n})</span>
    </label>
  );

  return (
    <div className={`${s.root} ${open ? s.open : ""}`} inert={!open}>
      <div className={s.scrim} onClick={onClose} aria-hidden />
      <aside
        className={s.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
      >
        <div className={s.top}>
          <div className={s.titleRow}>
            <h2 id="filters-title" className={s.title}>
              Filters
            </h2>
            <button
              ref={closeRef}
              type="button"
              className={s.close}
              aria-label="Close filters"
              onClick={onClose}
            >
              <img
                src="/images/filters/close.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
          <div className={s.deptRow}>
            <label className={s.dept}>
              <select
                aria-label="Department"
                value={draft.department}
                onChange={(e) => {
                  const department = e.target.value;
                  setDraft((d) =>
                    department === applied.department
                      ? { ...d, department, category: applied.category, sub: applied.sub }
                      : { ...d, department, category: "", sub: "" },
                  );
                }}
              >
                {!draft.department && (
                  <option value="" disabled>
                    Choose a department
                  </option>
                )}
                {DEPARTMENTS.map((d) => (
                  <option key={d.label} value={d.label}>
                    {d.label}
                  </option>
                ))}
              </select>
              <img
                src="/images/filters/chevron-down.svg"
                alt=""
                width={20}
                height={20}
              />
            </label>
            <button
              type="button"
              className={s.reset}
              onClick={() =>
                setDraft({
                  ...NO_FILTERS,
                  department: applied.department,
                  category: applied.category,
                  sub: applied.sub,
                })
              }
            >
              Reset all
            </button>
          </div>
        </div>

        <div className={s.scroll}>
          {tiles.length > 0 && (
            <div className={s.section}>
              {head("categories", "Product Categories")}
              <div
                id="filter-categories"
                className={s.cats}
                hidden={!isOpen("categories")}
              >
                {tiles.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    aria-pressed={draft.category === c.slug}
                    className={`${s.cat} ${draft.category === c.slug ? s.catOn : ""}`}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        category: c.slug,
                        sub: d.department === applied.department && c.slug === applied.category ? applied.sub : "",
                      }))
                    }
                  >
                    <span className={s.catImg}>
                      <img
                        src={c.image}
                        alt=""
                        loading="lazy"
                        style={
                          c.contain ? { objectFit: "contain" } : undefined
                        }
                      />
                    </span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSub && (
            <div className={s.section}>
              {head("sub", "Product Type")}
              <div id="filter-sub" className={s.chips} hidden={!isOpen("sub")}>
                {subTiles.map((t) => (
                  <button
                    key={t.slug || "all"}
                    type="button"
                    aria-pressed={draft.sub === t.slug}
                    className={`${s.chip} ${draft.sub === t.slug ? s.chipOn : ""}`}
                    onClick={() => setDraft((d) => ({ ...d, sub: t.slug }))}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {typeLabel && types.length > 1 && (
            <div className={s.section}>
              {head("type", typeLabel)}
              <div id="filter-type" className={s.settings} hidden={!isOpen("type")}>
                {types.map(([t, n]) => (
                  <div key={t}>
                    {check(t, n, draft.types.includes(t), () =>
                      setDraft((d) => ({ ...d, types: toggle(d.types, t) })),
                    true)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stones.length > 0 && (
          <div className={s.section}>
            {head("stone", "Stone Type")}
            <div id="filter-stone" hidden={!isOpen("stone")}>
              {stones.map(([st, n]) => (
                <div key={st}>
                  {check(st, n, draft.stones.includes(st), () =>
                    setDraft((d) => ({ ...d, stones: toggle(d.stones, st) })),
                  )}
                </div>
              ))}
            </div>
          </div>
          )}

          {shapes.length > 0 && (
          <div className={s.section}>
            {head("shape", "Stone Shape")}
            <div
              id="filter-shape"
              className={s.shapeWrap}
              hidden={!isOpen("shape")}
            >
              <div className={s.shapes}>
                {shapes.map(([sh, n]) => (
                  <button
                    key={sh}
                    type="button"
                    aria-pressed={draft.shapes.includes(sh)}
                    className={`${s.shape} ${draft.shapes.includes(sh) ? s.shapeOn : ""}`}
                    onClick={() =>
                      setDraft((d) => ({ ...d, shapes: toggle(d.shapes, sh) }))
                    }
                  >
                    <img
                      src={`/images/filters/${SHAPE_ICONS.includes(sh.toLowerCase()) ? sh.toLowerCase() : "round"}.svg`}
                      alt=""
                      width={40}
                      height={40}
                    />
                    <span className={s.shapeName}>{sh}</span>
                    <span className={s.shapeNum}>
                      ({n})
                    </span>
                  </button>
                ))}
              </div>
              <p className={s.note}>
                Catalogue shape may refer to accent stones, not the center
                stone.
              </p>
            </div>
          </div>
          )}

          {settings.length > 0 && (
          <div className={s.section}>
            {head("setting", "Setting")}
            <div
              id="filter-setting"
              className={s.settings}
              hidden={!isOpen("setting")}
            >
              {settings.map(([st, n]) => (
                <div key={st}>
                  {check(
                    st,
                    n,
                    draft.settings.includes(st),
                    () =>
                      setDraft((d) => ({
                        ...d,
                        settings: toggle(d.settings, st),
                      })),
                    true,
                  )}
                </div>
              ))}
            </div>
          </div>
          )}

          {metals.length > 1 && (
            <div className={s.section}>
              {head("metal", "Metal")}
              <div id="filter-metal" className={s.settings} hidden={!isOpen("metal")}>
                {metals.map(([m, n]) => (
                  <div key={m}>
                    {check(m, n, draft.metals.includes(m), () =>
                      setDraft((d) => ({ ...d, metals: toggle(d.metals, m) })),
                    true)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {colors.length > 1 && (
            <div className={s.section}>
              {head("color", "Metal Color")}
              <div id="filter-color" className={s.settings} hidden={!isOpen("color")}>
                {colors.map(([c, n]) => (
                  <div key={c}>
                    {check(c, n, draft.colors.includes(c), () =>
                      setDraft((d) => ({ ...d, colors: toggle(d.colors, c) })),
                    true)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={s.actions}>
          <button
            type="button"
            className={s.apply}
            onClick={() => onApply(draft)}
          >
            View Results
          </button>
        </div>
      </aside>
    </div>
  );
}
