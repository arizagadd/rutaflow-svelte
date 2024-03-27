import { alertController } from '@ionic/core';
import { modalController } from '@ionic/core';
import { defineCustomElement } from "@ionic/core/components/ion-modal.js";
import { initialize } from "@ionic/core/components";

// Your custom register function
export const registerCustomElement = (tagName, component) => {
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
  
          const app = new component({
            target: this.shadowRoot,
            props,
          });
        }
      }
  
      customElements.define(tagName, SvelteElement);
    }
  };
//
// Private functions 
//
// see if webcomponent is already created
const isRegistered = function(name) {
    return document.createElement(name).constructor !== HTMLElement;
};

// add DOM element if it not exists and return to caller
const registerDOMOnce = (selector) => {
    let controller = document.querySelector(selector);
    if (!controller) {
        controller = document.createElement(selector);
        document.body.appendChild(controller);
    }
    return controller;
}

// default pattern for many ionic UI controllers
const DefaultIonicController = (selector) => {
    return (options) => {
        const controller = registerDOMOnce(selector);
        return controller
            .create(options)
            .then(ionicitem => {
                ionicitem.present();
                return ionicitem; // a promise that needs resolution to access dismiss etc.
            });
    };
};


//
// API methods
//
// register webcomponent if not yet done
export const registerWebComponentOnce = (selector, component) => {
    if (!isRegistered(selector)) {
        registerCustomElement(selector, component);
    }
};

export const getIonicNav = () => {
    return document.querySelector("ion-nav");
}

export const IonicShowModal = async (selector, component, componentProps) => {
    initialize();
    defineCustomElement();
    registerWebComponentOnce(selector, component);

    const modal = await modalController
        .create({
            component: selector,
            componentProps,
        });
    modal.present();
    return await modal.onWillDismiss();
};

export const IonicShowPopover = (event, selector, component, componentProps) => {
    registerWebComponentOnce(selector, component);
    const controller = registerDOMOnce("ion-popover-controller");
    return controller
        .create({
            component: selector,
            event,
            componentProps
        })
        .then(popover => {
            popover.present();
            return popover.onWillDismiss();
        });
};

export const IonicShowLoading = DefaultIonicController("ion-loading-controller");
export const IonicShowPicker = DefaultIonicController("ion-picker-controller");
export const IonicShowAlert = DefaultIonicController("ion-alert-controller");
export const IonicShowToast = DefaultIonicController("ion-toast-controller");
export const IonicShowActionSheet = DefaultIonicController("ion-action-sheet-controller");