import s from './Prose.module.css';

/** Imported page/blog HTML (cleaned at import and by lib/content tidy()) in the site's type */
export default function Prose({ html, className = '' }: { html: string; className?: string }) {
  return <div className={`${s.prose} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
