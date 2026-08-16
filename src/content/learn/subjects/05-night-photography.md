---
title: "夜景摄影：黑夜里拍得干净漂亮"
description: "三脚架、长曝光、噪点控制，夜景摄影的核心技巧与常见场景参数"
category: "subjects"
order: 5
date: "2026-08-16"
tags: ["夜景", "长曝光", "三脚架", "噪点", "城市风光"]
---

夜景是新手最容易翻车的题材。

现场看着灯火辉煌，拍出来要么糊成一团，要么一片死黑，要么满屏幕的噪点。

其实夜景摄影逻辑很简单：**光少，就多给它一点时间。**
这一篇讲清楚夜景的核心思路和常见场景怎么拍。

## 夜景的三种曝光策略

拍夜景，本质上是在「画质、清晰度、氛围」三者之间做选择。

**高 ISO 手持拍**。ISO 开到 1600、3200 甚至更高，快门保持 1/60 秒以上。优点是灵活、不用三脚架、能抓瞬间。缺点是噪点多，画质下降。

**三脚架长曝光**。ISO 100，光圈 f/8，快门几秒到几十秒。画质最好，最干净，车流会变成光轨。缺点是必须带三脚架，而且拍出来的照片里没有人（人动了会糊掉）。

**大光圈折中**。f/1.4 或 f/1.8 的大光圈镜头，ISO 800 左右，快门 1/30 秒。画质和灵活性之间的折中，拍夜景人像、街景常用。

<figure class="diagram">
  <svg viewBox="0 0 620 300" role="img" aria-label="夜景三种曝光策略对比">
    <g transform="translate(30, 20)">
      <!-- 三列对比 -->
      <!-- 高ISO手持 -->
      <rect x="0" y="10" width="180" height="260" class="dia-stroke-thin" fill="none" />
      <rect x="0" y="10" width="180" height="260" class="dia-fill" opacity="0.03" />
      <text x="90" y="32" class="dia-text-label">高 ISO 手持</text>
      <text x="90" y="52" class="dia-text-muted">灵活 · 有噪点</text>
      <!-- 噪点示意颗粒 -->
      <g opacity="0.5">
        <circle cx="20" cy="70" r="1" class="dia-fill" />
        <circle cx="40" cy="85" r="1" class="dia-fill" />
        <circle cx="60" cy="72" r="1" class="dia-fill" />
        <circle cx="80" cy="90" r="1" class="dia-fill" />
        <circle cx="100" cy="78" r="1" class="dia-fill" />
        <circle cx="120" cy="88" r="1" class="dia-fill" />
        <circle cx="140" cy="75" r="1" class="dia-fill" />
        <circle cx="160" cy="82" r="1" class="dia-fill" />
        <circle cx="30" cy="100" r="1" class="dia-fill" />
        <circle cx="50" cy="105" r="1" class="dia-fill" />
        <circle cx="90" cy="102" r="1" class="dia-fill" />
        <circle cx="130" cy="108" r="1" class="dia-fill" />
        <circle cx="150" cy="98" r="1" class="dia-fill" />
      </g>
      <line x1="20" y1="130" x2="160" y2="130" class="dia-stroke-thin" />
      <text x="90" y="150" class="dia-text-label">ISO 1600–6400</text>
      <text x="90" y="170" class="dia-text-muted">快门 1/60s+</text>
      <text x="90" y="190" class="dia-text-muted">光圈 f/1.8–f/4</text>
      <line x1="20" y1="210" x2="160" y2="210" class="dia-stroke-thin" />
      <text x="90" y="230" class="dia-text-muted">适合：街拍、旅行</text>
      <text x="90" y="250" class="dia-text-muted">方便但画质一般</text>
      <!-- 三脚架长曝光 -->
      <rect x="210" y="10" width="180" height="260" class="dia-stroke-thin" fill="none" />
      <rect x="210" y="10" width="180" height="260" class="dia-fill" opacity="0.03" />
      <text x="300" y="32" class="dia-text-label">三脚架长曝光</text>
      <text x="300" y="52" class="dia-text-muted">最干净 · 光轨</text>
      <!-- 光滑的色块表示干净 -->
      <rect x="230" y="70" width="140" height="40" class="dia-fill" opacity="0.08" />
      <rect x="230" y="70" width="140" height="40" class="dia-stroke-thin" fill="none" />
      <line x1="230" y1="130" x2="370" y2="130" class="dia-stroke-thin" />
      <text x="300" y="150" class="dia-text-label">ISO 100</text>
      <text x="300" y="170" class="dia-text-muted">快门 5s–30s+</text>
      <text x="300" y="190" class="dia-text-muted">光圈 f/8–f/11</text>
      <line x1="230" y1="210" x2="370" y2="210" class="dia-stroke-thin" />
      <text x="300" y="230" class="dia-text-muted">适合：城市风光、桥、车流</text>
      <text x="300" y="250" class="dia-text-muted">画质最好但不方便</text>
      <!-- 大光圈折中 -->
      <rect x="420" y="10" width="180" height="260" class="dia-stroke-thin" fill="none" />
      <rect x="420" y="10" width="180" height="260" class="dia-fill" opacity="0.03" />
      <text x="510" y="32" class="dia-text-label">大光圈折中</text>
      <text x="510" y="52" class="dia-text-muted">氛围 · 焦外光斑</text>
      <!-- 焦外光斑示意 -->
      <circle cx="450" cy="80" r="8" class="dia-fill" opacity="0.2" />
      <circle cx="490" cy="88" r="6" class="dia-fill" opacity="0.25" />
      <circle cx="540" cy="75" r="10" class="dia-fill" opacity="0.15" />
      <circle cx="470" cy="100" r="5" class="dia-fill" opacity="0.3" />
      <circle cx="520" cy="102" r="7" class="dia-fill" opacity="0.2" />
      <circle cx="560" cy="95" r="4" class="dia-fill" opacity="0.25" />
      <line x1="440" y1="130" x2="580" y2="130" class="dia-stroke-thin" />
      <text x="510" y="150" class="dia-text-label">ISO 400–800</text>
      <text x="510" y="170" class="dia-text-muted">快门 1/30–1/60s</text>
      <text x="510" y="190" class="dia-text-muted">光圈 f/1.4–f/2.0</text>
      <line x1="440" y1="210" x2="580" y2="210" class="dia-stroke-thin" />
      <text x="510" y="230" class="dia-text-muted">适合：夜景人像、街景</text>
      <text x="510" y="250" class="dia-text-muted">好看但焦外会糊</text>
    </g>
  </svg>
  <figcaption>夜景三种曝光策略。有三脚架优先长曝光，追求画质；没三脚架就高 ISO 或大光圈。</figcaption>
</figure>

## 三脚架是夜景的入场券

想要干净的夜景照片，三脚架是必须的。

用三脚架拍夜景的标准流程：

1. 架好三脚架，构图
2. ISO 调到最低（通常 100）
3. 光圈调到 f/8 或 f/11（画质最好的区间）
4. 切换到 M 档或者快门优先，先试一个 2 秒的快门
5. 拍一张看直方图，太暗就加长时间，太亮就减时间
6. 用延时自拍（2 秒或 10 秒）或者快门线按快门，避免手按的那一下抖动

几个容易忽略的细节：

- 关闭镜头防抖。三脚架上防抖反而会引入微抖
- 把相机挂带收起来，不要垂着，风一吹就抖
- 如果风大，把脚架包挂在中轴挂钩上增加重量
- 拍 raw 格式，后期可以拉回很多细节

## 噪点是怎么来的，怎么控

夜景照片里那些密密麻麻的小颗粒，叫噪点。

噪点主要来自两个原因：**ISO 太高**和**曝光不足**。

ISO 越高，感光元件的信号放大倍率越大，噪点就越多。这个道理大家都懂。

但很多人不知道，**欠曝的照片后期提亮，噪点会比直接用高 ISO 拍还多。**
所以拍夜景的时候，宁可稍微过曝一点（亮一点），也不要欠曝。后期压暗很干净，提亮全是噪点。

控制噪点的几个实用方法：

- 用最低原生 ISO 拍长曝光，画质最好
- 曝光宁过勿欠（前提是高光别溢出）
- 用 raw 格式拍，后期降噪比 JPEG 强很多
- 相机的长曝光降噪功能可以开，但会让拍摄时间翻倍
- 后期用软件降噪（Lightroom、Capture One 都有不错的降噪）

## 常见夜景场景怎么拍

**城市风光 / 天际线**：找个高点，三脚架，f/8，ISO 100，快门 5–15 秒。蓝调时刻拍最好看，天空还没全黑，有层次。

**车流光轨**：找个天桥或者高处，对着车流方向。f/8–f/11，ISO 100，快门 10–30 秒。时间越长，光轨越连贯。

**夜景人像**：大光圈镜头 f/1.4–f/2.0，ISO 400–800，快门 1/30–1/60 秒。找有路灯或者商店灯光的地方，让人脸有光。完全没光的地方别拍，再高的 ISO 也救不回来。

**星空 / 银河**：大光圈广角镜头，f/2.8 或更大，ISO 1600–6400，快门 15–25 秒（别太长，星星会拖轨）。手动对焦到无穷远再往回拧一点点。必须去光污染少的地方。

**烟花**：三脚架，f/8–f/11，ISO 100，用 B 门或者长曝光。烟花升起来的时候打开快门，炸开以后关上。一张里可以拍多朵烟花。

## 动手练一下

找一个晚上，带上三脚架（没有就找个稳固的地方架着相机），去有路灯或者城市灯光的地方：

1. 先用 ISO 1600 手持拍一张，记下来是什么感觉
2. 架上三脚架，ISO 100，f/8，用 2 秒拍一张，对比画质区别
3. 调到 10 秒再拍一张，看车灯光轨有没有出来
4. 故意欠曝一档拍一张，后期提亮，看看噪点
5. 故意过曝半档拍一张，后期压暗，对比哪种更干净

## 速查表

| 场景 | 光圈 | 快门 | ISO | 三脚架 |
|------|------|------|-----|--------|
| 城市天际线 | f/8–f/11 | 5–15s | 100 | 必须 |
| 车流光轨 | f/8–f/16 | 10–30s | 100 | 必须 |
| 夜景人像 | f/1.4–f/2.0 | 1/30–1/60s | 400–800 | 不用 |
| 街拍夜景 | f/1.8–f/2.8 | 1/60s+ | 800–3200 | 不用 |
| 星空银河 | f/2.8 及更大 | 15–25s | 1600–6400 | 必须 |
| 烟花 | f/8–f/11 | B 门 / 2–5s | 100 | 必须 |

---

夜景没有想象中那么难，核心就是慢下来。
给光线足够的时间，它会给你一张干净的照片。
