"use client";

import { useState } from "react";
import "./EditorPreview.css";
import Topbar from "./Topbar";
import Preview from "./Preview";

const EditorPreview = () => {
  const [page, setPage] = useState("Preview");

  return (
    <div className="w-[49%] h-[100%] box-border editor-preview">
      <Topbar page={page} setPage={setPage} />
      <Preview />
    </div>
  );
};

export default EditorPreview;
