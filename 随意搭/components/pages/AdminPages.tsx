'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/components/DemoProvider';
import { DemoNote, EmptyState, Field, PageIntro } from '@/components/ui';
import { sampleState, StyleTemplate } from '@/lib/demo';

export function AdminPage() {
  const { state, ready } = useDemo();
  if (!ready) return <div className="shell page-loading">正在读取本地数据…</div>;
  const stats = [
    [state.garments.length, '衣橱单品'],
    [state.looks.length, '生成记录'],
    [state.looks.filter(item => item.saved).length, '已收藏'],
    [state.templates.length, '本地模板'],
  ] as const;
  return <div className="shell page">
    <PageIntro kicker="LOCAL DEMO · 管理台" title="这里只管理这台浏览器的数据。" description="没有线上用户、真实生成量或实时运营指标。所有数字都来自当前本地 Demo。" />
    <div className="metric-grid">{stats.map(([value, label]) => <div className="metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="content-grid"><section className="panel"><h2>最近的搭配记录</h2>{state.looks.length ? <div className="data-list">{state.looks.slice(0, 5).map(look => <div key={look.id}><span>{look.scene} · {look.mood}</span><Link className="text-link" href={`/stylist/result?look=${look.id}`}>查看 ↗</Link></div>)}</div> : <p className="muted">还没有生成过搭配。</p>}</section><aside className="aside-card tone-lavender"><p className="eyebrow">MANAGE DEMO</p><h2>让本地数据更好整理。</h2><div className="button-stack"><Link className="btn btn-soft" href="/admin/templates">管理造型模板</Link><Link className="btn btn-soft" href="/admin/users">查看本地档案与重置</Link><Link className="btn btn-soft" href="/closet">回到衣橱</Link></div></aside></div><DemoNote /></div>;
}

export function AdminUsersPage() {
  const { state, ready, update, reset } = useDemo();
  const [message, setMessage] = useState('');
  if (!ready) return <div className="shell page-loading">正在读取本地档案…</div>;
  const filled = [state.profile.height, state.profile.body, state.profile.skin, state.profile.face].filter(Boolean).length;
  return <div className="shell page">
    <PageIntro kicker="LOCAL PROFILE · 非真实用户后台" title="当前浏览器的演示资料。" description="这里没有账号系统、其他用户或真实注册记录。你可以查看档案，也可以清空或恢复示例数据。" />
    <div className="content-grid"><section className="panel"><h2>本地档案概览</h2><div className="data-list"><div><span>已填写基本资料</span><strong>{filled} / 4 项</strong></div><div><span>喜欢的风格</span><strong>{state.profile.styles.join('、') || '尚未填写'}</strong></div><div><span>风格测试</span><strong>{state.profileAnswers.length === 6 ? '已完成' : '未完成'}</strong></div><div><span>衣橱</span><strong>{state.garments.length} 件</strong></div></div><Link className="btn btn-soft" href="/profile">编辑个人档案</Link></section>
    <aside className="aside-card tone-peach"><p className="eyebrow">DATA CONTROL</p><h2>重新开始，也由你决定。</h2><p>清空会移除这台浏览器保存的档案、衣物、搭配、日历、旅行清单和模板。</p><div className="button-stack"><button className="btn btn-soft" onClick={() => { if (window.confirm('确定清空当前浏览器的全部随意搭 Demo 数据吗？此操作无法撤销。')) { reset(); setMessage('本地 Demo 数据已清空。'); } }}>清空本地数据</button><button className="btn btn-soft" onClick={() => { if (window.confirm('恢复示例数据会替换当前全部 Demo 数据，确定继续吗？')) { update(() => sampleState()); setMessage('已恢复示例衣物和模板。'); } }}>恢复示例数据</button></div>{message && <p className="success-note" role="status">{message}</p>}</aside></div><DemoNote /></div>;
}

const blank = { name: '', scene: '上班', mood: '温柔', note: '' };
export function AdminTemplatesPage() {
  const { state, ready, update } = useDemo();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  if (!ready) return <div className="shell page-loading">正在读取模板…</div>;
  const edit = (template: StyleTemplate) => { setEditingId(template.id); setForm({ name: template.name, scene: template.scene, mood: template.mood, note: template.note }); setOpen(true); setError(''); };
  const save = () => {
    if (!form.name.trim()) return setError('请填写模板名称。');
    const value = { ...form, name: form.name.trim(), note: form.note.trim() };
    if (editingId) update(current => ({ ...current, templates: current.templates.map(item => item.id === editingId ? { ...item, ...value } : item) }));
    else update(current => ({ ...current, templates: [{ id: crypto.randomUUID(), ...value }, ...current.templates] }));
    setOpen(false); setEditingId(null); setForm(blank); setError('');
  };
  return <div className="shell page">
    <PageIntro kicker="STYLE TEMPLATES · 本地示例" title="把常用的搭配想法存起来。" description="模板是可编辑的本地笔记，不会改变造型生成规则。" action={<button className="btn btn-dark" onClick={() => { setEditingId(null); setForm(blank); setOpen(true); }}>新建模板 ＋</button>} />
    {open && <section className="panel form-panel template-editor"><h2>{editingId ? '编辑模板' : '新建模板'}</h2><div className="form-grid"><Field label="名称"><input maxLength={40} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></Field><Field label="场合"><select value={form.scene} onChange={event => setForm({ ...form, scene: event.target.value })}>{['上班', '约会', '出游', '聚会', '日常'].map(value => <option key={value}>{value}</option>)}</select></Field><Field label="感觉"><select value={form.mood} onChange={event => setForm({ ...form, mood: event.target.value })}>{['温柔', '清冷', '松弛', '鲜明'].map(value => <option key={value}>{value}</option>)}</select></Field><Field label="搭配提示"><input maxLength={120} value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} /></Field></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="button-row"><button className="btn btn-dark" onClick={save}>保存模板</button><button className="btn btn-soft" onClick={() => setOpen(false)}>取消</button></div></section>}
    {state.templates.length ? <div className="template-grid">{state.templates.map(template => <article className="panel template-card" key={template.id}><p className="eyebrow">{template.scene} · {template.mood}</p><h2>{template.name}</h2><p>{template.note || '还没有填写提示。'}</p><div className="button-row"><button className="text-link" onClick={() => edit(template)}>编辑</button><button className="text-link danger-link" onClick={() => { if (window.confirm(`确定删除模板“${template.name}”吗？`)) update(current => ({ ...current, templates: current.templates.filter(item => item.id !== template.id) })); }}>删除</button></div></article>)}</div> : <EmptyState title="还没有模板" body="创建一条属于自己的搭配笔记，随时回来修改。" />}
    <DemoNote /></div>;
}
