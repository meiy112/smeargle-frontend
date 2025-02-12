"use client";
import "./Button.css";

const Button = ({
  icon,
  onClick,
  outlined,
  background,
  selected,
  changeOpacity,
  disabled,
}: {
  icon: string;
  onClick: () => void;
  outlined?: boolean;
  background?: string;
  selected?: boolean;
  changeOpacity?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`button ${outlined && "button--outlined"} ${
        disabled && "disabled"
      }`}
      style={{
        backgroundColor: selected ? background : undefined,
        border: selected
          ? `1px solid ${background}`
          : `1px solid rgba(0, 0, 0, 0)`,
        opacity: changeOpacity && !selected ? 0.5 : 1,
      }}
    >
      <img src={icon} alt={icon} />
    </button>
  );
};

export default Button;
