'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkle, TShirt, Heart } from '@phosphor-icons/react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const steps = [
  { n: '01', title: '认识你的风格', detail: '从几道轻松的问题开始，留下自己的偏好。', href: '/profile', icon: Sparkle },
  { n: '02', title: '整理现有衣橱', detail: '把常穿的单品放进来，搭配才有真实依据。', href: '/closet', icon: TShirt },
  { n: '03', title: '搭出今天的自己', detail: '选择场合和心情，看看衣橱里有哪些可能。', href: '/stylist', icon: Heart },
];
export default function Home() {
  const hero = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const girlsY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  return <div className="home">
    <section ref={hero} className="home-hero">
      <div className="hero-grain" aria-hidden="true" />
      <div className="shell hero-layout">
        <motion.div className="hero-copy" style={reduce ? undefined : { y: copyY }}>
          <div className="hero-kicker"><span className="hero-star">✳</span> YOUR CLOSET, YOUR STORY</div>
          <h1>今天穿什么？<br /><em>穿成你喜欢的样子。</em></h1>
          <p>从衣橱里已有的衣服出发，让每一天的搭配都更轻松、更像自己。</p>
          <div className="hero-actions"><Link className="hero-primary" href="/stylist">开始搭配 <ArrowRight size={20} weight="bold" /></Link><Link className="hero-secondary" href="/closet">先看看衣橱 ↗</Link></div>
          <div className="hero-footnote"><span className="hero-line" /> 两个女孩，一百种今天。这里是可操作的本地 Demo。</div>
        </motion.div>
        <div className="hero-stage">
          <motion.div className="hero-halo" animate={reduce ? undefined : { scale: [1, 1.04, 1], rotate: [0, 2, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="hero-girls" style={reduce ? undefined : { y: girlsY }} animate={reduce ? undefined : { x: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <Image src="/demo/girls-retro-v2.png" alt="两位穿着薰衣草紫与薄荷绿服饰的原创复古漫画女孩" fill priority sizes="(max-width: 850px) 90vw, 54vw" />
          </motion.div>
          <motion.div className="hero-sticker sticker-a" animate={reduce ? undefined : { y: [0, -12, 0], rotate: [-7, -3, -7] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>搭配，不必费力 <span>↗</span></motion.div>
          <motion.div className="hero-sticker sticker-b" animate={reduce ? undefined : { y: [0, 9, 0], rotate: [5, 2, 5] }} transition={{ duration: 5.3, repeat: Infinity, ease: 'easeInOut' }}>today looks lovely.</motion.div>
          <div className="stage-index">SUIYIDA / 001</div>
        </div>
      </div>
      <div className="scroll-cue">向下看看 <span>↓</span></div>
    </section>
    <section className="story-section shell">
      <div className="story-heading"><p className="eyebrow">A LITTLE LESS GUESSWORK</p><h2>衣橱不是难题。<br /><em>它可以是你的灵感库。</em></h2><p>随意搭把日常选择拆成三个轻巧的动作。没有标准答案，只有更适合今天的可能。</p></div>
      <div className="story-list">{steps.map(({ n, title, detail, href, icon: Icon }) => <Link href={href} className="story-row" key={n}><span className="story-number">{n}</span><span className="story-icon"><Icon size={30} weight="duotone" /></span><span className="story-text"><strong>{title}</strong><small>{detail}</small></span><ArrowRight className="story-arrow" size={24} /></Link>)}</div>
    </section>
    <section className="wardrobe-section"><div className="shell wardrobe-layout"><div className="wardrobe-copy"><p className="eyebrow">A CLOSET FULL OF POSSIBILITIES</p><h2>好搭配，就从<br />手边这几件开始。</h2><p>把衣服画成一张张小卡片，挑选、替换、收藏，每一步都看得见。</p><Link className="btn btn-dark" href="/closet">打开我的衣橱 <ArrowRight size={17} /></Link></div><div className="illustrated-stack"><div className="illustrated-card card-back"><Image src="/demo/garment-pants-v2.png" alt="复古漫画风深色直筒裤插画" fill sizes="240px" /></div><div className="illustrated-card card-middle"><Image src="/demo/garment-jacket-v2.png" alt="复古漫画风淡紫外套插画" fill sizes="240px" /></div><div className="illustrated-card card-front"><Image src="/demo/garment-knit-v2.png" alt="复古漫画风浅色针织上衣插画" fill sizes="240px" /></div></div></div></section>
    <section className="home-end shell"><p className="eyebrow">READY FOR TODAY?</p><h2>下一套喜欢的搭配，<br />就在你的衣橱里。</h2><Link className="btn btn-dark" href="/stylist">现在开始搭配 <ArrowRight size={18} /></Link><p className="demo-note">本地演示 · 推荐采用固定规则，不接入真实 AI 服务。</p></section>
  </div>;
}
