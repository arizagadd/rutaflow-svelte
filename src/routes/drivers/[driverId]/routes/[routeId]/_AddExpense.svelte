<script>
    import {alertController } from '@ionic/core';
    import { onMount } from 'svelte';
    import { modalController } from '@ionic/core';
    import {DATABASE_URL} from '../../../../../hooks';
    import {getImgsArray, getJson} from '$lib';
    import {documentTextOutline,createOutline,duplicateOutline,cardOutline, trash,closeSharp} from "ionicons/icons"; 
    import {IonicShowModal} from "../../../../../services/IonicControllers";

    /*Back URL*/
    let back_url = DATABASE_URL;
    
    let overlayElement = document.querySelector("ion-modal");
    let routeId = overlayElement.componentProps.routeId;
    let det_concept = overlayElement.componentProps.ex_concept;
    let det_amount = overlayElement.componentProps.ex_amount;
    let det_type = overlayElement.componentProps.ex_type;
    let id_expense = overlayElement.componentProps.id_expense;
    let selectedImage = "";
    let selectedImageArray = new Array();
    let img_id = "";
    let paymentType="";
    let expenseAmount=0;
    let comments="";
    let concept="";
    let isLoading = false;
    let dataSession = new Object();
    let showModal = false;
    let currentImage = "";

    onMount(() => {
        dataSession = JSON.parse(localStorage.getItem('userSession'));
    });

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
            var lv = new Object();
            lv.fileToUpload = compressed_file;
            lv.id_user_over = dataSession.id_user;
            lv.token = dataSession.token;

            try {

                getJson(`${back_url}api/admin/manager/upload_img_driver.php`, function(data){
                    if(data.success){
                        selectedImage = data.img;
                        selectedImageArray = getImgsArray(selectedImage);
                        img_id = data.img_id;
                    }else{
                        showAlert("Error","No se pudo subir la imagen");
                    }
                    isLoading = false;
                },lv);
                /*const response = await fetch(`${back_url}api/admin/manager/upload_img_driver.php`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    // File uploaded successfully, handle any additional logic
                    const result = await response.json();
                    selectedImage = result.img;
                    selectedImageArray = getImgsArray(selectedImage);
                    img_id = result.img_id;
                    
                } else {
                    // Handle error response
                    console.error('File upload failed:', response.statusText);
                }*/
            } catch (error) {
                console.error('Error during file upload:', error);
            } finally {
                isLoading = false; // Hide spinner
            }
        }

    };

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
        modalController.dismiss();
    };

    const sendExpense = () => {
        var lv = new Object(); 
        lv.id_route = routeId;
        lv.comments = comments.value;
        lv.type = paymentType.value;
        lv.img = selectedImage;
        lv.img_id = img_id;
        lv.amount = expenseAmount.value;
        lv.concept = concept.value; 
        lv.status = "done";
        lv.id_expense = id_expense?id_expense:'null';
        lv.id_user_over = dataSession.id_user;
        lv.token = dataSession.token;
        
        if(!img_id || !selectedImage || !expenseAmount.value || !concept.value){
            showAlert("Datos incompletos","Llena los datos requeridos para completar el registro");
        }else{
            getJson(`${back_url}api/admin/expenses/add_expense.php`, function(data){
                closeModal();
            },lv);
        }
    };

    const openImage = (image) => {
        currentImage = image;
        showModal = true;
    };

    const closeImgModal = () => {
        showModal = false;
        currentImage = "";
    };

</script>

<ion-header translucent>
    <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" on:click={closeModal}>Cancelar</ion-button>
        </ion-buttons>
        <ion-title title="" style="text-align: right; margin-right: 20px;">REGISTRAR</ion-title>
        <ion-buttons slot="end">
          <ion-button on:click={sendExpense} strong>Confirmar</ion-button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-content fullscreen>
    <ion-list>
        <ion-item>
            <ion-icon icon={documentTextOutline} slot="start"></ion-icon>
            <ion-input label="Concepto" bind:this={concept} type="text" placeholder="Escribe aquí..." value="{det_concept?det_concept:''}"></ion-input>
        </ion-item>
        <ion-item>
            <ion-icon icon={createOutline} slot="start"></ion-icon>
            <ion-input label="Monto $" bind:this={expenseAmount} type="number" value="{det_amount?det_amount:''}"></ion-input>
        </ion-item>
        <ion-item>
            <ion-icon icon={cardOutline} slot="start"></ion-icon>
            <ion-select placeholder="Tipo de pago" bind:this={paymentType} value="{det_type?det_type:''}">
              <div slot="label">Tipo de pago <ion-text color="danger">(Obligatorio)</ion-text></div>
              <ion-select-option value="cash">Efectivo</ion-select-option>
              <ion-select-option value="card">Tarjeta</ion-select-option>
              <ion-select-option value="transfer">Transferencia</ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item>
            <ion-icon icon={createOutline} slot="start"></ion-icon>
            <ion-textarea label="Comentarios" bind:this={comments} placeholder="Escribe aquí..."></ion-textarea>
        </ion-item>
        <section>
            <label for="eventEvidence" style="display: block; width: 100%;">
                <ion-button fill="outline" size="small" class="loadEvidence" expand="block">
                    <label for="eventEvidence" style="width:100%;padding:8px;">
                        <ion-icon icon={duplicateOutline} slot="start"></ion-icon>
                        Subir Evidencia
                    </label>
                    <input style="display:none;" id="eventEvidence" name="fileToUpload" type="file" accept="image/*" capture="environment" on:change={handleFileChange}>
                </ion-button>
            </label>
        </section>
        {#if selectedImage}
        <section>
            <div class="image-grid" style="display: grid;grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));gap: 10px;padding: 0px 10px;">
                {#each selectedImageArray as file, index}
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
<!-- <ion-footer>
    <ion-toolbar>
        <ion-button fill="outline" color="tertiary" on:click={sendExpense} strong style="width: 99%; height: auto;">
            Confirmar
        </ion-button>
    </ion-toolbar>
</ion-footer> -->
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