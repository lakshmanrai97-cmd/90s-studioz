const fs = require('fs');
const path = require('path');

// Target design directories relative to project root
const directories = {
    posters: 'assets/posters',
    logos: 'assets/logos',
    banners: 'assets/banner',
    branding: 'assets/branding',
    photo_product: 'assets/photography/product',
    photo_model: 'assets/photography/model',
    photo_events: 'assets/photography/events'
};

const manifest = {};
let fileCount = 0;

console.log('Scanning design directories for new updates...');

for (const [key, dirPath] of Object.entries(directories)) {
    const fullPath = path.join(__dirname, dirPath);
    
    // Ensure the folder exists
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created missing directory: ${dirPath}`);
    }
    
    // Scan directory for valid design images
    const files = fs.readdirSync(fullPath);
    const validImages = files
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
        })
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .map(file => `${dirPath}/${file}`); // Store relative paths e.g. assets/posters/INVITES_3.jpg

    manifest[key] = validImages;
    fileCount += validImages.length;
    console.log(`- Folder '${dirPath}' scanned. Found ${validImages.length} images.`);
}

// Write the output to assets/manifest.json
const manifestPath = path.join(__dirname, 'assets/manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\nSuccess! Portfolio manifest successfully generated at assets/manifest.json.`);
console.log(`Total active design files indexed: ${fileCount}\n`);
