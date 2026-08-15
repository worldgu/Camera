---
title: "景别与视觉重心：决定拍多大、往哪压"
description: "远景到特写各自说什么话，以及怎么判断画面平不平衡"
category: "composition"
order: 6
date: "2026-08-15"
tags: ["景别", "视觉重心", "画面平衡", "构图基础"]
---

前面五篇都在讲"把东西放在哪里"。这一篇讲两个更靠前的决定：**拍多大**，以及**画面稳不稳**。

## 景别：同一个主体的五种距离

景别指主体在画面里占的大小。从远到近通常分五级，每一级传达的信息完全不同。

<figure class="diagram">
  <svg viewBox="0 0 620 200" role="img" aria-label="远景、全景、中景、近景、特写五种景别中人物占比的对比">
    <g transform="translate(14, 20)">
      <rect x="0" y="0" width="106" height="112" class="dia-stroke-thin" />
      <rect x="0" y="86" width="106" height="26" class="dia-fill-soft" />
      <rect x="50" y="74" width="5" height="14" class="dia-fill" />
      <text x="53" y="132" class="dia-text-label">远景</text>
      <text x="53" y="150" class="dia-text-muted">讲环境</text>
    </g>
    <g transform="translate(136, 20)">
      <rect x="0" y="0" width="106" height="112" class="dia-stroke-thin" />
      <rect x="0" y="96" width="106" height="16" class="dia-fill-soft" />
      <rect x="47" y="46" width="12" height="50" class="dia-fill" />
      <text x="53" y="132" class="dia-text-label">全景</text>
      <text x="53" y="150" class="dia-text-muted">讲全身动作</text>
    </g>
    <g transform="translate(258, 20)">
      <rect x="0" y="0" width="106" height="112" class="dia-stroke-thin" />
      <rect x="40" y="30" width="26" height="82" class="dia-fill" />
      <text x="53" y="132" class="dia-text-label">中景</text>
      <text x="53" y="150" class="dia-text-muted">讲人与手势</text>
    </g>
    <g transform="translate(380, 20)">
      <rect x="0" y="0" width="106" height="112" class="dia-stroke-thin" />
      <rect x="30" y="18" width="46" height="94" class="dia-fill" />
      <text x="53" y="132" class="dia-text-label">近景</text>
      <text x="53" y="150" class="dia-text-muted">讲表情</text>
    </g>
    <g transform="translate(502, 20)">
      <rect x="0" y="0" width="106" height="112" class="dia-stroke-thin" />
      <rect x="14" y="6" width="78" height="106" class="dia-fill" />
      <text x="53" y="132" class="dia-text-label">特写</text>
      <text x="53" y="150" class="dia-text-muted">讲细节情绪</text>
    </g>
  </svg>
  <figcaption>主体越大，环境信息越少，情绪越强。选景别其实是在选"这张照片要说什么"。</figcaption>
</figure>

**远景**：人很小，环境是主角。用来交代地点和氛围，适合开场。

**全景**：人物完整入画，能看清动作和姿态，但环境仍然清楚。

**中景**：大约拍到腰部以上。这是最"日常"的景别，接近人正常交谈的距离。

**近景**：肩部以上，表情成为重点，背景基本被排除。

**特写**：只拍脸的一部分，或者一只手、一个物件。信息量最少，情绪最强。

## 别停在一个景别

新手最常见的问题不是选错景别，而是**一整天只用一个景别拍**——通常是中景，因为那是站着不动最自然的距离。

一组照片如果景别全都一样，看起来会很平。养成一个习惯：**对同一个主体，至少拍三种景别**。远景交代它在哪，中景交代它在干什么，特写交代它的细节。三张放在一起才叫一组。

这也是为什么"用脚变焦"值得练：站着不动只能拍一种景别，往前走五步和后退五步，画面讲的故事就变了。

## 视觉重心：画面为什么会"偏"

画面里的元素在视觉上是有重量的。重量不均，看起来就歪。

哪些东西"重"？

- 面积大的比面积小的重
- 深色的比浅色的重
- 清晰的比虚化的重
- 高饱和颜色比低饱和的重
- 人脸和文字特别重，人眼会优先找它们

所以一张照片可能左边有一大片浅色的墙，右边只有一个小小的深色人影，看上去反而是平衡的——因为深色小主体的"视觉重量"补偿了面积差。

<figure class="diagram">
  <svg viewBox="0 0 620 200" role="img" aria-label="失衡构图与用小重物配平的对比示意">
    <g transform="translate(40, 22)">
      <rect x="0" y="0" width="220" height="120" class="dia-stroke-thin" />
      <circle cx="46" cy="60" r="30" class="dia-fill" />
      <line x1="110" y1="128" x2="110" y2="136" class="dia-stroke-thin" />
      <path class="dia-stroke" d="M64,144 L156,144" transform="translate(-46,0)" />
      <path class="dia-fill" d="M110,136 L118,148 L102,148 Z" />
      <text x="110" y="170" class="dia-text-muted">重量全压左侧，右边空得发虚</text>
    </g>
    <g transform="translate(360, 22)">
      <rect x="0" y="0" width="220" height="120" class="dia-stroke-thin" />
      <circle cx="46" cy="60" r="30" class="dia-fill" />
      <circle cx="176" cy="82" r="11" class="dia-fill" />
      <line x1="110" y1="128" x2="110" y2="136" class="dia-stroke-thin" />
      <path class="dia-stroke" d="M18,144 L110,144" transform="translate(46,0)" />
      <path class="dia-fill" d="M110,136 L118,148 L102,148 Z" />
      <text x="110" y="170" class="dia-text-muted">加一个小主体，画面就站住了</text>
    </g>
  </svg>
  <figcaption>配平不需要对称。右侧一个远处的小人、一只鸟、一盏灯，就足够抵住左边的大块。</figcaption>
</figure>

## 怎么判断自己的画面歪没歪

两个当场就能用的土办法。

**眯眼看**。把眼睛眯成一条缝，细节消失，只剩明暗块面。这时哪边重、哪边空，一目了然。

**回放时翻转看**。有些软件能左右镜像。翻过来看会让你跳出"我知道这是什么"的惯性，突然看清构图本身的问题。

## 常见场景怎么定

| 想表达 | 选什么景别 | 重心处理 |
|--------|-----------|---------|
| 这地方很壮阔 | 远景 | 人放三分交点，作配平点 |
| 这个人在做什么 | 全景或中景 | 动作朝向一侧留空 |
| 这个人什么心情 | 近景或特写 | 眼睛放上三分线 |
| 这个东西的质感 | 特写 | 主体略偏中心，避免呆板 |
| 一组完整的叙事 | 三种景别各一张 | 至少一张留白，一张塞满 |

## 一个小练习

挑一个主体，比如街角的一家小店。围着它拍五张，分别对应五个景别：远景带整条街、全景带店面全貌、中景拍门口、近景拍招牌、特写拍门把手或菜单上的一行字。

拍完把五张按顺序排开。你会发现自己无意中做了一件事：**讲了一个故事**。这就是景别的真正用途。

---

到这里构图篇的六个基本工具就齐了：三分法定位置，引导线给路径，框架加纵深，对称立秩序，留白做减法，景别与重心决定分量。

它们不是六条要背的规矩，而是六个可以在举起相机那两秒里快速过一遍的问题。用熟之后，这个过程会变成本能。
