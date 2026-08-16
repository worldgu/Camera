---
title: "RAW 与 JPEG：到底该拍哪个"
description: "两种格式差在哪，各自适合什么场合，以及为什么 RAW 打开时看起来比 JPEG 难看"
category: "operation"
order: 2
date: "2026-08-16"
tags: ["RAW", "JPEG", "文件格式", "后期", "宽容度"]
---

这是新手最常问的问题之一，答案往往被说成"专业拍 RAW，随手拍 JPEG"，听着像身份认证，其实没解释清区别。

差别在于：**JPEG 是相机替你做完了所有决定的成品，RAW 是把决定权留给你的半成品。**

## 一次拍摄，相机内部做了什么

按下快门，传感器只记下每个像素点收到多少光。这堆数据还不是照片，要经过一串处理才能看：去马赛克、应用白平衡、上色彩配置、调对比度、锐化、降噪，最后压缩。

选 JPEG，相机把这一整串跑完，输出一个所有人都能打开的小文件，中间数据丢掉。

选 RAW，相机在最前面就把数据存下来，处理留给你在电脑上做。

<figure class="diagram">
  <svg viewBox="0 0 620 260" role="img" aria-label="传感器数据分别走向 JPEG 与 RAW 两条处理流程的对比">
    <g transform="translate(30, 24)">
      <rect x="0" y="86" width="96" height="52" class="dia-fill" opacity="0.16" />
      <rect x="0" y="86" width="96" height="52" class="dia-stroke-thin" />
      <text x="48" y="108" class="dia-text-label">传感器</text>
      <text x="48" y="128" class="dia-text-muted">原始读数</text>
      <path class="dia-stroke-thin" d="M96,102 L150,56" />
      <path class="dia-stroke-thin" d="M96,122 L150,178" />
      <rect x="150" y="26" width="270" height="58" class="dia-stroke-thin" />
      <text x="285" y="48" class="dia-text-label">机内全流程处理</text>
      <text x="285" y="70" class="dia-text-muted">白平衡 / 色彩 / 对比 / 锐化 / 降噪</text>
      <path class="dia-stroke-thin" d="M420,56 L470,56" />
      <rect x="470" y="26" width="90" height="58" class="dia-fill" opacity="0.24" />
      <rect x="470" y="26" width="90" height="58" class="dia-stroke-thin" />
      <text x="515" y="48" class="dia-text-label">JPEG</text>
      <text x="515" y="70" class="dia-text-muted">8bit 成品</text>
      <rect x="150" y="150" width="270" height="58" class="dia-stroke-thin" />
      <text x="285" y="172" class="dia-text-label">仅记录，不处理</text>
      <text x="285" y="194" class="dia-text-muted">参数只作为标签附在文件里</text>
      <path class="dia-stroke-thin" d="M420,178 L470,178" />
      <rect x="470" y="150" width="90" height="58" class="dia-fill" opacity="0.1" />
      <rect x="470" y="150" width="90" height="58" class="dia-stroke-thin" />
      <text x="515" y="172" class="dia-text-label">RAW</text>
      <text x="515" y="194" class="dia-text-muted">12 至 14bit</text>
      <text x="285" y="234" class="dia-text-muted">同一次快门，区别只在于处理发生在机内还是电脑上</text>
    </g>
  </svg>
  <figcaption>上路是 JPEG：相机做完决定并丢掉中间数据。下路是 RAW：数据全留着，白平衡和色彩只是可改的标签。</figcaption>
</figure>

理解了这张图，后面所有差异都是它的推论。

## 具体差在哪

**位深和宽容度**。JPEG 每个通道 8 位，共 256 级；RAW 通常 12 到 14 位，有四千到一万六千级。这个差距直接体现在救片能力上：一张欠曝两档的 RAW 拉回来通常还很干净，同样的 JPEG 拉回来会满是噪点和色块。

**高光和暗部余量**。RAW 常能从看起来死白的天空里找回细节，从纯黑的暗部里提出层次。JPEG 一旦压到纯白纯黑，那里就真的什么都没有了。

**白平衡可改**。RAW 里白平衡只是一个标签，后期随便改，画质无损。JPEG 改白平衡等于给已经上色的图再套一层颜色，改动稍大就发灰、断层。

**文件大小**。RAW 通常是同张 JPEG 的五到十倍。存储卡、硬盘、备份成本都跟着涨。

**通用性**。JPEG 任何设备直接打开、直接发。RAW 是各家私有格式，要专门软件，新机型发布初期老版本软件甚至认不出来。

**机内特效不生效**。胶片模拟、艺术滤镜这类效果作用在 JPEG 流程上。拍纯 RAW，这些效果在文件里只是标签，换第三方软件打开可能完全不认。

## 为什么 RAW 打开时反而更难看

很多人第一次拍 RAW 会失望：怎么比 JPEG 灰、比 JPEG 平、还不够锐。

因为你看到的是没有加过对比、没有加过锐化、没有上厂商色彩风格的原始状态。JPEG 那张好看，是相机已经替你调过了。

RAW 的起点低，但天花板高。**它不是给你一张更好的照片，是给你一块更好的料。** 如果不打算加工，这块料的价值就体现不出来。

## 怎么选

**拍 JPEG 的场合**：不打算后期、需要马上发出去、连拍张数极多的活动记录、存储卡不够、光线简单曝光有把握、你就喜欢机内的胶片模拟效果。

**拍 RAW 的场合**：光比大的场景（逆光、日落、明暗交界的室内）、白平衡复杂或混合光、重要且不可重来的题材、明确要修图的作品、曝光没把握需要留余地。

**RAW + JPEG 同时存**。多数机身支持。好处是有能直发的成品，也有能精修的底子；代价是占用双份空间、整理时文件数量翻倍。

我的建议：**新手期先用 RAW + JPEG**。用 JPEG 日常看和分享，同时拿 RAW 练后期，顺便对照相机是怎么处理照片的——这个对照过程本身很有教育意义。等你清楚自己的取舍了，再决定固定用哪种。

## 顺手要做的几件事

**RAW 压缩选项**。很多机身有无损压缩 RAW，画质不变、体积小很多，默认没开的话打开它。避开"有损压缩 RAW"，除非你确实很缺空间。

**别用机内 RAW 转 JPEG 代替后期**。它能应急，但可调项远少于电脑软件。

**建立导入流程**。RAW 文件多且大，一定要有固定的目录结构和备份习惯，否则半年后你会找不到任何东西。

## 格式选择速查

| 情况 | 建议 | 理由 |
|------|------|------|
| 逆光 / 日落 / 大光比 | RAW | 高光暗部都需要余量 |
| 混合光源、白平衡难定 | RAW | 后期可无损改白平衡 |
| 婚礼、旅行、不可重来 | RAW 或 RAW+JPEG | 留后路 |
| 需要立刻发群 / 发朋友圈 | JPEG | 免转换 |
| 体育连拍上千张 | JPEG 或小 RAW | 缓存与卡速吃紧 |
| 就喜欢机内胶片模拟 | JPEG（或 RAW+JPEG） | 特效作用于 JPEG 流程 |
| 明确要修图的作品 | RAW | 宽容度决定上限 |
| 存储卡紧张的一天 | JPEG | 现实约束优先 |

## 一个小练习

找一个逆光场景，用 RAW+JPEG 拍一张，故意让画面欠曝两档。

回到电脑，两个文件都提亮两档。对比暗部：JPEG 会出现明显噪点和颜色断层，RAW 大概还挺干净。

这一张对比比任何参数表都直观。看完你自然会知道什么场合值得多占那几十兆。

---

RAW 和 JPEG 不是高低之分，是**决定权在谁手里**的分别。你愿意花时间加工，RAW 给你更高的上限；你只想拍完就用，JPEG 是更省事的选择。真正需要警惕的只有一种情况：拍了 RAW 却从不打开它，那就只是白白多占了硬盘。
