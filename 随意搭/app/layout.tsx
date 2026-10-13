import './globals.css';
import { Inter } from 'next/font/google';
import Nav from '@/components/Nav';
const inter = Inter({ subsets:['latin'] });
export const metadata = { title: '随意搭 · AI Personal Stylist', description: '你的专属 AI 造型师与数字衣橱', icons: { icon: '/brand/suiyida-avatar.png', apple: '/brand/suiyida-avatar.png' } };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body className={inter.className}><Nav/><main>{children}</main></body></html>}


