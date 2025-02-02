"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Dropdown from "../lib/dropdown/Dropdown";
import "./Canvas.css";
import { Tool, Stroke, Action, Layer } from "./Canvas.d";
import ColorPicker from "./ColorPicker";
import Button from "../lib/button/Button";

const LAYERS = [
  { title: "Box", index: 0 },
  { title: "Text", index: 1 },
  { title: "Button", index: 2 },
];

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLayer, setCurrentLayer] = useState({ title: "Box", index: 0 });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [tool, setTool] = useState<Tool>("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [selectedStroke, setSelectedStroke] = useState<Stroke | null>(null);
  const [movingStroke, setMovingStroke] = useState(false);
  const lastPosition = useRef<[number, number] | null>(null);
  const [undoStack, setUndoStack] = useState<Action[]>([]);
  const [redoStack, setRedoStack] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      setLoading(true);
      const initLayers = Array.from({ length: 5 }, () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasRef.current!.width;
        canvas.height = canvasRef.current!.height;
        const ctx = canvas.getContext("2d")!;
        return { canvas, ctx };
      });

      const parent = canvasRef.current.parentElement;
      if (parent) {
        canvasRef.current.width = parent.offsetWidth;
        canvasRef.current.height = parent.offsetHeight;
      }

      setLayers(initLayers);
      setLoading(false);
    }
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      if (!lastPosition.current) {
        lastPosition.current = [x, y];
        return;
      }

      ctx.beginPath();
      ctx.moveTo(lastPosition.current[0], lastPosition.current[1]);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();

      lastPosition.current = [x, y];
    },
    [color, lineWidth]
  );

  const erase = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.clearRect(x - lineWidth / 2, y - lineWidth / 2, lineWidth, lineWidth);
    },
    [lineWidth]
  );

  const bucketFill = useCallback(
    (ctx: CanvasRenderingContext2D, startX: number, startY: number) => {
      const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      const targetColor = getPixel(imageData, startX, startY);
      const fillColor = hexToRgb(color);

      if (colorsMatch(targetColor, fillColor)) return;

      const pixelsToCheck = [[startX, startY]];
      while (pixelsToCheck.length > 0) {
        const [x, y] = pixelsToCheck.pop()!;
        const currentColor = getPixel(imageData, x, y);

        if (colorsMatch(currentColor, targetColor)) {
          setPixel(imageData, x, y, fillColor);

          if (x > 0) pixelsToCheck.push([x - 1, y]);
          if (y > 0) pixelsToCheck.push([x, y - 1]);
          if (x < ctx.canvas.width - 1) pixelsToCheck.push([x + 1, y]);
          if (y < ctx.canvas.height - 1) pixelsToCheck.push([x, y + 1]);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    },
    [color]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    setIsDrawing(true);
    lastPosition.current = [x, y];

    if (tool === "select") {
      const clickedStroke = strokes.find((stroke) => {
        return stroke.path.some(
          ([sx, sy]) => Math.abs(sx - x) < 5 && Math.abs(sy - y) < 5
        );
      });
      setSelectedStroke(clickedStroke || null);
      if (clickedStroke) setMovingStroke(true);
    } else {
      const layerCtx = layers[currentLayer.index].ctx;
      const mainCtx = canvasRef.current!.getContext("2d")!;
      const layerImageData = layerCtx.getImageData(
        0,
        0,
        layerCtx.canvas.width,
        layerCtx.canvas.height
      );

      setUndoStack((prev) => [
        ...prev,
        { type: tool, layerIndex: currentLayer.index, data: layerImageData },
      ]);
      setRedoStack([]);

      if (tool === "draw") {
        setStrokes((prev) => [
          ...prev,
          {
            path: [[x, y]],
            color,
            width: lineWidth,
            layerIndex: currentLayer.index,
          },
        ]);
      } else if (tool === "bucket") {
        bucketFill(layerCtx, x, y);
        bucketFill(mainCtx, x, y);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (tool === "draw") {
      draw(layers[currentLayer.index].ctx, x, y);
      draw(canvasRef.current!.getContext("2d")!, x, y);
      setStrokes((prev) => {
        const newStrokes = [...prev];
        newStrokes[newStrokes.length - 1].path.push([x, y]);
        return newStrokes;
      });
    } else if (tool === "erase") {
      erase(layers[currentLayer.index].ctx, x, y);
      erase(canvasRef.current!.getContext("2d")!, x, y);
    } else if (tool === "select" && selectedStroke && movingStroke) {
      const dx = x - lastPosition.current![0];
      const dy = y - lastPosition.current![1];
      setStrokes((prev) =>
        prev.map((stroke) =>
          stroke === selectedStroke
            ? {
                ...stroke,
                path: stroke.path.map(([px, py]) => [px + dx, py + dy]),
              }
            : stroke
        )
      );
      lastPosition.current = [x, y];
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPosition.current = null;
    setMovingStroke(false);
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
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const lastAction = redoStack[redoStack.length - 1];
    const { layerIndex, data } = lastAction;

    const currentData = layers[layerIndex].ctx.getImageData(
      0,
      0,
      layers[layerIndex].canvas.width,
      layers[layerIndex].canvas.height
    );
    setUndoStack((prev) => [...prev, { ...lastAction, data: currentData }]);

    layers[layerIndex].ctx.putImageData(data, 0, 0);
    setRedoStack((prev) => prev.slice(0, -1));

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
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const mainCtx = canvasRef.current.getContext("2d")!;
    mainCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    layers.forEach((layer, i) => {
      layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    });

    strokes.forEach((stroke) => {
      const ctx = layers[stroke.layerIndex].ctx;
      ctx.beginPath();
      ctx.moveTo(stroke.path[0][0], stroke.path[0][1]);
      stroke.path.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.stroke();

      mainCtx.beginPath();
      mainCtx.moveTo(stroke.path[0][0], stroke.path[0][1]);
      stroke.path.forEach(([x, y]) => mainCtx.lineTo(x, y));
      mainCtx.strokeStyle = stroke.color;
      mainCtx.lineWidth = stroke.width;
      mainCtx.lineCap = "round";
      mainCtx.stroke();
    });
  }, [layers, strokes]);

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

  const onSetLayer = (selection: any) => {
    setCurrentLayer(selection);
  };

  return (
    <div className="select-none flex-1 h-[100%] flex items-center justify-center">
      <div className="canvas w-[92%] h-[92%] rounded-[20px] bg-[#1E1D22] flex flex-col gap-y-[0.4em]">
        <div className="items-center gap-x-[1em] canvas-header bg-[var(--canvas-menu-bg)] flex px-[0.9em] rounded-t-[20px] py-[0.5em] w-[100%]">
          <Dropdown
            value={currentLayer}
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
        </div>
        <div className="bg-[var(--canvas-bg)] h-[100%] w-[100%] rounded-[10px] flex items-center justify-center relative overflow-hidden">
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
