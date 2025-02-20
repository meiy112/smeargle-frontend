import { getPing } from "@/app/api/test";
import { useLayers } from "@/app/context/LayersProvider";
import { useEffect, useState } from "react";

const Preview = () => {
  const [preview, setPreview] = useState();

  const { processedLayers } = useLayers();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPing();
      setPreview(res);
    };
    fetchData();
  }, []);

  console.log(processedLayers);

  return (
    <div className="h-[100%] items-center justify-center flex">
      <div>{preview}</div>
    </div>
  );
};

export default Preview;
