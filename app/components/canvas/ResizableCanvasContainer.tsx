"use client";
import { useState, useRef } from "react";
import Canvas from "./Canvas";
import ComponentBar from "./ComponentBar";
import "./ResizableCanvasContainer.css";

const ResizableCanvasContainer = () => {
  const [width, setWidth] = useState(700);
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: { preventDefault: () => void; clientX: any }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";

    const onMouseMove = (e: { clientX: number }) => {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: `${width}px` }}
      className="select-none h-full flex flex-col items-center justify-center relative"
    >
      <ComponentBar setComponent={() => {}} component={""} />
      <div className="flex flex-1 w-full items-center justify-center h-full py-[1.2em] px-[1.4em]">
        <Canvas />
      </div>
      <div className="resizable-canvas-divider" onMouseDown={handleMouseDown}>
        <div
          className={`resizable-canvas-divider__line ${
            isResizing && "resizable-canvas-divider__line--dragging"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ResizableCanvasContainer;
