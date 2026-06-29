const fs = require('fs');
const path = require('path');

// Target design directories relative to project root
const directories = {
    posters: 'assets/posters',
    logos: 'assets/logos',
    banners: 'assets/banner',
    branding: 'assets/branding',
    flyers: 'assets/flyer',
    brochures: 'assets/brouchures',
    photo_product: 'assets/photography/product',
    photo_model: 'assets/photography/model',
    photo_events: 'assets/photography/events'
};

const getMatchingPdf = (dirPath, filename) => {
    // 1. Exact match with .pdf extension
    const baseName = path.basename(filename, path.extname(filename));
    const exactPdfPath = path.join(__dirname, dirPath, baseName + '.pdf');
    if (fs.existsSync(exactPdfPath)) {
        return `${dirPath}/${baseName}.pdf`;
    }
    
    // 2. Suffix match (e.g. filename ends with _page-0001 or _page-1)
    const suffixRegex = /_page-\d+$/i;
    if (suffixRegex.test(baseName)) {
        const cleanBaseName = baseName.replace(suffixRegex, '');
        const suffixPdfPath = path.join(__dirname, dirPath, cleanBaseName + '.pdf');
        if (fs.existsSync(suffixPdfPath)) {
            return `${dirPath}/${cleanBaseName}.pdf`;
        }
    }
    
    return null;
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
        .map(file => {
            const item = { image: `${dirPath}/${file}` };
            const pdf = getMatchingPdf(dirPath, file);
            if (pdf) {
                item.pdf = pdf;
            }
            return item;
        });

    manifest[key] = validImages;
    fileCount += validImages.length;
    console.log(`- Folder '${dirPath}' scanned. Found ${validImages.length} images.`);
}

// Write the output to assets/manifest.json
const manifestPath = path.join(__dirname, 'assets/manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\nSuccess! Portfolio manifest successfully generated at assets/manifest.json.`);
console.log(`Total active design files indexed: ${fileCount}\n`);
