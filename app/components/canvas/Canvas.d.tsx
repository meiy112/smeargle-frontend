type Tool = "draw" | "erase" | "bucket";

type Layer = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  title: string;
};

type Stroke = {
  path: [number, number][];
  color: string;
  width: number;
  layerIndex: number;
  type: "draw" | "erase";
};
type Action = {
  type: "draw" | "erase" | "bucket";
  layerIndex: number;
  data: ImageData;
  stroke?: Stroke;
  bucketFillData?: {
    x: number;
    y: number;
    color: string;
  };
};
