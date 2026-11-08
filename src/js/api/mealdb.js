const BASE_URL = "https://nutriplan-api.vercel.app/api";

async function fetchJSON(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

// ---------- Meals Endpoints ----------

export function getAreas() {
  return fetchJSON("/meals/areas");
}

export function getCategories() {
  return fetchJSON("/meals/categories");
}

export function searchMeals(query) {
  return fetchJSON(`/meals/search?q=${encodeURIComponent(query)}`);
}

export function filterMeals({ category, area, ingredient, limit = 25 } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (area) params.set("area", area);
  if (ingredient) params.set("ingredient", ingredient);
  params.set("limit", limit);
  return fetchJSON(`/meals/filter?${params}`);
}

export function getRandomMeals(count = 25) {
  return fetchJSON(`/meals/random?count=${count}`);
}

// ---------- Products Endpoints (OpenFoodFacts) ----------

export function getProductCategories() {
  return fetchJSON("/products/categories");
}

export function getProductsByCategory(category) {
  return fetchJSON(`/products/category/${encodeURIComponent(category)}`);
}

export function searchProducts(query) {
  return fetchJSON(`/products/search?q=${encodeURIComponent(query)}`);
}

export function getProductByBarcode(code) {
  return fetchJSON(`/products/barcode/${code}`);
}
const API_KEY = "bPQbQnKnw8pgwqP78MQTTfc9PmPh7QtfCFhp9Qww"; 

export async function analyzeNutrition(recipeName, ingredients) {
  const response = await fetch(`${BASE_URL}/nutrition/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ recipeName, ingredients }),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}