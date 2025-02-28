import { useLayers } from "@/app/context/LayersProvider";
import RenderComponent from "./RenderComponent";
import { useEffect } from "react";
import "./EditorPreview.css";

const Preview = () => {
  const { processedLayers } = useLayers();

  useEffect(() => {
    console.log("layers changed: ", processedLayers);
  }, [processedLayers]);

  return (
    <div className="h-[100%] w-[100%] overflow-hidden relative">
      {processedLayers.map((layer, index) => (
        <RenderComponent
          key={layer.id || `layer-${index}`}
          componentData={layer}
        />
      ))}
      <img
        src="./grid.svg"
        alt="grid"
        className="absolute z-[-1] preview-bg h-[100vh] object-cover left-0"
      />
    </div>
  );
};

export default Preview;
