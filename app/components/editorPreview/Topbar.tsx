import { Dispatch, SetStateAction } from "react";
import Button from "../lib/button/Button";

const BUTTONS = ["Preview", "Code", "Presets", "Console"];

const Topbar = ({
  page,
  setPage,
}: {
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
}) => {
  const onCopyClick = () => {
    console.log("copy button clicked");
  };

  return (
    <div className="select-none topbar w-[100%] text-[0.85rem] font-medium flex justify-between items-center">
      <div className="flex gap-x-[0.65em] items-center">
        <Button
          child={
            <div className="flex px-[0.2em] py-[0.2em]">
              <img src="chevrons-left.svg" alt="full" />
            </div>
          }
          onClick={() => console.log("full screen clicked")}
          changeOpacity={true}
          key={"full"}
          background="var(--hover-bg__solid)"
          outlined={false}
        />
        {BUTTONS.map((label, index) => (
          <Button
            child={
              <div className="flex gap-[0.5em] px-[0.5em] py-[0.2em]">
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
      <div className="flex gap-x-[0.7em] items-center">
        <Button
          child={
            <div className="icon">
              <img src="./copy.svg" alt="copy button" />
            </div>
          }
          onClick={onCopyClick}
        />
        <button className="text-black flex items-center justify-center gap-[0.5em] pl-[0.7em] pr-[0.9em] py-[0.3em] bg-white rounded-[6px]">
          <img src="./download.svg" alt="download icon" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
