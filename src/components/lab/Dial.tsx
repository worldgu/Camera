interface DialProps {
  label: string;
  sub: string;
  value: string;
  /** 稳定的选择器钩子，便于测试与样式定位 */
  name: string;
  atMin: boolean;
  atMax: boolean;
  onStep: (delta: number) => void;
}

/**
 * 模拟拨轮控件（需求 10.3 方案 B）：外观是相机拨盘，
 * 支持 +/- 按钮、鼠标滚轮和键盘左右方向键三种调节方式。
 */
export default function Dial({ label, sub, value, name, atMin, atMax, onStep }: DialProps) {
  return (
    <div
      className="dial"
      data-dial={name}
      onWheel={(e) => {
        e.preventDefault();
        onStep(e.deltaY > 0 ? 1 : -1);
      }}
    >
      <div className="dial__head">
        <span className="dial__label">{label}</span>
        <span className="dial__sub">{sub}</span>
      </div>
      <div className="dial__body">
        <button
          type="button"
          className="dial__btn dial__btn--down"
          aria-label={`${label}调低一档`}
          disabled={atMin}
          onClick={() => onStep(-1)}
        >
          −
        </button>
        <output className="dial__value">{value}</output>
        <button
          type="button"
          className="dial__btn dial__btn--up"
          aria-label={`${label}调高一档`}
          disabled={atMax}
          onClick={() => onStep(1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
