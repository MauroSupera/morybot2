const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');

/* ------- [ Módulos | © Sasha-BOT ] ------- */
const {  P, fs, util, Boom, axios, request, ms, ffmpeg, fetch, qrterminal, exec, isUrl, moment, cheerio, NodeCache, connect, colors, cfonts, chalk, time, hora, date  } = require('../plugins.js');

/* ------- [ Funções JS | © Sasha-BOT ] ------- */
const { getBuffer, fetchJson, getExtension, getGroupAdmins, getMembros, getRandom, formatNumber, iniciarSistemaPremium, TimeCount, connectToDatabase, Sticker, uploader, RemoverFundo, WebP_GIF, YouTube } = require('../plugins.js');

/* ------- [ Funções JSON | © Sasha-BOT ] ------- */
const {  packname, settings, configs, apis, images  } = require('../plugins.js');
const qrcode2 = require('qrcode-terminal');
/* ------- [ Menus & Informações | © Sasha-BOT ] ------- */
const { linguagem, responses, getInfo, botName, donoName, prefix, channel  } = require('../plugins.js');

/* ------- [ Funções Nescessárias | © Sasha-BOT ] ------- */
const { getFileBuffer, deleteFile, sleep, listCommands, antiLetraEmoji, getUsuarioById } = require('../plugins.js');

const qrcode = './configs/media/qr-code'

const msgRetryCounterCache = new NodeCache();

// Armazena a referência original do console.info
const originalConsoleInfo = console.info;

// Substitui console.info para filtrar mensagens de 'Closing session: SessionEntry'
console.info = function() {
  const message = util.format(...arguments);
  if (!message.includes('Closing session: SessionEntry')) {
    return originalConsoleInfo(...arguments);
  }
};

// Armazena novamente a referência original (pois foi sobrescrita acima)
const originalConsoleInfoAgain = console.info;

// Substitui console.info para filtrar mensagens de 'Removing old closed session: SessionEntry'
console.info = function() {
  const message = util.format(...arguments);
  if (!message.includes('Removing old closed session: SessionEntry {')) {
    return originalConsoleInfoAgain(...arguments);
  }
};

async function startBot() {
    try {
  const { state, saveCreds } = await useMultiFileAuthState(qrcode);
  const { version, isLatest } = await fetchLatestBaileysVersion();

const sasha = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        auth: state,
        browser: Browsers.macOS('Safari'),
      //  printQRInTerminal: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: true
    });

sasha.ev.process(async (update) => {
                if (update['connection.update']) {
                    const { connection, lastDisconnect, qr } = update['connection.update'];
                    if(qr) {
                                // Aqui você pode mostrar o QR do jeito que quiser, por exemplo no terminal:
                                        qrcode2.generate(qr, { small: true });
                                            
                    }
                    const statusCode = lastDisconnect?.error ? new Boom(lastDisconnect.error).output.statusCode : null;
                    handleConnection(connection, statusCode);
                }

                if (update['group-participants.update']) {
                    await handleGroupUpdate(update['group-participants.update'], sasha);
                } 
                
                if (update['messages.upsert']) {
                    const startBOT = require('../command.js');
                    await startBOT(update['messages.upsert'], sasha).catch(console.log);
                }

                if (update['creds.update']) {
                    await saveCreds();
                }            
        });
    } catch (error) {
        console.log(colors.red(`Eita, o bot tropeçou na inicialização: ${error.message}`));
    }
}

async function getFotoPerfil(userNumber, sasha) {
    try {
        const profilePicUrl = await sasha.profilePictureUrl(`${userNumber.split('@')[0]}@c.us`, 'image');
        const response = await fetch(profilePicUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
        });
        if (response.ok) {
            const buffer = await response.buffer();
            const data = await uploader.pixhost(buffer);
            return data.resultado;
        } else {
            throw new Error('Foto de perfil não acessível');
        }
    } catch (error) {
        return 'https://telegra.ph/file/bf5b4a7c5a272848af99a.jpg';
    }
}

async function handleGroupUpdate(grupo, sasha) {
const { db, collections } = await connectToDatabase();
    try {
        const { action, participants, id, author } = grupo;
        const dataGp =  await (async () => {
    try {
        const found = await collections.gruposConfigs.findOne({ _id: id });
        return found || [];
    } catch (error) {
        return [];
    }
   })();
        const participant = participants[0];
        const groupMetadata = await sasha.groupMetadata(id);
        const removeParticipant = async (reason) => {
            await sasha.sendMessage(id, { text: reason, mentions: [participant] });
            await sleep(1000)
                await sasha.groupParticipantsUpdate(id, [participant], 'remove');
        };        
        var fotoProfile = await getFotoPerfil(participant, sasha);
        var fotoGrupo = await getFotoPerfil(id, sasha);
        var usuario = await getUsuarioById(participant)
        if (action === 'add') {
            if (dataGp?.listanegra.users.includes(participant) || configs.listaNegraG && Array.isArray(configs.listaNegraG['users'].includes(participant))) {
                 const motivo = dataGp?.listanegra.users.includes(participant) ? 'deste grupo' : 'da lista negra global';
                return await removeParticipant(`⚠️ Atenção, @${participant.split('@')[0]}! ⚠️\n\nSeu número está na *lista negra ${motivo}*, e você não pode permanecer aqui.\n\nCaso ache que isso foi um erro, entre em contato com um administrador.`);
            }

            if (dataGp?.antifake?.status && !participant.startsWith('55')) {
                return await removeParticipant(`Atenção, @${participant.split('@')[0]}!\n\nEste grupo é exclusivo para números brasileiros. Como seu número não parece ser do Brasil, infelizmente você será removido. 😕\n\nCaso tenha sido um engano, entre em contato com um administrador.`);
            }
        }
        if (!dataGp?.wellcome?.status) return;
        if (action === 'add') {
            var message = dataGp?.wellcome?.photo ? { image: { url: `https://api.siputzx.my.id/api/canvas/welcomev1?username=${usuario.nome}&guildName=${dataGp?.name}&memberCount=${groupMetadata.participants.length || 0}&guildIcon=${fotoGrupo}&avatar=${fotoProfile}&background=${dataGp?.wellcome?.Mains.Enter}` }, caption: `Seja muito bem-vindo, @${participant.split('@')[0]}! Puxa uma cadeira, pega um café e se joga na conversa!`, mentions: author ? [participant, author] : [participant] } : { text: `Seja muito bem-vindo, @${participant.split('@')[0]}! Puxa uma cadeira, pega um café e se joga na conversa!`, mentions: author ? [participant, author] : [participant] };
    await sasha.sendMessage(id, message);
        } else if (action === 'remove') {
            const farewellMessage = author === participant ? `Opa, @${participant.split('@')[0]} resolveu seguir outro caminho. Boa sorte e até breve!` : `Xiii... @${participant.split('@')[0]} foi removido do grupo por @${author.split('@')[0]}. Clima tenso?`;
            var message = dataGp?.wellcome?.photo ? { image: { url: `https://api.siputzx.my.id/api/canvas/goodbyev1?username=${usuario.nome}&guildName=${dataGp?.name}&memberCount=${groupMetadata.participants.length || 0}&guildIcon=${fotoGrupo}&avatar=${fotoProfile}&background=${dataGp?.wellcome?.Mains.Left}` }, caption: farewellMessage, mentions: author ? [participant, author] : [participant] } : { text: farewellMessage, mentions: author ? [participant, author] : [participant] };
           await sasha.sendMessage(id, message);
        }

    } catch (error) {
        console.log(colors.red(`Eita, deu uma treta ao processar o grupo ${grupo.id}: ${error}`));
    }
}

function handleConnection(connection, statusCode) {
    const errorMessages = {
        401: 'Eita, a sessão expirou! Escaneia o QR Code de novo e simbora.',
        408: 'Tô tentando conectar, mas tá demorando... Segura aí.',
        411: 'O arquivo de sessão deu um nó. Vou tentar desenrolar isso.',
        428: 'Perdemos o sinal, tô tentando religar os cabos aqui.',
        440: 'Ei, alguém abriu o WhatsApp Web em outro lugar! Fecha lá, senão não dá certo.',
        500: 'Sistema bugou, mas calma que eu já tô ajeitando.',
        503: 'Algo estranho aconteceu, mas deixa comigo que eu resolvo.',
        515: 'Parece que pediram um reboot... Tô reiniciando a máquina!'
    };

    switch (connection) {
        case 'close':            
            console.log(colors.red(errorMessages[statusCode] || 'Rapaz, nem eu sei o que aconteceu, mas vou tentar resolver.'));

            if (statusCode !== 401) {
                console.log(colors.yellow('Segura aí que já tô voltando...'));
                startBot();
            } else {
        (async () => {
            try {
                await fs.rm(qrcode, { recursive: true, force: true });
                console.log(colors.red('A conexão foi pro espaço! Escaneia o QR Code de novo.'));
            } catch (err) {
                console.error(colors.red(`Erro ao deletar o qrcode: ${err}`));
            }
            })();
           }
            break;
        case 'connecting':
            console.log(colors.yellow('Calma lá, tô conectando no WhatsApp...'));
            break;
       case 'open':
            iniciarSistemaPremium();
            connect.close();
            break;
}
}

startBot();