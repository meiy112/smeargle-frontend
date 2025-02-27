import Canvas from "./components/canvas/Canvas";
import EditorPreview from "./components/editorPreview/EditorPreview";
import Sidebar from "./components/sidebar/Sidebar";
import { LayersProvider } from "./context/LayersProvider";

export default function Home() {
  return (
    <LayersProvider>
      <div className="flex h-[100%] w-[100%] font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-1 justify-between items-center">
          <Sidebar />
          <Canvas />
          <EditorPreview />
          {/* <img
            src="./grid.svg"
            alt="grid"
            className="absolute z-[-1] h-[100%]"
          /> */}
        </main>
      </div>
    </LayersProvider>
  );
}
