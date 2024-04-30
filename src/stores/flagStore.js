// ChecklistStore.js
import { writable } from 'svelte/store';

export let flagStore = writable({
  flag: []// Array to store checked indices
});