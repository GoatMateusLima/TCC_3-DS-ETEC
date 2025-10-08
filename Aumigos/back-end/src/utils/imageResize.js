const sharp = require('sharp');

async function resizeImage(buffer, width) {
    try {
        const resizedBuffer = await sharp(buffer)
            .resize({ width, fit: 'contain' })
            .toBuffer();
        return resizedBuffer;
    } catch (err) {
        console.error('Erro ao redimensionar imagem:', err.message);
        throw err;
    }
}

module.exports = { resizeImage };