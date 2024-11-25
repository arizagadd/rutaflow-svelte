<script>

  export let delivery;

  const colorsMap = {
    big: '#e68633',
    fruti: '#338be6',
    berry: '#e82866',
    secret: '#c05cea'
  };

  // function getColor(box) {
  //   return colorsMap[box] || '#ffffff'
  // }

  function getContrast(hexColor) {
    
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
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Get YIQ ratio
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? '#414040' : '#fff';

  }

    function hexToRgbA(hex){
      if(!hex){
        hex = "#eeeeee";
      }
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.14)';
        }
        throw new Error('Bad Hex');
    }
    function getColorPill(str,box){
        var hex;
        if( String(str).indexOf('#')!=-1 ){
          hex=str;
        }
        else{
          hex=colorsMap[box];
        }

        return hex;
    }
    function getColorPillOpacity(str,box){
      var hex = getColorPill(str,box);
      return hexToRgbA(hex);
    }
  // "[{'box':'berry','qty':2},{'box':'secret','qty':1}]"
  let boxes = [];

  $: {
    if (!delivery.boxes) {
      boxes = [{
        box: delivery.box,
        qty: 1
      }];
    }
    else {
      boxes = JSON.parse(delivery.boxes);
    }

  }



</script>
<style>
    /*.box {*/
    /*    display: inline-block;*/
    /*    border: 1px solid #CBCFDE;*/
    /*    border-radius: 50px;*/
    /*    padding: 0 8px;*/
    /*    margin-right: 5px;*/
    /*}*/

    /*.label {*/
    /*    letter-spacing: 1px;*/
    /*    font-weight: 600;*/
    /*    text-transform: uppercase;*/
    /*}*/
</style>
{#each boxes as box (box.box)}
    <div class="box" style="font-size:13px; display: inline-block; border: 1px solid rgba(0,0,0,0); border-radius: 50px; padding: 2px 8px; margin-right: 5px; background-color: { getColorPillOpacity(box.color,box.box) || '#eeeeee'}; color: {getColorPill(box.color,box.box)};">
        <span class="label" style="font-weight: 600; text-transform: lowercase;" >
            {box.box}
        </span>
        {#if box.qty > 1}
            <span class="qty">
                x{box.qty}
            </span>
        {/if}
    </div>
{/each}
