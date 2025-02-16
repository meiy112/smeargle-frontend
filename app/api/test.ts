export async function getPing() {
  try {
    const res = await fetch("http://localhost:8080/ping");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.message;
  } catch (err) {
    console.error("Error fetching ping:", err);
    return err;
  }
}
