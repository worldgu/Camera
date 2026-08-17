import { useEffect, useRef } from 'react';

/**
 * 相机模型实验 — 骨架组件
 * TODO: 接入 Three.js 程序化建模 A7C2
 * - 360° 旋转查看（OrbitControls）
 * - 7 个视角快捷切换
 * - 13 个可点击部件 + 说明浮层
 * - 跳转关联教程
 */
export default function CameraModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 预留：Three.js 初始化代码将放在这里
    // 等安装 three 依赖后接入
    console.log('[Lab] CameraModel mount - placeholder');
  }, []);

  return (
    <div ref={containerRef} className="lab-placeholder">
      <div className="lab-placeholder__icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M10 14h8l3-4h14l3 4h10v24H4V14h6z" />
          <circle cx="24" cy="26" r="8" />
          <circle cx="24" cy="26" r="4" />
          <circle cx="38" cy="18" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <h3>相机模型</h3>
      <p>正在搭建中…</p>
      <p className="lab-placeholder__hint">
        360° 旋转 · 7 个视角 · 13 个可交互部件
      </p>
    </div>
  );
}
