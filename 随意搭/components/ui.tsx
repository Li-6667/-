import Link from 'next/link';
import Image from 'next/image';

export function PageIntro({ kicker, title, description, action }: { kicker: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1>{description && <p className="intro-copy">{description}</p>}</div>{action}</div>;
}
export function DemoNote({ children }: { children?: React.ReactNode }) {
  return <p className="demo-note">本地演示 · {children ?? '数据仅保存在当前浏览器，不使用真实 AI。'}</p>;
}
export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return <div className="empty-state"><span className="empty-mark" aria-hidden="true">✦</span><h2>{title}</h2><p>{body}</p>{href && <Link className="btn btn-dark" href={href}>{action || '继续'}</Link>}</div>;
}
export function GarmentImage({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return <div className={`garment-image ${className}`}>{src ? <Image src={src} alt={alt} fill unoptimized={src.startsWith('data:')} loading={eager ? 'eager' : 'lazy'} sizes="(max-width: 768px) 90vw, 320px" /> : <span aria-hidden="true">暂无图片</span>}</div>;
}
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
