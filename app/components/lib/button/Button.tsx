"use client";
import { ReactNode } from "react";
import "./Button.css";

const Button = ({
  child,
  onClick,
  outlined,
  background,
  selected,
  changeOpacity,
  disabled,
}: {
  child: ReactNode;
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
      }}
    >
      <div style={{ opacity: changeOpacity && !selected ? 0.6 : 1 }}>
        {child}
      </div>
    </button>
  );
};

export default Button;
