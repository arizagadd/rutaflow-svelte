<script lang="ts">
    export let routeId;
    export let driverId;
    import DeliveryInfo from './_DeliveryInfo.svelte';
    import IonPage from 'ionic-svelte/components/IonPage.svelte';
    import ChecklistControl from './_ChecklistControl.svelte';
    import AddExpense from './_AddExpense.svelte';
    import ExpenseDetails from './_ExpenseDetails.svelte';
    import { onMount, tick } from 'svelte';
    import {IonicShowModal} from "../../../../../services/IonicControllers";
    import {alertController } from '@ionic/core';
    import {page} from '$app/stores';
    import { goto } from '$app/navigation';
    import {locationOutline,cashOutline, homeSharp,flagSharp} from "ionicons/icons"; 
    import {arrowBack} from "ionicons/icons";
    import {DATABASE_URL} from '../../../../../hooks';
    /*Back URL*/
    let back_url = DATABASE_URL;

    let dataSession = new Object();
    let loading = true;
    let showChecklist = false;
    let deliveries = [];
    let stats = {};
    let checklist = [];
    let expenses = [];
    let refresher;
    let isModalOpen = false;
    let segmentValue = "list"; // Controls the tab selection
    let mapElement;

    const refresh = async () => {
        await loadRoute(routeId);
        refresher.complete();
    }

    onMount(async () => {
		await loadRoute(routeId);
	});

    $: {({routeId,driverId} = $page.params)
            dataSession = JSON.parse(localStorage.getItem('userSession'));
            if(dataSession){
                if(dataSession.id_user && (dataSession.type=="admin" || dataSession.type=="super")){
                    loadRoute(routeId);
                    goto(`/drivers/me/routes/${routeId}`);
                }else if(dataSession.id_user && dataSession.id_driver){
                    loadRoute(routeId);
                    goto(`/drivers/${dataSession.id_driver}/routes/${routeId}`);
                }
            }else{
                goto('/');
            }
        }

    async function setSegmentValue(value) {
        segmentValue = value;

        if (segmentValue === "map") {
            await tick();

            mapElement = document.getElementById("g_map");
            const map = new google.maps.Map(mapElement, {  
                zoom: 8,  
                center: {lat: 20.6745683, lng: -103.3986104},
                mapId: "4504f8b37365c3d0"
            });
            const bounds = new google.maps.LatLngBounds();
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
                "marker",
            );
            // Get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    // Add a blue dot to indicate the user's location
                    new google.maps.Marker({
                        position: userLatLng,
                        map: map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#0062ff',
                            fillOpacity: 1.0,
                            scale: 6, // Adjust size as needed
                            strokeColor: '#ffffff',
                            strokeWeight: 2
                        }
                    });

                    // Optional: Draw an accuracy circle around the user's location
                    new google.maps.Circle({
                        strokeColor: '#00BFFF',
                        strokeOpacity: 0.5,
                        strokeWeight: 1,
                        fillColor: '#00BFFF',
                        fillOpacity: 0.2,
                        map: map,
                        center: userLatLng,
                        radius: position.coords.accuracy // Radius is based on accuracy of location
                    });

                    // Extend the map bounds to include the user's location
                    bounds.extend(userLatLng);
                }, function(error) {
                    console.error("Error retrieving location:", error);
                });
            } else {
                console.error("Geolocation not supported by this browser.");
            }
            //For origin marker
            createMarker(bounds, map,{lat:stats.lat1,lon:stats.lon1,color:stats.color,title:stats.origin},{ type: "icon", iconClass: "icon-home", title: "Origen", glyph: "0"});
            //For destination marker
            createMarker(bounds, map,{lat:stats.lat2,lon:stats.lon2,color:stats.color,title:stats.destination},{ type: "icon", iconClass: "icon-flag", title: "Destino", glyph: String(deliveries.length+1)});

            // Example of adding markers for stops/events
            deliveries.forEach((delivery, index) => {
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
                    background: getDeliveryColor(delivery.status, delivery.date_service),
					borderColor: "#000",
					glyphColor: "#000",
					glyph:  (parseInt(delivery.pos)+1).toString()
	
				});

                const waypointMarker = new AdvancedMarkerElement({
					map: map,
					position: waypointLatLng,
					content: pin.element,
					title: "Parada "+ (parseInt(delivery.pos)+1).toString()+": "+delivery.title,
				});

                // Add a click listener for each marker, and set up the info window.
				waypointMarker.addListener("click", function(domEvent) {
					const { target } = domEvent;
					showDeliveryInfoModal(delivery, false);
				});

                bounds.extend(marker.getPosition());
            });

            // Adjust map to fit all markers
            map.fitBounds(bounds);
        }
    }

    async function createMarker(bounds, map,obj,contentConfig){
        let contentElement;
        const lat = parseFloat(obj.lat);
        const lon = parseFloat(obj.lon);
        const waypointLatLng = new google.maps.LatLng(lat, lon);
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        if(contentConfig.type == "icon"){
            contentElement = document.createElement("i");
            contentElement.className = `${contentConfig.iconClass} icon`; // Add your icon class
            contentElement.style.fontSize = "14px"; // Adjust size as needed
            contentElement.style.color = getContrast(obj.color); // Set color dynamically
            contentElement.style.fontWeight = "600"; 
        }else if(contentConfig.type == "text"){
            //En caso de que queramos usar la función "createMarker" para agregar markers con texto
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
			glyph: contentConfig.glyph
		});

        const waypointMarker = new AdvancedMarkerElement({
			map: map,
			position: waypointLatLng,
			content: pin.element,
			title: contentConfig.title+": "+obj.title,
		});

        // Add a click listener for each marker, and set up the info window.
		waypointMarker.addListener("click", function(domEvent) {
			const { target } = domEvent;
            showOrigenDestinyModal(stats,contentConfig.title=="Destino"?true:false);
			//showDeliveryInfoModal(delivery, isLastDelivery(index));
		});

        return marker;
    }

    async function loadRoute(routeId) {
        const requestData = new FormData();
        requestData.append('id_route', routeId);
        try {
            const response = await fetch(`${back_url}api/admin/report/seguimiento_list.php`, {
                method: 'POST',
                body: requestData,
            });
            const data = await response.json();
            stats = data.data.seguimiento_list[0];
            deliveries = data.data.event_list;
            checklist = data.data.checklist;
            expenses = data.data.expenses;
            if(stats){
                showChecklist = (stats.km_inicial=='0' && stats.gas_inicial=='0');
            }
            loading = false; // Data loading complete
        }catch(error) {
            loading = false; // Data loading complete
            console.error('Error fetching data:', error);
        };
                
    }

    function getDeliveryColor(status,service_time="") {
        let color = '#ffffff';
        if (status === 'pending' && !service_time) {
            color = '#f2e300';
        }else if(status == "pending" && service_time){
            color = '#F6A833';
        }else if (status === 'completed') {
            color = '#44d900';
        }

        return color;
    }
    function getStatusTitle(status){
        let state = '';
        if(status=="pending"){
            state='Pendiente';
        }else if(status=="completed"){
            state='Completado';
        }
        return state;
    }
    function getContrast(hexColor) {

        // If a leading # is provided, remove it
        if (hexColor.slice(0, 1) === '#') {
            hexColor = hexColor.slice(1);
        }

        // If a three-character hexcode, make six-character
        if (hexColor.length === 3) {
            hexColor = hexColor.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }

        // Convert to RGB value
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);

        // Get YIQ ratio
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // Check contrast
        return (yiq >= 128) ? '#414040' : '#fff';

    }

    const refresh_event_info = (delivery) => {
        return new Promise((resolve, reject) => {
            const requestData = new FormData();
            requestData.append('id_route', delivery.id_route);
            requestData.append('id_event', delivery.id_event);

            fetch(`${back_url}api/admin/evidence/evidence_by_event.php`, {
                method: 'POST',
                body: requestData,
            })
            .then(response => response.json())
            .then(data => {
                resolve(data.data.event_evidence[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error);
            });
        });
    }

    const showDeliveryInfoModal = (delivery,isLast) => {
        refresh_event_info(delivery)
            .then((evidence_data) => {
            //delivery.client_name = stats.client_name;
            if (evidence_data) {
                //update these two fields that could change when user charge info
                delivery.img = evidence_data.img;
                delivery.driver_comments = evidence_data.driver_comments;
                delivery.comments = evidence_data.comments;
            }
            IonicShowModal("modal-delivery-info", DeliveryInfo, {
                delivery,isLast
            }).then((result) => {
                //console.log(result);
            }).finally(() => {
                // Modal is closed, now call loadRoute and refresh
                loadRoute(routeId);
            });
        });
    };

    const showOrigenDestinyModal = (stats,isLast) => {
        var delivery = new Object();
        
        if(isLast){
            delivery = {
                title: stats.destination,
                line1: stats.dest_address
            }
        }else{
            delivery = {
                title: stats.origin,
                line1: stats.origin_address
            }
        }
        delivery.client_name = stats.client_name;
        delivery.client_phone = stats.tel;
        delivery.id_route = stats.id_route;
        var flag = true; //Flag to know is origen or destiny
        IonicShowModal("modal-delivery-info", DeliveryInfo, {
                delivery,isLast,flag
        });
    };

    const showChecklistModal = (checklist,driverId,routeId) => {
        var isLast = false;
        if(!isModalOpen){
            isModalOpen = true;
            IonicShowModal("modal-checklist", ChecklistControl, {
                checklist,driverId,routeId,isLast
            }).then((result) => {
                isModalOpen = false;
            });
            changeRouteStatus(routeId,'checklist');
        }
        return "";
    };

    const showExpenseModal = async (routeId) => {
        await loadRoute(routeId);
        if(expenses.length>0){
            IonicShowModal("modal-expense-detail", ExpenseDetails, {
                routeId,expenses
            }).then((result) => {
                
            });
        }else{
            IonicShowModal("modal-expense", AddExpense, {
                routeId
            }).then((result) => {
                
            });
        }
        //changeRouteStatus(routeId,'checklist');
        return "";
    };

    const mustCharge = (delivery) => {
        if(delivery.tracking_type=='subscription'){
            if (delivery.subscriber_info && delivery.payment_type === 'cash') {
                let date = new Date(delivery.subscriber_info.payment_next);

                if (date < (new Date())) {
                    return true;
                }

            }
        }
        else if(delivery.tracking_type=='ecommerce'){
            if(Number(delivery.payment_pending) > 0){
                return true;
            }
        }
        return false;
    }

    function changeRouteStatus(id_route,status){
        let requestData = new FormData();
        requestData.append('id_route', id_route);
        requestData.append('status',status);
        fetch(`${back_url}api/admin/route/change_status.php`, {
                method: 'POST',
                body: requestData,
            })
            .then(response => response.json())
            .then(data => {
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        return "";
    }

    const goBack = () => {
        // Redirect to backpage
        if(dataSession.type=="super" || dataSession.type=="admin"){
            goto(`/drivers/me`);
        }else if(dataSession.id_driver){
            goto(`/drivers/${dataSession.id_driver}`);
        }
    }

    const showAlert = async (customHeader, customMessage) => {
        const alert = await alertController.create({
            header: customHeader || 'Error', // Use customHeader or default value
            message: customMessage || 'Vuelva a intentar', // Use customMessage or default value
            buttons: [
                {
                    text: 'Cerrar'
                }
            ]
        });

        await alert.present();
    };

    function isLastDelivery(index) {
        return index === deliveries.length - 1;
    }


</script>

<style>

    .sub {
        font-size: 12px;
        margin-top: 5px;
    }

    .order-wrapper {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #CBCFDE;
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

<svelte:head>
    <title>Rutaflow - Detalles de ruta</title>
</svelte:head>

{#if dataSession}
    <IonPage>
        <ion-header translucent>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button title="Atrás" alt="Atrás" on:click={goBack}><ion-icon icon={arrowBack}></ion-icon></ion-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button on:click={()=>showExpenseModal(routeId)}><ion-icon icon={cashOutline}></ion-icon></ion-button>
                    <!-- <ion-button>{dataSession.name}</ion-button> -->
                </ion-buttons>
        
                <ion-title>{stats.name ? stats.name.toUpperCase() : ''}</ion-title>
        
            </ion-toolbar>
            <!-- Tabs for switching between List and Map -->
            <ion-segment value="list" on:ionChange={e => setSegmentValue(e.detail.value)}>
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
                {#if checklist.filter(item => item.mandatory === "1").every(item => item.img) && !showChecklist}
                    <ion-content>
                        <ion-refresher slot="fixed" bind:this={refresher} on:ionRefresh={refresh}>
                            <ion-refresher-content pulling-icon="arrow-dropdown"
                                                pulling-text="Jale para actualizar"
                                                refreshing-spinner="circles"
                                                refreshing-text="Actualizando..."></ion-refresher-content>
                        </ion-refresher>
                        <ion-list>
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div class="order-wrapper" title="${stats.origin}" style="background-color: {stats.color}; color: {getContrast(stats.color)}">
                                        <div class="order">
                                            0
                                        </div>
                                    </div>
                                </ion-avatar>
                                <ion-label button on:click={() => {showOrigenDestinyModal(stats, false)}}>

                                    <ion-text color="#2e2e2e">
                                        <h3>
                                            {stats.origin}
                                        </h3>
                                    </ion-text>
                                    <div class="sub">

                                    </div>
                                </ion-label>
                                <ion-icon icon={locationOutline} slot="end"></ion-icon>
                            </ion-item>
                            {#each deliveries as delivery, index (delivery.id_event)}
                                <ion-item>
                                    <ion-avatar slot="start">
                                        <div class="order-wrapper" title="{getStatusTitle(delivery.status)}" style="background-color: {getDeliveryColor(delivery.status,delivery.date_service)}; color: {getContrast(getDeliveryColor(delivery.status))}">
                                            <div class="order">
                                                {parseInt(delivery.pos) + 1}
                                            </div>
                                        </div>
                                    </ion-avatar>
                                    <ion-label button on:click={() => {
                                        // Get the index of the current delivery in the array
                                        const currentIndex = deliveries.findIndex(item => item.id_event === delivery.id_event);
                                        
                                        // Check if the previous delivery has an image (or if it's the first delivery)
                                        const isFirstDelivery = currentIndex === 0;
                                        const previousDelivery = currentIndex > 0 ? deliveries[currentIndex - 1] : null;
                                        const previousDeliveryHasImage = isFirstDelivery || (previousDelivery && previousDelivery.img !== null);
                                        
                                        // Check if the current delivery has an image
                                        const currentDeliveryHasImage = delivery.img !== null && delivery.img !== '';
                                        
                                        // Allow showing the modal only if the current delivery has an image
                                        // or if it's the first delivery and the current delivery does not have an image
                                        if (previousDeliveryHasImage || (isFirstDelivery && !currentDeliveryHasImage)) {
                                            showDeliveryInfoModal(delivery, false);
                                        } else {
                                            showAlert("Información incompleta", "No puedes visualizar otras paradas hasta cargar evidencia del destino pasado");
                                        }
                                    }}>
                                    <!-- <ion-label button on:click={() => showDeliveryInfoModal(delivery, isLastDelivery(index))}> -->
                                        <ion-text color="#2e2e2e">
                                            <h3>
                                                {delivery.title}
                                                {#if (delivery.support_list && delivery.support_list.length) || mustCharge(delivery)}
                                                    <span class="notes"></span>
                                                {/if}
                                            </h3>
                                        </ion-text>
                                        <div class="sub">
                                            <!-- <BoxesCount delivery={delivery} /> -->

                                        </div>
                                    </ion-label>
                                    <ion-icon icon={locationOutline} slot="end"></ion-icon>
                                </ion-item>
                            {/each}
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div class="order-wrapper" title="${stats.destination}" style="background-color: {stats.color}; color: {getContrast(stats.color)}">
                                        <div class="order">
                                            {deliveries.length + 1}
                                        </div>
                                    </div>
                                </ion-avatar>
                                <ion-label button on:click={() => {showOrigenDestinyModal(stats, true)}}>
                                <!-- <ion-label button on:click={() => showDeliveryInfoModal(delivery, isLastDelivery(index))}> -->
                                    <ion-text color="#2e2e2e">
                                        <h3>
                                            {stats.destination}
                                        </h3>
                                    </ion-text>
                                    <div class="sub">
                                        <!-- <BoxesCount delivery={delivery} /> -->

                                    </div>
                                </ion-label>
                                <ion-icon icon={locationOutline} slot="end"></ion-icon>
                            </ion-item>
                        </ion-list>
                    </ion-content>
                {:else}
                    {showChecklistModal(checklist,driverId,routeId)}
                    <ion-content>
                        <ion-refresher slot="fixed" bind:this={refresher} on:ionRefresh={refresh}>
                            <ion-refresher-content pulling-icon="arrow-dropdown"
                                                pulling-text="Pull to refresh"
                                                refreshing-spinner="circles"
                                                refreshing-text="Refreshing..."></ion-refresher-content>
                        </ion-refresher>
                        <ion-list>
                            {#each deliveries as delivery, index (delivery.id_event)}
                                <ion-item>
                                    <ion-avatar slot="start">
                                        <div class="order-wrapper" title="{getStatusTitle(delivery.status)}" style="background-color: {getDeliveryColor(delivery.status, delivery.date_service)}; color: {getContrast(getDeliveryColor(delivery.status))}">
                                            <div class="order">
                                                {parseInt(delivery.pos) + 1}
                                            </div>
                                        </div>
                                    </ion-avatar>
                                    <ion-label button on:click={() => {
                                        // Get the index of the current delivery in the array
                                        const currentIndex = deliveries.findIndex(item => item.id_event === delivery.id_event);
                                        
                                        // Check if the previous delivery has an image (or if it's the first delivery)
                                        const isFirstDelivery = currentIndex === 0;
                                        const previousDelivery = currentIndex > 0 ? deliveries[currentIndex - 1] : null;
                                        const previousDeliveryHasImage = isFirstDelivery || (previousDelivery && previousDelivery.img !== null);
                                        
                                        // Check if the current delivery has an image
                                        const currentDeliveryHasImage = delivery.img !== null && delivery.img !== '';
                                        
                                        // Allow showing the modal only if the current delivery has an image
                                        // or if it's the first delivery and the current delivery does not have an image
                                        if (previousDeliveryHasImage || (isFirstDelivery && !currentDeliveryHasImage)) {
                                            showDeliveryInfoModal(delivery, isLastDelivery(index));
                                        } else {
                                            showAlert("Información incompleta", "No puedes visualizar otras paradas hasta cargar evidencia del destino pasado");
                                        }
                                    }}>
                                    <!-- <ion-label button on:click={() => showDeliveryInfoModal(delivery, isLastDelivery(index))}> -->
                                        <ion-text color="#2e2e2e">
                                            <h3>
                                                {delivery.title}
                                                {#if (delivery.support_list && delivery.support_list.length) || mustCharge(delivery)}
                                                    <span class="notes"></span>
                                                {/if}
                                            </h3>
                                        </ion-text>
                                        <div class="sub">
                                            <!-- <BoxesCount delivery={delivery} /> -->

                                        </div>
                                    </ion-label>
                                    <ion-icon icon={locationOutline} slot="end"></ion-icon>
                                </ion-item>
                            {/each}
                        </ion-list>
                    </ion-content>
                {/if}
            {:else}
                {#if !loading}
                    {#if showChecklist}
                        {showChecklistModal("",driverId,routeId)}
                    {/if}
                    <ion-content>
                        <ion-refresher slot="fixed" bind:this={refresher} on:ionRefresh={refresh}>
                            <ion-refresher-content pulling-icon="arrow-dropdown"
                                                pulling-text="Jala para actualizar"
                                                refreshing-spinner="circles"
                                                refreshing-text="Actualizando..."></ion-refresher-content>
                        </ion-refresher>
                        <ion-list>
                            {#each deliveries as delivery, index (delivery.id_event)}
                                <ion-item>
                                    <ion-avatar slot="start">
                                        <div class="order-wrapper" title="{getStatusTitle(delivery.status)}" style="background-color: {getDeliveryColor(delivery.status, delivery.date_service)}; color: {getContrast(getDeliveryColor(delivery.status))}">
                                            <div class="order">
                                                {parseInt(delivery.pos) + 1}
                                            </div>
                                        </div>
                                    </ion-avatar>
                                    <ion-label button on:click={() => {
                                        // Get the index of the current delivery in the array
                                        const currentIndex = deliveries.findIndex(item => item.id_event === delivery.id_event);
                                        
                                        // Check if the previous delivery has an image (or if it's the first delivery)
                                        const isFirstDelivery = currentIndex === 0;
                                        const previousDelivery = currentIndex > 0 ? deliveries[currentIndex - 1] : null;
                                        const previousDeliveryHasImage = isFirstDelivery || (previousDelivery && previousDelivery.img !== null);
                                        
                                        // Check if the current delivery has an image
                                        const currentDeliveryHasImage = delivery.img !== null && delivery.img !== '';
                                        
                                        // Allow showing the modal only if the current delivery has an image
                                        // or if it's the first delivery and the current delivery does not have an image
                                        if (previousDeliveryHasImage || (isFirstDelivery && !currentDeliveryHasImage)) {
                                            showDeliveryInfoModal(delivery, isLastDelivery(index));
                                        } else {
                                            showAlert("Información incompleta", "No puedes visualizar otras paradas hasta cargar evidencia del destino pasado");
                                        }
                                    }}>                            
                                        <ion-text color="#2e2e2e">
                                            <h3>
                                                {delivery.title}
                                                {#if (delivery.support_list && delivery.support_list.length) || mustCharge(delivery)}
                                                    <span class="notes"></span>
                                                {/if}
                                            </h3>
                                        </ion-text>
                                    </ion-label>
                                    <ion-icon icon={locationOutline} slot="end" style="color: {getDeliveryColor(delivery.status,delivery.date_service)}"></ion-icon>
                                </ion-item>
                            {/each}
                        </ion-list>
                    </ion-content>
                {/if}
            {/if}
        {:else if segmentValue === "map"}
            <!-- Google Maps View -->
            <ion-content>
                <!-- HTML where the map will render -->
                <div id="g_map" style="width: 100%; height: 100vh;"></div>
            </ion-content>
        {/if}
    </IonPage>
{/if}