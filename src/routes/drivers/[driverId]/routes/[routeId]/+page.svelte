<script lang="ts">
    export let routeId;
    export let driverId;
    import DeliveryInfo from "./_DeliveryInfo.svelte";
    import IonPage from "ionic-svelte/components/IonPage.svelte";
    import ChecklistControl from "./_ChecklistControl.svelte";
    import AddExpense from "./_AddExpense.svelte";
    import AddIncidence from "./_AddIncidence.svelte";
    import ExpenseDetails from "./_ExpenseDetails.svelte";
    import { onMount, tick } from "svelte";
    import { IonicShowModal } from "../../../../../services/IonicControllers";
    import { alertController } from "@ionic/core";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import {
        locationOutline,
        cashOutline,
        warningOutline,
    } from "ionicons/icons";
    import { arrowBack } from "ionicons/icons";
    import { DATABASE_URL } from "../../../../../hooks";
    import { hexToRGBA } from "$lib";
    

    
    /*Back URL*/
    let back_url = DATABASE_URL;

    let dataSession = new Object();
    let loading = true;
    let showChecklist = false;
    let deliveries:any[] = [];
    let incidences:any[] = [];
    let stats:any = {};
    let checklist:any[] = [];
    let expenses:any[] = [];
    let refresher:any;
    let isModalOpen = false;
    let segmentValue = "list"; // Controls the tab selection
    let mapElement: HTMLElement | null;
    let stopsApproval = "";
    let smsActive = "";
    let signatureActive = "";
    let orderRestriction = "0";
    let settings = new Object();
    let deliveryInfoModalPromise: Promise<any> | "" = "";
    let isLoading = false;
    let showStartButton = false; // mostrará el botón tras "Previsualizar"
    let routeStarted = false; // NUEVO: para controlar el cambio de color


    // NUEVO: para no repetir la advertencia cada vez
    let checklistWarnShown = false;
    let alertInProgress = false; // para evitar múltiples alerts

    const motiveIconName:any = {
        car_accident: "/car-accident.svg",
        restaurant: "/restaurant.svg",
        parking: "/parking.svg",
        hospital: "/hospital.svg", // svg externo
        wc: "/toilet.svg", // svg externo
        traffic: "/traffic.svg", // svg externo
    };

    const refresh = async () => {
        // Resetear la advertencia al refrescar para que pueda aparecer de nuevo
        checklistWarnShown = false;
        await loadRoute(routeId);
        refresher.complete();
    };

    onMount(async () => {
        // Resetear la advertencia al cargar la página
        checklistWarnShown = false;
        checkSettings();
        await loadRoute(routeId);
    });

    $: {
        ({ routeId, driverId } = $page.params);
        // Resetear la advertencia cuando cambian los parámetros
        checklistWarnShown = false;
        dataSession = JSON.parse(localStorage.getItem("userSession"));
        if (dataSession) {
            if (
                dataSession.id_user &&
                (dataSession.type == "admin" || dataSession.type == "super")
            ) {
                loadRoute(routeId);
                goto(`/drivers/me/routes/${routeId}`);
            } else if (dataSession.id_user && dataSession.id_driver) {
                loadRoute(routeId);
                goto(`/drivers/${dataSession.id_driver}/routes/${routeId}`);
            }
        } else {
            goto("/");
        }
    }

    // ✅ Por estas dos funciones
function hasMandatoryChecklistIncomplete() {
  const mandatory = (checklist || []).filter((i:any) => i.mandatory === "1");
  if (!mandatory.length) return false;
  return !mandatory.every((i:any) => !!i.img);
}

function needsChecklistOrKmGas() {
  // km/gas pendientes (lo mismo que tu flag showChecklist)
  const kmGasMissing =
    showChecklist ||
    stats?.km_inicial === "0" ||
    stats?.gas_inicial === "0";

  // checklist obligatorio incompleto
  const mandatoryIncomplete = hasMandatoryChecklistIncomplete();

  const result = kmGasMissing || mandatoryIncomplete;
  
  console.log('🔍 needsChecklistOrKmGas:', {
    showChecklist,
    km_inicial: stats?.km_inicial,
    gas_inicial: stats?.gas_inicial,
    kmGasMissing,
    mandatoryIncomplete,
    result,
    checklist: checklist?.length,
    mandatoryItems: checklist?.filter((i:any) => i.mandatory === "1")?.length,
    completedMandatory: checklist?.filter((i:any) => i.mandatory === "1" && i.img)?.length
  });

  return result;
}

// ➕ NUEVO: true = puede editar, false = SOLO LECTURA
function canEditStops() {
  return !needsChecklistOrKmGas();
}

// 🔁 Reemplaza COMPLETA la función maybeWarnChecklist por esta
async function maybeWarnChecklist(): Promise<boolean> {
  console.log('🔍 maybeWarnChecklist called:', {
    checklistWarnShown,
    needsChecklist: needsChecklistOrKmGas(),
    alertInProgress,
    showChecklist,
    km_inicial: stats?.km_inicial,
    gas_inicial: stats?.gas_inicial,
    checklist: checklist?.length
  });
  
  // Si ya no necesita checklist, permitir continuar
  if (!needsChecklistOrKmGas()) {
    console.log('✅ Checklist completado, permitiendo continuar...');
    return true;
  }
  
  // evitar múltiples alerts
  if (alertInProgress) {
    console.log('⏳ Alert en progreso, continuando...');
    return true;
  }

  console.log('🚨 Mostrando advertencia del checklist...');
  alertInProgress = true;

  return new Promise((resolve) => {
    alertController.create({
      header: "Checklist",
      message: "Favor de completar checklist para iniciar viaje ✅",
      buttons: [
        {
          text: "Previsualizar",
          handler: () => {
            checklistWarnShown = true;
            showStartButton = true;
            alertInProgress = false;
            resolve(true); // continuar
          },
        },
        {
          text: "Completar",
          handler: () => {
            checklistWarnShown = true;
            alertInProgress = false;
            showChecklistModal(checklist, driverId, routeId);
            resolve(false); // NO continuar
          },
        },
      ],
    }).then(alert => {
      alert.present();
    }).catch(error => {
      console.error('Error en maybeWarnChecklist:', error);
      alertInProgress = false;
      resolve(true); // continuar en caso de error
    });
  });
}

    async function setSegmentValue(value) {
  // advertencia (solo una vez) y aborta si eligen abrir el checklist
  const proceed = await maybeWarnChecklist();
  if (!proceed) return;

        segmentValue = value;

        if (segmentValue === "map") {
            await tick();

            mapElement = document.getElementById("g_map");
            const map = new google.maps.Map(mapElement as HTMLElement, {
                zoom: 8,
                center: { lat: 20.6745683, lng: -103.3986104 },
                mapId: "4504f8b37365c3d0",
            });
            const bounds = new google.maps.LatLngBounds();
            const { AdvancedMarkerElement, PinElement } =
                await google.maps.importLibrary("marker");
            // Get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        const userLatLng = new google.maps.LatLng(
                            position.coords.latitude,
                            position.coords.longitude
                        );

                        // Add a blue dot to indicate the user's location
                        new google.maps.Marker({
                            position: userLatLng,
                            map: map,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                fillColor: "#0062ff",
                                fillOpacity: 1.0,
                                scale: 6, // Adjust size as needed
                                strokeColor: "#ffffff",
                                strokeWeight: 2,
                            },
                        });

                        // Optional: Draw an accuracy circle around the user's location
                        new google.maps.Circle({
                            strokeColor: "#00BFFF",
                            strokeOpacity: 0.5,
                            strokeWeight: 1,
                            fillColor: "#00BFFF",
                            fillOpacity: 0.2,
                            map: map,
                            center: userLatLng,
                            radius: position.coords.accuracy, // Radius is based on accuracy of location
                        });

                        // Extend the map bounds to include the user's location
                        bounds.extend(userLatLng);
                    },
                    function (error) {
                        console.error("Error retrieving location:", error);
                    }
                );
            } else {
                console.error("Geolocation not supported by this browser.");
            }
            if (stats.lat1 === stats.lat2 && stats.lon1 === stats.lon2) {
                createMarker(
                    bounds,
                    map,
                    {
                        lat: stats.lat2,
                        lon: stats.lon2,
                        color: stats.color,
                        title: stats.destination,
                    },
                    {
                        type: "icon",
                        iconClass: "icon-home",
                        title: "Origen/Destino",
                        glyph: `0,${String(deliveries.length + 1)}`,
                    }
                );
            } else {
                //For origin marker
                createMarker(
                    bounds,
                    map,
                    {
                        lat: stats.lat1,
                        lon: stats.lon1,
                        color: stats.color,
                        title: stats.origin,
                    },
                    {
                        type: "icon",
                        iconClass: "icon-home",
                        title: "Origen",
                        glyph: "0",
                    }
                );
                //For destination marker
                createMarker(
                    bounds,
                    map,
                    {
                        lat: stats.lat2,
                        lon: stats.lon2,
                        color: stats.color,
                        title: stats.destination,
                    },
                    {
                        type: "icon",
                        iconClass: "icon-flag",
                        title: "Destino",
                        glyph: String(deliveries.length + 1),
                    }
                );
            }

            // Adding markers for stops/events
            deliveries.forEach((delivery:any) => {
                const lat = parseFloat(delivery.lat);
                const lon = parseFloat(delivery.lon);
                const waypointLatLng = new google.maps.LatLng(lat, lon);

                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lon },
                    map: map,
                    title: delivery.title,
                });

                // Change the background color.
                const pin = new PinElement({
                    background: getDeliveryColor(
                        delivery.status,
                        delivery.date_service
                    ),
                    borderColor: "#000",
                    glyphColor: "#000",
                    glyph: (parseInt(delivery.pos) + 1).toString(),
                });

                const waypointMarker = new AdvancedMarkerElement({
                    map: map,
                    position: waypointLatLng,
                    content: pin.element,
                    title:
                        "Parada " +
                        (parseInt(delivery.pos) + 1).toString() +
                        ": " +
                        delivery.title,
                });

                waypointMarker.addListener("click", async function () {
                    const proceed = await maybeWarnChecklist();
                    if (proceed) {
                        showDeliveryInfoModal(delivery, false);
                    }
                });

                bounds.extend(marker.getPosition()!);
            });

            incidences.forEach((inc:any) => {
                const lat = +inc.lat,
                    lng = +inc.lng;
                if (isNaN(lat) || isNaN(lng)) return;

                const iconName = motiveIconName[inc.type] || "alert-sharp";

                /* contenedor para el pin */
                const wrapper = document.createElement("div");
                wrapper.style.cssText =
                    "display:flex;align-items:center;justify-content:center;" +
                    "transform:scale(.85);";

                const ion = document.createElement("ion-icon");

                /* Ionicon integrado o svg externo */
                if (iconName.startsWith("/")) {
                    ion.setAttribute("src", iconName); // hospital.svg, toilet.svg
                } else {
                    ion.setAttribute("icon", iconName); // warning-sharp, etc.
                }
                ion.style.cssText = "font-size:20px;color:#d13434;";
                wrapper.appendChild(ion);

                /* Pin rojo para incidencias */
                const pin = new PinElement({
                    background: "#fff",
                    borderColor: "#000",
                    glyph: wrapper,
                });

                const marker = new AdvancedMarkerElement({
                    map,
                    position: { lat, lng: lng },
                    content: pin.element,
                    title: inc.motive || inc.type,
                });

                bounds.extend(marker.position!);
            });

            // Adjust map to fit all markers
            map.fitBounds(bounds);
        }
    }

    async function createMarker(bounds:any, map:any, obj:any, contentConfig:any) {
        let contentElement;
        const lat = parseFloat(obj.lat);
        const lon = parseFloat(obj.lon);
        const waypointLatLng = new google.maps.LatLng(lat, lon);
        const { AdvancedMarkerElement, PinElement } =
            await google.maps.importLibrary("marker");

        if (contentConfig.type == "icon") {
            contentElement = document.createElement("i");
            contentElement.className = `${contentConfig.iconClass} icon`; // Add your icon class
            contentElement.style.fontSize = "14px"; // Adjust size as needed
            contentElement.style.color = getContrast(obj.color); // Set color dynamically
            contentElement.style.fontWeight = "600";
        } else if (contentConfig.type == "text") {
            //En caso de querer markers con texto en el futuro
        }

        const marker = new google.maps.Marker({
            position: { lat: lat, lng: lon },
            map: map,
            title: `${contentConfig.title}. ${obj.title}`,
        });

        // Change the background color.
        const pin = new PinElement({
            background: obj.color,
            borderColor: "#000",
            glyphColor: getContrast(obj.color),
            glyph: contentConfig.glyph,
        });

        const waypointMarker = new AdvancedMarkerElement({
            map: map,
            position: waypointLatLng,
            content: pin.element,
            title: contentConfig.title + ": " + obj.title,
        });

        waypointMarker.addListener("click", async function () {
            const proceed = await maybeWarnChecklist();
            if (proceed) {
                showOrigenDestinyModal(
                    stats,
                    contentConfig.title == "Destino" ||
                        contentConfig.title == "Origen/Destino"
                );
            }
        });

        return marker;
    }

    async function loadRoute(routeId) {
        let requestData = new FormData();
        requestData.append("id_route", routeId);
        requestData = addAuthData(requestData);
        requestData.append("id_enterprise", (dataSession as any).id_enterprise);
        try {
            const response = await fetch(
                `${back_url}api/admin/report/seguimiento_list.php`,
                {
                    method: "POST",
                    body: requestData,
                }
            );
            const data = await response.json();

            stats = data.data.seguimiento_list[0];
            deliveries = data.data.event_list;
            checklist = data.data.checklist;
            expenses = data.data.expenses;
            incidences = data.data.incidence_list;
            if (stats) {
                showChecklist =
                    stats.km_inicial == "0" && stats.gas_inicial == "0";
            }

            // NUEVO: Mostrar botón automáticamente si hay checklist pendiente
            if (needsChecklistOrKmGas()) {
                showStartButton = true;
            }
            // No ocultar el botón después de completar el checklist - mantenerlo visible

            // Advertir si faltan km/gas o checklist obligatorio (solo una vez)
            if (!checklistWarnShown && needsChecklistOrKmGas() && hasMandatoryChecklistIncomplete()) {
              await maybeWarnChecklist();
            }

            loading = false; // Data loading complete
        } catch (error) {
            loading = false; // Data loading complete
            console.error("Error fetching data:", error);
        }
    }

    function getDeliveryColor(status:string, service_time = "") {
        let color = "#ffffff";
        if (status === "pending" && !service_time) {
            color = "#f2e300";
        } else if (status == "pending" && service_time) {
            color = "#F6A833";
        } else if (status === "completed") {
            color = "#44d900";
        }

        return color;
    }
    function getStatusTitle(status:string) {
        let state = "";
        if (status == "pending") {
            state = "Pendiente";
        } else if (status == "completed") {
            state = "Completado";
        }
        return state;
    }
    function getContrast(hexColor:string) {
        if (!hexColor) return "#414040";
        if (hexColor.slice(0, 1) === "#") {
            hexColor = hexColor.slice(1);
        }
        if (hexColor.length === 3) {
            hexColor = hexColor
                .split("")
                .map(function (hex) {
                    return hex + hex;
                })
                .join("");
        }
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "#414040" : "#fff";
    }

    const refresh_event_info = (delivery:any) => {
        return new Promise((resolve, reject) => {
            let requestData = new FormData();
            requestData.append("id_route", delivery.id_route);
            requestData.append("id_event", delivery.id_event);
            requestData = addAuthData(requestData);
            fetch(`${back_url}api/admin/evidence/evidence_by_event.php`, {
                method: "POST",
                body: requestData,
            })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.data.event_evidence[0]);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    reject(error);
                });
        });
    };

    function showDeliveryInfoModal(delivery:any, isLast:boolean, readOnly?: boolean) {
  // readOnly por default depende del estado del checklist/KM-Gas
  const isReadOnly = typeof readOnly === "boolean" ? readOnly : !canEditStops();

  if (deliveryInfoModalPromise) return deliveryInfoModalPromise;

  deliveryInfoModalPromise = (async () => {
    let evidenceData = null;
    try {
      evidenceData = await refresh_event_info(delivery);
    } catch (_) {}

    const payload = {
      ...delivery,
      stopsApproval,
      smsActive,
      signatureActive,
      ...(evidenceData || {}),
    };

    try {
      await IonicShowModal("modal-delivery-info", DeliveryInfo, {
        delivery: payload,
        isLast,
        // 👇 PASA EL MODO LECTURA AL MODAL
        readOnly: isReadOnly,
        // 👇 PASA LA FUNCIÓN DE ADVERTENCIA
        maybeWarnChecklist,
      });
    } finally {
      deliveryInfoModalPromise = null;
      loadRoute(routeId);
    }
  })();

  return deliveryInfoModalPromise;
}


    const showOrigenDestinyModal = (stats:any, isLast:boolean) => {
  let delivery:any = {};

  if (isLast) {
    delivery = {
      title: stats.destination,
      line1: stats.dest_address,
    };
  } else {
    delivery = {
      title: stats.origin,
      line1: stats.origin_address,
    };
  }
  delivery.enterprise_name = stats.enterprise_name;
  delivery.client_name = stats.client_name;
  delivery.client_phone = stats.tel;
  delivery.id_route = stats.id_route;
  delivery.stopsApproval = stopsApproval;
  delivery.smsActive = smsActive;

  const flag = true;

  IonicShowModal("modal-delivery-info", DeliveryInfo, {
    delivery,
    isLast,
    flag,
    // 👇 Solo lectura si falta checklist obligatorio o KM/Gas inicial
    readOnly: !canEditStops(),
    // 👇 PASA LA FUNCIÓN DE ADVERTENCIA
    maybeWarnChecklist,
  });
};


    const showChecklistModal = (checklist:any[], driverId:string, routeId:string) => {
      // NUEVO: Si ya se presionó el botón (routeStarted), no abrir el modal
      if (routeStarted) {
        return "";
      }

      const isLast = false;
      isLoading = true;
      if (!isModalOpen) {
        isModalOpen = true;
        IonicShowModal(
          "modal-checklist",
          ChecklistControl,
          { checklist, driverId, routeId, isLast },
          {
            breakpoints: [0.25, 0.5, 0.9],
            initialBreakpoint: 0.75,
            backdropBreakpoint: 0.25,
            handle: true,
            handleBehavior: "cycle",
            canDismiss: true,
            showBackdrop: true
          }
        ).then(async () => {
          isLoading = false;
          isModalOpen = false;
          routeStarted = true; // NUEVO: cambiar a verde después de presionar
          // al cerrar el modal, refrescamos por si se completó algo
          await loadRoute(routeId);
          // Resetear la advertencia para que pueda aparecer de nuevo si es necesario
          checklistWarnShown = false;
          console.log('🔄 Modal cerrado, data refrescada, warnings reseteados');
        });
        // (opcional) changeRouteStatus(routeId, "checklist");
      }
      return "";
    };

    const showExpenseModal = async (routeId:string) => {
        isLoading = true;
        await loadRoute(routeId);
        if (expenses.length > 0) {
            IonicShowModal("modal-expense-detail", ExpenseDetails, {
                routeId,
                expenses,
            }).then(() => {
                isLoading = false;
            });
        } else {
            IonicShowModal("modal-expense", AddExpense, {
                routeId,
            }).then(() => {
                isLoading = false;
            });
        }
        return "";
    };

    const showIncidenceModal = async (routeId:string) => {
        isLoading = true;
        await loadRoute(routeId);
        IonicShowModal("modal-incidence", AddIncidence, {
            routeId,
        }).then(() => {
            isLoading = false;
        });
        return "";
    };

    const mustCharge = (delivery:any) => {
        if (delivery.tracking_type == "subscription") {
            if (delivery.subscriber_info && delivery.payment_type === "cash") {
                let date = new Date(delivery.subscriber_info.payment_next);

                if (date < new Date()) {
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

    function changeRouteStatus(id_route:string, status:string) {
        let requestData = new FormData();
        requestData.append("id_route", id_route);
        requestData.append("status", status);
        requestData = addAuthData(requestData);
        fetch(`${back_url}api/admin/route/change_status.php`, {
            method: "POST",
            body: requestData,
        })
            .then((response) => response.json())
            .then(() => {})
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        return "";
    }

    const goBack = () => {
        if ((dataSession as any).type == "super" || (dataSession as any).type == "admin") {
            goto(`/drivers/me`);
        } else if ((dataSession as any).id_driver) {
            goto(`/drivers/${(dataSession as any).id_driver}`);
        }
    };

    const showAlert = async (customHeader?:string, customMessage?:string) => {
        const alert = await alertController.create({
            header: customHeader || "Error",
            message: customMessage || "Vuelva a intentar",
            buttons: [{ text: "Cerrar" }],
        });
        await alert.present();
    };

    function addAuthData(requestData:FormData) {
        requestData.append("token", (dataSession as any).token);
        requestData.append("id_user_over", (dataSession as any).id_user);
        return requestData;
    }

    const checkSettings = async () => {
        if ((dataSession as any).id_enterprise) {
            let formData = new FormData();
            formData.append("id_enterprise", (dataSession as any).id_enterprise);
            formData = addAuthData(formData);
            try {
                const response = await fetch(
                    `${back_url}api/admin/enterprise/enterprise_settings.php`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    settings = result.nodos;

                    stopsApproval = getSettingVal(
                        "stops_wait_approval",
                        settings as any
                    );
                    smsActive = getSettingVal("sms_active", settings as any);
                    orderRestriction = getSettingVal(
                        "stops_order_restriction",
                        settings as any
                    );
                    signatureActive = getSettingVal(
                        "signature_active",
                        settings as any
                    );
                } else {
                    console.error("File upload failed:", response.statusText);
                }
            } catch (error) {
                console.error("Error during file upload:", error);
            }
        }
    };

    function getSettingVal(alias:string, settings:any[]) {
        for (let i = 0; i < settings.length; i++) {
            if (settings[i].alias === alias) {
                return settings[i].val;
            }
        }
        return "";
    }
</script>

<svelte:head>
    <title>Rutaflow - Detalles de ruta</title>
</svelte:head>

{#if dataSession}
    <IonPage>
        <ion-header translucent>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button title="Atrás" alt="Atrás" on:click={goBack}
                        ><ion-icon icon={arrowBack} /></ion-button
                    >
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button on:click={async () => {
                        const proceed = await maybeWarnChecklist();
                        if (proceed) {
                            showIncidenceModal(routeId);
                        }
                    }}
                        ><ion-icon icon={warningOutline} /></ion-button
                    >
                    <ion-button on:click={async () => {
                        const proceed = await maybeWarnChecklist();
                        if (proceed) {
                            showExpenseModal(routeId);
                        }
                    }}
                        ><ion-icon icon={cashOutline} /></ion-button
                    >
                </ion-buttons>

                <ion-title
                    >{stats.name ? stats.name.toUpperCase() : ""}</ion-title
                >
            </ion-toolbar>
            <!-- Tabs for switching between List and Map -->
            <ion-segment
                value="list"
                on:ionChange={(e) => setSegmentValue(e.detail.value)}
            >
                <ion-segment-button value="list">
                    <ion-label>Paradas</ion-label>
                </ion-segment-button>
                <ion-segment-button value="map">
                    <ion-label>Mapa</ion-label>
                </ion-segment-button>
            </ion-segment>
        </ion-header>
        <!-- Conditional rendering based on the selected tab -->
        {#if segmentValue === "list"}
            {#if checklist.length > 0}
                {#if checklist
                    .filter((item) => item.mandatory === "1")
                    .every((item) => item.img) && !showChecklist}
                    <ion-content>
                        <ion-refresher
                            slot="fixed"
                            bind:this={refresher}
                            on:ionRefresh={refresh}
                        >
                            <ion-refresher-content
                                pulling-icon="arrow-dropdown"
                                pulling-text="Jale para actualizar"
                                refreshing-spinner="circles"
                                refreshing-text="Actualizando..."
                            />
                        </ion-refresher>
                        <ion-list>
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div
                                        class="order-wrapper"
                                        title="${stats.origin}"
                                        style="background-color: {stats.color}; color: {getContrast(
                                            stats.color
                                        )}"
                                    >
                                        <div class="order">0</div>
                                    </div>
                                </ion-avatar>
                                <ion-label
                                    button
                                    on:click={async () => {
                                        const proceed = await maybeWarnChecklist();
                                        if (proceed) {
                                            showOrigenDestinyModal(stats, false);
                                        }
                                    }}
                                >
                                    <ion-text color="#2e2e2e">
                                        <h3>
                                            {stats.origin}
                                        </h3>
                                    </ion-text>
                                    <div class="sub" />
                                </ion-label>
                                <ion-icon icon={locationOutline} slot="end" />
                            </ion-item>
                            {#each deliveries as delivery, index (delivery.id_event)}
                                <ion-item>
                                    <ion-avatar slot="start">
                                        <div
                                            class="order-wrapper"
                                            title={getStatusTitle(
                                                delivery.status
                                            )}
                                            style="background-color: {getDeliveryColor(
                                                delivery.status,
                                                delivery.date_service
                                            )}; color: {getContrast(
                                                getDeliveryColor(
                                                    delivery.status
                                                )
                                            )}"
                                        >
                                            <div class="order">
                                                {parseInt(delivery.pos) + 1}
                                            </div>
                                        </div>
                                    </ion-avatar>
                                    <ion-label
                                        button
                                        on:click={async () => {
                                            const currentIndex =
                                                deliveries.findIndex(
                                                    (item) =>
                                                        item.id_event ===
                                                        delivery.id_event
                                                );
                                            const isFirstDelivery =
                                                currentIndex === 0;
                                            const previousDelivery =
                                                currentIndex > 0
                                                    ? deliveries[
                                                          currentIndex - 1
                                                      ]
                                                    : null;
                                            const previousDeliveryHasImage =
                                                isFirstDelivery ||
                                                (previousDelivery &&
                                                    previousDelivery.img !==
                                                        null);
                                            const currentDeliveryHasImage =
                                                delivery.img !== null &&
                                                delivery.img !== "";

                                            if (
                                                previousDeliveryHasImage ||
                                                (isFirstDelivery &&
                                                    !currentDeliveryHasImage) ||
                                                orderRestriction == "1"
                                            ) {
                                                const proceed = await maybeWarnChecklist();
                                                if (proceed) {
                                                    showDeliveryInfoModal(
                                                        delivery,
                                                        false
                                                    );
                                                }
                                            } else {
                                                showAlert(
                                                    "Información incompleta",
                                                    "No puedes visualizar otras paradas hasta cargar evidencia del destino pasado"
                                                );
                                            }
                                        }}
                                    >
                                        <ion-text color="#2e2e2e">
                                            <h3>
                                                {delivery.title}
                                                {#if (delivery.support_list && delivery.support_list.length) || mustCharge(delivery)}
                                                    <span class="notes" />
                                                {/if}
                                            </h3>
                                        </ion-text>
                                        <div class="sub">
                                        </div>
                                    </ion-label>
                                    {#if delivery.tag_color && delivery.tag}
                                        <div
                                            class="stop-tag"
                                            slot="end"
                                            style="background-color:{hexToRGBA(
                                                delivery.tag_color,
                                                0.3
                                            )};
                                                border: 1px solid {hexToRGBA(
                                                delivery.tag_color,
                                                0.4
                                            )}; 
                                                color: {delivery.tag_color};
                                                font-size: 10px;
                                                text-align: center;
                                                align-content: center;
                                                border-radius: 20px;
                                                white-space: normal;
                                                padding: 3px 6px;
                                                width: auto !important;
                                                display: inline-block;
                                                font-weight: 500;"
                                        >
                                            {delivery.tag ? delivery.tag : ""}
                                        </div>
                                    {:else}
                                        <ion-icon
                                            icon={locationOutline}
                                            slot="end"
                                            style="color: {getDeliveryColor(
                                                delivery.status,
                                                delivery.date_service
                                            )}"
                                        />
                                    {/if}
                                </ion-item>
                            {/each}
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div
                                        class="order-wrapper"
                                        title="${stats.destination}"
                                        style="background-color: {stats.color}; color: {getContrast(
                                            stats.color
                                        )}"
                                    >
                                        <div class="order">
                                            {deliveries.length + 1}
                                        </div>
                                    </div>
                                </ion-avatar>
                                <ion-label
                                    button
                                    on:click={async () => {
                                        const proceed = await maybeWarnChecklist();
                                        if (proceed) {
                                            showOrigenDestinyModal(stats, true);
                                        }
                                    }}
                                >
                                    <ion-text color="#2e2e2e">
                                        <h3>
                                            {stats.destination}
                                        </h3>
                                    </ion-text>
                                    <div class="sub">
                                    </div>
                                </ion-label>
                                <ion-icon icon={locationOutline} slot="end" />
                            </ion-item>
                        </ion-list>
                    </ion-content>
                {:else}
                    <!-- ANTES aquí abría el modal automáticamente.
                         Se eliminó esa llamada para que solo advierta y el usuario decida. -->
                    <ion-content>
                        <ion-refresher
                            slot="fixed"
                            bind:this={refresher}
                            on:ionRefresh={refresh}
                        >
                            <ion-refresher-content
                                pulling-icon="arrow-dropdown"
                                pulling-text="Pull to refresh"
                                refreshing-spinner="circles"
                                refreshing-text="Refreshing..."
                            />
                        </ion-refresher>
                        <ion-list>
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div
                                        class="order-wrapper"
                                        title="${stats.origin}"
                                        style="background-color: {stats.color}; color: {getContrast(
                                            stats.color
                                        )}"
                                    >
                                        <div class="order">0</div>
                                    </div>
                                </ion-avatar>
                                <ion-label
                                    button
                                    on:click={async () => {
                                        const proceed = await maybeWarnChecklist();
                                        if (proceed) {
                                            showOrigenDestinyModal(stats, false);
                                        }
                                    }}
                                >
                                    <ion-text color="#2e2e2e">
                                        <h3>
                                            {stats.origin}
                                        </h3>
                                    </ion-text>
                                    <div class="sub" />
                                </ion-label>
                                <ion-icon icon={locationOutline} slot="end" />
                            </ion-item>
                            {#each deliveries as delivery, index (delivery.id_event)}
                                <ion-item>
                                    <ion-avatar slot="start">
                                        <div
                                            class="order-wrapper"
                                            title={getStatusTitle(
                                                delivery.status
                                            )}
                                            style="background-color: {getDeliveryColor(
                                                delivery.status,
                                                delivery.date_service
                                            )}; color: {getContrast(
                                                getDeliveryColor(
                                                    delivery.status
                                                )
                                            )}"
                                        >
                                            <div class="order">
                                                {parseInt(delivery.pos) + 1}
                                            </div>
                                        </div>
                                    </ion-avatar>
                                    <ion-label
                                        button
                                        on:click={async () => {
                                            const currentIndex =
                                                deliveries.findIndex(
                                                    (item) =>
                                                        item.id_event ===
                                                        delivery.id_event
                                                );
                                            const isFirstDelivery =
                                                currentIndex === 0;
                                            const previousDelivery =
                                                currentIndex > 0
                                                    ? deliveries[
                                                          currentIndex - 1
                                                      ]
                                                    : null;
                                            const previousDeliveryHasImage =
                                                isFirstDelivery ||
                                                (previousDelivery &&
                                                    previousDelivery.img !==
                                                        null);
                                            const currentDeliveryHasImage =
                                                delivery.img !== null &&
                                                delivery.img !== "";

                                            if (
                                                previousDeliveryHasImage ||
                                                (isFirstDelivery &&
                                                    !currentDeliveryHasImage) ||
                                                orderRestriction == "1"
                                            ) {
                                                const proceed = await maybeWarnChecklist();
                                                if (proceed) {
                                                    showDeliveryInfoModal(
                                                        delivery,
                                                        false
                                                    );
                                                }
                                            } else {
                                                showAlert(
                                                    "Información incompleta",
                                                    "No puedes visualizar otras paradas hasta cargar evidencia del destino pasado"
                                                );
                                            }
                                        }}
                                    >
                                        <ion-text color="#2e2e2e">
                                            <h3>
                                                {delivery.title}
                                                {#if (delivery.support_list && delivery.support_list.length) || mustCharge(delivery)}
                                                    <span class="notes" />
                                                {/if}
                                            </h3>
                                        </ion-text>
                                        <div class="sub">
                                        </div>
                                    </ion-label>
                                    {#if delivery.tag_color && delivery.tag}
                                        <div
                                            class="stop-tag"
                                            slot="end"
                                            style="background-color:{hexToRGBA(
                                                delivery.tag_color,
                                                0.3
                                            )};
                                                border: 1px solid {hexToRGBA(
                                                delivery.tag_color,
                                                0.4
                                            )}; 
                                                color: {delivery.tag_color};
                                                font-size: 10px;
                                                text-align: center;
                                                align-content: center;
                                                border-radius: 20px;
                                                white-space: normal;
                                                padding: 3px 6px;
                                                width: auto !important;
                                                display: inline-block;
                                                font-weight: 500;"
                                        >
                                            {delivery.tag ? delivery.tag : ""}
                                        </div>
                                    {:else}
                                        <ion-icon
                                            icon={locationOutline}
                                            slot="end"
                                            style="color: {getDeliveryColor(
                                                delivery.status,
                                                delivery.date_service
                                            )}"
                                        />
                                    {/if}
                                </ion-item>
                            {/each}
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div
                                        class="order-wrapper"
                                        title="${stats.destination}"
                                        style="background-color: {stats.color}; color: {getContrast(
                                            stats.color
                                        )}"
                                    >
                                        <div class="order">
                                            {deliveries.length + 1}
                                        </div>
                                    </div>
                                </ion-avatar>
                                <ion-label
                                    button
                                    on:click={async () => {
                                        const proceed = await maybeWarnChecklist();
                                        if (proceed) {
                                            showOrigenDestinyModal(stats, true);
                                        }
                                    }}
                                >
                                    <ion-text color="#2e2e2e">
                                        <h3>
                                            {stats.destination}
                                        </h3>
                                    </ion-text>
                                    <div class="sub">
                                    </div>
                                </ion-label>
                                <ion-icon icon={locationOutline} slot="end" />
                            </ion-item>
                        </ion-list>
                    </ion-content>
                {/if}
            {:else if !loading}
                {#if showChecklist}
                    <!-- Ya no abrimos modal automáticamente -->
                {/if}
                <ion-content>
                    <ion-refresher
                        slot="fixed"
                        bind:this={refresher}
                        on:ionRefresh={refresh}
                    >
                        <ion-refresher-content
                            pulling-icon="arrow-dropdown"
                            pulling-text="Jala para actualizar"
                            refreshing-spinner="circles"
                            refreshing-text="Actualizando..."
                        />
                    </ion-refresher>
                    <ion-list>
                        <ion-item>
                            <ion-avatar slot="start">
                                <div
                                    class="order-wrapper"
                                    title="${stats.origin}"
                                    style="background-color: {stats.color}; color: {getContrast(
                                        stats.color
                                    )}"
                                >
                                    <div class="order">0</div>
                                </div>
                            </ion-avatar>
                            <ion-label
                                button
                                on:click={() => {
                                    showOrigenDestinyModal(stats, false);
                                }}
                            >
                                <ion-text color="#2e2e2e">
                                    <h3>
                                        {stats.origin}
                                    </h3>
                                </ion-text>
                                <div class="sub" />
                            </ion-label>
                            <ion-icon icon={locationOutline} slot="end" />
                        </ion-item>
                        {#each deliveries as delivery, index (delivery.id_event)}
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div
                                        class="order-wrapper"
                                        title={getStatusTitle(delivery.status)}
                                        style="background-color: {getDeliveryColor(
                                            delivery.status,
                                            delivery.date_service
                                        )}; color: {getContrast(
                                            getDeliveryColor(delivery.status)
                                        )}"
                                    >
                                        <div class="order">
                                            {parseInt(delivery.pos) + 1}
                                        </div>
                                    </div>
                                </ion-avatar>
                                <ion-label
                                    button
                                    on:click={async () => {
                                        const currentIndex =
                                            deliveries.findIndex(
                                                (item) =>
                                                    item.id_event ===
                                                    delivery.id_event
                                            );
                                        const isFirstDelivery =
                                            currentIndex === 0;
                                        const previousDelivery =
                                            currentIndex > 0
                                                ? deliveries[currentIndex - 1]
                                                : null;
                                        const previousDeliveryHasImage =
                                            isFirstDelivery ||
                                            (previousDelivery &&
                                                previousDelivery.img !== null);
                                        const currentDeliveryHasImage =
                                            delivery.img !== null &&
                                            delivery.img !== "";

                                        if (
                                            previousDeliveryHasImage ||
                                            (isFirstDelivery &&
                                                !currentDeliveryHasImage) ||
                                            orderRestriction == "1"
                                        ) {
                                            showDeliveryInfoModal(
                                                delivery,
                                                false
                                            );
                                        } else {
                                            showAlert(
                                                "Información incompleta",
                                                "No puedes visualizar otras paradas hasta cargar evidencia del destino pasado"
                                            );
                                        }
                                    }}
                                >
                                    <ion-text color="#2e2e2e">
                                        <h3>
                                            {delivery.title}
                                            {#if (delivery.support_list && delivery.support_list.length) || mustCharge(delivery)}
                                                <span class="notes" />
                                            {/if}
                                        </h3>
                                    </ion-text>
                                </ion-label>
                                {#if delivery.tag_color && delivery.tag}
                                    <div
                                        class="stop-tag"
                                        slot="end"
                                        style="background-color:{hexToRGBA(
                                            delivery.tag_color,
                                            0.3
                                        )};
                                                border: 1px solid {hexToRGBA(
                                            delivery.tag_color,
                                            0.4
                                        )}; 
                                                color: {delivery.tag_color};
                                                font-size: 10px;
                                                text-align: center;
                                                align-content: center;
                                                border-radius: 20px;
                                                white-space: normal;
                                                padding: 3px 6px;
                                                width: auto !important;
                                                display: inline-block;
                                                font-weight: 500;"
                                    >
                                        {delivery.tag ? delivery.tag : ""}
                                    </div>
                                {:else}
                                    <ion-icon
                                        icon={locationOutline}
                                        slot="end"
                                        style="color: {getDeliveryColor(
                                            delivery.status,
                                            delivery.date_service
                                        )}"
                                    />
                                {/if}
                            </ion-item>
                        {/each}
                        <ion-item>
                            <ion-avatar slot="start">
                                <div
                                    class="order-wrapper"
                                    title="${stats.destination}"
                                    style="background-color: {stats.color}; color: {getContrast(
                                        stats.color
                                    )}"
                                >
                                    <div class="order">
                                        {deliveries.length + 1}
                                    </div>
                                </div>
                            </ion-avatar>
                            <ion-label
                                button
                                on:click={() => {
                                    showOrigenDestinyModal(stats, true);
                                }}
                            >
                                <ion-text color="#2e2e2e">
                                    <h3>
                                        {stats.destination}
                                    </h3>
                                </ion-text>
                                <div class="sub">
                                </div>
                            </ion-label>
                            <ion-icon icon={locationOutline} slot="end" />
                        </ion-item>
                    </ion-list>
                </ion-content>
            {/if}

        {#if segmentValue === "list" && showStartButton && needsChecklistOrKmGas()}
              <ion-footer>
                <ion-toolbar>
                  <ion-button
                    expand="block"
                    size="large"
                    color={routeStarted ? "success" : "primary"}
                    on:click={() => showChecklistModal(checklist, driverId, routeId)}
                    style="margin: 8px;"
                  >
                    {routeStarted ? "Ruta iniciada ✓" : "Iniciar ruta"}
                  </ion-button>
                </ion-toolbar>
              </ion-footer>
            {/if}

        {:else if segmentValue === "map"}
            <!-- Google Maps View -->
            <ion-content>
                <!-- HTML where the map will render -->
                <div id="g_map" style="width: 100%; height: 100vh;" />
            </ion-content>
        {/if}
    </IonPage>
{/if}
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

<style>
    .sub {
        font-size: 12px;
        margin-top: 5px;
    }

    .order-wrapper {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #cbcfde;
        text-align: center;
        display: flex;
        justify-content: center;
    }

    .order {
        align-self: center;
    }

    .notes {
        background-color: #e0b500;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    #map {
        height: 400px;
        width: 100%;
    }
</style>