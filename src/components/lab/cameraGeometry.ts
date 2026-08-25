/**
 * 相机模型的几何体构建（需求 10.2 方案 A：纯 Three.js 程序化建模）。
 *
 * Sony A7C II 银黑版特征：
 * - 扁平紧凑机身（约 124×71×64mm 比例）
 * - 银色金属顶盖 + 哑光黑机身
 * - 左侧低矮 EVF 军舰部
 * - 右侧浅握把（非 A7 系列大握把）
 * - 正面 E 卡口 + 紧凑饼干镜头轮廓
 * - 背面侧翻屏
 *
 * 每个可交互部件都是独立 Mesh，userData.partId 对应 PARTS 里的 id。
 * 传入的 THREE 为运行时动态 import，避免首屏加载 Three.js。
 */

import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type * as THREE from 'three';

export interface CameraPalette {
  body: string;
  topPlate: string;
  grip: string;
  dial: string;
  accent: string;
  screen: string;
  mount: string;
  /** AF 辅助对焦灯窗 */
  afAssist: string;
  /** 3D 场景底色，取页面的 --bg-secondary */
  background: string;
}

export interface BuiltCamera {
  group: THREE.Group;
  interactive: Map<string, THREE.Object3D>;
}

/** 握把斜向防滑纹（A7C2 握把为斜纹蒙皮） */
function addGripRidges(
  THREE: typeof import('three'),
  group: THREE.Group,
  cx: number,
  cy: number,
  cz: number,
  material: THREE.Material,
) {
  const ridgeMat = material;
  for (let i = -2; i <= 2; i++) {
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.98), ridgeMat);
    ridge.position.set(cx, cy, cz);
    ridge.rotation.y = 0.42;
    ridge.position.x += i * 0.22;
    ridge.position.z += i * 0.18;
    group.add(ridge);
  }
}

/** 背面小按键 */
function rearButton(
  THREE: typeof import('three'),
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
): THREE.Mesh {
  const btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.1, 14),
    material,
  );
  btn.rotation.x = Math.PI / 2;
  btn.position.set(x, y, z);
  return btn;
}
/** 圆角盒体，A7C2 机身线条偏圆润 */
function roundedBox(
  THREE: typeof import('three'),
  w: number,
  h: number,
  d: number,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(w, h, d, 5, radius),
    material,
  );
  return mesh;
}

/** 构建整台相机，返回根 group 和可交互部件映射 */
export function buildCamera(
  THREE: typeof import('three'),
  palette: CameraPalette,
): BuiltCamera {
  const group = new THREE.Group();
  const interactive = new Map<string, THREE.Object3D>();

  const addPart = (id: string, meshes: THREE.Object3D[]) => {
    const partGroup = new THREE.Group();
    partGroup.name = id;
    meshes.forEach((m) => partGroup.add(m));
    group.add(partGroup);
    interactive.set(id, partGroup);
  };

  // ---------- 材质：银黑版 ----------
  const bodyMat = new THREE.MeshStandardMaterial({
    color: palette.body,
    roughness: 0.82,
    metalness: 0.04,
  });
  const topPlateMat = new THREE.MeshStandardMaterial({
    color: palette.topPlate,
    roughness: 0.38,
    metalness: 0.72,
  });
  const gripMat = new THREE.MeshStandardMaterial({
    color: palette.grip,
    roughness: 0.94,
    metalness: 0.0,
  });
  const dialMat = new THREE.MeshStandardMaterial({
    color: palette.dial,
    roughness: 0.55,
    metalness: 0.25,
  });
  const dialTopMat = new THREE.MeshStandardMaterial({
    color: palette.topPlate,
    roughness: 0.32,
    metalness: 0.78,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: palette.accent,
    roughness: 0.45,
    metalness: 0.15,
    emissive: palette.accent,
    emissiveIntensity: 0.18,
  });
  const screenMat = new THREE.MeshStandardMaterial({
    color: palette.screen,
    roughness: 0.22,
    metalness: 0.08,
  });
  const mountMat = new THREE.MeshStandardMaterial({
    color: palette.mount,
    roughness: 0.22,
    metalness: 0.88,
  });
  const rubberMat = new THREE.MeshStandardMaterial({
    color: palette.grip,
    roughness: 0.98,
    metalness: 0.0,
  });
  const afAssistMat = new THREE.MeshStandardMaterial({
    color: palette.afAssist,
    roughness: 0.35,
    metalness: 0.0,
    emissive: palette.afAssist,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.88,
  });
  const logoMat = new THREE.MeshStandardMaterial({
    color: palette.topPlate,
    roughness: 0.45,
    metalness: 0.55,
  });

  // 比例基准：宽 12.4 ≈ 机身 124mm，整体比旧版更扁、更紧凑
  const BODY_W = 9.6;
  const BODY_H = 5.2;
  const BODY_D = 5.6;
  const BODY_Y = -0.2;

  // ---------- 机身主体（圆角黑） ----------
  const body = roundedBox(THREE, BODY_W, BODY_H, BODY_D, 0.32, bodyMat);
  body.position.y = BODY_Y;
  group.add(body);

  // 银色顶盖：覆盖机身顶部，A7C2 银黑版最醒目的特征
  const topPlate = roundedBox(THREE, BODY_W - 0.15, 0.16, BODY_D - 0.25, 0.05, topPlateMat);
  topPlate.position.y = BODY_Y + BODY_H / 2 + 0.08;
  group.add(topPlate);

  const bottomPlate = roundedBox(THREE, BODY_W - 0.2, 0.12, BODY_D - 0.3, 0.04, bodyMat);
  bottomPlate.position.y = BODY_Y - BODY_H / 2 - 0.06;
  group.add(bottomPlate);

  // ---------- EVF 军舰部（左后，低矮） ----------
  const evfBase = roundedBox(THREE, 2.6, 0.95, 2.1, 0.12, bodyMat);
  evfBase.position.set(-3.15, BODY_Y + BODY_H / 2 + 0.42, -0.55);
  group.add(evfBase);

  const evfTop = roundedBox(THREE, 2.35, 0.14, 1.85, 0.04, topPlateMat);
  evfTop.position.set(-3.15, BODY_Y + BODY_H / 2 + 0.98, -0.55);
  group.add(evfTop);

  const evfRubber = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.1, 12, 28),
    rubberMat,
  );
  evfRubber.rotation.x = Math.PI / 2;
  evfRubber.position.set(-3.15, BODY_Y + 0.55, -2.72);

  const evfEyepiece = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.5, 0.22, 24),
    dialMat,
  );
  evfEyepiece.rotation.x = Math.PI / 2;
  evfEyepiece.position.set(-3.15, BODY_Y + 0.55, -2.58);

  const evfRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.03, 8, 24),
    mountMat,
  );
  evfRing.rotation.x = Math.PI / 2;
  evfRing.position.set(-3.15, BODY_Y + 0.55, -2.7);

  const evfGlass = new THREE.Mesh(new THREE.CircleGeometry(0.34, 24), screenMat);
  evfGlass.position.set(-3.15, BODY_Y + 0.55, -2.68);
  evfGlass.rotation.y = Math.PI;

  // 屈光度调节拨轮（EVF 右侧）
  const diopterDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.14, 16),
    dialMat,
  );
  diopterDial.rotation.z = Math.PI / 2;
  diopterDial.position.set(-2.05, BODY_Y + 0.55, -2.55);

  // 眼感应器（取景器下方）
  const eyeSensor = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.12, 0.18),
    screenMat,
  );
  eyeSensor.position.set(-3.15, BODY_Y - 0.15, -2.62);
  group.add(eyeSensor);
  group.add(diopterDial);

  addPart('evf', [evfRubber, evfEyepiece, evfRing, evfGlass]);

  // ---------- 握把（A7C2 浅握把，比 A7M 系列薄） ----------
  const grip = roundedBox(THREE, 0.95, 4.6, 2.55, 0.18, gripMat);
  grip.position.set(5.15, BODY_Y - 0.05, 0.35);
  group.add(grip);

  const gripFront = roundedBox(THREE, 0.75, 3.6, 0.55, 0.12, gripMat);
  gripFront.position.set(5.05, BODY_Y + 0.05, 2.35);
  group.add(gripFront);

  const gripCap = roundedBox(THREE, 0.9, 0.35, 1.1, 0.08, topPlateMat);
  gripCap.position.set(5.15, BODY_Y + BODY_H / 2 + 0.02, 0.9);
  group.add(gripCap);

  addGripRidges(THREE, group, 5.15, BODY_Y - 0.05, 0.35, bodyMat);

  // 正面 α 徽标区 + SONY 字样底板
  const alphaPlate = new THREE.Mesh(
    new THREE.CircleGeometry(0.28, 20),
    logoMat,
  );
  alphaPlate.position.set(4.55, BODY_Y + 0.55, 2.58);
  group.add(alphaPlate);

  const sonyPlate = roundedBox(THREE, 0.95, 0.14, 0.06, 0.02, logoMat);
  sonyPlate.position.set(4.55, BODY_Y - 0.85, 2.58);
  group.add(sonyPlate);

  // ---------- 镜头卡口（三环 + 紧凑饼干镜头） ----------
  const mountOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.35, 0.22, 36),
    mountMat,
  );
  mountOuter.rotation.x = Math.PI / 2;
  mountOuter.position.set(0, BODY_Y + 0.05, 2.72);

  const mountMid = new THREE.Mesh(
    new THREE.CylinderGeometry(2.05, 2.05, 0.24, 36),
    bodyMat,
  );
  mountMid.rotation.x = Math.PI / 2;
  mountMid.position.set(0, BODY_Y + 0.05, 2.7);

  const mountInner = new THREE.Mesh(
    new THREE.CylinderGeometry(1.75, 1.75, 0.26, 36),
    mountMat,
  );
  mountInner.rotation.x = Math.PI / 2;
  mountInner.position.set(0, BODY_Y + 0.05, 2.68);
  group.add(mountMid);

  const mountDot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), accentMat);
  mountDot.position.set(0, BODY_Y + 0.05 + 2.35, 2.86);
  mountDot.rotation.x = -Math.PI / 2;
  group.add(mountDot);

  const lensBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.55, 1.62, 0.85, 32),
    dialMat,
  );
  lensBarrel.rotation.x = Math.PI / 2;
  lensBarrel.position.set(0, BODY_Y + 0.05, 3.35);

  const lensRing = new THREE.Mesh(
    new THREE.CylinderGeometry(1.68, 1.68, 0.12, 32),
    mountMat,
  );
  lensRing.rotation.x = Math.PI / 2;
  lensRing.position.set(0, BODY_Y + 0.05, 3.78);

  const lensFront = new THREE.Mesh(new THREE.CircleGeometry(1.38, 32), screenMat);
  lensFront.position.set(0, BODY_Y + 0.05, 3.84);
  lensFront.rotation.y = Math.PI;

  // 镜头银圈 + 对焦纹
  const lensFeBand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32),
    mountMat,
  );
  lensFeBand.rotation.x = Math.PI / 2;
  lensFeBand.position.set(0, BODY_Y + 0.05, 3.22);
  group.add(lensFeBand);

  const focusRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.58, 0.05, 8, 36),
    dialMat,
  );
  focusRing.rotation.y = Math.PI / 2;
  focusRing.position.set(0, BODY_Y + 0.05, 3.35);
  group.add(focusRing);

  // 镜头释放键（卡口左侧）
  const lensRelease = roundedBox(THREE, 0.32, 0.42, 0.22, 0.05, dialMat);
  lensRelease.position.set(-2.35, BODY_Y + 0.35, 2.62);
  addPart('lens-release', [lensRelease]);

  // AF 辅助对焦灯窗（握把上方）
  const afWindow = roundedBox(THREE, 0.38, 0.18, 0.08, 0.03, afAssistMat);
  afWindow.position.set(3.85, BODY_Y + 0.45, 2.6);
  group.add(afWindow);

  // 正面遥控红外接收窗
  const irWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.14, 0.06),
    screenMat,
  );
  irWindow.position.set(3.2, BODY_Y - 0.55, 2.58);
  group.add(irWindow);

  addPart('lens-mount', [mountOuter, mountInner, lensBarrel, lensRing, lensFront]);

  const topY = BODY_Y + BODY_H / 2 + 0.22;

  // ---------- 机顶：模式转盘 ----------
  const modeDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 1.02, 0.38, 28),
    dialMat,
  );
  modeDial.position.set(2.55, topY + 0.12, 0.55);

  const modeDialTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.88, 0.1, 28),
    dialTopMat,
  );
  modeDialTop.position.set(2.55, topY + 0.34, 0.55);

  const modeDots: THREE.Object3D[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), bodyMat);
    dot.position.set(
      2.55 + Math.cos(angle) * 0.68,
      topY + 0.38,
      0.55 + Math.sin(angle) * 0.68,
    );
    modeDots.push(dot);
  }

  // 模式转盘指针 + 锁定槽
  const modePointer = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.06, 0.28),
    logoMat,
  );
  modePointer.position.set(2.55, topY + 0.4, 0.55 + 0.72);

  const modeLock = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.22),
    dialMat,
  );
  modeLock.position.set(2.55 + 0.95, topY + 0.18, 0.55);
  addPart('mode-dial', [modeDial, modeDialTop, modePointer, modeLock, ...modeDots]);

  // ---------- 机顶：曝光补偿转盘 ----------
  const expDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.72, 0.3, 24),
    dialMat,
  );
  expDial.position.set(2.55, topY + 0.08, -0.75);

  const expDialTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.08, 24),
    dialTopMat,
  );
  expDialTop.position.set(2.55, topY + 0.26, -0.75);

  const expPlus = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.18), logoMat);
  expPlus.position.set(2.55, topY + 0.3, -0.75 - 0.52);
  const expMinus = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.18), logoMat);
  expMinus.position.set(2.55, topY + 0.3, -0.75 + 0.52);
  addPart('exposure-comp-dial', [expDial, expDialTop, expPlus, expMinus]);

  // ---------- 机顶：快门按钮（握把顶部） ----------
  const shutterBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.58, 0.24, 16),
    dialMat,
  );
  shutterBase.position.set(5.35, topY + 0.1, 0.85);

  const shutterBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.16, 16),
    dialTopMat,
  );
  shutterBtn.position.set(5.35, topY + 0.28, 0.85);

  const shutterDot = new THREE.Mesh(new THREE.CircleGeometry(0.09, 12), accentMat);
  shutterDot.position.set(5.35, topY + 0.36, 0.85);
  shutterDot.rotation.x = -Math.PI / 2;

  const shutterRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.04, 8, 20),
    mountMat,
  );
  shutterRing.rotation.x = -Math.PI / 2;
  shutterRing.position.set(5.35, topY + 0.3, 0.85);
  addPart('shutter-button', [shutterBase, shutterBtn, shutterDot, shutterRing]);

  // ---------- 机顶：热靴 ----------
  const shoe = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.2, 0.55), mountMat);
  shoe.position.set(-0.35, topY + 0.06, 0.05);

  const shoeInner = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.1, 0.32), bodyMat);
  shoeInner.position.set(-0.35, topY + 0.14, 0.05);

  const shoePin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.08, 10),
    mountMat,
  );
  shoePin.position.set(-0.35, topY + 0.2, 0.05);

  const shoeRailL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.5), mountMat);
  shoeRailL.position.set(-1.15, topY + 0.1, 0.05);
  const shoeRailR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.5), mountMat);
  shoeRailR.position.set(0.45, topY + 0.1, 0.05);
  addPart('hot-shoe', [shoe, shoeInner, shoePin, shoeRailL, shoeRailR]);

  // ---------- 机顶：C1 / C2 ----------
  const c1Btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.12, 16),
    dialMat,
  );
  c1Btn.position.set(-2.15, topY + 0.04, -0.75);

  const c2Btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.12, 16),
    dialMat,
  );
  c2Btn.position.set(-2.15, topY + 0.04, 0.45);
  addPart('custom-button', [c1Btn, c2Btn]);

  // ---------- 机顶：录像按钮 ----------
  const recordBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.26, 0.12, 16),
    accentMat,
  );
  recordBtn.position.set(4.35, topY + 0.04, -0.85);

  const recordLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 10, 10),
    accentMat,
  );
  recordLed.position.set(4.05, topY + 0.06, -0.85);
  addPart('record-button', [recordBtn, recordLed]);

  // ---------- 正面：前拨轮 ----------
  const frontDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.28, 24),
    dialMat,
  );
  frontDial.rotation.z = Math.PI / 2;
  frontDial.position.set(4.75, BODY_Y + 0.75, 2.55);

  // 机顶麦克风开孔（正面两行小孔）
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const micHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.12, 8),
        bodyMat,
      );
      micHole.rotation.x = Math.PI / 2;
      micHole.position.set(
        -0.8 + col * 0.22,
        topY - 0.05,
        2.45 + row * 0.18,
      );
      group.add(micHole);
    }
  }

  addPart('front-dial', [frontDial]);

  // ---------- 背面：翻转屏（侧翻结构，略张开） ----------
  const screenHinge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 4.2, 12),
    bodyMat,
  );
  screenHinge.rotation.x = Math.PI / 2;
  screenHinge.position.set(1.8, BODY_Y + 0.15, -2.55);
  group.add(screenHinge);

  const hingeArm = roundedBox(THREE, 0.28, 0.85, 0.28, 0.05, bodyMat);
  hingeArm.position.set(1.8, BODY_Y + 0.55, -2.72);
  group.add(hingeArm);

  const screenFrame = roundedBox(THREE, 4.6, 3.15, 0.22, 0.05, bodyMat);
  screenFrame.position.set(0.35, BODY_Y + 0.1, -2.92);
  screenFrame.rotation.x = -0.18;

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 2.65), screenMat);
  screen.position.set(0.35, BODY_Y + 0.1, -3.02);
  screen.rotation.y = Math.PI;
  screen.rotation.x = -0.18;
  addPart('flip-screen', [screenFrame, screen]);

  // ---------- 背面：后拨轮 ----------
  const rearDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 0.2, 24),
    dialMat,
  );
  rearDial.rotation.x = Math.PI / 2;
  rearDial.position.set(4.55, BODY_Y + 1.35, -2.68);

  const rearDialTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24),
    dialTopMat,
  );
  rearDialTop.rotation.x = Math.PI / 2;
  rearDialTop.position.set(4.55, BODY_Y + 1.35, -2.78);
  addPart('rear-dial', [rearDial, rearDialTop]);

  // ---------- 背面：多功能摇杆 ----------
  const wheelBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.12, 24),
    dialMat,
  );
  wheelBase.rotation.x = Math.PI / 2;
  wheelBase.position.set(3.85, BODY_Y - 0.35, -2.68);

  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.17, 0.32, 12),
    dialTopMat,
  );
  stick.rotation.x = Math.PI / 2;
  stick.position.set(3.85, BODY_Y - 0.35, -2.84);
  addPart('control-wheel', [wheelBase, stick]);

  // 背面按键区：MENU / 播放 / AEL / AF-ON / C3
  const backBtns = [
    rearButton(THREE, 4.95, BODY_Y + 0.05, -2.68, dialMat),
    rearButton(THREE, 4.35, BODY_Y + 0.05, -2.68, dialMat),
    rearButton(THREE, 4.95, BODY_Y + 0.75, -2.68, dialMat),
    rearButton(THREE, 4.35, BODY_Y + 0.75, -2.68, dialMat),
    rearButton(THREE, 3.25, BODY_Y + 0.75, -2.68, dialMat),
  ];
  backBtns.forEach((b) => group.add(b));

  const fnLabel = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.08, 0.06),
    logoMat,
  );
  fnLabel.position.set(4.35, BODY_Y + 0.75, -2.74);
  group.add(fnLabel);

  // ---------- 底部：电池仓 ----------
  const batteryDoor = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.1, 1.75),
    dialMat,
  );
  batteryDoor.position.set(2.1, BODY_Y - BODY_H / 2 - 0.1, 0.1);

  const batteryGap = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 0.03, 1.85),
    bodyMat,
  );
  batteryGap.position.set(2.1, BODY_Y - BODY_H / 2 - 0.02, 0.1);
  group.add(batteryGap);

  const batteryLatch = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.08, 0.22),
    mountMat,
  );
  batteryLatch.position.set(0.75, BODY_Y - BODY_H / 2 - 0.08, 0.1);
  group.add(batteryLatch);
  addPart('battery-compartment', [batteryDoor]);

  // ---------- 左侧：存储卡仓 ----------
  const cardDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.35, 1.0),
    dialMat,
  );
  cardDoor.position.set(-4.85, BODY_Y - 0.45, 0.65);

  const cardSeam = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.38, 0.06),
    bodyMat,
  );
  cardSeam.position.set(-4.78, BODY_Y - 0.45, 0.65);
  group.add(cardSeam);
  addPart('card-slot', [cardDoor]);

  // 肩带挂耳（左右各一）
  const lugGeo = new THREE.TorusGeometry(0.14, 0.035, 8, 16, Math.PI);
  const lugL = new THREE.Mesh(lugGeo, mountMat);
  lugL.rotation.y = Math.PI / 2;
  lugL.rotation.z = Math.PI / 2;
  lugL.position.set(-4.75, BODY_Y + 1.35, 0);
  const lugR = new THREE.Mesh(lugGeo, mountMat);
  lugR.rotation.y = -Math.PI / 2;
  lugR.rotation.z = Math.PI / 2;
  lugR.position.set(5.55, BODY_Y + 1.35, 0);
  group.add(lugL, lugR);

  interactive.forEach((obj) => {
    obj.traverse((child) => {
      child.userData.partId = obj.name;
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
    });
  });

  return { group, interactive };
}

/**
 * 读取当前主题，返回 A7C2 银黑版模型配色。
 * 银黑机身配色固定，仅场景底色随页面深浅主题变化。
 */
export function readCameraPalette(host: HTMLElement): CameraPalette {
  const cs = getComputedStyle(host);
  const background =
    cs.getPropertyValue('--bg-secondary').trim() ||
    (document.documentElement.getAttribute('data-theme') === 'dark'
      ? '#141414'
      : '#fafafa');

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (isDark) {
    return {
      body: '#121212',
      topPlate: '#d4d4d4',
      grip: '#0e0e0e',
      dial: '#1f1f1f',
      accent: '#e5484d',
      screen: '#080d18',
      mount: '#c8c8c8',
      afAssist: '#e85d1a',
      background,
    };
  }

  return {
    body: '#181818',
    topPlate: '#b8b8b8',
    grip: '#101010',
    dial: '#262626',
    accent: '#d63a3f',
    screen: '#0a1020',
    mount: '#a8a8a8',
    afAssist: '#d45512',
    background,
  };
}
