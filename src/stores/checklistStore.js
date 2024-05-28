// ChecklistStore.js
import { writable } from 'svelte/store';

export const checklistStore = writable({
  items: [],         // Your checklist items
  checkedIndices: [], // Array to store checked indices
  mandatory: []
});