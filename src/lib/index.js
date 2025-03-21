// place files you want to import through the `$lib` alias in this folder.
export function hexToRGBA(hex, alpha) {
    // Remove "#" if present
    hex = hex.replace(/^#/, '');

    // Convert 3-digit hex to 6-digit hex (e.g., #abc → #aabbcc)
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Parse the hex into RGB values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}