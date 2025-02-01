import { useState } from "react";
import "./Dropdown.css";

const Dropdown = ({
  value,
  options,
  onChange,
}: {
  value: String;
  options: String[];
  onChange: (selection: String) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative dropdown-container w-[12em]">
      <div
        className="w-[100%] bg-black h-[2em] flex items-center justify-center gap-x-[0.5em] p-[1em] cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[0.8rem] opacity-[0.75]">Layer:</span>
        <span className="flex items-center justify-start flex-1">{value}</span>
        <img
          src="/chevron-down.svg"
          alt="down icon"
          className="opacity-[0.75]"
        />
      </div>
      {open && (
        <div className="absolute mt-[0.1em] top-[100%] z-[10] bg-black w-[100%] p-[0.25em]">
          {options.map((title, index) => (
            <div
              className="dropdown-option flex justify-between items-center"
              key={index}
              onClick={() => onChange(title)}
            >
              <span>{title}</span>
              {title === value && <img src="./check.svg" alt="check icon" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
