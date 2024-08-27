<script>

    import {onMount} from "svelte";
    //import {ready, url, goto, params} from '@sveltech/routify';
    import DeliveryInfo from './_DeliveryInfo.svelte';
    import {IonicShowModal} from "../../../../../services/IonicControllers";

    let mapReady = false;

    let mapElement;
    let map;
    let routeId;
    let deliveries = [];
    let stats;
    let markers = [];
    let polyline;
    let frutifyMarker;
    let currentPositionMarker;
    let bounds;

    const frutifyLocation = {lat: 20.670537, lng: -103.436613};

    window.initMap = () => {
        mapReady = true;

        map = new google.maps.Map(mapElement, {
            zoom: 14,
            center: frutifyLocation,
            mapTypeControl: false,
        });

        const scale = 0.15;

        frutifyMarker = new google.maps.Marker({
            icon: {
                url: `https://frutify.co/images/favicon.png`,
                size: new google.maps.Size(291 * scale, 279 * scale),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(145.5 * scale, 279 * scale),
                scaledSize: new google.maps.Size(291 * scale, 279 * scale)
            },
            position: frutifyLocation,
            title: 'frutify',
            map
        });

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
                let position = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                let scale = 1;
                // https://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=|14|000|motorcycle|24|ff0000|FFF
                currentPositionMarker = new google.maps.Marker({
                    icon: {
                        url: `https://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=|24|000|motorcycle|24|0000ff|FFF`,
                        size: new google.maps.Size(30 * scale, 24 * scale),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(15 * scale, 25 * scale),
                        scaledSize: new google.maps.Size(30 * scale, 24 * scale)
                    },
                    position,
                    title: 'frutidriver',
                    map
                });
            }, function() {
                console.log('position error')
            });
        }

        bounds  = new google.maps.LatLngBounds();

        const location = new google.maps.LatLng(frutifyLocation.lat, frutifyLocation.lng);

        bounds.extend(location);
        map.fitBounds(bounds);
        map.panToBounds(bounds);

    }

    function getContrast(hexColor){

        // If a leading # is provided, remove it
        if (hexColor.slice(0, 1) === '#') {
            hexColor = hexColor.slice(1);
        }

        // If a three-character hexcode, make six-character
        if (hexColor.length === 3) {
            hexColor = hexColor.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }

        // Convert to RGB value
        const r = parseInt(hexColor.substr(0,2),16);
        const g = parseInt(hexColor.substr(2,2),16);
        const b = parseInt(hexColor.substr(4,2),16);

        // Get YIQ ratio
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // Check contrast
        return (yiq >= 128) ? '#414040' : '#fff';

    }

    const addMarkers = (deliveries) => {
      const scale = 1.3;
      deliveries.forEach(delivery => {
          let marker = new google.maps.Marker({
              // label: '' + (markerNumber + 1),
              label: {
                  text: '' + delivery.delivery_order,
                  color: getContrast(delivery.color),
                  fontSize: "13px"
              },
              icon: {
                  url: `https://chart.googleapis.com/chart?chst=d_map_spin&chld=${scale}|0|${delivery.color.replace('#', '')}|10|b|`,
                  size: new google.maps.Size(21 * scale, 34 * scale),
                  origin: new google.maps.Point(0 * scale,0 * scale),
                  anchor: new google.maps.Point(10 * scale, 34 * scale),
                  labelOrigin: new google.maps.Point(10 * scale, 11 * scale),
                  scaledSize: new google.maps.Size(21 * scale, 34 * scale)
              },
              position: {
                  lat: +delivery.lat,
                  lng: +delivery.lon
              },
              title: delivery.subscriber,
              map,
              deliveryId: delivery.id_delivery,
              status: delivery.status
          });

          markers = [...markers, marker];
          // var loc = new google.maps.LatLng(+obj.lat, +obj.lon);

          marker.addListener('click', () => {
              console.log('delivery marker click', delivery);
              showDeliveryInfoModal(delivery);
          });

          const location = new google.maps.LatLng(+delivery.lat, +delivery.lon);
          bounds.extend(location);
          map.fitBounds(bounds);
          map.panToBounds(bounds);

      })
    }

    const showDeliveryInfoModal = (delivery) => {
        IonicShowModal("modal-extra", DeliveryInfo, {
            delivery
        }).then(console.log);
    }

    const addPolyline = (encodedPolyline) => {
        const path = google.maps.geometry.encoding.decodePath(encodedPolyline.trim());

        polyline = new google.maps.Polyline({
            path,
            strokeColor: '#8791e7',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            map
        });
    }



    $: loadRoute($params.routeId);


    $: {
      if(map && deliveries && stats) {
          addMarkers(deliveries);
          addPolyline(stats.polyline)
      }
    }



    function loadRoute(routeId) {

        fetch(`https://dev.rutaflow.com/admin/delivery/driver_route_deliveries.php?id_route=${routeId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data);
                    deliveries = data.data.deliveries_list;

                    deliveries.forEach((delivery, index) => {

                        fetch(`https://dev.rutaflow.com/admin/subscriber/driver_subscriber_info.php?id_subscriber=${delivery.id_subscriber}`)
                                .then(response => response.json())
                                .then(data => {
                                    deliveries[index].subscriber_info = data.data.subscriber_info;
                                    deliveries[index].support_list = data.data.support_list;
                                });


                    });

                    stats = data.data.route_deliveries_stats;
                    $ready();
                });
    }


</script>

<style>
    .map {
        width: 100%;
        height: 100%;
    }

</style>

<svelte:head>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAFS7dzPidTb1vo-QyIkxahj9v9nteKRJ4&callback=initMap&libraries=geometry"
            async defer></script>
</svelte:head>


<ion-header translucent>
    <ion-toolbar>
        <ion-buttons slot="start">
            <ion-menu-button/>
        </ion-buttons>
        <ion-title>Deliveries Map</ion-title>
        <ion-buttons slot="end">
            <ion-button fill="clear" href={$url('list')}>
                <ion-icon name="list"/>
            </ion-button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>

<ion-content fullscreen>
    <div class="map" bind:this={mapElement}/>
</ion-content>
