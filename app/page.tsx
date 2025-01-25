import Canvas from "./components/canvas/Canvas";
import EditorPreview from "./components/editorPreview/EditorPreview";
import Sidebar from "./components/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex h-[100%] w-[100%] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-1">
        <Sidebar />
        <Canvas />
        <EditorPreview />
      </main>
    </div>
  );
}
