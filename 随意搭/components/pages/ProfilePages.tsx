'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/components/DemoProvider';
import { DemoNote, EmptyState, Field, PageIntro } from '@/components/ui';
import { profileQuestions, profileResult, Profile } from '@/lib/demo';

const choices = {
  body: ['梨形', '苹果形', '沙漏形', '直筒形', '倒三角'],
  skin: ['冷白皮', '自然肤色', '暖黄皮', '小麦色'],
  face: ['圆脸', '鹅蛋脸', '方脸', '长脸', '心形脸'],
};
const styles = ['清冷高级', '法式浪漫', '松弛自然', '极简通勤', '甜酷街头', '复古文艺', '温柔韩系', '轻熟优雅'];

export function ProfilePage() {
  const { state, ready, update, persistent } = useDemo();
  const [draft, setDraft] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const form = draft ?? state.profile;
  const set = (key: keyof Profile, value: string) => { setDraft({ ...form, [key]: value }); setSaved(false); };
  const toggle = (value: string) => {
    setDraft({ ...form, styles: form.styles.includes(value) ? form.styles.filter(x => x !== value) : [...form.styles, value] });
    setSaved(false);
  };
  const completed = [form.height, form.body, form.skin, form.face, form.styles.length].filter(Boolean).length;
  function save() {
    const height = Number(form.height);
    if (form.height && (!Number.isFinite(height) || height < 100 || height > 230)) {
      setError('身高请填写 100–230 之间的数字（厘米）。');
      return;
    }
    update(current => ({ ...current, profile: form }));
    setError('');
    setSaved(true);
  }
  if (!ready) return <div className="shell page-loading">正在读取本地档案…</div>;
  return <div className="shell page">
    <PageIntro kicker="YOUR PROFILE · 本地档案" title="先认识自己，再搭得自在。" description="只填你愿意提供的内容。资料保存在当前浏览器，随时可以修改。" action={<div className="progress-box"><strong>{completed} / 5</strong><span>资料项已填写</span></div>} />
    <div className="content-grid">
      <section className="panel form-panel" aria-label="个人档案">
        <h2>你的基本信息</h2>
        <div className="form-grid">
          <Field label="身高（厘米）"><input inputMode="numeric" value={form.height} onChange={e => set('height', e.target.value)} placeholder="例如 165" /></Field>
          {(['body', 'skin', 'face'] as const).map(key => <Field key={key} label={{ body: '体型', skin: '肤色', face: '脸型' }[key]}><select value={form[key]} onChange={e => set(key, e.target.value)}><option value="">暂不选择</option>{choices[key].map(choice => <option key={choice}>{choice}</option>)}</select></Field>)}
        </div>
        <h2 className="section-subtitle">喜欢的风格</h2>
        <div className="choice-wrap">{styles.map(value => <button type="button" className={`choice-chip ${form.styles.includes(value) ? 'selected' : ''}`} aria-pressed={form.styles.includes(value)} key={value} onClick={() => toggle(value)}>{value}</button>)}</div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="success-note" role="status">{persistent ? '已保存到当前浏览器。' : '本次会话已更新。'}</p>}
        <div className="button-row"><button className="btn btn-dark" onClick={save}>保存档案</button><Link className="btn btn-soft" href="/profile/test">做六题风格测试</Link></div>
      </section>
      <aside className="aside-card tone-peach"><p className="eyebrow">STYLE NOTE</p><h2>风格不需要被定义，<br />但可以被慢慢发现。</h2><p>测试结果会和你的偏好一起，成为本地搭配建议的参考。</p><DemoNote /></aside>
    </div>
  </div>;
}

export function ProfileTestPage() {
  const { state, ready, update } = useDemo();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<number[] | null>(null);
  const answers = draft ?? state.profileAnswers;
  const question = profileQuestions[step];
  if (!ready) return <div className="shell page-loading">正在准备测试…</div>;
  const choose = (index: number) => {
    const next = [...answers];
    next[step] = index;
    setDraft(next);
  };
  const advance = async () => {
    if (answers[step] === undefined) return;
    if (step === profileQuestions.length - 1) {
      await update(current => ({ ...current, profileAnswers: answers }));
      router.push('/profile/test/result');
    } else setStep(step + 1);
  };
  return <div className="shell page narrow-page">
    <PageIntro kicker={`STYLE TEST · ${String(step + 1).padStart(2, '0')} / 06`} title={question.title} description="没有标准答案，选最接近你的一项。" />
    <div className="step-track"><span style={{ width: `${((step + 1) / 6) * 100}%` }} /></div>
    <div className="option-grid">{question.options.map((option, index) => <button className={`option-card ${answers[step] === index ? 'selected' : ''}`} aria-pressed={answers[step] === index} onClick={() => choose(index)} key={option}><span className="option-index">0{index + 1}</span><strong>{option}</strong><span className="option-arrow" aria-hidden="true">↗</span></button>)}</div>
    <div className="button-row space-between"><button className="btn btn-soft" disabled={step === 0} onClick={() => setStep(step - 1)}>上一题</button><button className="btn btn-dark" disabled={answers[step] === undefined} onClick={advance}>{step === 5 ? '查看结果' : '下一题'}</button></div>
    <DemoNote>结果按六题选择统计，不代表专业测评。</DemoNote>
  </div>;
}

export function ProfileResultPage() {
  const { state, ready } = useDemo();
  if (!ready) return <div className="shell page-loading">正在读取结果…</div>;
  if (state.profileAnswers.length !== profileQuestions.length) return <div className="shell page"><EmptyState title="还没有完整的测试结果" body="完成六道题后，这里会展示根据你答案整理的风格方向。" href="/profile/test" action="开始测试" /></div>;
  const result = profileResult(state.profileAnswers);
  return <div className="shell page">
    <PageIntro kicker="YOUR STYLE · 演示结果" title={`你更靠近「${result.name}」`} description="这只是你当前答案呈现的倾向，不是对个人风格的固定判断。" />
    <div className="content-grid">
      <section className="panel"><h2>为什么是这个方向？</h2><p className="body-copy">六题中，你选择这类方向 {result.counts[result.counts.indexOf(Math.max(...result.counts))]} 次。结果由选项计数得出，没有使用图像或 AI 模型分析。</p><div className="choice-wrap">{result.keywords.map(word => <span className="choice-chip static" key={word}>{word}</span>)}</div><div className="button-row"><Link className="btn btn-dark" href="/closet/upload">添加衣物，开始搭配</Link><Link className="btn btn-soft" href="/profile/test">重新测试</Link></div></section>
      <aside className="aside-card tone-lavender"><p className="eyebrow">NEXT STEP</p><h2>从你已经拥有的衣服开始。</h2><p>加入几件常穿的单品，让下一套搭配更具体。</p></aside>
    </div>
    <DemoNote />
  </div>;
}
