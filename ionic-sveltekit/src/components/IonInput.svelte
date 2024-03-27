<script>
    import {onMount} from 'svelte';
    export let name = '';
    export let type = 'text';
    export let placeholder = '';
    export let value;
    let touched = false;

    function onChange(event) {
        value = event.target.value;
    }

    function onBlur() {
        touched = true;
    }


</script>

<ion-input {type} {name} {placeholder} {value} on:ionBlur={onBlur} on:ionChange={onChange}/>
