"use client";

import Button from "../lib/button/Button";
import "./Sidebar.css";

const Sidebar = () => {
  const onAddButtonClick = () => {
    console.log("add button clicked");
  };

  const onLibraryButtonClick = () => {
    console.log("library button clicked");
  };

  const onInfoButtonClick = () => {
    console.log("info button clicked");
  };

  return (
    <div className="relative h-[100%] side-bar">
      <img src="./logo.svg" alt="Logo" />
      <div className="side-bar__buttons">
        <Button icon="./plus.svg" onClick={onAddButtonClick} outlined={true} />
        <Button icon="./book.svg" onClick={onLibraryButtonClick} />
        <Button icon="./info.svg" onClick={onInfoButtonClick} />
      </div>
    </div>
  );
};

export default Sidebar;
