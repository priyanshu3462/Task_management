export const apiRequest = async (endpoint, method = "GET", data = null) => {
    console.log("API request:", { endpoint, method, data });
  try {
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });

    const result = await res.json();
    console.log("API response:", result);
    return { ok: res.ok, data: result };
  } catch (error) {
    console.error("API error:", error);
    return { ok: false, data: { error: "Network error" } };
  }
};