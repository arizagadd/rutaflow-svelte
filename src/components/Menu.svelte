<script>
  import { goto } from '$app/navigation';
  import authStore from '../stores/authStore';
  import {IonicShowAlert} from '../services/IonicControllers.js';

  export let side = "start";

  let menuController;

  let menuItems = [
    {
      label: 'Routes',
      url: `/drivers`
    }
  ];

  function navigate(url) {
    console.log("Navigate url", url);
    /*$goto(url);*/
  }

  function closeAndNavigate(url) {
    menuController.close();
    navigate(url);
  }

  function logout() {


    IonicShowAlert({
                header: "Logout",
                message: "Do you really want to logout?",
                backdropDismiss: true,
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel",
                        cssClass: "secondary",
                        handler: () => {
                            console.log("Confirm Cancel");
                        }
                    },
                    {
                        text: "Logout",
                        role: "logout",
                        cssClass: "primary",
                        handler: () => {
                            menuController.close();
                            authStore.set({});
                            navigate('/public/login');
                        }
                    },
                ]
            });
  }


  // authService.subscribe(data => {
  //   menuItems = [
  //     {
  //       label: 'Routes',
  //       url: `/drivers/${data.id}`
  //     }
  //   ]
  // });


</script>

<ion-menu {side}>
  {#if menuItems.length > 0}
    <ion-header>
      <ion-toolbar translucent>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        {#each menuItems as menuItem, i}
          <ion-item on:click={() => closeAndNavigate(menuItem.url)}>
<!--            <ion-icon-->
<!--              name={menuItem.icon}-->
<!--              slot="start"-->
<!--              color={getRandomColor()} />-->
            <ion-label>{menuItem.label}</ion-label>
          </ion-item>
        {/each}
        {#if $authStore.id}
          <ion-item on:click={() => logout()}>
              <ion-label>Logout</ion-label>
          </ion-item>
        {/if}
      </ion-list>
    </ion-content>
  {/if}
</ion-menu>

<ion-menu-controller bind:this={menuController} />
