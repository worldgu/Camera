---
title: "快门速度：光的入场时间"
description: "曝光三要素之二：快门是什么、怎么用、影响什么"
category: "basics"
order: 3
date: "2026-08-03"
tags: ["快门", "曝光三要素", "动态"]
---

快门速度，简单说就是**相机感光的时间**。

你按下快门的那一刻，相机里的快门帘打开又关上，光在这段时间里跑到底片（或者传感器）上。这个打开的时间，就是快门速度。

## 快门速度怎么表示

快门速度用时间来表示，常见的有：

`1/1000s  1/500s  1/250s  1/125s  1/60s  1/30s  1/15s  1s  2s  10s  30s`

大部分时候你看到的是分数形式的高速快门，比如 1/125 秒、1/500 秒。

规律很直接：

- 数字越大（比如 1/1000）→ 快门越快 → 进光越少
- 数字越小（比如 1/30 或 1s）→ 快门越慢 → 进光越多

每差一档，进光量差一倍。比如 1/250s 的进光量是 1/500s 的两倍，是 1/125s 的一半。

<figure class="diagram">
  <svg viewBox="0 0 620 150" role="img" aria-label="快门速度时间轴，从高速到长曝光">
    <line x1="40" y1="60" x2="580" y2="60" class="dia-stroke" />
    <g class="dia-stroke-thin">
      <line x1="40" y1="52" x2="40" y2="68" />
      <line x1="175" y1="52" x2="175" y2="68" />
      <line x1="310" y1="52" x2="310" y2="68" />
      <line x1="445" y1="52" x2="445" y2="68" />
      <line x1="580" y1="52" x2="580" y2="68" />
    </g>
    <text x="40" y="44" class="dia-text-label">1/1000s</text>
    <text x="175" y="44" class="dia-text-label">1/250s</text>
    <text x="310" y="44" class="dia-text-label">1/60s</text>
    <text x="445" y="44" class="dia-text-label">1/15s</text>
    <text x="580" y="44" class="dia-text-label">30s</text>
    <text x="40" y="90" class="dia-text-muted">快</text>
    <text x="580" y="90" class="dia-text-muted">慢</text>
    <text x="150" y="122" class="dia-text">进光少 · 凝固动作</text>
    <text x="470" y="122" class="dia-text">进光多 · 拖出轨迹</text>
  </svg>
  <figcaption>快门速度时间轴：往左越快，画面越容易定住；往右越慢，进光越多、动态越明显。</figcaption>
</figure>

## 快门影响什么

### 1. 曝光（亮度）

这个很直观：快门开得越久，进的光越多，照片越亮。

### 2. 动态效果（凝固/模糊）

这是快门最有表现力的地方——它能决定运动物体在照片里的样子。

- **高速快门**（1/500s 以上）：凝固瞬间。跑动的人、飞溅的水花，都能定住。
- **中速快门**（1/60s - 1/250s）：日常拍摄常用，一般不糊也没什么动感。
- **低速快门**（1/30s 以下）：会有模糊。运动的物体会拖出残影。

慢门不是"不好"，它是一种创作手段：

- 拍夜景车灯：30s 长曝 → 车流变成光的河流
- 拍瀑布：1s - 5s → 水流变成丝滑的绸缎
- 拍星空：10s - 30s → 星星更亮

<figure class="diagram">
  <svg viewBox="0 0 620 200" role="img" aria-label="高速快门凝固与低速快门拖影的画面对比">
    <g transform="translate(20, 20)">
      <rect x="0" y="0" width="270" height="120" class="dia-fill-soft" />
      <circle cx="200" cy="60" r="18" class="dia-fill" />
      <text x="135" y="152" class="dia-text-label">1/1000s</text>
      <text x="135" y="172" class="dia-text-muted">边缘清楚，动作被定住</text>
    </g>
    <g transform="translate(330, 20)">
      <rect x="0" y="0" width="270" height="120" class="dia-fill-soft" />
      <circle cx="60" cy="60" r="18" class="dia-fill" opacity="0.18" />
      <circle cx="105" cy="60" r="18" class="dia-fill" opacity="0.3" />
      <circle cx="150" cy="60" r="18" class="dia-fill" opacity="0.45" />
      <circle cx="195" cy="60" r="18" class="dia-fill" opacity="0.7" />
      <circle cx="240" cy="60" r="18" class="dia-fill" />
      <text x="135" y="152" class="dia-text-label">1/15s</text>
      <text x="135" y="172" class="dia-text-muted">同一物体拖出一串残影</text>
    </g>
  </svg>
  <figcaption>同一个横向移动的物体：快门够快就是一个清楚的点，快门慢下来就成了一道轨迹。</figcaption>
</figure>

## 安全快门是什么

新手最常遇到的问题之一：照片拍糊了。

很多时候不是对焦问题，是**快门太慢，你的手抖了**。

那快门多快才不会因为手抖糊掉？有个经验公式叫"安全快门"：

> **安全快门速度 ≈ 焦距的倒数**

比如你用 50mm 的镜头拍照，安全快门大约是 1/50 秒。用 200mm 的镜头，安全快门大约是 1/200 秒。

焦距越长，手抖的影响越明显，所以需要更快的快门。

这只是个经验值。现在很多相机有机身防抖或者镜头防抖，安全快门可以更低一些。但作为新手，先记住这个原则总没错。

## 什么时候用什么快门

| 场景 | 推荐快门 | 原因 |
|------|---------|------|
| 运动/体育 | 1/500s 以上 | 凝固动作 |
| 街拍 | 1/250s - 1/500s | 保证不糊 |
| 日常人像 | 1/125s - 1/250s | 人不动的话足够 |
| 风光（白天） | 1/60s - 1/250s | 配合小光圈 |
| 夜景车灯 | 10s - 30s | 拉出光轨 |
| 瀑布/流水 | 1s - 5s | 丝绸效果 |

## 一个小练习

找一个在动的东西——转动的风扇、走动的人、喷泉的水。

分别用 1/1000s、1/125s、1/15s 各拍一张，对比一下动态效果的区别。

拍的时候注意：为了公平对比，你需要调整光圈或 ISO 让三张照片的亮度差不多。
