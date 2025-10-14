<script>
  import GasKmModal from "./GasKmModal.svelte";
  import { IonicShowModal } from "../../../../../services/IonicControllers";
  import { modalController } from "@ionic/core";
  import { checklistStore } from "../../../../../stores/checklistStore";
  import { alertController } from "@ionic/core";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { gasKmStore } from "../../../../../stores/gasKmStore";
  import { flagStore } from "../../../../../stores/flagStore";
  import { DATABASE_URL } from "../../../../../hooks";
  import { getJson } from "$lib";

  
  /*Back URL*/
  let back_url = DATABASE_URL;

  let overlayElement;
  let checklist = [];
  let driverId, routeId;
  let isLast = false;

  let km_inicial, gas_inicial, km_final, gas_final;
  let checkk = [];
  let evidenceChecklist = null;
  let checkbox_item = {};
  let KmInicial, GasInicial, KmFinal, GasFinal;
  let loadingStates = {};
  let dataSession = new Object();
  let isLoading = false;

  // checklist trae las img en caso de que existan, declarar selectedImage como objeto
  let selectedImages = {};
  let imagesName = {};

  onMount(() => {
    // Referencia al <ion-modal> contenedor de este componente
    overlayElement = document.querySelector("ion-modal");

    // Leer props del modal
    const props = overlayElement?.componentProps || {};
    checklist = props.checklist || [];
    driverId = props.driverId;
    routeId  = props.routeId;
    isLast   = !!props.isLast;

    // Sesión
    dataSession = JSON.parse(localStorage.getItem("userSession"));

    // Poblar stores cuando no es el último checklist
    if (!isLast) {
      checklistStore.update((store) => {
        store.mandatory = getChecklistArray(checklist, "mandatory");
        store.items = getChecklistArray(checklist, "id_checklist_event");
        return store;
      });
    }

    // ----- Opciones de hoja (sheet) y anclaje al subir -----
    if (overlayElement) {
      // Define breakpoints si el modal fue abierto sin ellos
      overlayElement.breakpoints = [0.25, 0.85, 1.0];   // ahora casi a pantalla completa
      overlayElement.initialBreakpoint = 0.85;          // abre más arriba


      // Asegura que cuando se arrastre hacia arriba, se ancle al tope (0.95)
      const onBpChange = (ev) => {
        const bp = ev.detail?.breakpoint;
        if (bp && bp >= 0.6) {
          // fuerza el tope
          overlayElement.setCurrentBreakpoint(0.95);
        }
      };
      overlayElement.addEventListener("ionBreakpointDidChange", onBpChange);
    }
    // -------------------------------------------------------
  });

  function startLoading(id) {
    loadingStates[id] = true;
  }

  const alertIncompleteChecklist = async () => {
    const alert = await alertController.create({
      header: "Datos o checklist incompletos",
      message:
        "Carga la evidencia requerida y marca todas las casillas para confirmar",
      buttons: [
        {
          text: "Cerrar",
        },
      ],
    });

    await alert.present();
  };

  const showAlert = async (customHeader, customMessage) => {
    const alert = await alertController.create({
      header: customHeader || "Error", // Use customHeader or default value
      message: customMessage || "Vuelva a intentar", // Use customMessage or default value
      buttons: [
        {
          text: "Cerrar",
        },
      ],
    });

    await alert.present();
  };

  const alertInitialValues = async (u) => {
    const alert = await alertController.create({
      header: "Datos inválidos",
      message:
        u == "km"
          ? "Llena correctamente el campo de kilometraje inicial"
          : "Llena correctamente el campo de gasolina inicial",
      buttons: [
        {
          text: "Cerrar",
        },
      ],
    });

    await alert.present();
  };

  function getChecklistArray(obj, type) {
    // Ensure obj is an object or an array and not null
    if ((typeof obj === "object" && obj !== null) || Array.isArray(obj)) {
      // If obj is an array, collect IDs from each object in the array
      if (Array.isArray(obj)) {
        return obj.map((item) => getChecklistArray(item, type)).flat();
      } else {
        // Get the keys (property names) of the object
        const keys = Object.keys(obj);
        let idValues;

        // Filter keys that are likely to be IDs (customize this based on your object structure)
        if (type == "id_checklist_event") {
          const idKeys = keys.filter((key) =>
            key.toLowerCase().includes("id_checklist_event")
          );
          idValues = idKeys.map((key) => obj[key]);
        } else if (type == "mandatory") {
          const mandatoryKeys = keys.filter((key) =>
            key.toLowerCase().includes("mandatory")
          );
          // Extract the values corresponding to the identified ID keys
          idValues = mandatoryKeys.map((key) => obj[key]);
        } else {
          console.error("Tipo de dato no reconocido.");
          idValues = false;
        }

        return idValues;
      }
    } else {
      console.error(
        "Invalid input. Please provide a valid object or array."
      );
      return [];
    }
  }

  const closeOverlay = () => {
    modalController.dismiss();
  };

  const sendEvidence = async () => {
    isLoading = true;

    if (isLast) {
      const fin_km = transformFormatValue(km_final, "km");
      const fin_gas = transformFormatValue(gas_final, "gas");

      const lv = {
        km_final: fin_km,
        gas_final: fin_gas,
        id_route: routeId,
        id_user_over: dataSession.id_user,
        token: dataSession.token,
      };

      if (fin_km && fin_gas) {
        // cerrar modal
        closeOverlay();
        getJson(
          `${back_url}api/admin/checklist/add_evidence.php`,
          function (result) {
            if (result.success) {
              isLoading = false;
              showAlert(
                "Datos capturados",
                "El kilometraje y gasolina final fueron registrados correctamente, espere aprobación para finalizar ruta"
              );
            } else {
              isLoading = false;
              showAlert(
                "Error",
                "Vuelva a intentar capturar los datos solicitados"
              );
            }
          },
          lv
        );
      } else {
        alertIncompleteChecklist();
      }
    } else {
      const ini_km = transformFormatValue(km_inicial, "km");
      const ini_gas = transformFormatValue(gas_inicial, "gas");

      let coords = null;
      try {
        coords = await getCurrentCoords();
      } catch (e) {
        console.warn("GPS no disponible:", e);
      }

      checklistStore.update((store) => {
        const mandatoryVal = store.mandatory;
        const mandatoryItems = store.items.filter(
          (_item, index) => store.mandatory[index] === "1"
        );
        const allMandatoryChecked = mandatoryItems.every((mandatoryItem) =>
          store.checkedIndices.includes(mandatoryItem)
        );

        const hasMandatory =
          Array.isArray(mandatoryVal) && mandatoryVal.some((v) => v === "1");
        const statusAfter =
          hasMandatory && !allMandatoryChecked ? "checklist-pending" : "enroute";

        // ====== BLOQUE UNIFICADO: sólo validamos KM/GAS y enviamos ======
        if (ini_km && ini_gas) {
          let formData = new FormData();
          formData = addAuthData(formData);
          formData.append("km_inicial", ini_km);
          formData.append("gas_inicial", ini_gas);
          formData.append("id_route", routeId);

          if (coords) {
            formData.append("lat", coords.lat);
            formData.append("lng", coords.lng);
          }

          for (const key in selectedImages) {
            if (Object.prototype.hasOwnProperty.call(selectedImages, key)) {
              const { img, img_id } = selectedImages[key];
              formData.append(`selectedImages[${key}][img]`, img);
              formData.append(`selectedImages[${key}][img_id]`, img_id);
            }
          }

          fetch(`${back_url}api/admin/checklist/add_evidence.php`, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then(() => {
              changeRouteStatus(routeId, statusAfter);
              console.log('✅ Evidencia enviada, estado actualizado:', statusAfter);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            })
            .finally(() => {
              isLoading = false;
              closeOverlay();
            });
        } else {
  if (!ini_km || !ini_gas) {
    alertIncompleteChecklist(); // solo si faltan datos de km/gas
  }
        }
        // ================================================================

        return store;
      });
    }

    emptyGasKmStore();
  };

  const handleFileChange = async (event, checklistItemId) => {
    startLoading(checklistItemId);
    const fileInput = event.target;
    const file = fileInput.files[0];
    const compressed_file = await compressImage(file);

    if (compressed_file) {
      let formData = new FormData();
      formData.append("fileToUpload", compressed_file);
      formData = addAuthData(formData);

      try {
        const response = await fetch(
          `${back_url}api/admin/manager/upload_img_driver.php`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          // File uploaded successfully, handle any additional logic
          const result = await response.json();

          selectedImages = {
            ...selectedImages,
            [checklistItemId]: {
              img: result.img, // Store the image URL
              img_id: result.img_id, // Store the image ID
            },
          };
          imagesName = {
            ...imagesName,
            [checklistItemId]: result.filename,
          };

          markCheckbox(checklistItemId);
          checkbox_item[checklistItemId].checked = true;

          // Reset loading state after success
          loadingStates[checklistItemId] = false;
        } else {
          // Handle error response
          console.error("File upload failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error durante la carga del archivo:", error);
      }
    }
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file); // More memory efficient

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob and cleanup
        canvas.toBlob(
          (blob) => {
            resolve(blob);
            // Clean up memory
            URL.revokeObjectURL(img.src);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          },
          "image/jpeg",
          0.7
        );
      };
    });
  };

  const markCheckbox = (id) => {
    checklistStore.update((store) => {
      const existingIndex = store.checkedIndices.indexOf(id);

      if (existingIndex === -1) {
        // The ID is not in the array, add it
        store.checkedIndices.push(id);
      } else {
        // The ID is already in the array, you may want to handle this case
        console.error(`ID ${id} is already checked.`);
      }

      // Mark the corresponding checkbox in the items array
      store.items.forEach((item) => {
        if (item.id_checklist_event === id) {
          item.checked = true;
        }
      });

      return store;
    });
  };

  function changeRouteStatus(id_route, status) {
    let requestData = new FormData();
    requestData.append("id_route", id_route);
    requestData.append("status", status);
    requestData = addAuthData(requestData);
    fetch(`${back_url}api/admin/route/change_status.php`, {
      method: "POST",
      body: requestData,
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function transformFormatValue(value, u) {
    // Check if the value contains only numeric characters
    if (/^\d+$/.test(value)) {
      // Convert the string value to an integer
      const intValue = parseInt(value, 10);
      return intValue;
    } else {
      // If the value contains non-numeric characters, return null or handle the error accordingly
      alertInitialValues(u);
      return null;
    }
  }

  function handleKmGasData(e, r) {
    updateFlagStore(r);
    if (!overlayElement) overlayElement = document.querySelector("ion-modal");
    if (overlayElement) overlayElement.componentProps.data_type = r;

    IonicShowModal(
      "modal-gas-km",
      GasKmModal,
      { r },
      {
        breakpoints: [0.25, 0.85, 1.0],  // 85% y luego fullscreen
        initialBreakpoint: 0.85,          // <- antes 0.6
        backdropBreakpoint: 0.25,
        handle: true,
        handleBehavior: "cycle",
        canDismiss: true,
        showBackdrop: true
      }
    ).then(() => {
      gasKmStore.subscribe((result) => setButtonTxt(result, r));
    });
  }

  function updateFlagStore(type) {
    flagStore.update((store) => ({
      ...store,
      flag: [type],
    }));
  }

  function setButtonTxt(obj, r) {
    km_inicial = obj.km_inicial ? obj.km_inicial : null;
    gas_inicial = obj.gas_inicial ? obj.gas_inicial : null;
    km_final = obj.km_final ? obj.km_final : null;
    gas_final = obj.gas_final ? obj.gas_final : null;
    r == "km_inicial" && KmInicial ? (KmInicial.checked = true) : "";
    r == "gas_inicial" && GasInicial ? (GasInicial.checked = true) : "";
    r == "km_final" && KmFinal ? (KmFinal.checked = true) : "";
    r == "gas_final" && GasFinal ? (GasFinal.checked = true) : "";
    let checkbox;
  }

  function emptyGasKmStore() {
    gasKmStore.set({
      km_inicial: [],
      gas_inicial: [],
      km_final: [],
      gas_final: [],
    });
  }

  function addAuthData(requestData) {
    requestData.append("token", dataSession.token);
    requestData.append("id_user_over", dataSession.id_user);

    return requestData;
  }

  function getCurrentCoords() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("Geoloc no soportada");

      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: +pos.coords.latitude.toFixed(6),
            lng: +pos.coords.longitude.toFixed(6),
          }),
        (err) => reject(err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 8000 }
      );
    });
  }
</script>

<ion-header translucent>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button color="medium" on:click={closeOverlay}
        >Cancelar</ion-button
      >
    </ion-buttons>
    <ion-title>REQUERIMIENTOS DE RUTA</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen>
  <ion-list>
    {#if isLast}
      <ion-item>
        <ion-label style="display:flex;">
          <input
            id={`chkbox-km-fin`}
            style="pointer-events: auto;"
            type="checkbox"
            bind:group={checkk}
            bind:this={KmFinal}
            required
          />
          <p style="margin-left:10px;">Kilometraje final</p>
        </ion-label>
        <ion-button
          fill="outline"
          size="small"
          class="loadKmInicial"
          on:click={(e) => handleKmGasData(e, "km_final")}
          aria-selected
        >
          {km_final ? km_final + " km." : "Cargar km"}
        </ion-button>
      </ion-item>
      <ion-item>
        <ion-label style="display:flex;">
          <input
            id={`chkbox-gas-fin`}
            style="pointer-events: auto;"
            type="checkbox"
            bind:group={checkk}
            bind:this={GasFinal}
            required
          />
          <p style="margin-left:10px;">Gasolina final (litros)</p>
        </ion-label>
        <ion-button
          fill="outline"
          size="small"
          class="loadGasInicial"
          on:click={(e) => handleKmGasData(e, "gas_final")}
        >
          {gas_final ? gas_final + " litros" : "Cargar gas"}
        </ion-button>
      </ion-item>
    {:else}
      <ion-item>
        <ion-label style="display:flex;">
          <input
            id={`chkbox-km-ini`}
            style="pointer-events: auto;"
            type="checkbox"
            bind:group={checkk}
            bind:this={KmInicial}
            required
          />
          <p style="margin-left:10px;">Kilometraje inicial</p>
        </ion-label>
        <ion-button
          fill="outline"
          size="small"
          class="loadKmInicial"
          on:click={(e) => handleKmGasData(e, "km_inicial")}
          aria-selected
        >
          {km_inicial ? km_inicial + " km." : "Cargar km"}
        </ion-button>
      </ion-item>
      <ion-item>
        <ion-label style="display:flex;">
          <input
            id={`chkbox-gas-ini`}
            style="pointer-events: auto;"
            type="checkbox"
            bind:this={GasInicial}
            bind:group={checkk}
            required
          />
          <p style="margin-left:10px;">Gasolina inicial (litros)</p>
        </ion-label>
        <ion-button
          fill="outline"
          class="loadGasInicial"
          size="small"
          on:click={(e) => handleKmGasData(e, "gas_inicial")}
          style="height: 16px "
        >
          {gas_inicial ? gas_inicial + " litros" : "Cargar gas"}
        </ion-button>
      </ion-item>
    {/if}

    {#if checklist}
      {#each checklist as check (check.id_checklist_event)}
        <ion-item>
          <ion-label style="display:flex;">
            <input
              id={`chkbox-${check.id_checklist_event}`}
              style="pointer-events: auto;"
              type="checkbox"
              value={check.id_checklist_event}
              bind:group={checkk}
              bind:this={checkbox_item[check.id_checklist_event]}
              on:change={() => markCheckbox(check.id_checklist_event)}
              required
            />
            <p style="margin-left:10px;">{check.item}</p>
            <b style="margin-left:5px;">
              {check.mandatory == "1" ? " * " : ""}
            </b>
          </ion-label>
          <ion-button
            fill="outline"
            class="loadEvidence"
            size="small"
          >
            <div class="button-content">
              {#if loadingStates[check.id_checklist_event]}
                <ion-spinner
                  name="dots"
                  class="button-spinner"
                />
              {:else}
                <label
                  for="chklist-{check.id_checklist_event}"
                  class="button-label"
                >
                  {imagesName[check.id_checklist_event]
                    ? imagesName[check.id_checklist_event]
                    : "Cargar evidencia"}
                </label>
              {/if}
              <input
                style="display:none;"
                id="chklist-{check.id_checklist_event}"
                name="fileToUpload"
                type="file"
                bind:this={evidenceChecklist}
                accept="image/*"
                capture="environment"
                on:change={(e) =>
                  handleFileChange(
                    e,
                    check.id_checklist_event
                  )}
              />
            </div>
          </ion-button>
        </ion-item>
      {/each}
    {/if}
  </ion-list>
</ion-content>

<!-- Footer clásico (sin slot) para el botón fijo -->
<ion-footer>
  <ion-button
    fill="outline"
    color="tertiary"
    on:click={sendEvidence}
    strong
    style="width: 99%; height: auto; margin-bottom: 120px;"
  >
    Confirmar
  </ion-button>
</ion-footer>

{#if isLoading}
  <div
    class="overlay"
    style="position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;"
  >
    <ion-spinner name="dots" style="color:white;" />
  </div>
{/if}
