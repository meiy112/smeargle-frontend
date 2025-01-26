"use client";
import "./Button.css";

const Button = ({
  icon,
  onClick,
  outlined,
}: {
  icon: string;
  onClick: () => void;
  outlined?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`button ${outlined && "button--outlined"}`}
    >
      <img src={icon} alt={icon} />
    </button>
  );
};

export default Button;
