export type Tool = "draw" | "erase" | "select" | "bucket";

export type Layer = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export type Stroke = {
  path: [number, number][];
  color: string;
  width: number;
  layerIndex: number;
};

export type Action = {
  type: "draw" | "erase" | "bucket";
  layerIndex: number;
  data: ImageData;
};
