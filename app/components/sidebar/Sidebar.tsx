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
    <div className="select-none relative h-[100%] side-bar">
      <img src="./logo.svg" alt="Logo" />
      <div className="side-bar__buttons">
        <Button
          child={
            <div className="icon">
              <img src="./plus.svg" alt="plus" />
            </div>
          }
          onClick={onAddButtonClick}
          outlined={true}
        />
        <Button
          child={
            <div className="icon">
              <img src="./book.svg" alt="book" />
            </div>
          }
          onClick={onLibraryButtonClick}
        />
        <Button
          child={
            <div className="icon">
              <img src="./info.svg" alt="unfo" />
            </div>
          }
          onClick={onInfoButtonClick}
        />
      </div>
    </div>
  );
};

export default Sidebar;
