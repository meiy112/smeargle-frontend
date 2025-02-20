"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LAYERS } from "../components/canvas/utils";
import { ProcessedLayer } from "../class/ProcessedLayer";
import processLayers from "../api/processLayer";

interface LayersContextType {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  processedLayers: ProcessedLayer[];
}

const LayersContext = createContext<LayersContextType | undefined>(undefined);

export const LayersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [processedLayers, setProcessedLayers] = useState<ProcessedLayer[]>([]);
  const prevLayersRef = useRef<Layer[]>([]);

  useEffect(() => {
    const changedLayers = layers.filter((layer, i) => {
      const prevLayer = prevLayersRef.current[i];
      return (
        !prevLayer ||
        prevLayer.canvas !== layer.canvas ||
        prevLayer.title !== layer.title
      );
    });

    if (changedLayers.length > 0) {
      processLayers(changedLayers).then((result) => {
        if (result) {
          setProcessedLayers((prev) =>
            LAYERS.map((layerConst) => {
              const updated = result.find((r) => r.title === layerConst.title);
              if (updated) return updated;
              const existing = prev.find((p) => p.title === layerConst.title);
              return existing || { title: layerConst.title, data: [] };
            })
          );
        }
      });
    }

    prevLayersRef.current = layers;
  }, [layers]);

  return (
    <LayersContext.Provider value={{ layers, setLayers, processedLayers }}>
      {children}
    </LayersContext.Provider>
  );
};

export function useLayers() {
  const context = useContext(LayersContext);
  if (!context) {
    throw new Error("useLayers must be used within a LayersProvider");
  }
  return context;
}
