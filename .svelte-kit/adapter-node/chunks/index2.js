import { g as getContext } from "./ssr.js";
import "./client.js";
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function hexToRGBA(hex = "", alpha = 0) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
async function getJson(apiUrl = "", callback = function(obj = {}) {
}, variables = {}) {
  let formData = new FormData();
  for (const [key, value] of Object.entries(variables)) {
    formData.append(key, value);
  }
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      const result = await response.json();
      callback(result);
    } else {
      console.error("Request failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error during file upload:", error);
  }
}
export {
  getJson as g,
  hexToRGBA as h,
  page as p
};
