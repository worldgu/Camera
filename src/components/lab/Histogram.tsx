interface HistogramProps {
  bins: number[];
}

/** 实时亮度直方图（需求 10.3 MVP 必做）。用 SVG 画，随主题变色 */
export default function Histogram({ bins }: HistogramProps) {
  const peak = Math.max(1, ...bins);
  // 256 根柱子太密，归并成 64 组更耐看
  const groups: number[] = [];
  for (let i = 0; i < 64; i += 1) {
    let sum = 0;
    for (let j = 0; j < 4; j += 1) sum += bins[i * 4 + j] ?? 0;
    groups.push(sum / 4);
  }

  return (
    <div className="histogram">
      <div className="histogram__head">
        <span>直方图</span>
        <span className="histogram__axis">暗 → 亮</span>
      </div>
      <svg
        className="histogram__chart"
        viewBox="0 0 64 24"
        preserveAspectRatio="none"
        role="img"
        aria-label="画面亮度分布直方图"
      >
        {groups.map((v, i) => {
          const barH = (v / peak) * 24;
          return (
            <rect
              key={i}
              x={i + 0.15}
              y={24 - barH}
              width={0.7}
              height={barH}
              className="histogram__bar"
            />
          );
        })}
      </svg>
    </div>
  );
}
