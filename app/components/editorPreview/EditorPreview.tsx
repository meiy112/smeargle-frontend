"use client";

import { useState } from "react";

const EditorPreview = () => {
  const [page] = useState("editor");

  return (
    <div className="w-[49%] h-[100%]">
      <div></div>
    </div>
  );
};

export default EditorPreview;
