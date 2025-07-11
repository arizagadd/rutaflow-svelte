<script>
    // Import the necessary components from Ionic
    import IonInput from "../components/IonInput.svelte";
    import { alertController } from "@ionic/core";
    import IonPage from "ionic-svelte/components/IonPage.svelte";
    import authStore from "../stores/authStore";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { DATABASE_URL } from "../hooks";

    /*Back URL*/
    let back_url = DATABASE_URL;

    let data = {};
    let dataSession = new Object();

    $: {
        dataSession = JSON.parse(localStorage.getItem("userSession"));
        if (dataSession) {
            if (
                dataSession.id_user &&
                (dataSession.type == "admin" || dataSession.type == "super")
            ) {
                goto(`/drivers/me`);
            } else if (dataSession.id_user && dataSession.id_driver) {
                goto(`/drivers/${dataSession.id_driver}`);
            }
        } else {
            goto("/");
        }
    }

    // This will clear all localStorage when the page loads
    onMount(() => {
        localStorage.clear();
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const showAlert = async () => {
            const alert = await alertController.create({
                header: "Datos inválidos",
                message:
                    "El correo/teléfono o la contraseña son incorrectos, vuelva a intentar",
                buttons: [
                    {
                        text: "Cerrar",
                    },
                ],
            });

            await alert.present();
        };

        const showAlertNoDriver = async () => {
            const alert = await alertController.create({
                header: "Sin perfil de operador",
                message: "Su cuenta no cuenta con un perfil de operador creado",
                buttons: [
                    {
                        text: "Cerrar",
                    },
                ],
            });

            await alert.present();
        };

        const requestData = new FormData();
        requestData.append("email", data.email);
        requestData.append("pass", data.password);
        return fetch(`${back_url}api/admin/user/user_login.php`, {
            method: "POST",
            body: requestData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.nodos.length) {
                    const userData = data.nodos[0];
                    localStorage.setItem(
                        "userSession",
                        JSON.stringify(userData)
                    );
                    authStore.set({
                        resolved: true,
                        id: userData.id_driver ? userData.id_driver : "me",
                        user: {
                            userData,
                        },
                    });

                    if (userData.id_driver) {
                        goto(`/drivers/${userData.id_driver}`);
                    } else {
                        goto(`/drivers/me`);
                        showAlertNoDriver();
                    }

                    //redireccionar al index de drivers
                } else {
                    showAlert();
                }
            })
            .catch((e) => {
                showAlert();
            });
    };
</script>

<ion-app color-mode="light">
    <ion-content class="login-content" padding>
        <ion-row class="logo-row">
            <ion-col />
            <ion-col class="w-80 text-center">
                <img src="/rutaflow.png" alt="Rutaflow" />
            </ion-col>
            <ion-col />
        </ion-row>
        <div class="login-box">
            <form on:submit={handleSubmit}>
                <ion-row>
                    <ion-col>
                        <ion-list>
                            <ion-item>
                                <IonInput
                                    bind:value={data.email}
                                    type="text"
                                    placeholder="Correo o Teléfono"
                                    name="email"
                                    required
                                />
                            </ion-item>

                            <ion-item>
                                <IonInput
                                    bind:value={data.password}
                                    type="password"
                                    placeholder="Contraseña"
                                    name="password"
                                    required
                                />
                            </ion-item>
                        </ion-list>
                    </ion-col>
                </ion-row>

                <ion-row>
                    <ion-col class="signup-col">
                        <ion-button
                            class="submit-btn"
                            color="#2c83d3"
                            expand="block"
                            type="submit">Ingresar</ion-button
                        >
                    </ion-col>
                </ion-row>
            </form>
        </div>
    </ion-content>
</ion-app>

<style>
    .submit-btn {
        background-color: #2c83d3 !important;
    }
    .logo-row {
        margin-top: 20px;
    }

    .login-box {
        margin-top: 50px;
    }
    .w-80 img {
        width: 80% !important;
    }
    @media (max-width: 768px) {
        .w-80 img {
            width: 100% !important;
        }
    }
    .text-center {
        text-align: center !important;
    }
</style>
