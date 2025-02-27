import { ComponentData } from "../class/ComponentData";

async function processLayers(layers: Layer[]): Promise<ComponentData[] | null> {
  const processData = layers.map((layer) => ({
    title: layer.title,
    canvas: layer.canvas.toDataURL("image/png").split(",")[1],
  }));

  try {
    const response = await fetch("http://localhost:8080/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layers: processData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}. Response: ${errorText}`
      );
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonParseError) {
      throw new Error(`Failed to parse JSON. Full response: ${responseText}`);
    }

    const processed: ComponentData[] = data.results.map((result: any) => {
      return result as ComponentData;
    });

    return processed;
  } catch (error) {
    console.error("Error processing layers:", error);
    return null;
  }
}

export default processLayers;
