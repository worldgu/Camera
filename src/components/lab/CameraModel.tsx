import { useEffect, useRef, useState } from 'react';
import { buildCamera, readCameraPalette, type BuiltCamera } from './cameraGeometry';
import { VIEWS, DEFAULT_VIEW_ID, type CameraView } from './cameraViews';
import { PARTS, PART_GROUPS, partById, type CameraPart } from './cameraParts';

interface Props {
  base: string;
}

/** 屏幕空间的部件热点，用于在画布上标出可点位置 */
interface Hotspot {
  id: string;
  label: string;
  /** 百分比坐标，直接喂给 CSS left/top */
  x: number;
  y: number;
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
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [showHotspots, setShowHotspots] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

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
    /** 正在进行的视角过渡；null 表示相机完全交给 OrbitControls */
    flight: {
      fromPos: any;
      toPos: any;
      fromLook: any;
      toLook: any;
      start: number;
      duration: number;
    } | null;
    highlightMaterials: Map<any, any>;
    raf: number;
  } | null>(null);

  /** 由 Three.js 侧填入：把视角飞到指定预设 */
  const flyToRef = useRef<((view: CameraView) => void) | null>(null);
  /** 由 Three.js 侧填入：切换自动旋转 */
  const autoRotateRef = useRef<((on: boolean) => void) | null>(null);

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
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      // —— 灯光：三点布光 + 环境光 ——
      const ambient = new THREE.AmbientLight(0xffffff, 0.42);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.15);
      keyLight.position.set(8, 12, 9);
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
      ground.position.y = -3.2;
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
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
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
        flight: null as null | {
          fromPos: any;
          toPos: any;
          fromLook: any;
          toLook: any;
          start: number;
          duration: number;
        },
        highlightMaterials,
        raf: 0,
      };
      runtimeRef.current = runtime;
      setLoading(false);

      // 视角切换：记录起止点做一次限时补间，结束后交还控制权给 OrbitControls。
      // 早先的实现是每帧朝目标 lerp，永不结束，用户拖动会被一直往回拽。
      flyToRef.current = (view) => {
        runtime.flight = {
          fromPos: camera.position.clone(),
          toPos: new THREE.Vector3(...view.position),
          fromLook: controls.target.clone(),
          toLook: new THREE.Vector3(...view.lookAt),
          start: performance.now(),
          duration: 620,
        };
      };

      autoRotateRef.current = (on) => {
        controls.autoRotate = on;
      };

      // 用户一上手就停掉自动旋转，别和手动操作抢方向
      const stopAutoRotate = () => {
        if (!controls.autoRotate) return;
        controls.autoRotate = false;
        setAutoRotate(false);
      };
      controls.addEventListener('start', stopAutoRotate);

      // 热点投影每隔几帧算一次就够，位置变化本身是连续的
      const projected = new THREE.Vector3();
      let hotspotTick = 0;
      const updateHotspots = () => {
        const group = runtime.cameraGroup;
        if (!group) return;
        const next: Hotspot[] = [];
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);

        group.interactive.forEach((obj, id) => {
          const part = partById(id);
          if (!part) return;
          const box = new THREE.Box3().setFromObject(obj);
          if (box.isEmpty()) return;
          box.getCenter(projected);

          // 背面朝向观察者的部件不标点：从部件指向相机的方向若与视线同向，说明被机身挡住
          const toCamera = new THREE.Vector3()
            .subVectors(camera.position, projected)
            .normalize();
          if (toCamera.dot(camDir) > -0.1) return;

          // 遮挡测试：从相机打一条射线到部件中心，若先撞到别的部件就跳过
          raycaster.set(
            camera.position,
            new THREE.Vector3().subVectors(projected, camera.position).normalize(),
          );
          const blockers: any[] = [];
          group.group.traverse((o) => {
            if ((o as any).isMesh) blockers.push(o);
          });
          const hit = raycaster.intersectObjects(blockers, false)[0];
          if (hit && hit.object.userData?.partId !== id) return;

          const ndc = projected.clone().project(camera);
          if (ndc.z > 1 || ndc.x < -1 || ndc.x > 1 || ndc.y < -1 || ndc.y > 1) return;
          next.push({
            id,
            label: part.label,
            x: (ndc.x * 0.5 + 0.5) * 100,
            y: (-ndc.y * 0.5 + 0.5) * 100,
          });
        });
        setHotspots(next);
      };

      // —— 动画循环 ——
      const animate = () => {
        runtime.raf = requestAnimationFrame(animate);

        const flight = runtime.flight;
        if (flight) {
          const t = Math.min(1, (performance.now() - flight.start) / flight.duration);
          // easeInOutCubic，起步和落位都收一下
          const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          camera.position.lerpVectors(flight.fromPos, flight.toPos, e);
          controls.target.lerpVectors(flight.fromLook, flight.toLook, e);
          if (t >= 1) runtime.flight = null;
        }

        controls.update();

        if (++hotspotTick % 6 === 0) updateHotspots();
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
        // 同一个点两下 = 关闭。画布上直接点中的部件已经在眼前，不必再飞视角。
        setSelectedPartId((prev) => (prev === pid ? null : pid));
        if (pid) {
          autoRotateRef.current?.(false);
          setAutoRotate(false);
        }
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
        controls.removeEventListener('start', stopAutoRotate);
        controls.dispose();
        renderer.dispose();
        disposeGroup(scene);
        runtimeRef.current = null;
        flyToRef.current = null;
        autoRotateRef.current = null;
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

  // Esc 关闭说明浮层
  useEffect(() => {
    if (!selectedPartId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPartId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPartId]);

  // 切换视角：交给 Three.js 侧做一次限时补间
  const handleViewChange = (view: CameraView) => {
    setActiveView(view.id);
    setAutoRotate(false);
    autoRotateRef.current?.(false);
    flyToRef.current?.(view);
  };

  const toggleAutoRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    autoRotateRef.current?.(next);
  };

  /** 选中部件：顺带飞到看得见它的那一面 */
  const selectPart = (id: string | null) => {
    setSelectedPartId((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        const part = partById(next);
        const view = part?.bestView
          ? VIEWS.find((v) => v.id === part.bestView)
          : undefined;
        if (view) {
          setActiveView(view.id);
          setAutoRotate(false);
          autoRotateRef.current?.(false);
          flyToRef.current?.(view);
        }
      }
      return next;
    });
  };

  /** 按列表顺序翻到上/下一个部件 */
  const stepPart = (delta: number) => {
    const idx = PARTS.findIndex((p) => p.id === selectedPartId);
    const next = PARTS[(idx + delta + PARTS.length) % PARTS.length];
    if (!next || next.id === selectedPartId) return;
    setSelectedPartId(next.id);
    const view = next.bestView ? VIEWS.find((v) => v.id === next.bestView) : undefined;
    if (view) {
      setActiveView(view.id);
      setAutoRotate(false);
      autoRotateRef.current?.(false);
      flyToRef.current?.(view);
    }
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

      {/* 部件热点：标出画面上当前可点的位置 */}
      {!loading && showHotspots && (
        <div className="camera-model__hotspots" aria-hidden="true">
          {hotspots.map((h) => (
            <span
              key={h.id}
              className={`camera-model__hotspot${
                selectedPartId === h.id ? ' is-active' : ''
              }${hoverPartId === h.id ? ' is-hover' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <i className="camera-model__hotspot-dot" />
              <em className="camera-model__hotspot-label">{h.label}</em>
            </span>
          ))}
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

      {/* 画布开关：自动旋转 / 热点显隐 */}
      <div className="camera-model__toggles">
        <button
          type="button"
          className={`camera-model__toggle${autoRotate ? ' is-on' : ''}`}
          onClick={toggleAutoRotate}
          aria-pressed={autoRotate}
          title={autoRotate ? '停止自动旋转' : '开始自动旋转'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
          <span className="camera-model__toggle-text">自动旋转</span>
        </button>
        <button
          type="button"
          className={`camera-model__toggle${showHotspots ? ' is-on' : ''}`}
          onClick={() => setShowHotspots((v) => !v)}
          aria-pressed={showHotspots}
          title={showHotspots ? '隐藏部件标记' : '显示部件标记'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="camera-model__toggle-text">部件标记</span>
        </button>
      </div>

      {/* 可交互部件列表 */}
      <div
        className={`camera-model__parts${selectedPart ? ' is-collapsed' : ''}`}
      >
        <div className="camera-model__parts-head">
          <span className="camera-model__parts-label">可交互部件</span>
          <span className="camera-model__parts-count">{PARTS.length} 个</span>
        </div>
        <div className="camera-model__parts-scroll">
          {PART_GROUPS.map((g) => (
            <div className="camera-model__parts-group" key={g.label}>
              <span className="camera-model__parts-group-label">{g.label}</span>
              <ul className="camera-model__parts-list">
                {g.ids.map((id) => {
                  const p = partById(id);
                  if (!p) return null;
                  return (
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
                        onClick={() => selectPart(p.id)}
                      >
                        {p.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
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
          <div className="camera-model__info-foot">
            {selectedPart.tutorial ? (
              <a
                className="camera-model__info-link"
                href={`${base}/learn/${selectedPart.tutorial.category}/${selectedPart.tutorial.slug}/`}
              >
                {selectedPart.tutorial.title} →
              </a>
            ) : (
              <span />
            )}
            {/* 顺序翻阅所有部件，省得每次回到列表里找 */}
            <span className="camera-model__info-nav">
              <button
                type="button"
                onClick={() => stepPart(-1)}
                aria-label="上一个部件"
                title="上一个部件"
              >
                ‹
              </button>
              <span className="camera-model__info-index">
                {PARTS.findIndex((p) => p.id === selectedPart.id) + 1}/{PARTS.length}
              </span>
              <button
                type="button"
                onClick={() => stepPart(1)}
                aria-label="下一个部件"
                title="下一个部件"
              >
                ›
              </button>
            </span>
          </div>
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
