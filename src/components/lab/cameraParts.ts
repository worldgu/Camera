/**
 * 相机模型的可交互部件数据（需求 10.2，共 13 个）。
 *
 * 每个部件包含：
 * - id：稳定的唯一标识，与 Three.js mesh 的 userData.partId 对应
 * - label：显示在浮层里的中文名称
 * - description：一句功能说明，新手能看懂
 * - tutorial：关联的教程文章（category + slug），用于「了解更多 →」跳转
 *
 * 部件位置完全跟着 A7C2 的实际布局，几何体构建时按 id 挂到对应 mesh 上。
 */

export interface CameraPart {
  id: string;
  label: string;
  description: string;
  tutorial?: { category: string; slug: string; title: string };
}

export const PARTS: CameraPart[] = [
  // —— 机顶 ——
  {
    id: 'shutter-button',
    label: '快门按钮',
    description: '半按对焦测光，全按拍摄。两段式行程，是最熟悉的那颗按钮。',
    tutorial: { category: 'basics', slug: 'shutter-speed', title: '快门速度' },
  },
  {
    id: 'mode-dial',
    label: '模式转盘',
    description: '控制自动 / 手动曝光：P / A / S / M，决定相机替你做多少决定。',
    tutorial: { category: 'basics', slug: 'mode-dial', title: '模式转盘' },
  },
  {
    id: 'exposure-comp-dial',
    label: '曝光补偿转盘',
    description: '觉得照片偏暗就 +、偏亮就 -，±3EV 范围让画面回到你想要的亮度。',
    tutorial: { category: 'basics', slug: 'exposure-compensation', title: '曝光补偿' },
  },
  {
    id: 'hot-shoe',
    label: '热靴',
    description: '机顶的接口底座，用来接外置闪光灯、麦克风、引闪器等配件。',
    tutorial: { category: 'gear', slug: 'essential-accessories', title: '必备配件' },
  },
  {
    id: 'custom-button',
    label: 'C1 / C2 自定义键',
    description: '可以自由分配功能的快捷键，对焦、测光、连拍模式都能设成一键切换。',
    tutorial: { category: 'operation', slug: 'af-area-and-drive-mode', title: '对焦区域与连拍' },
  },
  {
    id: 'record-button',
    label: '录像按钮',
    description: '一键开始 / 停止视频录制。旁边的小红点拍视频时常亮。',
  },

  // —— 背面 ——
  {
    id: 'rear-dial',
    label: '后拨轮',
    description: '拇指位置的拨轮，用来调快门速度、ISO 或菜单翻页，右手单手握持时也够得到。',
    tutorial: { category: 'basics', slug: 'shutter-speed', title: '快门速度' },
  },
  {
    id: 'control-wheel',
    label: '多功能摇杆',
    description: '八向移动的小摇杆，主要用来移动对焦点，比方向键快很多。',
    tutorial: { category: 'operation', slug: 'af-area-and-drive-mode', title: '对焦区域与连拍' },
  },
  {
    id: 'evf',
    label: '电子取景器',
    description: '把眼睛贴上去看的小屏幕，强光下比后背屏更清楚，也更稳。',
    tutorial: { category: 'basics', slug: 'focus', title: '对焦' },
  },
  {
    id: 'flip-screen',
    label: '翻转屏',
    description: '可以侧翻 / 翻转的触摸屏幕，自拍、低角度、高角度都靠它。',
    tutorial: { category: 'composition', slug: 'framing', title: '取景与构图' },
  },

  // —— 正面 ——
  {
    id: 'front-dial',
    label: '前拨轮',
    description: '食指位置的拨轮，通常用来调光圈，和后拨轮配合做手动曝光。',
    tutorial: { category: 'basics', slug: 'aperture', title: '光圈' },
  },
  {
    id: 'lens-mount',
    label: '镜头卡口',
    description: '机身和镜头连接的接口，E 卡口是索尼全画幅的标准接口。',
    tutorial: { category: 'gear', slug: 'lens-system-and-mount', title: '镜头体系与卡口' },
  },

  // —— 底部 / 侧面 ——
  {
    id: 'battery-compartment',
    label: '电池仓',
    description: '底部的盖子里装电池和存储卡，换电池或取卡时从这里打开。',
    tutorial: { category: 'gear', slug: 'essential-accessories', title: '必备配件' },
  },
  {
    id: 'card-slot',
    label: '存储卡仓',
    description: 'A7C2 是单 SD 卡设计，存照片和视频都在这张卡里。',
    tutorial: { category: 'operation', slug: 'raw-vs-jpeg', title: 'RAW 与 JPEG' },
  },
];

export function partById(id: string): CameraPart | undefined {
  return PARTS.find((p) => p.id === id);
}
