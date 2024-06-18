<script>
  import AddExpense from './_AddExpense.svelte';
  import {IonicShowModal} from "../../../../../services/IonicControllers";
  import { modalController } from '@ionic/core';
  import { onMount } from 'svelte';
  import {addSharp} from "ionicons/icons"; 

  let overlayElement = document.querySelector("ion-modal");
  let routeId = overlayElement.componentProps.routeId;
  let expenses = overlayElement.componentProps.expenses;

  onMount(() => {
      //Cargó lista de gastos
  });

  const closeOverlay = () => {
      modalController.dismiss();
  };

  function handleExpenseItem(e,concept,amount,type,id_expense){
      overlayElement.componentProps.ex_amount = amount;
      overlayElement.componentProps.ex_concept = concept;
      overlayElement.componentProps.ex_type = type;
      overlayElement.componentProps.id_expense = id_expense;
      IonicShowModal("modal-expense", AddExpense, {
          amount,concept,type,id_expense
      }).then(() => {
          
      });
      closeOverlay();
  }

  const addExpense = (routeId) => {
        IonicShowModal("modal-expense", AddExpense, {
          routeId
        }).then((result) => {
            
        });
        closeOverlay();
    };

</script>

<ion-header translucent>
  <ion-toolbar>
    <ion-buttons slot="end">
      <ion-button color="medium" on:click={addExpense}><ion-icon style="font-size: 25px!important;" icon={addSharp}></ion-icon></ion-button>
    </ion-buttons>
    <ion-title>Lista de gastos</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content fullscreen>
  <ion-list>
      {#each expenses as expense (expense.id_expenses)}
          <ion-item>
              <ion-label style="display:flex;">
                  <p style="margin-left:10px;">{expense.concept}</p>
              </ion-label>
              {#if expense.status=="done"}
                <ion-button fill="solid" size="small" aria-selected>
                  Gasto completado
                </ion-button>
              {:else}
                <ion-button fill="outline" size="small" on:click={(e) => handleExpenseItem(e,expense.concept,expense.amount,expense.type,expense.id_expenses)} aria-selected>
                  Cargar gasto
                </ion-button>
              {/if}
          </ion-item>
      {/each}
  </ion-list>
</ion-content>
<ion-footer>
  <ion-button fill="outline" color="tertiary" on:click={closeOverlay} strong style="width: 99%; height: auto;">
      Cerrar
  </ion-button>
</ion-footer>

<style>

</style>