<script>
  import { modalController } from "@ionic/core";
  import SignaturePad from "./_SignaturePad.svelte";

  let pad;

  function closeWithoutData() {
    // ⬇️ pasa role "cancel"
    modalController.dismiss(undefined, "cancel");
  }

  async function handleSave() {
    const dataUrl = await pad.save();
    if (dataUrl) {
      // ⬇️ devuelve la data y pasa role "confirm"
      modalController.dismiss({ dataUrl }, "confirm");
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

<ion-content fullscreen scrollY={false} class="no-scroll">
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

<style>
  /* quita el desplazamiento dentro del ion-content */
  .no-scroll {
    --overflow: hidden;   /* iOS/WebKit */
    overflow: hidden;     /* fallback */
  }

  /* asegura que la “caja” del modal no haga scroll */
  ion-modal::part(content) {
    overflow: hidden !important;
  }

  /* algunos temas de Ionic usan .inner-scroll; lo bloqueamos también */
  :global(ion-content.no-scroll .inner-scroll) {
    overflow: hidden !important;
  }
</style>
