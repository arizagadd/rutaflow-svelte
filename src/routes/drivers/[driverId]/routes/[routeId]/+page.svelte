<script lang="ts">
    //import {ready, url, goto} from '@sveltech/routify';
    export let routeId;
    export let driverId;
    import DeliveryInfo from './_DeliveryInfo.svelte';
    import IonPage from 'ionic-svelte/components/IonPage.svelte';
    import ChecklistControl from './_ChecklistControl.svelte';
    import AddExpense from './_AddExpense.svelte';
    import ExpenseDetails from './_ExpenseDetails.svelte';
    import {logOut} from "ionicons/icons"; 
    import { checklistStore } from '../../../../../stores/checklistStore';
    import { onMount } from 'svelte';
    import BoxesCount from './_BoxesCount.svelte';
    import {IonicShowModal} from "../../../../../services/IonicControllers";
    import {alertController } from '@ionic/core';
    import {page} from '$app/stores';
    import { goto } from '$app/navigation';
    import {locationOutline,cashOutline} from "ionicons/icons"; 
    import {arrowBack} from "ionicons/icons"; 

    let dataSession = new Object();
    let loading = true;
    let showChecklist = false;
    let deliveries = [];
    let stats = {};
    let checklist = [];
    let expenses = [];
    let refresher;
    let isModalOpen = false;

    const refresh = async () => {
        await loadRoute(routeId);
        refresher.complete();
    }

    onMount(() => {
		refresh();
	});

    $: {({routeId,driverId} = $page.params)
            dataSession = JSON.parse(localStorage.getItem('userSession'));
            if(dataSession){
                if(dataSession.id_user && (dataSession.type=="admin" || dataSession.type=="superadmin")){
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

    async function loadRoute(routeId) {
        const requestData = new FormData();
        requestData.append('id_route', routeId);
        try {
            const response = await fetch('https://rutaflow-app-development.up.railway.app/api/admin/report/seguimiento_list.php', {
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

    function getDeliveryColor(delivery) {
        let color = '#ffffff';

        if (delivery.status === 'pending') {
            color = '#f2e300';
        }else if (delivery.status === 'completed') {
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

            fetch('https://rutaflow-app-development.up.railway.app/api/admin/evidence/evidence_by_event.php', {
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
            });
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
        fetch('https://rutaflow-app-development.up.railway.app/api/admin/route/change_status.php', {
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
        if(dataSession.id_driver){
            goto(`/drivers/${dataSession.id_driver}`);
        }else{
            goto(`/drivers/me`);
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
    .delivery-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: relative;
        display: inline-block;
        text-align: center;
        line-height: 20px;
        font-weight: bold;
        margin-right: 5px;
        border: 1px solid #CBCFDE;
    }

    .sub {
        font-size: 12px;
        margin-top: 5px;
    }

    .sub .prod {
        letter-spacing: 1px;
        font-weight: 600;
    }

    .sub .time {
        color: #888;
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
        
                <ion-title>{stats.name}</ion-title>
        
            </ion-toolbar>
        </ion-header>

        {#if checklist.length > 0}
            {#if checklist.every(item => item.img)}
                <ion-content>
                    <ion-refresher slot="fixed" bind:this={refresher} on:ionRefresh={refresh}>
                        <ion-refresher-content pulling-icon="arrow-dropdown"
                                            pulling-text="Jale para actualizar"
                                            refreshing-spinner="circles"
                                            refreshing-text="Actualizando..."></ion-refresher-content>
                    </ion-refresher>
                    <ion-list>
                        {#each deliveries as delivery, index (delivery.id_event)}
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div class="order-wrapper" title="{getStatusTitle(delivery.status)}" style="background-color: {getDeliveryColor(delivery)}; color: {getContrast(getDeliveryColor(delivery))}">
                                        <div class="order">
                                            {parseInt(delivery.pos) + 1}
                                        </div>
                                    </div>
                                </ion-avatar>
                                <ion-label button on:click={() => showDeliveryInfoModal(delivery, isLastDelivery(index))}>
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
                                    <div class="order-wrapper" title="{getStatusTitle(delivery.status)}" style="background-color: {getDeliveryColor(delivery)}; color: {getContrast(getDeliveryColor(delivery))}">
                                        <div class="order">
                                            {parseInt(delivery.pos) + 1}
                                        </div>
                                    </div>
                                </ion-avatar>
                                <ion-label button on:click={() => showDeliveryInfoModal(delivery, isLastDelivery(index))}>
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
                        {#each deliveries as delivery (delivery.id_event)}
                            <ion-item>
                                <ion-avatar slot="start">
                                    <div class="order-wrapper" title="{getStatusTitle(delivery.status)}" style="background-color: {getDeliveryColor(delivery)}; color: {getContrast(getDeliveryColor(delivery))}">
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
                                        showDeliveryInfoModal(delivery);
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
                                <ion-icon icon={locationOutline} slot="end" style="color: {getDeliveryColor(delivery)}"></ion-icon>
                            </ion-item>
                        {/each}
                    </ion-list>
                </ion-content>
            {/if}
        {/if}
    </IonPage>
{/if}