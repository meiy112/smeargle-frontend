export interface ComponentData {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children?: ComponentData[];
}
