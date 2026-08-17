/**
 * 曝光模拟器的纯计算层。
 * 三个参数都按整档（1 EV）离散，档位表直接对应相机上能拨到的刻度。
 */

export const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22] as const;

/** 快门以「分母」存档：4000 表示 1/4000s，负值表示整秒（-30 即 30s） */
export const SHUTTERS = [
  4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2,
  -1, -2, -4, -8, -15, -30,
] as const;

export const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600] as const;

export interface Params {
  apertureIndex: number;
  shutterIndex: number;
  isoIndex: number;
}

export function shutterSeconds(index: number): number {
  const v = SHUTTERS[index];
  return v > 0 ? 1 / v : -v;
}

export function formatShutter(index: number): string {
  const v = SHUTTERS[index];
  return v > 0 ? `1/${v}` : `${-v}"`;
}

export function formatAperture(index: number): string {
  return `f/${APERTURES[index]}`;
}

export function formatIso(index: number): string {
  return `${ISOS[index]}`;
}

/**
 * 曝光值偏差（单位 EV，0 为正确曝光）。
 * 三个数组都按整档排列，所以用下标差算档数，比取对数直观且没有浮点误差。
 * 光圈下标越大孔径越小 → 越暗；快门下标越大速度越慢 → 越亮；ISO 下标越大 → 越亮。
 *
 * sceneLight 是该场景「正确曝光」所需的总档数基准，量纲与下标和一致：
 * 下标和 = -光圈 + 快门 + ISO，恰好等于 sceneLight 时曝光准确。
 */
export function exposureError(p: Params, sceneLight: number): number {
  const stops = -p.apertureIndex + p.shutterIndex + p.isoIndex;
  return stops - sceneLight;
}

/** 把下标夹在合法范围内 */
function clampIndex(index: number, length: number): number {
  return Math.max(0, Math.min(length - 1, index));
}

export type ParamKey = 'aperture' | 'shutter' | 'iso';

/**
 * 自动曝光补偿：动了一个参数后，改另一个把总曝光拉回原位。
 * 补偿目标按需求文档 10.3 约定 —— 调光圈补快门，调快门补光圈，调 ISO 补光圈。
 */
export function compensate(
  prev: Params,
  next: Params,
  changed: ParamKey,
  sceneLight: number,
): Params {
  const target = exposureError(prev, sceneLight);
  const drift = exposureError(next, sceneLight) - target;
  if (drift === 0) return next;

  if (changed === 'shutter') {
    // 变亮了就要缩光圈（下标增大），所以同向加 drift
    const apertureIndex = clampIndex(next.apertureIndex + drift, APERTURES.length);
    return { ...next, apertureIndex };
  }

  if (changed === 'iso') {
    const apertureIndex = clampIndex(next.apertureIndex + drift, APERTURES.length);
    return { ...next, apertureIndex };
  }

  // 动的是光圈，用快门补：变亮就要加快快门（下标减小）
  const shutterIndex = clampIndex(next.shutterIndex - drift, SHUTTERS.length);
  return { ...next, shutterIndex };
}

/** 景深：光圈越大（下标越小）背景越虚。返回 0-1 的模糊强度 */
export function backgroundBlur(apertureIndex: number): number {
  const t = 1 - apertureIndex / (APERTURES.length - 1);
  return t * t; // 平方一下，让大光圈端的变化更明显，符合实际观感
}

/** 运动模糊长度（像素），慢门才明显 */
export function motionBlur(shutterIndex: number): number {
  const seconds = shutterSeconds(shutterIndex);
  // 1/500 以上基本凝固，30s 拉到最长
  const t = Math.min(1, Math.max(0, (Math.log2(seconds) + 9) / 14));
  return t * t * 120;
}

/** 噪点强度 0-1，ISO 100 干净，25600 最脏 */
export function noiseAmount(isoIndex: number): number {
  const t = isoIndex / (ISOS.length - 1);
  return t * t;
}
