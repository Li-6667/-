'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDemo } from '@/components/DemoProvider';
import { DemoNote, EmptyState, Field, GarmentImage, PageIntro } from '@/components/ui';
import { personalityQuestions, personalityResult, travelList, TravelPlan } from '@/lib/demo';
import { prepareGarmentImage } from '@/lib/images';

const today = () => new Date().toLocaleDateString('en-CA');

export function PersonalityPage() {
  const { state, ready, update } = useDemo();
  const [draft, setDraft] = useState<number[] | null>(null);
  const [step, setStep] = useState(0);
  const answers = draft ?? state.personalityAnswers;
  if (!ready) return <div className="shell page-loading">正在读取测试…</div>;
  const complete = answers.length === 3 && answers.every(value => value !== undefined);
  const choose = (index: number) => {
    const next = [...answers]; next[step] = index; setDraft(next);
    if (step === 2) update(current => ({ ...current, personalityAnswers: next }));
    else setStep(step + 1);
  };
  return <div className="shell page narrow-page">
    <PageIntro kicker="STYLE PERSONALITY · 三个问题" title="再认识自己的另一面。" description="答案只用于当前浏览器里的演示，不是心理测评。" />
    {complete ? <div className="panel result-panel"><p className="eyebrow">YOUR DIRECTION</p><h2>{personalityResult(answers)}</h2><p>根据三个选项中出现最多的方向整理；如果并列，按最先出现的方向展示。</p><div className="button-row"><button className="btn btn-soft" onClick={() => { setDraft([]); setStep(0); update(current => ({ ...current, personalityAnswers: [] })); }}>重新回答</button><Link className="btn btn-dark" href="/stylist">用这个方向搭配</Link></div></div> : <><div className="step-track"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div><h2 className="question-title">{personalityQuestions[step].title}</h2><div className="option-grid">{personalityQuestions[step].options.map((option, index) => <button className="option-card" onClick={() => choose(index)} key={option}><span className="option-index">0{index + 1}</span><strong>{option}</strong></button>)}</div>{step > 0 && <button className="btn btn-soft" onClick={() => setStep(step - 1)}>上一题</button>}</>}
    <DemoNote />
  </div>;
}

const tasks = [
  ['选好今天的衣服', '从现有衣橱里挑一套，不必额外购买。'],
  ['打理头发', '留几分钟整理发型，让自己舒服。'],
  ['选一处点缀', '配饰、香气或唇色，选一样就好。'],
  ['给自己留一点时间', '穿衣之外，也照顾今天的心情。'],
];
export function BeautyPlanPage() {
  const { state, ready, update } = useDemo();
  const date = today();
  const checked = state.beauty[date] || [];
  if (!ready) return <div className="shell page-loading">正在读取今日计划…</div>;
  return <div className="shell page">
    <PageIntro kicker="TODAY'S PLAN · 每日小计划" title="今天，先照顾好自己。" description={`${date} · 已完成 ${checked.length} / ${tasks.length} 项；换一天会开始新的记录。`} />
    <div className="task-list">{tasks.map(([title, description], index) => <button className={`task-row ${checked.includes(index) ? 'done' : ''}`} aria-pressed={checked.includes(index)} key={title} onClick={() => update(current => { const previous = current.beauty[date] || []; const next = previous.includes(index) ? previous.filter(value => value !== index) : [...previous, index]; return { ...current, beauty: { ...current.beauty, [date]: next } }; })}><span className="task-check">{checked.includes(index) ? '✓' : String(index + 1).padStart(2, '0')}</span><span><strong>{title}</strong><small>{description}</small></span></button>)}</div>
    <div className="button-row"><Link className="btn btn-soft" href="/stylist">挑一套今天的搭配</Link></div><DemoNote>完成状态仅保存在当前浏览器。</DemoNote>
  </div>;
}

export function CalendarPage() {
  const { state, ready, update } = useDemo();
  const [date, setDate] = useState(today());
  const [lookId, setLookId] = useState('');
  const [message, setMessage] = useState('');
  if (!ready) return <div className="shell page-loading">正在读取日历…</div>;
  const available = state.looks.filter(look => look.saved);
  const assignment = state.calendar[date];
  const selected = state.looks.find(look => look.id === assignment);
  const assign = () => {
    const id = lookId || available[0]?.id;
    if (!id) return setMessage('请先收藏一套搭配。');
    update(current => ({ ...current, calendar: { ...current.calendar, [date]: id } }));
    setMessage('已安排到所选日期。');
  };
  return <div className="shell page">
    <PageIntro kicker="OUTFIT CALENDAR · 本地日历" title="把喜欢的搭配，留给那一天。" description="选择日期和已收藏的搭配，安排会保存在当前浏览器。" />
    <div className="content-grid"><section className="panel form-panel"><Field label="选择日期"><input type="date" value={date} onChange={event => { setDate(event.target.value); setMessage(''); }} /></Field>{available.length ? <><Field label="选择已收藏搭配"><select value={lookId} onChange={event => setLookId(event.target.value)}><option value="">选择一套（默认第一套）</option>{available.map(look => <option value={look.id} key={look.id}>{look.scene} · {look.mood} · {new Date(look.createdAt).toLocaleDateString('zh-CN')}</option>)}</select></Field><div className="button-row"><button className="btn btn-dark" onClick={assign}>安排到这一天</button>{assignment && <button className="btn btn-soft" onClick={() => { update(current => { const calendar = { ...current.calendar }; delete calendar[date]; return { ...current, calendar }; }); setMessage('已取消安排。'); }}>取消安排</button>}</div></> : <EmptyState title="还没有可安排的搭配" body="先生成并收藏一套搭配，再回来选择日期。" href="/stylist" action="去生成搭配" />}{message && <p className="success-note" role="status">{message}</p>}</section>
    <aside className="aside-card tone-lavender"><p className="eyebrow">{date || 'SELECT A DATE'}</p><h2>{selected ? `${selected.scene} · ${selected.mood}` : '这一天还没有安排。'}</h2><p>{selected ? selected.garmentIds.map(id => state.garments.find(item => item.id === id)?.name || '已删除单品').join(' + ') : '可以留白，也可以先去收藏一套喜欢的造型。'}</p>{selected && <Link className="btn btn-soft" href={`/stylist/result?look=${selected.id}`}>查看这套搭配</Link>}</aside></div>
    <DemoNote />
  </div>;
}

export function TravelPage() {
  const { state, ready, update } = useDemo();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [scene, setScene] = useState('出游');
  const [error, setError] = useState('');
  if (!ready) return <div className="shell page-loading">正在读取旅行清单…</div>;
  const generate = () => {
    const count = Number(days);
    if (!destination.trim()) return setError('请填写目的地。');
    if (!Number.isInteger(count) || count < 1 || count > 30) return setError('天数请填写 1–30 之间的整数。');
    if (!state.garments.length) return setError('衣橱还没有衣物，请先添加。');
    const plan: TravelPlan = { id: crypto.randomUUID(), destination: destination.trim(), days: count, scene, items: travelList(state, count, scene), createdAt: new Date().toISOString() };
    update(current => ({ ...current, travelPlans: [plan, ...current.travelPlans] }));
    setError('');
  };
  return <div className="shell page">
    <PageIntro kicker="TRAVEL CAPSULE · 打包清单" title="旅行带什么，让衣橱先回答。" description="按天数和场合，从已有衣物里整理一份可保存的参考清单。" />
    <div className="content-grid"><section className="panel form-panel"><div className="form-grid"><Field label="目的地"><input maxLength={40} value={destination} onChange={event => setDestination(event.target.value)} placeholder="例如：杭州" /></Field><Field label="天数"><input type="number" min="1" max="30" value={days} onChange={event => setDays(event.target.value)} /></Field><Field label="主要场合"><select value={scene} onChange={event => setScene(event.target.value)}>{['出游', '上班', '聚会', '日常'].map(value => <option key={value}>{value}</option>)}</select></Field></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="button-row"><button className="btn btn-dark" onClick={generate}>生成并保存清单</button><Link className="btn btn-soft" href="/closet">查看衣橱</Link></div></section><aside className="aside-card tone-mint"><p className="eyebrow">PACK LIGHT</p><h2>从你有的衣服开始。</h2><p>这份清单不会预测天气，也不会建议购买不存在于衣橱的单品。</p></aside></div>
    <section className="lower-section"><h2>保存的旅行清单</h2>{state.travelPlans.length ? <div className="look-library">{state.travelPlans.map(plan => <article className="panel" key={plan.id}><p className="eyebrow">{plan.days} 天 · {plan.scene}</p><h3>{plan.destination}</h3><ul className="plain-list">{plan.items.map((item, index) => <li key={index}>{item}</li>)}</ul><button className="text-link danger-link" onClick={() => { if (window.confirm('确定删除这份旅行清单吗？')) update(current => ({ ...current, travelPlans: current.travelPlans.filter(item => item.id !== plan.id) })); }}>删除清单</button></article>)}</div> : <p className="muted">还没有保存过旅行清单。</p>}</section><DemoNote>打包数量按天数取现有单品的有限集合，仅供整理参考。</DemoNote>
  </div>;
}

export function TryOnPage() {
  const { state, ready } = useDemo();
  const [portrait, setPortrait] = useState('');
  const [garmentId, setGarmentId] = useState('');
  const [error, setError] = useState('');
  const garment = state.garments.find(item => item.id === garmentId) || state.garments[0];
  if (!ready) return <div className="shell page-loading">正在准备预览…</div>;
  const choose = async (file?: File) => {
    if (!file) return;
    try { setPortrait(await prepareGarmentImage(file)); setError(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : '无法读取照片。'); }
  };
  return <div className="shell page">
    <PageIntro kicker="PAIRING PREVIEW · 本地预览" title="先把人和衣服，放在一起看看。" description="并排对照照片与衣物，不会合成真实上身效果。人物照片不会被保存，离开页面即清除。" />
    <div className="content-grid"><section className="panel form-panel"><Field label="选择一张自己的照片" hint="JPG、PNG、WebP；最大 10 MB。仅在此页面预览。"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => choose(event.target.files?.[0])} /></Field>{error && <p className="form-error" role="alert">{error}</p>}{state.garments.length ? <Field label="选择要对照的衣物"><select value={garmentId} onChange={event => setGarmentId(event.target.value)}><option value="">选择一件（默认第一件）</option>{state.garments.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></Field> : <EmptyState title="衣橱里还没有衣物" body="添加一件衣服后，才能在这里并排预览。" href="/closet/upload" action="添加衣物" />}</section>
    <aside className="aside-card tone-lavender"><p className="eyebrow">SIDE BY SIDE</p><div className="preview-pair"><div className="garment-image">{portrait ? <Image src={portrait} alt="你选择的人物照片" fill unoptimized sizes="220px" /> : <span>人物照片待选择</span>}</div>{garment && <GarmentImage src={garment.image} alt={garment.name} />}</div><p>这里是照片与单品并排预览，并非虚拟试穿或尺寸效果预测。</p></aside></div><DemoNote>没有使用人体识别、图像生成或真实试穿算法。</DemoNote>
  </div>;
}
