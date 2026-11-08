import {
  getAreas,
  getCategories,
  filterMeals,
  getRandomMeals,
  searchMeals,
  getProductCategories,
  searchProducts,
  getProductsByCategory,
  getProductByBarcode,
  analyzeNutrition,
} from "./api/mealdb.js";
import {
  renderAreas,
  renderCategories,
  renderRecipes,
  renderProducts,
  renderProductCategories,
  renderMealDetails,
  renderNutritionFacts,
  renderFoodLog,
  getGrade,
} from "./ui/components.js";
import {
  dateKey,
  addLogItem,
  removeLogItem,
  clearToday,
  getItemsForDate,
  getWeek,
} from "./state/appstate.js";

const areasList = document.getElementById("areas-list");
const categoriesGrid = document.getElementById("categories-grid");
const recipesGrid = document.getElementById("recipes-grid");
const recipesCount = document.getElementById("recipes-count");
const loadingOverlay = document.getElementById("app-loading-overlay");
const searchInput = document.getElementById("search-input");
const mealDetails = document.getElementById("meal-details");

const productSearchInput = document.getElementById("product-search-input");
const barcodeInput = document.getElementById("barcode-input");
const searchProductBtn = document.getElementById("search-product-btn");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
const productsGrid = document.getElementById("products-grid");
const productsCount = document.getElementById("products-count");
const productCategories = document.getElementById("product-categories");
const gradeButtons = document.querySelectorAll(".nutri-score-filter");
const foodlogSection = document.getElementById("foodlog-section");

// ---------- Helpers ----------
function notify(title, icon = "success") {
  if (window.Swal) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  } else {
    alert(title);
  }
}

// ---------- Food Log ----------
function refreshFoodLog() {
  renderFoodLog(getItemsForDate(dateKey()), getWeek());
}

async function clearTodayLog() {
  if (window.Swal) {
    const result = await Swal.fire({
      title: "Clear today's log?",
      text: "This removes all items logged today.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Clear all",
    });
    if (!result.isConfirmed) return;
  }
  clearToday();
  refreshFoodLog();
}

async function addCustomEntry() {
  if (!window.Swal) return;
  const { value } = await Swal.fire({
    title: "Custom Entry",
    html: `
      <input id="ce-name" class="swal2-input" placeholder="Food name" />
      <input id="ce-calories" type="number" min="0" class="swal2-input" placeholder="Calories (kcal)" />
      <input id="ce-protein" type="number" min="0" class="swal2-input" placeholder="Protein (g)" />
      <input id="ce-carbs" type="number" min="0" class="swal2-input" placeholder="Carbs (g)" />
      <input id="ce-fat" type="number" min="0" class="swal2-input" placeholder="Fat (g)" />`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add",
    preConfirm: () => {
      const name = document.getElementById("ce-name").value.trim();
      if (!name) {
        Swal.showValidationMessage("Please enter a name");
        return false;
      }
      const num = (id) => Number(document.getElementById(id).value) || 0;
      return {
        name,
        calories: num("ce-calories"),
        protein: num("ce-protein"),
        carbs: num("ce-carbs"),
        fat: num("ce-fat"),
      };
    },
  });
  if (!value) return;
  addLogItem({ type: "custom", ...value });
  refreshFoodLog();
  notify(`${value.name} added`);
}

foodlogSection.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".remove-log-item");
  if (removeBtn) {
    removeLogItem(removeBtn.dataset.logId);
    refreshFoodLog();
    return;
  }
  if (event.target.closest("#clear-foodlog")) {
    clearTodayLog();
    return;
  }
  const go = event.target.closest("[data-go]");
  if (go) {
    showPage(go.dataset.go);
    return;
  }
  const quick = event.target.closest(".quick-log-btn");
  if (quick) {
    const index = [...document.querySelectorAll(".quick-log-btn")].indexOf(quick);
    if (index === 0) showPage("meals");
    else if (index === 1) showPage("products");
    else addCustomEntry();
  }
});

// ---------- Navigation ----------
const navLinks = document.querySelectorAll(".nav-link");
const headerTitle = document.querySelector("#header h1");
const headerSubtitle = document.querySelector("#header p");

const allSectionIds = [
  "search-filters-section",
  "meal-categories-section",
  "all-recipes-section",
  "meal-details",
  "products-section",
  "foodlog-section",
];

const pages = {
  meals: {
    sections: [
      "search-filters-section",
      "meal-categories-section",
      "all-recipes-section",
    ],
    title: "Meals & Recipes",
    subtitle: "Discover delicious and nutritious recipes tailored for you",
  },
  products: {
    sections: ["products-section"],
    title: "Product Scanner",
    subtitle: "Search packaged foods by name or barcode",
  },
  foodlog: {
    sections: ["foodlog-section"],
    title: "Food Log",
    subtitle: "Track your daily nutrition and food intake",
  },
};

const pageNames = ["meals", "products", "foodlog"];

function showPage(name) {
  allSectionIds.forEach((id) => {
    document.getElementById(id).style.display = "none";
  });
  pages[name].sections.forEach((id) => {
    document.getElementById(id).style.display = "block";
  });

  headerTitle.textContent = pages[name].title;
  headerSubtitle.textContent = pages[name].subtitle;

  navLinks.forEach((link, index) => {
    const isActive = pageNames[index] === name;
    const label = link.querySelector("span");
    link.classList.toggle("bg-emerald-50", isActive);
    link.classList.toggle("text-emerald-700", isActive);
    link.classList.toggle("text-gray-600", !isActive);
    label.classList.toggle("font-semibold", isActive);
    label.classList.toggle("font-medium", !isActive);
  });

  if (name === "foodlog") refreshFoodLog();
  window.scrollTo(0, 0);
}

navLinks.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(pageNames[index]);
  });
});

// ---------- Recipes ----------
const mealsById = new Map();

function showRecipes(meals) {
  mealsById.clear();
  meals.forEach((meal) => mealsById.set(String(meal.id), meal));
  renderRecipes(meals, recipesGrid, recipesCount);
}

function showNoRecipes() {
  recipesGrid.innerHTML = `<p class="col-span-4 text-center text-gray-500 py-10">No recipes found</p>`;
  recipesCount.textContent = "Showing 0 recipes";
}

async function loadRecipes(filters = {}) {
  try {
    const hasFilter = filters.category || filters.area;
    const data = hasFilter
      ? await filterMeals(filters)
      : await getRandomMeals(25);
    showRecipes(data.results);
  } catch (error) {
    console.error(error);
    showNoRecipes();
  }
}

categoriesGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".category-card");
  if (!card) return;
  loadRecipes({ category: card.dataset.category });
});

areasList.addEventListener("click", (event) => {
  const button = event.target.closest(".area-btn");
  if (!button) return;
  loadRecipes(button.dataset.area ? { area: button.dataset.area } : {});
});

let searchTimer;

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    const query = searchInput.value.trim();
    if (!query) {
      loadRecipes();
      return;
    }
    try {
      const data = await searchMeals(query);
      showRecipes(data.results);
    } catch (error) {
      console.error(error);
      showNoRecipes();
    }
  }, 400);
});

// ---------- Meal details ----------
let currentMeal = null;
let currentNutrition = null;

async function openMeal(id) {
  const meal = mealsById.get(String(id));
  if (!meal) return;

  currentMeal = meal;
  currentNutrition = null;

  pages.meals.sections.forEach((sectionId) => {
    document.getElementById(sectionId).style.display = "none";
  });
  mealDetails.style.display = "block";
  renderMealDetails(meal, mealDetails);
  window.scrollTo(0, 0);

  try {
    const ingredients = (meal.ingredients ?? []).map((i) =>
      `${i.measure} ${i.ingredient}`.trim()
    );
    const result = await analyzeNutrition(meal.name, ingredients);
    currentNutrition = result.data;
    const box = document.getElementById("nutrition-facts-container");
    if (box) renderNutritionFacts(result.data, box);
  } catch (error) {
    console.error(error);
    const box = document.getElementById("nutrition-facts-container");
    if (box) {
      box.innerHTML = `<p class="text-sm text-gray-500">Nutrition data unavailable</p>`;
    }
  }
}

function logCurrentMeal() {
  if (!currentMeal) return;
  const n = currentNutrition?.perServing ?? currentNutrition?.totals;
  if (!n) {
    notify("Nutrition data isn't ready yet", "warning");
    return;
  }
  addLogItem({
    type: "meal",
    name: currentMeal.name,
    thumbnail: currentMeal.thumbnail,
    calories: n.calories,
    protein: n.protein,
    carbs: n.carbs,
    fat: n.fat,
  });
  refreshFoodLog();
  notify(`${currentMeal.name} logged`);
}

recipesGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".recipe-card");
  if (!card) return;
  openMeal(card.dataset.mealId);
});

mealDetails.addEventListener("click", (event) => {
  if (event.target.closest("#back-to-meals-btn")) {
    showPage("meals");
    return;
  }
  if (event.target.closest("#log-meal-btn")) {
    logCurrentMeal();
  }
});

// ---------- Products ----------
let currentProducts = [];
let activeGrade = "";

function extractProducts(data) {
  const raw = data.results ?? data.result ?? data.product ?? data;
  if (Array.isArray(raw)) return raw;
  return raw && raw.name ? [raw] : [];
}

function renderCurrentProducts() {
  const visible = activeGrade
    ? currentProducts.filter((p) => getGrade(p) === activeGrade)
    : currentProducts;
  renderProducts(visible, productsGrid, productsCount);
}

async function loadProducts(request) {
  productsGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Loading products...</p>`;
  productsCount.textContent = "Loading...";
  try {
    currentProducts = extractProducts(await request());
  } catch (error) {
    console.error(error);
    currentProducts = [];
  }
  renderCurrentProducts();
}

function runProductSearch() {
  const query = productSearchInput.value.trim();
  if (query) loadProducts(() => searchProducts(query));
}

function runBarcodeLookup() {
  const code = barcodeInput.value.trim();
  if (code) loadProducts(() => getProductByBarcode(code));
}

searchProductBtn.addEventListener("click", runProductSearch);
productSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runProductSearch();
});

lookupBarcodeBtn.addEventListener("click", runBarcodeLookup);
barcodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runBarcodeLookup();
});

productCategories.addEventListener("click", (event) => {
  const button = event.target.closest(".product-category-btn");
  if (!button) return;
  const category = button.dataset.category || button.textContent.trim();
  loadProducts(() => getProductsByCategory(category));
});

gradeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeGrade = button.dataset.grade;
    gradeButtons.forEach((b) => {
      const isActive = b === button;
      b.classList.toggle("ring-2", isActive);
      b.classList.toggle("ring-emerald-500", isActive);
    });
    renderCurrentProducts();
  });
});

productsGrid.addEventListener("click", async (event) => {
  const card = event.target.closest(".product-card");
  if (!card) return;
  const product = currentProducts.find(
    (p) => String(p.barcode) === card.dataset.barcode
  );
  if (!product) return;

  const n = product.nutrients ?? product.nutriments ?? {};

  if (window.Swal) {
    const result = await Swal.fire({
      title: "Add to Food Log?",
      text: `${product.name} (${Math.round(Number(n.calories) || 0)} kcal per 100g)`,
      showCancelButton: true,
      confirmButtonText: "Log it",
    });
    if (!result.isConfirmed) return;
  }

  addLogItem({
    type: "product",
    name: product.name,
    thumbnail: product.image,
    calories: n.calories,
    protein: n.protein,
    carbs: n.carbs,
    fat: n.fat,
  });
  refreshFoodLog();
  notify(`${product.name} logged`);
});

async function loadProductCategories() {
  try {
    const data = await getProductCategories();
    const list = data.results ?? data;
    if (Array.isArray(list) && list.length) {
      renderProductCategories(list, productCategories);
    }
  } catch (error) {
    console.error(error);
  }
}

// ---------- Init ----------
async function init() {
  showPage("meals");
  renderProducts([], productsGrid, productsCount);
  productsCount.textContent = "Search for products to see results";
  refreshFoodLog();
  loadProductCategories();
  try {
    const areas = await getAreas();
    renderAreas(areas.results, areasList);

    const categories = await getCategories();
    renderCategories(categories.results.slice(0,12), categoriesGrid);

    await loadRecipes();
  } catch (error) {
    console.error(error);
  } finally {
    loadingOverlay.style.display = "none";
  }
}

init();