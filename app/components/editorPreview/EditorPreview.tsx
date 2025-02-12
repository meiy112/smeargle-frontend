"use client";

import { useState } from "react";
import "./EditorPreview.css";
import Topbar from "./Topbar";

const EditorPreview = () => {
  const [page, setPage] = useState("editor");

  return (
    <div className="w-[49%] h-[100%] editor-preview">
      <Topbar page={page} setPage={setPage} />
      <div></div>
    </div>
  );
};

export default EditorPreview;
