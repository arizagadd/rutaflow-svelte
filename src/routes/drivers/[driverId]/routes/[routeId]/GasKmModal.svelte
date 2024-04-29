<script>
  //import { createEventDispatcher } from 'svelte';
  //const type = overlayElement.componentProps.r;
  //console.log(type);
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { gasKmStore } from '../../../../../stores/gasKmStore';
  import { flagStore } from '../../../../../stores/flagStore';

  const dispatch = createEventDispatcher();
  import { modalController } from '@ionic/core';

  let overlayElement = document.querySelector("ion-modal");
  let type = overlayElement.componentProps.data_type;
  let isLast = overlayElement.componentProps.isLast;
  let type_txt;

  flagStore.subscribe((result) => {
    type = result.flag[0];
    type == "km_final" || type == "km_inicial" ? type_txt="kilometraje":type_txt="litros de gasolina";
  });

  //const dispatch = createEventDispatcher();
  let inputValue = 0;

  function closeModalKmGas(){
    modalController.dismiss();
  }

  function sendData(){
    
    const result = { data: 'Your data', role: 'confirm' };
    // Dispatch an event with the result
    dispatch('modalResult', result);
    
    // Update modalResult store with the result
    if(type=="km_inicial"){
      gasKmStore.update(store => ({
          ...store,
          km_inicial: [inputValue],
      }));
    }else if(type=="gas_inicial"){
      gasKmStore.update(store => ({
          ...store,
          gas_inicial: [inputValue],
      }));
    }else if(type=="km_final"){
      gasKmStore.update(store => ({
          ...store,
          km_final: [inputValue],
      }));
    }else if(type=="gas_final"){
      gasKmStore.update(store => ({
          ...store,
          gas_final: [inputValue],
      }));
    }
    
    closeModalKmGas();
  }

</script>

  <ion-header translucent>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" on:click={closeModalKmGas}>Cancelar</ion-button>
      </ion-buttons>
      <ion-title>Captura de Km/Gas</ion-title>
      <ion-buttons slot="end">
        <ion-button on:click={sendData} strong>Confirmar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-item>
      <ion-input class="fin-km" inputmode="numeric" pattern="[0-9]*" type="number" placeholder="Ingresa {type_txt} actual"  on:input={e => inputValue = e.target.value} value={inputValue}  required>
    </ion-item>
  </ion-content>

<style>
  /* Style your modal here */
</style>
