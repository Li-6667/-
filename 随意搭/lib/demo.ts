import { openDB } from 'idb';

export type Profile = { height: string; body: string; skin: string; face: string; styles: string[] };
export type Garment = { id: string; name: string; category: string; color: string; season: string; occasion: string; image: string; sample?: boolean };
export type Look = { id: string; scene: string; temperature: string; mood: string; garmentIds: string[]; makeup: string; hair: string; accessory: string; note: string; createdAt: string; saved: boolean };
export type StyleTemplate = { id: string; name: string; scene: string; mood: string; note: string };
export type TravelPlan = { id: string; destination: string; days: number; scene: string; items: string[]; createdAt: string };
export type DemoState = {
  profile: Profile;
  profileAnswers: number[];
  personalityAnswers: number[];
  garments: Garment[];
  looks: Look[];
  calendar: Record<string, string>;
  beauty: Record<string, number[]>;
  templates: StyleTemplate[];
  travelPlans: TravelPlan[];
  latestLookId: string | null;
};

export const profileQuestions = [
  { title: '周末出门，你会先拿哪件？', options: ['剪裁利落的外套', '柔软的针织', '宽松的衬衫', '有趣的印花'] },
  { title: '一整天都要穿着，最在意什么？', options: ['线条干净', '细节精致', '行动自在', '与众不同'] },
  { title: '衣橱里最常出现的颜色？', options: ['黑白灰', '柔和粉紫', '米白与大地色', '鲜明撞色'] },
  { title: '朋友约你吃晚饭，你会？', options: ['换一件挺括上衣', '加上小首饰', '保持舒服的原样', '选一件醒目单品'] },
  { title: '更喜欢哪种搭配节奏？', options: ['少而准', '温柔有层次', '随手也好看', '每天不一样'] },
  { title: '希望别人先注意到？', options: ['气质', '亲和力', '松弛感', '个性'] },
];
export const personalityQuestions = [
  { title: '周末出门，你最想要什么氛围？', options: ['安静而利落', '轻松又浪漫', '舒服自在'] },
  { title: '你会为哪件单品停下来？', options: ['线条分明的外套', '柔软的针织衫', '好穿的宽松衬衣'] },
  { title: '搭配完成时，你希望它？', options: ['克制有力量', '柔和有细节', '不费力'] },
];
export const styleNames = ['清冷利落', '柔和浪漫', '松弛自然', '鲜明个性'];
const sampleImages: Record<string, string> = {
  'sample-knit': '/demo/garment-knit-v2.png',
  'sample-jacket': '/demo/garment-jacket-v2.png',
  'sample-pants': '/demo/garment-pants-v2.png',
};

export function emptyState(): DemoState {
  return {
    profile: { height: '', body: '', skin: '', face: '', styles: [] },
    profileAnswers: [], personalityAnswers: [], garments: [], looks: [],
    calendar: {}, beauty: {}, templates: [], travelPlans: [], latestLookId: null,
  };
}

export function sampleState(): DemoState {
  return {
    ...emptyState(),
    garments: [
      { id: 'sample-knit', name: '浅色针织上衣', category: '上衣', color: '米白', season: '春秋', occasion: '日常', image: sampleImages['sample-knit'], sample: true },
      { id: 'sample-jacket', name: '淡紫轻外套', category: '外套', color: '淡紫', season: '春秋', occasion: '通勤', image: sampleImages['sample-jacket'], sample: true },
      { id: 'sample-pants', name: '深色直筒裤', category: '下装', color: '深蓝', season: '四季', occasion: '通勤', image: sampleImages['sample-pants'], sample: true },
    ],
    templates: [
      { id: 'sample-work', name: '利落通勤', scene: '上班', mood: '清冷', note: '以现有衣物为主，留一处轻盈的颜色。' },
      { id: 'sample-weekend', name: '轻松周末', scene: '出游', mood: '松弛', note: '优先选择舒适、好走动的组合。' },
    ],
  };
}

let dbPromise: ReturnType<typeof openDB> | null = null;
function database() {
  if (!dbPromise) {
    dbPromise = openDB('suiyida-local-demo', 1, {
      upgrade(db) { if (!db.objectStoreNames.contains('app')) db.createObjectStore('app'); },
    });
  }
  return dbPromise;
}
export async function loadDemo(): Promise<DemoState> {
  const db = await database();
  const existing = await db.get('app', 'state') as DemoState | undefined;
  if (existing) {
    // Keep personal uploads untouched; migrate only our known example assets.
    const garments = existing.garments.map(item => item.sample && sampleImages[item.id] && item.image !== sampleImages[item.id]
      ? { ...item, image: sampleImages[item.id] } : item);
    const changed = garments.some((item, index) => item !== existing.garments[index]);
    const normalized = { ...emptyState(), ...existing, garments };
    if (changed || !existing.travelPlans) await db.put('app', normalized, 'state');
    return normalized;
  }
  const seed = sampleState();
  await db.put('app', seed, 'state');
  return seed;
}
export async function saveDemo(next: DemoState): Promise<void> {
  const db = await database();
  await db.put('app', next, 'state');
}

export function profileResult(answers: number[]) {
  const counts = [0, 0, 0, 0];
  answers.forEach(answer => { if (answer >= 0 && answer < 4) counts[answer] += 1; });
  const winner = counts.indexOf(Math.max(...counts));
  return { name: styleNames[winner], counts, keywords: [
    ['线条', '克制', '清爽'], ['柔和', '细节', '浪漫'], ['舒适', '自然', '随性'], ['鲜明', '趣味', '表达'],
  ][winner] };
}
export function personalityResult(answers: number[]) {
  const counts = [0, 0, 0];
  answers.forEach(answer => { if (answer >= 0 && answer < 3) counts[answer] += 1; });
  const highest = Math.max(...counts);
  const firstHighest = answers.find(answer => counts[answer] === highest) ?? 0;
  return ['清冷利落', '柔和浪漫', '松弛自然'][firstHighest];
}
export function makeLook(state: DemoState, scene: string, temperature: string, mood: string): Look {
  const preferred = state.garments.filter(item => item.occasion === scene || item.occasion === '日常');
  const pool = preferred.length ? preferred : state.garments;
  const byCategory = (category: string) => pool.find(item => item.category === category) ?? state.garments.find(item => item.category === category);
  const degrees = Number.parseFloat(temperature);
  const includeOuterwear = !Number.isFinite(degrees) || degrees <= 23;
  const selected = [byCategory('上衣'), byCategory('下装'), includeOuterwear ? byCategory('外套') : undefined, byCategory('鞋包')].filter((item): item is Garment => Boolean(item));
  const unique = [...new Set(selected.map(item => item.id))];
  const style = state.profile.styles[0] || mood;
  return {
    id: crypto.randomUUID(), scene, temperature, mood, garmentIds: unique,
    makeup: mood === '清冷' ? '低饱和的干净妆面' : '自然提气色的淡妆',
    hair: mood === '松弛' ? '自然披发或低马尾' : '清爽低马尾',
    accessory: scene === '上班' ? '简洁耳饰' : '轻巧的随身配饰',
    note: unique.length
      ? `依据衣橱里现有的 ${unique.length} 件单品，结合“${scene}”场景与“${style}”偏好生成的本地演示建议。`
      : '衣橱还没有单品。先添加衣物，才能生成基于你的衣橱的搭配。',
    createdAt: new Date().toISOString(), saved: false,
  };
}
export function replaceGarment(look: Look, state: DemoState, currentId: string): Look {
  const current = state.garments.find(item => item.id === currentId);
  const alternative = state.garments.find(item => item.category === current?.category && item.id !== currentId && !look.garmentIds.includes(item.id));
  if (!alternative) return look;
  return { ...look, garmentIds: look.garmentIds.map(id => id === currentId ? alternative.id : id), note: `已把“${current?.name}”替换为“${alternative.name}”。这是一条本地演示建议。` };
}
export function travelList(state: DemoState, days: number, scene: string) {
  const items = state.garments.filter(item => item.occasion === scene || item.occasion === '日常');
  const selected = (items.length ? items : state.garments).slice(0, Math.min(12, Math.max(3, days + 2)));
  return selected.map(item => item.name);
}
