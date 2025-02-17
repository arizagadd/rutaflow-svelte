<script>
    //export let class = '';
    import { alertController } from '@ionic/core';
    import {documentTextOutline, personOutline, paperPlaneOutline,logInOutline, trash, carOutline} from "ionicons/icons"; 
    import {calendarClearOutline,phonePortraitOutline, callOutline,logOutOutline, listOutline, closeSharp} from "ionicons/icons"; 
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
    let isLast = overlayElement.componentProps.isLast || false;
    let OriDesFlag = overlayElement.componentProps.flag || false;
    let driverComments = delivery.driver_comments?delivery.driver_comments:'';
    let dStatus = delivery.deliver_status?delivery.deliver_status:'';
    let selectedImages = delivery.img?delivery.img:'';
    let img_id = delivery.img_id?delivery.img_id:'';
    let files = selectedImages ? getImgsArray(selectedImages) : new Array();
    let img_ids = img_id ? getImgsArray(img_id): new Array();
    let locationData = { latitude: null, longitude: null };
    let stopsApproval = delivery.stopsApproval;
    let smsActive = delivery.smsActive;
    let isLoading = false;
    // Regular expression to match a phone number after "Teléfono:"
    const phoneRegex = /Teléfono:\s*(\d{10,})/;
    // State variables to track button status and times
    let checkInActive = true;
    let checkOutActive = false;
    
    let phoneNumber = '';
    let remainingText = delivery.comments_ext;
    //Deliver status
    let status = '';
    let showMotiveInput = false;
    let motive = '';
    let showModal = false;
    let currentImage = "";
    let dataSession = new Object();
    let deliverStatus = "";


    onMount(() => {
        dataSession = JSON.parse(localStorage.getItem('userSession'));
        setCheckButtons();
    });

    async function getJson(apiUrl="", callback, variables = {}) {
        let formData = new FormData();
        isLoading = true; // Show spinner

        // Append variables to FormData
        for (const [key, value] of Object.entries(variables)) {
            formData.append(key, value);
        }
        formData = addAuthData(formData);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                // Pass the JSON result to the provided callback function
                callback(result);
            } else {
                console.error('Request failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during file upload:', error);
        } finally {
            isLoading = false; // Hide spinner
        }
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
    }

    const showYNAlert = async (customHeader="", customMessage="", url="",func,lv={}) => {
        const alert = await alertController.create({
            header: customHeader || 'Error', // Use customHeader or default value
            message: customMessage || 'Vuelva a intentar', // Use customMessage or default value
            buttons: [
            {
                text: 'No',
                role: 'cancel', // Indicates a cancel action
                handler: () => {
                    //console.log('User selected "No"');
                }
            },
            {
                text: 'Sí',
                handler: () => {
                    getJson(url,func,lv);
                }
            }
        ]
        });

        await alert.present();
    };

    const handleFileChange = async (event) => {
        if (files.length >= 5) {
            showAlert("Límite de evidencias", "Solo se permite subir 5 fotos por parada");
            return;
        }

        if (OriDesFlag && isLast && files.length >= 1) {
            showAlert("Límite de evidencias", "Para el final de la ruta solo se permite subir 1 foto");
            return;
        }

        const fileInput = event.target;
        const file = fileInput.files[0];

        if (!file) return;

        try {
            isLoading = true;
            const compressedFile = await compressImage(file);

            if (compressedFile) {
                // Prepare form data
                const formData = new FormData();
                formData.append("fileToUpload", compressedFile);

                // Async Upload to avoid UI blocking
                fetch(`${back_url}api/admin/manager/upload_img_driver.php`, {
                    method: "POST",
                    body: formData,
                })
                .then(response => response.json())
                .then(result => {
                    selectedImages = selectedImages ? `${selectedImages},${result.img}` : result.img;
                    img_id = img_id ? `${img_id},${result.img_id}` : result.img_id;
                    files = getImgsArray(selectedImages);
                    img_ids = getImgsArray(img_id);
                    isLoading = false;
                })
                .catch(error => console.error("Upload error:", error));
            }
        } catch (error) {
            console.error("Compression error:", error);
        }
    };

    function handleCheckIn(event){
        var service_time = delivery.service_time;
        if(!service_time && checkInActive && !isLast && !OriDesFlag){
            event.preventDefault(); // Prevent the file upload dialog from opening
            showAlert("Registrar Ingreso","Antes de subir la evidencia registra el ingreso a la actual parada.");
        }

    }

    function handleCheckOut(){
        var date = !OriDesFlag ? false:delivery.date_completed;
        if(!date && !checkInActive && checkOutActive && !isLast && !OriDesFlag){
            var lv = new Object();
            lv.id_event = delivery.id_event;
            lv.type = "checkout";
            showYNAlert("Registrar Salida","¿Completaste tu entrega?",back_url+"api/admin/route/record_check_date.php",function(result){
                if(result.minutes){
                    showAlert('Tiempo por parada','Completaste la parada en '+result.minutes+' minutos.');
                }
            },lv);
        }

    }

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file); // More memory efficient

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

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
                canvas.toBlob((blob) => {
                    resolve(blob);
                    // Clean up memory
                    URL.revokeObjectURL(img.src);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }, 'image/jpeg', 0.7);
            };
        });
    };


    const closeModal = () => {
        overlayElement.dismiss({ data: Date.now() });
    };

    function removeFile(index) {
        files = files.filter((_, i) => i !== index);
    }

    const sendEvidence = async () => {
        try {
            isLoading = true;
            selectedImages = files.join(',');
            img_id = img_ids.join(',');
            //To record checkOut date
            handleCheckOut();
            // Get location ** this lasts some minutes so i need to put a loader upon **
            const flag = await getLocation();

            if (flag) {
                if(deliverStatus.value=="delivered" || (deliverStatus.value!=="delivered" && (driverComments.value || delivery.driver_comments)) || OriDesFlag && isLast){
                    // Create an object to store evidence details
                    const lv = {
                        id_route: delivery.id_route,
                        ...(!OriDesFlag && !isLast && {id_event: delivery.id_event}),
                        ...(!OriDesFlag && !isLast && {comments: driverComments.value}),
                        ...(!OriDesFlag && !isLast && {deliver_status: deliverStatus.value}),
                        img: selectedImages,
                        img_id: img_id,
                        lat: locationData.latitude,
                        lon: locationData.longitude,
                        ...(stopsApproval === "0" && { approve: "0" }),
                        ...(isLast && { isLast: true }),
                        ...(OriDesFlag && isLast && {destiny: true})
                    };
                    
                    if((lv.img && lv.img_id) || (selectedImages)){
                        // Send the evidence data
                        getJson(`${back_url}api/admin/evidence/send_evidence.php`,function(result){
                            if(result.success == true){
                                const routeId = lv.id_route;
                                //Close delivery modal
                                closeModal();
                                // Show final km and gas inputs if it is the last
                                if (isLast) {
                                    showKmGasModal("", "", routeId, isLast);
                                }
                                isLoading = false;
                            }else{
                                showAlert("Carga fallida","Actualiza la página y vuelve a intentar cargar la información!");
                            }
                        },lv);

                    }else{
                        showAlert('Información incompleta','Cargar evidencia fotográfica faltante para completar parada.');
                    }
                }else{
                    showAlert("Motivo de status de entrega","Favor de ingresar en notas el motivo por el que la entrega no fue entregada correctamente");
                }

            } else {
                showAlert("Ubicación faltante","Asegúrate darle permisos a Rutaflow para acceder a tu ubicación");
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
        let formData = new FormData();
        formData.append('client_phone', phoneNumber);
        formData.append('client_name', delivery.title);
        formData.append('delivery_phone', delivery.client_phone);
        formData.append('enterprise_name', delivery.enterprise_name);
        formData = addAuthData(formData);
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
            let formData = new FormData();
            formData.append('type', type);
            formData.append('id_event', id_event);
            formData = addAuthData(formData);
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

    function getImgsArray(stringImg='') {
        // Split the input string by commas and trim any extra whitespace from each URL
        const imgArray = stringImg.split(',').map(url => url.trim());
        return imgArray;
    }

    const openImage = (image) => {
        currentImage = image;
        showModal = true;
    };

    const closeImgModal = () => {
        showModal = false;
        currentImage = "";
    };

    function addAuthData(requestData){
        requestData.append('token', dataSession.token);
        requestData.append('id_user_over', dataSession.id_user);

        return requestData;
    }

</script>


<ion-header translucent>
    <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" on:click={closeModal}>Cerrar</ion-button>
        </ion-buttons>
        <ion-title style="text-align: center;" title="{delivery.title}">{delivery.title}</ion-title>
        {#if (!isLast && !OriDesFlag) || (isLast && OriDesFlag)}
            <ion-buttons slot="end">
                <ion-button on:click={sendEvidence} strong>Confirmar</ion-button>
            </ion-buttons>
        {/if}
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
        
        {#if showMotiveInput}
            <ion-item>
                <ion-icon icon={listOutline} slot="start"></ion-icon>
                <ion-textarea bind:this={motive} placeholder="Escribe el motivo..."></ion-textarea>
            </ion-item>
        {/if}
        {#if !OriDesFlag}
            <ion-item>
                <ion-icon icon={carOutline} slot="start"></ion-icon>
                <ion-select bind:this={deliverStatus} value={dStatus?dStatus:'delivered'}>
                <div slot="label">Estado de entrega</div>
                <ion-select-option value="delivered">Entregado</ion-select-option>
                <ion-select-option value="notdelivered">No Entregado</ion-select-option>
                <ion-select-option value="partialdeliver">Entrega Parcial</ion-select-option>
                </ion-select>
            </ion-item>
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
        {/if}
        {#if (isLast && OriDesFlag) || (!isLast && !OriDesFlag)}
            <section style="display: flex; gap: 8px; padding: 0px 16px;">
                <!-- <label for="eventEvidence" style="display: block; width: 100%;"> -->
                    <ion-button fill="outline" class="loadEvidence" style="flex: 1;" >
                        <ion-icon icon={duplicateOutline} slot="start"></ion-icon>
                        <label for="eventEvidence">
                            Subir Evidencia
                        </label>
                        <input style="display:none;" id="eventEvidence" name="fileToUpload" type="file" multiple accept="image/*" capture="environment" on:change={handleFileChange} on:click={handleCheckIn}>
                    </ion-button>
                <!-- </label> -->
            </section>
        {/if}
        {#if selectedImages}
        <section>
            <div class="image-grid" style="display: grid;grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));gap: 10px;padding: 0px 10px;">
                    {#each files as file, index}
                    <div class="image-container" style="position: relative;">
                        <ion-img
                            src="{file}"
                            alt="Evidencia fotográfica"
                            style="width: 100%;height: 100px; object-fit:cover;cursor: pointer;border: 1px solid #ccc;border-radius: 4px;margin-top: 16px;"
                            on:click={() => openImage(file)}
                        ></ion-img>
                        <button class="remove-button" on:click={() => removeFile(index)} 
                            style="position: absolute;top: 5px;right: 5px;border:none;cursor: pointer;font-size: 18px;background: white;border-radius: 50%;padding: 3px 4px 0px;box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);color: #0000008f;">
                            <ion-icon icon={trash}></ion-icon>
                        </button>
                        </div>
                    {/each}
            </div>
        </section>
        {/if}

    </ion-list>
</ion-content>
{#if isLoading}
    <div class="overlay" style="position: fixed;
                                top: 0;
                                left: 0;
                                width: 100vw;
                                height: 100vh;
                                background: rgba(0, 0, 0, 0.5);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                z-index: 9999;">
        <ion-spinner name="dots" style="color:white;"></ion-spinner>
    </div>
{/if}
{#if showModal}
    <div class="modal-overlay" on:click={closeImgModal} 
        style="position: fixed;top: 0;left: 0;width: 100vw;height: 100vh; background: rgba(0, 0, 0, 0.8);display: flex;justify-content: center;align-items: center;z-index: 1000;">
        <div class="modal-content" on:click|stopPropagation
            style="position: relative;background: white;padding: 20px;border-radius: 8px;max-width: 90vw;max-height: 90vh;overflow: auto;">
            <ion-img src="{currentImage}" alt="Evidencia fotográfica" style="width:100%; height:auto;"></ion-img>
            <button class="close-button" on:click={closeImgModal} style="position: absolute;top: 5px;right: 5px;background: white;color: #444444d1;border: none;cursor: pointer;padding: 2px 2px 0px 6px;border-radius: 50%;font-size: 20px;">
                <ion-icon icon={closeSharp}></ion-icon>
            </button>
        </div>
    </div>
{/if}