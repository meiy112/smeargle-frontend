const Canvas = () => {
  return (
    <div className="flex-1 h-[100%] flex items-center justify-center">
      <div className="w-[91%] h-[92%] rounded-[var(--border-radius-large)] bg-[#1E1D22] overflow-hidden flex flex-col gap-y-[0.5em]">
        <div className="bg-[var(--canvas-menu-bg)] h-[3em] w-[100%]"></div>
        <div className="bg-[var(--canvas-bg)] h-[100%] w-[100%] rounded-[8px]"></div>
      </div>
    </div>
  );
};

export default Canvas;
