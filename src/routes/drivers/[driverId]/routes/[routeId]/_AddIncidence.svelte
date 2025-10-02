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
  
  // Font Awesome imports - solo los datos
  import { 
    faCarBurst,
    faHospital, 
    faRestroom,
    faUtensils,
    faSquareParking,
    faGasPump,
    faUserSecret,
    faTrafficLight,
    faEllipsis 
  } from '@fortawesome/free-solid-svg-icons';
  
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
  let selectedMotive = "";
  let motiveCoords = { lat: null, lng: null };
  let mapDiv;
  let gMap, gMarker;
  
  const motives = [
    { id: "car_accident", icon: faCarBurst, label: "Accidente", color: "#FFE4E1" },
    { id: "hospital", icon: faHospital, label: "Hospital", color: "#E1F5E1" },
    { id: "wc", icon: faRestroom, label: "Baño", color: "#E1E8FF" },
    { id: "restaurant", icon: faUtensils, label: "Restaurant", color: "#FFE8D1" },
    { id: "parking", icon: faSquareParking, label: "Parking", color: "#F0E1FF" },
    { id: "traffic", icon: faTrafficLight, label: "Tráfico", color: "#FFF9E1" },
    { id: "gas", icon: faGasPump, label: "Gasolina", color: "#FFEAA7" },
    { id: "robbery", icon: faUserSecret, label: "Robo", color: "#FFD1DC" },
    { id: "other", icon: faEllipsis, label: "Otro", color: "#E8E8E8" },
  ];
  
  onMount(() => {
    dataSession = JSON.parse(localStorage.getItem("userSession"));
  });
  
  const showAlert = async (customHeader, customMessage) => {
    const alert = await alertController.create({
      header: customHeader || "Error",
      message: customMessage || "Vuelva a intentar",
      buttons: [{ text: "Cerrar" }],
    });
    await alert.present();
  };
  
  const handleFileChange = async (event) => {
    isLoading = true;
    try {
      if (files.length >= 5) {
        showAlert("Límite de evidencias", "Solo se permite subir 5 fotos por parada");
        return;
      }
      const fileInput = event.target;
      const file = fileInput.files[0];
      const compressed_file = await compressImage(file);
      if (!compressed_file) {
        showAlert("Error", "No se pudo comprimir la imagen");
        return;
      }
      const lv = {
        fileToUpload: compressed_file,
        id_user_over: dataSession.id_user,
        token: dataSession.token,
      };
      const uploadResponse = await new Promise((resolve, reject) => {
        getJson(`${back_url}api/admin/manager/upload_img_driver.php`, (data) => resolve(data), lv);
      });
      if (uploadResponse.success) {
        selectedImages = selectedImages ? `${selectedImages},${uploadResponse.img}` : uploadResponse.img;
        files = getImgsArray(selectedImages);
      } else {
        showAlert("Error", "No se pudo subir la imagen");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      showAlert("Error", "Algo salió mal al subir la imagen.");
    } finally {
      isLoading = false;
    }
  };
  
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
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
        canvas.toBlob(
          (blob) => {
            resolve(blob);
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
    isLoading = true;
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
      isLoading = false;
      showAlert("Datos incompletos", "Llena los datos requeridos para completar el registro");
    } else if (!lv.lat || !lv.lng) {
      isLoading = false;
      showAlert("Ubicación no disponible", "Por favor, asegúrate de que la ubicación está activada en tu dispositivo.");
    } else {
      getJson(
        `${back_url}api/admin/incidence/add_incidence.php`,
        function (data) {
          if (data) {
            isLoading = false;
            showAlert("Éxito", "Incidencia registrada correctamente");
          } else {
            isLoading = false;
            showAlert("Error", "No se pudo registrar la incidencia. Por favor, inténtalo de nuevo.");
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
    isLoading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          motiveCoords.lat = pos.coords.latitude;
          motiveCoords.lng = pos.coords.longitude;
          await loadMotiveMap();
        },
        () => {
          console.log("Geolocalización denegada");
          isLoading = false;
        }
      );
    }
  }
  
  async function loadMotiveMap() {
    await tick();
    if (!mapDiv) return;
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    
    if (!gMap) {
      gMap = new Map(mapDiv, {
        zoom: 15,
        center: motiveCoords,
        mapId: "4504f8b37365c3d0",
      });
    } else {
      gMap.setCenter(motiveCoords);
    }
    
    const motiveObj = motives.find((m) => m.id === selectedMotive);
    if (!motiveObj) return;
    
    if (gMarker) gMarker.setMap(null);
    
    const pinDiv = document.createElement("div");
    pinDiv.style.cssText = `
      display:flex;align-items:center;justify-content:center;
      width:38px;height:38px;border-radius:50%;
      background:#ffffff;border:2px solid #d13434;
      box-shadow:0 0 4px rgba(0,0,0,.3);
    `;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 512 512");
    svg.style.cssText = "color:#d13434;";
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", motiveObj.icon.icon[4]);
    svg.appendChild(path);
    pinDiv.appendChild(svg);
    
    gMarker = new AdvancedMarkerElement({
      map: gMap,
      position: motiveCoords,
      title: motiveObj.label,
      content: pinDiv,
    });
    isLoading = false;
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
    <ion-title>Agregar Incidencia</ion-title>
    <ion-buttons slot="end">
      <ion-button color="primary" on:click={sendIncidence} strong>Confirmar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen>
  <!-- Tipo de Incidencia -->
  <div style="padding: 12px; background: white; margin: 10px; border-radius: 12px;">
    <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Tipo de Incidencia</h3>
    
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      {#each motives as m}
        <div 
          on:click={() => selectMotive(m.id)}
          style="
            width: calc(33.333% - 7px);
            background: white;
            border: {selectedMotive === m.id ? '2px solid #3880ff' : '2px solid #e0e0e0'};
            border-radius: 10px;
            padding: 10px 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            box-sizing: border-box;
            box-shadow: {selectedMotive === m.id ? '0 2px 8px rgba(56, 128, 255, 0.2)' : 'none'};
          "
        >
          <div style="
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background-color: {m.color};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="40" height="20" viewBox="0 0 512 512" style="color: #333;">
              <path fill="currentColor" d={m.icon.icon[4]} />
            </svg>
          </div>
          <span style="font-size: 11px; font-weight: 500; color: #333; text-align: center;">{m.label}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- MAPA -->
  {#if motiveCoords.lat}
    <div id="motive-map" bind:this={mapDiv} style="height:140px; margin:0 10px 10px 10px; border-radius:10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" />
  {/if}

  <!-- Comentarios -->
  <div style="padding: 12px; background: white; margin: 0 10px 10px 10px; border-radius: 12px;">
    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Comentarios</h3>
    <ion-item lines="none" style="--background: #f5f5f5; --border-radius: 10px;">
      <ion-textarea bind:this={comments} placeholder="Describe la incidencia aquí..." rows="2" />
    </ion-item>
  </div>

  <!-- Subir Evidencia -->
  <section style="padding: 0 10px 10px 10px;">
    <label for="eventEvidence" style="display: block; width: 100%;">
      <ion-button
        fill="outline"
        color="primary"
        expand="block"
        style="--border-radius: 10px; height: 40px; font-size: 14px;"
      >
        <label for="eventEvidence" style="width:100%; padding:8px; cursor: pointer;">
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

  <!-- Imágenes -->
  {#if selectedImages}
    <section style="padding: 0 10px;">
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        {#each files as file, index}
          <div style="width: calc(33.333% - 6px); position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; box-sizing: border-box;">
            <ion-img 
              src={file} 
              alt="Evidencia fotográfica" 
              on:click={() => openImage(file)} 
              style="width: 100%; height: 100%; object-fit: cover; border: 1px solid #ddd; cursor: pointer;" 
            />
            <button 
              on:click={() => toRemoveFiles(index)} 
              style="
                position: absolute;
                top: 4px;
                right: 4px;
                width: 24px;
                height: 24px;
                background: rgba(255,255,255,0.95);
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #d13434;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                cursor: pointer;
                font-size: 16px;
              "
            >
              <ion-icon icon={trash} />
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</ion-content>

{#if showModal}
  <div 
    on:click={closeImgModal} 
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    "
  >
    <div 
      on:click|stopPropagation 
      style="
        position: relative;
        background: white;
        padding: 20px;
        border-radius: 12px;
        max-width: 90vw;
        max-height: 90vh;
      "
    >
      <ion-img src={currentImage} alt="Evidencia fotográfica" style="width:100%; height:auto;" />
      <button 
        on:click={closeImgModal} 
        style="
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.95);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        "
      >
        <ion-icon icon={closeSharp} />
      </button>
    </div>
  </div>
{/if}

{#if isLoading}
  <div 
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    "
  >
    <ion-spinner name="dots" style="color:white;" />
  </div>
{/if}