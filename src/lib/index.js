// place files you want to import through the `$lib` alias in this folder.
export function hexToRGBA(hex="", alpha=0.0) {
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

export async function getJson(apiUrl="", callback=function(obj={}){}, variables = {}) {
    let formData = new FormData();

    // Append variables to FormData
    for (const [key, value] of Object.entries(variables)) {
        formData.append(key, value);
    }
    //formData = addAuthData(formData);
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            // Pass the JSON result to the provided callback function
            callback(result);
        } else {
            console.error('Request failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during file upload:', error);
    }
}
export function getImgsArray(stringImg='') {
    // Split the input string by commas and trim any extra whitespace from each URL
    const imgArray = stringImg.split(',').map(url => url.trim());
    return imgArray;
}