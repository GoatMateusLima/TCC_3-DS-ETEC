const  sharp = require('sharp');


async function resizeImage(fileBuffer, maxWidth = 800) {
    try {
        
        const resizeBuffer = await sharp(fileBuffer)
            .resize({ width: maxWidth })
            .jpeg({ quality: 80})
            .toBuffer();

        return resizeBuffer;
    }   catch (err) {

        console.error('Erro ao redimensionar imagem:', err.message);
        return fileBuffer; 
    }

}

module.exports = {resizeImage}