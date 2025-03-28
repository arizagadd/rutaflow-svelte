import { c as create_ssr_component, d as subscribe, v as validate_component, e as escape, a as add_attribute, f as each } from "../../../../chunks/ssr.js";
import { p as page, g as getJson } from "../../../../chunks/index2.js";
import { alertController } from "@ionic/core";
import { logOut } from "ionicons/icons/index.mjs";
import { g as goto } from "../../../../chunks/client.js";
import { I as IonPage } from "../../../../chunks/IonPage.js";
import { DATABASE_URL } from "../../../../chunks/hooks.js";
const css = {
  code: ".route-color.svelte-1xh3ip{width:100%;height:100%;border-radius:50%;display:flex;justify-content:center}.route-symbol.svelte-1xh3ip{text-align:center;align-self:center;font-size:30px}h3.svelte-1xh3ip{font-size:13px}.text-muted.svelte-1xh3ip{color:#8e8e8e}",
  map: null
};
function getDeliveryColor(status) {
  let color = "#ffffff";
  if (status === "pending") {
    color = "#FAD733";
  } else if (status === "completed") {
    color = "#27C24C";
  } else if (status == "enroute") {
    color = "#3BBAC2";
  } else if (status == "paused") {
    color = "#949DB9";
  } else if (status == "cancelled") {
    color = "#F05050";
  } else if (status == "checklist") {
    color = "#F6A833";
  } else if (status == "checklist-pending") {
    color = "#E98C00";
  }
  return color;
}
function setTitleStatus(status) {
  let title_status = "";
  if (status === "pending") {
    title_status = "Pendiente";
  } else if (status === "completed") {
    title_status = "Completado";
  } else if (status == "enroute") {
    title_status = "En ruta";
  } else if (status == "paused") {
    title_status = "Pausado";
  } else if (status == "cancelled") {
    title_status = "Cancelado";
  } else if (status == "checklist") {
    title_status = "En checklist";
  } else if (status == "checklist-pending") {
    title_status = "Pendiente de aprobar checklist";
  }
  return title_status;
}
function getContrast(hexColor) {
  if (hexColor.slice(0, 1) === "#") {
    hexColor = hexColor.slice(1);
  }
  if (hexColor.length === 3) {
    hexColor = hexColor.split("").map(function(hex) {
      return hex + hex;
    }).join("");
  }
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1e3;
  return yiq >= 128 ? "#414040" : "#fff";
}
function getTodayDate() {
  var date = /* @__PURE__ */ new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var today = year + "-" + month + "-" + day;
  return { today, year, month, date, day };
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { driverId } = $$props;
  let back_url = DATABASE_URL;
  let routes = [];
  let events = new Object();
  let hasPendingRoutes = false;
  let flag = false;
  let dataSession = new Object();
  let refresher;
  let selectedFilter = "routes-of-day";
  function loadRoutes() {
    var lv = new Object();
    lv.id_enterprise = dataSession.id_enterprise ? dataSession.id_enterprise : "null";
    lv.id_user_over = dataSession.id_user;
    lv.token = dataSession.token;
    var filterVal = !selectedFilter.value ? selectedFilter : selectedFilter.value;
    console.log("Selected Filter:", filterVal);
    let today = getTodayDate();
    if (filterVal === "enroute") {
      lv.status = "enroute";
    } else if (filterVal === "routes-of-day") {
      lv.actual_date = today.today;
    } else if (filterVal === "yesterday-routes") {
      let yesterday = new Date(today.date);
      yesterday.setDate(yesterday.getDate() - 1);
      let yesterdayFormatted = yesterday.toISOString().split("T")[0];
      lv.actual_date = yesterdayFormatted;
    } else if (filterVal === "week-routes") {
      let dayOfWeek = today.date.getDay();
      let difference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      let monday = new Date(today.date);
      monday.setDate(today.date.getDate() - difference);
      let mondayFormatted = monday.toISOString().split("T")[0];
      lv.actual_date = mondayFormatted;
      lv.actual_date2 = today.today;
    }
    getJson(
      `${back_url}api/admin/report/seguimiento_list.php`,
      function(data) {
        const seguimiento_info = data;
        routes = seguimiento_info.data.seguimiento_list;
        events = seguimiento_info.data.event_list;
      },
      lv
    );
  }
  function changePendingState(status) {
    status == "true" ? hasPendingRoutes = true : hasPendingRoutes = false;
    return "";
  }
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const showAlert = async (customHeader, customMessage) => {
    const alert = await alertController.create({
      header: customHeader || "Error",
      // Use customHeader or default value
      message: customMessage || "Vuelva a intentar",
      // Use customMessage or default value
      buttons: [{ text: "Cerrar" }]
    });
    await alert.present();
  };
  if ($$props.driverId === void 0 && $$bindings.driverId && driverId !== void 0)
    $$bindings.driverId(driverId);
  $$result.css.add(css);
  {
    {
      ({ driverId } = $page.params);
      dataSession = JSON.parse(localStorage.getItem("userSession"));
      if (dataSession) {
        if (driverId == "me" && dataSession.id_user) {
          if (dataSession.type == "admin" || dataSession.type == "super") {
            goto();
            loadRoutes();
            flag = true;
          } else {
            showAlert("Usuario no autorizado", "Este usuario no tiene acceso a la app de Rutaflow, entrar en contacto con soporte");
            goto();
          }
        } else if (dataSession && driverId) {
          goto(`/drivers/${dataSession.id_driver}`);
          loadRoutes();
        }
      } else {
        showAlert("Sesión cerrada", "Será redireccionado para volver a ingresar");
        goto();
      }
    }
  }
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-qavk4j_START -->${$$result.title = `<title>Rutas - Rutaflow</title>`, ""}<!-- HEAD_svelte-qavk4j_END -->`, ""} ${dataSession ? `${validate_component(IonPage, "IonPage").$$render($$result, {}, {}, {
    default: () => {
      return `<ion-header translucent><ion-toolbar><ion-buttons slot="start"><ion-button>${escape(dataSession.name)}</ion-button></ion-buttons>  <ion-title><ion-select id="quick-filter" interface="action-sheet" value="routes-of-day"${add_attribute("this", selectedFilter, 0)} data-svelte-h="svelte-znqezo"><ion-select-option value="enroute">Rutas en curso</ion-select-option> <ion-select-option value="routes-of-day">Rutas del día</ion-select-option> <ion-select-option value="yesterday-routes">Rutas de ayer</ion-select-option> <ion-select-option value="week-routes">Rutas de la semana</ion-select-option></ion-select></ion-title> <ion-buttons slot="end"><ion-button title="Salir" alt="Salir" data-svelte-h="svelte-83ekyc"><ion-icon${add_attribute("icon", logOut, 0)}></ion-icon></ion-button></ion-buttons></ion-toolbar></ion-header> <ion-content><ion-refresher slot="fixed"${add_attribute("this", refresher, 0)} data-svelte-h="svelte-1wkherr"><ion-refresher-content pulling-icon="arrow-dropdown" pulling-text="Jale para actualizar" refreshing-spinner="circles" refreshing-text="Actualizando..."></ion-refresher-content></ion-refresher> <ion-list>${driverId == "me" && flag ? `${routes.length != 0 ? `${each(routes, (route) => {
        return `${escape(changePendingState("true"))} ${route.status != "completed" && route.status != "cancelled" && route.status != "finished" ? `<ion-item button><ion-avatar slot="start"><div class="route-color svelte-1xh3ip" style="${"background-color:" + escape(getDeliveryColor(route.status), true) + ";color: " + escape(getContrast(getDeliveryColor(route.status)), true)}"${add_attribute("title", setTitleStatus(route.status), 0)}><div class="route-symbol svelte-1xh3ip" style="">${escape(capitalizeFirstLetter(route.name.charAt(0)))}</div> </div></ion-avatar> <ion-label><h2>${escape(route.name ? route.name.toUpperCase() : "")}</h2> <h3 class="text-muted svelte-1xh3ip">Inicio: ${escape(route.date_start)}</h3></ion-label> <div slot="end"></div> </ion-item>` : `${escape(changePendingState("false"))}`}`;
      })}` : `${escape(changePendingState("false"))}`}` : ` ${routes.length != 0 ? `${each(routes.filter((route) => route.id_driver === driverId), (route) => {
        return `${escape(changePendingState("true"))} ${route.status != "completed" && route.status != "cancelled" && route.status != "finished" ? `<ion-item button><ion-avatar slot="start"><div class="route-color svelte-1xh3ip" style="${"background-color:" + escape(getDeliveryColor(route.status), true) + ";color: " + escape(getContrast(getDeliveryColor(route.status)), true)}"${add_attribute("title", setTitleStatus(route.status), 0)}><div class="route-symbol svelte-1xh3ip" style="">${escape(capitalizeFirstLetter(route.name.charAt(0)))}</div> </div></ion-avatar> <ion-label><h2>${escape(route.name)}</h2> <h3 class="text-muted svelte-1xh3ip">Inicio: ${escape(route.date_start)}</h3></ion-label> <div slot="end"></div> </ion-item>` : `${escape(changePendingState("false"))}`}`;
      })}` : `${escape(changePendingState("false"))}`}`} ${!hasPendingRoutes ? `<ion-grid class="ion-text-center h-full" data-svelte-h="svelte-3d9uou"><ion-row class="h-full items-center"><ion-col class="text-center"><h2 class="text-3xl text-muted mb-4 svelte-1xh3ip">No hay rutas pendientes para hoy</h2> <p class="text-muted svelte-1xh3ip">Espere indicaciones de su supervisor</p></ion-col></ion-row></ion-grid>` : ``}</ion-list></ion-content>`;
    }
  })}` : ``}`;
});
export {
  Page as default
};
