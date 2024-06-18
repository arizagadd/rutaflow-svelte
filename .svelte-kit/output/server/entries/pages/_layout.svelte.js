import { c as create_ssr_component } from "../../chunks/ssr.js";
import "ionic-svelte/components/all.js";
import "@ionic/core";
import { initialize } from "@ionic/core/components/index.js";
import "@ionic/core/dist/collection/global/config.js";
import { w as writable, r as readable } from "../../chunks/index.js";
readable(
  typeof window !== "undefined" ? (window.navigator.onLine ? "on" : "off") + "line" : "",
  (set) => {
    const eventFunction = () => {
      if (typeof window !== "undefined")
        set((window.navigator.onLine ? "on" : "off") + "line");
    };
    if (typeof window !== "undefined") {
      window.addEventListener("offline", eventFunction);
      window.addEventListener("online", eventFunction);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("offline", eventFunction);
        window.removeEventListener("online", eventFunction);
      }
    };
  }
);
const readableEventFactory = (args) => {
  const { defaultvalue, event, eventAttr, listenerComponent } = args;
  return readable(defaultvalue, (set) => {
    const eventFunction = (event2) => {
      if (eventAttr) set(event2[eventAttr]);
      else set(event2);
    };
    listenerComponent.addEventListener(event, eventFunction);
    return () => {
      listenerComponent.removeEventListener(event, eventFunction);
    };
  });
};
readable("", (set) => {
  return () => {
  };
});
readable("", (set) => {
  return () => {
  };
});
readable("", (set) => {
  return () => {
  };
});
if (typeof window !== "undefined") {
  readableEventFactory({
    defaultvalue: "",
    event: "resize",
    eventAttr: "timeStamp",
    listenerComponent: window
  });
  readableEventFactory({
    defaultvalue: "",
    event: "ionKeyboardDidShow",
    eventAttr: "",
    listenerComponent: window
  });
  readableEventFactory({
    defaultvalue: "",
    event: "ionKeyboardDidHide",
    eventAttr: "",
    listenerComponent: window
  });
}
readable("", (set) => {
  return () => {
  };
});
readable("", (set) => {
  return () => {
  };
});
readable("", (set) => {
  return () => {
  };
});
readable("", (set) => {
  return () => {
  };
});
if (typeof document !== "undefined") {
  readableEventFactory({
    defaultvalue: "",
    event: "resume",
    eventAttr: "",
    listenerComponent: document
  });
  readableEventFactory({
    defaultvalue: "",
    event: "pause",
    eventAttr: "",
    listenerComponent: document
  });
  readableEventFactory({
    defaultvalue: "",
    event: "ionBackButton",
    eventAttr: "",
    listenerComponent: document
  });
  readableEventFactory({
    defaultvalue: "",
    event: "keydown",
    eventAttr: "key",
    listenerComponent: document
  });
}
const prefersDark = writable(
  typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches : ""
);
if (typeof window !== "undefined")
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    prefersDark.set(e.matches ? true : false);
  });
const setupIonicBase = async (config) => {
  initialize(config);
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("ion-ce");
  }
};
function url(page, path) {
  const pathname = page.url.pathname;
  if (path == null) {
    return path;
  } else if (path.match(/^\.\.?\//)) {
    const [, breadcrumbs, relativePath] = path.match(/^([./]+)(.*)/) || [];
    let dir = pathname.replace(/\/$/, "");
    const traverse = breadcrumbs && breadcrumbs.match(/\.\.\//g) || [];
    traverse.forEach(() => dir = dir.replace(/\/[^/]+\/?$/, ""));
    path = `${dir}/${relativePath}`.replace(/\/$/, "");
    path = path || "/";
  } else if (path.match(/^\//)) {
    return path;
  } else {
    return path;
  }
  return path;
}
setupIonicBase();
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<ion-app>${slots.default ? slots.default({}) : ``}</ion-app>`;
});
export {
  Layout as default,
  url
};
