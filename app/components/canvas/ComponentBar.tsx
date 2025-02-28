import { Dispatch, SetStateAction } from "react";
import Button from "../lib/button/Button";

const BUTTONS = ["Preview", "Code", "Console"];

const ComponentBar = ({
  component,
  setComponent,
}: {
  component: string;
  setComponent: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="select-none topbar w-[100%] text-[0.85rem] gap-x-[0.65em] font-medium flex justify-start items-center">
      {BUTTONS.map((label, index) => (
        <Button
          child={
            <div className="flex gap-[0.5em] px-[0.5em] py-[0.2em]">
              <img src={`./${label}.svg`} alt={label} />
              {label}
            </div>
          }
          onClick={() => setComponent(label)}
          changeOpacity={true}
          selected={false}
          key={index}
          background="var(--hover-bg__solid)"
          outlined={false}
        />
      ))}
    </div>
  );
};

export default ComponentBar;
