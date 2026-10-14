import { Suspense } from 'react';
import { StylistResultPage } from '@/components/pages/StylistPages';
export default function Page() { return <Suspense fallback={<div className="shell page-loading">正在读取搭配…</div>}><StylistResultPage /></Suspense>; }
