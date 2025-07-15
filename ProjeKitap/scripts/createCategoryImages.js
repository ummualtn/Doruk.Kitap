const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const kategoriler = [
    'Ana Sınıfı Kitapları',
    'İlk Okul Kitapları',
    'Okul Öncesi Kitapları',
    'Orta Okul Kitapları',
    'Hobi Oyunları',
    'Okuma Kitapları',
    'Deneme Sınavları',
    'Sözlükler ve Ansiklopediler'
];

function createCategoryImage(text) {
    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext('2d');

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#357abd');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text settings
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate font size and handle multi-line text
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    
    for (let word of words) {
        const testLine = currentLine + word + ' ';
        if (testLine.length > 20) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());

    // Draw text
    const fontSize = Math.min(40, 200 / lines.length);
    ctx.font = `bold ${fontSize}px Arial`;
    const lineHeight = fontSize * 1.2;
    const startY = canvas.height/2 - (lines.length - 1) * lineHeight/2;

    lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width/2, startY + i * lineHeight);
    });

    return canvas;
}

// Ensure the kategoriler directory exists
const kategorilerDir = path.join(__dirname, '..', 'public', 'kategoriler');
if (!fs.existsSync(kategorilerDir)) {
    fs.mkdirSync(kategorilerDir, { recursive: true });
}

// Create and save images
kategoriler.forEach(kategori => {
    const canvas = createCategoryImage(kategori);
    const fileName = kategori.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ç/g, 'c')
        .replace(/ /g, '-') + '.jpg';
    
    const out = fs.createWriteStream(path.join(kategorilerDir, fileName));
    const stream = canvas.createJPEGStream({ quality: 0.9 });
    stream.pipe(out);
    console.log(`Created: ${fileName}`);
});
