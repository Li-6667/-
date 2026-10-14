import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Nav from '@/components/Nav';
import { DemoProvider } from '@/components/DemoProvider';
const jakarta=Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-sans'});
export const metadata={title:'随意搭 · 穿出今天的自己',description:'把自己的衣橱变成每日穿搭灵感。本地演示，不接入真实 AI 或云端账号。',icons:{icon:'/brand/suiyida-avatar.png',apple:'/brand/suiyida-avatar.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN" data-scroll-behavior="smooth"><body className={jakarta.variable}><DemoProvider><Nav/><main>{children}</main><footer className="site-footer"><div className="shell"><span>随意搭 · Style your day</span><span>一个可操作的本地演示，没有真实 AI 与云端账号。</span></div></footer></DemoProvider></body></html>}
