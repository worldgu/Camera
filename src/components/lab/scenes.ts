/**
 * 场景定义：每个场景拆成若干图层，各层带自己的景深权重。
 * 第一版用程序化绘制（Canvas 2D）而不是素材图，好处是零资源依赖、
 * 随深浅色主题变色，也方便先把交互和效果调顺；后续换成拆好图层的
 * 真实照片时，只要替换 draw 实现，上层逻辑不用动。
 */

export type SceneKey = 'portrait' | 'landscape' | 'night';

export interface SceneMeta {
  key: SceneKey;
  label: string;
  hint: string;
  /** 场景亮度，作为「正确曝光」的基准档位，越小越暗 */
  light: number;
}

/**
 * light 是「正确曝光所需的档位和」，量纲同 exposureError 里的 -光圈+快门+ISO。
 * 默认参数 f/4 + 1/125s + ISO100 的档位和为 -3 + 5 + 0 = 2，
 * 所以白天场景取 2 表示一进来就是准确曝光；夜景要更多进光量，基准更高。
 */
export const SCENES: SceneMeta[] = [
  { key: 'portrait', label: '人像', hint: '看大光圈怎么把背景化开', light: 2 },
  { key: 'landscape', label: '风光', hint: '看小光圈下的前后景清晰度', light: 3 },
  { key: 'night', label: '夜景', hint: '看高感噪点与慢门拖影', light: 11 },
];

export interface Palette {
  sky: string;
  far: string;
  mid: string;
  near: string;
  subject: string;
  accent: string;
}

/** 图层：depth 0 = 合焦平面，数值越大离焦越远，模糊越重 */
export interface Layer {
  depth: number;
  /** 是否是运动元素，慢门时做方向性拖影 */
  moving?: boolean;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, pal: Palette) => void;
}

function fillRect(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** 人像：背景墙 + 远处光斑 + 人物主体（合焦） */
function portraitLayers(): Layer[] {
  return [
    {
      depth: 3,
      draw: (ctx, w, h, pal) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, pal.far);
        g.addColorStop(1, pal.mid);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        // 背景光斑，大光圈时会化成奶油般的圆
        ctx.fillStyle = pal.accent;
        const spots = [
          [0.16, 0.24, 0.05],
          [0.34, 0.15, 0.032],
          [0.72, 0.2, 0.045],
          [0.88, 0.35, 0.03],
          [0.6, 0.1, 0.026],
        ];
        spots.forEach(([cx, cy, r]) => {
          ctx.beginPath();
          ctx.arc(cx * w, cy * h, r * w, 0, Math.PI * 2);
          ctx.fill();
        });
      },
    },
    {
      depth: 1.2,
      draw: (ctx, w, h, pal) => {
        // 中景栏杆，给一点纵深参照
        ctx.fillStyle = pal.near;
        for (let i = 0; i < 5; i += 1) {
          ctx.fillRect((0.06 + i * 0.22) * w, h * 0.42, w * 0.012, h * 0.58);
        }
      },
    },
    {
      depth: 0,
      draw: (ctx, w, h, pal) => {
        // 人物剪影：肩 + 头，保持极简
        ctx.fillStyle = pal.subject;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.4, h * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w * 0.5 - h * 0.26, h);
        ctx.quadraticCurveTo(w * 0.5, h * 0.5, w * 0.5 + h * 0.26, h);
        ctx.closePath();
        ctx.fill();
      },
    },
  ];
}

/** 风光：天空 + 远山 + 中景山脊 + 前景岩石，主体在中景 */
function landscapeLayers(): Layer[] {
  const ridge = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    color: string,
    baseline: number,
    height: number,
    peaks: number,
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, baseline * h);
    for (let i = 0; i <= peaks; i += 1) {
      const x = (i / peaks) * w;
      const alt = i % 2 === 0 ? height : height * 0.55;
      ctx.lineTo(x, (baseline - alt) * h);
      ctx.lineTo(x + w / peaks / 2, baseline * h);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  };

  return [
    {
      depth: 2.4,
      draw: (ctx, w, h, pal) => {
        const g = ctx.createLinearGradient(0, 0, 0, h * 0.8);
        g.addColorStop(0, pal.sky);
        g.addColorStop(1, pal.far);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ridge(ctx, w, h, pal.far, 0.62, 0.16, 5);
      },
    },
    {
      depth: 0,
      draw: (ctx, w, h, pal) => {
        ridge(ctx, w, h, pal.mid, 0.74, 0.2, 3);
      },
    },
    {
      depth: 1.6,
      draw: (ctx, w, h, pal) => {
        // 前景岩石：小光圈时才和远景一起清晰
        ctx.fillStyle = pal.near;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * 0.84);
        ctx.quadraticCurveTo(w * 0.22, h * 0.72, w * 0.42, h * 0.9);
        ctx.quadraticCurveTo(w * 0.62, h * 0.99, w, h * 0.86);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      },
    },
  ];
}

/** 夜景：暗背景 + 建筑剪影 + 车流（运动层） */
function nightLayers(): Layer[] {
  return [
    {
      depth: 2,
      draw: (ctx, w, h, pal) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, pal.sky);
        g.addColorStop(1, pal.far);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      },
    },
    {
      depth: 0,
      draw: (ctx, w, h, pal) => {
        // 楼群剪影 + 窗户亮点
        const towers = [
          [0.04, 0.46, 0.13],
          [0.19, 0.34, 0.1],
          [0.32, 0.52, 0.16],
          [0.51, 0.28, 0.12],
          [0.66, 0.44, 0.14],
          [0.83, 0.38, 0.13],
        ];
        towers.forEach(([x, top, bw]) => {
          fillRect(ctx, pal.mid, x * w, top * h, bw * w, h * 0.72 - top * h + h * 0.02);
          ctx.fillStyle = pal.accent;
          for (let r = 0; r < 6; r += 1) {
            for (let c = 0; c < 3; c += 1) {
              if ((r + c) % 2 === 0) continue;
              ctx.fillRect(
                (x + 0.018 + c * (bw / 3.4)) * w,
                (top + 0.035 + r * 0.052) * h,
                bw * w * 0.16,
                h * 0.022,
              );
            }
          }
        });
      },
    },
    {
      depth: 0.4,
      moving: true,
      draw: (ctx, w, h, pal) => {
        // 车流：慢门时被拉成光带
        ctx.fillStyle = pal.accent;
        const cars = [0.12, 0.3, 0.44, 0.58, 0.76, 0.9];
        cars.forEach((x, i) => {
          const y = h * (0.8 + (i % 3) * 0.045);
          ctx.fillRect(x * w, y, w * 0.035, h * 0.016);
        });
      },
    },
    {
      depth: 1.4,
      draw: (ctx, w, h, pal) => {
        fillRect(ctx, pal.near, 0, h * 0.9, w, h * 0.1);
      },
    },
  ];
}

export function layersOf(key: SceneKey): Layer[] {
  if (key === 'portrait') return portraitLayers();
  if (key === 'landscape') return landscapeLayers();
  return nightLayers();
}
