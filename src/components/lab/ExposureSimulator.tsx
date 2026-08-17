import { useEffect, useMemo, useRef, useState } from 'react';
import Dial from './Dial';
import Histogram from './Histogram';
import { SCENES, layersOf, type Palette, type SceneKey } from './scenes';
import { renderScene, sampleHistogram } from './render';
import {
  APERTURES,
  ISOS,
  SHUTTERS,
  backgroundBlur,
  compensate,
  exposureError,
  formatAperture,
  formatIso,
  formatShutter,
  motionBlur,
  noiseAmount,
  type ParamKey,
  type Params,
} from './exposure';

interface Props {
  base: string;
}

const DEFAULTS: Params = {
  apertureIndex: 3, // f/4
  shutterIndex: 5, // 1/125
  isoIndex: 0, // ISO 100
};

/** 从 URL query 读预设，供教程文章跳转时带参数（需求 10.6） */
function readPreset(): { params: Params; scene: SceneKey } {
  const fallback = { params: DEFAULTS, scene: 'portrait' as SceneKey };
  if (typeof window === 'undefined') return fallback;

  const q = new URLSearchParams(window.location.search);
  /**
   * 找最接近的档位下标。比较在「对数域」上做，因为档位按倍数递进，
   * 线性比较会偏向大数一侧（例如 iso=300 应落在 400 而不是 200）。
   */
  const nearest = (list: readonly number[], raw: string | null, dflt: number) => {
    if (!raw) return dflt;
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return dflt;
    let best = dflt;
    let bestGap = Infinity;
    list.forEach((v, i) => {
      const gap = Math.abs(Math.log2(v) - Math.log2(n));
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    });
    return best;
  };

  /**
   * 快门 query 按相机读数书写：`500` 表示 1/500s，`0.5` 或 `2"` 表示整秒。
   * 档位表里正值存分母、负值存整秒，这里换算成秒后在对数域比较。
   */
  const nearestShutter = (raw: string | null, dflt: number) => {
    if (!raw) return dflt;
    const trimmed = raw.replace(/["s]$/i, '');
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n <= 0) return dflt;
    // 大于 1 且没带引号的整数按「分母」理解，符合相机上 1/125 的写法
    const seconds = /["]/.test(raw) || n < 1 ? n : 1 / n;
    let best = dflt;
    let bestGap = Infinity;
    SHUTTERS.forEach((v, i) => {
      const sec = v > 0 ? 1 / v : -v;
      const gap = Math.abs(Math.log2(sec) - Math.log2(seconds));
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    });
    return best;
  };

  const sceneRaw = q.get('scene');
  const scene = SCENES.some((s) => s.key === sceneRaw)
    ? (sceneRaw as SceneKey)
    : fallback.scene;

  return {
    params: {
      apertureIndex: nearest(APERTURES, q.get('aperture'), DEFAULTS.apertureIndex),
      shutterIndex: nearestShutter(q.get('shutter'), DEFAULTS.shutterIndex),
      isoIndex: nearest(ISOS, q.get('iso'), DEFAULTS.isoIndex),
    },
    scene,
  };
}

/** 从 CSS 变量取色，保证深浅色主题下画面跟着变 */
function readPalette(host: HTMLElement, scene: SceneKey): Palette {
  const cs = getComputedStyle(host);
  const v = (name: string, dflt: string) => cs.getPropertyValue(name).trim() || dflt;
  const fg = v('--fg', '#1a1a1a');
  const muted = v('--fg-muted', '#999');
  const border = v('--border', '#e5e5e5');
  const bg = v('--bg', '#fff');

  if (scene === 'night') {
    return { sky: '#0b1020', far: '#161d2e', mid: '#232c40', near: '#0f1420', subject: fg, accent: '#f5d7a1' };
  }
  if (scene === 'landscape') {
    return { sky: bg, far: border, mid: muted, near: fg, subject: fg, accent: muted };
  }
  return { sky: bg, far: border, mid: muted, near: muted, subject: fg, accent: bg };
}

export default function ExposureSimulator({ base }: Props) {
  const [params, setParams] = useState<Params>(DEFAULTS);
  const [scene, setScene] = useState<SceneKey>('portrait');
  const [autoExposure, setAutoExposure] = useState(false);
  const [bins, setBins] = useState<number[]>(() => new Array(256).fill(0));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  // 首次挂载时读 URL 预设
  useEffect(() => {
    const preset = readPreset();
    setParams(preset.params);
    setScene(preset.scene);
  }, []);

  const meta = SCENES.find((s) => s.key === scene) ?? SCENES[0];
  const ev = exposureError(params, meta.light);
  const layers = useMemo(() => layersOf(scene), [scene]);

  // 渲染：参数或场景变化就重画，并回采直方图
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    let raf = 0;
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      renderScene(ctx, w, h, {
        layers,
        palette: readPalette(host, scene),
        blur: backgroundBlur(params.apertureIndex),
        motion: motionBlur(params.shutterIndex) * dpr,
        noise: noiseAmount(params.isoIndex),
        ev,
      });
      setBins(sampleHistogram(ctx, w, h));
    };

    raf = requestAnimationFrame(paint);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    window.addEventListener('resize', onResize);

    // 主题切换时重画
    const observer = new MutationObserver(onResize);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, [layers, params, scene, ev]);

  const step = (key: ParamKey, delta: number) => {
    setParams((prev) => {
      const next = { ...prev };
      if (key === 'aperture') {
        next.apertureIndex = Math.max(0, Math.min(APERTURES.length - 1, prev.apertureIndex + delta));
      } else if (key === 'shutter') {
        next.shutterIndex = Math.max(0, Math.min(SHUTTERS.length - 1, prev.shutterIndex + delta));
      } else {
        next.isoIndex = Math.max(0, Math.min(ISOS.length - 1, prev.isoIndex + delta));
      }
      return autoExposure ? compensate(prev, next, key, meta.light) : next;
    });
  };

  const evLabel = ev === 0 ? '±0.0 EV' : `${ev > 0 ? '+' : ''}${ev.toFixed(1)} EV`;
  const evState = ev > 1.5 ? '过曝' : ev < -1.5 ? '欠曝' : '正常';

  return (
    <div className="sim" ref={hostRef}>
      <div className="sim__preview">
        <canvas ref={canvasRef} className="sim__canvas" />
        <div className="sim__readout">
          <span>{formatAperture(params.apertureIndex)}</span>
          <span>{formatShutter(params.shutterIndex)}s</span>
          <span>ISO {formatIso(params.isoIndex)}</span>
          <span className={`sim__ev sim__ev--${evState === '正常' ? 'ok' : 'warn'}`}>
            {evLabel} · {evState}
          </span>
        </div>
        <Histogram bins={bins} />
      </div>

      <div className="sim__panel">
        <div className="sim__scenes" role="group" aria-label="场景预设">
          {SCENES.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`sim__scene${s.key === scene ? ' is-active' : ''}`}
              onClick={() => setScene(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="sim__hint">{meta.hint}</p>

        <Dial
          label="光圈"
          sub="Aperture"
          name="aperture"
          value={formatAperture(params.apertureIndex)}
          atMin={params.apertureIndex === 0}
          atMax={params.apertureIndex === APERTURES.length - 1}
          onStep={(d) => step('aperture', d)}
        />
        <Dial
          label="快门"
          sub="Shutter"
          name="shutter"
          value={`${formatShutter(params.shutterIndex)}s`}
          atMin={params.shutterIndex === 0}
          atMax={params.shutterIndex === SHUTTERS.length - 1}
          onStep={(d) => step('shutter', d)}
        />
        <Dial
          label="感光度"
          sub="ISO"
          name="iso"
          value={formatIso(params.isoIndex)}
          atMin={params.isoIndex === 0}
          atMax={params.isoIndex === ISOS.length - 1}
          onStep={(d) => step('iso', d)}
        />

        <label className="sim__auto">
          <input
            type="checkbox"
            checked={autoExposure}
            onChange={(e) => setAutoExposure(e.target.checked)}
          />
          <span>自动曝光补偿</span>
        </label>
        <p className="sim__hint sim__hint--sub">
          打开后调一个参数，另一个会反向补偿，总曝光保持不变。
        </p>

        <button type="button" className="sim__reset" onClick={() => setParams(DEFAULTS)}>
          恢复默认
        </button>
      </div>
    </div>
  );
}
