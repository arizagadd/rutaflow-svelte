// ChecklistStore.js
import { writable } from 'svelte/store';

export let gasKmStore = writable({
  km_inicial: [],         // Your checklist items
  gas_inicial: [],
  km_final: [],
  gas_final: [] // Array to store checked indices
});