// src/services/IonicControllers.js
import { modalController } from "@ionic/core";
import { defineCustomElement } from "@ionic/core/components/ion-modal.js";
import { initialize } from "@ionic/core/components";


/* ========= Registrar web components de Svelte ========= */
export const registerCustomElement = (tagName, component) => {
  if (!customElements.get(tagName)) {
    class SvelteElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        // ion-modal creará <tagName> y nosotros debemos renderizar Svelte ahí.
        // Las props se inyectan más abajo en IonicShowModal usando `el.componentProps`.
        // eslint-disable-next-line no-new
        new component({
          target: this.shadowRoot,
          props: this.componentProps || {},
        });
      }
    }

    customElements.define(tagName, SvelteElement);
  }
};

/* ========= Utilidades privadas ========= */
const isRegistered = (name) =>
  document.createElement(name).constructor !== HTMLElement;

const registerDOMOnce = (selector) => {
  let controller = document.querySelector(selector);
  if (!controller) {
    controller = document.createElement(selector);
    document.body.appendChild(controller);
  }
  return controller;
};

const DefaultIonicController = (selector) => {
  return (options) => {
    const controller = registerDOMOnce(selector);
    return controller.create(options).then((ionicitem) => {
      ionicitem.present();
      return ionicitem; // promesa: permite esperar dismiss, etc.
    });
  };
};

/* ========= API pública ========= */
export const registerWebComponentOnce = (selector, component) => {
  if (!isRegistered(selector)) {
    registerCustomElement(selector, component);
  }
};

export const getIonicNav = () => document.querySelector("ion-nav");

/**
 * Muestra un ion-modal con un componente Svelte.
 * Acepta `modalOptions` nativas de ion-modal (breakpoints, initialBreakpoint,
 * handle, handleBehavior, canDismiss, showBackdrop, etc.).
 *
 * @param {string} selector - nombre del custom element (ej: "modal-checklist")
 * @param {SvelteComponent} component - componente Svelte a renderizar
 * @param {object} componentProps - props para el componente Svelte
 * @param {object} modalOptions - opciones de ion-modal (opcional)
 */
export const IonicShowModal = async (
  selector,
  component,
  componentProps = {},
  modalOptions = {}
) => {
  initialize();
  defineCustomElement();
  registerWebComponentOnce(selector, component);

  const modal = await modalController.create({
    component: selector,
    componentProps, // sigue funcionando para Ionic, pero Svelte leerá `el.componentProps`
    ...modalOptions,
  });

  // Inyecta las props en el elemento Svelte real cuando el modal ya está en el DOM
  modal.addEventListener("ionModalDidPresent", () => {
    const el = modal.querySelector(selector);
    if (el) el.componentProps = componentProps;
  });

  await modal.present();
  return modal.onWillDismiss();
};

export const IonicShowPopover = (event, selector, component, componentProps) => {
  registerWebComponentOnce(selector, component);
  const controller = registerDOMOnce("ion-popover-controller");
  return controller
    .create({
      component: selector,
      event,
      componentProps,
    })
    .then((popover) => {
      popover.present();
      return popover.onWillDismiss();
    });
};

export const IonicShowLoading = DefaultIonicController(
  "ion-loading-controller"
);
export const IonicShowPicker = DefaultIonicController("ion-picker-controller");
export const IonicShowAlert = DefaultIonicController("ion-alert-controller");
export const IonicShowToast = DefaultIonicController("ion-toast-controller");
export const IonicShowActionSheet = DefaultIonicController(
  "ion-action-sheet-controller"
);
