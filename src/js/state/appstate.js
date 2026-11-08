const STORAGE_KEY = "nutriplan-food-log";

function readStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

let items = readStorage();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error(error);
  }
}

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addLogItem(item) {
  const now = new Date();
  items.push({
    ...item,
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    date: dateKey(now),
    time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    calories: Number(item.calories) || 0,
    protein: Number(item.protein) || 0,
    carbs: Number(item.carbs) || 0,
    fat: Number(item.fat) || 0,
  });
  save();
}

export function removeLogItem(id) {
  items = items.filter((item) => item.id !== id);
  save();
}

export function clearToday() {
  const today = dateKey();
  items = items.filter((item) => item.date !== today);
  save();
}

export function getItemsForDate(key) {
  return items.filter((item) => item.date === key);
}

export function getWeek() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const key = dateKey(day);
    const dayItems = getItemsForDate(key);
    return {
      key,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: day.getDate(),
      isToday: key === dateKey(today),
      items: dayItems,
      calories: dayItems.reduce((total, item) => total + item.calories, 0),
    };
  });
}