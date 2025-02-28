import React, { useState } from "react";
import "./Splitter.css";

const cn = (...args: any[]) => args.filter(Boolean).join(" ");

const Splitter = ({ id = "drag-bar", dir, isDragging, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      id={id}
      data-testid={id}
      tabIndex={0}
      className={cn(
        "drag-bar",
        dir === "horizontal" && "drag-bar--horizontal",
        isDragging && "drag-bar--dragging"
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      <div className="drag-bar__indicator" />
    </div>
  );
};

export default Splitter;
