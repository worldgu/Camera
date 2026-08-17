import { useEffect, useRef } from 'react';

/**
 * 曝光模拟器实验 — 骨架组件
 * TODO: 接入 2.5D 分层 + shader 后处理
 * - 光圈 / 快门 / ISO 三参数调节
 * - 景深虚化 / 运动模糊 / 噪点 / 亮度 实时效果
 * - 自动曝光开关
 * - 实时直方图
 * - 2-3 个场景预设
 */
export default function ExposureSimulator() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 预留：Three.js + 后处理初始化代码将放在这里
    console.log('[Lab] ExposureSimulator mount - placeholder');
  }, []);

  return (
    <div ref={containerRef} className="lab-placeholder">
      <div className="lab-placeholder__icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="10" y1="12" x2="10" y2="36" />
          <line x1="24" y1="8" x2="24" y2="40" />
          <line x1="38" y1="16" x2="38" y2="32" />
          <circle cx="10" cy="20" r="3" fill="currentColor" />
          <circle cx="24" cy="28" r="3" fill="currentColor" />
          <circle cx="38" cy="24" r="3" fill="currentColor" />
        </svg>
      </div>
      <h3>曝光模拟器</h3>
      <p>正在搭建中…</p>
      <p className="lab-placeholder__hint">
        光圈 · 快门 · ISO · 实时预览 · 直方图
      </p>
    </div>
  );
}
