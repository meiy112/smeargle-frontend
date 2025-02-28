"use client";
import Canvas from "./Canvas";
import { useResizable } from "react-resizable-layout";
import Splitter from "./Splitter";
import "./ResizableCanvasContainer";
import { useState } from "react";
import ComponentBar from "./ComponentBar";

const ResizableCanvasContainer = () => {
  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 700,
    min: 600,
    max: 850,
  });

  const [component, setComponent] = useState("");

  return (
    <div
      style={{ width: fileW }}
      className={`select-none h-[100%] flex flex-col items-center justify-center relative resizable-canvas-container`}
    >
      <ComponentBar component={component} setComponent={setComponent} />
      <div className="flex flex-1 w-[100%] items-center justify-center">
        <Canvas />
      </div>
      <Splitter isDragging={isFileDragging} {...fileDragBarProps} />
    </div>
  );
};

export default ResizableCanvasContainer;
