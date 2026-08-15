import type { CollectionEntry } from 'astro:content';

/**
 * 教程分类的单一数据源。
 * path.astro 与 topics.astro 共用，避免两处各写一份导致描述和状态漂移。
 */
export interface LearnCategory {
  key: string;
  label: string;
  /** 分类索引页用的知识点概览 */
  desc: string;
  /** 学习路径页用的一句话定位 */
  pathDesc: string;
  icon: string;
}

export const learnCategories: LearnCategory[] = [
  {
    key: 'basics',
    label: '基础篇',
    desc: '曝光三要素、测光、对焦、焦距、模式转盘',
    pathDesc: '从零开始，建立摄影的底层认知',
    icon: 'camera',
  },
  {
    key: 'composition',
    label: '构图篇',
    desc: '经典构图法、景别、画面层次',
    pathDesc: '经典构图法与视觉语言',
    icon: 'grid',
  },
  {
    key: 'light',
    label: '光线篇',
    desc: '光的方向、自然光时段、人工光基础',
    pathDesc: '理解光，运用光',
    icon: 'sun',
  },
  {
    key: 'subjects',
    label: '题材篇',
    desc: '人像、风光、街拍、静物、运动、夜景',
    pathDesc: '人像、风光、街拍、静物……',
    icon: 'image',
  },
  {
    key: 'operation',
    label: '操作篇',
    desc: '白平衡、胶片模拟、RAW vs JPEG、相机保养',
    pathDesc: '白平衡、胶片模拟、RAW',
    icon: 'settings',
  },
  {
    key: 'post',
    label: '后期篇',
    desc: 'LR 基础、调色、锐化、二次构图',
    pathDesc: 'Lightroom 基础与调色思路',
    icon: 'sliders',
  },
  {
    key: 'gear',
    label: '器材篇',
    desc: '相机分类、镜头体系、配件',
    pathDesc: '认识相机与镜头体系',
    icon: 'lens',
  },
];

/** 分类中文名映射，供文章详情页面包屑使用 */
export const categoryLabels: Record<string, string> = Object.fromEntries(
  learnCategories.map((c) => [c.key, c.label]),
);

/**
 * 按分类归拢文章并按 order 升序排列。
 * status 不再手写：该分类下有文章就是 active，没有就是 soon。
 */
export function buildCategoryIndex(posts: CollectionEntry<'learn'>[]) {
  return learnCategories.map((cat) => {
    const items = posts
      .filter((p) => p.data.category === cat.key)
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

    return {
      ...cat,
      posts: items,
      status: items.length > 0 ? ('active' as const) : ('soon' as const),
    };
  });
}
