<script>
    //import BoxesCount from './_BoxesCount.svelte';
    import { alertController } from '@ionic/core';
    import {documentTextOutline, personOutline, paperPlaneOutline,logInOutline, todayOutline} from "ionicons/icons"; 
    import {calendarClearOutline,phonePortraitOutline, callOutline,logOutOutline, listOutline} from "ionicons/icons"; 
    import {createOutline} from "ionicons/icons"; 
    import {storefrontOutline} from "ionicons/icons";
    import {duplicateOutline} from "ionicons/icons"; 
    import {locationOutline} from "ionicons/icons";
    import {informationCircleOutline} from "ionicons/icons";
    import {IonicShowModal} from "../../../../../services/IonicControllers";
    import ChecklistControl from './_ChecklistControl.svelte';
    import {onMount} from 'svelte';
    import {DATABASE_URL} from '../../../../../hooks';
    /*Back URL*/
    let back_url = DATABASE_URL;
    
    let overlayElement = document.querySelector("ion-modal");
    let delivery = overlayElement.componentProps.delivery;
    let isLast = overlayElement.componentProps.isLast;
    let driverComments = delivery.driver_comments?delivery.driver_comments:'';
    let selectedImage = delivery.img?delivery.img:'';
    let img_id = "";
    let locationData = { latitude: null, longitude: null };
    let settings = new Object();
    let stopsApproval = "";
    let smsActive = "";
    let isLoading = false;
    // Regular expression to match a phone number after "Teléfono:"
    const phoneRegex = /Teléfono:\s*(\d{10,})/;
    // State variables to track button status and times
    let checkInActive = true;
    let checkOutActive = false;
    
    let phoneNumber = "";
    let remainingText = delivery.comments_ext;
    //Deliver status
    let status = "";
    let showMotiveInput = false;
    let motive = "";

    onMount(() => {
        checkSettings();
        setCheckButtons();
    });

    // Function to handle status selection
    function handleStatusChange(event) {
        status = event.detail.value;
        showMotiveInput = (status === "No entregado" || status === "Entrega Parcial");
    }

    function setCheckButtons(){
        if(!delivery.date_service){
            checkInActive = true;
            checkOutActive = false;
        }else if(delivery.date_service && !delivery.date_completed && !delivery.service_time){
            checkInActive = false;
            checkOutActive = true;
        }else if(delivery.date_service && delivery.date_completed && delivery.service_time){
            checkInActive = false;
            checkOutActive = false;
        }
    }
    
    if (delivery.comments_ext) {
        const match = delivery.comments_ext.match(phoneRegex);
        if (match) {
        phoneNumber = match[1]; // Extract the phone number
        remainingText = delivery.comments_ext.replace(phoneRegex, '').trim(); // Remove the phone part
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

    const handleFileChange = async (event) => {
        isLoading = true; // Show spinner
        const fileInput = event.target;
        const file = fileInput.files[0];
        const compressed_file = await compressImage(file);

        if (compressed_file) {
            const formData = new FormData();
            formData.append('fileToUpload', compressed_file);
            try {
                const response = await fetch(`${back_url}api/admin/manager/upload_img_driver.php`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    // File uploaded successfully, handle any additional logic
                    const result = await response.json();
                    selectedImage = result.img;
                    img_id = result.img_id;
                    
                    //console.log(selectedImage);
                } else {
                    // Handle error response
                    console.error('File upload failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during file upload:', error);
            } finally {
                isLoading = false; // Hide spinner
            }
        }

    };

    const compressImage = async (file) => {
        return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set the canvas size to a reasonable value
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

                // Get the compressed data as a Blob
                canvas.toBlob((blob) => {
                            resolve(blob);
                }, 'image/jpeg', 0.7); // Adjust the quality as needed
            };
        };

        reader.readAsDataURL(file);
        });
    };

    const closeModal = () => {
        overlayElement.dismiss({ data: Date.now() });
    };

    const sendEvidence = async () => {
        try {
            // Get location
            const flag = await getLocation();
            
            if (flag) {
                // Create an object to store evidence details
                const lv = {
                    id_route: delivery.id_route,
                    id_event: delivery.id_event,
                    comments: driverComments.value,
                    img: selectedImage,
                    img_id: img_id,
                    lat: locationData.latitude,
                    lon: locationData.longitude,
                    ...(stopsApproval === "0" && { approve: "0" }),
                    ...(isLast && { isLast: true })
                };

                // Create FormData from the object
                const requestData = new FormData();
                for (const key in lv) {
                    requestData.append(key, lv[key]);
                }

                console.log(requestData);

                if(lv.img && lv.img_id){
                    // Send the evidence data
                    const response = await fetch(`${back_url}api/admin/evidence/send_evidence.php`, {
                        method: 'POST',
                        body: requestData
                    });
                }else{
                    showAlert('Información incompleta','Cargar evidencia fotográfica faltante para completar parada.');
                }

                

            } else {
                //console.log("No entré");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const showKmGasModal = (checklist,driverId,routeId,isLast) => {
        overlayElement.componentProps.routeId = routeId;
        overlayElement.componentProps.driverId = delivery.id_driver;
        IonicShowModal("modal-km-gas", ChecklistControl, {
            checklist,driverId,routeId,isLast
        }).then((result) => {
            
        });
    };

    // Function to get the location
    const getLocation = async () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser");
            return false;
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    locationData.latitude = position.coords.latitude;
                    locationData.longitude = position.coords.longitude;
                    resolve(true);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    resolve(false); // Resolve with false if there's an error
                }
            );
        });
    };

    async function sendSMS(event){
        // Stop the click event from propagating to the ion-item
        event.stopPropagation();
        // Create FormData from the object
        const formData = new FormData();
        formData.append('client_phone', phoneNumber);
        formData.append('client_name', delivery.title);
        formData.append('delivery_phone', delivery.client_phone);
        formData.append('enterprise_name', delivery.enterprise_name);
        try {
            // Send the evidence data
            const response = await fetch(`${back_url}api/admin/message_central/send_sms.php`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                // File uploaded successfully, handle any additional logic
                const result = await response.json();
               
                showAlert('SMS enviado','Se envío correctamente un SMS a '+delivery.title+' con número de teléfono: '+phoneNumber);
            } else {
                showAlert('SMS no enviado','Hubo un error al enviar SMS a '+delivery.title+' con número de teléfono: '+phoneNumber0+'. Por favor contacte a soporte.');
            }
            } catch (error) {
                console.error('Error during file upload:', error);
            }
    }

    const checkSettings = async (event) => {
        

        if (delivery.id_enterprise) {
            const formData = new FormData();
            formData.append('id_enterprise', delivery.id_enterprise);
            try {
                const response = await fetch(`${back_url}api/admin/enterprise/enterprise_settings.php`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    // File uploaded successfully, handle any additional logic
                    const result = await response.json();
                    settings = result.nodos;

                    // Get specific settings
                    stopsApproval = getSettingVal("stops_wait_approval", settings);
                    smsActive = getSettingVal("sms_active", settings);
                    
                } else {
                    // Handle error response
                    console.error('File upload failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during file upload:', error);
            }
        }

    };

    function getSettingVal(alias, settings) {
        for (let i = 0; i < settings.length; i++) {
            if (settings[i].alias === alias) {
                return settings[i].val;
            }
        }
        return ""; // Default value if no match found
    }

    // Function to handle check-in
    function checkIn() {
        checkInActive = false;  // Hide "Ingreso"
        checkOutActive = true;  // Show "Salida"
        sendCheckInCheckOut(delivery.id_event, "checkin");
    }

    // Function to handle check-out
    function checkOut() {
        checkOutActive = false;  // Disable "Salida"
        checkInActive = false;   // Keep "Ingreso" hidden
        sendCheckInCheckOut(delivery.id_event, "checkout");
    }

    async function sendCheckInCheckOut(id_event,type) {
        if (type) {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('id_event', id_event);
            try {
                const response = await fetch(`${back_url}api/admin/route/record_check_date.php`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    // File uploaded successfully, handle any additional logic
                    const result = await response.json();
                    if(result.minutes){
                        showAlert('Tiempo por parada','Completaste la parada en '+result.minutes+' minutos.');
                    }
                } else {
                    // Handle error response
                    console.error('File upload failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during file upload:', error);
            } finally {
                //isLoading = false; // Hide spinner
            }
        }

    };


</script>

<ion-header translucent>
    <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" on:click={closeModal}>Cancelar</ion-button>
        </ion-buttons>
        <ion-title style="text-align: center;" title="{delivery.title}">{delivery.title}</ion-title>
        <ion-buttons slot="end">
          <ion-button on:click={sendEvidence} strong>Confirmar</ion-button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-content fullscreen>
    <ion-list>
        <ion-item>
            <ion-icon icon={personOutline} slot="start"></ion-icon>
            <ion-label>
                <p>Negocio</p>
                <h2>{delivery.client_name}</h2>
            </ion-label>
        </ion-item>
        {#if delivery.client_phone && delivery.client_phone.trim().length}
            <ion-item href="tel:{delivery.client_phone}">
                <ion-icon icon={phonePortraitOutline} slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <p>Teléfono de Negocio</p>
                    <h2>{delivery.client_phone}</h2>
                </ion-label>
            </ion-item>
        {/if}
        {#if delivery.line1 && delivery.line1.trim().length}
            <ion-item href="https://www.google.com/maps/search/?api=1&query={delivery.line1}">
                <ion-icon icon={storefrontOutline} slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <p>Domicilio</p>
                    <h2>{delivery.line1}</h2>
                </ion-label>
                <ion-icon icon={locationOutline} slot="end"></ion-icon>
            </ion-item>
            {#if delivery.line2 && delivery.line2.trim().length}
                <ion-item href="https://www.google.com/maps/search/?api=1&query={delivery.line2}">
                    <ion-icon icon={storefrontOutline} slot="start"></ion-icon>
                    <ion-label class="ion-text-wrap">
                        <p>Domicilio Alternativo</p>
                        <h2>{delivery.line2}</h2>
                    </ion-label>
                    <ion-icon icon={locationOutline} slot="end"></ion-icon>
                </ion-item>
            {/if}
        {:else if delivery.line2 && delivery.line2.trim().length}
            <ion-item href="https://www.google.com/maps/searhc/?api=1&query={delivery.line2}">
                <ion-icon icon={storefrontOutline} slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <p>Domicilio Alternativo</p>
                    <h2>{delivery.line2}</h2>
                </ion-label>
                <ion-icon icon={locationOutline} slot="end"></ion-icon>
            </ion-item>
        {/if}
        {#if phoneNumber}
            <ion-item>
                <ion-icon icon={callOutline} slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <p>Contacto del Cliente</p>
                    <h2>{phoneNumber}</h2>
                </ion-label>
                <!-- Button to send SMS, preventing ion-item href action -->
                {#if smsActive && smsActive === "1"}
                    <ion-button fill="outline" on:click={sendSMS} style="margin-left: 16px;">
                        <ion-icon icon={paperPlaneOutline} slot="start"></ion-icon>
                        Notificar Cliente
                    </ion-button>
                {/if}
            </ion-item>
        {/if}
        {#if remainingText && remainingText !== '<br>'}
            <ion-item>
                <ion-icon icon={informationCircleOutline} slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                <p>Notas de ubicación</p>
                <h2>{remainingText}</h2>
                </ion-label>
            </ion-item>
        {/if}
        {#if delivery.schedule && delivery.schedule.trim().length}
            <ion-item>
                <ion-icon icon={calendarClearOutline} slot="start"></ion-icon>
                <ion-label>
                    <p>Horarios</p>
                    <h2>{delivery.schedule}</h2>
                </ion-label>
            </ion-item>
        {/if}
        {#if delivery.driver_comments}
            <ion-item>
                <ion-icon icon={documentTextOutline} slot="start"></ion-icon>
                <ion-label>
                    <p>Notas del operador</p>
                    <h2>{delivery.driver_comments}</h2>
                </ion-label>
            </ion-item>
        {/if}
        {#if delivery.logistic_comments && delivery.logistic_comments.trim().length}
            {#if delivery.logistic_comments!='<br>'}
                <ion-item>
                    <ion-icon icon={informationCircleOutline} slot="start"></ion-icon>
                    <ion-label class="ion-text-wrap">
                        <p>Comentarios logísticos</p>
                        <h2>{delivery.logistic_comments}</h2>
                    </ion-label>
                </ion-item>
            {/if}
        {/if}
        <!-- <ion-item>
            <ion-icon icon={todayOutline} slot="start"></ion-icon>
            <ion-select placeholder="Selecciona estado de entrega" on:ionChange={handleStatusChange} value={status}>
                <ion-select-option value="Completado">Completado</ion-select-option>
                <ion-select-option value="No entregado">No entregado</ion-select-option>
                <ion-select-option value="Entrega Parcial">Entrega Parcial</ion-select-option>
            </ion-select>
        </ion-item> -->
        
        {#if showMotiveInput}
            <ion-item>
                <ion-icon icon={listOutline} slot="start"></ion-icon>
                <ion-textarea bind:this={motive} placeholder="Escribe el motivo..."></ion-textarea>
            </ion-item>
        {/if}
        <ion-item>
            <ion-icon icon={createOutline} slot="start"></ion-icon>
            <ion-textarea bind:this={driverComments} label="Notas" placeholder="Escribe aquí..."></ion-textarea>
        </ion-item>
        <!-- Check-In and Check-Out Buttons -->
        <section style="display: flex; gap: 8px; padding: 16px 16px 6px;">
            {#if checkInActive === true}
                <ion-button 
                    id="checkInBtn" 
                    style="flex: 1;" 
                    on:click={checkIn}
                >
                    <ion-icon icon={logInOutline} slot="start"></ion-icon>
                    Ingreso
                </ion-button>
            {/if}

            {#if checkOutActive === true || (checkOutActive === false && checkInActive === false)}
                <ion-button 
                    id="checkOutBtn" 
                    style="flex: 1;" 
                    on:click={checkOut} 
                    disabled={checkOutActive === false}
                >
                    <ion-icon icon={logOutOutline} slot="start"></ion-icon>
                    Salida
                </ion-button>
            {/if}
        </section>
        <section style="display: flex; gap: 8px; padding: 0px 16px;">
            <!-- <label for="eventEvidence" style="display: block; width: 100%;"> -->
                <ion-button fill="outline" class="loadEvidence" style="flex: 1;" >
                    <ion-icon icon={duplicateOutline} slot="start"></ion-icon>
                    <label for="eventEvidence">
                        Subir Evidencia
                    </label>
                    <input style="display:none;" id="eventEvidence" name="fileToUpload" type="file" accept="image/*" on:change={handleFileChange}>
                </ion-button>
            <!-- </label> -->
        </section>
        {#if isLoading}
        <section style="text-align:center;">
            <ion-spinner name="dots"></ion-spinner>
        </section>
        {/if}
        {#if selectedImage}
        <section>
            <ion-img
                src="{selectedImage}"
                alt="Evidencia fotográfica"
                style="max-width: 100%; margin-top: 16px;"
            ></ion-img>
        </section>
        {/if}

    </ion-list>
</ion-content>
<!-- <ion-footer>
    <ion-toolbar>
        <ion-item target="_blank" href="https://www.google.com/maps/search/?api=1&query={delivery.lat}%2C{delivery.lon}">
            <ion-label class="ion-text-wrap">
                <h2>Mostrar ubicación</h2>
            </ion-label>
        </ion-item>
    </ion-toolbar>
</ion-footer> -->
<!-- <style>

</style> -->