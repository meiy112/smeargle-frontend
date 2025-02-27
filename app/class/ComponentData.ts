export interface ComponentData {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children?: ComponentData[];

  // Text-specific properties
  word?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: number;

  // Rectangle-specific properties
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
}
