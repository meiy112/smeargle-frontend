import Canvas from "./components/canvas/Canvas";
import EditorPreview from "./components/editorPreview/EditorPreview";
import Sidebar from "./components/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="flex">
        <Sidebar />
        <Canvas />
        <EditorPreview />
      </main>
    </div>
  );
}
