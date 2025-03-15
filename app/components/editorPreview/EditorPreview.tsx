"use client";

import { useState } from "react";
import "./EditorPreview.css";
import Topbar from "./Topbar";
import Preview from "./Preview";

const EditorPreview = () => {
  const [page, setPage] = useState("Preview");

  return (
    <div className="grow overflow-hidden h-[100%] flex-1 flex-col box-border editor-preview">
      <Topbar page={page} setPage={setPage} />
      <Preview />
    </div>
  );
};

export default EditorPreview;
