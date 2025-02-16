import { getPing } from "@/app/api/test";
import { useEffect, useState } from "react";

const Preview = () => {
  const [preview, setPreview] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPing();
      setPreview(res);
    };
    fetchData();
  }, []);

  return (
    <div className="h-[100%] items-center justify-center flex">
      <div>{preview}</div>
    </div>
  );
};

export default Preview;
