const { ImageUploadService } = require('node-upload-images');
const { fromBuffer } = require('file-type');
const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');

class Upload {
    
    static async catbox(media) {
        const type = await fromBuffer(media);
        const form = new FormData();
        form.append('reqtype', 'fileupload'); 
        form.append('fileToUpload', media,  `upload.${type.ext}`);  
        try {
                const response = await axios.post('https://catbox.moe/user/api.php', form, {
                    headers: form.getHeaders(),
                });
                if (response.status === 200) {
                    return response.data.trim();
                } else {
                    return `Status Code: ${response.status} Falha ao realizar o upload!`;
                }
            } catch (err) {
                return 'Falha ao realizar o upload.';
            }
    };
    
        static async pixhost(buffer) {
        try {
            const service = new ImageUploadService('pixhost.to');
            const { directLink } = await service.uploadFromBinary(buffer, `${crypto.randomBytes(10).toString('hex')}.png`);
            return { resultado: directLink };
        } catch (error) {
            return { erro: 'Houve um erro no upload da imagem.' };
        }
    };
            
}

module.exports = Upload;