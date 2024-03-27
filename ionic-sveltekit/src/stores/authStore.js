import { writable } from "@macfja/svelte-persistent-store"

const authStore =  writable('auth', {resolved: false, user: {}});

export default authStore;
