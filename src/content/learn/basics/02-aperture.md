---
title: "光圈：镜头里的小瞳孔"
description: "曝光三要素之一：光圈是什么、怎么用、影响什么"
category: "basics"
order: 2
date: "2026-08-02"
tags: ["光圈", "曝光三要素", "景深"]
---

光圈，英文 Aperture，是镜头里的一个装置。

你可以把它理解成**镜头的瞳孔**——瞳孔放大，进的光就多；瞳孔缩小，进的光就少。

## 光圈怎么表示

光圈用 **f 值** 来表示，比如 f/1.8、f/2.8、f/4、f/8、f/16。

这里有个反直觉的地方：

> **f 值越小，光圈越大；f 值越大，光圈越小。**

比如 f/1.8 是大光圈，f/16 是小光圈。很多新手一开始都搞反了，记住这个就好。

为什么是反的？因为 f 值其实是个分数：焦距 ÷ 光圈直径。分子不变的情况下，分母越大，值越小。

不用记原理，记住结论就行：**数字小 = 光圈大 = 进光多**。

<figure class="diagram">
  <svg viewBox="0 0 620 200" role="img" aria-label="不同 f 值下光圈叶片开合程度的对比示意">
    <g transform="translate(100, 82)">
      <circle cx="0" cy="0" r="62" class="dia-stroke-thin" />
      <path class="dia-fill" d="M42.5,17.6 L17.6,42.5 L-17.6,42.5 L-42.5,17.6 L-42.5,-17.6 L-17.6,-42.5 L17.6,-42.5 L42.5,-17.6 Z" />
      <path class="dia-stroke-thin" d="M42.5,17.6L57.3,23.7M17.6,42.5L23.7,57.3M-17.6,42.5L-23.7,57.3M-42.5,17.6L-57.3,23.7M-42.5,-17.6L-57.3,-23.7M-17.6,-42.5L-23.7,-57.3M17.6,-42.5L23.7,-57.3M42.5,-17.6L57.3,-23.7" />
      <text x="0" y="88" class="dia-text-label">f/2.8</text>
      <text x="0" y="107" class="dia-text-muted">开口大 · 进光多</text>
    </g>
    <g transform="translate(310, 82)">
      <circle cx="0" cy="0" r="62" class="dia-stroke-thin" />
      <path class="dia-fill" d="M24.0,9.9 L9.9,24.0 L-9.9,24.0 L-24.0,9.9 L-24.0,-9.9 L-9.9,-24.0 L9.9,-24.0 L24.0,-9.9 Z" />
      <path class="dia-stroke-thin" d="M24.0,9.9L57.3,23.7M9.9,24.0L23.7,57.3M-9.9,24.0L-23.7,57.3M-24.0,9.9L-57.3,23.7M-24.0,-9.9L-57.3,-23.7M-9.9,-24.0L-23.7,-57.3M9.9,-24.0L23.7,-57.3M24.0,-9.9L57.3,-23.7" />
      <text x="0" y="88" class="dia-text-label">f/8</text>
      <text x="0" y="107" class="dia-text-muted">开口中等</text>
    </g>
    <g transform="translate(520, 82)">
      <circle cx="0" cy="0" r="62" class="dia-stroke-thin" />
      <path class="dia-fill" d="M10.2,4.2 L4.2,10.2 L-4.2,10.2 L-10.2,4.2 L-10.2,-4.2 L-4.2,-10.2 L4.2,-10.2 L10.2,-4.2 Z" />
      <path class="dia-stroke-thin" d="M10.2,4.2L57.3,23.7M4.2,10.2L23.7,57.3M-4.2,10.2L-23.7,57.3M-10.2,4.2L-57.3,23.7M-10.2,-4.2L-57.3,-23.7M-4.2,-10.2L-23.7,-57.3M4.2,-10.2L23.7,-57.3M10.2,-4.2L57.3,-23.7" />
      <text x="0" y="88" class="dia-text-label">f/16</text>
      <text x="0" y="107" class="dia-text-muted">开口小 · 进光少</text>
    </g>
  </svg>
  <figcaption>光圈叶片的开合：f 值越小，中间的通光孔越大，进光量越多。</figcaption>
</figure>

## 光圈影响什么

光圈主要影响两件事：

### 1. 曝光（亮度）

光圈越大，进的光越多，照片越亮；光圈越小，进的光越少，照片越暗。

这是最直接的影响。

### 2. 景深（虚实）

景深是什么？简单说就是**照片里清晰的范围**。

- 大光圈（f/1.8、f/2.8）→ 景深浅 → 只有对焦点清晰，前后都虚化
- 小光圈（f/8、f/16）→ 景深深 → 从近到远都清晰

这就是为什么拍人像喜欢用大光圈——背景虚化，人物突出。拍风光喜欢用小光圈——从近到远全都清楚。

<figure class="diagram">
  <svg viewBox="0 0 620 260" role="img" aria-label="大光圈与小光圈下清晰范围的对比示意">
    <g transform="translate(20, 20)">
      <text x="270" y="0" class="dia-text-label">f/1.8 · 景深浅</text>
      <line x1="20" y1="42" x2="540" y2="42" class="dia-stroke-thin" />
      <rect x="196" y="26" width="80" height="32" class="dia-fill-soft" />
      <circle cx="60" cy="42" r="7" class="dia-stroke-thin" />
      <circle cx="130" cy="42" r="7" class="dia-stroke-thin" />
      <circle cx="236" cy="42" r="9" class="dia-fill" />
      <circle cx="380" cy="42" r="7" class="dia-stroke-thin" />
      <circle cx="490" cy="42" r="7" class="dia-stroke-thin" />
      <text x="236" y="80" class="dia-text-muted">清晰范围窄</text>
      <text x="60" y="80" class="dia-text-muted">虚</text>
      <text x="490" y="80" class="dia-text-muted">虚</text>
    </g>
    <g transform="translate(20, 150)">
      <text x="270" y="0" class="dia-text-label">f/16 · 景深深</text>
      <line x1="20" y1="42" x2="540" y2="42" class="dia-stroke-thin" />
      <rect x="36" y="26" width="472" height="32" class="dia-fill-soft" />
      <circle cx="60" cy="42" r="7" class="dia-fill" />
      <circle cx="130" cy="42" r="7" class="dia-fill" />
      <circle cx="236" cy="42" r="9" class="dia-fill" />
      <circle cx="380" cy="42" r="7" class="dia-fill" />
      <circle cx="490" cy="42" r="7" class="dia-fill" />
      <text x="270" y="80" class="dia-text-muted">从近到远都清晰</text>
    </g>
  </svg>
  <figcaption>浅灰底表示清晰范围：大光圈只有对焦点附近实，小光圈则前后通吃。实心圆为清晰，空心圆为虚化。</figcaption>
</figure>

## 常见光圈档位

你可能会看到这些光圈值：

`f/1.4  f/2  f/2.8  f/4  f/5.6  f/8  f/11  f/16  f/22`

每差一档，进光量差一倍。比如 f/2 的进光量是 f/2.8 的两倍，f/2.8 是 f/4 的两倍。

不用死记，拍多了自然就记住了。

## 什么时候用什么光圈

| 场景 | 推荐光圈 | 原因 |
|------|---------|------|
| 人像 | f/1.8 - f/4 | 背景虚化，突出人物 |
| 风光 | f/8 - f/16 | 全画面清晰 |
| 街拍 | f/4 - f/8 | 有一定虚化但不太夸张 |
| 夜景 | f/2.8 或更大 | 进光多，不用太高 ISO |
| 微距/静物 | f/8 - f/11 | 保证主体完全清晰 |

## 一个小练习

拿你的相机，对着同一个东西，分别用最大光圈、f/5.6、f/11 各拍一张。

对比看看：

1. 亮度有什么变化？
2. 背景的虚化程度有什么不同？

亲眼看一次，比读十遍文章都管用。

---

光圈是曝光三要素里最"有个性"的一个——它不仅控制亮度，还控制画面的虚实感。理解了光圈，你就理解了摄影里最有表现力的一个工具。
