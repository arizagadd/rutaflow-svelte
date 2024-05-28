import { c as create_ssr_component, b as subscribe, v as validate_component, e as escape, a as add_attribute, d as each } from './ssr-ClOIBI2p.js';
import { p as page, I as IonPage } from './IonPage-jzbcYuxx.js';
import { alertController } from '@ionic/core';
import { logOut } from 'ionicons/icons/index.mjs';
import { g as goto } from './client-CQ5E_ugM.js';
import './authStore-DFsZKR1n.js';
import './exports-DuWZopOC.js';

const css = {
  code: ".route-color.svelte-1xh3ip{width:100%;height:100%;border-radius:50%;display:flex;justify-content:center}.route-symbol.svelte-1xh3ip{text-align:center;align-self:center;font-size:30px}h3.svelte-1xh3ip{font-size:13px}.text-muted.svelte-1xh3ip{color:#8e8e8e}",
  map: null
};
function compareDates(start_date) {
  var today = getActualFormattedDate();
  const routeDateParts = start_date.split(" ")[0];
  return today === routeDateParts;
}
function getDeliveryColor(status) {
  let color = "#ffffff";
  if (status === "pending") {
    color = "#dbb814b2";
  } else if (status === "completed") {
    color = "#77d039";
  } else if (status == "enroute") {
    color = "#5c7de8";
  } else if (status == "paused") {
    color = "#949db9";
  } else if (status == "cancelled") {
    color = "#ea0909b2";
  } else if (status == "checklist") {
    color = "#11cab9b2";
  } else if (status == "checklist-pending") {
    color = "#a8a8a8";
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
function getActualFormattedDate() {
  var today = /* @__PURE__ */ new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { driverId } = $$props;
  let routes = [];
  let hasPendingRoutes = false;
  let flag = false;
  let dataSession = new Object();
  let refresher;
  function loadRoutes(driverId2) {
    var actualDate = getActualFormattedDate();
    const requestData = new FormData();
    requestData.append("actual_date", actualDate);
    fetch(`https://rutaflow-app-development.up.railway.app/api/admin/report/seguimiento_list.php`, { method: "POST", body: requestData }).then((response) => response.json()).then((data) => {
      const seguimiento_info = data;
      routes = seguimiento_info.data.seguimiento_list;
      seguimiento_info.data.event_list;
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
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
      const storedSession = localStorage.getItem("userSession");
      dataSession = JSON.parse(storedSession);
      if (dataSession) {
        if (driverId == "me" && dataSession.id_user) {
          if (dataSession.type == "admin" || dataSession.type == "superadmin") {
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
      return `<ion-header translucent><ion-toolbar><ion-buttons slot="secondary"><ion-button>${escape(dataSession.name)}</ion-button></ion-buttons> <ion-title data-svelte-h="svelte-82wrsm">Rutas del día</ion-title> <ion-buttons slot="primary"><ion-button title="Salir" alt="Salir" data-svelte-h="svelte-1itonhq"><ion-icon${add_attribute("icon", logOut, 0)}></ion-icon></ion-button></ion-buttons></ion-toolbar></ion-header> <ion-content><ion-refresher slot="fixed"${add_attribute("this", refresher, 0)} data-svelte-h="svelte-1wkherr"><ion-refresher-content pulling-icon="arrow-dropdown" pulling-text="Jale para actualizar" refreshing-spinner="circles" refreshing-text="Actualizando..."></ion-refresher-content></ion-refresher> <ion-list>${driverId == "me" && flag ? `${each(routes, (route) => {
        return `${compareDates(route.date_start) ? `${escape(changePendingState("true"))} ${route.status != "completed" || route.status != "cancelled" ? `<ion-item button><ion-avatar slot="start"><div class="route-color svelte-1xh3ip" style="${"background-color:" + escape(getDeliveryColor(route.status), true) + ";color: " + escape(getContrast(getDeliveryColor(route.status)), true)}"${add_attribute("title", setTitleStatus(route.status), 0)}><div class="route-symbol svelte-1xh3ip" style="">${escape(capitalizeFirstLetter(route.name.charAt(0)))}</div> </div></ion-avatar> <ion-label><h2>${escape(route.name)}</h2> <h3 class="text-muted svelte-1xh3ip">Inicio: ${escape(route.date_start)}</h3></ion-label> <div slot="end"></div> </ion-item>` : ``}` : `${escape(changePendingState("false"))}`}`;
      })}` : ` ${each(routes.filter((route) => route.id_driver === driverId), (route) => {
        return `${compareDates(route.date_start) ? `${escape(changePendingState("true"))} ${route.status != "completed" || route.status != "cancelled" ? `<ion-item button><ion-avatar slot="start"><div class="route-color svelte-1xh3ip" style="${"background-color:" + escape(getDeliveryColor(route.status), true) + ";color: " + escape(getContrast(getDeliveryColor(route.status)), true)}"${add_attribute("title", setTitleStatus(route.status), 0)}><div class="route-symbol svelte-1xh3ip" style="">${escape(capitalizeFirstLetter(route.name.charAt(0)))}</div> </div></ion-avatar> <ion-label><h2>${escape(route.name)}</h2> <h3 class="text-muted svelte-1xh3ip">Inicio: ${escape(route.date_start)}</h3></ion-label> <div slot="end"></div> </ion-item>` : ``}` : `${escape(changePendingState("false"))}`}`;
      })}`} ${!hasPendingRoutes ? `<ion-grid class="ion-text-center h-full" data-svelte-h="svelte-3d9uou"><ion-row class="h-full items-center"><ion-col class="text-center"><h2 class="text-3xl text-muted mb-4 svelte-1xh3ip">No hay rutas pendientes para hoy</h2> <p class="text-muted svelte-1xh3ip">Espere indicaciones de su supervisor</p></ion-col></ion-row></ion-grid>` : ``}</ion-list></ion-content>`;
    }
  })}` : ``}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-B_E00-Ns.js.map
