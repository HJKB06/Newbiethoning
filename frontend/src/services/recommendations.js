const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    let detail = fallbackMessage;
    try {
      const body = await response.json();
      detail = body.detail ?? fallbackMessage;
    } catch {
      // Keep the user-friendly fallback when the response is not JSON.
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function fetchRecommendations(formData) {
  const createResponse = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ budget: Number(formData.budget), location: formData.location.trim(), commute: Number(formData.commute), job: formData.job, community: formData.community }),
  });
  const created = await parseResponse(createResponse, "We couldn’t save your preferences.");
  const recommendationResponse = await fetch(`${API_URL}/api/housing/${created.user.id}`);
  const recommendationData = await parseResponse(recommendationResponse, "We couldn’t load your neighborhood matches.");
  return recommendationData.matches ?? [];
}
