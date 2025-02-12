import { Dispatch, SetStateAction } from "react";

const Topbar = ({
  page,
  setPage,
}: {
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="w-[100%] bg-red-300">
      <div>{page}</div>
    </div>
  );
};

export default Topbar;
