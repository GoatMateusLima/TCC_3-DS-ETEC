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

        const resizeBuffer = await resizeImage(fileBuffer, 800);

        const uniqueName = generateFileName(petId, fileName);

        const { error } = await supabase.storage
            .from('pets')
            .upload(uniqueName, fileBuffer, {upsert: true });

        if (error) throw error;

        const { data: urlData, error: urlError } = supabase.storage
            .from('pets')
            .getPublicUrl(uniqueName);

        if (urlError) throw urlError;

        return urlData.publicUrl;
    } catch(err) {
        console.error('Erro ao enviar imagem:', err.message);
        return null;
    }
}

async function deletePetImage(filePath) {
    try {
        const fileName = filePath.split('/').pop();
        const { error} = await supabase.storage
            .from('pets')
            .remove([fileName]);
        

        if ( error ) throw error; 

        return true;
    } catch ( err ) { 
        console.error('Erro ao deletar imagem:', err.message);
        return false;
    }
}

module.exports = {
    uploadPetImage,
    deletePetImage
};