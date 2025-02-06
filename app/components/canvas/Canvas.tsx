"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Dropdown from "../lib/dropdown/Dropdown";
import "./Canvas.css";
import ColorPicker from "./ColorPicker";
import Button from "../lib/button/Button";
import Slider from "../lib/slider/Slider";

const LAYERS = [
  { title: "Box", index: 0 },
  { title: "Text", index: 1 },
  { title: "Button", index: 2 },
];

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [tool, setTool] = useState<Tool>("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [actions, setActions] = useState<Action[]>([]);
  const lastPosition = useRef<[number, number] | null>(null);
  const [undoStack, setUndoStack] = useState<Action[]>([]);
  const [redoStack, setRedoStack] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      const initLayers = Array.from({ length: 5 }, () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasRef.current!.width;
        canvas.height = canvasRef.current!.height;
        const ctx = canvas.getContext("2d")!;
        return { canvas, ctx };
      });

      setLoading(false);
      setLayers(initLayers);
    }
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && parentRef.current) {
        canvasRef.current.width = parentRef.current.clientWidth;
        canvasRef.current.height = parentRef.current.clientHeight;
      }
    };

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    if (parentRef.current) {
      observer.observe(parentRef.current);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      isEraser: boolean
    ) => {
      if (!lastPosition.current) {
        lastPosition.current = [x, y];
        return;
      }

      ctx.beginPath();
      ctx.moveTo(lastPosition.current[0], lastPosition.current[1]);
      ctx.lineTo(x, y);
      ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.globalCompositeOperation = isEraser
        ? "destination-out"
        : "source-over";
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";

      lastPosition.current = [x, y];
    },
    [color, lineWidth]
  );

  const bucketFill = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      fillColor: string
    ) => {
      const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      const targetColor = getPixel(imageData, startX, startY);
      const fillColorRgb = hexToRgb(fillColor);

      if (colorsMatch(targetColor, fillColorRgb)) return;

      const pixelsToCheck = [[startX, startY]];
      const filledPixels: [number, number][] = [];

      while (pixelsToCheck.length > 0) {
        const [x, y] = pixelsToCheck.pop()!;
        const currentColor = getPixel(imageData, x, y);

        if (colorsMatch(currentColor, targetColor)) {
          setPixel(imageData, x, y, fillColorRgb);
          filledPixels.push([x, y]);

          if (x > 0) pixelsToCheck.push([x - 1, y]);
          if (y > 0) pixelsToCheck.push([x, y - 1]);
          if (x < ctx.canvas.width - 1) pixelsToCheck.push([x + 1, y]);
          if (y < ctx.canvas.height - 1) pixelsToCheck.push([x, y + 1]);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return filledPixels;
    },
    []
  );

  const getPixel = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4;
    return imageData.data.slice(index, index + 4);
  };

  const setPixel = (
    imageData: ImageData,
    x: number,
    y: number,
    color: number[]
  ) => {
    const index = (y * imageData.width + x) * 4;
    imageData.data.set(color, index);
  };

  const colorsMatch = (
    color1: Uint8ClampedArray | number[],
    color2: number[]
  ) => {
    return (
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3]
    );
  };

  const hexToRgb = (hex: string): number[] => {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    setIsDrawing(true);
    lastPosition.current = [x, y];

    const layerCtx = layers[currentLayer].ctx;
    const layerImageData = layerCtx.getImageData(
      0,
      0,
      layerCtx.canvas.width,
      layerCtx.canvas.height
    );

    if (tool === "draw" || tool === "erase") {
      const newStroke: Stroke = {
        path: [[x, y]],
        color: tool === "erase" ? "rgba(0,0,0,1)" : color,
        width: lineWidth,
        layerIndex: currentLayer,
        type: tool,
      };
      const newAction: Action = {
        type: tool,
        layerIndex: currentLayer,
        data: layerImageData,
        stroke: newStroke,
      };
      setActions((prev) => [...prev, newAction]);
      setUndoStack((prev) => [...prev, newAction]);
      setRedoStack([]);
    } else if (tool === "bucket") {
      bucketFill(layerCtx, x, y, color);
      const newAction: Action = {
        type: "bucket",
        layerIndex: currentLayer,
        data: layerImageData,
        bucketFillData: { x, y, color },
      };
      setActions((prev) => [...prev, newAction]);
      setUndoStack((prev) => [...prev, newAction]);
      setRedoStack([]);
    }

    updateMainCanvas();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (tool === "draw" || tool === "erase") {
      draw(layers[currentLayer].ctx, x, y, tool === "erase");
      setActions((prev) => {
        const newActions = [...prev];
        const currentAction = newActions[newActions.length - 1];
        if (
          currentAction &&
          currentAction.stroke &&
          currentAction.layerIndex === currentLayer
        ) {
          currentAction.stroke.path.push([x, y]);
        }
        return newActions;
      });
    }

    updateMainCanvas();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPosition.current = null;
    updateMainCanvas();
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const lastAction = undoStack[undoStack.length - 1];
    const { layerIndex, data } = lastAction;

    const currentData = layers[layerIndex].ctx.getImageData(
      0,
      0,
      layers[layerIndex].canvas.width,
      layers[layerIndex].canvas.height
    );
    setRedoStack((prev) => [...prev, { ...lastAction, data: currentData }]);

    layers[layerIndex].ctx.putImageData(data, 0, 0);
    setUndoStack((prev) => prev.slice(0, -1));
    setActions((prev) => prev.slice(0, -1));

    updateMainCanvas();
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const lastAction = redoStack[redoStack.length - 1];
    const { layerIndex, type, bucketFillData } = lastAction;

    const currentData = layers[layerIndex].ctx.getImageData(
      0,
      0,
      layers[layerIndex].canvas.width,
      layers[layerIndex].canvas.height
    );
    setUndoStack((prev) => [...prev, { ...lastAction, data: currentData }]);

    if (type === "bucket" && bucketFillData) {
      bucketFill(
        layers[layerIndex].ctx,
        bucketFillData.x,
        bucketFillData.y,
        bucketFillData.color
      );
    } else {
      layers[layerIndex].ctx.putImageData(lastAction.data, 0, 0);
    }

    setRedoStack((prev) => prev.slice(0, -1));
    setActions((prev) => [...prev, lastAction]);

    updateMainCanvas();
  };

  const updateMainCanvas = useCallback(() => {
    if (canvasRef.current) {
      const mainCtx = canvasRef.current.getContext("2d")!;
      mainCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      layers.forEach((layer) => {
        mainCtx.drawImage(layer.canvas, 0, 0);
      });
    }
  }, [layers]);

  useEffect(() => {
    layers.forEach((layer) => {
      layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    });

    actions.forEach((action) => {
      const ctx = layers[action.layerIndex].ctx;
      if (action.type === "draw" || action.type === "erase") {
        const stroke = action.stroke!;
        ctx.beginPath();
        ctx.moveTo(stroke.path[0][0], stroke.path[0][1]);
        stroke.path.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = "round";
        ctx.globalCompositeOperation =
          action.type === "erase" ? "destination-out" : "source-over";
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      } else if (action.type === "bucket" && action.bucketFillData) {
        bucketFill(
          ctx,
          action.bucketFillData.x,
          action.bucketFillData.y,
          action.bucketFillData.color
        );
      }
    });

    updateMainCanvas();
  }, [layers, actions, bucketFill, updateMainCanvas]);

  const onSetLayer = (selection: any) => {
    setCurrentLayer(selection.index);
  };

  return (
    <div className="select-none flex-1 h-[100%] flex items-center justify-center">
      <div className="canvas w-[92%] h-[92%] rounded-[20px] bg-[#1E1D22] flex flex-col gap-y-[0.4em]">
        <div className="items-center gap-x-[1em] canvas-header bg-[var(--canvas-menu-bg)] flex px-[0.9em] rounded-t-[20px] py-[0.5em] w-[100%]">
          <Dropdown
            value={LAYERS[currentLayer]}
            options={LAYERS}
            onChange={onSetLayer}
          />
          <Button
            icon="./pen.svg"
            onClick={() => setTool("draw")}
            selected={tool === "draw"}
            background={"var(--purple)"}
            changeOpacity={true}
          />
          <Button
            icon="./erasor.svg"
            onClick={() => setTool("erase")}
            selected={tool === "erase"}
            background={"var(--purple)"}
            changeOpacity={true}
          />
          <Button
            icon="./bucket.svg"
            onClick={() => setTool("bucket")}
            selected={tool === "bucket"}
            background={"var(--purple)"}
            changeOpacity={true}
          />
          <ColorPicker color={color} setColor={setColor} />
          <Slider
            value={lineWidth}
            max={10}
            min={1}
            handleChange={(value: number) => setLineWidth(value)}
            width="7em"
          />
        </div>
        <div
          ref={parentRef}
          className="bg-[var(--canvas-bg)] bg-red-300 h-[100%] w-[100%] rounded-[10px] flex items-center justify-center relative overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            width="100%"
            height="100%"
            className="border border-gray-300"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
          />
          {loading && (
            <div className="absolute text-black bg-white h-[100%] w-[100%] flex items-center justify-center">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
