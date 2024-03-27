<script>
    import authStore from '../../../stores/authStore';
    import {onMount} from "svelte";
    import { goto } from '$app/navigation';
    let dataSession = new Object();
    

    onMount(() => {
        dataSession = JSON.parse(localStorage.getItem('userSession'));
        if(dataSession){
            if (dataSession.type=='admin' || dataSession.type=='superadmin') {
                goto(`/drivers/me`);
            }else if(dataSession.id_driver){
                goto(`/drivers/${dataSession.id_driver}`);
            }
        }else{
            goto('/');
        }
        

    });


</script>
<slot />
