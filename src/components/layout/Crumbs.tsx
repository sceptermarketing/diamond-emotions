import Link from 'next/link';
import type { Crumb } from '@/lib/collections';

export default function Crumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      {items.map((c, i) => (
        <span key={`${c.label}-${i}`} style={{ display: 'contents' }}>
          {i > 0 && <span aria-hidden>/</span>}
          {c.href && i < items.length - 1 ? (
            <Link href={c.href}>{c.label}</Link>
          ) : (
            <span aria-current={i === items.length - 1 ? 'page' : undefined}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
