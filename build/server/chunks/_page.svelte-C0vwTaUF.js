import { c as create_ssr_component, b as subscribe, v as validate_component, a as add_attribute, e as escape, d as each } from './ssr-ClOIBI2p.js';
import { p as page, I as IonPage } from './IonPage-jzbcYuxx.js';
import { g as goto } from './client-CQ5E_ugM.js';
import { arrowBack, locationOutline } from 'ionicons/icons/index.mjs';
import { modalController } from '@ionic/core';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';
import { initialize } from '@ionic/core/components/index.js';
import { w as writable } from './index-ClYKuxzU.js';
import './exports-DuWZopOC.js';

const registerCustomElement = (tagName, component) => {
  if (!customElements.get(tagName)) {
    class SvelteElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const props = {};
        for (const attribute of this.attributes) {
          props[attribute.name] = attribute.value;
        }
        new component({
          target: this.shadowRoot,
          props
        });
      }
    }
    customElements.define(tagName, SvelteElement);
  }
};
const isRegistered = function(name) {
  return document.createElement(name).constructor !== HTMLElement;
};
const registerWebComponentOnce = (selector, component) => {
  if (!isRegistered(selector)) {
    registerCustomElement(selector, component);
  }
};
const IonicShowModal = async (selector, component, componentProps) => {
  initialize();
  defineCustomElement();
  registerWebComponentOnce(selector, component);
  const modal = await modalController.create({
    component: selector,
    componentProps
  });
  modal.present();
  return await modal.onWillDismiss();
};
const checklistStore = writable({
  items: [],
  // Your checklist items
  checkedIndices: [],
  // Array to store checked indices
  mandatory: []
});
const css$1 = {
  code: ".loadEvidence.svelte-1lh6nay{--background:#93e9be;--background-hover:#9ce0be;--background-activated:#88f4be;--background-focused:#88f4be;--color:blue;--border-radius:0;--border-color:#000;--border-style:solid;--border-width:1px;--box-shadow:0 2px 6px 0 rgb(0, 0, 0, 0.25);--ripple-color:deeppink;--padding-top:10px;--padding-bottom:10px}",
  map: null
};
const ChecklistControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_checklistStore;
  $$unsubscribe_checklistStore = subscribe(checklistStore, (value) => value);
  let overlayElement = document.querySelector("ion-modal");
  const checklist = overlayElement.componentProps.checklist;
  overlayElement.componentProps.driverId;
  overlayElement.componentProps.routeId;
  const isLast = overlayElement.componentProps.isLast;
  let checkk = [];
  let checkbox_item = {};
  let KmInicial, GasInicial, KmFinal, GasFinal;
  let imagesName = {};
  $$result.css.add(css$1);
  $$unsubscribe_checklistStore();
  return `<ion-header translucent><ion-toolbar><ion-buttons slot="start"><ion-button color="medium" data-svelte-h="svelte-1dnmkxs">Cancelar</ion-button></ion-buttons> <ion-title data-svelte-h="svelte-ucox25">Requerimientos de ruta</ion-title></ion-toolbar></ion-header> <ion-content fullscreen><ion-list>${isLast ? `<ion-item><ion-label style="display:flex;"><input${add_attribute("id", `chkbox-km-fin`, 0)} style="pointer-events: auto;" type="checkbox" required${add_attribute("this", KmFinal, 0)}> <p style="margin-left:10px;" data-svelte-h="svelte-ccmu71">Kilometraje final</p></ion-label> <ion-button fill="outline" size="small" class="loadKmInicial" aria-selected> ${escape("Cargar km")} </ion-button></ion-item> <ion-item><ion-label style="display:flex;"><input${add_attribute("id", `chkbox-gas-fin`, 0)} style="pointer-events: auto;" type="checkbox" required${add_attribute("this", GasFinal, 0)}> <p style="margin-left:10px;" data-svelte-h="svelte-wsoyd2">Gasolina final (litros)</p></ion-label> <ion-button fill="outline" size="small" class="loadGasInicial"> ${escape("Cargar gas")} </ion-button></ion-item>` : `<ion-item><ion-label style="display:flex;"><input${add_attribute("id", `chkbox-km-ini`, 0)} style="pointer-events: auto;" type="checkbox" required${add_attribute("this", KmInicial, 0)}> <p style="margin-left:10px;" data-svelte-h="svelte-88twxi">Kilometraje inicial</p></ion-label> <ion-button fill="outline" size="small" class="loadKmInicial" aria-selected> ${escape("Cargar km")} </ion-button></ion-item> <ion-item><ion-label style="display:flex;"><input${add_attribute("id", `chkbox-gas-ini`, 0)} style="pointer-events: auto;" type="checkbox" required${add_attribute("this", GasInicial, 0)}> <p style="margin-left:10px;" data-svelte-h="svelte-1ux30eb">Gasolina inicial (litros)</p></ion-label> <ion-button fill="outline" class="loadGasInicial" size="small" style="height: 16px "> ${escape("Cargar gas")} </ion-button></ion-item> `} ${checklist ? `${each(checklist, (check) => {
    return `<ion-item><ion-label style="display:flex;"><input${add_attribute("id", `chkbox-${check.id_checklist_event}`, 0)} style="pointer-events: auto;" type="checkbox"${add_attribute("value", check.id_checklist_event, 0)} required${~checkk.indexOf(check.id_checklist_event) ? add_attribute("checked", true, 1) : ""}${add_attribute("this", checkbox_item[check.id_checklist_event], 0)}> <p style="margin-left:10px;">${escape(check.item)}</p></ion-label> <ion-button fill="outline" class="loadEvidence svelte-1lh6nay" size="small"><label for="${"chklist-" + escape(check.id_checklist_event, true)}">${escape(imagesName[check.id_checklist_event] ? imagesName[check.id_checklist_event] : "Cargar evidencia")}</label> <input style="display:none;" id="${"chklist-" + escape(check.id_checklist_event, true)}" name="fileToUpload" type="file" accept="image/*"> </ion-button> </ion-item>`;
  })}` : ``}</ion-list></ion-content> <ion-footer> <ion-button fill="outline" color="tertiary" strong style="width: 99%; height: auto;" data-svelte-h="svelte-g82qqw">Confirmar</ion-button>  </ion-footer>`;
});
const css = {
  code: ".sub.svelte-ziybgw{font-size:12px;margin-top:5px}.order-wrapper.svelte-ziybgw{width:100%;height:100%;border-radius:50%;border:1px solid #CBCFDE;text-align:center;display:flex;justify-content:center}.order.svelte-ziybgw{align-self:center}.notes.svelte-ziybgw{background-color:#e0b500;display:inline-block;width:8px;height:8px;border-radius:50%}",
  map: null
};
function getDeliveryColor(delivery) {
  let color = "#ffffff";
  if (delivery.status === "pending") {
    color = "#f2e300";
  } else if (delivery.status === "completed") {
    color = "#44d900";
  }
  return color;
}
function getStatusTitle(status) {
  let state = "";
  if (status == "pending") {
    state = "Pendiente";
  } else if (status == "completed") {
    state = "Completado";
  }
  return state;
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
function changeRouteStatus(id_route, status) {
  let requestData = new FormData();
  requestData.append("id_route", id_route);
  requestData.append("status", status);
  fetch("https://app.rutaflow.com/api/admin/route/change_status.php", { method: "POST", body: requestData }).then((response) => response.json()).then((data) => {
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });
  return "";
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { routeId } = $$props;
  let { driverId } = $$props;
  let dataSession = new Object();
  let deliveries = [];
  let stats = {};
  let checklist = {};
  let refresher;
  function loadRoute(routeId2) {
    const requestData = new FormData();
    requestData.append("id_route", routeId2);
    fetch("https://app.rutaflow.com/api/admin/report/seguimiento_list.php", { method: "POST", body: requestData }).then((response) => response.json()).then((data) => {
      stats = data.data.seguimiento_list[0];
      deliveries = data.data.event_list;
      checklist = data.data.checklist;
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }
  const showChecklistModal = (checklist2, driverId2, routeId2) => {
    var isLast = false;
    IonicShowModal("modal-checklist", ChecklistControl, { checklist: checklist2, driverId: driverId2, routeId: routeId2, isLast }).then((result) => {
    });
    changeRouteStatus(routeId2, "checklist");
    return "";
  };
  const mustCharge = (delivery) => {
    if (delivery.tracking_type == "subscription") {
      if (delivery.subscriber_info && delivery.payment_type === "cash") {
        let date = new Date(delivery.subscriber_info.payment_next);
        if (date < /* @__PURE__ */ new Date()) {
          return true;
        }
      }
    } else if (delivery.tracking_type == "ecommerce") {
      if (Number(delivery.payment_pending) > 0) {
        return true;
      }
    }
    return false;
  };
  if ($$props.routeId === void 0 && $$bindings.routeId && routeId !== void 0)
    $$bindings.routeId(routeId);
  if ($$props.driverId === void 0 && $$bindings.driverId && driverId !== void 0)
    $$bindings.driverId(driverId);
  $$result.css.add(css);
  {
    {
      ({ routeId, driverId } = $page.params);
      dataSession = JSON.parse(localStorage.getItem("userSession"));
      if (dataSession) {
        if (dataSession.id_user && (dataSession.type == "admin" || dataSession.type == "super")) {
          goto();
          loadRoute(routeId);
        } else if (dataSession.id_user && dataSession.id_driver) {
          loadRoute(routeId);
          goto(`/drivers/${dataSession.id_driver}/routes/${routeId}`);
        }
      } else {
        goto();
      }
    }
  }
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-kn0kph_START -->${$$result.title = `<title>Rutaflow - Detalles de ruta</title>`, ""}<!-- HEAD_svelte-kn0kph_END -->`, ""} ${dataSession ? `${validate_component(IonPage, "IonPage").$$render($$result, {}, {}, {
    default: () => {
      return `<ion-header translucent><ion-toolbar><ion-buttons slot="start"><ion-button title="Atrás" alt="Atrás" data-svelte-h="svelte-7ppz3r"><ion-icon${add_attribute("icon", arrowBack, 0)}></ion-icon></ion-button></ion-buttons> <ion-buttons slot="secondary"><ion-button>${escape(dataSession.name)}</ion-button></ion-buttons> <ion-title>${escape(stats.name)}</ion-title></ion-toolbar></ion-header> ${checklist.length > 0 ? `${checklist.every((item) => item.img) ? `<ion-content><ion-refresher slot="fixed"${add_attribute("this", refresher, 0)} data-svelte-h="svelte-1poui8g"><ion-refresher-content pulling-icon="arrow-dropdown" pulling-text="Pull to refresh" refreshing-spinner="circles" refreshing-text="Refreshing..."></ion-refresher-content></ion-refresher> <ion-list>${each(deliveries, (delivery, index) => {
        return `<ion-item><ion-avatar slot="start"><div class="order-wrapper svelte-ziybgw"${add_attribute("title", getStatusTitle(delivery.status), 0)} style="${"background-color: " + escape(getDeliveryColor(delivery), true) + "; color: " + escape(getContrast(getDeliveryColor(delivery)), true)}"><div class="order svelte-ziybgw">${escape(parseInt(delivery.pos) + 1)}</div> </div></ion-avatar> <ion-label button><ion-text color="#2e2e2e"><h3>${escape(delivery.title)} ${delivery.support_list && delivery.support_list.length || mustCharge(delivery) ? `<span class="notes svelte-ziybgw"></span>` : ``} </h3></ion-text> <div class="sub svelte-ziybgw" data-svelte-h="svelte-130ohbs"> </div></ion-label> <ion-icon${add_attribute("icon", locationOutline, 0)} slot="end"></ion-icon> </ion-item>`;
      })}</ion-list></ion-content>` : `${escape(showChecklistModal(checklist, driverId, routeId))} <ion-content><ion-refresher slot="fixed"${add_attribute("this", refresher, 0)} data-svelte-h="svelte-1poui8g"><ion-refresher-content pulling-icon="arrow-dropdown" pulling-text="Pull to refresh" refreshing-spinner="circles" refreshing-text="Refreshing..."></ion-refresher-content></ion-refresher> <ion-list>${each(deliveries, (delivery, index) => {
        return `<ion-item><ion-avatar slot="start"><div class="order-wrapper svelte-ziybgw"${add_attribute("title", getStatusTitle(delivery.status), 0)} style="${"background-color: " + escape(getDeliveryColor(delivery), true) + "; color: " + escape(getContrast(getDeliveryColor(delivery)), true)}"><div class="order svelte-ziybgw">${escape(parseInt(delivery.pos) + 1)}</div> </div></ion-avatar> <ion-label button><ion-text color="#2e2e2e"><h3>${escape(delivery.title)} ${delivery.support_list && delivery.support_list.length || mustCharge(delivery) ? `<span class="notes svelte-ziybgw"></span>` : ``} </h3></ion-text> <div class="sub svelte-ziybgw" data-svelte-h="svelte-130ohbs"> </div></ion-label> <ion-icon${add_attribute("icon", locationOutline, 0)} slot="end"></ion-icon> </ion-item>`;
      })}</ion-list></ion-content>`}` : `${escape(changeRouteStatus(routeId, "enroute"))} <ion-content><ion-refresher slot="fixed"${add_attribute("this", refresher, 0)} data-svelte-h="svelte-1jkndk3"><ion-refresher-content pulling-icon="arrow-dropdown" pulling-text="Jala para actualizar" refreshing-spinner="circles" refreshing-text="Actualizando..."></ion-refresher-content></ion-refresher> <ion-list>${each(deliveries, (delivery) => {
        return `<ion-item><ion-avatar slot="start"><div class="order-wrapper svelte-ziybgw"${add_attribute("title", getStatusTitle(delivery.status), 0)} style="${"background-color: " + escape(getDeliveryColor(delivery), true) + "; color: " + escape(getContrast(getDeliveryColor(delivery)), true)}"><div class="order svelte-ziybgw">${escape(parseInt(delivery.pos) + 1)}</div> </div></ion-avatar> <ion-label button><ion-text color="#2e2e2e"><h3>${escape(delivery.title)} ${delivery.support_list && delivery.support_list.length || mustCharge(delivery) ? `<span class="notes svelte-ziybgw"></span>` : ``}</h3> </ion-text></ion-label> <ion-icon${add_attribute("icon", locationOutline, 0)} slot="end" style="${"color: " + escape(getDeliveryColor(delivery), true)}"></ion-icon> </ion-item>`;
      })}</ion-list></ion-content>`}`;
    }
  })}` : ``}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-C0vwTaUF.js.map
