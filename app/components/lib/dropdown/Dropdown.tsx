import { useEffect, useRef, useState } from "react";
import "./Dropdown.css";

const Dropdown = ({
  value,
  options,
  onChange,
}: {
  value: any;
  options: any[];
  onChange: (selection: any) => void;
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative dropdown-container w-[12em]">
      <div
        className="w-[100%] bg-black h-[2em] flex items-center justify-center gap-x-[0.5em] p-[1em] cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[0.8rem] opacity-[0.75]">Layer:</span>
        <span className="flex items-center justify-start flex-1">
          {value.title}
        </span>
        <img
          src="/chevron-down.svg"
          alt="down icon"
          className="opacity-[0.75]"
        />
      </div>
      {open && (
        <div className="absolute mt-[0.1em] top-[100%] z-[10] bg-black w-[100%] p-[0.25em]">
          {options.map((item, index) => (
            <div
              className="dropdown-option flex justify-between items-center"
              key={index}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
            >
              <span>{item.title}</span>
              {item.title === value.title && (
                <img src="./check.svg" alt="check icon" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
