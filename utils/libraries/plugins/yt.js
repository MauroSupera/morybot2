const ytSearch = require('yt-search');
const axios = require('axios');

class YouTube {
    constructor() {
        this.formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
        this.formatVideo = ['360', '480', '720', '1080', '1440', '2160'];
        this.defaultFormat = 'mp3';
    }

    async cekProgress(id) {
        const checkProgress = () => {
            return axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            }).then(res => {
                if (res.data?.success && res.data.progress === 1000) {
                    return res.data.download_url;
                }
                return new Promise(resolve => setTimeout(resolve, 3000)).then(checkProgress);
            });
        };
        return checkProgress();
    }

    async downConfig(url, format) {
        if (!this.formatAudio.includes(format) && !this.formatVideo.includes(format)) {
            throw new Error('Formato inválido.');
        }

        const res = await axios.get(`https://p.oceansaver.in/ajax/download.php`, {
            params: {
                format,
                url,
                api: 'dfcb6d76f2f6a9894gjkege8a4ab232222'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!res.data?.success) {
            throw new Error('Erro no servidor OceanSaver.');
        }

        const downloadUrl = await this.cekProgress(res.data.id);
        return downloadUrl;
    }

    async searchVideo(query, format = this.defaultFormat) {
        const res = await ytSearch(query);
        const video = res.videos[0];

        if (!video) {
            throw new Error('Nenhum vídeo encontrado.');
        }


        return {
            title: video.title,
            videoId: video.videoId,
            url: video.url,
            timestamp: video.timestamp,
            seconds: video.seconds,
            views: video.views,
            description: video.description,
            image: video.image,
            thumbnail: video.thumbnail,
            duration: video.duration,
            ago: video.ago,
            author: {
                name: video.author.name,
                url: video.author.url,
                avatars: video.author.avatars,
                verified: video.author.verified
            }
        };
    }

    async get(query, format = this.defaultFormat) {
        return this.searchVideo(query, format);
    }
}

module.exports = YouTube;