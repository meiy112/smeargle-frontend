"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import processLayers from "../api/processLayer";
import { ComponentData } from "../class/ComponentData";

interface LayersContextType {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  processedLayers: ComponentData[];
  syncLayersWithBackend: () => void;
}

const LayersContext = createContext<LayersContextType | undefined>(undefined);

export const LayersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [processedLayers, setProcessedLayers] = useState<ComponentData[]>([]);
  const prevLayersRef = useRef<Layer[]>([]);

  const syncLayersWithBackend = () => {
    processLayers(layers).then((result) => {
      if (result) {
        setProcessedLayers(result);
      }
    });

    prevLayersRef.current = layers;
  };

  return (
    <LayersContext.Provider
      value={{ layers, setLayers, processedLayers, syncLayersWithBackend }}
    >
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
