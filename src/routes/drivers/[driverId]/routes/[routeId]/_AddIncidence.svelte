<script>
  import { alertController } from "@ionic/core";
  import { onMount, tick } from "svelte";
  import { modalController } from "@ionic/core";
  import { DATABASE_URL } from "../../../../../hooks";
  import { getImgsArray, getJson, removeFile } from "$lib";
  import {
    createOutline,
    duplicateOutline,
    trash,
    closeSharp,
  } from "ionicons/icons";

  /*Back URL*/
  let back_url = DATABASE_URL;

  let overlayElement = document.querySelector("ion-modal");
  let routeId = overlayElement.componentProps.routeId;
  let selectedImages = "";
  let files = selectedImages ? getImgsArray(selectedImages) : new Array();
  let comments = "";
  let isLoading = false;
  let dataSession = new Object();
  let showModal = false;
  let currentImage = "";
  let selectedMotive = ""; // accidente | hospital | baño | …
  let motiveCoords = { lat: null, lng: null };
  let mapDiv; // referencia al <div>
  let gMap, gMarker;

  const motives = [
    { id: "car_accident", icon: "/car-accident.svg", label: "Accidente" },
    { id: "hospital", icon: "/hospital.svg", label: "Hospital" },
    { id: "wc", icon: "/toilet.svg", label: "Baño" },
    { id: "restaurant", icon: "/restaurant.svg", label: "Restaurant" },
    { id: "parking", icon: "/parking.svg", label: "Parking" },
  ];

  onMount(() => {
    dataSession = JSON.parse(localStorage.getItem("userSession"));
  });

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

  const handleFileChange = async (event) => {
    if (files.length >= 5) {
      showAlert(
        "Límite de evidencias",
        "Solo se permite subir 5 fotos por parada"
      );
      return;
    }
    isLoading = true; // Show spinner
    const fileInput = event.target;
    const file = fileInput.files[0];
    const compressed_file = await compressImage(file);

    if (compressed_file) {
      var lv = new Object();
      lv.fileToUpload = compressed_file;
      lv.id_user_over = dataSession.id_user;
      lv.token = dataSession.token;

      try {
        getJson(
          `${back_url}api/admin/manager/upload_img_driver.php`,
          function (data) {
            if (data.success) {
              selectedImages = selectedImages
                ? `${selectedImages},${data.img}`
                : data.img;
              files = getImgsArray(selectedImages);
            } else {
              showAlert("Error", "No se pudo subir la imagen");
            }
            isLoading = false;
          },
          lv
        );
      } catch (error) {
        console.error("Error during file upload:", error);
      } finally {
        isLoading = false; // Hide spinner
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

  const closeModal = () => {
    modalController.dismiss();
  };

  const sendIncidence = () => {
    var lv = new Object();
    selectedImages = files.join(",");
    lv.id_route = routeId;
    lv.comments = comments.value;
    lv.lat = motiveCoords.lat;
    lv.lng = motiveCoords.lng;
    lv.type = selectedMotive;
    lv.img = selectedImages;
    lv.id_user_over = dataSession.id_user;
    lv.token = dataSession.token;
    lv.id_driver = dataSession.id_driver;

    if (!selectedMotive || !selectedImages || !lv.comments || !lv.img) {
      showAlert(
        "Datos incompletos",
        "Llena los datos requeridos para completar el registro"
      );
    } else if (!lv.lat || !lv.lng) {
      showAlert(
        "Ubicación no disponible",
        "Por favor, asegúrate de que la ubicación está activada en tu dispositivo."
      );
    } else {
      getJson(
        `${back_url}api/admin/incidence/add_incidence.php`,
        function (data) {
          if (data) {
            showAlert("Éxito", "Incidencia registrada correctamente");
          } else {
            showAlert(
              "Error",
              "No se pudo registrar la incidencia. Por favor, inténtalo de nuevo."
            );
          }
          closeModal();
        },
        lv
      );
    }
  };

  const openImage = (image) => {
    currentImage = image;
    showModal = true;
  };

  const closeImgModal = () => {
    showModal = false;
    currentImage = "";
  };

  async function selectMotive(m) {
    selectedMotive = m;
    isLoading = true; // Show spinner

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          motiveCoords.lat = pos.coords.latitude;
          motiveCoords.lng = pos.coords.longitude;
          await loadMotiveMap(); // pinta / actualiza mapa
        },
        () => console.log("Geolocalización denegada")
      );
    }
  }

  /** Carga Google Maps (una sola vez) y coloca/actualiza pin */
  async function loadMotiveMap() {
    await tick(); // asegura que #motive-map existe
    if (!mapDiv) return;

    const { Map } = await google.maps.importLibrary("maps"); // mapa base
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); // nueva librería

    /* ⬇️ 1. Mapa (se crea una sola vez) */
    if (!gMap) {
      gMap = new Map(mapDiv, {
        zoom: 15,
        center: motiveCoords,
        mapId: "4504f8b37365c3d0",
      });
    } else {
      gMap.setCenter(motiveCoords);
    }

    /* ⬇️ 2. Icono según motivo */
    const motiveObj = motives.find((m) => m.id === selectedMotive);
    if (!motiveObj) return;

    /* ⬇️ 3. Borra pin previo */
    if (gMarker) gMarker.setMap(null);

    /* ⬇️ 4. Contenedor para el pin */
    const pinDiv = document.createElement("div");
    pinDiv.style.cssText = `
      display:flex;align-items:center;justify-content:center;
      width:38px;height:38px;border-radius:50%;
      background:#ffffff;border:2px solid #d13434;
      box-shadow:0 0 4px rgba(0,0,0,.3);
  `;

    const ion = document.createElement("ion-icon");
    ion.setAttribute("icon", motiveObj.icon); // p.e. "warning-outline"
    ion.style.cssText = "font-size:24px;color:#d13434;";
    pinDiv.appendChild(ion);

    /* ⬇️ 5. Pin en el mapa */
    gMarker = new AdvancedMarkerElement({
      map: gMap,
      position: motiveCoords,
      title: motiveObj.label,
      content: pinDiv,
    });
    isLoading = false; // Oculta spinner
  }

  function toRemoveFiles(index = 0) {
    var response = removeFile(index, files, [""], selectedImages);
    files = response.files;
    selectedImages = response.selectedImages;
  }
</script>

<ion-header translucent>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button color="medium" on:click={closeModal}>Cancelar</ion-button>
    </ion-buttons>
    <ion-title title="">AGREGAR INCIDENCIA</ion-title>
    <ion-buttons slot="end">
      <ion-button on:click={sendIncidence} strong>Confirmar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content fullscreen>
  <ion-list>
    <!-- MOTIVO ---------------------------------------------------------->
    <ion-item
      lines="none"
      class="motive-item"
      style="display: grid; justify-content: center; margin-bottom:15px;"
    >
      <!-- Grid de botones -->
      <div
        class="motive-grid"
        style="display: flex;
              gap: 8px;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 6px;"
      >
        {#each motives as m}
          <div class="motive-button">
            <ion-button
              color={selectedMotive === m.id ? "primary" : "medium"}
              fill="clear"
              size="small"
              on:click={() => selectMotive(m.id)}
            >
              <ion-icon slot="icon-only" icon={m.icon} />
            </ion-button>
            <div
              class="motive-caption"
              style="font-size: 11px;
                    margin-top: 2px;
                    text-align: center;
                    line-height: 1.1;"
            >
              {m.label}
            </div>
          </div>
        {/each}
      </div>
    </ion-item>

    <!-- MAPA (solo si hay coordenadas) --------------------------------->
    {#if motiveCoords.lat}
      <div
        id="motive-map"
        bind:this={mapDiv}
        style="height:220px;margin:12px 16px;border-radius:8px;"
      />
    {/if}
    <!-- Concepto ---------------------------------------------------------->
    <ion-item>
      <ion-icon icon={createOutline} slot="start" />
      <ion-textarea
        label="Comentarios"
        bind:this={comments}
        placeholder="Escribe aquí..."
      />
    </ion-item>
    <section>
      <label for="eventEvidence" style="display: block; width: 100%;">
        <ion-button
          fill="outline"
          size="small"
          class="loadEvidence"
          expand="block"
        >
          <label for="eventEvidence" style="width:100%;padding:8px;">
            <ion-icon icon={duplicateOutline} slot="start" />
            Subir Evidencia
          </label>
          <input
            style="display:none;"
            id="eventEvidence"
            name="fileToUpload"
            type="file"
            accept="image/*"
            capture="environment"
            on:change={handleFileChange}
          />
        </ion-button>
      </label>
    </section>
    {#if selectedImages}
      <section>
        <div
          class="image-grid"
          style="display: grid;grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));gap: 10px;padding: 0px 10px;"
        >
          {#each files as file, index}
            <div class="image-container" style="position: relative;">
              <ion-img
                src={file}
                alt="Evidencia fotográfica"
                style="width: 100%;height: 100px; object-fit:cover;cursor: pointer;border: 1px solid #ccc;border-radius: 4px;margin-top: 16px;"
                on:click={() => openImage(file)}
              />
              <button
                class="remove-button"
                on:click={() => toRemoveFiles(index)}
                style="position: absolute;top: 5px;right: 5px;border:none;cursor: pointer;font-size: 18px;background: white;border-radius: 50%;padding: 3px 4px 0px;box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);color: #0000008f;"
              >
                <ion-icon icon={trash} />
              </button>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  </ion-list>
</ion-content>
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

{#if showModal}
  <div
    class="modal-overlay"
    on:click={closeImgModal}
    style="position: fixed;top: 0;left: 0;width: 100vw;height: 100vh; background: rgba(0, 0, 0, 0.8);display: flex;justify-content: center;align-items: center;z-index: 1000;"
  >
    <div
      class="modal-content"
      on:click|stopPropagation
      style="position: relative;background: white;padding: 20px;border-radius: 8px;max-width: 90vw;max-height: 90vh;overflow: auto;"
    >
      <ion-img
        src={currentImage}
        alt="Evidencia fotográfica"
        style="width:100%; height:auto;"
      />
      <button
        class="close-button"
        on:click={closeImgModal}
        style="position: absolute;top: 5px;right: 5px;background: white;color: #444444d1;border: none;cursor: pointer;padding: 2px 2px 0px 6px;border-radius: 50%;font-size: 20px;"
      >
        <ion-icon icon={closeSharp} />
      </button>
    </div>
  </div>
{/if}
