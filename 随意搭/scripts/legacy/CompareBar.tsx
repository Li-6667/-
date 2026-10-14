'use client';

import { usePathname } from 'next/navigation';

export default function CompareBar() {
  const path = usePathname().replace(/^\/legacy(?=\/|$)/, '') || '/';
  return <aside className="legacy-compare-bar" aria-label="新旧版对比">
    <span><strong>旧版对比</strong> · 改版前原始 Demo，展示模拟数据</span>
    <div><a href={path}>查看新版同页 ↗</a><a href="/">新版首页</a></div>
  </aside>;
}
