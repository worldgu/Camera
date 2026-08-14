import type { CollectionEntry } from 'astro:content';

/**
 * 从 learn collection 的 entry 生成页面用的 slug：
 * 取文件名（去掉目录和 .md），再去掉开头的数字序号前缀。
 * 与 [category]/[slug].astro 中的 getStaticPaths 保持一致。
 */
export function slugOf(post: CollectionEntry<'learn'>): string {
  const filename = post.id.split('/').pop() ?? post.id;
  return filename.replace(/^\d+-/, '').replace(/\.md$/, '');
}

