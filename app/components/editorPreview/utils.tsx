import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RenderComponentProps } from "./utils.d";
import { ComponentData } from "@/app/class/ComponentData";

const RenderComponent: React.FC<RenderComponentProps> = ({ componentData }) => {
  const { title, x, y, width, height, children } = componentData;

  const positionClasses = `absolute left-[${x}px] top-[${y}px] w-[${width}px] h-[${height}px]`;

  switch (title) {
    case "Card":
      return (
        <Card className={positionClasses}>
          <CardHeader>{title}</CardHeader>
          <CardContent>
            {children &&
              children.map((child: ComponentData) => (
                <RenderComponent key={child.id} componentData={child} />
              ))}
          </CardContent>
        </Card>
      );
    case "Button":
      return <Button className={positionClasses}>{title}</Button>;
    default:
      return null;
  }
};

export default RenderComponent;
