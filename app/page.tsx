"use client";
import { useRef, useState } from "react";
import ResizableCanvasContainer from "./components/canvas/ResizableCanvasContainer";
import EditorPreview from "./components/editorPreview/EditorPreview";
import Sidebar from "./components/sidebar/Sidebar";
import { LayersProvider } from "./context/LayersProvider";

export default function Home() {
  return (
    <LayersProvider>
      <div className="flex h-[100%] w-[100%] font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-1 justify-between items-center">
          <Sidebar />
          <ResizableCanvasContainer />
          <EditorPreview />
        </main>
      </div>
    </LayersProvider>
  );
}
