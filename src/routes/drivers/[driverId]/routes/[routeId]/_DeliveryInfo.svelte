<script>
    import BoxesCount from './_BoxesCount.svelte';
    import {page} from '$app/stores';
    import { goto } from '$app/navigation';
    import {documentTextOutline,personOutline,calendarClearOutline,createOutline,
            storefrontOutline,duplicateOutline,locationOutline,informationCircleOutline} from "ionicons/icons"; 
    import {IonicShowModal} from "../../../../../services/IonicControllers";
    import ChecklistControl from './_ChecklistControl.svelte';
    let overlayElement = document.querySelector("ion-modal");
    //console.log(overlayElement.componentProps);
    let delivery = overlayElement.componentProps.delivery;
    let isLast = overlayElement.componentProps.isLast;
    //let checklist = overlayElement.componentProps.checklist;
    let driverComments = delivery.driver_comments?delivery.driver_comments:'';
    let selectedImage = delivery.img?delivery.img:'';
    let img_id = "";

    const handleFileChange = async (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        const compressed_image = await compressImage(file);

        if (compressed_image) {
            const formData = new FormData();
            formData.append('fileToUpload', compressed_image);
            try {
                const response = await fetch('https://app.rutaflow.com/api/admin/manager/upload_img_driver.php', {
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

    const sendEvidence = () => {
        var lv = new Object(); 
        lv.id_route = delivery.id_route;
        lv.id_event = delivery.id_event;
        lv.comments = driverComments.value;
        lv.img = selectedImage;
        lv.img_id = img_id;
        const requestData = new FormData();
        for (const key in lv) {
            requestData.append(key, lv[key]);
        }
        fetch('https://app.rutaflow.com/api/admin/evidence/send_evidence.php', {
                    method: 'POST',
                    body: requestData,
                })
                .then(response => response.json())
                .then(data => {
                    closeModal();
                    var checklist = {};
                    var routeId = lv.id_route;
                    //Show final km and gas inputs
                    if(isLast){
                        showKmGasModal("","",routeId,isLast);
                    }
                })
                .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const showKmGasModal = (checklist,driverId,routeId,isLast) => {
        overlayElement.componentProps.routeId = routeId;
        overlayElement.componentProps.driverId = delivery.id_driver;
        IonicShowModal("modal-km-gas", ChecklistControl, {
            checklist,driverId,routeId,isLast
        }).then((result) => {
            
        });
    };


</script>

<ion-header translucent>
    <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" on:click={closeModal}>Cancelar</ion-button>
        </ion-buttons>
        <ion-title title="{delivery.title}">{delivery.title}</ion-title>
        <ion-buttons slot="end">
          <ion-button on:click={sendEvidence} strong>Confirmar</ion-button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-content fullscreen>
    <ion-list>
        <!-- <ion-item>
            <ion-icon name="gift" slot="start" />
            <ion-label class="ion-text-wrap">
                <p>Boxes</p>
                <BoxesCount {delivery} />
            </ion-label>
        </ion-item> -->
        <ion-item>
            <ion-icon icon={personOutline} slot="start"></ion-icon>
            <ion-label>
                <p>Cliente</p>
                <h2>{delivery.client_name}</h2>
            </ion-label>
        </ion-item>
        {#if delivery.line1 && delivery.line1.trim().length}
            <ion-item href="https://www.google.com/maps/search/?api=1&query={delivery.line1}">
                <ion-icon icon={storefrontOutline} slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <p>Domicilio 1</p>
                    <h2>{delivery.line1}</h2>
                </ion-label>
                <ion-icon icon={locationOutline} slot="end"></ion-icon>
            </ion-item>
            {#if delivery.line2 && delivery.line2.trim().length}
                <ion-item href="https://www.google.com/maps/search/?api=1&query={delivery.line2}">
                    <ion-icon icon={storefrontOutline} slot="start"></ion-icon>
                    <ion-label class="ion-text-wrap">
                        <p>Domicilio 2</p>
                        <h2>{delivery.line2}</h2>
                    </ion-label>
                    <ion-icon icon={locationOutline} slot="end"></ion-icon>
                </ion-item>
            {/if}
        {:else if delivery.line2 && delivery.line2.trim().length}
            <ion-item href="https://www.google.com/maps/searhc/?api=1&query={delivery.line2}">
                <ion-icon icon={storefrontOutline} slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <p>Domicilio 2</p>
                    <h2>{delivery.line2}</h2>
                </ion-label>
                <ion-icon icon={locationOutline} slot="end"></ion-icon>
            </ion-item>
        {/if}
        {#if delivery.comments && delivery.comments.trim().length}
            {#if delivery.comments!='<br>'}
                <ion-item>
                    <ion-icon icon={informationCircleOutline} slot="start"></ion-icon>
                    <ion-label class="ion-text-wrap">
                        <p>Notas de ubicación</p>
                        <h2>{delivery.comments}</h2>
                    </ion-label>
                </ion-item>
            {/if}
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
        <ion-item>
            <ion-icon icon={createOutline} slot="start"></ion-icon>
            <ion-textarea bind:this={driverComments} label="Notas" placeholder="Escribe aquí..."></ion-textarea>
        </ion-item>
        <section>
            <label for="eventEvidence" style="display: block; width: 100%;">
                <ion-button fill="outline" class="loadEvidence" expand="block">
                    <ion-icon icon={duplicateOutline} slot="start"></ion-icon>
                    <label for="eventEvidence" style="padding: 8px 10px">
                        Subir Evidencia
                    </label>
                    <input style="display:none;" id="eventEvidence" name="fileToUpload" type="file" accept="image/*" on:change={handleFileChange}>
                </ion-button>
            </label>
        </section>
        {#if selectedImage}
        <section>
            <ion-img
                src="{selectedImage}"
                alt="Evidencia fotográfica"
                style="max-width: 100%; margin-top: 16px;"
            ></ion-img>
        </section>
        {/if}
        <!-- {#if delivery.subscriber_info}
            <ion-item>
                <ion-icon class:warn={mustCharge(delivery)} name="{delivery.payment_type === 'cash'? 'cash': 'card'}" slot="start" />
                <ion-label class="ion-text-wrap">
                    <p>Payment ({delivery.payment_type === 'cash'? 'cash': 'card'}, ${delivery.payment_pending})</p>
                    <h2>{mustCharge(delivery)? 'Pending, remind client of payment': 'On time'}</h2>
                </ion-label>
            </ion-item>
        {/if}
        {#if delivery.support_list && delivery.support_list.length}
            <ion-item>
                <ion-icon class="alertCircle" name="alert" slot="start" />
                <ion-label class="ion-text-wrap">
                    <p>Support tickets</p>
                    {#each delivery.support_list as ticket (ticket.id_support_log)}
                        <h2>{ticket.action}</h2>
                    {/each}
                </ion-label>
            </ion-item>
        {/if} -->
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