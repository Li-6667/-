'use client';

import { useRef, useState } from 'react';
import { Copy, Check, ArrowSquareOut } from '@phosphor-icons/react';
import { guideLessons } from '@/lib/upgrade-guide';
import styles from '@/app/upgrade/upgrade.module.css';

export function PromptCopy({ text, label = '复制指令' }: { text: string; label?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const fallback = useRef<HTMLTextAreaElement>(null);
  async function copy() {
    try { await navigator.clipboard.writeText(text); setStatus('copied'); }
    catch { setStatus('failed'); }
  }
  return <div className={styles.copyWrap}>
    <button className={styles.copyButton} onClick={copy}>{status === 'copied' ? <Check size={17} /> : <Copy size={17} />}{status === 'copied' ? '已复制' : label}</button>
    <span role="status" className={styles.copyStatus}>{status === 'copied' ? '可以粘贴到 Codex 了。' : status === 'failed' ? '请选中下面的文字手动复制。' : ''}</span>
    {status === 'failed' && <textarea ref={fallback} aria-label="手动复制指令" readOnly value={text} onFocus={() => fallback.current?.select()} className={styles.copyFallback} />}
  </div>;
}

export function LiveComparison() {
  const [version, setVersion] = useState<'new' | 'old'>('new');
  const source = version === 'new' ? '/' : '/legacy';
  return <div className={styles.preview}>
    <div className={styles.previewToolbar}>
      <div className={styles.segmented} role="group" aria-label="选择对比版本">
        <button aria-pressed={version === 'old'} onClick={() => setVersion('old')}>改版前</button>
        <button aria-pressed={version === 'new'} onClick={() => setVersion('new')}>升级后</button>
      </div>
      <a href={source} target="_blank" rel="noreferrer">打开完整页面 <ArrowSquareOut size={16} /></a>
    </div>
    <iframe key={version} className={styles.previewFrame} src={source} title={version === 'new' ? '升级后首页实况' : '改版前首页实况'} loading="lazy" />
    <p className={styles.previewCaption}>这里载入的是实际网站。可以在框内滚动，也可以打开完整页面对照。</p>
  </div>;
}

export function CodexLessons() {
  const [selected, setSelected] = useState(0);
  const lesson = guideLessons[selected];
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  function move(index: number) {
    const next = (index + guideLessons.length) % guideLessons.length;
    setSelected(next);
    tabs.current[next]?.focus();
  }
  return <div className={styles.lessonStudio}>
    <div className={styles.lessonTabs} role="tablist" aria-label="Codex 实战流程">
      {guideLessons.map((item, index) => <button key={item.id} ref={node => { tabs.current[index] = node; }} id={`tab-${item.id}`} role="tab" aria-selected={selected === index} aria-controls={selected === index ? `lesson-${item.id}` : undefined} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(index + 1); }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(index - 1); }
        if (event.key === 'Home') { event.preventDefault(); move(0); }
        if (event.key === 'End') { event.preventDefault(); move(guideLessons.length - 1); }
      }}><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</button>)}
    </div>
    <div key={lesson.id} id={`lesson-${lesson.id}`} className={styles.lessonPanel} role="tabpanel" aria-labelledby={`tab-${lesson.id}`} tabIndex={0}>
      <div className={styles.lessonHeading}><span className={styles.lessonNumber}>{String(selected + 1).padStart(2, '0')}</span><div><h3>{lesson.title}</h3><p>{lesson.instruction}</p></div></div>
      <div className={styles.deliverable}><strong>这一轮要拿到</strong><p>{lesson.deliverable}</p></div>
      <div className={styles.promptText}><span>发给 Codex 的指令</span><p>{lesson.prompt}</p></div>
      <PromptCopy key={`copy-${lesson.id}`} text={lesson.prompt} />
      <div className={styles.lessonPager}><button disabled={selected === 0} onClick={() => move(selected - 1)}>上一项</button><span>{selected + 1} / {guideLessons.length}</span><button disabled={selected === guideLessons.length - 1} onClick={() => move(selected + 1)}>下一项 →</button></div>
    </div>
  </div>;
}
