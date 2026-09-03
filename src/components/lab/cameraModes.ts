/**
 * 模式转盘的档位定义（需求 10.2 后续可扩展：「模式转盘可真实旋转，联动曝光模拟器」）。
 *
 * 转盘上真实刻着 8 个位置，但只有 P / A / S / M 四档在曝光教学里有意义，
 * 所以只让这四档可停留，其余位置不参与切换。
 *
 * angle 是转盘绕自身 Y 轴的旋转角（弧度）。0 表示指针朝正前方（+Z），
 * 与 cameraGeometry 里 modePointer 的初始朝向一致；顺时针为正。
 *
 * preset 是切到该档后跳去曝光模拟器要带的 query，键名与
 * ExposureSimulator 的 readPreset() 一致：快门按相机读数写分母。
 * 每档的参数都选在人像场景下曝光基本准确的组合，并刻意突出该模式的性格：
 * A 档给大光圈（浅景深），S 档给高速快门（凝固），M 档给一组需要自己权衡的值。
 */

export interface CameraMode {
  id: string;
  /** 转盘上的刻字 */
  label: string;
  /** 中文全名 */
  name: string;
  /** 一句话说明这档替你决定了什么 */
  description: string;
  /** 绕 Y 轴的停留角度（弧度） */
  angle: number;
  /** 跳转曝光模拟器时携带的预设 */
  preset: Record<string, string>;
}

const QUARTER = Math.PI / 2;

export const MODES: CameraMode[] = [
  {
    id: 'P',
    label: 'P',
    name: '程序自动',
    description: '光圈和快门都交给相机，你只管构图和按快门。适合先上手。',
    angle: 0,
    preset: { scene: 'portrait', aperture: '4', shutter: '125', iso: '100' },
  },
  {
    id: 'A',
    label: 'A',
    name: '光圈优先',
    description: '你定光圈，相机配快门。想控制背景虚化程度时用这档。',
    angle: QUARTER,
    preset: { scene: 'portrait', aperture: '1.4', shutter: '1000', iso: '100' },
  },
  {
    id: 'S',
    label: 'S',
    name: '快门优先',
    description: '你定快门，相机配光圈。要凝固动作或拉出拖影时用这档。',
    angle: QUARTER * 2,
    // 风光场景 light=3：-光圈档 + 快门档 + ISO 档 = 3 时曝光准确
    // f/4(3) + 1/500s(3) + ISO800(3) → -3+3+3=3，既保住高速快门又不欠曝
    preset: { scene: 'landscape', aperture: '4', shutter: '500', iso: '800' },
  },
  {
    id: 'M',
    label: 'M',
    name: '全手动',
    description: '光圈、快门、ISO 全部自己定，相机不再插手。',
    angle: QUARTER * 3,
    preset: { scene: 'night', aperture: '2.8', shutter: '15', iso: '1600' },
  },
];

export const DEFAULT_MODE_ID = 'P';

export function modeById(id: string): CameraMode | undefined {
  return MODES.find((m) => m.id === id);
}

/**
 * 曝光补偿档位（需求 10.3「后续可扩展」：曝光补偿 ±3EV）。
 *
 * 真机是 1/3 档步进，但曝光模拟器的计算层按整档（1 EV）离散，
 * 这里跟着整档走，保持两边量纲一致。
 *
 * 转盘上 0 位朝正前方，每档转 40°：±3 档正好占满 240°，
 * 与真机上曝光补偿转盘不能整圈旋转的手感相符。
 */
export const EV_STEPS = [-3, -2, -1, 0, 1, 2, 3] as const;

const EV_ANGLE_PER_STOP = (Math.PI * 40) / 180;

/** 某档补偿对应的转盘角度；正补偿顺时针 */
export function evAngle(ev: number): number {
  return ev * EV_ANGLE_PER_STOP;
}

/** 格式化补偿读数，0 显示为 ±0 */
export function formatEv(ev: number): string {
  if (ev === 0) return '±0';
  return `${ev > 0 ? '+' : ''}${ev}`;
}

/** 拼出跳转曝光模拟器的链接，base 为站点基路径（不带尾斜杠） */
export function simulatorHref(base: string, mode: CameraMode): string {
  const q = new URLSearchParams({ ...mode.preset, mode: mode.id });
  return `${base}/lab/simulator/?${q.toString()}`;
}
