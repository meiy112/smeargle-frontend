import { Dispatch, SetStateAction } from "react";
import Button from "../lib/button/Button";
import "./Topbar.css";

const BUTTONS = ["Preview", "Code", "Console"];

const Topbar = ({
  page,
  setPage,
}: {
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="topbar w-[100%] text-[0.9rem] p-[0.6em] font-medium flex gap-x-[0.5em] items-center">
      {BUTTONS.map((label, index) => (
        <Button
          child={
            <div className="flex gap-[0.35em] px-[0.5em] py-[0.2em]">
              <img src={`./${label}.svg`} alt={label} />
              {label}
            </div>
          }
          onClick={() => setPage(label)}
          changeOpacity={true}
          selected={page == label}
          key={index}
          background="var(--hover-bg__solid)"
          outlined={false}
        />
      ))}
    </div>
  );
};

export default Topbar;
