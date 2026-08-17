/**
 * 教程文章 →「去实验室试试」入口的映射（需求 10.6）。
 *
 * 每条给出跳转链接上要带的模拟器预设，参数值刻意选成该文章讲解的那档，
 * 读者点进去看到的就是文中举例的那个场景。query 的解析在
 * `src/components/lab/ExposureSimulator.tsx` 的 readPreset()。
 *
 * 快门写法跟着相机读数：`125` 表示 1/125s，整秒要带引号，例如 `2"` 表示 2 秒。
 *
 * 每条预设都调到该场景下曝光基本准确（±1EV 内），读者一进来看到的是一张
 * 正常的照片，再自己动手拨才看得出参数的影响；否则一上来就是废片。
 *
 * 只覆盖需求指定的基础篇六篇；其余文章不显示入口。
 */

export interface LabEntry {
  /** 区块标题 */
  title: string;
  /** 一句引导文案，语气与教程正文一致 */
  text: string;
  /** 按钮文案 */
  action: string;
  /** 模拟器 query 预设，键名与 readPreset() 读取的一致 */
  preset: Record<string, string>;
}

/** key 为 `${category}/${slug}` */
const ENTRIES: Record<string, LabEntry> = {
  'basics/aperture': {
    title: '去实验室调调看',
    text: '光圈开到 f/1.4 再收到 f/16，盯着背景看它怎么从一团化开变得清晰。',
    action: '打开曝光模拟器',
    preset: { scene: 'portrait', aperture: '1.4', shutter: '1000', iso: '100' },
  },
  'basics/shutter-speed': {
    title: '去实验室调调看',
    text: '把快门从 1/1000s 一路拨到 30s，看画面里运动的部分怎么被拉成一道拖影。',
    action: '打开曝光模拟器',
    preset: { scene: 'night', aperture: '8', shutter: '2"', iso: '400' },
  },
  'basics/iso': {
    title: '去实验室调调看',
    text: 'ISO 从 100 推到 25600，颗粒是怎么一点点爬满画面的，看一眼就有数了。',
    action: '打开曝光模拟器',
    preset: { scene: 'night', aperture: '4', shutter: '15', iso: '6400' },
  },
  'basics/metering': {
    title: '去实验室调调看',
    text: '对着直方图调参数，过曝和欠曝时它的形状变化比数字更直观。',
    action: '打开曝光模拟器',
    preset: { scene: 'landscape', aperture: '8', shutter: '30', iso: '100' },
  },
  'basics/exposure-compensation': {
    title: '去实验室调调看',
    text: '打开自动曝光补偿，动一个参数看另一个怎么反向跟上——这就是跷跷板。',
    action: '打开曝光模拟器',
    preset: { scene: 'portrait', aperture: '2.8', shutter: '250', iso: '100' },
  },
  'basics/mode-dial': {
    title: '去实验室调调看',
    text: 'A 档只管光圈、S 档只管快门，在模拟器里手动配一遍就明白转盘在替你做什么。',
    action: '打开曝光模拟器',
    preset: { scene: 'portrait', aperture: '4', shutter: '125', iso: '100' },
  },
};

export function labEntryFor(category: string, slug: string): LabEntry | null {
  return ENTRIES[`${category}/${slug}`] ?? null;
}

/** 把预设拼成模拟器页面的完整链接 */
export function labHref(base: string, entry: LabEntry): string {
  const q = new URLSearchParams(entry.preset).toString();
  return `${base}/lab/simulator/?${q}`;
}
