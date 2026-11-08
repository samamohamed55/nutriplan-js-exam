export function renderAreas(areas, container) {
  const allButton = `
    <button class="area-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all" data-area="">
      All Recipes
    </button>`;

  const areaButtons = areas
    .map(
      (area) => `
    <button class="area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all" data-area="${area.name}">
      ${area.name}
    </button>`
    )
    .join("");

  container.innerHTML = allButton + areaButtons;
}
const categoryStyles = {
  Beef: { icon: "fa-drumstick-bite", color: "red" },
  Chicken: { icon: "fa-drumstick-bite", color: "orange" },
  Dessert: { icon: "fa-cake-candles", color: "pink" },
  Lamb: { icon: "fa-drumstick-bite", color: "orange" },
  Miscellaneous: { icon: "fa-bowl-rice", color: "gray" },
  Pasta: { icon: "fa-bowl-food", color: "amber" },
  Pork: { icon: "fa-bacon", color: "red" },
  Seafood: { icon: "fa-fish", color: "blue" },
  Side: { icon: "fa-bowl-rice", color: "green" },
  Starter: { icon: "fa-utensils", color: "teal" },
  Vegan: { icon: "fa-leaf", color: "green" },
  Vegetarian: { icon: "fa-seedling", color: "green" },
};

export function renderCategories(categories, container) {
  container.innerHTML = categories
    .map((category) => {
      const style = categoryStyles[category.name] || {
        icon: "fa-utensils",
        color: "emerald",
      };
      const c = style.color;
      return `
      <div class="category-card bg-gradient-to-br from-${c}-50 to-${c}-100 rounded-xl p-3 border border-${c}-200 hover:border-${c}-400 hover:shadow-md cursor-pointer transition-all group" data-category="${category.name}">
        <div class="flex items-center gap-2.5">
          <div class="text-white w-9 h-9 bg-gradient-to-br from-${c}-400 to-${c}-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <i class="fa-solid ${style.icon}"></i>
          </div>
          <h3 class="text-sm font-bold text-gray-900">${category.name}</h3>
        </div>
      </div>`;
    })
    .join("");
}
export function renderRecipes(meals, container, countElement) {
  container.innerHTML = meals
    .map(
      (meal) => `
    <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${meal.id}">
      <div class="relative h-48 overflow-hidden">
        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.thumbnail}" alt="${meal.name}" loading="lazy" />
        <div class="absolute bottom-3 left-3 flex gap-2">
          <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.category}</span>
          <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.area}</span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.name}</h3>
        <p class="text-xs text-gray-600 mb-3 line-clamp-2">${meal.instructions?.[0] ?? ""}</p>
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${meal.category}</span>
          <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${meal.area}</span>
        </div>
      </div>
    </div>`
    )
    .join("");

  countElement.textContent = `Showing ${meals.length} recipes`;
}
const gradeColors = {
  a: "#038141",
  b: "#85bb2f",
  c: "#fecb02",
  d: "#ee8100",
  e: "#e63e11",
};
const novaColors = { 1: "#22c55e", 2: "#84cc16", 3: "#f97316", 4: "#ef4444" };

function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function fmt(value, unit = "g") {
  const n = Number(value);
  return Number.isFinite(n) ? `${Math.round(n * 10) / 10}${unit}` : "–";
}

export function getGrade(product) {
  return String(product.nutritionGrade ?? product.nutrition_grade ?? "")
    .toLowerCase()
    .trim();
}

export function renderProducts(products, container, countElement) {
  if (!products.length) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 text-gray-500">
        <i class="fa-solid fa-box-open text-5xl mb-4 text-gray-300"></i>
        <p class="font-semibold text-lg">No products to display</p>
        <p class="text-sm">Search for a product or browse by category</p>
      </div>`;
    countElement.textContent = "No products found";
    return;
  }

  container.innerHTML = products
    .map((p) => {
      const grade = getGrade(p);
      const nova = p.novaGroup ?? p.nova_group;
      const n = p.nutrients ?? p.nutriments ?? {};
      const gradeBadge = grade
        ? `<div class="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded uppercase" style="background:${gradeColors[grade] ?? "#6b7280"}">Nutri-Score ${grade}</div>`
        : "";
      const novaBadge = nova
        ? `<div class="absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" style="background:${novaColors[nova] ?? "#6b7280"}" title="NOVA ${nova}">${nova}</div>`
        : "";
      return `
      <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${escapeHtml(p.barcode)}">
        <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />
          ${gradeBadge}
          ${novaBadge}
        </div>
        <div class="p-4">
          <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${escapeHtml(p.brand)}</p>
          <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${escapeHtml(p.name)}</h3>
          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span><i class="fa-solid fa-fire mr-1"></i>${fmt(n.calories, " kcal")}/100g</span>
          </div>
          <div class="grid grid-cols-4 gap-1 text-center">
            <div class="bg-emerald-50 rounded p-1.5"><p class="text-xs font-bold text-emerald-700">${fmt(n.protein)}</p><p class="text-[10px] text-gray-500">Protein</p></div>
            <div class="bg-blue-50 rounded p-1.5"><p class="text-xs font-bold text-blue-700">${fmt(n.carbs)}</p><p class="text-[10px] text-gray-500">Carbs</p></div>
            <div class="bg-purple-50 rounded p-1.5"><p class="text-xs font-bold text-purple-700">${fmt(n.fat)}</p><p class="text-[10px] text-gray-500">Fat</p></div>
            <div class="bg-orange-50 rounded p-1.5"><p class="text-xs font-bold text-orange-700">${fmt(n.sugar)}</p><p class="text-[10px] text-gray-500">Sugar</p></div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  countElement.textContent = `Showing ${products.length} products`;
}

const categoryColors = [
  ["#fee2e2", "#b91c1c"],
  ["#dbeafe", "#1d4ed8"],
  ["#fef3c7", "#b45309"],
  ["#f3e8ff", "#7e22ce"],
  ["#d1fae5", "#047857"],
  ["#ffe4e6", "#be123c"],
];

export function renderProductCategories(categories, container) {
  container.innerHTML = categories
    .slice(0, 12)
    .map((c, i) => {
      const label = typeof c === "string" ? c : (c.name ?? c.id);
      const value = typeof c === "string" ? c : (c.id ?? c.name);
      const [bg, text] = categoryColors[i % categoryColors.length];
      return `<button class="product-category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all hover:opacity-80" style="background:${bg};color:${text}" data-category="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
    })
    .join("");
}
function youtubeEmbed(url) {
  if (!url) return "";
  const match =
    url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}

export function renderMealDetails(meal, container) {
  const ingredients = meal.ingredients ?? [];
  const steps = meal.instructions ?? [];
  const embed = youtubeEmbed(meal.youtube);

  const ingredientsHtml = ingredients
    .map(
      (i) => `
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
      <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
      <span class="text-gray-700"><span class="font-medium text-gray-900">${escapeHtml(i.measure)}</span> ${escapeHtml(i.ingredient)}</span>
    </div>`
    )
    .join("");

  const stepsHtml = steps
    .map(
      (step, index) => `
    <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">${index + 1}</div>
      <p class="text-gray-700 leading-relaxed pt-2">${escapeHtml(step)}</p>
    </div>`
    )
    .join("");

  const videoHtml = embed
    ? `
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><i class="fa-solid fa-video text-red-500"></i>Video Tutorial</h2>
      <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
        <iframe src="${embed}" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>`
    : "";

  container.innerHTML = `
  <div class="max-w-7xl mx-auto">
    <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
      <i class="fa-solid fa-arrow-left"></i><span>Back to Recipes</span>
    </button>

    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div class="relative h-80 md:h-96">
        <img src="${escapeHtml(meal.thumbnail)}" alt="${escapeHtml(meal.name)}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${escapeHtml(meal.category)}</span>
            <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${escapeHtml(meal.area)}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${escapeHtml(meal.name)}</h1>
          <div class="flex items-center gap-6 text-white/90">
            <span class="flex items-center gap-2"><i class="fa-solid fa-utensils"></i><span id="hero-servings">– servings</span></span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-fire"></i><span id="hero-calories">– cal/serving</span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-8">
      <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all" data-meal-id="${escapeHtml(meal.id)}">
        <i class="fa-solid fa-clipboard-list"></i><span>Log This Meal</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-list-check text-emerald-600"></i>Ingredients
            <span class="text-sm font-normal text-gray-500 ml-auto">${ingredients.length} items</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${ingredientsHtml}</div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><i class="fa-solid fa-shoe-prints text-emerald-600"></i>Instructions</h2>
          <div class="space-y-4">${stepsHtml}</div>
        </div>
        ${videoHtml}
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><i class="fa-solid fa-chart-pie text-emerald-600"></i>Nutrition Facts</h2>
          <div id="nutrition-facts-container"><p class="text-sm text-gray-500">Loading nutrition...</p></div>
        </div>
      </div>
    </div>
  </div>`;
}

export function renderNutritionFacts(data, container) {
  const n = data.perServing ?? data.totals ?? {};
  const rows = [
    ["Protein", n.protein, "#10b981", 50],
    ["Carbs", n.carbs, "#3b82f6", 250],
    ["Fat", n.fat, "#a855f7", 65],
    ["Fiber", n.fiber, "#f97316", 28],
    ["Sugar", n.sugar, "#ec4899", 50],
  ];

  const rowsHtml = rows
    .map(([label, value, color, goal]) => {
      const percent = Math.min(100, ((Number(value) || 0) / goal) * 100);
      return `
      <div>
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background:${color}"></div>
            <span class="text-gray-700">${label}</span>
          </div>
          <span class="font-bold text-gray-900">${fmt(value)}</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="h-2 rounded-full" style="width:${percent}%;background:${color}"></div>
        </div>
      </div>`;
    })
    .join("");

  container.innerHTML = `
    <p class="text-sm text-gray-500 mb-4">Per serving</p>
    <div class="text-center py-4 mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
      <p class="text-sm text-gray-600">Calories per serving</p>
      <p class="text-4xl font-bold text-emerald-600">${Math.round(n.calories ?? 0)}</p>
      <p class="text-xs text-gray-500 mt-1">Total: ${Math.round(data.totals?.calories ?? 0)} cal</p>
    </div>
    <div class="space-y-4">${rowsHtml}</div>`;

  const servings = document.getElementById("hero-servings");
  const calories = document.getElementById("hero-calories");
  if (servings) servings.textContent = `${data.servings ?? "–"} servings`;
  if (calories) calories.textContent = `${Math.round(n.calories ?? 0)} cal/serving`;
}
const GOALS = { calories: 2000, protein: 50, carbs: 250, fat: 65 };

function sum(items, key) {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function statCard(icon, iconClasses, label, value) {
  return `
    <div class="bg-white rounded-2xl p-5 border-2 border-gray-200 flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center ${iconClasses}"><i class="fa-solid ${icon}"></i></div>
      <div>
        <p class="text-sm text-gray-500">${label}</p>
        <p class="text-xl font-bold text-gray-900">${value}</p>
      </div>
    </div>`
}

export function renderFoodLog(todayItems, week) {
  const dateEl = document.getElementById("foodlog-date");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  const totals = {
    calories: sum(todayItems, "calories"),
    protein: sum(todayItems, "protein"),
    carbs: sum(todayItems, "carbs"),
    fat: sum(todayItems, "fat"),
  };

  const bars = [
    ["Calories", totals.calories, GOALS.calories, "kcal", "bg-emerald-50", "bg-emerald-500"],
    ["Protein", totals.protein, GOALS.protein, "g", "bg-blue-50", "bg-blue-500"],
    ["Carbs", totals.carbs, GOALS.carbs, "g", "bg-amber-50", "bg-amber-500"],
    ["Fat", totals.fat, GOALS.fat, "g", "bg-purple-50", "bg-purple-500"],
  ]
    .map(([label, value, goal, unit, bg, bar]) => {
      const percent = Math.min(100, (value / goal) * 100);
      return `
      <div class="${bg} rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700">${label}</span>
          <span class="text-sm text-gray-500">${Math.round(value)} / ${goal} ${unit}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="${bar} h-2.5 rounded-full" style="width:${percent}%"></div>
        </div>
      </div>`;
    })
    .join("");

  const emptyState = `
    <div class="text-center py-8 text-gray-500">
      <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
      <p class="font-medium">No food logged today</p>
      <p class="text-sm mb-4">Start tracking your nutrition by logging meals or scanning products</p>
      <div class="flex justify-center gap-3">
        <button data-go="meals" class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all"><i class="fa-solid fa-plus mr-2"></i>Browse Recipes</button>
        <button data-go="products" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"><i class="fa-solid fa-barcode mr-2"></i>Scan Product</button>
      </div>
    </div>`;

  const itemsHtml = todayItems.length
    ? todayItems
        .map((item) => {
          const image = item.thumbnail
            ? `<img src="${escapeHtml(item.thumbnail)}" alt="" class="w-14 h-14 rounded-lg object-cover bg-white" />`
            : `<div class="w-14 h-14 rounded-lg bg-white flex items-center justify-center text-gray-400"><i class="fa-solid fa-utensils"></i></div>`;
          return `
        <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          ${image}
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 truncate">${escapeHtml(item.name)}</p>
            <p class="text-xs text-gray-500">${escapeHtml(item.type)} · ${escapeHtml(item.time)}</p>
            <p class="text-xs text-gray-500 mt-0.5">P ${Math.round(item.protein)}g · C ${Math.round(item.carbs)}g · F ${Math.round(item.fat)}g</p>
          </div>
          <p class="font-bold text-emerald-600">${Math.round(item.calories)} kcal</p>
          <button class="remove-log-item text-gray-400 hover:text-red-500 px-2" data-log-id="${escapeHtml(item.id)}" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button>
        </div>`;
        })
        .join("")
    : emptyState;

  const clearButton = todayItems.length
    ? `<button id="clear-foodlog" class="text-red-500 hover:text-red-600 text-sm font-medium"><i class="fa-solid fa-trash mr-1"></i>Clear All</button>`
    : "";

  const todaySection = document.getElementById("foodlog-today-section");
  todaySection.innerHTML = `
    <h3 class="text-lg font-bold text-gray-900 mb-4"><i class="fa-solid fa-fire text-orange-500 mr-2"></i>Today's Nutrition</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">${bars}</div>
    <div class="border-t border-gray-200 pt-4">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-semibold text-gray-700">Logged Items (${todayItems.length})</h4>
        ${clearButton}
      </div>
      <div id="logged-items-list" class="space-y-2">${itemsHtml}</div>
    </div>`;

  const days = week
    .map(
      (day) => `
    <div class="text-center rounded-xl p-3 ${day.isToday ? "bg-indigo-50 border-2 border-indigo-300" : "bg-gray-50"}">
      <p class="text-xs text-gray-500">${day.label}</p>
      <p class="text-lg font-bold text-gray-900">${day.dayNumber}</p>
      <p class="text-xl font-bold ${day.calories ? "text-emerald-600" : "text-gray-300"}">${Math.round(day.calories)}</p>
      <p class="text-xs text-gray-400">kcal</p>
    </div>`
    )
    .join("");

  const daysWithFood = week.filter((day) => day.items.length).length;
  const weekCalories = week.reduce((total, day) => total + day.calories, 0);
  const weekItems = week.reduce((total, day) => total + day.items.length, 0);
  const average = daysWithFood ? Math.round(weekCalories / daysWithFood) : 0;
  const onGoal = week.filter(
    (day) =>
      day.calories >= GOALS.calories * 0.8 &&
      day.calories <= GOALS.calories * 1.1
  ).length;
const weekly = document.getElementById("weekly-chart");
  weekly.className = "";
  weekly.innerHTML = `<div class="grid grid-cols-7 gap-2 sm:gap-3">${days}</div>`;

  let stats = document.getElementById("weekly-stats");
  if (!stats) {
    stats = document.createElement("div");
    stats.id = "weekly-stats";
    stats.className = "grid grid-cols-1 md:grid-cols-3 gap-4";
    weekly.closest(".bg-white").insertAdjacentElement("afterend", stats);
  }

  const itemsLabel = `${weekItems} ${weekItems === 1 ? "item" : "items"}`;
  stats.innerHTML = `
    ${statCard("fa-chart-line", "bg-emerald-100 text-emerald-600", "Weekly Average", `${average} kcal`)}
    ${statCard("fa-utensils", "bg-blue-100 text-blue-600", "Total Items This Week", itemsLabel)}
    ${statCard("fa-bullseye", "bg-purple-100 text-purple-600", "Days On Goal", `${onGoal} / 7`)}`;
}
  