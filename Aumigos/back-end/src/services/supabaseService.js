
const supabase = require('../config/supabaseClient');
const { resizeImage } = require('../utils/imageResize');
const path = require('path');

function generateFileName(petId, originalName) {
    const ext = path.extname(originalName);
    const uniqueSuffix = Date.now();
    return `pet_${petId}_${uniqueSuffix}${ext}`;
}

async function uploadPetImage(fileBuffer, fileName, petId) {
    try {
        console.log('Iniciando uploadPetImage com fileName:', fileName, 'petId:', petId);

        // Redimensionar a imagem
        const resizedBuffer = await resizeImage(fileBuffer, 800);
        console.log('Imagem redimensionada, tamanho do buffer:', resizedBuffer.length);

        const uniqueName = generateFileName(petId, fileName);
        console.log('Nome do arquivo gerado:', uniqueName);

        // Fazer upload do buffer redimensionado
        const { error } = await supabase.storage
            .from('pets')
            .upload(uniqueName, resizedBuffer, { upsert: true, contentType: 'image/*' });

        if (error) {
            console.error('Erro ao fazer upload para o Supabase:', error.message);
            throw error;
        }

        const { data: urlData, error: urlError } = supabase.storage
            .from('pets')
            .getPublicUrl(uniqueName);

        if (urlError) {
            console.error('Erro ao obter URL pública:', urlError.message);
            throw urlError;
        }

        console.log('URL da imagem:', urlData.publicUrl);
        return urlData.publicUrl;
    } catch (err) {
        console.error('Erro ao enviar imagem:', err.message, err.stack);
        return null;
    }
}

async function deletePetImage(filePath) {
    try {
        const fileName = filePath.split('/').pop();
        console.log('Deletando imagem:', fileName);

        const { error } = await supabase.storage
            .from('pets')
            .remove([fileName]);

        if (error) {
            console.error('Erro ao deletar imagem:', error.message);
            throw error;
        }

        console.log('Imagem deletada com sucesso');
        return true;
    } catch (err) {
        console.error('Erro ao deletar imagem:', err.message, err.stack);
        return false;
    }
}

module.exports = { uploadPetImage, deletePetImage };