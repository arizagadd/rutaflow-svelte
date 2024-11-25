import { getContext } from 'svelte';
import { goto } from '$app/navigation';

export async function handle404() {
  const { error } = getContext('params');

  if (error && error.status === 404) {
    await goto('/');
  }
}

export const DATABASE_URL = "https://app.rutaflow.com/";