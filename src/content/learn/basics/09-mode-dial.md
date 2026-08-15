---
title: "模式转盘：P/A/S/M 分别是干嘛的"
description: "从全自动到全手动，各模式什么时候用"
category: "basics"
order: 9
date: "2026-08-09"
tags: ["模式转盘", "P档", "A档", "S档", "M档"]
---

相机顶上那个转盘，叫**模式转盘**。

上面通常有这些档位：Auto、P、A/Av、S/Tv、M，还有各种场景模式（人像、风景、夜景……）。

这一篇我们就把它们都讲清楚。

## 模式转盘上都有啥

| 档位 | 名字 | 你控制什么 | 相机控制什么 |
|------|------|-----------|-------------|
| Auto | 全自动 | 啥都不用管 | 光圈、快门、ISO、白平衡……全管 |
| P | 程序自动 | ISO、曝光补偿 | 光圈 + 快门 |
| A / Av | 光圈优先 | 光圈、ISO、曝光补偿 | 快门 |
| S / Tv | 快门优先 | 快门、ISO、曝光补偿 | 光圈 |
| M | 手动 | 光圈、快门、ISO | 啥都不管 |

> 注：佳能叫 Av/Tv，尼康/索尼叫 A/S，意思是一样的。

<figure class="diagram">
  <svg viewBox="0 0 620 250" role="img" aria-label="模式转盘档位排布，以及 P/A/S/M 各档由谁决定光圈与快门的对照">
    <g>
      <circle cx="110" cy="118" r="56" class="dia-fill-soft" />
      <circle cx="110" cy="118" r="56" class="dia-stroke" />
      <path class="dia-stroke" d="M110 118 L110 70" />
      <circle cx="110" cy="118" r="5" class="dia-fill" />
      <path class="dia-stroke-thin" d="M48.9 107.2 L37.1 105.2M70.1 70.5 L62.4 61.3M110 56 L110 44M149.9 70.5 L157.6 61.3M171.1 107.2 L182.9 105.2" />
      <text x="64.7" y="114.0" class="dia-text-label">Auto</text>
      <text x="80.4" y="86.8" class="dia-text-label">P</text>
      <text x="110.0" y="76.0" class="dia-text-label">A</text>
      <text x="139.6" y="86.8" class="dia-text-label">S</text>
      <text x="155.3" y="114.0" class="dia-text-label">M</text>
      <text x="110" y="205" class="dia-text-muted">转盘档位</text>
      <text x="110" y="223" class="dia-text-muted">左边越自动，右边越手动</text>
    </g>
    <g transform="translate(258, 34)">
      <text x="52" y="0" class="dia-text-muted">档位</text>
      <text x="168" y="0" class="dia-text-muted">光圈</text>
      <text x="272" y="0" class="dia-text-muted">快门</text>
      <g transform="translate(0, 16)">
        <text x="52" y="18" class="dia-text-label">P</text>
        <rect x="120" y="2" width="96" height="24" class="dia-fill-soft" />
        <text x="168" y="19" class="dia-text">相机</text>
        <rect x="224" y="2" width="96" height="24" class="dia-fill-soft" />
        <text x="272" y="19" class="dia-text">相机</text>
      </g>
      <g transform="translate(0, 54)">
        <text x="52" y="18" class="dia-text-label">A / Av</text>
        <rect x="120" y="2" width="96" height="24" class="dia-fill" />
        <text x="168" y="19" class="dia-text-invert">你</text>
        <rect x="224" y="2" width="96" height="24" class="dia-fill-soft" />
        <text x="272" y="19" class="dia-text">相机</text>
      </g>
      <g transform="translate(0, 92)">
        <text x="52" y="18" class="dia-text-label">S / Tv</text>
        <rect x="120" y="2" width="96" height="24" class="dia-fill-soft" />
        <text x="168" y="19" class="dia-text">相机</text>
        <rect x="224" y="2" width="96" height="24" class="dia-fill" />
        <text x="272" y="19" class="dia-text-invert">你</text>
      </g>
      <g transform="translate(0, 130)">
        <text x="52" y="18" class="dia-text-label">M</text>
        <rect x="120" y="2" width="96" height="24" class="dia-fill" />
        <text x="168" y="19" class="dia-text-invert">你</text>
        <rect x="224" y="2" width="96" height="24" class="dia-fill" />
        <text x="272" y="19" class="dia-text-invert">你</text>
      </g>
    </g>
  </svg>
  <figcaption>实心格是你说了算，浅色格交给相机。A 档锁光圈、S 档锁快门，两个都锁上就是 M 档。</figcaption>
</figure>

## 每个档位怎么用

### Auto（全自动）

相机全权负责，你只管按快门。

**优点：** 完全不用想，拿起来就拍。
**缺点：** 你什么都控制不了，拍出来的往往不是你想要的效果。

适合：完全不懂相机的人随手拍。

### P 档（程序自动）

相机给你一组光圈快门组合，你可以在"曝光不变"的前提下调整组合（叫程序偏移）。ISO 和曝光补偿还是你说了算。

**优点：** 快，不用想太多，适合抓拍。
**缺点：** 光圈快门都不是你主动选的。

适合：街拍、旅行、随手记录。

### A 档（光圈优先）—— 新手最推荐

你选光圈，相机给你配快门。

这是我最推荐新手学的档位。为什么？因为光圈决定的东西（虚化、景深）是最有"画面感"的，你先确定你要的虚化效果，其他的交给相机。

- 想要虚化？开到大光圈（f/1.8、f/2.8）
- 想要全清晰？开到小光圈（f/8、f/11）

再配合曝光补偿调亮度，几乎所有日常场景都能搞定。

**适合：** 人像、风光、静物、日常。

### S 档（快门优先）

你选快门速度，相机给你配光圈。

当快门速度是第一位的时候用这个档。

- 拍运动？1/500s 以上凝固动作
- 拍流水？1s 拍出丝绸效果

**适合：** 运动、体育、流水光轨、需要特定快门效果的场景。

### M 档（全手动）

光圈、快门、ISO，全都是你自己调。相机只负责给你看"现在亮了还是暗了"（曝光指示）。

**优点：** 完全可控，想怎么拍就怎么拍。
**缺点：** 慢，需要经验。

很多新手觉得"用 M 档才是专业"，其实不是。专业摄影师也经常用 A 档 S 档——适合的就是最好的。

M 档有它不可替代的场景：
- 用闪光灯的时候
- 拍夜景长曝的时候
- 光线完全不变、需要一致曝光的时候（比如影棚）
- 相机测光不靠谱的时候

其他时候，A 档 + 曝光补偿又快又准，何必为难自己。

## 新手进阶路径

我建议的进阶顺序：

1. **Auto 档** — 先熟悉相机操作
2. **A 档** — 学习光圈和景深的概念，用曝光补偿微调
3. **S 档** — 学习快门速度和动态效果
4. **M 档** — 等你对三要素都有感觉了，再尝试全手动

不用急着用 M 档。能拍出好照片，比用什么档位重要多了。

## 场景模式呢？

模式转盘上还有人像、风景、夜景、运动这些场景模式，要不要用？

我的建议是：**了解它们是什么，但别依赖。**

场景模式本质上就是相机帮你选了一组参数：

- 人像模式 = 大光圈 + 偏暖的色调
- 风景模式 = 小光圈 + 高饱和度 + 高锐度
- 运动模式 = 高速快门 + 连续对焦
- 夜景模式 = 慢快门 + 高 ISO

当你理解了 A 档、S 档之后，这些场景模式你自己也能调出来，而且调得更精准。

## 一个小练习

找一个白天的室外场景。

分别用 P 档、A 档（f/2.8 和 f/11 各一张）、S 档（1/500s）、M 档各拍一张。

拍完之后对比：

1. 亮度一样吗？
2. 虚化程度一样吗？
3. 快门速度一样吗？

搞清楚"为什么不一样"，你就真的理解模式转盘了。

---

到这里，基础篇就全部结束了。

从光圈、快门、ISO，到测光、曝光补偿、对焦、焦距、模式转盘——你已经掌握了摄影最核心的基础知识。

接下来，带上你的相机，出去拍吧。

看十篇教程，不如拍一百张照片。
