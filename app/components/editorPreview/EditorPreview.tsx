"use client";

import { useState } from "react";

const EditorPreview = () => {
  const [page] = useState("editor");

  return (
    <div className="w-[49%] h-[100%] bg-red-300">
      <div></div>
    </div>
  );
};

export default EditorPreview;
