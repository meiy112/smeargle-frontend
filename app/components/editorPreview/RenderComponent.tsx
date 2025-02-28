import React, { CSSProperties } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RenderComponentProps } from "./utils.d";
import { ComponentData } from "@/app/class/ComponentData";

const RenderComponent: React.FC<RenderComponentProps> = ({ componentData }) => {
  const {
    title,
    x,
    y,
    width,
    height,
    children,
    word,
    fontSize,
    fontColor,
    fontWeight,
    borderWidth,
    borderColor,
    backgroundColor,
  } = componentData;

  console.log(backgroundColor);

  const positionStyle: CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
  };

  const rectangleStyle: CSSProperties = {
    ...positionStyle,
    ...(backgroundColor ? { backgroundColor: backgroundColor } : {}),
    ...(borderWidth && borderColor
      ? { border: `${borderWidth}px solid ${borderColor}` }
      : {}),
  };

  const textStyle: CSSProperties = {
    ...positionStyle,
    ...(fontColor ? { color: fontColor } : {}),
    ...(fontSize ? { fontSize: fontSize } : {}),
    ...(fontWeight ? { fontWeight: fontWeight } : {}),
  };

  switch (title) {
    case "Box":
      return (
        <Card style={rectangleStyle}>
          <CardContent>
            {children &&
              children.map((child: ComponentData) => (
                <RenderComponent
                  key={child.id}
                  componentData={child}
                  parentX={x}
                  parentY={y}
                />
              ))}
          </CardContent>
        </Card>
      );
    case "Button":
      return (
        <Button style={{ ...rectangleStyle, ...textStyle }}>
          {word || title}
        </Button>
      );
    case "Text":
      return <div style={textStyle}>{word || title}</div>;
    default:
      return null;
  }
};

export default RenderComponent;
