console.log(
  "🔍 process.env.EXPO_PUBLIC_API_URL:",
  process.env.EXPO_PUBLIC_API_URL
);
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://todo-list.dobleb.cl";
console.log("🔍 API_URL final:", API_URL);
