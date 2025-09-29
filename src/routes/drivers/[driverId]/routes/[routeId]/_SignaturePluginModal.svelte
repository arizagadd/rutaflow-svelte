<script>
  import { modalController } from "@ionic/core";
  import SignaturePad from "./_SignaturePad.svelte";

  let pad;

  function closeWithoutData() {
    modalController.dismiss(); // cerrar sin devolver nada
  }

  async function handleSave() {
    const dataUrl = await pad.save();
    if (dataUrl) {
      modalController.dismiss({ dataUrl }); // devolver firma al padre
    }
  }

  function handleClear() {
    pad.clear();
  }
</script>

<ion-header translucent>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button color="medium" on:click={closeWithoutData}>Cancelar</ion-button>
    </ion-buttons>
    <ion-title>Firmar</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen>
  <section style="display:flex; flex-direction:column; gap:12px; padding:16px;">
    <SignaturePad bind:this={pad} />
    <div style="display:flex; gap:8px;">
      <ion-button fill="outline" style="flex:1" on:click={handleClear}>
        Borrar
      </ion-button>
      <ion-button style="flex:1" on:click={handleSave}>
        Guardar
      </ion-button>
    </div>
  </section>
</ion-content>
