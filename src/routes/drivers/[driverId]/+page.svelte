<script>
    export let driverId;
    import { page } from "$app/stores";
    import { alertController } from "@ionic/core";
    import { logOut } from "ionicons/icons";
    import { goto } from "$app/navigation";
    import IonPage from "ionic-svelte/components/IonPage.svelte";
    import { DATABASE_URL } from "../../../hooks";
    import { getJson } from "$lib";

    /*Back URL*/
    let back_url = DATABASE_URL;

    let routes = [];
    let events = [];

    let filteredRoutes = [];
    let pendingRoutes = [];
    let hasPendingRoutes = false;
    let flag = false;
    let dataSession = new Object();
    let refresher;
    let selectedFilter = "routes-of-day";

    const refresh = async () => {
        await loadRoutes();
        refresher.complete();
    };

    $: {
        ({ driverId } = $page.params);
        dataSession = JSON.parse(localStorage.getItem("userSession"));
        if (dataSession) {
            if (driverId == "me" && dataSession.id_user) {
                if (
                    dataSession.type == "admin" ||
                    dataSession.type == "super"
                ) {
                    goto(`/drivers/me`);
                    loadRoutes();
                    flag = true;
                } else {
                    showAlert(
                        "Usuario no autorizado",
                        "Este usuario no tiene acceso a la app de Rutaflow, entrar en contacto con soporte"
                    );
                    goto("/");
                }
            } else if (dataSession && driverId) {
                goto(`/drivers/${dataSession.id_driver}`);
                loadRoutes();
                console.log("Volví a entrar 2");
            }
        } else {
            showAlert(
                "Sesión cerrada",
                "Será redireccionado para volver a ingresar"
            );
            goto("/");
        }
    }

    function loadRoutes() {
        const lv = {
            id_enterprise: dataSession.id_enterprise || "null",
            id_user_over: dataSession.id_user,
            token: dataSession.token,
        };

        const filterVal = selectedFilter?.value || selectedFilter;
        const today = getTodayDate();

        if (filterVal === "enroute") {
            lv.status = "enroute";
        } else if (filterVal === "routes-of-day") {
            lv.actual_date = today.today;
        } else if (filterVal === "yesterday-routes") {
            let yesterday = new Date(today.date);
            yesterday.setDate(yesterday.getDate() - 1);
            lv.actual_date = yesterday.toISOString().split("T")[0];
        } else if (filterVal === "week-routes") {
            let monday = new Date(today.date);
            let diff = today.date.getDay() === 0 ? 6 : today.date.getDay() - 1;
            monday.setDate(today.date.getDate() - diff);
            lv.actual_date = monday.toISOString().split("T")[0];
            lv.actual_date2 = today.today;
        }

        getJson(
            `${back_url}api/admin/report/seguimiento_list.php`,
            function (data) {
                routes = data.data.seguimiento_list;
                events = data.data.event_list;

                // Admin sees all routes, drivers only their own
                if (driverId === "me" && flag) {
                    filteredRoutes = routes;
                } else {
                    filteredRoutes = routes.filter(
                        (route) => route.id_driver === driverId
                    );
                }

                // Get only pending ones
                pendingRoutes = filteredRoutes.filter(
                    (route) =>
                        route.status !== "completed" &&
                        route.status !== "cancelled" &&
                        route.status !== "finished"
                );

                hasPendingRoutes = pendingRoutes.length > 0;
            },
            lv
        );
    }

    function openRoute(routeId, status) {
        //Here i need to get the actual status of the route going again to the database to get the actual status
        if (status == "checklist-pending") {
            showAlert(
                "Checklist Pendiente de Autorizar",
                "La lista de requerimientos de ruta está en revisión, podrás inciar la ruta una vez autorizado el checklist."
            );
        } else {
            goto(`/drivers/${driverId}/routes/${routeId}`);
        }
    }

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    function getDeliveryColor(status) {
        let color = "#ffffff";

        if (status === "pending") {
            color = "#FAD733";
        } else if (status === "completed") {
            color = "#27C24C";
        } else if (status == "enroute") {
            color = "#3BBAC2";
        } else if (status == "paused") {
            color = "#949DB9";
        } else if (status == "cancelled") {
            color = "#F05050";
        } else if (status == "checklist") {
            color = "#F6A833";
        } else if (status == "checklist-pending") {
            color = "#E98C00";
        }

        return color;
    }

    function setTitleStatus(status) {
        let title_status = "";

        if (status === "pending") {
            title_status = "Pendiente";
        } else if (status === "completed") {
            title_status = "Completado";
        } else if (status == "enroute") {
            title_status = "En ruta";
        } else if (status == "paused") {
            title_status = "Pausado";
        } else if (status == "cancelled") {
            title_status = "Cancelado";
        } else if (status == "checklist") {
            title_status = "En checklist";
        } else if (status == "checklist-pending") {
            title_status = "Pendiente de aprobar checklist";
        }

        return title_status;
    }

    function getContrast(hexColor) {
        // If a leading # is provided, remove it
        if (hexColor.slice(0, 1) === "#") {
            hexColor = hexColor.slice(1);
        }

        // If a three-character hexcode, make six-character
        if (hexColor.length === 3) {
            hexColor = hexColor
                .split("")
                .map(function (hex) {
                    return hex + hex;
                })
                .join("");
        }

        // Convert to RGB value
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);

        // Get YIQ ratio
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        // Check contrast
        return yiq >= 128 ? "#414040" : "#fff";
    }

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

    function getTodayDate() {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var today = year + "-" + month + "-" + day;

        return { today: today, year: year, month: month, date: date, day: day };
    }
    const logout = () => {
        // Redirect to login page or homepage
        goto("/");
        flag = false;
        // Remove user session from localStorage
        localStorage.removeItem("userSession");
    };
</script>

<svelte:head>
    <title>Rutas - Rutaflow</title>
</svelte:head>
{#if dataSession}
    <IonPage>
        <ion-header translucent>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button class="name-btn" title={dataSession.name}>
                        <span class="name-span">{dataSession.name}</span>
                    </ion-button>
                </ion-buttons>

                <!-- Centered Select Dropdown -->
                <ion-title>
                    <ion-select
                        bind:this={selectedFilter}
                        id="quick-filter"
                        interface="action-sheet"
                        value="routes-of-day"
                        on:ionChange={loadRoutes}
                    >
                        <ion-select-option value="enroute"
                            >Rutas en curso</ion-select-option
                        >
                        <ion-select-option value="routes-of-day"
                            >Rutas del día</ion-select-option
                        >
                        <ion-select-option value="yesterday-routes"
                            >Rutas de ayer</ion-select-option
                        >
                        <ion-select-option value="week-routes"
                            >Rutas de la semana</ion-select-option
                        >
                    </ion-select>
                </ion-title>

                <ion-buttons slot="end">
                    <ion-button title="Salir" alt="Salir" on:click={logout}>
                        <ion-icon icon={logOut} />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

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
                {#if hasPendingRoutes}
                    {#each pendingRoutes as route (route.id_route)}
                        <ion-item
                            button
                            on:click={openRoute(route.id_route, route.status)}
                        >
                            <ion-avatar slot="start">
                                <div
                                    class="route-color"
                                    style="background-color:{getDeliveryColor(
                                        route.status
                                    )};color:{getContrast(
                                        getDeliveryColor(route.status)
                                    )}"
                                    title={setTitleStatus(route.status)}
                                >
                                    <div class="route-symbol">
                                        {capitalizeFirstLetter(
                                            route.name?.charAt(0)
                                        )}
                                    </div>
                                </div>
                            </ion-avatar>
                            <ion-label>
                                <h2>{route.name?.toUpperCase()}</h2>
                                <h3 class="text-muted">
                                    Inicio: {route.date_start}
                                </h3>
                            </ion-label>
                        </ion-item>
                    {/each}
                {:else}
                    <ion-grid class="ion-text-center h-full">
                        <ion-row class="h-full items-center">
                            <ion-col class="text-center">
                                <h2 class="text-3xl text-muted mb-4">
                                    No hay rutas pendientes para hoy
                                </h2>
                                <p class="text-muted">
                                    Espere indicaciones de su supervisor
                                </p>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                {/if}
            </ion-list>
        </ion-content>
    </IonPage>
{/if}

<style>
    .name-btn {
        --max-width: 5rem;
        width: 5rem;
    }
    .name-span {
        display: block;
        --max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        --white-space: nowrap;
        --text-align: center;
    }
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
        color: #c05cea;
    }
    .fruti {
        color: #338be6;
    }
    .berry {
        color: #e82866;
    }
    .big {
        color: #e68633;
    }
    h3 {
        font-size: 13px;
    }
    .text-muted {
        color: #8e8e8e;
    }
    .mr-10 {
        margin-right: 10px;
    }
</style>
