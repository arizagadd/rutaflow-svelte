import { getContext } from 'svelte';
import { goto } from '$app/navigation';

export async function handle404() {
  const { error } = getContext('params');

  if (error && error.status === 404) {
    await goto('/');
  }
}

export const DATABASE_URL = "https://app.rutaflow.com/";

export const WP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9jbGllbnQiOjcsIm5hbWUiOiJydXRhZmxvd19wcm9kIiwicGFzc3dvcmQiOiIkMmIkMDUkNy8xa21EZXd5UEZqSDQ1R0VlT1ZuLnNSb2dZcWlON0JYMFcuSVlHZWFkUE9FZDJaYUxFRHEiLCJxciI6bnVsbCwicGhvbmUiOiI1MjEzMzI0NDA2MzU0Iiwic2VydmljZSI6InJ1dGFmbG93X3Byb2QiLCJpYXQiOjE3NDgzMjkxMTN9.aBM3PdCFaMAUouerIxchXwEtS6hKGIFOS6KUvwg-DEQ";
export const WP_URL = "https://ywp-whatsapp-dev.up.railway.app/api/send/whatsapp";