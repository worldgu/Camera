import { useEffect, useRef, useState } from 'react';
import { buildCamera, readCameraPalette, type BuiltCamera } from './cameraGeometry';
import { VIEWS, DEFAULT_VIEW_ID, type CameraView } from './cameraViews';
import { PARTS, partById, type CameraPart } from './cameraParts';

interface Props {
  base: string;
}

/**
 * 相机模型实验（需求 10.2）：
 * - Three.js 程序化建模 Sony A7C2
 * - OrbitControls 360° 旋转 + 缩放
 * - 7 个视角快捷切换（带动画）
 * - Raycaster 拾取 13 个可交互部件
 * - 点击部件弹出说明浮层，含「了解更多 →」跳转对应教程
 * - 深浅色主题跟随
 *
 * Three.js 及 OrbitControls 均为动态 import，首屏不加载 3D 代码。
 */
export default function CameraModel({ base }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeView, setActiveView] = useState(DEFAULT_VIEW_ID);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [hoverPartId, setHoverPartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 由 Three.js 初始化后填入的高亮更新函数。
   * React 状态（悬停 / 选中）通过它推给 3D 场景，
   * 这样点击右侧部件列表也能点亮模型上的对应部件。
   */
  const emphasisRef = useRef<
    ((patch: { hover?: string | null; selected?: string | null }) => void) | null
  >(null);

  // 运行时状态（不触发重渲染的都放 ref）
  const runtimeRef = useRef<{
    scene: any;
    camera: any;
    renderer: any;
    controls: any;
    cameraGroup: BuiltCamera | null;
    raycaster: any;
    pointer: any;
    targetPos: { x: number; y: number; z: number };
    targetLook: { x: number; y: number; z: number };
    highlightMaterials: Map<any, any>;
    raf: number;
  } | null>(null);

  const selectedPart: CameraPart | null = selectedPartId
    ? partById(selectedPartId) ?? null
    : null;

  // ---------- 初始化 Three.js ----------
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    (async () => {
      // 动态加载，首屏不加载 3D 代码（需求 10.4）。
      // three 只有命名导出，没有 default，必须整体拿 namespace。
      const THREE = await import('three');
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
      if (disposed) return;

      const palette = readCameraPalette(host);

      // —— 场景 + 背景 ——
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(palette.background);

      // —— 相机 ——
      const defaultView = VIEWS.find((v) => v.id === DEFAULT_VIEW_ID)!;
      const camera = new THREE.PerspectiveCamera(
        35,
        host.clientWidth / host.clientHeight,
        0.1,
        100,
      );
      camera.position.set(...defaultView.position);

      // —— 渲染器 ——
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // —— 灯光：三点布光 + 环境光 ——
      const ambient = new THREE.AmbientLight(0xffffff, 0.45);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
      keyLight.position.set(8, 10, 8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xb0c4ff, 0.4);
      fillLight.position.set(-8, 4, 6);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
      rimLight.position.set(-4, 6, -8);
      scene.add(rimLight);

      // 地面承接阴影（几乎看不见，只用来让相机不浮空）
      const groundGeo = new THREE.CircleGeometry(20, 48);
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.25 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -3.8;
      ground.receiveShadow = true;
      scene.add(ground);

      // —— 相机模型 ——
      let cameraModel = buildCamera(THREE, palette);
      cameraModel.group.traverse((obj) => {
        const mesh = obj as any;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      scene.add(cameraModel.group);

      // —— 控制器 ——
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 6;
      controls.maxDistance = 35;
      controls.target.set(...defaultView.lookAt);
      controls.update();

      // —— Raycaster ——
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const highlightMaterials = new Map<any, { emissive: number; emissiveIntensity: number }>();

      const runtime = {
        scene,
        camera,
        renderer,
        controls,
        cameraGroup: cameraModel,
        raycaster,
        pointer,
        targetPos: {
          x: defaultView.position[0],
          y: defaultView.position[1],
          z: defaultView.position[2],
        },
        targetLook: {
          x: defaultView.lookAt[0],
          y: defaultView.lookAt[1],
          z: defaultView.lookAt[2],
        },
        highlightMaterials,
        raf: 0,
      };
      runtimeRef.current = runtime;
      setLoading(false);

      // —— 动画循环 ——
      const animate = () => {
        runtime.raf = requestAnimationFrame(animate);

        // 视角平滑过渡（朝 targetPos / targetLook lerp）
        const pos = camera.position;
        pos.x += (runtime.targetPos.x - pos.x) * 0.08;
        pos.y += (runtime.targetPos.y - pos.y) * 0.08;
        pos.z += (runtime.targetPos.z - pos.z) * 0.08;

        const tgt = controls.target;
        tgt.x += (runtime.targetLook.x - tgt.x) * 0.1;
        tgt.y += (runtime.targetLook.y - tgt.y) * 0.1;
        tgt.z += (runtime.targetLook.z - tgt.z) * 0.1;

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // —— 尺寸调整 ——
      // 用 ResizeObserver 而不是 window.resize：容器宽度会随侧栏折叠、
      // 字体加载等布局变化改变，光听窗口尺寸会漏掉这些情况。
      const onResize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(host);

      // —— 主题切换时重建材质 ——
      const onTheme = () => {
        const p = readCameraPalette(host);
        scene.background = new THREE.Color(p.background);
        // 部件数不多，直接重建整个模型
        if (cameraModel) {
          scene.remove(cameraModel.group);
          disposeGroup(cameraModel.group);
        }
        cameraModel = buildCamera(THREE, p);
        cameraModel.group.traverse((obj) => {
          const mesh = obj as any;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        scene.add(cameraModel.group);
        runtime.cameraGroup = cameraModel;
        // 模型换新，之前记录的材质快照和已上色列表全部作废，
        // 清空后按当前 React 状态重新点亮，避免主题切换丢失选中高亮
        highlightMaterials.clear();
        applied.clear();
        syncHighlight();
      };
      const themeObserver = new MutationObserver(onTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });

      // —— 指针拾取：悬停高亮 + 点击选中 ——
      const currentGroup = () => runtime.cameraGroup;

      const getPartIdFromEvent = (event: PointerEvent): string | null => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        const group = currentGroup();
        if (!group) return null;

        const meshes: any[] = [];
        group.group.traverse((obj) => {
          if ((obj as any).isMesh) meshes.push(obj);
        });
        const hits = raycaster.intersectObjects(meshes, false);
        for (const hit of hits) {
          const pid = (hit.object as any).userData?.partId;
          if (pid) return pid;
        }
        return null;
      };

      /** 给单个部件上/下高亮，原始 emissive 存在 highlightMaterials 里以便还原 */
      const paintPart = (partId: string, intensity: number) => {
        const group = currentGroup();
        if (!group) return;
        const obj = group.interactive.get(partId);
        if (!obj) return;
        obj.traverse((child) => {
          const mesh = child as any;
          if (!mesh.isMesh) return;
          const mat = mesh.material as any;
          if (!mat) return;
          if (intensity > 0) {
            if (!highlightMaterials.has(mesh)) {
              highlightMaterials.set(mesh, {
                emissive: mat.emissive?.getHex?.() ?? 0,
                emissiveIntensity: mat.emissiveIntensity ?? 0,
              });
            }
            mat.emissive = new THREE.Color(0x8fb0ff);
            mat.emissiveIntensity = intensity;
          } else {
            const prev = highlightMaterials.get(mesh);
            if (prev) {
              mat.emissive = new THREE.Color(prev.emissive);
              mat.emissiveIntensity = prev.emissiveIntensity;
              highlightMaterials.delete(mesh);
            }
          }
        });
      };

      /**
       * 高亮有两个来源：鼠标悬停和当前选中，两者可以同时存在。
       * 统一收敛成「期望状态」再和已上色的部件做差集，避免
       * 取消悬停时把仍然选中的部件一起熄灭。
       */
      const emphasis: { hover: string | null; selected: string | null } = {
        hover: null,
        selected: null,
      };
      const applied = new Map<string, number>();

      const syncHighlight = () => {
        const want = new Map<string, number>();
        if (emphasis.hover) want.set(emphasis.hover, 0.45);
        if (emphasis.selected) want.set(emphasis.selected, 0.9);

        applied.forEach((_, id) => {
          if (!want.has(id)) {
            paintPart(id, 0);
            applied.delete(id);
          }
        });
        want.forEach((intensity, id) => {
          if (applied.get(id) !== intensity) {
            paintPart(id, intensity);
            applied.set(id, intensity);
          }
        });
      };

      // 交给 React 侧调用：部件列表的悬停 / 选中也能点亮模型
      emphasisRef.current = (patch) => {
        Object.assign(emphasis, patch);
        syncHighlight();
      };

      let lastHover: string | null = null;

      const onMove = (event: PointerEvent) => {
        const pid = getPartIdFromEvent(event);
        if (pid === lastHover) return;
        lastHover = pid;
        // 只更新 React 状态，实际上色由 emphasis 效应统一处理
        setHoverPartId(pid);
        canvas.style.cursor = pid ? 'pointer' : 'grab';
      };

      // 拖动旋转过程中不应触发选中，记录按下位置，位移超过阈值就当作旋转
      let downAt: { x: number; y: number } | null = null;

      const onDown = (event: PointerEvent) => {
        downAt = { x: event.clientX, y: event.clientY };
      };

      const onUp = (event: PointerEvent) => {
        if (!downAt) return;
        const moved =
          Math.abs(event.clientX - downAt.x) + Math.abs(event.clientY - downAt.y);
        downAt = null;
        if (moved > 6) return;
        const pid = getPartIdFromEvent(event);
        // 同一个点两下 = 关闭
        setSelectedPartId((prev) => (prev === pid ? null : pid));
      };

      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointerup', onUp);

      // —— 清理函数 ——
      teardown = () => {
        cancelAnimationFrame(runtime.raf);
        resizeObserver.disconnect();
        themeObserver.disconnect();
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointerup', onUp);
        controls.dispose();
        renderer.dispose();
        disposeGroup(scene);
        runtimeRef.current = null;
      };
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  // 悬停 / 选中变化时同步到 3D 场景
  useEffect(() => {
    emphasisRef.current?.({ hover: hoverPartId, selected: selectedPartId });
  }, [hoverPartId, selectedPartId, loading]);

  // 切换视角
  const handleViewChange = (view: CameraView) => {
    setActiveView(view.id);
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.targetPos.x = view.position[0];
    rt.targetPos.y = view.position[1];
    rt.targetPos.z = view.position[2];
    rt.targetLook.x = view.lookAt[0];
    rt.targetLook.y = view.lookAt[1];
    rt.targetLook.z = view.lookAt[2];
  };

  return (
    <div className="camera-model" ref={hostRef}>
      <canvas ref={canvasRef} className="camera-model__canvas" />

      {loading && (
        <div className="camera-model__loading">
          <div className="camera-model__loading-ring" />
          <span>加载相机模型中…</span>
        </div>
      )}

      {/* 视角切换 */}
      <div className="camera-model__views" role="group" aria-label="视角切换">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            className={`camera-model__view${activeView === view.id ? ' is-active' : ''}`}
            onClick={() => handleViewChange(view)}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* 可交互部件列表 */}
      <div
        className={`camera-model__parts${selectedPart ? ' is-collapsed' : ''}`}
      >
        <div className="camera-model__parts-head">
          <span className="camera-model__parts-label">可交互部件</span>
          <span className="camera-model__parts-count">{PARTS.length} 个</span>
        </div>
        <ul className="camera-model__parts-list">
          {PARTS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={`camera-model__part-btn${
                  selectedPartId === p.id ? ' is-active' : ''
                }${hoverPartId === p.id ? ' is-hover' : ''}`}
                onMouseEnter={() => setHoverPartId(p.id)}
                onMouseLeave={() =>
                  setHoverPartId((prev) => (prev === p.id ? null : prev))
                }
                onClick={() =>
                  setSelectedPartId((prev) => (prev === p.id ? null : p.id))
                }
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 选中部件说明浮层 */}
      {selectedPart && (
        <div className="camera-model__info" role="dialog" aria-label={selectedPart.label}>
          <button
            type="button"
            className="camera-model__info-close"
            onClick={() => setSelectedPartId(null)}
            aria-label="关闭说明"
          >
            ×
          </button>
          <h3 className="camera-model__info-title">{selectedPart.label}</h3>
          <p className="camera-model__info-desc">{selectedPart.description}</p>
          {selectedPart.tutorial && (
            <a
              className="camera-model__info-link"
              href={`${base}/learn/${selectedPart.tutorial.category}/${selectedPart.tutorial.slug}/`}
            >
              了解更多 →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/** 递归释放 group 下的 geometry 和 material */
function disposeGroup(obj: any) {
  obj.traverse?.((child: any) => {
    if (child.geometry) child.geometry.dispose?.();
    if (child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m: any) => m.dispose?.());
    }
  });
}
