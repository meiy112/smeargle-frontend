import "./Slider.css";

const Slider = ({
  value,
  min,
  max,
  handleChange,
  width,
}: {
  value: number;
  min: number;
  max: number;
  handleChange: (value: number) => void;
  width?: string;
}) => {
  return (
    <div className={`slider`} style={{ width: width }}>
      <div className={`slider__track`}>
        <div
          className={`slider__fill`}
          style={{
            width: `${(((value ?? 0) - min) / (max - min)) * 100}%`,
          }}
        ></div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={1}
        onChange={(event) => handleChange(Number(event.target.value))}
        className="slider__input"
        width="100%"
      />
    </div>
  );
};

export default Slider;
