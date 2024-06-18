<script>
    import GasKmModal from './GasKmModal.svelte';
    import {IonicShowModal} from "../../../../../services/IonicControllers";
    import { modalController } from '@ionic/core';
    import { checklistStore } from '../../../../../stores/checklistStore';
    import { alertController } from '@ionic/core';
    import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import { gasKmStore } from '../../../../../stores/gasKmStore';
    import { flagStore } from '../../../../../stores/flagStore';

    let overlayElement = document.querySelector("ion-modal");
    //console.log(overlayElement.componentProps);
    const checklist = overlayElement.componentProps.checklist;
    const driverId = overlayElement.componentProps.driverId;
    const routeId = overlayElement.componentProps.routeId;
    const isLast = overlayElement.componentProps.isLast;
    let km_inicial,gas_inicial,km_final,gas_final;
    let checkk = [];
    let evidenceChecklist=null;
    let checkbox_item={};
    let KmInicial,GasInicial,KmFinal,GasFinal;

    // checklist trae las img en caso de que existan, declarar selectedImage como objeto
    let selectedImages = {};
    let imagesName = {};

    onMount(() => {
        if(isLast){
            console.log("Último checklist");
        }else{
            // guardar en store.items del checklistStore el valor de checklist (el total de checklist por ruta)
            checklistStore.update(store => {
                store.mandatory = getChecklistArray(checklist,"mandatory");
                store.items = getChecklistArray(checklist,"id_checklist_event");
                //store.mandatory = lv.mandatoryValues;
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

    function getChecklistArray(obj,type) {

        // Ensure obj is an object or an array and not null
        if ((typeof obj === 'object' && obj !== null) || Array.isArray(obj)) {
            // If obj is an array, collect IDs from each object in the array
            if (Array.isArray(obj)) {
                return obj.map(item => getChecklistArray(item,type)).flat();
            } else {
                // Get the keys (property names) of the object
                const keys = Object.keys(obj);
                let idValues;

                // Filter keys that are likely to be IDs (customize this based on your object structure)
                if(type=="id_checklist_event"){
                    const idKeys = keys.filter(key => key.toLowerCase().includes('id_checklist_event'));
                    idValues = idKeys.map(key => obj[key]);
                }else if(type=="mandatory"){
                    const mandatoryKeys = keys.filter(key => key.toLowerCase().includes('mandatory'));
                    // Extract the values corresponding to the identified ID keys
                    idValues = mandatoryKeys.map(key => obj[key]);
                }else{
                    console.error("Tipo de dato no reconocido.");
                    idValues = false;
                }

                return idValues;
            }
        } else {
            console.error('Invalid input. Please provide a valid object or array.');
            return [];
        }
    }

    const closeOverlay = () => {
        modalController.dismiss();
        if(driverId){
            goto(`/drivers/${driverId}`);
        }else{
            goto(`/drivers/me`)
        }
    };
    const sendEvidence = () => {
        if(isLast){
            var fin_km = transformFormatValue(km_final,"km");
            var fin_gas = transformFormatValue(gas_final,"gas");
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
            var ini_km = transformFormatValue(km_inicial,"km");
            var ini_gas = transformFormatValue(gas_inicial,"gas");
            checklistStore.update(store => {
                const itemIds = store.items;
                const mandatoryVal = store.mandatory;
                
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
                            if(mandatoryVal){
                                if(mandatoryVal[0]=='1'){
                                    changeRouteStatus(routeId, 'checklist-pending');
                                }else{
                                    changeRouteStatus(routeId, 'enroute');
                                }
                            }else{
                                changeRouteStatus(routeId, 'enroute');
                            }
                            
                        })
                        .catch(error => {
                        console.error('Error fetching data:', error);
                    });
                    //goto(`/drivers/${driverId}/routes/${routeId}`);
                    //window.location.reload();
                }else if(!mandatoryVal && ini_km && ini_gas){
                    var formData = new FormData();
                    formData.append(`km_inicial`,ini_km);
                    formData.append(`gas_inicial`,ini_gas);
                    fetch('https://rutaflow-app-development.up.railway.app/api/admin/checklist/add_evidence.php', {
                        method: 'POST',
                        body: formData,
                        })
                        .then(response => response.json())
                        .then(data => {
                            changeRouteStatus(routeId, 'enroute');
                            console.log("Holaaa");
                        })
                        .catch(error => {
                        console.error('Error fetching data:', error);
                    });
                }else {
                    alertIncompleteChecklist();
                }

                return store;
            });
        }
        emptyGasKmStore();
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

                    markCheckbox(checklistItemId);
                    checkbox_item[checklistItemId].checked =true; 
                    
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

    function handleKmGasData(e,r){
        updateFlagStore(r);
        overlayElement.componentProps.data_type = r;
        IonicShowModal("modal-gas-km", GasKmModal, {
            r
        }).then(() => {
            gasKmStore.subscribe((result) => {
                setButtonTxt(result,r);
                
            });
            
         });
    }

    function updateFlagStore(type){
        flagStore.update(store => ({
          ...store,
          flag: [type]
      }));
    }

    function setButtonTxt(obj,r){
        km_inicial = obj.km_inicial? obj.km_inicial: null;
        gas_inicial = obj.gas_inicial? obj.gas_inicial : null;
        km_final = obj.km_final? obj.km_final: null;
        gas_final = obj.gas_final? obj.gas_final : null;
        r=='km_inicial'?KmInicial.checked=true:"";
        r=='gas_inicial'?GasInicial.checked=true:"";
        r=='km_final'?KmFinal.checked=true:"";
        r=='gas_final'?GasFinal.checked=true:"";
        let checkbox;
    }

    function emptyGasKmStore(){
        gasKmStore.set({
            km_inicial: [],
            gas_inicial: [],
            km_final: [],
            gas_final: []
        });
    }

</script>

<ion-header translucent>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" on:click={closeOverlay}>Cancelar</ion-button>
      </ion-buttons>
      <ion-title>Requerimientos de ruta</ion-title>
    </ion-toolbar>
</ion-header>
<ion-content fullscreen>
    <ion-list>
        {#if isLast}
            <ion-item>
                <ion-label style="display:flex;">
                    <input
                    id={`chkbox-km-fin`}
                    style="pointer-events: auto;"
                    type="checkbox"
                    bind:group={checkk}
                    bind:this = {KmFinal}
                    required
                    />
                    <p style="margin-left:10px;">Kilometraje final</p>
                </ion-label>
                <ion-button fill="outline" size="small" class="loadKmInicial" on:click={(e) => handleKmGasData(e,"km_final")} aria-selected>
                    <!-- <label for="chkbox-km-fin" style="padding: 8px 10px"> -->
                        {km_final?km_final+" km.":"Cargar km"}
                    <!-- </label> -->
                </ion-button>
            </ion-item>
            <ion-item>
                <ion-label style="display:flex;">
                    <input
                    id={`chkbox-gas-fin`}
                    style="pointer-events: auto;"
                    type="checkbox"
                    bind:group={checkk}
                    bind:this = {GasFinal}
                    required
                    />
                    <p style="margin-left:10px;">Gasolina final (litros)</p>
                </ion-label>
                <ion-button fill="outline" size="small" class="loadGasInicial" on:click={(e) => handleKmGasData(e,"gas_final")}>
                    <!-- <label for="chklist-gas-fin" style="padding: 8px 10px"> -->
                        {gas_final?gas_final+" litros":"Cargar gas"}
                    <!-- </label> -->
                </ion-button>
            </ion-item>
        {:else}
            <ion-item>
                <ion-label style="display:flex;">
                    <input
                    id={`chkbox-km-ini`}
                    style="pointer-events: auto;"
                    type="checkbox"
                    bind:group={checkk}
                    bind:this = {KmInicial}
                    required
                    />
                    <p style="margin-left:10px;">Kilometraje inicial</p>
                </ion-label>
                <ion-button fill="outline" size="small" class="loadKmInicial" on:click={(e) => handleKmGasData(e,"km_inicial")} aria-selected>
                    <!-- <label for="chklist-km-ini" style="padding: 8px 10px"> -->
                        {km_inicial?km_inicial+" km.":"Cargar km"}
                    <!-- </label> -->
                </ion-button>
            </ion-item>
            <ion-item>
                <ion-label style="display:flex;">
                    <input
                    id={`chkbox-gas-ini`}
                    style="pointer-events: auto;"
                    type="checkbox"
                    bind:this = {GasInicial}
                    bind:group={checkk}
                    required
                    />
                    <p style="margin-left:10px;">Gasolina inicial (litros)</p>
                </ion-label>
                <ion-button fill="outline" class="loadGasInicial" size="small" on:click={(e) => handleKmGasData(e,"gas_inicial")} style="height: 16px ">
                    <!-- <label for="chklist-gas-ini" style="padding: 8px 10px"> -->
                        {gas_inicial?gas_inicial+" litros":"Cargar gas"}
                    <!-- </label> -->
                </ion-button>
            </ion-item>
            <!-- <ion-item>
                <ion-input class="ini-km" type="number" label="Kilometraje inicial" labelPlacement="stacked" placeholder="Ingresa kilometraje actual" bind:this={initial_km}  required></ion-input>
            </ion-item>
            <ion-item>
                <ion-input class="gas-km" type="number" label="Gasolina inicial (litros)" labelPlacement="stacked" placeholder="Ingresa la gas actual"  bind:this={initial_gas} required></ion-input>
            </ion-item> -->
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
                        bind:this = {checkbox_item[check.id_checklist_event]}
                        on:change={() => markCheckbox(check.id_checklist_event)}
                        required
                        />
                        <p style="margin-left:10px;">{check.item}</p>
                    </ion-label>

                    <ion-button fill="outline" class="loadEvidence" size="small">
                        <label for="chklist-{check.id_checklist_event}">
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
<ion-footer>
    <!-- <ion-buttons style="width: 100%; height: 100%;"> -->
        <ion-button fill="outline" color="tertiary" on:click={sendEvidence} strong style="width: 99%; height: auto;">
            Confirmar
        </ion-button>
    <!-- </ion-buttons> -->
</ion-footer>

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