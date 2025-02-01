"use client";
import { useState } from "react";
import Dropdown from "../lib/dropdown/Dropdown";
import "./Canvas.css";

const LAYERS = ["Box", "Text", "Button"];

const Canvas = () => {
  const [layer, setLayer] = useState<String>("Box");

  const onSetLayer = (selection: String) => {
    setLayer(selection);
  };

  return (
    <div className="select-none flex-1 h-[100%] flex items-center justify-center">
      <div className="canvas w-[92%] h-[92%] rounded-[20px] bg-[#1E1D22] flex flex-col gap-y-[0.4em]">
        <div className="canvas-header bg-[var(--canvas-menu-bg)] flex px-[0.9em] rounded-t-[20px] py-[0.5em] w-[100%]">
          <Dropdown value={layer} options={LAYERS} onChange={onSetLayer} />
        </div>
        <div className="bg-[var(--canvas-bg)] h-[100%] w-[100%] rounded-[10px]"></div>
      </div>
    </div>
  );
};

export default Canvas;
