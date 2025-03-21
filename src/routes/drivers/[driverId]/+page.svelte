<script>
    export let driverId;
    import {page} from '$app/stores';
    import { alertController } from '@ionic/core';
    import {logOut} from "ionicons/icons"; 
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import IonPage from 'ionic-svelte/components/IonPage.svelte';
    import {DATABASE_URL} from '../../../hooks';

    /*Back URL*/
    let back_url = DATABASE_URL;
    
    let routes = [];
    let events = new Object();
    let hasPendingRoutes = false;
    let flag = false;
    let dataSession = new Object();
    let refresher;

    const refresh = async () => {
       await loadRoutes(driverId);
       refresher.complete();
    }

    onMount( async () => {
        refresh();
	});

    $: {({driverId} = $page.params);
        dataSession = JSON.parse(localStorage.getItem('userSession'));
        if(dataSession){
            if(driverId=='me' && dataSession.id_user){
                if(dataSession.type=='admin' || dataSession.type == 'super'){
                    goto(`/drivers/me`);
                    loadRoutes(driverId);
                    flag = true;
                }else{
                    showAlert('Usuario no autorizado','Este usuario no tiene acceso a la app de Rutaflow, entrar en contacto con soporte');
                    goto('/');
                }
            }else if(dataSession && driverId){
                goto(`/drivers/${dataSession.id_driver}`);
                loadRoutes(driverId);
            }
        }else{
            showAlert('Sesión cerrada','Será redireccionado para volver a ingresar');
            goto('/');
        }};

    //const encodeEmoji = (emoji) => unescape(encodeURIComponent(emoji));

    const decodeEmoji = (text) => {
      try {
        return decodeURIComponent(escape(text));
      } catch (e) {
        // return unescape(text);
      }
    }

    function loadRoutes(driverId) {
        var actualDate = getActualFormattedDate();
        const requestData = new FormData();
        requestData.append('id_enterprise',dataSession.id_enterprise);
        requestData.append('actual_date', actualDate);
        requestData.append('token', dataSession.token);
        requestData.append('id_user_over', dataSession.id_user);
        fetch(`${back_url}api/admin/report/seguimiento_list.php`, {
                method: 'POST',
                body: requestData,
            })
            .then(response => response.json())
            .then(data => {
                const seguimiento_info = data;
                routes = seguimiento_info.data.seguimiento_list;
                events = seguimiento_info.data.event_list;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function openRoute(routeId,status) {
        if(status=="checklist-pending"){
            showAlert('Checklist Pendiente de Autorizar','La lista de requerimientos de ruta está en revisión, podrás inciar la ruta una vez autorizado el checklist.');
        }else{
            goto(`/drivers/${driverId}/routes/${routeId}`);
        }
    }

    function compareDates(start_date) {
        var today = getActualFormattedDate();
        // Extract the date part from route.start_date and set time to midnight
        const routeDateParts = start_date.split(' ')[0];
        //const routeDate = new Date(`${routeDateParts[2]}-${routeDateParts[1]}-${routeDateParts[0]}T00:00:00`);

        // Compare only the date parts
        return today === routeDateParts;
    }

    function changePendingState(status){
        status=="true" ? hasPendingRoutes = true: hasPendingRoutes = false;
        return "";
    }

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    function getDeliveryColor(status) {
        let color = '#ffffff';

        if (status === 'pending') {
            color = '#FAD733';
        }else if (status === 'completed') {
            color = '#27C24C';
        }else if (status == 'enroute'){
            color = '#3BBAC2';
        }else if (status == 'paused'){
            color = '#949DB9';
        }else if (status == 'cancelled'){
            color = '#F05050';
        }else if (status == 'checklist'){
            color = "#F6A833";
        }else if (status == 'checklist-pending'){
            color = "#E98C00";
        }

        return color;
    }

    function setTitleStatus(status) {
        let title_status = '';

        if (status === 'pending') {
            title_status = 'Pendiente';
        }else if (status === 'completed') {
            title_status = 'Completado';
        }else if (status == 'enroute'){
            title_status = 'En ruta';
        }else if (status == 'paused'){
            title_status = 'Pausado';
        }else if (status == 'cancelled'){
            title_status = 'Cancelado';
        }else if (status == 'checklist'){
            title_status = "En checklist"
        }else if (status == 'checklist-pending'){
            title_status = "Pendiente de aprobar checklist"
        }

        return title_status;
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

    function getActualFormattedDate(){
        // Get the current date
        var today = new Date();

        // Get the day of the month
        var dd = today.getDate();

        // Get the month (adding 1 because months are zero-based)
        var mm = today.getMonth() + 1;

        // Get the year
        var yyyy = today.getFullYear();

        // Add leading zero if the day is less than 10
        if (dd < 10) {
            dd = '0' + dd;
        } 

        // Add leading zero if the month is less than 10
        if (mm < 10) {
            mm = '0' + mm;
        } 

        // Format the date as mm-dd-yyyy and log it
        today = yyyy + '-' + mm + '-' + dd;

        return today;
    }

    const logout = () => {
        // Redirect to login page or homepage
        goto('/');
        flag = false;
        // Remove user session from localStorage
        localStorage.removeItem('userSession');
    }


</script>

<style>
    .route-color {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
    }

    .route-symbol {
        text-align: center;
        align-self: center;
        font-size: 30px;
    }

    .total,
    .time {
        color: #86888f;
        font-size: 14px;
    }

    .secret {
        color:#c05cea;
    }
    .fruti {
        color: #338be6
    }
    .berry {
        color: #e82866
    }
    .big {
        color: #e68633
    }
    h3 {
        font-size: 13px;
    }
    .text-muted{
        color: #8e8e8e;
    }
    .mr-10{
        margin-right:10px;
    }
</style>

<svelte:head>
    <title>Rutas - Rutaflow</title>
</svelte:head>
{#if dataSession}
    <IonPage>
        <ion-header translucent>
            <ion-toolbar>
                <ion-buttons slot="secondary">
                <ion-button>{dataSession.name}</ion-button>
                </ion-buttons>
        
                <ion-title>RUTAS DEL DÍA</ion-title>
        
                <ion-buttons slot="primary">
                <ion-button title="Salir" alt="Salir" on:click={logout}><ion-icon icon={logOut}></ion-icon></ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        
        <ion-content>
            <ion-refresher slot="fixed" bind:this={refresher} on:ionRefresh={refresh}>
                <ion-refresher-content pulling-icon="arrow-dropdown"
                                    pulling-text="Jale para actualizar"
                                    refreshing-spinner="circles"
                                    refreshing-text="Actualizando..."></ion-refresher-content>
            </ion-refresher>
            <ion-list>
                {#if driverId=='me' && flag}
                    {#each routes as route (route.id_route)}
                        {#if compareDates(route.date_start)}
                            {changePendingState("true")}
                            {#if route.status != 'completed' && route.status != 'cancelled' && route.status != 'finished'}
                                <ion-item button on:click={openRoute(route.id_route,route.status)}>
                                    <ion-avatar slot="start">
                                        <div class="route-color" style="background-color:{getDeliveryColor(route.status)};color: {getContrast(getDeliveryColor(route.status))}" title="{setTitleStatus(route.status)}">
                                            <div class="route-symbol" style="">
                                                {capitalizeFirstLetter(route.name.charAt(0))}
                                            </div>
                                        </div>
                                    </ion-avatar>
                                    <ion-label>
                                        <h2>{route.name ? route.name.toUpperCase() : ''}</h2>
                                        <h3 class="text-muted">Inicio: {route.date_start}</h3>
                                    </ion-label>
                                    <div slot="end"></div>
                                </ion-item>
                            {:else}
                                {changePendingState("false")}
                            {/if}
                        {:else}
                            {changePendingState("false")}
                        {/if}
                    {/each}
                {:else}
                    <!--Filter by driverId & date-->
                    {#each routes.filter(route => route.id_driver === driverId) as route (route.id_route)}
                        {#if compareDates(route.date_start)}
                            {changePendingState("true")}
                            {#if route.status != 'completed' && route.status != 'cancelled' && route.status != 'finished'}
                                <ion-item button on:click={openRoute(route.id_route,route.status)}>
                                    <ion-avatar slot="start">
                                        <div class="route-color" style="background-color:{getDeliveryColor(route.status)};color: {getContrast(getDeliveryColor(route.status))}" title="{setTitleStatus(route.status)}">
                                            <div class="route-symbol" style="">
                                                {capitalizeFirstLetter(route.name.charAt(0))}
                                            </div>
                                        </div>
                                    </ion-avatar>
                                    <ion-label>
                                        <h2>{route.name}</h2>
                                        <h3 class="text-muted">Inicio: {route.date_start}</h3>
                                    </ion-label>
                                    <div slot="end"></div>
                                </ion-item>
                            {:else}
                                {changePendingState("false")}
                            {/if}
                        {:else}
                            {changePendingState("false")}
                        {/if}
                    {/each}
                {/if}
                {#if !hasPendingRoutes}
                    <ion-grid class="ion-text-center h-full">
                        <ion-row class="h-full items-center">
                            <ion-col class="text-center">
                                <h2 class="text-3xl text-muted mb-4">No hay rutas pendientes para hoy</h2>
                                <p class="text-muted">Espere indicaciones de su supervisor</p>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                {/if}
            </ion-list>
        </ion-content>
    </IonPage>
{/if}
