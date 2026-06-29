import { useEffect, useRef, type ReactNode, type CSSProperties, type ElementType } from 'react';

/* ---- inline line icons (stroke = currentColor) ---- */
export const ICONS = {
  page:   <><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></>,
  cube:   <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18M4 7.5l8 4.5 8-4.5"/></>,
  blocks: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  bell:   <><path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/></>,
  dash:   <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/></>,
  chart:  <><line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="11" width="3" height="6"/><rect x="11" y="7" width="3" height="10"/><rect x="16" y="13" width="3" height="4"/></>,
  check:  <polyline points="4 12 9 17 20 6"/>,
  arrow:  <><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></>,
} as const;

export const FEATURE_ICONS = ['page', 'cube', 'blocks', 'bell', 'dash', 'chart'] as const;

/* ---- Icon component ---- */
interface IconProps {
  name: keyof typeof ICONS | string;
  stroke?: number;
}

export function Icon({ name, stroke = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name as keyof typeof ICONS]}
    </svg>
  );
}

/* ---- Kicker pill ---- */
interface KickerProps {
  children: ReactNode;
  accent?: boolean;
}

export function Kicker({ children, accent }: KickerProps) {
  return <span className={"kicker" + (accent ? " kicker--accent" : "")}>{children}</span>;
}

/* ---- SplitTitle: lines[] with optional hl marking ---- */
interface SplitTitleProps {
  lines: string[];
  hlIndex?: number;
  className?: string;
}

export function SplitTitle({ lines, hlIndex = 1, className = 'display' }: SplitTitleProps) {
  return (
    <h2 className={className}>
      {lines.map((ln, i) => (
        <span key={i} style={{ display: 'block' }}>
          {i === hlIndex ? <span className="hl">{ln}</span> : ln}
        </span>
      ))}
    </h2>
  );
}

/* ---- Reveal-on-scroll wrapper (IO + scroll fallback for flaky iframes) ---- */
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  tag?: ElementType;
  style?: CSSProperties;
}

export function Reveal({ children, className = '', delay = 0, tag = 'div', style }: RevealProps) {
  const ref = useRef<Element>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const show = () => { if (done) return; done = true; setTimeout(() => el.classList.add('in'), delay); cleanup(); };
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.92 && r.bottom > 0;
    };
    const onScroll = () => { if (inView()) show(); };
    let io: IntersectionObserver | null = null;
    const cleanup = () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      if (io) io.disconnect();
    };
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) show(); }),
        { threshold: 0.1 }
      );
      io.observe(el);
    }
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    if (inView()) show();               // reveal anything visible on mount
    const t = setTimeout(onScroll, 250); // safety re-check after layout settles
    return () => { clearTimeout(t); cleanup(); };
  }, [delay]);
  const Tag = tag as any;
  return <Tag ref={ref} className={'reveal ' + className} style={style}>{children}</Tag>;
}

/* ---- Brand wordmark ---- */
interface BrandProps {
  word?: string;
  light?: boolean;
}

export function Brand({ word, light: _light }: BrandProps) {
  return (
    <a href="#top" className="brand" aria-label="7aba">
      {word || '7aba'}<span className="dot">.app</span>
    </a>
  );
}
