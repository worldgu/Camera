/**
 * 7 个视角快捷切换预设（需求 10.2）。
 *
 * 坐标约定：
 * - 相机机身朝 +Z 方向（镜头对着观察者）
 * - +Y 为上，+X 为机身右侧（握柄那侧）
 *
 * position 是相机在世界坐标中的位置，
 * lookAt 是 OrbitControls 的目标点（机身中心附近）。
 *
 * 默认视角是等轴测（3/4 视角），同时能看到机顶 + 正面 + 右侧握柄，
 * 立体感最强，也最符合产品图的常见角度。
 */

export interface CameraView {
  id: string;
  label: string;
  /** Three.js 相机位置 */
  position: [number, number, number];
  /** OrbitControls.target */
  lookAt: [number, number, number];
}

export const VIEWS: CameraView[] = [
  { id: 'front',    label: '正面',   position: [  0,   0,  18], lookAt: [0, 0, 0] },
  { id: 'back',     label: '背面',   position: [  0,   0, -18], lookAt: [0, 0, 0] },
  { id: 'top',      label: '顶面',   position: [  0,  18, 0.1], lookAt: [0, 0, 0] },
  { id: 'bottom',   label: '底面',   position: [  0, -18, 0.1], lookAt: [0, 0, 0] },
  { id: 'left',     label: '左侧',   position: [-18,   0,   0], lookAt: [0, 0, 0] },
  { id: 'right',    label: '右侧',   position: [ 18,   0,   0], lookAt: [0, 0, 0] },
  { id: 'isometric', label: '等轴测', position: [ 10,   7,  13], lookAt: [0, 0, 0] },
];

export const DEFAULT_VIEW_ID = 'isometric';
