'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, X } from '@phosphor-icons/react';
import { useState } from 'react';

const primary = [['/', '首页'], ['/profile', '我的风格'], ['/closet', '我的衣橱'], ['/stylist', '造型师'], ['/looks', '我的搭配']] as const;
const more = [['/style-personality', '风格人格'], ['/closet/score', '衣橱分析'], ['/beauty-plan', '变美计划'], ['/calendar', '穿搭日历'], ['/travel', '旅行清单'], ['/try-on', '搭配预览']] as const;

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);
  return <header className="site-nav"><div className="site-nav-inner"><Link href="/" className="brand-mark" onClick={() => setOpen(false)}><span className="brand-avatar"><Image src="/brand/suiyida-avatar.png" alt="" width={38} height={38} /></span><span>随意搭</span><small>STYLE YOUR DAY</small></Link>
    <nav className="desktop-nav" aria-label="主要导航">{primary.map(([href, label]) => <Link href={href} className={active(href) ? 'active' : ''} key={href}>{label}</Link>)}<details className="nav-more"><summary>更多灵感</summary><div className="more-menu">{more.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</div></details></nav>
    <div className="nav-actions"><a className="nav-compare" href={`/legacy${path === '/' ? '' : path}`}>旧版对比 ↗</a><Link className="nav-admin" href="/admin">本地管理 ↗</Link><button className="mobile-menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)} aria-label={open ? '关闭菜单' : '打开菜单'}>{open ? <X size={23} /> : <List size={23} />}</button></div></div>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label="移动端导航">{[...primary, ...more, ['/admin', '本地管理'] as const].map(([href, label]) => <Link href={href} onClick={() => setOpen(false)} className={active(href) ? 'active' : ''} key={href}>{label}<span>↗</span></Link>)}<a href={`/legacy${path === '/' ? '' : path}`}>旧版对比<span>↗</span></a></nav>}</header>;
}
