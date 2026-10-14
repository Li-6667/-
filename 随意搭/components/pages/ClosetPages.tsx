'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/components/DemoProvider';
import { DemoNote, EmptyState, Field, GarmentImage, PageIntro } from '@/components/ui';
import { prepareGarmentImage } from '@/lib/images';
import { Garment } from '@/lib/demo';

export function ClosetPage() {
  const { state, ready, update } = useDemo();
  const [filter, setFilter] = useState('全部');
  if (!ready) return <div className="shell page-loading">正在读取衣橱…</div>;
  const categories = ['全部', ...new Set(state.garments.map(item => item.category))];
  const items = filter === '全部' ? state.garments : state.garments.filter(item => item.category === filter);
  return <div className="shell page">
    <PageIntro kicker="MY CLOSET · 本地衣橱" title="衣服都在这里，灵感也在。" description={`当前有 ${state.garments.length} 件单品。添加自己的照片，或先用示例衣物试试完整流程。`} action={<Link className="btn btn-dark" href="/closet/upload">添加衣物 ↗</Link>} />
    <div className="toolbar"><div className="choice-wrap">{categories.map(category => <button className={`choice-chip ${filter === category ? 'selected' : ''}`} aria-pressed={filter === category} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div><Link className="text-link" href="/closet/score">查看衣橱分析 ↗</Link></div>
    {items.length ? <div className="garment-grid">{items.map((item, index) => <article className="garment-card" key={item.id}><GarmentImage src={item.image} alt={item.name} eager={index === 0} /><div className="garment-meta"><div className="eyebrow">{item.sample ? '示例单品' : item.category}</div><h2>{item.name}</h2><p>{item.color} · {item.season} · {item.occasion}</p><button className="text-link danger-link" onClick={() => { if (window.confirm(`确定删除“${item.name}”吗？已保存的搭配会保留，但不再显示这件衣物。`)) update(current => ({ ...current, garments: current.garments.filter(x => x.id !== item.id) })); }}>删除单品</button></div></article>)}</div> : <EmptyState title={filter === '全部' ? '衣橱还是空的' : '这个分类还没有衣物'} body="添加一张衣服照片和基本信息，就能开始用自己的衣橱搭配。" href="/closet/upload" action="添加第一件衣物" />}
    <DemoNote>示例照片只用于体验；个人上传的照片仅保存在此浏览器。</DemoNote>
  </div>;
}

export function ClosetUploadPage() {
  const { update } = useDemo();
  const router = useRouter();
  const [image, setImage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('上衣');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('四季');
  const [occasion, setOccasion] = useState('日常');
  async function choose(file?: File) {
    if (!file) return;
    setBusy(true); setError('');
    try { setImage(await prepareGarmentImage(file)); if (!name) setName(file.name.replace(/\.[^.]+$/, '').slice(0, 30)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : '图片无法读取。'); }
    finally { setBusy(false); }
  }
  async function save() {
    if (!image) return setError('请先选择一张衣物照片。');
    if (!name.trim()) return setError('请填写单品名称。');
    const item: Garment = { id: crypto.randomUUID(), name: name.trim(), category, color: color.trim() || '未填写', season, occasion, image };
    await update(current => ({ ...current, garments: [item, ...current.garments] }));
    router.push('/closet');
  }
  return <div className="shell page">
    <PageIntro kicker="ADD A GARMENT" title="把常穿的那件，也放进来。" description="选择照片后请亲自确认分类与信息；这里不会假装完成 AI 图像识别。" />
    <div className="content-grid">
      <section className="panel form-panel"><Field label="衣物照片" hint="JPG、PNG、WebP；最大 10 MB。只存于当前浏览器。"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => choose(event.target.files?.[0])} /></Field>{image && <GarmentImage src={image} alt="待添加衣物预览" className="upload-preview" />}{busy && <p role="status">正在处理照片…</p>}
      <div className="form-grid"><Field label="单品名称"><input maxLength={40} value={name} onChange={event => setName(event.target.value)} placeholder="例如：浅色针织上衣" /></Field><Field label="分类"><select value={category} onChange={event => setCategory(event.target.value)}>{['上衣', '下装', '外套', '鞋包', '配饰'].map(value => <option key={value}>{value}</option>)}</select></Field><Field label="颜色"><input value={color} onChange={event => setColor(event.target.value)} placeholder="例如：米白" /></Field><Field label="季节"><select value={season} onChange={event => setSeason(event.target.value)}>{['四季', '春秋', '夏季', '冬季'].map(value => <option key={value}>{value}</option>)}</select></Field><Field label="适用场合"><select value={occasion} onChange={event => setOccasion(event.target.value)}>{['日常', '上班', '约会', '出游', '聚会'].map(value => <option key={value}>{value}</option>)}</select></Field></div>
      {error && <p className="form-error" role="alert">{error}</p>}<div className="button-row"><button disabled={busy} className="btn btn-dark" onClick={save}>保存到衣橱</button><Link className="btn btn-soft" href="/closet">返回衣橱</Link></div></section>
      <aside className="aside-card tone-mint"><p className="eyebrow">A BETTER START</p><h2>不需要一次上传所有衣服。</h2><p>先从上衣、下装和一件外套开始，搭配建议就会更有依据。</p></aside>
    </div>
    <DemoNote>照片压缩后存于本地 IndexedDB，不上传到服务器。</DemoNote>
  </div>;
}

export function ClosetScorePage() {
  const { state, ready } = useDemo();
  if (!ready) return <div className="shell page-loading">正在整理衣橱…</div>;
  if (!state.garments.length) return <div className="shell page"><EmptyState title="衣橱还没有可分析的单品" body="添加衣物后，这里会按类别、颜色和场合整理现有衣橱。" href="/closet/upload" action="添加衣物" /></div>;
  const categories = [...new Set(state.garments.map(item => item.category))];
  const occasions = [...new Set(state.garments.map(item => item.occasion))];
  const colors = [...new Set(state.garments.map(item => item.color))];
  const missing = ['上衣', '下装', '外套'].filter(value => !categories.includes(value));
  return <div className="shell page">
    <PageIntro kicker="CLOSET OVERVIEW · 本地规则" title="看清已有的，再决定要不要添新的。" description="这不是审美评分，而是按已录入单品整理的覆盖情况。" />
    <div className="metric-grid"><div className="metric"><strong>{state.garments.length}</strong><span>件单品</span></div><div className="metric"><strong>{categories.length}</strong><span>种类别</span></div><div className="metric"><strong>{colors.length}</strong><span>种颜色</span></div><div className="metric"><strong>{occasions.length}</strong><span>种场合</span></div></div>
    <div className="content-grid"><section className="panel"><h2>当前衣橱结构</h2><div className="data-list">{categories.map(category => <div key={category}><span>{category}</span><strong>{state.garments.filter(item => item.category === category).length} 件</strong></div>)}</div></section><aside className="aside-card tone-lavender"><p className="eyebrow">NEXT IDEA</p><h2>{missing.length ? `还可以试试加入${missing[0]}。` : '基础类别已经齐了。'}</h2><p>{missing.length ? '只是覆盖提醒，不代表你必须购买新衣。' : '从现有单品里尝试新的组合，比追求分数更有趣。'}</p><Link className="btn btn-soft" href="/stylist">用现有衣物试搭配</Link></aside></div>
    <DemoNote>数量直接来自当前浏览器的衣橱记录。</DemoNote>
  </div>;
}
