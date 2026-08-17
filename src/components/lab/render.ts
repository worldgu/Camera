import type { Layer, Palette } from './scenes';

/**
 * 把分层场景合成到目标 canvas 上。
 * 顺序：逐层绘制（按景深上模糊）→ 运动模糊 → 曝光增益 → 噪点。
 * 用离屏 canvas 逐层处理，滤镜才不会互相污染。
 */
export interface RenderOptions {
  layers: Layer[];
  palette: Palette;
  /** 景深强度 0-1 */
  blur: number;
  /** 运动模糊长度（像素） */
  motion: number;
  /** 噪点强度 0-1 */
  noise: number;
  /** 曝光偏差，单位 EV */
  ev: number;
}

function drawLayer(
  target: CanvasRenderingContext2D,
  layer: Layer,
  w: number,
  h: number,
  opts: RenderOptions,
) {
  const blurPx = layer.depth * opts.blur * Math.min(w, h) * 0.045;
  const motionPx = layer.moving ? opts.motion : 0;

  target.save();
  if (blurPx > 0.3) {
    target.filter = `blur(${blurPx.toFixed(2)}px)`;
  }

  if (motionPx > 1) {
    // 沿水平方向叠多次半透明拷贝，模拟拖影
    const steps = Math.min(24, Math.max(4, Math.round(motionPx / 5)));
    for (let i = 0; i < steps; i += 1) {
      target.globalAlpha = 1 / steps;
      target.save();
      target.translate((motionPx * i) / steps, 0);
      layer.draw(target, w, h, opts.palette);
      target.restore();
    }
  } else {
    layer.draw(target, w, h, opts.palette);
  }
  target.restore();
}

/** 曝光增益：每档 EV 对应亮度翻倍，用 globalCompositeOperation 做加/减光 */
function applyExposure(ctx: CanvasRenderingContext2D, w: number, h: number, ev: number) {
  if (Math.abs(ev) < 0.05) return;
  const gain = 2 ** ev;

  if (gain > 1) {
    // 提亮：叠加自身，越多越亮；超过 3 档接近纯白
    const alpha = Math.min(0.92, (gain - 1) / (gain + 1) * 1.6);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  } else {
    const alpha = Math.min(0.92, (1 - gain) * 0.95);
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

/** 颗粒噪点：ISO 越高越粗。直接操作像素，避免用图片资源 */
function applyNoise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  if (amount < 0.02) return;
  const strength = amount * 62;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * strength;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opts: RenderOptions,
) {
  ctx.save();
  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, w, h);
  ctx.restore();

  // 远景先画，近景后画
  [...opts.layers]
    .sort((a, b) => b.depth - a.depth)
    .forEach((layer) => drawLayer(ctx, layer, w, h, opts));

  applyExposure(ctx, w, h, opts.ev);
  applyNoise(ctx, w, h, opts.noise);
}

/** 从画好的 canvas 采样亮度直方图，256 级 */
export function sampleHistogram(ctx: CanvasRenderingContext2D, w: number, h: number): number[] {
  const bins = new Array(256).fill(0);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  // 隔点采样，够准且省 CPU
  const stride = 4 * 4;
  for (let i = 0; i < d.length; i += stride) {
    const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
    bins[Math.max(0, Math.min(255, lum))] += 1;
  }
  return bins;
}
