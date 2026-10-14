'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemo } from '@/components/DemoProvider';
import { DemoNote, EmptyState, GarmentImage, PageIntro } from '@/components/ui';
import { Garment, Look, makeLook, replaceGarment } from '@/lib/demo';

function LookGarments({ look, garments, onReplace }: { look: Look; garments: Garment[]; onReplace?: (id: string) => void }) {
  return <div className="look-items">{look.garmentIds.map(id => {
    const item = garments.find(x => x.id === id);
    const alternative = item && garments.some(x => x.category === item.category && x.id !== item.id && !look.garmentIds.includes(x.id));
    return <div className="look-item" key={id}>{item ? <><GarmentImage src={item.image} alt={item.name} /><div><strong>{item.name}</strong><span>{item.category} · {item.color}</span></div>{onReplace && <button className="text-link" disabled={!alternative} onClick={() => onReplace(id)}>{alternative ? '换一件' : '无可替换单品'}</button>}</> : <><div className="garment-image missing">已移除</div><div><strong>原衣物已删除</strong><span>不会影响保存的说明</span></div></>}</div>;
  })}</div>;
}

export function StylistPage() {
  const { state, ready, update } = useDemo();
  const router = useRouter();
  const [scene, setScene] = useState('上班');
  const [temperature, setTemperature] = useState('20');
  const [mood, setMood] = useState('温柔');
  const [error, setError] = useState('');
  async function generate() {
    const value = Number(temperature);
    if (!Number.isFinite(value) || value < -30 || value > 50) return setError('温度请填写 -30 到 50 之间的数字。');
    if (!state.garments.length) return setError('先在衣橱添加至少一件衣物。');
    const look = makeLook(state, scene, `${value}℃`, mood);
    await update(current => ({ ...current, looks: [look, ...current.looks], latestLookId: look.id }));
    router.push(`/stylist/result?look=${encodeURIComponent(look.id)}`);
  }
  if (!ready) return <div className="shell page-loading">正在准备造型台…</div>;
  return <div className="shell page">
    <PageIntro kicker="PERSONAL STYLIST · 本地演示" title="告诉我场合，从现有衣橱里选。" description="你提供场合、温度和想要的感觉；演示规则再从当前衣橱挑出可用单品。" />
    <div className="content-grid">
      <section className="panel form-panel"><h2>这次要去哪里？</h2><div className="choice-wrap">{['上班', '约会', '出游', '聚会', '日常'].map(value => <button className={`choice-chip ${scene === value ? 'selected' : ''}`} aria-pressed={scene === value} onClick={() => setScene(value)} key={value}>{value}</button>)}</div>
      <div className="form-grid mid-gap"><label className="field"><span>温度（℃）</span><input type="number" min="-30" max="50" value={temperature} onChange={event => setTemperature(event.target.value)} /></label><div className="field"><span>想要的感觉</span><div className="choice-wrap">{['温柔', '清冷', '松弛', '鲜明'].map(value => <button className={`choice-chip ${mood === value ? 'selected' : ''}`} aria-pressed={mood === value} onClick={() => setMood(value)} key={value}>{value}</button>)}</div></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}<div className="button-row"><button className="btn btn-dark" onClick={generate}>生成一套搭配 ↗</button><Link className="btn btn-soft" href="/closet">查看衣橱</Link></div></section>
      <aside className="aside-card tone-lavender"><p className="eyebrow">YOUR BRIEF</p><h2>{scene} · {temperature || '—'}℃<br />想要{mood}一点。</h2><p>当前可选 {state.garments.length} 件衣物。没有适合某一类的单品时，建议会如实留空。</p><DemoNote>本地规则给出参考，不是实时 AI 造型服务。</DemoNote></aside>
    </div>
  </div>;
}

export function StylistResultPage() {
  const { state, ready, update } = useDemo();
  const queryId = useSearchParams().get('look');
  const [message, setMessage] = useState('');
  if (!ready) return <div className="shell page-loading">正在读取搭配…</div>;
  const look = state.looks.find(item => item.id === (queryId || state.latestLookId));
  if (!look) return <div className="shell page"><EmptyState title="还没有可查看的搭配" body="告诉造型师你的场合，生成的结果会保存在当前浏览器。" href="/stylist" action="开始搭配" /></div>;
  const replace = (id: string) => {
    const next = replaceGarment(look, state, id);
    if (next === look) return setMessage('同类衣物暂时没有可替换项。');
    update(current => ({ ...current, looks: current.looks.map(item => item.id === look.id ? next : item) }));
    setMessage('已替换为衣橱中的另一件同类单品。');
  };
  const save = () => {
    update(current => ({ ...current, looks: current.looks.map(item => item.id === look.id ? { ...item, saved: !item.saved } : item) }));
    setMessage(look.saved ? '已从收藏中移除。' : '已收藏，可在“我的搭配”中查看。');
  };
  const share = async () => {
    const garmentNames = look.garmentIds.map(id => state.garments.find(item => item.id === id)?.name).filter(Boolean).join(' + ');
    const text = `随意搭搭配清单：${look.scene} / ${look.temperature} / ${look.mood}\n衣物：${garmentNames}\n妆容：${look.makeup}\n发型：${look.hair}\n配饰：${look.accessory}`;
    try {
      if (navigator.share) { await navigator.share({ title: '我的搭配清单', text }); setMessage('已打开系统分享。'); }
      else if (navigator.clipboard) { await navigator.clipboard.writeText(text); setMessage('文字清单已复制。'); }
      else setMessage(text);
    } catch (error) { if (error instanceof Error && error.name !== 'AbortError') setMessage('分享失败，请重试。'); }
  };
  return <div className="shell page">
    <PageIntro kicker="YOUR LOOK · 本地演示结果" title={`${look.scene}的这一套，刚刚好。`} description={`${look.temperature} · ${look.mood} · ${new Date(look.createdAt).toLocaleDateString('zh-CN')}`} />
    <div className="content-grid"><section className="panel"><h2>来自你衣橱的单品</h2>{look.garmentIds.length ? <LookGarments look={look} garments={state.garments} onReplace={replace} /> : <p>还没有衣物可以搭配。</p>}<div className="button-row"><button className="btn btn-dark" onClick={save}>{look.saved ? '取消收藏' : '收藏这套搭配'}</button><button className="btn btn-soft" onClick={share}>分享文字清单</button><Link className="btn btn-soft" href="/calendar">安排到日历</Link></div>{message && <p className="success-note" role="status">{message}</p>}</section>
    <aside className="aside-card tone-peach"><p className="eyebrow">THE FINISHING TOUCH</p><h2>把细节也想好。</h2><div className="data-list"><div><span>妆容</span><strong>{look.makeup}</strong></div><div><span>发型</span><strong>{look.hair}</strong></div><div><span>配饰</span><strong>{look.accessory}</strong></div></div><p>{look.note}</p></aside></div>
    <DemoNote>这套建议由当前衣橱和输入条件按固定规则生成，不代表专业造型意见。</DemoNote>
  </div>;
}

export function LooksPage() {
  const { state, ready, update } = useDemo();
  if (!ready) return <div className="shell page-loading">正在读取收藏…</div>;
  const saved = state.looks.filter(look => look.saved);
  return <div className="shell page"><PageIntro kicker="LOOK LIBRARY · 本地收藏" title="想再穿一次的搭配。" description={`已收藏 ${saved.length} 套。你可以随时回到结果页继续调整。`} action={<Link className="btn btn-dark" href="/stylist">新建搭配 ↗</Link>} />
    {saved.length ? <div className="look-library">{saved.map(look => <article className="panel look-summary" key={look.id}><div><p className="eyebrow">{look.scene} · {look.temperature}</p><h2>{look.mood}的一天</h2><p>{look.garmentIds.map(id => state.garments.find(item => item.id === id)?.name || '已删除单品').join(' + ')}</p><small>{new Date(look.createdAt).toLocaleDateString('zh-CN')}</small></div><div className="button-row"><Link className="btn btn-soft" href={`/stylist/result?look=${look.id}`}>查看与调整</Link><button className="text-link danger-link" onClick={() => { if (window.confirm('确定从收藏中移除这套搭配吗？结果记录仍会保留。')) update(current => ({ ...current, looks: current.looks.map(item => item.id === look.id ? { ...item, saved: false } : item) })); }}>取消收藏</button></div></article>)}</div> : <EmptyState title="还没有收藏" body="生成搭配后，点“收藏这套搭配”，就能在这里找到它。" href="/stylist" action="开始搭配" />}
    <DemoNote /></div>;
}
