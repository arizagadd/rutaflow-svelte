<script>
    import { onMount, onDestroy, tick } from "svelte";
    import { alertController } from "@ionic/core";
    import SignaturePad from "signature_pad";

    let canvas;
    let container;
    let signaturePad;
    let resizeObserver;

    /**
     * Clears the canvas strokes.
     */
    export function clear() {
        if (signaturePad) signaturePad.clear();
    }

    /**
     * Returns the drawn signature as a data URL, or null if empty.\
     */
    export async function save(type = "image/png") {
        if (!signaturePad || signaturePad.isEmpty()) {
            const alert = await alertController.create({
                header: "Firma vacía", // Use customHeader or default value
                message: "No existe firma por guardar", // Use customMessage or default value
                buttons: [
                    {
                        text: "Cerrar",
                    },
                ],
            });

            await alert.present();

            return null;
        }
        return signaturePad.toDataURL(type);
    }

    /**
     * Resets the pad: clears strokes and resizes buffer to container.
     */
    export function reset() {
        resizeCanvas();
        if (signaturePad) signaturePad.clear();
    }

    /**
     * Resize the canvas buffer to match the container's current size,
     * clamping to avoid exceeding browser max canvas dimensions,
     * and catching scale errors if buffer creation fails.
     */
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;

        // Determine maximum safe dimension (e.g. 32767px)
        const maxCanvasSize = 32767;
        // Effective scale ratio, clamped so w*ratio <= maxCanvasSize and h*ratio <= maxCanvasSize
        const effectiveRatio = Math.min(
            ratio,
            maxCanvasSize / w,
            maxCanvasSize / h
        );

        // Set buffer size
        canvas.width = Math.floor(w * effectiveRatio);
        canvas.height = Math.floor(h * effectiveRatio);

        const ctx = canvas.getContext("2d");
        // Attempt scale; catch and warn if browser refuses
        try {
            ctx.scale(effectiveRatio, effectiveRatio);
        } catch (err) {
            console.warn("Canvas scale failed:", err);
        }
    }

    onMount(async () => {
        // Wait one frame to allow parent layout
        await tick();

        // Initial sizing and pad setup
        resizeCanvas();
        signaturePad = new SignaturePad(canvas, {
            backgroundColor: "rgba(255, 255, 255, 0)",
            penColor: "black",
        });

        // Observe container resizes to adjust buffer
        resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(container);
    });

    onDestroy(() => {
        if (resizeObserver) resizeObserver.disconnect();
    });
</script>

<div
    bind:this={container}
    class="signature-container"
    style=" position: relative;
        width: 100%;
        height: 150px;
        border: 1px solid #ccc;
        border-radius: 4px;
        touch-action: none;
        -ms-touch-action: none;"
>
    <canvas
        bind:this={canvas}
        class="signature-canvas"
        style=" position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;"
    />
</div>
