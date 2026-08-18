/**
 * 相机模型的几何体构建（需求 10.2 方案 A：纯 Three.js 程序化建模）。
 *
 * 风格化低面数版本，抓住 A7C2 的特征剪影：
 * - 扁平机身 + 左侧 EVF 军舰部
 * - 右侧突出的握柄
 * - 机顶两枚转盘（模式 + 曝光补偿）
 * - 正面中心的 E 卡口
 * - 背面翻转屏
 *
 * 每个可交互部件都是独立 Mesh，userData.partId 对应 PARTS 里的 id，
 * Raycaster 命中后直接按 id 查说明。
 *
 * 传入的 THREE 是运行时动态 import 进来的，避免首屏加载 Three.js。
 */

import type * as THREE from 'three';

export interface CameraPalette {
  body: string;
  topPlate: string;
  grip: string;
  dial: string;
  accent: string;
  screen: string;
  mount: string;
  /** 3D 场景底色，取页面的 --bg-secondary，让画布融进页面 */
  background: string;
}

export interface BuiltCamera {
  group: THREE.Group;
  interactive: Map<string, THREE.Object3D>;
}

/** 构建整台相机，返回根 group 和可交互部件映射 */
export function buildCamera(
  THREE: typeof import('three'),
  palette: CameraPalette,
): BuiltCamera {
  const group = new THREE.Group();
  const interactive = new Map<string, THREE.Object3D>();

  // ---------- 通用材质 ----------
  const bodyMat = new THREE.MeshStandardMaterial({
    color: palette.body,
    roughness: 0.85,
    metalness: 0.05,
  });
  const topPlateMat = new THREE.MeshStandardMaterial({
    color: palette.topPlate,
    roughness: 0.6,
    metalness: 0.35,
  });
  const gripMat = new THREE.MeshStandardMaterial({
    color: palette.grip,
    roughness: 0.95,
    metalness: 0.0,
  });
  const dialMat = new THREE.MeshStandardMaterial({
    color: palette.dial,
    roughness: 0.5,
    metalness: 0.4,
  });
  const dialTopMat = new THREE.MeshStandardMaterial({
    color: palette.topPlate,
    roughness: 0.4,
    metalness: 0.5,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: palette.accent,
    roughness: 0.5,
    metalness: 0.2,
    emissive: palette.accent,
    emissiveIntensity: 0.2,
  });
  const screenMat = new THREE.MeshStandardMaterial({
    color: palette.screen,
    roughness: 0.3,
    metalness: 0.1,
  });
  const mountMat = new THREE.MeshStandardMaterial({
    color: palette.mount,
    roughness: 0.3,
    metalness: 0.8,
  });

  // ---------- 机身主体 ----------
  const body = new THREE.Mesh(new THREE.BoxGeometry(11.6, 6.4, 4.4), bodyMat);
  body.position.y = -0.1;
  group.add(body);

  const topPlate = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.25, 4.0), topPlateMat);
  topPlate.position.y = 3.2 + 0.125;
  group.add(topPlate);

  const bottomPlate = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.2, 4.0), topPlateMat);
  bottomPlate.position.y = -3.3;
  group.add(bottomPlate);

  // ---------- EVF 军舰部（左上，从后面看） ----------
  const evfBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.1, 2.6), bodyMat);
  evfBase.position.set(-2.6, 3.8, -0.1);
  group.add(evfBase);

  const evfTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.25, 2.2), topPlateMat);
  evfTop.position.set(-2.6, 4.4, -0.1);
  group.add(evfTop);

  // EVF 目镜（背面突出）
  const evfEyepiece = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.3, 24),
    dialMat,
  );
  evfEyepiece.rotation.x = Math.PI / 2;
  evfEyepiece.position.set(-2.6, 3.8, -2.4);
  group.add(evfEyepiece);
  const evfGlass = new THREE.Mesh(new THREE.CircleGeometry(0.4, 24), screenMat);
  evfGlass.position.set(-2.6, 3.8, -2.24);
  evfGlass.rotation.y = Math.PI;
  group.add(evfGlass);
  interactive.set('evf', evfEyepiece);

  // ---------- 握柄（右侧） ----------
  const grip = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 3.8), gripMat);
  grip.position.set(6.5, -0.3, 0.2);
  group.add(grip);

  const gripFront = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.5, 0.8), gripMat);
  gripFront.position.set(6.3, -0.2, 2.5);
  group.add(gripFront);

  // 握柄蒙皮纹理（三道凹槽）
  for (let i = -1; i <= 1; i++) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.08, 3.2), bodyMat);
    groove.position.set(6.5, -0.3 + i * 1.3, 0.2);
    group.add(groove);
  }

  // ---------- 镜头卡口（正面中心） ----------
  const mountOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.6, 0.3, 36),
    mountMat,
  );
  mountOuter.rotation.x = Math.PI / 2;
  mountOuter.position.set(0, 0.1, 2.2);
  group.add(mountOuter);

  const mountInner = new THREE.Mesh(
    new THREE.CylinderGeometry(2.1, 2.1, 0.32, 36),
    bodyMat,
  );
  mountInner.rotation.x = Math.PI / 2;
  mountInner.position.set(0, 0.1, 2.18);
  group.add(mountInner);

  const mountDot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), accentMat);
  mountDot.position.set(0, 2.2, 2.36);
  mountDot.rotation.x = -Math.PI / 2;
  group.add(mountDot);

  // 镜头屁股（象征性的一段短镜头，让卡口有体积感）
  const lensStub = new THREE.Mesh(
    new THREE.CylinderGeometry(1.9, 1.9, 1.6, 32),
    dialMat,
  );
  lensStub.rotation.x = Math.PI / 2;
  lensStub.position.set(0, 0.1, 3.2);
  group.add(lensStub);

  const lensFront = new THREE.Mesh(new THREE.CircleGeometry(1.5, 32), screenMat);
  lensFront.position.set(0, 0.1, 4.0);
  lensFront.rotation.y = Math.PI;
  group.add(lensFront);

  interactive.set('lens-mount', mountOuter);

  // ---------- 机顶：模式转盘 ----------
  const modeDial = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.15, 0.45, 24),
    dialMat,
  );
  modeDial.position.set(3.8, 3.6, 0.8);
  group.add(modeDial);

  const modeDialTop = new THREE.Mesh(
    new THREE.CylinderGeometry(1.0, 1.0, 0.12, 24),
    dialTopMat,
  );
  modeDialTop.position.set(3.8, 3.9, 0.8);
  group.add(modeDialTop);

  // 模式转盘刻度（一圈小点）
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      topPlateMat,
    );
    dot.position.set(
      3.8 + Math.cos(angle) * 0.75,
      4.0,
      0.8 + Math.sin(angle) * 0.75,
    );
    group.add(dot);
  }
  interactive.set('mode-dial', modeDialTop);

  // ---------- 机顶：曝光补偿转盘 ----------
  const expDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.85, 0.35, 24),
    dialMat,
  );
  expDial.position.set(3.8, 3.5, -0.8);
  group.add(expDial);

  const expDialTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.1, 24),
    dialTopMat,
  );
  expDialTop.position.set(3.8, 3.7, -0.8);
  group.add(expDialTop);
  interactive.set('exposure-comp-dial', expDialTop);

  // ---------- 机顶：快门按钮 ----------
  const shutterBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 0.3, 16),
    dialMat,
  );
  shutterBase.position.set(6.8, 3.6, 0.6);
  group.add(shutterBase);

  const shutterBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16),
    dialTopMat,
  );
  shutterBtn.position.set(6.8, 3.85, 0.6);
  group.add(shutterBtn);

  const shutterDot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), accentMat);
  shutterDot.position.set(6.8, 3.95, 0.6);
  shutterDot.rotation.x = -Math.PI / 2;
  group.add(shutterDot);
  interactive.set('shutter-button', shutterBtn);

  // ---------- 机顶：热靴 ----------
  const shoe = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 0.7), dialMat);
  shoe.position.set(0, 3.55, 0);
  group.add(shoe);

  const shoeInner = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.12, 0.4),
    bodyMat,
  );
  shoeInner.position.set(0, 3.62, 0);
  group.add(shoeInner);
  interactive.set('hot-shoe', shoe);

  // ---------- 机顶：C1 / C2 自定义键 ----------
  const c1Btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.3, 0.15, 16),
    dialMat,
  );
  c1Btn.position.set(-1.8, 3.55, -1.0);
  group.add(c1Btn);

  const c2Btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.3, 0.15, 16),
    dialMat,
  );
  c2Btn.position.set(-1.8, 3.55, 0.6);
  group.add(c2Btn);
  // 两颗自定义键共用一个交互部件
  const customGroup = new THREE.Group();
  customGroup.add(c1Btn);
  customGroup.add(c2Btn);
  interactive.set('custom-button', customGroup);

  // ---------- 机顶：录像按钮 ----------
  const recordBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.3, 0.15, 16),
    accentMat,
  );
  recordBtn.position.set(5.5, 3.55, -1.0);
  group.add(recordBtn);
  interactive.set('record-button', recordBtn);

  // ---------- 正面：前拨轮 ----------
  const frontDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.35, 24),
    dialMat,
  );
  frontDial.rotation.z = Math.PI / 2;
  frontDial.position.set(5.2, 0.6, 2.5);
  group.add(frontDial);
  interactive.set('front-dial', frontDial);

  // ---------- 背面：翻转屏 ----------
  const screenFrame = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 3.6, 0.3),
    bodyMat,
  );
  screenFrame.position.set(0.6, 0.2, -2.2);
  group.add(screenFrame);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 3.0),
    screenMat,
  );
  screen.position.set(0.6, 0.2, -2.34);
  screen.rotation.y = Math.PI;
  group.add(screen);
  interactive.set('flip-screen', screen);

  // ---------- 背面：后拨轮 ----------
  const rearDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.25, 24),
    dialMat,
  );
  rearDial.rotation.x = Math.PI / 2;
  rearDial.position.set(5.0, 1.6, -2.2);
  group.add(rearDial);

  const rearDialTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.1, 24),
    dialTopMat,
  );
  rearDialTop.rotation.x = Math.PI / 2;
  rearDialTop.position.set(5.0, 1.6, -2.32);
  group.add(rearDialTop);
  interactive.set('rear-dial', rearDial);

  // ---------- 背面：多功能摇杆 ----------
  const wheelBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.15, 24),
    dialMat,
  );
  wheelBase.rotation.x = Math.PI / 2;
  wheelBase.position.set(4.2, -0.4, -2.2);
  group.add(wheelBase);

  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.4, 12),
    dialTopMat,
  );
  stick.rotation.x = Math.PI / 2;
  stick.position.set(4.2, -0.4, -2.4);
  group.add(stick);
  interactive.set('control-wheel', wheelBase);

  // ---------- 底部：电池仓 ----------
  const batteryDoor = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.12, 2.0),
    dialMat,
  );
  batteryDoor.position.set(2.5, -3.38, 0);
  group.add(batteryDoor);

  // 电池仓缝隙
  const batteryGap = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 0.04, 2.1),
    bodyMat,
  );
  batteryGap.position.set(2.5, -3.28, 0);
  group.add(batteryGap);
  interactive.set('battery-compartment', batteryDoor);

  // ---------- 左侧：存储卡仓 ----------
  const cardDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.6, 1.2),
    dialMat,
  );
  cardDoor.position.set(-5.9, -0.6, 0.8);
  group.add(cardDoor);
  interactive.set('card-slot', cardDoor);

  // 给所有交互部件打上 partId 标记（含组内子 mesh）。
  // 材质必须逐个 clone：上面的 dialTopMat / mountMat 等是多个部件共用的，
  // 悬停高亮直接改 material.emissive，不 clone 会让同材质的其他部件一起发光。
  interactive.forEach((obj, id) => {
    obj.traverse((child) => {
      child.userData.partId = id;
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
 * 读取当前主题，返回模型配色。
 *
 * 主题的唯一判据是 `<html data-theme>`，与 ThemeToggle 写入的属性一致；
 * 不去解析 `--fg` 的十六进制值，那种猜法在变量换成 rgb()/oklch() 时就会失效。
 */
export function readCameraPalette(host: HTMLElement): CameraPalette {
  const isDark =
    document.documentElement.getAttribute('data-theme') === 'dark';

  // 场景底色跟着页面变量走，画布边界才不会显出一块突兀的方形
  const cs = getComputedStyle(host);
  const background =
    cs.getPropertyValue('--bg-secondary').trim() ||
    (isDark ? '#141414' : '#fafafa');

  // 深色背景下金属感强一些，浅色背景下机身压深，保证与页面底色有对比。
  if (isDark) {
    return {
      body: '#1f1f1f',
      topPlate: '#333333',
      grip: '#111111',
      dial: '#3f3f3f',
      accent: '#e5484d',
      screen: '#0a0f1f',
      mount: '#707070',
      background,
    };
  }
  return {
    body: '#3a3a3a',
    topPlate: '#525252',
    grip: '#242424',
    dial: '#6a6a6a',
    accent: '#d63a3f',
    screen: '#12182e',
    mount: '#9a9a9a',
    background,
  };
}
