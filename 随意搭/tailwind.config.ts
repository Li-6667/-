import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink:'#20252a', rose:'#e8a0a8', cream:'#fbf8f3', sage:'#b9c8bb' }, fontFamily:{ sans:['var(--font-inter)','Arial','sans-serif'], serif:['Georgia','serif'] } } }, plugins:[] };
export default config;
