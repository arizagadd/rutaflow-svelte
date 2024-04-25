<script>
    import BoxesCount from './_BoxesCount.svelte';
    import { checklistStore } from '../../../../../stores/checklistStore';
    import { alertController } from '@ionic/core';
    import IonPage from 'ionic-svelte/components/IonPage.svelte';
    import * as allIonicIcons from 'ionicons/icons';
    import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

    let overlayElement = document.querySelector("ion-modal");
    //console.log(overlayElement.componentProps);
    const checklist = overlayElement.componentProps.checklist;
    const driverId = overlayElement.componentProps.driverId;
    const routeId = overlayElement.componentProps.routeId;
    const isLast = overlayElement.componentProps.isLast;

    let initial_km = null;
    let initial_gas = null;
    let final_km = null;
    let final_gas = null;
    let checkk = [];
    let evidenceChecklist=null;
    // checklist trae las img en caso de que existan, declarar selectedImage como objeto
    let selectedImages = {};
    let imagesName = {};

    onMount(() => {
        if(isLast){
            console.log(routeId);
        }else{
            // guardar en store.items del checklistStore el valor de checklist (el total de checklist por ruta)
            checklistStore.update(store => {
                store.items = getChecklistArray(checklist);
                return store;
            });
        }
        
    });

    const alertIncompleteChecklist = async () => {
		const alert = await alertController.create({
			header: 'Datos o checklist incompletos',
			message: 'Carga la evidencia requerida y marca todas las casillas para confirmar',
			buttons: [
                {
                    text: 'Cerrar'
                }
			]
		});
	
		await alert.present();
	};

    const alertDataSent = async () => {
		const alert = await alertController.create({
			header: 'Datos capturados',
			message: 'El kilometraje y gasolina final fueron registrados correctamente, espere aprobación para finalizar ruta',
			buttons: [
                {
                    text: 'Cerrar'
                }
			]
		});
	
		await alert.present();
	};

    const alertInitialValues = async (u) => {
		const alert = await alertController.create({
			header: 'Datos inválidos',
			message: u=="km"?'Llena correctamente el campo de kilometraje inicial':'Llena correctamente el campo de gasolina inicial',
			buttons: [
                {
                    text: 'Cerrar'
                }
			]
		});
	
		await alert.present();
	};

    function getChecklistArray(obj) {

        // Ensure obj is an object or an array and not null
        if ((typeof obj === 'object' && obj !== null) || Array.isArray(obj)) {
            // If obj is an array, collect IDs from each object in the array
            if (Array.isArray(obj)) {
                return obj.map(item => getChecklistArray(item)).flat();
            } else {
                // Get the keys (property names) of the object
                const keys = Object.keys(obj);

                // Filter keys that are likely to be IDs (customize this based on your object structure)
                const idKeys = keys.filter(key => key.toLowerCase().includes('id_checklist_event'));

                // Extract the values corresponding to the identified ID keys
                const idValues = idKeys.map(key => obj[key]);

                return idValues;
            }
        } else {
            console.error('Invalid input. Please provide a valid object or array.');
            return [];
        }
    }

    const closeOverlay = () => {
        overlayElement.dismiss({ data: Date.now() });
        if(driverId){
            goto(`/drivers/${driverId}`);
        }else{
            goto(`/drivers/me`)
        }
    };
    const sendEvidence = () => {
        if(isLast){
            var fin_km = transformFormatValue(final_km.focusedValue,"km");
            var fin_gas = transformFormatValue(final_gas.focusedValue,"gas");
            const formData = new FormData();
            formData.append(`km_final`,fin_km);
            formData.append(`gas_final`,fin_gas);
            formData.append(`id_route`,routeId);
            
            if(fin_km && fin_gas){
                //cerrar modal
                closeOverlay();
                
                fetch('https://rutaflow-app-development.up.railway.app/api/admin/checklist/add_evidence.php', {
                    method: 'POST',
                    body: formData,
                    })
                    .then(response => response.json())
                    .then(data => {
                        alertDataSent();
                    })
                    .catch(error => {
                    console.error('Error fetching data:', error);
                });
            }else{
                alertIncompleteChecklist();
            }
        }else{
            var ini_km = transformFormatValue(initial_km.focusedValue,"km");
            var ini_gas = transformFormatValue(initial_gas.focusedValue,"gas");
            checklistStore.update(store => {
                const itemIds = store.items;

                // Check if all expected indices are present in the checkedIndices array
                const allChecked = itemIds.every(id => store.checkedIndices.includes(id));

                if (allChecked && ini_km && ini_gas) {
                    closeOverlay();
                    const formData = new FormData();

                    // Iterate over the selectedImages object
                    for (const key in selectedImages) {
                        if (selectedImages.hasOwnProperty(key)) {
                            const { img, img_id } = selectedImages[key]; // Destructure img and img_id from the selectedImages[key] object
                            formData.append(`selectedImages[${key}][img]`, img); // Append the image URL
                            formData.append(`selectedImages[${key}][img_id]`, img_id); // Append the image ID
                        }
                    }
                    formData.append(`km_inicial`,ini_km);
                    formData.append(`gas_inicial`,ini_gas);
                    formData.append(`id_route`,routeId);
                    fetch('https://rutaflow-app-development.up.railway.app/api/admin/checklist/add_evidence.php', {
                        method: 'POST',
                        body: formData,
                        })
                        .then(response => response.json())
                        .then(data => {
                            changeRouteStatus(routeId, 'enroute');
                        })
                        .catch(error => {
                        console.error('Error fetching data:', error);
                    });
                    //goto(`/drivers/${driverId}/routes/${routeId}`);
                    //window.location.reload();
                } else {
                    alertIncompleteChecklist();
                }

                return store;
            });
        }
    };

    const handleFileChange = async (event, checklistItemId) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        const compressed_file = await compressImage(file);

        if (compressed_file) {
            const formData = new FormData();
            formData.append('fileToUpload', compressed_file);
            try {
                const response = await fetch('https://rutaflow-app-development.up.railway.app/api/admin/manager/upload_img_driver.php', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    // File uploaded successfully, handle any additional logic
                    const result = await response.json();

                    selectedImages = {
                        ...selectedImages,
                        [checklistItemId]: {
                            img: result.img, // Store the image URL
                            img_id: result.img_id // Store the image ID
                        }
                    };
                    imagesName = {
                        ...imagesName,
                        [checklistItemId]: result.filename,
                    };
                    console.log(selectedImages);
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

    const markCheckbox = (id) => {
        checklistStore.update(store => {
            const existingIndex = store.checkedIndices.indexOf(id);

            if (existingIndex === -1) {
                // The ID is not in the array, add it
                store.checkedIndices.push(id);
            } else {
                // The ID is already in the array, you may want to handle this case
                console.error(`ID ${id} is already checked.`);
            }

            // Mark the corresponding checkbox in the items array
            store.items.forEach(item => {
                if (item.id_checklist_event === id) {
                    item.checked = true;
                }
            });

            return store;
        });
    };

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
                    //console.log(data);
                })
                .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function transformFormatValue(value,u){
        // Check if the value contains only numeric characters
        if (/^\d+$/.test(value)) {
            // Convert the string value to an integer
            const intValue = parseInt(value, 10);
            return intValue;
        } else {
            // If the value contains non-numeric characters, return null or handle the error accordingly
            alertInitialValues(u);
            return null;
        }
    }

</script>

<ion-header translucent>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" on:click={closeOverlay}>Cancelar</ion-button>
      </ion-buttons>
      <ion-title>Requerimientos de ruta</ion-title>
      <ion-buttons slot="end">
        <ion-button on:click={sendEvidence} strong>Confirmar</ion-button>
      </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-content fullscreen>
    <ion-list>
        {#if isLast}
            <ion-item>
                <ion-input class="fin-km" type="number" label="Kilometraje final" labelPlacement="stacked" placeholder="Ingresa kilometraje actual" bind:this={final_km}  required></ion-input>
            </ion-item>
            <ion-item>
                <ion-input class="fin-km" type="number" label="Gasolina final (litros)" labelPlacement="stacked" placeholder="Ingresa la gas actual"  bind:this={final_gas} required></ion-input>
            </ion-item>
        {:else}
            <ion-item>
                <ion-input class="ini-km" type="number" label="Kilometraje inicial" labelPlacement="stacked" placeholder="Ingresa kilometraje actual" bind:this={initial_km}  required></ion-input>
            </ion-item>
            <ion-item>
                <ion-input class="gas-km" type="number" label="Gasolina inicial (litros)" labelPlacement="stacked" placeholder="Ingresa la gas actual"  bind:this={initial_gas} required></ion-input>
            </ion-item>
        {/if}
        {#if checklist}
            {#each checklist as check (check.id_checklist_event)}
                <ion-item>
                <ion-label style="display:flex;">
                    <input
                    id={`chkbox-${check.id_checklist_event}`}
                    style="pointer-events: auto;"
                    type="checkbox"
                    value={check.id_checklist_event}
                    bind:group={checkk}
                    on:change={() => markCheckbox(check.id_checklist_event)}
                    required
                    />
                    <p style="margin-left:10px;">{check.item}</p>
                </ion-label>

                <ion-button fill="outline" class="loadEvidence">
                    <label for="chklist-{check.id_checklist_event}" style="padding: 8px 10px">
                        {imagesName[check.id_checklist_event] ? imagesName[check.id_checklist_event] : 'Cargar evidencia'}
                    </label>
                    <input style="display:none;" id="chklist-{check.id_checklist_event}" name="fileToUpload" type="file" bind:this={evidenceChecklist} accept="image/*" on:change={(e) => handleFileChange(e, check.id_checklist_event)}>
                    <!-- <input type="submit" value="Upload Image" name="submit" style="display:none;"/> -->
                </ion-button>
                </ion-item>
            {/each}
        {/if}
    </ion-list>
</ion-content>

<style>
    .myFakeUploadButton {
        border: 1px solid #000; 
        padding: 6px 10px; 
        border-radius: 6px;
        background-color: #858585;
    }
    .ini-km,
    .ini-gas{
        --padding-top: 10px;
    }
    .loadEvidence {
        --background: #93e9be;
        --background-hover: #9ce0be;
        --background-activated: #88f4be;
        --background-focused: #88f4be;

        --color: blue;

        --border-radius: 0;
        --border-color: #000;
        --border-style: solid;
        --border-width: 1px;

        --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);

        --ripple-color: deeppink;

        --padding-top: 10px;
        --padding-bottom: 10px;
    }

</style>