import React, { CSSProperties } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RenderComponentProps } from "./RenderComponent.d";
import { ComponentData } from "@/app/class/ComponentData";

const RenderComponent: React.FC<RenderComponentProps> = ({ componentData }) => {
  const { title, x, y, width, height, children } = componentData;

  const positionStyle: CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
  switch (title) {
    case "Box":
      return (
        <Card style={positionStyle}>
          <CardContent>
            {children &&
              children.map((child: ComponentData) => (
                <RenderComponent key={child.id} componentData={child} />
              ))}
          </CardContent>
        </Card>
      );
    case "Button":
      return <Button style={positionStyle}>{title}</Button>;
    default:
      return null;
  }
};

export default RenderComponent;
