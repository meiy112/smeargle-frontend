export async function getPing() {
  try {
    const res = await fetch("http://localhost:8080/ping");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.message;
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    } else {
      return String(err);
    }
  }
}
