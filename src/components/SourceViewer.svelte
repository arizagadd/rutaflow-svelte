<script>
  import { Plugins } from "@capacitor/core";
  import { fromFetch } from "rxjs/fetch";
  import {
    IonicShowToast,
    IonicShowLoading
  } from "../services/IonicControllers";

  const { Clipboard } = Plugins;
  const { componentProps } = document.querySelector("ion-modal");

  let apiURL = "";
  let REPLlink;
  let APIlink;

  // probably can be done in easier way, but I am lazy
  let name = "/";
  if (componentProps.name) {
    name = componentProps.name;
  }

  // generate the name to source file
  name = name.replace("ionic/", "");
  name = name.substr(1);
  name = name.charAt(0).toUpperCase() + name.slice(1);
  if (name.length == 0) {
    name = "Splash";
  }
  if (name.toLowerCase().includes("tabs")) {
    name = "tabs";
  }

  console.log("Name", name);

  const closeOverlay = () => {
    const modal = document.querySelector("ion-modal");
    modal.dismiss({});
  };

  // cannot use function as Safari request window.open to be called in on:click
  // therefor, preload the links
  fromFetch("/assets/json/repls.json").subscribe(response => {
    response.json().then(json => {
      const url = json[name.toLowerCase()];
      if (url) {
        REPLlink = url;
      } else {
        REPLlink = "";
      }
    });
  });

  const showNoREPLToast = () => {
    IonicShowToast({
      color: "danger",
      duration: 2000,
      message: "No REPL link configured",
      showCloseButton: true
    });
  };

  // try to generate the url to the api docs
  let apiName = name.toLowerCase();
  if (apiName.charAt(apiName.length - 1) == "s") {
    apiName = apiName.slice(0, -1);
  }
  console.log("Raw APINAME", apiName);

  // do a mapping for some exceptions
  // using RXJS just for fun
  apiName = apiName.replace("/", "");
  fromFetch("/assets/json/api-mappings.json").subscribe(
    response => {
      response.json().then(json => {
        let url = "https://ionicframework.com/docs/api/";
        if (json[apiName]) {
          url += json[apiName];
          if (json[apiName].toLowerCase().substring(0, 4) == "http") {
            url = json[apiName];
          }
        } else {
          url += apiName;
        }
        APIlink = url;
      });
    },
    error => {
      console.error("Error HTTP", error);
    }
  );

  // using RXJS just for fun
  console.log("Path to source ", "/assets/src/" + name + ".svelte");
  let sourceCode = "Loading....";
  if (name == "tabs") {
    name = "tabs/[tab]";
  }
  fromFetch("/assets/src/" + name + ".svelte").subscribe(response => {
    response.text().then(txt => {
      if (txt.search("<!DOCTYPE html>") > -1) {
        sourceCode = `No svelte file found for ${name}. Please check github repo.`;
      } else {
        sourceCode = txt;
      }
    });
  });

  // somehow does not fly on iOS?
  const copySource = () => {
    Clipboard.write({
      string: sourceCode
    })
      .then(() => {
        IonicShowToast({
          color: "dark",
          duration: 2000,
          message: "Copied...",
          showCloseButton: true
        });
      })
      .catch(message => {
        IonicShowToast({
          color: "danger",
          duration: 2000,
          message,
          showCloseButton: true
        });
      });

    setTimeout(closeOverlay, 1000);
  };
</script>

<style>
  pre {
    -webkit-user-select: all; /* Chrome 49+ */
    -moz-user-select: all; /* Firefox 43+ */
    -ms-user-select: all; /* No support yet */
    user-select: all; /* Likely future */
  }
</style>

<svelte:head>
  <title>Sourceviewer {name}</title>
</svelte:head>
<ion-header translucent>
  <ion-toolbar>
    <ion-buttons slot="end">
      <ion-button
        on:click={() => {
          if (REPLlink.length > 1) {
            window.open(REPLlink, '_blank');
          } else {
            showNoREPLToast();
          }
        }}>
        REPL
      </ion-button>

      <ion-button
        on:click={() => {
          window.open(APIlink, '_blank');
        }}>
        API
      </ion-button>

      {#if sourceCode.length > 11}
        <ion-button on:click={copySource}>COPY</ion-button>
      {/if}
      <ion-button on:click={closeOverlay}>
        <ion-icon name="close" />
      </ion-button>
    </ion-buttons>

  </ion-toolbar>
</ion-header>

<ion-content padding scroll-x="true">
  <pre>{sourceCode}</pre>
</ion-content>
