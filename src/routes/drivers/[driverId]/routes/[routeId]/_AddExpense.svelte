<script>
    import {page} from '$app/stores';
    import { goto } from '$app/navigation';
    import {documentTextOutline, personOutline, personRemoveOutline} from "ionicons/icons"; 
    import {createOutline} from "ionicons/icons"; 
    import {duplicateOutline} from "ionicons/icons"; 
    import {cardOutline} from "ionicons/icons"; 
    import {alertController } from '@ionic/core';
    import {informationCircleOutline} from "ionicons/icons";
    import { onMount } from 'svelte';
    import { modalController } from '@ionic/core';
    let overlayElement = document.querySelector("ion-modal");
    let routeId = overlayElement.componentProps.routeId;
    let det_concept = overlayElement.componentProps.ex_concept;
    let det_amount = overlayElement.componentProps.ex_amount;
    let det_type = overlayElement.componentProps.ex_type;
    let id_expense = overlayElement.componentProps.id_expense;
    let selectedImage = "";
    let img_id = "";
    let paymentType="";
    let expenseAmount=0;
    let comments="";
    let concept="";
    let isLoading = false;

    onMount(() => {
       
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
            const formData = new FormData();
            formData.append('fileToUpload', compressed_file);
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
        const requestData = new FormData();
        for (const key in lv) {
            requestData.append(key, lv[key]);
        }
        if(!img_id || !selectedImage || !comments.value || !expenseAmount.value || !concept.value){
            showAlert("Datos incompletos","Llena los datos requeridos para completar el registro");
        }else{
            fetch('https://app.rutaflow.com/api/admin/expenses/add_expense.php', {
                method: 'POST',
                body: requestData,
            })
            .then(response => response.json())
            .then(data => {
                closeModal();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
    };


</script>

<ion-header translucent>
    <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" on:click={closeModal}>Cancelar</ion-button>
        </ion-buttons>
        <ion-title title="">AGREGAR GASTO</ion-title>
        <!-- <ion-buttons slot="end">
          <ion-button on:click={sendExpense} strong>Confirmar</ion-button>
        </ion-buttons> -->
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
            <ion-input label="Cantidad" bind:this={expenseAmount} type="number" value="{det_amount?det_amount:''}"></ion-input>
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
                    <input style="display:none;" id="eventEvidence" name="fileToUpload" type="file" accept="image/*" on:change={handleFileChange}>
                </ion-button>
            </label>
        </section>
        {#if isLoading}
            <ion-spinner name="dots"></ion-spinner>
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
<ion-footer>
    <ion-toolbar>
        <ion-button fill="outline" color="tertiary" on:click={sendExpense} strong style="width: 99%; height: auto;">
            Confirmar
        </ion-button>
    </ion-toolbar>
</ion-footer>