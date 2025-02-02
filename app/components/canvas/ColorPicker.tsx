import { Dispatch, SetStateAction } from "react";

const ColorPicker = ({
  color,
  setColor,
}: {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div
      className={`color-picker h-[2em] w-[2em] overflow-hidden bg-[${color}] items-center justify-center flex`}
    >
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="h-[3em] w-[10em]"
      />
    </div>
  );
};

export default ColorPicker;
