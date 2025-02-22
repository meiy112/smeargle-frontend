import { useLayers } from "@/app/context/LayersProvider";

const Preview = () => {
  const { processedLayers } = useLayers();

  console.log(processedLayers);

  return (
    <div className="h-[100%] items-center justify-center flex">
      <div>Preview goes here</div>
    </div>
  );
};

export default Preview;
