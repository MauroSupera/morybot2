
const { downloadContentFromMessage, prepareWAMessageMedia, proto, relayWAMessage, mentionedJid, processTime, MediaType, Browser, MessageType, Presence, Mimetype, Browsers, delay, getLastMessageInChat } = require('@whiskeysockets/baileys');

/* ------- [ Módulos | © Sasha-BOT ] ------- */
const { P, path, fs, util, Boom, axios, request, ffmpeg, fetch, exec, isUrl, moment, cheerio, colors, chalk, YouTube, yt } = require('./plugins.js');

/* ------- [ Funções JS | © Sasha-BOT ] ------- */
const { getBuffer, fetchJson, capitalizeFirstLetter, getExtension, getGroupAdmins, getMembros, getRandom, formatNumber, sasha, TimeCount, SashaAI, anime, connectToDatabase, Sticker, uploader, RemoverFundo, WebP_GIF } = require('./plugins.js');

/* ------- [ Funções JSON | © Sasha-BOT ] ------- */
const { bugs, configs, packname, settings, images } = require('./plugins.js');

/* ------- [ Menus & Informações | © Sasha-BOT ] ------- */
const { linguagem, responses, getInfo, botName, donoName, prefix, channel  } = require('./plugins.js');

/* ------- [ Funções Nescessárias | © Sasha-BOT ] ------- */
const { time, hora, date, getFileBuffer, saveJson, verificarJson, saveFile, lerJSON, lerArquivo, deleteFile, sleep, listCommands, antiLetraEmoji, getUsuarios, addUsuario, getUsuarioById, updateRelationShip, getOrCreateUsuario, updateUsuario } = require('./plugins.js');

var NumberDonoOficial = settings['OwnerNumber'].value.replace(new RegExp('[()+-/ +/]', 'gi'), '');

/* ------- [ Apikey | Website - API Oficial (Maioria dos comandos dependem dessas Credentials) ] ------- */
const ApiKeySasha = settings['APIs'].apikey;
const WebSite = settings['APIs'].website;

/* ------- [ Conexão Abaixo ] ------- */
async function startBOT(mensagem, sasha) {

for (const info of mensagem?.messages || []) {
    
const { db, collections } = await connectToDatabase();

if(mensagem.type === 'append') return
    
console.log(JSON.stringify(info, null, 2))
    
const from = (info.key?.remoteJid || info.message?.senderKeyDistributionMessage?.from || "").toString().trim();
    
const verifyGrupo = from.endsWith('@g.us');

async function buscarTodasConfiguracoesGrupo(from) {
    try {
        const grupo = await collections.gruposConfigs.findOne({ _id: from });
        if(!grupo) return []

        return grupo; 
    } catch (error) {
        return []; 
    }
}

const verificarExecution = await buscarTodasConfiguracoesGrupo(from)

if(verificarExecution && info.messageStubType) {
  if(verificarExecution.x9?.status) {
    const messageStubType = info.messageStubType.toLowerCase(); 
    
    const actions = {
      '23': async () => {
        await sasha.sendMessage(info.key.remoteJid, { text: `O(a) administrador(a) *@${info.participant.split('@')[0]}* acaba de redefinir o link do grupo.`, mentions: [info.messageStubParameters[0], info.participant] });
      },
      '29': async () => {
        await sasha.sendMessage(info.key.remoteJid, { text: `*@${info.messageStubParameters[0].split('@')[0]}* foi promovido(a) ao cargo de administrador do grupo por: *@${info.participant.split('@')[0]}*.`, mentions: [info.messageStubParameters[0], info.participant] });
      },
      '30': async () => {
        await sasha.sendMessage(info.key.remoteJid, { text: `O(a) administrador(a) *@${info.messageStubParameters[0].split('@')[0]}* foi rebaixado(a) à membro comum por: *@${info.participant.split('@')[0]}*.`, mentions: [info.messageStubParameters[0], info.participant] });
      }
    };

    if(actions[messageStubType]) {
      await actions[messageStubType]();
    }
  }
}

if(!info.message) return;
const baileys = require('@whiskeysockets/baileys');
const type = baileys.getContentType(info.message);
const content = JSON.stringify(info.message);
const NickName = info.pushName ? info.pushName : 'Usuário(a)';

//await sasha.readMessages([info.key]);

/* ------ [ Conversas no WhatsApp, detectar o que está escrito nas mensagens enviadas pelos grupos ou conversas privadas ] ------- */
var body = type === 'conversation' ? info.message.conversation : type == 'editedMessage' ? info.message.editedMessage.message.protocolMessage.editedMessage?.conversation || info.message.editedMessage.message.protocolMessage.editedMessage?.imageMessage?.caption || info.message.editedMessage.message.protocolMessage.editedMessage?.videoMessage?.caption || info.message.editedMessage.message.protocolMessage.editedMessage?.documentMessage?.caption : type === 'viewOnceMessageV2' ? info.message.viewOnceMessageV2.message.imageMessage ? info.message.viewOnceMessageV2.message.imageMessage.caption : info.message.viewOnceMessageV2.message.videoMessage.caption : type === 'imageMessage' ? info.message.imageMessage.caption : type === 'videoMessage' ? info.message.videoMessage.caption : type === 'extendedTextMessage' ? info.message.extendedTextMessage.text : type === 'viewOnceMessage' ? info.message.viewOnceMessage.message.videoMessage ? info.message.viewOnceMessage.message.videoMessage.caption : info.message.viewOnceMessage.message.imageMessage.caption : type === 'documentWithCaptionMessage' ? info.message.documentWithCaptionMessage.message.documentMessage.caption : type === 'buttonsMessage' ? info.message.buttonsMessage.imageMessage.caption : type === 'buttonsResponseMessage' ? info.message.buttonsResponseMessage.selectedButtonId : type === 'listResponseMessage' ? info.message.listResponseMessage.singleSelectReply.selectedRowId : type === 'templateButtonReplyMessage' ? info.message.templateButtonReplyMessage.selectedId : type === 'groupInviteMessage' ? info.message.groupInviteMessage.caption : type === 'pollCreationMessageV3' ? info.message.pollCreationMessageV3 : type === 'interactiveResponseMessage' ? JSON.parse(info.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : type === 'text' ? info.text : ''

var searchforURL = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || '';
const string = body.trim().split(/ +/).slice(1);
const budy = (type === 'conversation') ? info.message?.conversation : (type === 'extendedTextMessage') ? info.message?.extendedTextMessage?.text : '';

/* ------- [ Prefixos | MultiPrefixo ] ------- */
if(verifyGrupo && verificarExecution) {
  if(verificarExecution.multiprefix?.status) {
    var prefix = verificarExecution.multiprefix.prefixos.find(p => String(body)?.trim()?.startsWith(p)) || verificarExecution.multiprefix.prefixos[0];
  } else {
    var prefix = settings['Prefix'].value;
  }
} else {
  var prefix = settings['Prefix'].value;
}

/* -------- [ Função responsável por detectar o campo de texto, tudo o que for colocado após um comando é um campo ] -------- */
const queryTwoB = budy.trim().split(/ +/).slice(1).join(' ');
const query = string.join(' ');

/* --------- [ Informações do Grupo ] --------- */
try { var groupMetadata = verifyGrupo ?  await sasha.groupMetadata(from) : '' } catch { return }
const groupName = verifyGrupo ? groupMetadata.subject : '';
const groupDesc = verifyGrupo ? groupMetadata.desc : '';
const groupMembers = verifyGrupo ? groupMetadata.participants : '';
const groupAdmins = verifyGrupo ? getGroupAdmins(groupMembers) : '';
const getMembers = verifyGrupo ? getMembros(groupMembers) : '';

/* -------- [ Localizar o ID do Usuário '@s.whatsapp.net ou informar o número que o bot está hospedado no momento ] -------- */
const sender = verifyGrupo ? info.key.participantAlt : info.key.remoteJidAlt

const botNumber = sasha.user.id.split(':')[0] + '@s.whatsapp.net';

/* ------ [ Diferenciar um comando de uma mensagem comum (sem prefixo) ] ------- */
const verifyCmd = body.trim().startsWith(prefix);

var usuario = await getUsuarioById(sender);

const command = (() => {
    const cleanBody = body.trim();
    const hasPrefix = cleanBody.startsWith(prefix);

    if(!hasPrefix && !usuario?.disabled) return null;

    const commandRaw = hasPrefix
        ? cleanBody.slice(prefix.length).trim().split(' ')[0].toLowerCase()
        : cleanBody.split(' ')[0].toLowerCase();

    return commandRaw;
})();

/* ------ [ Proprietários da Sasha Bot ] ------ */
const nmrdn = settings['OwnerNumber'].value.replace(new RegExp('[()+-/ +/]', 'gi'), '') +
'@s.whatsapp.net';

/* ------------- [ Funções do Grupo ] ------------- */
const configsGrupo = {
    name: groupName,
    groupId: from,
    x9: { status: false, comment: 'Este comando permite que você saiba tudo o que os administradores fizeram. Mas, por enquanto, está desativado. Vamos ativá-lo se necessário!' },
    antiimg: { status: false, comment: 'Imagens podem ser engraçadas, mas às vezes podem sobrecarregar o chat. Com este comando, conseguimos bloquear o envio de imagens. No momento, está desativado, mas podemos ativá-lo se for necessário!' },
    antivideo: { status: false, comment: 'Vídeos podem ser pesados e ocupar muito espaço. Este comando impede o envio de vídeos no grupo, mas está desativado por enquanto. Podemos ativá-lo quando precisar.' },
    antiaudio: { status: false, comment: 'Bloquear áudios pode ajudar a manter o chat mais limpo e sem sobrecarga. No momento, este comando está desativado, mas podemos ligá-lo sempre que quiser.' },
    antisticker: { status: false, comment: 'Adesivos são divertidos, mas às vezes precisamos de um controle maior sobre eles. Este comando bloqueia o envio de stickers (adesivos) e está desativado por agora.' },
    antidoc: { status: false, comment: 'Documentos podem ser grandes e indesejados em alguns chats. Este comando impede o envio de documentos, mas está desativado no momento.' },
    antictt: { status: false, comment: 'Às vezes, enviar contatos pode ser um pouco irritante. Com este comando, podemos bloquear o envio de contatos. Está desativado por agora, mas pode ser ativado sempre que precisar.' },
    antiloc: { status: false, comment: 'Compartilhar localização pode ser útil, mas às vezes preferimos manter isso privado. Este comando bloqueia o envio de localização. No momento, está desativado.' },
    antilinkgp: { status: false, comment: 'Links de grupos podem ser um pouco problemáticos. Este comando impede o envio de links para outros grupos. Está desativado agora, mas podemos ativá-lo quando necessário.' },
    antilink: { status: false, comment: 'Links externos podem levar para sites indesejados. Este comando bloqueia links externos no grupo. Por enquanto, está desativado.' },
    antifake: { status: false, comment: 'A detecção de perfis falsos pode ajudar a proteger o grupo de intrusos. No momento, o comando para bloquear perfis falsos está desativado.' },
    anticatalogo: { status: false, comment: 'Catálogos são legais, mas às vezes um pouco invasivos. Este comando pode bloquear o envio de catálogos, mas está desativado por agora.' },
    visuUnica: { status: false, comment: 'A visualização única das mensagens pode ser útil para evitar que o chat fique poluído com mensagens repetidas. Está desativado por enquanto, mas pode ser ativado quando você precisar.' },
    registrarFIGUS: { status: false, comment: 'Registrar figuras pode ser útil para manter um controle das imagens enviadas. Este comando está desativado por agora.' },
    soadm: { status: false, comment: 'Funções de administrador são poderosas, mas por enquanto, elas estão desativadas. Podemos ativá-las quando você precisar de mais controle sobre o grupo.' },
    listanegra: { users: [], comment: 'Esta lista contém os usuários bloqueados. Está vazia no momento, mas podemos adicionar usuários a ela se necessário.' },
     muteList: { users: [], comment: 'Esta lista contém os usuários mutados. Está vazia no momento, mas podemos adicionar usuários a ela se necessário.' },
    advertir: { users: [], comment: 'Aqui você pode listar os usuários que receberam advertências. Está vazio por enquanto, mas podemos adicionar usuários a essa lista quando necessário.' },
    comandosB: { commands: [], comment: 'Lista de comandos banidos. Caso algum comando cause problemas, podemos adicioná-lo aqui.' },
    multiprefix: { status: false, prefixos: [prefix], comment: 'Permite múltiplos prefixos para comandos. Está desativado, mas pode ser ativado se precisar de mais flexibilidade nos comandos.' },
    ausentes: { users: [], comment: 'Lista de usuários ausentes. Podemos adicionar usuários a essa lista para monitorar quem está ausente.' },
    antipalavrao: { status: false,  palavras: [], comment: 'Bloqueia palavras específicas que podem ser indesejadas no grupo. Está desativado por agora, mas podemos adicionar palavras à lista quando necessário.' },
    limitec: { status: false, quantidade: null, comment: 'Limita a quantidade de comandos que um usuário pode usar. Está desativado no momento, mas podemos ativá-lo se necessário.' },
    wellcome: { status: false, photo: false, Mains: { Enter: 'https://img12.pixhost.to/images/1102/578721670_1eb8c229565f0cae9f86.jpg', Left: 'https://img12.pixhost.to/images/1102/578721671_65884b4ef2ab8f3a200e.jpg' }, comment: 'Configurações de boas-vindas. Você pode personalizar mensagens e fotos para receber novos membros. Está desativado por agora, mas podemos ativá-lo quando você precisar.' },
    sasha: { status: false, comment: 'Ativa a simulação de comportamento para o bot. Está desativado, mas podemos ligar quando precisar de uma interação mais realista.' },
    autosticker: { status: false, comment: 'Ativa o envio automático de stickers. Está desativado por enquanto, mas podemos ativá-lo quando for necessário.' },
    autoresposta: { status: false, comment: 'Ativa respostas automáticas para facilitar a comunicação. Está desativado, mas podemos ativá-lo quando precisar.' },
    jogos: { status: false, comment: 'Ativa jogos interativos no grupo. Está desativado, mas podemos trazer mais diversão ao grupo com essa função!' },
    bangp: { status: false, comment: 'Proíbe o uso do bot no grupo. Está desativado, mas podemos ativá-lo para dar mais controle ao grupo.' }
};

const dataGp = verifyGrupo ? await (async () => {
    try {
        const found = await collections.gruposConfigs.findOne({ _id: from });
        return found || (await collections.gruposConfigs.insertOne({ _id: from, ...configsGrupo }), configsGrupo);
    } catch (error) {
        await collections.gruposConfigs.insertOne({ _id: from, ...configsGrupo });
        return configsGrupo;
    }
})() : undefined;

async function salvarConfigGrupo(novasConfigs) {
  if(!novasConfigs || typeof novasConfigs !== 'object') return

  await collections.gruposConfigs.updateOne(
    { _id: from },
    { $set: novasConfigs },
    { upsert: true }
  );
}

/* ------------- [ Funções de Donos | Premiums ] ------------- */

async function premiumSupreme() {
  if(!usuario || !usuario.plano) return false;
  return usuario.plano.some(plano => plano.status === true && plano.infinito === true);
}

const premiumDiamond = await premiumSupreme();

const verificarDono = () => {
  return usuario?.dono?.some(d => d.status === true); 
};

const SashaBot = info.key.fromMe ? true : false;

const verifyDonoOficial = nmrdn.includes(sender) || verificarDono() || SashaBot;

const verifyDono = nmrdn.includes(sender) || await verificarDono() || premiumDiamond || verifyDonoOficial || SashaBot;

const DonoOficial = nmrdn.includes(sender);

function premium() {
  if(!usuario || !usuario.plano) return false;
  return usuario.plano.some(plano => plano.status === true)
}

const premiumUser = await premium() || verifyDono || verifyDonoOficial;

var usuarios = await getUsuarios();
const getPremiuns = {
  todosPremiums: function() {
    return usuarios
      .filter(usuario => usuario?.plano?.some(plano => plano.status === true))
      .map(usuario => usuario.id);
  }
};

const getDonos = {
  todosDonos: function(usuarios) {
    return usuarios
      .filter(usuario => usuario?.dono?.some(d => d.status === true))
      .map(usuario => usuario.id);
  }
};
const donos = getDonos.todosDonos(usuarios);

const BotSupreme = groupAdmins.includes(botNumber) || false;
console.log(BotSupreme)
const membersSupreme = groupAdmins.includes(sender) || premiumDiamond || verifyDonoOficial || verifyDono;

/* ------------- [ Funções do Grupo ] ------------- */
const advertir = verifyGrupo ? dataGp.advertir.users : undefined
const verifyMultiP = verifyGrupo ? dataGp.multiprefix.status : undefined
const verifyModoBn =  verifyGrupo ? dataGp.jogos.status : undefined
const verifyPalavrao = verifyGrupo ? dataGp.antipalavrao.status : undefined
const verifyPalavras = verifyGrupo ? dataGp.antipalavrao.palavras : undefined

/* ---- [ Função da Marcação (@) | User ] ---- */
const mentionMessage = info.message?.extendedTextMessage?.contextInfo?.participant;
const mentionJid = string?.join(' ').replace('@', '') + '@s.whatsapp.net';
const mentionJidTwo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const senderNothing = query.includes('@') ? mentionJid : sender;
const mentionNumber = query.length > 6 && !query.includes('@') ? query.replace(new RegExp('[()+-/ +/]', 'gi'), '') + `@s.whatsapp.net` : mentionMessage;
const mentionTwo = query.includes('@') ? mentionJid : mentionMessage;
const mentionEveryone = query.includes('@') ? mentionJid : query.length > 6 && !query.includes('@') ? query.replace(new RegExp('[()+-/ +/]', 'gi'), '') + `@s.whatsapp.net` : mentionMessage;

/* ---- [ Função Ban Grupo | Bot Offline ] ---- */
if(verifyGrupo && verifyCmd && dataGp.bangp.status && !verifyDono) return;

if(verifyGrupo && verifyCmd && dataGp.soadm.status && !verifyDono && !membersSupreme) return;

if(!verifyDono && configs.Modos.bot.status) return;

async function reply(text) {
if(typeof text !== 'string') return await reply('Olá, string de "reply" está vazio.');
  await sasha.sendMessage(from, { text: text, mentions: [sender] }, { quoted: info });
}

const replyMessage = (texto) => sasha.sendMessage(from, { text: texto, mentions: [sender] }).catch(err => sasha.sendMessage(from, { text: 'Ocorreu um erro, tente novamente mais tarde...' }, { quoted: info }));

async function logBug(details = '', command) {
    const timestamp = new Date().toISOString();
    const bugEntry = { timestamp, command, details };
    try {
        const existingBug = bugs.bugs.find(bug => bug.command === bugEntry.command);
        if(existingBug) {
            existingBug.timestamp = timestamp;
            existingBug.details = bugEntry.details;
        } else {
            bugs.bugs.push(bugEntry);
        }
        await saveJson('./configs/media/bugs.json', bugs);
        await sasha.sendMessage(from, { text: responses.error() }, { quoted: info })
        await reagir(from, '😿');
    } catch (error) {
        await sasha.sendMessage(from, { text: responses.error() }, { quoted: info })
    }
}

/* ------- [ Horário Oficial de Brasília ] ------- */
const timeAtual = moment().tz('America/Sao_Paulo').format('HH:mm:ss');
if(timeAtual > '00:00:00' && timeAtual < '05:00:00') {
    var tempo = 'Boa noite';
} if(timeAtual > '05:00:00' && timeAtual < '12:00:00') {
    var tempo = 'Bom dia';
} if(timeAtual > '12:00:00' && timeAtual < '18:00:00') {
    var tempo = 'Boa tarde'
} if(timeAtual > '18:00:00') {
    var tempo = 'Boa noite';
};
	
const mention = async (text) => {
  const mentionedUsers = [];
  const messageLines = text.includes('\n') ? text.split('\n') : [text];
  messageLines.forEach(line => {
    line.split(' ').forEach(word => {
      const userId = verifyMention(word);
      if(userId) {
        mentionedUsers.push(`${userId}@s.whatsapp.net`);
      }
    });
  });
  await sasha.sendMessage(from, { text: text, mentions: mentionedUsers }, { quoted: info });
};

const verifyMention = (word) => {
  if(word.includes('@')) {
    const userId = parseInt(word.split('@')[1]);
    return isNaN(userId) ? null : userId;
  }
  return null;
};

const reagir = async (from, emoji) => {
await sasha.sendMessage(from, {react: {text: emoji, key: info.key}})
}

if(verifyGrupo && BotSupreme && !membersSupreme && !verifyDono) {
if(mentionJidTwo?.length >= groupMembers.length - 1) { 
await sasha.sendMessage(from, { video: { url: 'https://files.catbox.moe/7v1oef.mp4' }, caption: 'Bannng! 👈🏻\nMembro comum com mensagem de marcação de todos do grupo, por conta disso irei remover do grupo, qualquer coisa entre em contato com um administrador...', gifPlayback: true }, { quoted: info });
await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender }})
await sasha.groupParticipantsUpdate(from, [sender], 'remove')
}
}

if(verifyGrupo && dataGp.autosticker.status) {
  async function autofiguf() {
    setTimeout(async () => {
      const sticker = new Sticker();
      const isCmd = [`${prefix}sticker`, `${prefix}s`, `${prefix}stk`, `${prefix}st`, `${prefix}ssf`, `${prefix}sfundo`]
        .some(cmd => body.includes(cmd));
      if(isCmd) return;
      const handleSticker = async (mediaBuffer) => {
        sticker.addFile(mediaBuffer);
        sticker.options.metadata = { pack: `⚙️ Usuário ⤷ ${NickName}\n🤖 Criado por ⤷ ${botName}`, author: `\n🌐 Web Site ⤷ https://sasha.online\n📅 Data ⤷ ${date} - ${hora}`, emojis: ['🤠', '🥶', '😻'] };
        try {
          var data = await sticker.start();
          await sasha.sendMessage(from, { sticker: fs.readFileSync(data[0].value) }, { quoted: info });
          await reagir(from, '😺'); await deleteFile(data[0].value);
        } catch (error) {
          await logBug(error.message, command);
        }
      };
      if(type === 'imageMessage') {
        const media = await getFileBuffer(info.message.imageMessage, 'image');
        await handleSticker(media);
      }
      if(type === 'videoMessage' && verifyMedia && info.message.videoMessage.seconds < 16) {
        const media = await getFileBuffer(info.message.videoMessage, 'video');
        await handleSticker(media);
      }
    }, 1000);
  }
  autofiguf().catch();
}

if(verifyGrupo) {
    if(fs.existsSync(`./configs/media/assets/json/afk-@${NumberDonoOficial}.json`)) {
        if(budy.includes(`@${NumberDonoOficial}`)) {
            const tabelin = lerJSON(`./configs/media/assets/json/afk-@${NumberDonoOficial}.json`);
            console.log(tabelin)
            sasha.sendMessage(from, { text: `Eita! Parece que o ${donoName} foi dar um rolê e está ausente. 😅\nDesde ⤷ ${tabelin.tempo}\n😇 Olha o recado dele para nós ⤷\n—\n*\`\`\`
${tabelin.motivo}
\`\`\`*\n—\nVai ficar com saudade, mas ele já volta! 👋` }, { quoted: info });
        }
    }
}

if(verifyGrupo && dataGp.ausentes.users?.length > 0 && mentionJidTwo?.length > 0 && JSON.stringify(dataGp.ausentes.users).includes(mentionJidTwo)) {
    const ausenteIndices = mentionJidTwo.reduce((acc, id) => {
        const adminIndex = groupAdmins.indexOf(String(id));
        if(adminIndex !== -1) acc.push(adminIndex);
        return acc;
    }, []);o
    if(!ausenteIndices.length) return;
    const ausentesInfo = ausenteIndices.map(index => groupAdmins[index]).map(adminId => {
        return dataGp.ausentes.users.find(person => person.id === adminId);
    }).filter(Boolean); 
    ausentesInfo.forEach(admin => {
        const { id, mensagem } = admin;
        mention(`Oi pessoal! 👋 O nosso querido administrador @${id.split('@')[0]} foi dar uma pausa e está ausente no momento. 😎\nMas não se preocupe, ele deixou um recado para a galera:\n—\n'${mensagem}'\n\nQuando ele voltar, a energia vai ser ainda melhor! 🔥`);
    });
}

if(BotSupreme && membersSupreme && body === 'apaga' && mentionMessage) {
    try {
        await sasha.sendMessage(from, { delete: {  remoteJid: from, fromMe: false, id: info.message.extendedTextMessage.contextInfo.stanzaId, participant: mentionMessage }});
    } catch (error) {
        await reply(responses.error());
    }
}

/* -------- [ Verificação de Mídia ] -------- */
const verifyMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage' || type == 'viewOnceMessage' || type == 'viewOnceMessageV2');

const MessageType = {
    Image: type === 'imageMessage',
    Video: type === 'videoMessage',
    ViewOnceV2: type === 'viewOnceMessageV2',
    Audio: type === 'audioMessage',
    Sticker: type === 'stickerMessage',
    Contact: type === 'contactMessage',
    Location: type === 'locationMessage',
    Product: type === 'productMessage',
    Media: ['imageMessage', 'videoMessage', 'audioMessage', 'viewOnceMessage', 'viewOnceMessageV2'].includes(type)
};

/* -------- [ Define uma descrição para o tipo de mensagem recebida ] -------- */
var messageLabel = body.substr(0, 50).replace(/\n/g, '');
if(MessageType.Image) messageLabel = 'Image';
else if(MessageType.Video) messageLabel = 'Video';
else if(MessageType.Audio) messageLabel = 'Audio';
else if(MessageType.Sticker) messageLabel = 'Sticker';
else if(MessageType.Contact) messageLabel = 'Contact';
else if(MessageType.Location) messageLabel = 'Location';
else if(MessageType.Product) messageLabel = 'Product';

/* -------- [ Tipos de QuotedMessage ]  -------- */
var QuotedMessage = {
    Text: type === 'extendedTextMessage' && content.includes('conversation'),
    PlainText: type === 'extendedTextMessage' && content.includes('text'),
    Picture: type === 'extendedTextMessage' && content.includes('imageMessage'),
    Clip: type === 'extendedTextMessage' && content.includes('videoMessage'),
    Document: type === 'extendedTextMessage' && content.includes('documentMessage'),
    DocPlus: type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage'),
    Soundbite: type === 'extendedTextMessage' && content.includes('audioMessage'),
    EmojiArt: type === 'extendedTextMessage' && content.includes('stickerMessage')
};

/* ----- [ Bloqueio de Comandos | Grupo ] ----- */
if(verifyGrupo && verifyCmd && !verifyDono && dataGp.comandosB.commands?.includes(command)) {
    return await reply('Este comando está bloqueado no grupo. Você não pode utilizá-lo por aqui!');
}

/* ---- [ Bloqueio de Comandos | Global ] ---- */
if(configs.blockCmdG && Array.isArray(configs.blockCmdG['commands'])) {
if(verifyCmd && !verifyDono && configs.blockCmdG['commands'].includes(command)) {
    return await reply('Este comando está bloqueado globalmente pelo dono. Não pode ser usado em nenhum lugar!');
 }
}

/* --------- [ Ranking de mensagens em Grupos ] --------- */

async function getGroupDoc(from) {
    var groupDoc = await collections.rankMessages.findOne({ _id: from });

    if(!groupDoc) {
        groupDoc = { _id: from, users: [] };
        await collections.rankMessages.insertOne(groupDoc);
    }

    return groupDoc;
}

async function updateSenderStats(from, sender, type, verifyCmd) {
    const groupDoc = await getGroupDoc(from);
    const userIndex = groupDoc.users.findIndex(u => u.id === sender);

    if(userIndex >= 0) {
        const user = groupDoc.users[userIndex];

        user.messages = (user.messages || 0) + (verifyCmd ? 0 : 1);
        user.commands = (user.commands || 0) + (verifyCmd ? 1 : 0);
        user.device = getDevice();
        user.stickers = (user.stickers || 0) + (type === 'stickerMessage' ? 1 : 0);

        await collections.rankMessages.updateOne(
            { _id: from, 'users.id': sender },
            {
                $set: {
                    'users.$.messages': user.messages,
                    'users.$.commands': user.commands,
                    'users.$.device': user.device,
                    'users.$.stickers': user.stickers
                }
            }
        );
    } else {
        const newUser = {
            id: sender,
            messages: verifyCmd ? 0 : 1,
            commands: verifyCmd ? 1 : 0,
            device: getDevice(),
            stickers: type === 'stickerMessage' ? 1 : 0
        };

        await collections.rankMessages.updateOne(
            { _id: from },
            { $push: { users: newUser } }
        );
    }
}

async function processMessage(from, sender, type, verifyCmd, verifyGrupo) {
    if(!verifyGrupo) return;
    await updateSenderStats(from, sender, type, verifyCmd);
}

await processMessage(from, sender, type, verifyCmd, verifyGrupo);

function getDevice() {
    if(info.key.id.length > 21) {
        return 'Android';
    } else if(info.key.id.substring(0, 2) === '3A') {
        return 'iOS (IPhone)';
    } else {
        return 'WhatsApp web';
    }
}

async function handleAdvertWarning(user) {
    advertir.push(user);
    await salvarConfigGrupo(dataGp)
    var advertCount = advertir.filter(x => x == user).length;
    if(advertCount < 3) {
        await sleep(1500);
        await mention(`Ei @${split('@')[0]}, você recebeu uma advertência! Agora está com ${advertCount}/3. Cuidado! Se chegar a 3, será removido...`);
    } else {
        await sleep(1500);
        await mention(`Poxa, @${split('@')[0]}, você acumulou 3 advertências! Infelizmente, terá que sair do grupo... Converse com os admins se quiser entender o motivo.`);
        await sleep(1500);
        await sasha.groupParticipantsUpdate(from, [user], 'remove');
        var indexAdv = advertir.indexOf(user);
        advertir.splice(indexAdv, 3);
        await salvarConfigGrupo(dataGp);
    }
}

var deleteFalse = Array('tiktok', 'tiktokmp4', 'tiktokmp3', 'facebook', 'facebookmp4', 'facemp4', 'facemp3', 'instagram', 'instamp4', 'insta', 'instamp3', 'twitter','twittermp4', 'x', 'twittermp3', 'play', 'p', 'play_audio', 'playmp3', 'ytmp3', 'playaudio', 'playvideo', 'play_video', 'playvid', 'playmp4', 'ytmp4', 'shorts', 'playdoc', 'playdocumento').some(item => item === command);

function getYoutubeId(url) {
  if(typeof url !== 'string') return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if(match && match[1]) return match[1];
  }
  return null;
}

async function verifyAntis() {

  async function avisarAdmins(mensagem) {
    for (var id of groupAdmins) {
      await sasha.sendMessage(id, { text: mensagem, mentions: [sender] });
    }
  }

  async function verificarAntilinkGrupo() {
    if(dataGp.antilinkgp?.status) {  
        if(searchforURL.match(/chat\.whatsapp\.com/)) { 
            var URLgrupo = await sasha.groupInviteCode(from);  
            if(searchforURL.match(URLgrupo))  
                return await sasha.sendMessage(from, { text: 'Você mandou o link do nosso grupo, não irei te remover!' });  
            if(verifyCmd && deleteFalse) return;  
            
            await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });  
            await handleAdvertWarning(sender);  
            await avisarAdmins(`O usuário @${sender.split('@')[0]} tentou compartilhar um link proibido e tomou advertência no grupo.`);  
        }  
    }  
 }   

async function verificarAntilinkGlobal() {
    if(dataGp.global?.antilink?.status) {  
        if(isUrl(searchforURL) && searchforURL.match(/chat\.whatsapp\.com/)) {
            var URLgrupo = await sasha.groupInviteCode(from);  
            if(searchforURL.match(URLgrupo))  
                return await sasha.sendMessage(from, { text: 'Você mandou o link do nosso grupo, não irei te remover!' });  
            if(verifyCmd && deleteFalse) return;  
            
            await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });  
            await handleAdvertWarning(sender);  
            await avisarAdmins(`O usuário @${sender.split('@')[0]} tentou compartilhar um link proibido e tomou advertência no grupo.`);  
        }  
    }  
}

  async function verificarAntiImagem() {
    if(dataGp.antiimg.status && (info.message?.imageMessage)) {
      await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
      await handleAdvertWarning(sender);
      await avisarAdmins(`O usuário @${sender.split('@')[0]} tentou enviar uma imagem proibida e tomou advertência no grupo.`);
    }
  }

  async function verificarAntiSticker() {
    if(dataGp.antisticker.status && (info.message?.stickerMessage)) {
      await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
      await handleAdvertWarning(sender);
      await avisarAdmins(`O usuário @${sender.split('@')[0]} tentou enviar um sticker proibido e tomou advertência no grupo.`);
    }
  }

  async function verificarAntiDoc() {
    if(dataGp.antidoc.status && (info.message?.documentMessage)) {
      await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
      await handleAdvertWarning(sender);
      await avisarAdmins(`O usuário @${sender.split('@')[0]} tentou enviar um documento proibido e tomou advertência no grupo.`);
    }
  }

  async function verificarAntiVideo() {
    if(dataGp.antivideo.status && (info.message?.videoMessage)) {
      await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
      await handleAdvertWarning(sender);
      await avisarAdmins(`O usuário @${sender.split('@')[0]} tentou enviar um vídeo proibido e tomou advertência no grupo.`);
    }
  }

  async function verificarAntiAudio() {
    if(dataGp.antiaudio.status && (info.message?.audioMessage)) {
      await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
      await handleAdvertWarning(sender);
      await avisarAdmins(`O usuário @${sender.split('@')[0]} tentou enviar um áudio proibido e tomou advertência no grupo.`);
    }
  }
  
  async function verificarAntiConteudo() {
    if((dataGp.antictt.status && (info.message?.contactMessage || info.message?.contactsArrayMessage)) || (dataGp.antiloc.status && info.message?.locationMessage) || (dataGp.anticatalogo.status && info.message?.productMessage)) {
      await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
     await handleAdvertWarning(sender);
      await avisarAdmins(`O usuário @${sender.split('@')[0]} enviou um contato, catálogo ou localização proibido.`);
    }
}

async function verificarAntiPalavrao() {
    if(dataGp.antipalavrao.palavras.some(i => budy.includes(i.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
  }
}

 await verificarAntilinkGrupo(); await verificarAntilinkGrupo(); await verificarAntiImagem(); await verificarAntiSticker(); await verificarAntiDoc(); await verificarAntiVideo(); await verificarAntiAudio(); await verificarAntiConteudo(); await verificarAntiPalavrao();
}

if(verifyGrupo && verifyDono && SashaBot && membersSupreme) {
await verifyAntis();
}

/* ------------ [ Mute | Participante ] ------------ */
if(verifyGrupo && dataGp.muteList && dataGp.muteList.users.includes(sender)) {
    await sasha.sendMessage(from, { text: `@${sender.split('@')[0]}... você quebrou o silêncio, né? Infelizmente, regras são regras. Você está mutado neste grupo e acabou de violar isso.\n—\n⤷ Mensagem deletada e remoção executada com sucesso. Até a próxima!`, mentions: [sender] }, { quoted: info });

    await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
    await sasha.groupParticipantsUpdate(from, [sender], 'remove');
    var index = dataGp.muteList.users.indexOf(sender);
    if(index !== -1) dataGp.muteList.users.splice(index, 1);
    await salvarConfigGrupo(dataGp);
}

/* --------- [ Proibição de uso de comandos em conversas privadas no WhatsApp ] --------- */
/*const comandosLiberal = ['alugar', 'loja', 'plano', 'planos', 'addbot', 'compra-plano', 'chaves', 'dono', 'convite'];
const comandosPermitidos = comandosLiberal.includes(command)
if(!verifyGrupo && !verifyDono && !premiumUser && !SashaBot && configs.Privacidade.status && !comandosPermitidos) {
    if(SashaBot) return;
    return await reply(`Olá amigo(a), não é permitido comandos paralelos aqui no privado!  
Só permitimos estes comandos:\n\n${comandosLiberal.map(cmd => `${prefix + cmd}`).join('\n')}`);
}*/

/* --------- [ Proibição de uso de comandos  ] --------- */            
if(usuario?.block === true) {
  return await reply('Banido! Mas calma... um dia sua hora volta. Até lá, aproveite o modo espectador.');
}

if(configs.CommandsVIP && Array.isArray(configs.CommandsVIP['commands'])) {
  if(premiumUser && configs.CommandsVIP['commands'].includes(command)) {
    return await reply(`Este comando é exclusivo para usuários premium. Para obter acesso, saiba mais: ${prefix}planos`);
  }
}

/* --------- [ Limpar os membros que já saíram ou não participam mais do grupo  ] --------- */
async function LimparContador(from, groupMembers) {
    const groupDoc = await collections.rankMessages.findOne({ _id: from });
    if(!groupDoc) return;

    const groupMemberIds = groupMembers.map(i => i.id);
    const updatedUsers = groupDoc.users.filter(user => groupMemberIds.includes(user.id));

    await collections.rankMessages.updateOne(
        { _id: from },
        { $set: { users: updatedUsers } }
    );
}

/* ----- [ Nescessita de um uso de uma Array ('[]') e escolhe um de forma aleatória ] ----- */
const pickRandom = (string) => string[Math.floor(Math.random() * string.length)];

async function TikTokV3(query) {
  try {
    var data = await fetchJson(`${WebSite}/download/tiktok/v2?apikey=${ApiKeySasha}&url=${query}`);
    var resultado = data.resultado;
    var temVideo = !!resultado.video;
    var temImagens = Array.isArray(resultado.images) && resultado.images.length > 0;
    if(!temVideo && !temImagens) {
      return await reply('Erro: Nenhum vídeo ou imagem encontrado no post.');
    }
    var sendVideo = async () => {
      var legenda = (resultado.desc?.trim() || '#Sem Legenda').slice(0, 1024);
      await sasha.sendMessage(from, { video: { url: resultado.video }, caption: `*Sasha Download!*\n—\n⤷ Vídeo de *${resultado.author?.nickname || 'Desconhecido'}* (https://www.tiktok.com/${resultado.author?.nickname || ''})\n⤷ Legenda: *${legenda}*\n—\n#SashaBot - Melhor bot do WhatsApp` }, { quoted: info });
    };
    var sendImages = async () => {
      for (var  [index, imageUrl] of resultado.images.entries()) {
        await sasha.sendMessage(from, { image: { url: imageUrl }, caption: `Imagem *${index + 1} de ${resultado.images.length}*\n—\n#SashaBot - Melhor bot do WhatsApp` }, { quoted: info });
      }
      await reply('Imagens enviadas com sucesso!');
    };
    if(temVideo) await sendVideo();
    if(temImagens) await sendImages();
  } catch (error) {
     if(typeof logBug === 'function') logBug(error.message, 'tiktok');
  }
}
/*
const theme = {
  primary: '#00FF8F',
  secondary: '#AD1AFF',
  accent: '#FF2A6D',
  highlight: '#F9F002',
  text: '#FFFFFF',
  border: '#00F7FF'
};

const style = {
  border: (text) => chalk.hex(theme.border).bold(text),
  header: (text) => chalk.hex(theme.primary).bold(text),
  label: (text) => chalk.hex(theme.primary)(text),
  data: (text) => chalk.hex(theme.text)(text),
  highlight: (text) => chalk.hex(theme.secondary)(text),
  warning: (text) => chalk.hex(theme.accent)(text),
  command: (text) => chalk.hex(theme.highlight).bold(text)
};

const components = {
  header: (title) => `${style.border('│')}  ${style.header(title.padEnd(56))}`,
  divider: () => style.border(`├${'─'.repeat(58)}┤`),
  footer: () => style.border(`╰${'─'.repeat(58)}╯`),
  item: (label, value, pad = 49) => `${style.border('│')}  ${style.label(`⤷ ${label}:`)} ${style.data(value.padEnd(pad))}`
};

const formatTime = () => {
  const now = new Date();
  return style.data(`${now.toLocaleDateString('pt-BR')}, ${now.toLocaleTimeString('pt-BR')}`);
};

var ping = performance.now()
var consoleOutput = [
  style.border(`╭${'─'.repeat(58)}╮`),
  components.header(botName),
  components.divider(),
  components.item('Usuário', NickName),
  components.item('Número', sender.split('@')[0].includes('status') ? 'Status' : '+' + sender.split('@')[0].slice(0, 2) + ' ' + sender.split('@')[0].slice(2, 4) + ' ' + sender.split('@')[0].slice(4, sender.split('@')[0].length - 4) + '-' + sender.split('@')[0].slice(sender.split('@')[0].length - 4, sender.split('@')[0].length), 48),
  components.item('Ping', (performance.now() - ping).toFixed(2) + 'ms', 46),
  components.item('Dispositivo', getDevice(), 46),
  components.item('Horário', formatTime(), 46)
];

  consoleOutput.push(components.item('Chat', groupName || 'Privado'));
  if(info.message?.reactionMessage?.text) {
    consoleOutput.push(components.item('Reação', info.message.reactionMessage.text, 46));
  } else if(!verifyCmd) {
    const messageTypes = {
      stickerMessage: 'Figurinha',
      documentMessage: 'Documento',
      locationMessage: 'Localização',
      audioMessage: 'Áudio',
      videoMessage: 'Vídeo',
      imageMessage: 'Imagem'
    };
    consoleOutput.push(components.item('Tipo', messageTypes[type] || 'Mensagem'));
  }

if(verifyCmd) {
  consoleOutput.push(components.item('Comando', `${prefix + command}`, 44));
}

consoleOutput.push(
  components.footer()
);

//console.log(consoleOutput.join('\n'));
*/
function BotInfo(MenuCompleto) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  data = new Date().toLocaleDateString('pt-BR', options);
  const hora = new Date().toLocaleTimeString('pt-BR');
  return `❏ 𝗦𝗮𝘀𝗵𝗮 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝗰̧𝗼̃𝗲𝘀
⤷ 𝗕𝗼𝘁: ${botName}
⤷ 𝗗𝗼𝗻𝗼: ${donoName}
⤷ 𝗨𝘀𝘂𝗮́𝗿𝗶𝗼: ${NickName}!
⤷ 𝗣𝗿𝗲𝗳𝗶𝘅𝗼: ${prefix}
⤷ 𝗗𝗮𝘁𝗮: ${data}
⤷ 𝗛𝗼𝗿𝗮: ${hora}
⤷ 𝗛𝗼𝘀𝘁: Linux (Ubuntu 22.04 LTS)
⤷ 𝗩𝗲𝗿𝘀𝗮̃𝗼: ${packname.version}
⤷ 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺𝗮: Whatsapp (Bailyes MD) 

${MenuCompleto}`;
}

const languages = [
    { language: 'Português', code: 'pt', countryCode: '55' },
    { language: 'Inglês', code: 'en', countryCode: '1' },
    { language: 'Espanhol', code: 'es', countryCode: '34' },
    { language: 'Francês', code: 'fr', countryCode: '33' },
    { language: 'Alemão', code: 'de', countryCode: '49' },
    { language: 'Argentina', code: 'es', countryCode: '54' }
];

function getLanguage(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const countryCode = cleanNumber.slice(0, 3);
    const result = languages.find(entry => entry.countryCode === countryCode);
    
    if(result) {
        return { language: result.language, code: result.code };
    } else {
        return { language: 'Português', code: 'pt' };
    }
}
  
if(sender !== 'status@broadcast') {
    var languageData = getLanguage(sender.split('@')[0]);

    if(addUsuario({
        id: sender, 
        nome: NickName, 
        idade: 16, 
        saldo: 0,
        registrado: new Date().toISOString(), 
        idioma: languageData.language, 
        lang: languageData.code, 
        block: false,
        disabled: false 
    })) {
    }
}


/* ----- [ Função para Validar os grupos  ] ----- */
const comandosAluguel = ['alugar', 'loja', 'plano', 'planos', 'addbot', 'compra-plano', 'chaves', 'dono', 'convite'].includes(command); 

async function validarChave(query) {
    const usuario = await getUsuarioById(sender);
    const chaveEncontrada = usuario?.chaves?.find(c => c.chave === query); 
    if(!chaveEncontrada) return;
    usuario.chaves = usuario.chaves.filter(c => c.chave !== query);
    const aluguelExistente = usuario.alugueis?.find(a => a.grupo === from && a.status === true);
    if(aluguelExistente) {
        aluguelExistente.dataVencimento = new Date(aluguelExistente.dataVencimento.getTime() + chaveEncontrada.dias * 86400000);
        await updateUsuario(sender, usuario);
        await sasha.sendMessage(nmrdn, { text: `A chave foi validada no grupo ${groupName} pelo usuário ${usuario.nome}.\nChave: ${chaveEncontrada.chave}\nDias restantes: ${chaveEncontrada.dias} dia(s).\nRenovação de aluguel realizada!` });
        return await reply(`✓ Aluguel do grupo *${aluguelExistente.groupName}* renovado com sucesso!\nNovo vencimento: ${formatarData(new Date(aluguelExistente.dataVencimento))}`);
    } else {
        if(!usuario.alugueis) usuario.alugueis = [];
        const novoAluguel = { grupo: from, groupName: groupName, status: true, dataVencimento: new Date(new Date().getTime() + chaveEncontrada.dias * 86400000), dataRegistro: new Date() };
        usuario.alugueis.push(novoAluguel);
        await updateUsuario(sender, usuario);
        await sasha.sendMessage(nmrdn, { text: `O usuário ${usuario.nome} adicionou um novo aluguel no grupo ${groupName}\nVencimento: ${formatarData(novoAluguel.dataVencimento)}.\nRegistro de aluguel realizado!` });
        return await reply(`✓ Aluguel adicionado com sucesso!\,n—\nGrupo: *${novoAluguel.groupName}*\nVencimento: ${formatarData(novoAluguel.dataVencimento)}\n—\nAproveite sua experiência no grupo!`);
    }
}

await validarChave(budy);

if(verifyGrupo && configs.Modos.aluguel && !premiumUser && !verifyDono && verifyCmd && !comandosAluguel && !configs.gruposPermitidos['grupos'].includes(from) && !(Array.isArray(await getUsuarios()) && (await getUsuarios()).some(usuario => Array.isArray(usuario.alugueis) && usuario.alugueis.some(aluguel => aluguel.grupo === from && aluguel.dataVencimento && new Date(aluguel.dataVencimento) >= new Date())))) {
  return await sasha.sendMessage(from, { text: `‼️ *Precisam adquirir uma chave para continuar utilizando os comandos deste grupo.*\nEntre em contato com o dono do bot para obter uma chave e acessar as funcionalidades.` });
}


function formatarData(data) {
        var meses = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
        var d = new Date(data);
        var dia = d.getDate();
        var mes = meses[d.getMonth()];
        var ano = d.getFullYear();
        var horas = d.getHours().toString().padStart(2, '0');
        var minutos = d.getMinutes().toString().padStart(2, '0');
        return `${dia} de ${mes} de ${ano} às ${horas}:${minutos}`;
}

const formatarTime = (segundos) => {
      var data = new Date(segundos * 1000);
            return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
       });
};

  function extrairUsuario(entrada) {
    var parametros = entrada.split('/');
    return {
      usuario: parametros[0].replace('@', '') + '@s.whatsapp.net',
      quantidadeDias: Number(parametros[1])
    };
  }
  
  function configurarUsuario(entrada) {
    var parametros = entrada.split('/');
    if(parametros.length === 1) {
      return {
        usuario: sender,
        quantidadeDias: parametros[0],
      };
    }
    return {
      usuario: parametros[0].replace('@', '') + '@s.whatsapp.net',
      quantidadeDias: parametros[1],
    };
  }

/* ----- [ Começo das Cases | Comandos ] ----- */
switch (command) {
  
case 'registraraluguel':
  if(!verifyDonoOficial) return await reply(responses.dono());
  var entrada = query.replace(/ ?\/ ?/, '/');
  var { usuario: usuarioFinal, quantidadeDias: diasFinal } = configurarUsuario(entrada);
  if(!diasFinal || isNaN(diasFinal) || diasFinal <= 0) {
    return await reply(`Informe um número válido de dias! Ex: ${prefix}registraraluguel 30 ou ${prefix}registraraluguel @user/30`);
  }
  if(usuarioFinal !== sender) {
    var [existe] = await sasha.onWhatsApp(usuarioFinal);
    if(!existe) return await reply(`O número *${usuarioFinal.split('@')[0]}* não é válido.`);
  }
  var usuarioEncontrado = await getUsuarioById(usuarioFinal);
  if(!usuarioEncontrado) return await reply('Usuário não encontrado.');
  if(!Array.isArray(usuarioEncontrado.alugueis)) {
    usuarioEncontrado.alugueis = [];
  }
  var agora = new Date();
  var diasEmMs = Number(diasFinal) * 24 * 60 * 60 * 1000;
  var aluguelExistente = usuarioEncontrado.alugueis.find(aluguel => aluguel.grupo === from);
  if(aluguelExistente) {
    var vencimentoAtual = new Date(aluguelExistente.dataVencimento);
    var novoVencimento = vencimentoAtual >= agora ? new Date(vencimentoAtual.getTime() + diasEmMs) : new Date(agora.getTime() + diasEmMs);
    aluguelExistente.dataVencimento = novoVencimento;
    aluguelExistente.status = true;
    await updateUsuario(usuarioFinal, usuarioEncontrado);
    return await mention(`✓ *Aluguel renovado com sucesso!*\n—\n👤 *Usuário:* @${usuarioFinal.split('@')[0]}\n+ *Dias adicionados:* ${diasFinal} dia(s)\n📆 *Novo vencimento:* ${formatarData(novoVencimento)}`);
  } else {
    var novoVencimento = new Date(agora.getTime() + diasEmMs);
    usuarioEncontrado.alugueis.push({ grupo: from, groupName: groupName || 'Sem nome', status: true, dataRegistro: agora, dataVencimento: novoVencimento });
    await updateUsuario(usuarioFinal, usuarioEncontrado);
    return await mention(`✓ *Aluguel registrado com sucesso!*\n—\n👤 *Usuário:* @${usuarioFinal.split('@')[0]}\n🗓️ *Dias alugados:* ${diasFinal} dia(s)\n📆 *Vencimento:* ${formatarData(novoVencimento)}`);
}
break;

case 'permitirgrupo':
    if(!verifyDono) return await reply(responses.dono());
    var grupoId = string.join(' ').trim();
    if(!grupoId) grupoId = from;
    if(typeof grupoId !== 'string') return await reply('O ID do grupo fornecido é inválido. Verifique e tente novamente.');
    if(configs.gruposPermitidos.grupos.includes(grupoId)) {
        return await reply('Este grupo já está na lista de permitidos.');
    }
    configs.gruposPermitidos.grupos.push(grupoId);
    await saveJson('./configs/configs.json', configs);
    var nomeGrupo = groupName || '#SashaGrupos';
    await reply(`Grupo '${nomeGrupo}' adicionado com sucesso à lista de grupos permitidos.`);
break;

case 'removergrupo':
    if(!verifyDono) return await reply(responses.dono());
    var grupoIdRemover = string.join(' ').trim();
    if(!grupoIdRemover) grupoIdRemover = from;
    if(typeof grupoIdRemover !== 'string') return await reply('O ID do grupo fornecido é inválido. Verifique e tente novamente.');
    if(!configs.gruposPermitidos.grupos.includes(grupoIdRemover)) {
        return await reply('Este grupo não está na lista de permitidos.');
    }
    configs.gruposPermitidos.grupos = configs.gruposPermitidos.grupos.filter(id => id !== grupoIdRemover);
    await saveJson('./configs/configs.json', configs);
    const nomeGrupoRemovido = groupName || '#SashaGrupos';
    await reply(`Grupo '${nomeGrupoRemovido}' removido com sucesso da lista de grupos permitidos.`);
break;

case 'listpermitidos':
    if(!verifyDono) return await reply(responses.dono());
    var gruposPermitidos = configs.gruposPermitidos.grupos;
    if(!gruposPermitidos || gruposPermitidos.length === 0) {
        return await reply('Não há grupos permitidos na lista.');
    }
   var gruposDetalhados = [];
    for (var  grupoId of gruposPermitidos) {
          var grupoINFO = await sasha.groupMetadata(grupoId);
          gruposDetalhados.push(`*${gruposDetalhados.length + 1}.* ${grupoINFO.subject || '#SemNome'}\n*id:* ${grupoId}`);
    }
    var resposta = `Lista de grupos permitidos:\n${gruposDetalhados.join('\n—\n')}`;
    await reply(resposta);
break;

case 'renovaraluguel':
    if(!verifyDonoOficial) return await reply(responses.dono());
    if(!query) return await reply('Adicione quantos dias você quer adicionar na renovação do grupo.');
    var diasRenovar = parseInt(query);
    if(isNaN(diasRenovar) || diasRenovar <= 0) return await reply('Por favor, informe um número válido de dias para renovar.');
    var usuarios = await getUsuarios();
    for (var usuario of usuarios) {
        if(usuario.alugueis) {
            for (var aluguel of usuario.alugueis) {
                if(aluguel.grupo === from && aluguel.status === true) {
                    var novaDataVencimento = new Date(aluguel.dataVencimento).getTime() + diasRenovar * 86400000;
                    aluguel.dataVencimento = new Date(novaDataVencimento);
                    await updateUsuario(usuario.id, usuario);
                    return await reply(`Aluguel renovado com sucesso! Novo vencimento: ${formatarData(new Date(novaDataVencimento))}`);
                }
            }
        }
    }
    return await reply('Não foi encontrado nenhum aluguel ativo para este grupo.');
break;

case 'deletaraluguel':
    if(!verifyDonoOficial) return await reply(responses.dono());
    var grupoId = string.join(' ');
    if(!grupoId || typeof grupoId !== 'string') grupoId = from;
    var usuarios = await getUsuarios();
    for (var usuario of usuarios) {
        if(usuario.alugueis) {
            for (var i = 0; i < usuario.alugueis.length; i++) {
                var aluguel = usuario.alugueis[i];
                if(aluguel.grupo === grupoId && aluguel.status === true) {
                    usuario.alugueis.splice(i, 1); 
                    await updateUsuario(usuario.id, usuario);
                    return await reply(`Aluguel do grupo *${groupName}* deletado com sucesso.`);
                }
            }
        }
    }
    return await reply('Não foi encontrado nenhum aluguel ativo para este grupo.');
break;

case 'tirardias':
    if(!verifyDonoOficial) return await reply(responses.dono());
    if(!query) return await reply('Informe quantos dias deseja remover do aluguel.');
    var diasRemover = parseInt(query);
    if(isNaN(diasRemover) || diasRemover <= 0) return await reply('Por favor, informe um número válido de dias.');
    var usuarios = await getUsuarios();
    for (var usuario of usuarios) {
        if(usuario.alugueis) {
            for (var aluguel of usuario.alugueis) {
                if(aluguel.grupo === from && aluguel.status === true) {
                    var novaDataVencimento = new Date(aluguel.dataVencimento).getTime() - diasRemover * 86400000;
                    aluguel.dataVencimento = new Date(novaDataVencimento);
                    await updateUsuario(usuario.id, usuario);
                    return await reply(`Dias removidos com sucesso. Novo vencimento: ${formatarData(new Date(novaDataVencimento))}`);
                }
            }
        }
    }
    return await reply('Não foi possível alterar o aluguel.');
break;

case 'listalugueis': case 'listaalugueis':
    if(!verifyDonoOficial) return await reply(responses.dono());
    var usuarios = await getUsuarios();
    var alugueisGrupo = [];
    for (var usuario of usuarios) {
        if(usuario.alugueis) {
            for (var aluguel of usuario.alugueis) {
                if(aluguel.status === true) {
                    alugueisGrupo.push({ usuarioId: usuario.id, aluguel });
                }
            }
        }
    }
    if(alugueisGrupo.length === 0) return await reply('Não há aluguéis ativos para este grupo.');
    var listaAlugueis = alugueisGrupo.map(item => {
        var aluguel = item.aluguel;
        var usuarioId = item.usuarioId;
        return `Alugado por: @${usuarioId.split('@')[0]}\nGrupo: *${aluguel.groupName}* - Vencimento: ${formatarData(new Date(aluguel.dataVencimento))}`;
    }).join('\n—\n');
    return await mention(`[ Aluguéis ativos global na ${botName} ]\n—\n${listaAlugueis}`);
break;

case 'vencimentos':
    if(!verifyDonoOficial) return await reply(responses.dono());
    var agora = new Date();
    var resposta = `⏳ *Aluguéis próximos de vencer:* (Vencem em até 3 dias)\n\n`;
    var usuarios = await getUsuarios();
    usuarios.forEach(usuario => {
        usuario.alugueis?.forEach((aluguel, index) => {
            const diasRestantes = Math.floor((new Date(aluguel.dataVencimento) - agora) / (1000 * 60 * 60 * 24));
            if(diasRestantes <= 3 && diasRestantes >= 0) {
                resposta += `*Cliente*: wa.me/${usuario.id.split('@')[0]}\n`;
                resposta += `${index + 1}.`;
                resposta += `*Grupo:* ${aluguel.groupName}\n`;
                resposta += `*Vence em:* ${formatarData(new Date(aluguel.dataVencimento))} (${diasRestantes} dia(s) restantes)\n`;
                resposta += `*Registrado em:* ${formatarData(new Date(aluguel.dataRegistro))}\n\n`;
            }
        });
    });
    if(resposta === `⏳ *Aluguéis próximos de vencer:* (Vencem em até 3 dias)\n\n`) {
        return await reply('Não há aluguéis próximos de vencer.');
    }
    return await reply(resposta.trim());
break;

case 'gerarcoderent': 
    if(!verifyDonoOficial) return await reply(responses.dono());
    var entrada = query.replace(' /', '/').replace('/ ', '/').replace(' / ', '/');
    var { usuario: usuarioFinal, quantidadeDias: diasFinal } = configurarUsuario(entrada);
    if(!diasFinal || isNaN(diasFinal) || diasFinal <= 0) {
        return await reply('Número de dias inválido! Informe um valor numérico maior que zero (ex: !gerarcoderent 30 ou !gerarcoderent @user/30).');
    }
    if(usuarioFinal !== sender) {
        var [existe] = await sasha.onWhatsApp(usuarioFinal);
        if(!existe) {
            return await reply(`O número *${usuarioFinal.split('@')[0]}* não é válido no WhatsApp.`);
        }
    }
    var usuarioEncontrado = await getUsuarioById(usuarioFinal);
    if(!usuarioEncontrado) return await reply('Usuário não encontrado. Algo deu errado!');
    if(!usuarioEncontrado.chaves) usuarioEncontrado.chaves = [];
    var chave = `G${diasFinal}-` + new Date().getTime().toString().slice(-11, -1) + `M${diasFinal}H-` + Math.floor(Math.random() * 999999).toString().padStart(6, '0') + 'B';
    usuarioEncontrado.chaves.push({ chave, dias: parseInt(diasFinal), criadoEm: new Date() });
    await updateUsuario(usuarioFinal, usuarioEncontrado); 
    await mention(`*Chave gerada com sucesso!*\n—\n*Chave:* ${chave}\n*Usuário:* @${usuarioFinal.split('@')[0]}\n*Dias alugados:* ${diasFinal} dia(s)\n—\nUse com sabedoria, mestre do sistema!`);
   await replyMessage(chave);
break;

case 'transferiraluguel':
  if(!verifyGrupo) return await reply(responses.grupo());
  var usuarioOrigem = await getUsuarioById(sender);
  if(!usuarioOrigem) return await reply('Você não possui nenhum registro de aluguel.');
  var aluguelAtual = usuarioOrigem.alugueis?.find(a => a.grupo === from);
  if(!aluguelAtual) return await reply('Você não é o dono do aluguel deste grupo.');
  var agora = new Date();
  var vencimentoAtual = new Date(aluguelAtual.dataVencimento);
  if(vencimentoAtual < agora) return await reply('O aluguel atual já está vencido e não pode ser transferido.');
  var diasFinal = Math.floor((vencimentoAtual - agora) / (1000 * 60 * 60 * 24));
  var chave = `G${diasFinal}-` + new Date().getTime().toString().slice(-11, -1) + `M${diasFinal}H-` + Math.floor(Math.random() * 999999).toString().padStart(6, '0') + 'B';
  usuarioOrigem.alugueis = usuarioOrigem.alugueis.filter(a => a.grupo !== from);
  if(!usuarioOrigem.chaves) usuarioOrigem.chaves = [];
  usuarioOrigem.chaves.push({ chave, dias: diasFinal, criadoEm: new Date() });
  await updateUsuario(sender, usuarioOrigem);
  await mention(`*Chave de transferência gerada com sucesso!*\n—\n*Chave:* ${chave}\n*Usuário:* @${sender.split('@')[0]}\n*Dias alugados:* ${diasFinal} dia(s)\n—\nUse com sabedoria, mestre do sistema!`);
  await replyMessage(chave);
break;

case 'minhascoderent':
    var usuarioEncontrado = await getUsuarioById(sender);
    if(!usuarioEncontrado?.chaves || usuarioEncontrado.chaves.length === 0) {
        return await reply('Você não possui nenhuma chave ativa.');
    }
    var lista = usuarioEncontrado.chaves.map((chave, index) => {
        return `🔐 *${index + 1}.* ${chave.chave}\nDias: ${chave.dias}\nCriado em: ${new Date(chave.criadoEm).toLocaleDateString()}`;
    }).join('\n—\n');
    return await reply(`🔑 *Suas chaves ativas:*\n\n${lista}`);
break;

case 'listcoderent':
    if(!verifyDonoOficial) return await reply(responses.dono());
    var usuarios = await getUsuarios ();
    var listaGeral = usuarios
        .filter(user => user.chaves && user.chaves.length > 0)
        .map(user => {
            var chaves = user.chaves.map(c => `⤷ ${c.chave} com ${c.dias === 1 ? '1 dia' : `${c.dias} dias`}`).join('\n—\n');
            return `chaves de: *@${user.id.split('@')[0]}*\n—\n${chaves}`;
        });
    if(listaGeral.length === 0) return await reply('Nenhuma chave registrada.');
    return await mention(`📦 *Lista de chaves geradas:*\n\n${listaGeral.join('\n\n')}`);
break;

case 'estatisticascoderent':
    if(!verifyDonoOficial) return await reply(responses.dono());
    const usuariosEstat = await getUsuarios();
    const usuariosComChaves = usuariosEstat.filter(user => Array.isArray(user.chaves) && user.chaves.length > 0);
    const [totalChaves, totalDias] = usuariosComChaves
        .map(user => user.chaves)
        .flat()
        .reduce(([totalChaves, totalDias], chave) => {
            return [
                totalChaves + 1, 
                totalDias + (isNaN(chave.dias) ? 0 : Number(chave.dias))
            ];
        }, [0, 0]); 
       return await reply(`📊 *Estatísticas do sistema Coderent:*\n—\n👥 Usuários com chave(s): *${usuariosComChaves.length}*\n🔐 Total de chaves geradas: *${totalChaves}*\n⏳ Total de dias alugados: *${totalDias}* dia(s)`);
break;

case 'removercoderent':
    if(!verifyDonoOficial) return await reply(responses.dono());
    var usuarios = await getUsuarios();
    for (var user of usuarios) {
        var novaLista = user.chaves?.filter(c => c.chave !== query);
        if(novaLista && novaLista.length !== user.chaves?.length) {
            user.chaves = novaLista;
            await updateUsuario(user.id, user);
            return await reply(`Chave *${query}* removida com sucesso.`);
        }
    }
    return await reply('Chave não encontrada.');
break;

case 'limparcoderent':
    if(!verifyDonoOficial) return await reply(responses.dono());
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque apenas um usuário para remover as chaves de alugueis dele.');
    var userLimpar = await getUsuarioById(mentionTwo);
    if(!userLimpar) return await reply('Usuário não encontrado.');
    userLimpar.chaves = [];
    await updateUsuario(mentionTwo, userLimpar);
    return await reply(`🧹 Todas as chaves de *${alvo.split('@')[0]}* foram removidas.`);
break;

case 'validarcoderent':
    if(!query) return await reply('Informe a chave para verificar.');
    var usuarios = await getUsuarios();
    for (var user of usuarios) {
        var chave = user.chaves?.find(c => c.chave === chaveValida);
        if(chave) {
            return await reply(`*Chave válida!*\n—\nUsuário: ${user.id.split('@')[0]}\nDias: ${chave.dias}\nCriada em: ${new Date(chave.criadoEm).toLocaleDateString()}` );
        }
    }
    return await reply('Chave inválida ou expirada.');
break;

case 'listDatabase':
    if(!verifyDonoOficial) return await reply(responses.dono());
    const { MongoClient } = require('mongodb');
    try {
        const client = new MongoClient(`mongodb+srv://bieelsiilvax:Biel123@cluster0.mybeluq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        await client.connect();
        const admin = client.db().admin();
        const result = await admin.listDatabases();
        if(!result.databases || result.databases.length === 0) {
            await reply('Nenhum banco de dados encontrado no servidor.');
        } else {
            const lista = result.databases.map((db, i) => `*[${i + 1}]* ⤷ ${db.name}`).join('\n');
            await reply(`*Bancos de Dados no Servidor:*\n\n${lista}`);
        }
        await client.close();
    } catch (error) {
        await reply('Falha ao listar os bancos de dados. Tente novamente mais tarde.');
    }
break;

case 'deletedatabase':
    if(!verifyDonoOficial) return await reply(responses.dono());
    if(!query) return await reply('Informe o nome do banco de dados que deseja deletar.');
    try {
        const dbName = query.trim();
        const { MongoClient } = require('mongodb');
        const uri = 'mongodb+srv://bieelsiilvax:Biel123@cluster0.mybeluq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await client.connect();
        const admin = client.db().admin();
        const databases = await admin.listDatabases();
        const exists = databases.databases.some(db => db.name === dbName);
        if(!exists) {
            await client.close();
            return await reply(`O banco *${dbName}* não existe.`);
        }
        const db = client.db(dbName);
        await db.dropDatabase();
        await client.close();
        await reply(`O banco de dados *${dbName}* foi apagado com sucesso (a pasta inteira sumiu do cluster).`);
    } catch (error) {
        await reply('Erro ao apagar o banco de dados. Verifique o nome ou tente novamente mais tarde.');
    }
break;

case 'getcollectioninfo':
    if(!verifyDonoOficial) return await reply(responses.dono());
    if(!query) return await reply('Informe o nome da coleção');
    try {
        const collection = db.collection(query);
        const stats = await db.command({ collStats: query });
        await reply(`*Informações da coleção ${query} no banco SashaBot#2025:*\n⤷ Documentos: *${stats.count}*\n⤷ Tamanho: *${stats.size.toLocaleString()} bytes*\n⤷ Tamanho total armazenado: *${stats.storageSize.toLocaleString()} bytes*\n⤷ Número de índices: *${stats.nindexes}*\n⤷ Tamanho dos índices: *${stats.totalIndexSize.toLocaleString()} bytes*`);
        const exampleDocs = await collection.find().limit(1).toArray();
        if(exampleDocs.length > 0) {
            await reply('*Exemplo de documentos na coleção:*');
            for (const doc of exampleDocs) {
                await replyMessage('```json\n' + JSON.stringify(doc, null, 2) + '\n```');
            }
        } else {
            await reply('A coleção está vazia.');
        }
    } catch (error) {
        await reply('Erro ao obter informações sobre a coleção. Verifique se o banco e a coleção existem.');
    }
break;

case 'clearcollection':
    if(!verifyDonoOficial) return await reply(responses.dono());
    if(!query) return await reply('Informe o nome da coleção para limpar');
    try {
        const collection = db.collection(query);
        const result = await collection.deleteMany({}); 
        await reply(`Todos os documentos na coleção *SashaBot#2025* do banco *${query}* foram removidos com sucesso.\nTotal de documentos removidos: *${result.deletedCount}*`);
    } catch (error) {
        await reply('Erro ao limpar a coleção. Verifique se o banco e a coleção existem.');
    }
break;

case 'meuplano': 
  var usuario = await getUsuarioById(sender);
  if(!usuario) return reply('Usuário não encontrado.'); 
  var texto = '*🔐 INFORMAÇÕES DO SEU PLANO E SERVIÇOS*\n\n';
  if(usuario.plano && usuario.plano.length > 0) {
    var plano = usuario.plano[0];
    texto += `*Plano Ativo:* ${plano.tipo}\n`;
    texto += `*Início:* ${formatarData(plano.dataCriacao)}\n`;
    texto += plano.infinito ? `*Expiração:* Ilimitado\n` : `*Expiração:* ${formatarData(plano.dataExpiracao)}\n`;
  } else {
    texto += '*Plano:* Nenhum plano ativo\n';
  }
  var alugueis = usuario.alugueis?.filter(a => a.status) || [];
  if(alugueis.length > 0) {
    texto += `\n*Grupos no seu nome:* ${alugueis.length}\n`;
    alugueis.forEach((a, i) => {
      texto += `\n${i + 1}. ${a.groupName}\n`;
      texto += `Início: ${formatarData(a.dataRegistro)}\n`;
      texto += `Vencimento: ${formatarData(a.dataVencimento)}\n`;
    });
  } else {
    texto += '*Grupos no seu nome:* Nenhum grupo alugado no momento.\n';
  }
  var chaves = usuario.chaves?.filter(c => c.status) || [];
  if(chaves.length > 0) {
    texto += `\n*Chaves Ativas:* ${chaves.length}\n`;
    chaves.forEach((c, i) => {
      texto += `\n${i + 1}. ${c.dias} dias\n`;
      texto += `Ativada em: ${formatarData(c.dataRegistro)}\n`;
      texto += `Expira em: ${formatarData(c.dataVencimento)}\n`;
    });
  } else {
    texto += '*Chaves Ativas:* Nenhuma chave ativa.\n';
  }
  texto += '\nPara renovar ou adquirir mais serviços, digite *loja*.';
  await sasha.sendMessage(from, { text: texto }, { quoted: info });
break;

case 'premiumlist':
  var premiums = getPremiuns.todosPremiums();
  if(!premiums || premiums.length === 0) return await reply('Nenhum usuário premium encontrado no momento.');
  var lista = '[ Lista De Usuários Premium ]\n—\n';
  for (var i = 0; i < premiums.length; i++) {
    var id = premiums[i];
    var usuario = await getUsuarioById(id);
    if(usuario && Array.isArray(usuario.plano) && usuario.plano.length > 0) {
      lista += `${i + 1}. ${usuario.nome || 'Usuário(a)'}\n`;
      usuario.plano.forEach((plano, j) => {
        var tipoPlano = plano.infinito ? 'Supreme' : plano.tipo;
        var validadeTexto = plano.infinito ? 'sem data de validade' : '';
        if(!plano.infinito && plano.dataExpiracao) {
          var dataExp = new Date(plano.dataExpiracao);
           validadeTexto = `${formatarData(dataExp)}`;
        }
        lista += `⤷ Plano: ${tipoPlano}\n⤷ Expira: ${validadeTexto}\n`;
      });

      lista += `⤷ wa.me/${id.split('@')[0]}\n\n`;
    }
  }
  lista += `Total de *${premiums.length}* usuários premium`;
  await sasha.sendMessage(from, { text: lista }, { quoted: info });
break;
  
case 'premium':
  if(!verifyDonoOficial) return await reply(responses.dono());
  if(!mentionMessage) return await reply(`Erro! Para ativar o plano premium, marque *apenas uma pessoa*.\nVocê pode:\n Responder a mensagem dela\nExemplo de comando: *${prefix}premium 1* (para ativar o plano Prata)`);
  var planosPremium = {
    0: { dias: 0, nome: 'Supreme', infinito: true },
    1: { dias: 7, nome: 'Prata' },
    2: { dias: 15, nome: 'Ouro' },
    3: { dias: 30, nome: 'Platina' },
    4: { dias: 365, nome: 'Diamante' },
  };
  if(!query || !planosPremium[query]) {
    return await reply(`Plano inválido! Escolha um número de 0 a 4 para o plano.\n\nPlanos disponíveis:\n- *0*: Supreme (Infinito)\n- *1*: Prata (7 dias)\n- *2*: Ouro (15 dias)\n- *3*: Platina (30 dias)\n- *4*: Diamante (365 dias)`);
  }
  var { dias, nome, infinito } = planosPremium[query];
  var usuario = await getUsuarioById(mentionMessage);
  if(!usuario) return await reply('Usuário não encontrado. Tente novamente.');
  if(!Array.isArray(usuario.plano)) usuario.plano = [];
  var agora = new Date();
  var expiracao = infinito ? null : new Date();
  if(!infinito) {
    expiracao.setDate(agora.getDate() + dias); 
  }
  if(usuario.plano.length > 0) {
    Object.assign(usuario.plano[0], { tipo: nome, status: true, dataCriacao: agora.toISOString(), dataExpiracao: expiracao ? expiracao.toISOString() : null, infinito, number: 0 });
  } else {
    usuario.plano.push({ tipo: nome, status: true, dataCriacao: agora.toISOString(), dataExpiracao: expiracao ? expiracao.toISOString() : null, infinito, number: 0 });
  }
  await updateUsuario(mentionMessage, usuario);
  var validadeTexto = infinito ? 'Infinito' : expiracao.toLocaleDateString('pt-BR');
  await reply(`Plano ${nome} ativado com sucesso! O seu plano está válido até: *${validadeTexto}*. Aproveite os benefícios exclusivos!`);
  await sasha.sendMessage(mentionMessage, { text: `Você foi autorizado ao plano *${nome}*! Seu plano é válido até *${validadeTexto}*. Aproveite os benefícios premium!`, mentions: [mentionMessage] });
break;

case 'remover':
  if(!verifyDonoOficial) return await reply(responses.dono());
  if(!mentionTwo || mentionJidTwo[1]) return await reply('Ei! Pra eu remover o plano do usuário, você precisa marcar *só uma pessoa*.\nresponda a mensagem dela ou mande o número com DDD. Simples, né?');
  var usuario = await getUsuarioById(mentionTwo);
  if(!usuario) return await reply('Usuário não encontrado. Tente novamente.');
  if(!Array.isArray(usuario.plano) || usuario.plano.length === 0) {
    return await reply('Este usuário não possui um plano ativo.');
  }
  usuario.plano = [];
  await updateUsuario(mentionTwo, usuario);
  await reply('Plano removido com sucesso!');
  await sasha.sendMessage(mentionTwo, { text: `Seu plano foi removido. Caso tenha sido um engano, contate o ${prefix}suporte.`, mentions: [mentionTwo] });
break;

case 'recarga':
  try {
    if(!query) return await reply('Por favor, informe o valor de recarga.');
    var valorRecarga = parseFloat(query);
    if(isNaN(valorRecarga) || valorRecarga <= 0) {
      return await reply('Valor inválido. Certifique-se de informar um valor maior que zero.');
    }
    var { Payment } = require('./pagamento/index');
    var payment = new Payment(settings['MercadoPago'].acessToken);
    var paymentDetails = await payment.create_payment(valorRecarga);

    if(paymentDetails && paymentDetails.qr_code) {
      await reply(`Para concluir a recarga de R$${valorRecarga}, por favor, escaneie o QR Code abaixo.`);
      await sasha.sendMessage(sender, { image: Buffer.from(paymentDetails.qr_code, 'base64'), caption: `Aguardando pagamento de R$${valorRecarga}. Escaneie o QR Code para prosseguir.` });
      await sasha.sendMessage(sender, { text: paymentDetails.copy });
      var check = await payment.check_payment();
      while (check.status === 'pending') {
        check = await payment.check_payment();
      }
      if(check.status === 'approved') {
        var usuario = await getUsuarioById(sender);
        if(!usuario) {
          return await reply('Usuário não encontrado. Tente novamente mais tarde.');
        }
        usuario.saldo += valorRecarga;
        await updateUsuario(sender, usuario);
        await sasha.sendMessage(sender, { text: `A recarga de R$${valorRecarga} foi realizada com sucesso! Seu saldo atual é de R$${usuario.saldo.toFixed(2)}.` });
      } else {
        return await reply('Pagamento não aprovado. Por favor, tente novamente ou entre em contato com o suporte.');
      }
    } else {
      await reply('O pagamento está sendo processado. Aguarde a confirmação.');
    }
  } catch (error) {
    await reply('Ocorreu um erro ao processar sua recarga. Tente novamente mais tarde ou entre em contato com o suporte.');
  }
break;

case 'addsaldo':
    if(!verifyDono) return await reply(responses.dono())
    if(!mentionEveryone) return await reply('Você esqueceu de mencionar o alvo! Por favor, mencione o usuário que deve receber o saldo.');
    var valorRecarga = parseFloat(query);
    if(isNaN(valorRecarga) || valorRecarga <= 0) {
      return await reply('O valor informado é inválido! Por favor, insira um valor válido maior que zero para a recarga.');
    }
    var usuario = await getUsuarioById(mentionEveryone);
    if(!usuario) {
      return await reply('Não foi possível encontrar o usuário mencionado. Verifique se o ID está correto ou tente novamente mais tarde.');
    }
    usuario.saldo += valorRecarga;
    await updateUsuario(mentionEveryone, usuario);
    await sasha.sendMessage(mentionEveryone, { text: `💰 Você recebeu uma recarga de R$${valorRecarga}. Seu saldo atual é de R$${usuario.saldo.toFixed(2)}.` });
    await reply(`A recarga de R$${valorRecarga} foi realizada com sucesso para o usuário mencionado!`);
break;

case 'transferencia':
    if(!mentionNumber) return await reply('Ei, cadê o @ ou a mensagem marcada? Você precisa indicar o destinatário da transferência!');
     if(isNaN(query) || query <= 0) {
      return await reply('O valor informado é inválido! Por favor, insira um valor válido maior que zero para a transferência.');
    }
    var usuarioOrigem = await getUsuarioById(sender);
    if(!usuarioOrigem) {
      return await reply('Não foi possível encontrar o seu usuário. Tente novamente mais tarde.');
    }
    if(usuarioOrigem.saldo < query) {
      return await reply(`Você não tem saldo suficiente para transferir R$${query}. Seu saldo atual é de R$${usuarioOrigem.saldo.toFixed(2)}.`);
    }
    var usuarioDestinatario = await getUsuarioById(mentionNumber);
    if(!usuarioDestinatario) {
      return await reply('Não foi possível encontrar o destinatário da transferência. Verifique o número ou ID fornecido.');
    }
    usuarioOrigem.saldo -= query;
    usuarioDestinatario.saldo += query;
    await updateUsuario(usuarioOrigem.id, usuarioOrigem);
    await updateUsuario(usuarioDestinatario.id, usuarioDestinatario);
    await sasha.sendMessage(mentionNumber, { text: `Você recebeu uma transferência de R$${query}. Seu novo saldo é de R$${usuarioDestinatario.saldo.toFixed(2)}.` });
    await reply(`A transferência de R$${query} foi realizada com sucesso para o destinatário ${usuarioDestinatario.nome}.`);
  break;

case 'deletarsaldo':
    if(!verifyDono) return await reply(responses.dono())
    if(!mentionEveryone) return await reply('Você esqueceu de mencionar o alvo! Por favor, mencione o usuário de quem o saldo será removido.');
    var valorRemocao = parseFloat(query);
    if(isNaN(valorRemocao) || valorRemocao <= 0) {
      return await reply('O valor informado é inválido! Por favor, insira um valor válido maior que zero para a remoção.');
    }
    var usuario = await getUsuarioById(mentionEveryone);
    if(!usuario) {
      return await reply('Não foi possível encontrar o usuário mencionado. Verifique se o ID está correto ou tente novamente mais tarde.');
    }
    if(usuario.saldo < valorRemocao) {
      return await reply(`O saldo do usuário mencionado é insuficiente para realizar a remoção de R$${valorRemocao}.`);
    }
    usuario.saldo -= valorRemocao;
    await updateUsuario(mentionEveryone, usuario);
    await sasha.sendMessage(mentionEveryone, { text: `💸 O valor de R$${valorRemocao} foi removido do seu saldo. Seu saldo atual é de R$${usuario.saldo.toFixed(2)}.` });
    await reply(`O valor de R$${valorRemocao} foi removido com sucesso do saldo do usuário mencionado!`);
  break;

case 'compra-plano':
    if(!query) return await reply('Por favor, escolha o número do plano que deseja comprar:\n1. Prata - R$3.99\n2. Ouro - R$9.99\n3. Platina - R$24.99\n4. Diamante - R$69.99');
    var planos = {
      0: { dias: 0, nome: 'Supreme', value: 90.99, infinito: true, number: 5 },
      1: { dias: 1, nome: 'Prata', value: 3.99, infinito: false, number: 0 },
      2: { dias: 7, nome: 'Ouro', value: 9.99, infinito: false, number: 1 },
      3: { dias: 30, nome: 'Platina', value: 24.99, infinito: false, number: 2 },
      4: { dias: 365, nome: 'Diamante', value: 69.99, infinito: false, number: 3 },
    };
    var planoEscolhido = planos[parseInt(query)];
    if(!planoEscolhido) {
      return await reply('Número do plano inválido. Escolha entre *0* (Supreme) *1* (Prata), *2* (Ouro), *3* (Platina) ou *4* (Diamante).');
    }
    var { dias, nome, value, infinito, number } = planoEscolhido;
    var usuario = await getUsuarioById(sender);
    if(!usuario) {
      return await reply('Usuário não encontrado. Tente novamente.');
    }
    if(!usuario.saldo || usuario.saldo < value) {
    var saldoFaltante = (value - usuario.saldo).toFixed(2);
       return await sasha.sendMessage(from, { text: `Você não tem saldo suficiente para adquirir o plano *${nome}*. Seu saldo atual é de R$${usuario.saldo.toFixed(2)}. Faltam R$${saldoFaltante} para completar a compra.`, buttons: [{ buttonId: `${prefix}recarga ${saldoFaltante}`, buttonText: { displayText: `Adicionar R$${saldoFaltante} ao saldo` }, type: 1 }], headerType: 4, viewOnce: true }, { quoted: info });
    }
    usuario.saldo -= value;
    if(!usuario.plano) usuario.plano = [];
    var planoExistente = usuario.plano.find(plano => plano.status === true);
    var agora = new Date();
    var expiracao = new Date();
    expiracao.setDate(expiracao.getDate() + dias);    
    if(planoExistente) {
      Object.assign(planoExistente, { tipo: nome, status: true, dataCriacao: agora.toISOString(), dataExpiracao: expiracao.toISOString(), infinito, number });
    } else {
      usuario.plano.push({ tipo: nome, status: true, dataCriacao: agora.toISOString(), dataExpiracao: infinito ? 'Sem data de expiração' : expiracao.toISOString(), infinito, number });
    }
    await updateUsuario(sender, usuario);
    await sasha.sendMessage(sender, { text: `Compra do plano *${nome}* realizada com sucesso! Seu saldo de saldo foi atualizado. Agora você tem R$${usuario.saldo.toFixed(2)} restantes.` });
    if(planoExistente) {
      await sasha.sendMessage(nmrdn, { text: `Aviso: o @${usuario.id.split('@')[0]} renovou o plano *${nome}*.`, mentions: [usuario.id] });
    } else {
      await sasha.sendMessage(nmrdn, { text: `Aviso: o @${usuario.id.split('@')[0]} comprou o plano *${nome}*.`, mentions: [usuario.id] });
 }
break;

case 'aluguel':
if(!verifyDono) return await reply(responses.dono())
    configs.Modos.aluguel.status = !configs.Modos.aluguel.status;
    await saveJson('./configs/configs.json', configs)
    await sasha.sendMessage(from, { text: configs.Modos.aluguel.status ? 'Prontinho amore, modo aluguel ativado, irei proibir uso em grupos não registrados!!!' : 'Prontinho amore, modo aluguel desativado!' }, { quoted: info })
break;

case 'owner': case 'odono': case 'dono': case 'infodono':  
try {
  var photo = await sasha.profilePictureUrl(`${NumberDonoOficial}@c.us`, 'image')
} catch {
  var photo = images['defaultProfile'].value
}
var vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'N:;BIEL;;;\n' + 'FN:BIEL\n' + 'X-WA-BIZ-NAME:BIEL\n' + 'X-WA-BIZ-DESCRIPTION:Atendimento | Sasha Bot\n' + 'ORG:BIEL;\n' + 'TEL;type=CELL;type=VOICE;waid=559885568495:+55 98 98556-8495\n' + 'END:VCARD'
await sasha.sendMessage(from, {contacts: { displayName: NickName, contacts: [{vcard}] }})
    await sasha.sendMessage(from, { image: { url: photo }, caption: getInfo.donoInfo(NickName, sender, NumberDonoOficial, prefix), mentions: [sender]}, { quoted: info });
break

case 'configbot': case 'botconfig': case 'configurarbot':
    await sasha.sendMessage(from, { text: getInfo.configBot(prefix) }, { quoted: info });
break;
 
case 'infobot': case 'botinfo':
  await sasha.sendMessage(from, { text: getInfo.botInfo() }, { quoted: info });
break

case 'infobv': case 'infobemvindo':
  await sasha.sendMessage(from, { text: getInfo.infoBemVindo(prefix) }, { quoted: info });
break

case 'novidades':
    const ultimaAtualizacao = '18/09/2025 20:30';

    await sasha.sendMessage(from, { text: `
🔄 *Sasha Bot — Atualização de Comandos*

📅 *Última Atualização:* ${ultimaAtualizacao}

⚙️ *Reajustados:*
*\`hd\`* ⤷ Melhorias no download de vídeos em alta qualidade
*\`hdv1\`* ⤷ Correções em vídeos HD versão 1
*\`play\`* ⤷ Ajustes no comando de tocar música
*\`play vídeo\`* ⤷ Melhor compatibilidade com links de vídeo
*\`ytmp4\`* ⤷ Correções no download de vídeos do YouTube
*\`Instagram\`* ⤷ Ajustes no download de posts e stories
*\`Spotify\`* ⤷ Melhorias no envio de músicas do Spotify
*\`Spotifymp3\`* ⤷ Correção de extração de MP3
*\`threads\`* ⤷ Atualização no download de posts do Threads
*\`igstalker\`* ⤷ Busca informações do primeiro usuário do Instagram e mostra foto de perfil, nome, privacidade, verificação e último Reel
*️⃣ Sistema de similaridade* ⤷ Removido (agora o comando só executa o que você digita)

✨ *Novos:*
*\`repair\`* ⤷ Reparação de imagens danificadas ou corrompidas
*\`restaurar\`* ⤷ Restauração de imagens antigas ou apagadas
*\`instav2\`* ⤷ Baixar imagens e vídeos do Instagram
*\`tiktokv2\`* ⤷ Download de vídeos e músicas do TikTok
*\`transcrever\`* ⤷ Transcrição de áudios e vídeos

💡 Esta atualização foi focada em desempenho e otimização do bot

❌ *Removidos:*
*\`tocartoon\`*
*\`Screenshot\`*
*\`genshinbuild\`*
*\`toanime\`*
*\`imaginev2\`*
*\`imaginev3\`*
*\`Robloxstalker\`*
*\`Igreels\`*
*\`genshinstalker\`*
` }, { quoted: info });
break;

/* ------------- [ Cases de Administradores ] ------------- */

case 'add': case 'unkick': 
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!query && !info.message?.extendedTextMessage) return await reply('Mencione a mensagem do(a) usuário(a) caso ele(a) já tenha passado por aqui ou digite o número que deseja adicionar como administrador(a)!');
    try {
        var useradd = query.replace(/\D/g, '') || info.message.extendedTextMessage?.contextInfo?.participant;
        var id = useradd.replace(/\D/g, '');
        if(!id) return await reply('Número inválido. Tem certeza que digitou corretamente?');
        var [result] = await sasha.onWhatsApp(id);
        if(!result) return await reply('O número informado não está no WhatsApp ou foi digitado incorretamente. Dá uma conferida!');
        var response = await sasha.groupParticipantsUpdate(from, [result.jid], 'add');
        const statusMessages = {
            409: `Eita, @${result.jid.split('@')[0]} já está no barzinho! Tem certeza que era esse número mesmo?`,
            403: `Não consegui adicionar @${result.jid.split('@')[0]} porque ele(a) restringe quem pode adicioná-lo(a) em grupos.`,
            408: `@${result.jid.split('@')[0]} saiu ou foi removido recentemente do grupo, então não consegui adicionar.`,
            401: `Não consegui adicionar @${result.jid.split('@')[0]} porque ele(a) me bloqueou. Triste, né?`,
            200: `@${result.jid.split('@')[0]} foi adicionado(a) com sucesso! Sempre às ordens, excelência!`
        };
        await sasha.sendMessage(from, { text: statusMessages[response[0]?.status] || `Tivemos um probleminha ao tentar adicionar @${result.jid.split('@')[0]}. Tente novamente mais tarde.`, mentions: [result.jid, sender] }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'addautorm': case 'addautoban': case 'listanegra':
    if(!verifyGrupo) return await reply(responses.grupo());
     var premiums = getPremiuns.todosPremiums();
    if(!membersSupreme) return await reply('Oi, para isso você precisa ser o Dono ou Administrador. Vamos lá, se empenha!');
    if(!mentionNumber) return await reply('Ei, cadê o número ou a mensagem marcada? Você precisa indicar quem vai para a lista negra!');
    if(botNumber.includes(mentionNumber)) {
    return await reply('Ei, você realmente está tentando me sabotar? Eu sou seu assistente fiel!\nInfelizmente, não posso ser banida, mas podemos conversar sobre isso se quiser.');
    }
    if(JSON.stringify(nmrdn).includes(mentionNumber)) {
    return await reply('Ah, esse é o criador do bot, o *Biel*, com todas as permissões possíveis.\nNinguém pode aplicar shadow ban nele.');
    }
    if(JSON.stringify(donos).includes(mentionNumber) && !verifyDono) {
    return await reply('Esse é um dos sub donos do sistema, com permissões especiais.\nSomente o *donos* pode aplicar o shadow ban nesse caso.');
    }
    if(JSON.stringify(premiums).includes(mentionNumber) && !verifyDono) {
    return await reply('Essa pessoa é uma das estrelas premium do nosso sistema!\nSomente o *donos* pode aplicar um shadow ban nesse caso.');
    }
    if(dataGp.listanegra.users.includes(mentionNumber)) return await reply('Já tenho esse número na lista negra, não vamos duplicar! 😅');
    dataGp.listanegra.users.push(mentionNumber);
    await salvarConfigGrupo(dataGp);
    await reply(`Número adicionado à lista de autoban com sucesso! Vamos garantir a paz no grupo! `);
 break;

case 'delremover': case 'delautorm': case 'delautoban': case 'tirardalista':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    if(!mentionNumber) return await reply('Ei, você esqueceu de marcar a mensagem ou colocar o número! Vamos lá, sem preguiça.');
    if(!dataGp.listanegra.users.includes(mentionNumber)) return await reply('Hmm, esse número não está na lista negra, já tentou conferir os detalhes? 🤔');
    var index = dataGp.listanegra.users.indexOf(mentionNumber);
    dataGp.listanegra.users.splice(index, 1);
    await salvarConfigGrupo(dataGp);
    await reply(`Tcharam! O número foi removido da lista de autoban com sucesso! 🎉 Sem mais problemas por aqui!`);
break;

case 'listban':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(dataGp.listanegra.users.length < 1) return await reply('Não há ninguém na lista negra por enquanto! Pode ficar tranquilo(a).');    
    var usersList = dataGp.listanegra.users.map((user, index) => `#${index + 1} ⤷ *${user.split('@')[0]}*`).join('\n—\n');
    await reply(`*Esses são os corajosos que estão na lista de banimento (e eu vou pegar eles! 😤):*\n${usersList}\nEsses aí estão na lista de espera para o banimento! Cuidado, hein! 🥵`);
break;

case 'addmute': case 'addmutebanned': case 'mutar': case 'mute':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply('Oi, para isso você precisa ser o Dono ou Administrador. Vamos lá, se empenha!');
    if(!mentionNumber) return await reply('Ei, cadê o número ou a mensagem marcada? Você precisa indicar quem vai ser silenciado!');
      var premiums = getPremiuns.todosPremiums();
    if(botNumber.includes(mentionNumber)) {
    return await reply('Ei, você realmente está tentando me mutar? Eu sou seu assistente fiel!\nInfelizmente, não posso ser silenciado, mas podemos conversar sobre isso se quiser.');
    }
    if(JSON.stringify(groupAdmins).includes(mentionNumber) && !verifyDono) {
    return await reply('Essa pessoa é um dos administradores do grupo!\nAdministradores têm permissões especiais e não pode ser mutados.');
    }
    if(JSON.stringify(nmrdn).includes(mentionNumber)) {
    return await reply('Ah, esse é o criador do bot, o *Biel*, com todas as permissões possíveis.\nNinguém pode aplicar mute nele.');
    }
    if(JSON.stringify(donos).includes(mentionNumber) && !verifyDono) {
    return await reply('Esse é um dos sub donos do sistema, com permissões especiais.\nSomente o *donos* pode aplicar o mute nesse caso.');
    }
    if(JSON.stringify(premiums).includes(mentionNumber) && !verifyDono) {
    return await reply('Essa pessoa é uma das estrelas premium do nosso sistema!\nSomente o *donos* pode aplicar um mute nesse caso.');
    }
    if(dataGp.muteList && dataGp.muteList.users.includes(mentionNumber)) {
        return await reply('Já tenho esse número na lista de silêncio, não vamos duplicar! 😅');
    }
    dataGp.muteList.users.push(mentionNumber);
    await salvarConfigGrupo(dataGp);
    await reply(`Número adicionado à lista de silêncio com sucesso! Agora, todo mundo pode respirar tranquilo!`);
break;

case 'delmute': case 'delmutebanned':  case 'removermute':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    if(!mentionNumber) return await reply('Ei, você esqueceu de marcar a mensagem ou colocar o número! Vamos lá, sem preguiça.');
    if(!dataGp.muteList || !dataGp.muteList.users.includes(mentionNumber)) {
        return await reply('Hmm, esse número não está na lista de silêncio, já tentou conferir os detalhes? 🤔');
    }
    var index = dataGp.muteList.users.indexOf(mentionNumber);
    dataGp.muteList.users.splice(index, 1);
    await salvarConfigGrupo(dataGp);
    await reply(`Tcharam! O número foi removido da lista de silêncio com sucesso! Pode falar à vontade!`);break;

case 'listmute': case 'listamutados':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!dataGp.muteList || dataGp.muteList.users.length < 1) {
        return await reply('Não há ninguém na lista de silêncio por enquanto! Pode ficar tranquilo(a).');
    }
    var usersList = dataGp.muteList.users.map((user, index) => `#${index + 1} ⤷ *@${user.split('@')[0]}*`).join('\n—\n');
    await mention(`*Esses são os corajosos que estão na lista de silêncio (não podem falar por enquanto! 😤):*\n${usersList}\nEsses aí estão esperando para poder falar novamente. Cuidado para não ser o próximo! 🥵`);
break;

case 'roletarussa': 
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    const partesDoCorpo = [
        'na perna', 'na cabeça', 'no pescoço', 'no peito',
        'no olho', 'no estômago', 'na boca', 'na testa',
        'no braço', 'na costela'
    ];
    if(groupMembers.length === 0) return reply('Infelizmente não temos nenhum alvo... só tem os manda-chuvas (admins) no grupo.');
    var alvo = groupMembers[Math.floor(Math.random() * groupMembers.length)].id;
    var imunes = [sender, botNumber, nmrdn];
    if(imunes.includes(alvo)) return mention(`Tentei puxar o gatilho pra *@${alvo.split('@')[0]}*, mas o destino deu uma chance... escapou por um triz!`);
    await reply('Atenção, senhores... a roleta está girando. Um de vocês será escolhido pelo destino. Que comecem os jogos...');
        const parte = partesDoCorpo[Math.floor(Math.random() * partesDoCorpo.length)];
        await mention(`*BANG!* O silêncio foi quebrado... e *@${alvo.split('@')[0]}* caiu com um tiro ${parte}. Que tragédia! Alguém chama o IML...`,);
        await sleep(6000);
        await sasha.groupParticipantsUpdate(from, [alvo], 'remove');
break;

case 'membro': 
    if(!membersSupreme) return reply(responses.admin());
    if(!BotSupreme) return reply(responses.botAdmin());
    const acao = query.toLowerCase();
    const operacoes = {
        aceitar: 'approve',
        recusar: 'reject'
    };
    if(!operacoes[acao]) {
        return await reply(`Comando inválido.\n\nUse o comando corretamente da seguinte forma:\n⤷ ${prefix}membro aceitar — Aprova todos os membros que estão aguardando entrada no grupo.\n⤷ ${prefix}membro recusar — Recusa todos os membros pendentes.\n\nCertifique-se de que o bot seja admin e tenha permissões para gerenciar solicitações.`);
    }
        const pendentes = await sasha.groupRequestParticipantsList(from);
        if(!pendentes.length) {
            return await reply(`Atualmente não há nenhum membro pendente de aprovação no grupo.\nTodos os pedidos já foram tratados ou não existem solicitações no momento.`);
        }
        const numeros = pendentes.map(({ jid }) => jid);
        await sasha.groupRequestParticipantsUpdate(from, numeros, operacoes[acao]);
        const textoAcao = acao === 'aceitar' ? 'aprovado(s)' : 'recusado(s)';
        await reply(`⤷ Sucesso!\nTotal de membros ${textoAcao}: *${numeros.length}*\n—\nTodos os usuários pendentes foram ${textoAcao} com sucesso.\nSe necessário, use novamente este comando para tratar novas solicitações futuras.`);
break;

case 'ban': case 'bang': case 'banir': case 'kick': case 'avadakedavra':
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());

    try {
        const premiums = getPremiuns.todosPremiums();
        if(!mentionTwo || mentionJidTwo[1]) {
            return await reply('Ei! Pra eu fazer o banimento direitinho, você precisa marcar *só uma pessoa*.\nUse @, responda a mensagem dela ou mande o número com DDD. Simples, né?');
        }
        if(!JSON.stringify(groupMembers).includes(mentionTwo)) {
            return await reply('Hmm... essa pessoa nem tá no grupo! Acho que já saiu há um tempinho, viu?');
        }
        if(botNumber.includes(mentionTwo)) {
            return await reply('Você tá tentando me banir? Logo eu, seu bot fiel de todos os dias?\nNão posso me remover, mas se quiser conversar sobre nossa relação, tô aqui.');
        }
        if(JSON.stringify(nmrdn).includes(mentionTwo)) {            
            return await sasha.groupParticipantsUpdate(from, [sender], 'remove');
        }
        if(JSON.stringify(donos).includes(mentionTwo) && !verifyDono) {
            return await reply('Esse aí é um dos donos do sistema, com acesso VIP e tudo mais.\nSomente o *dono supremo* pode tomar esse tipo de decisão.');
        }
        if(JSON.stringify(premiums).includes(mentionTwo) && !verifyDono) {
            return await reply('Essa pessoa é um dos nossos queridos usuários premium!\nInfelizmente, só o dono do sistema pode aplicar o banimento nesse caso.');
        }
        await sasha.sendMessage(from, { text: `Gente... chegou o momento.\n\n@${mentionTwo.split('@')[0]} foi gentilmente conduzido(a) até a porta de saída.\nDesejamos paz, memes leves e talvez um reencontro no futuro (ou não).`, mentions: [mentionTwo] });
        await sasha.groupParticipantsUpdate(from, [mentionTwo], 'remove');
        const banDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        await sasha.sendMessage(mentionTwo, { text: `Oi, @${mentionTwo.split('@')[0]}! Infelizmente, você foi removido(a) do grupo ⤷ ${groupName}\nPwode ter sido uma decisão difícil, ou só um daqueles dias malucos mesmo.\n\n*Data e hora do ban:* ${banDate}\n*Quem te removeu:* @${sender.split('@')[0]}\n—\nSe quiser conversar, entender o motivo ou pedir uma chance de volta, fale com o admin responsável.`, mentions: [mentionTwo, sender] });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'promover': 
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque apenas um usuário para promover.');
    if(!JSON.stringify(groupMembers).includes(mentionTwo)) return await reply('Este usuário não está mais no grupo, então não pode ser promovido.');
    if(JSON.stringify(groupAdmins).includes(mentionTwo)) return await reply('Esse membro já é admin, não tem como promovê-lo novamente.');
    await sasha.groupParticipantsUpdate(from, [mentionTwo], 'promote');
    await sasha.sendMessage(from, { text: `Novo Administrador(a)! @${mentionTwo.split('@')[0]} agora é um administrador do grupo. Use seus poderes com responsabilidade.`, mentions: [mentionTwo] }, { quoted: info });
break;

case 'rebaixar': 
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    if(!mentionTwo || mentionJidTwo[1]) return await reply('⚠️ Por favor, marque APENAS um usuário para rebaixar!');
    if(!JSON.stringify(groupMembers).includes(mentionTwo)) return await reply('Este usuário não está mais no grupo, portanto, não pode ser rebaixado.');
    if(JSON.stringify(getMembers).includes(mentionTwo)) return await reply('Esse(a) membro nem é admin, não tem como rebaixar quem já não está na área VIP.');
    await sasha.groupParticipantsUpdate(from, [mentionTwo], 'demote');
    await sasha.sendMessage(from, { text: `*Rebaixamento realizado!* @${mentionTwo.split('@')[0]}, você voltou a ser um membro comum. Agora, aproveite o grupo sem responsabilidades! 😆`, mentions: [mentionTwo] }, { quoted: info });
break;

case 'sorteio':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    try {
        if(!query.trim()) return await reply(`Para realizar um sorteio, use: *${prefix}sorteio [prêmio]*\nExemplo: *${prefix}sorteio 100 R$* 💰`);
        var sorteado = groupMembers[Math.floor(Math.random() * groupMembers.length)].id;
        await mention(`*Sorteio!*\nPrêmio ⤷ *${query.trim()}*\nParabéns ao grande vencedor ⤷ @${sorteado.split('@')[0]}\nTodos aplaudam o sortudo(a)!`);
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'rankinativo':
case 'rankinativos': 
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    var groupData = await collections.rankMessages.findOne({ _id: from });
    if(!groupData || !Array.isArray(groupData.users)) {
        return await reply('Erro: dados de usuários não encontrados ou estão corrompidos.');
    }
    var sortedUsers = [...groupData.users].sort(
        (a, b) => (a.messages + a.commands) - (b.messages + b.commands)
    );
    var mensagemRank = '*Ranking dos mais fantasmas do grupo*:\n\n';
    if(sortedUsers.length === 0) {
        mensagemRank += 'Parabéns, ninguém está inativo!\nParece que este grupo é bem movimentado.';
        return await reply(mensagemRank);
    }
    var topInativos = sortedUsers.slice(0, 5);
    var mencionados = [];
    topInativos.forEach((usuario, index) => {
        mensagemRank += `*${index + 1}º* ⤷ *@${usuario.id.split('@')[0]}*\n⤷ Mensagens: *${usuario.messages}*\n⤷ Comandos usados: *${usuario.commands}*\n⤷ Aparelho: *${usuario.device}*\n\n`;
        mencionados.push(usuario.id);
    });
    mention(mensagemRank, mencionados);
break;

case 'advertir': case 'adverter': {
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(JSON.stringify(botNumber).includes(mentionTwo)) return await reply('Ei, você não pode advertir o próprio bot! Eu sou só um ajudante, vai pegar leve comigo. 😅');
    if(JSON.stringify(nmrdn).includes(mentionTwo)) return await reply('Sem chance! Você não pode advertir o dono do bot. Ele manda aqui!');
    if(JSON.stringify(groupAdmins).includes(mentionTwo)) return await reply('Advertência negada! Administradores estão imunes a advertências.');
    if(!JSON.stringify(groupMembers).includes(mentionTwo)) return await reply('Opa, esse usuário nem está mais no grupo! Como vou advertir alguém que já foi embora?');
    advertir.push(mentionTwo);
    await salvarConfigGrupo(dataGp)
        var advertCount = advertir.filter(x => x == mentionTwo).length;
        if(advertCount < 3) {
            await sleep(1500);
            await mention(`Ei @${mentionTwo.split('@')[0]}, você recebeu uma advertência! Agora está com ${advertCount}/3. Cuidado! Se chegar a 3, será removido...`);
        } else {
            await sleep(1500);
            await mention(`Poxa, @${mentionTwo.split('@')[0]}, você acumulou 3 advertências! Infelizmente, terá que sair do grupo... Converse com os admins se quiser entender o motivo.`);
            await sleep(1500);
            await sasha.groupParticipantsUpdate(from, [mentionTwo], 'remove');
            var indexAdv = advertir.indexOf(mentionTwo);
            advertir.splice(indexAdv, 3);
            await salvarConfigGrupo(dataGp);
        }
  }
break;

case 'rmadv':
  if(!verifyGrupo) return await reply(responses.grupo());
  if(!membersSupreme) return await reply(responses.admin());
  if(!mentionEveryone) return await reply('Você esqueceu de mencionar o alvo após o comando.');
  var userIndex = advertir.findIndex(i => i === mentionEveryone);
  if(userIndex === -1) return await reply('Este usuário não contém nenhuma advertência no grupo.');
  advertir.splice(userIndex, 1);
  await salvarConfigGrupo(dataGp);
  await reply('A advertência do usuário neste grupo foi retirada com sucesso!');
break;

case 'grupo': 
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    if(query.length < 1) return await reply(`Opa, senhor(a)! Parece que você está usando o comando de forma errada. \n\nPara mais detalhes, digite: _${prefix}grupo -help_`);
    var groupInfo = await sasha.groupMetadata(from);
    if(query === '-help') return await mention(`Olá, administrador(a) *@${sender.split('@')[0]}*! Tudo bem?\n\nAqui está um guia rápido sobre o comando *'grupo'*:\n\n *Abrindo e fechando o grupo:*\n-_${prefix}grupo -open_ ⤷ Permite que todos enviem mensagens.\n _${prefix}grupo -close_ ⤷ Somente administradores podem enviar mensagens.\n\n *Controle de permissões:*\n _${prefix}grupo -livre_ ⤷ Todos podem editar as configurações do grupo.\n _${prefix}grupo -private_ ⤷ Somente administradores podem editar as configurações.\n\nAgora que você sabe como funciona, mãos à obra! `);
    if(query === '-open' || query === 'a') {
        if(groupInfo.announce === false) return await reply('Senhor(a), o grupo já está aberto! Não posso abrir o que já está aberto, né? 😅');
        await reply('Prontinho! O grupo agora está aberto para todos interagirem livremente. Mandem ver!');
        await sasha.groupSettingUpdate(from, 'not_announcement');
    } else if(query === '-close' || query === 'f') {
        if(groupInfo.announce === true) return await reply('O grupo já está fechado! Não tem como trancar duas vezes, né?');
        await reply('Como solicitado, o grupo agora está fechado! Só os administradores podem falar.');
        await sasha.groupSettingUpdate(from, 'announcement');
    } else if(query === '-livre') {
        if(groupInfo.restrict === false) return await reply('🔓 O grupo já está livre para todos editarem as informações! Nada mudou. 😎');
        await reply('Pronto! Agora, qualquer membro pode editar as configurações do grupo. Cuidado com bagunça!');
        await sasha.groupSettingUpdate(from, 'unlocked');
    } else if(query === '-private') {
        if(groupInfo.restrict === true) return await reply('Senhor(a), o grupo já está no modo privado! Só os admins podem editar as configurações.');
        await reply('Agora, somente administradores podem alterar as configurações do grupo. Mantenham tudo em ordem!');
        await sasha.groupSettingUpdate(from, 'locked');
    } else {
        await reply(`Senhor(a), acho que houve um engano... \n\nPara mais detalhes sobre o uso correto, digite: _${prefix}grupo --help_`);
    }
break;

case 'grupoinfo': case 'infogrupo': case 'infogp': case 'gpinfo': case 'regras':  
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    try {
        var profilePictureUrl = await sasha.profilePictureUrl(from, 'image');
    } catch {
        var profilePictureUrl = images['defaultProfile'].value; 
    }
    const groupMetadata = await sasha.groupMetadata(from);
    const verifyGrupoAnnounced = groupMetadata.announce;
    const groupAnnounceStatus = verifyGrupoAnnounced === false ? 'Não.' : verifyGrupoAnnounced === true ? 'Sim.' : 'Indefinido';
    const verifyGrupoRestricted = groupMetadata.restrict;
    const groupRestrictStatus = verifyGrupoRestricted === false ? 'Sim.' : verifyGrupoRestricted === true ? 'Não.' : 'Indefinido';
    const groupCreator = groupMetadata.subjectOwner || 'Não Encontrado';
    await sasha.sendMessage(from, { image: { url: profilePictureUrl }, caption: `Nome do Grupo: *${groupMetadata.subject}*\nID: *${groupMetadata.id}*\n-\nEste grupo foi criado por: *@${groupCreator.replace('@s.whatsapp.net', '')}*\nData/hora de criação do grupo: *${moment(`${groupMetadata.creation}` * 1000).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss')}*\nHorário e data da última alteração no grupo: *${moment(`${groupMetadata.subjectTime}` * 1000).format('DD/MM/YYYY HH:mm:ss')}*\n-\nQuantidade de administradores: *${groupAdmins.length}*\nQuantidade de membros: *${getMembers.length}*\nSoma total de membros e admins do grupo: *${groupMetadata.participants.length} participantes*\n-\nEste grupo está fechado no momento? *${groupAnnounceStatus}*\nAs informações do grupo podem ser alteradas por membros? *${groupRestrictStatus}*\n-\nPara ver as atividades dos participantes, use: *${prefix}atividade*\nPara ver os membros inativos no grupo, use: *${prefix}inativos [quantidade de mensagens]*, ex: *${prefix}inativos 10*`, mentions: [groupCreator] }, { quoted: info });
 break;
 
case 'totag': case 'cita': case 'hidetag': {
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(query) {
        const groupMembersIds = groupMembers
  .filter(member => !donos.includes(member.id))
  .map(member => member.id);
        const textMessage = {
            text: `${query ? `Marcação do Adm: ${NickName}\n—\n⤷ ${query.trim()}` : `Marcação do Adm: ${NickName}`}`,
            mentions: groupMembersIds
        };
        return await sasha.sendMessage(from, textMessage);
    }
    const quotedMessage = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
   if(!quotedMessage) return;
    const groupMembersIds = groupMembers
  .filter(member => !donos.includes(member.id))
  .map(member => member.id);
    const getCaption = (message) => query.length > 1 ? `Marcação do Adm: ${NickName}\n—\n⤷ ${query.trim()}` : message.caption.replace(new RegExp(prefix + command, 'gi'), `Marcação do Adm: ${NickName}\n—\n`);
    const getMessage = (message, type) => {
        if(message) {
            message.mentions = groupMembersIds;
            message[type] = { url: message.url };
            return message;
        }
        return null;
    };
    if(quotedMessage.imageMessage) {
        const imageMessage = getMessage(quotedMessage.imageMessage, 'image');
        if(imageMessage) imageMessage.caption = getCaption(imageMessage);
        return await sasha.sendMessage(from, imageMessage);
    }
    if(quotedMessage.videoMessage) {
        const videoMessage = getMessage(quotedMessage.videoMessage, 'video');
        if(videoMessage) videoMessage.caption = getCaption(videoMessage).trim();
        return await sasha.sendMessage(from, videoMessage);
    }
    if(quotedMessage.documentMessage) {
        const documentMessage = getMessage(quotedMessage.documentMessage, 'document');
        if(documentMessage) documentMessage.caption = getCaption(documentMessage);
        return await sasha.sendMessage(from, documentMessage);
    }
    if(quotedMessage.documentWithCaptionMessage) {
        const docWithCaptionMessage = getMessage(quotedMessage.documentWithCaptionMessage?.message?.documentMessage, 'document');
        if(docWithCaptionMessage) docWithCaptionMessage.caption = getCaption(docWithCaptionMessage);
        return await sasha.sendMessage(from, docWithCaptionMessage);
    }
    if(quotedMessage.audioMessage) {
        const audioMessage = quotedMessage.audioMessage;
        if(audioMessage) {
            audioMessage.audio = { url: audioMessage.url };
            audioMessage.ptt = true;
            audioMessage.mentions = groupMembersIds;
            return await sasha.sendMessage(from, audioMessage);
        }
    }
    if(quotedMessage.stickerMessage) {
        const stickerMessage = quotedMessage.stickerMessage;
        if(stickerMessage) {
            stickerMessage.sticker = { url: stickerMessage.url };
            stickerMessage.mentions = groupMembersIds;
            return await sasha.sendMessage(from, stickerMessage);
        }
    }
    if(quotedMessage.conversation) {
        const textMessage = {
            text: quotedMessage.conversation.replaceAll(new RegExp(prefix + command, 'gi'), `Marcação do Adm ⤷ ${NickName}\n\n`).trim(),
            mentions: groupMembersIds
        };
        return await sasha.sendMessage(from, textMessage);
    }
    if(quotedMessage.extendedTextMessage?.text) {
        const textMessage = {
            text: quotedMessage.extendedTextMessage.text.replace(new RegExp(prefix + command, 'gi'), `Marcação do Adm ⤷ ${sender.split('@')[0]}\n\n`).trim(),
            mentions: groupMembersIds
        };
        return await sasha.sendMessage(from, textMessage);
    }
break;
}

case 'marcar':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    async function sendGroupMembers() {
        var memberList = [];
        var messageText = `Membros do Grupo: ${groupName} ${!query ? '' : `\n\n⤷ Mensagem: ${query.trim()}`}\n\n`;

        for (const member of getMembers) {
            messageText += `⤷〔 *@${member.split('@')[0]}* 〕\n\n`;
            memberList.push(member);
        }
        const membersJson = JSON.stringify(getMembers);
        if(membersJson.length === 2) return await reply(`Olá Adm ⤷ Não há membros comuns no grupo ⤷ ${groupName}, apenas ⤷ [ Administradores ]`);
        await mention(messageText);
    }
    try {
        await sendGroupMembers();
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'marcarwa':
    try {
        if(!verifyGrupo) return await reply(responses.grupo());
        if(!membersSupreme) return await reply(responses.admin());
        if(query.includes(prefix)) return await reply('Não pode utilizar comandos dentro deste comando.');
        var messageText = (string.length > 1) ? query.trim() : '';
        const membersId = [];      
        for (const member of groupMembers) {
            messageText += `⤷〔 https://wa.me/${member.id.split('@')[0]} 〕\n`;
            membersId.push(member.id);
        }
        await sasha.sendMessage(from, { text: messageText }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'nomegp':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    const newGroupName = string.join(' ');
    await sasha.groupUpdateSubject(from, `${newGroupName}`);
    await sasha.sendMessage(from, { text: 'Nome do grupo alterado com sucesso! 😊🎉' }, { quoted: info });
break;

case 'setdescgp':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.admin());
    const newDescription = string.join(' ');
    await sasha.groupUpdateDescription(from, `${newDescription}`);
    await sasha.sendMessage(from, { text: 'Descrição do grupo alterada com sucesso!' }, { quoted: info });
break;

case 'setfotogp': case 'fotogp':  
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!BotSupreme) return await reply(responses.botAdmin());
    if(!QuotedMessage.Picture) return await reply(`Para mudar a foto do grupo, por favor, marque uma imagem e tente novamente! 😊`);
    var quotedImage = QuotedMessage.Picture ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage;
    var randomFileName = getRandom(`.${await getExtension(quotedImage.mimetype)}`);
    var imageBuffer = await getFileBuffer(quotedImage, 'image');
    var resultado = await uploader.catbox(imageBuffer);
    await sasha.updateProfilePicture(from, { url: resultado });
    await reply('A foto do grupo foi alterada com muito carinho! 😄💖');
 break;

case 'linkgp': case 'linkgroup':
  if(!membersSupreme) return await reply(responses.admin());
  if(!verifyGrupo) return await reply(responses.grupo());
  if(!BotSupreme) return await reply(responses.botAdmin());
  try {
    var linkgc = await sasha.groupInviteCode(from);
    return await reply(`Aqui está o link para o grupo: https://chat.whatsapp.com/${linkgc}`);
  } catch (error) {
     if(typeof logBug === 'function') logBug(error.message, command);
}
break;

case 'novolink': case 'resertlink':
  if(!membersSupreme) return await reply(responses.admin());
  if(!verifyGrupo) return await reply(responses.grupo());
  if(!BotSupreme) return await reply(responses.botAdmin());
  try {
    await sasha.groupRevokeInvite(from)
    var linkgc = await sasha.groupInviteCode(from);
    return await reply(`Aqui está o novo URL para o grupo: https://chat.whatsapp.com/${linkgc}`);
  } catch (error) {
     if(typeof logBug === 'function') logBug(error.message, command);
}
break;

case 'moedas': case 'moeda':
  try {
    var data = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/Moedas_Agora?apikey=Learsi_Gamer`);
    await reply(`Aqui estão as últimas informações das moedas:\n\n💵 ${data?.dolar}\n\n💶 ${data?.euro}\n\n💷 ${data?.libra}\n\n₿ ${data?.bitcoin}\n\nΞ ${data?.ethereum}\n\n📈 ${data?.bovespa}\n\n💰 ${data?.ouro}`);
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'ipaSearch':
if(!query) return await reply('Adicione o título da pesquisa que você deseja.');
var data = await fetchJson(`${WebSite}/pesquisa/ipa?apikey=${ApiKeySasha}&query=${query}`);
   await reply(responses.waitSearch(query));
try { 
  await sasha.sendMessage(from, { image: { url: data.resultado[0].imagem }, caption: `⤷ Título: *${data.resultado[0].titulo || 'Sem Informações'}*\n⤷ Versão e Tamanho: *${data.resultado[0].info.replace(' |', '') || 'Sem Informações'}*\n⤷ Downloads: *${formatNumber(data.resultado[0].downloads) || 'Sem Informações'}*\n—\n> *Detalhes do IPA:*\n⤷ Última atualização: *${await traduzir(data.resultado[0].detalhes.atualizadoEm) || 'Sem Informações'}*\n⤷ Gênero: *${await traduzir(data.resultado[0].detalhes.genero) || 'Sem Informações'}*\n⤷ Desenvolvedor: *${data.resultado[0].detalhes.desenvolvedor || 'Sem Informações'}*\n⤷ Url na App Store: *${data.resultado[0].detalhes.appStore || 'Sem Informações'}*\n—\n*Caso não baixou clique nesse Url:* ${data.resultado[0].detalhes.arquivo.link}` }, { quoted: info });
  await sasha.sendMessage(from, { document: { url: data.resultado[0].detalhes.arquivo.link }, caption: `⤷ Sucesso! O arquivo *'${data.resultado[0].titulo}'* foi baixado com sucesso!\n\n⤷ Tipo de arquivo: *Ipa/App*\n⤷ Tamanho: *${data.resultado[0].detalhes.arquivo.tamanho}*`, mimetype: 'application/octet-stream', fileName: data.resultado[0].detalhes.arquivo.nome });
  } catch (error) {
   if(typeof logBug === 'function') logBug(error.message, command);
 }
break

case 'playstore':
    if(!query) return await reply('Ops, você se esqueceu de digitar o nome do aplicativo que deseja pesquisar. Tente novamente.');
    try {
        var resultado = await fetchJson(`${WebSite}/pesquisa/playstore?apikey=${ApiKeySasha}&query=${query.trim()}`);
         if(resultado.resultado.length == 0) return await reply('Desculpe, não encontrei nenhum aplicativo com esse nome. Que tal tentar uma nova busca ou verificar a ortografia?');
         await reply(responses.waitSearch(query));
        var data = 'Aqui estão alguns aplicativos encontrados na PlayStore para sua pesquisa:\n–\n';
        data += resultado.resultado.map((v, index) => 
            `*${index + 1}.* Nome ⤷ *${v.nome}*\nDesenvolvedor ⤷ *${v.desenvolvedor}*\nAvaliação ⤷ *${v.estrelas} Estrelas*\nLink ⤷ *${v.link}*`
        ).join('\n–\n');
        await sasha.sendMessage(from, { text: data, contextInfo: { externalAdReply: { title: resultado.resultado[0].nome, body: `⤷ Avaliação ⤷ ${resultado.resultado[0].estrelas} - Desenvolvedor ⤷ ${resultado.resultado[0].desenvolvedor}`, thumbnail: await getBuffer(resultado.resultado[0].imagem), mediaType: 2, sourceUrl: resultado.resultado[0].link }}});
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;
  
case 'mediafire':
    if(!query) return await reply('Você esqueceu de colocar o URL após o comando. *O que deseja baixar?*');
    if(!query.includes('mediafire.com')) return await reply('Parece que o URL fornecido não é válido para o MediaFire. Por favor, insira um URL correto que começa com "mediafire.com" e evite usar encurtadores de links como bit.ly ou cutt.ly.');
    try {
        await reply(responses.wait());
        var data = await fetchJson(`${WebSite}/download/mediafire?url=${query.trim()}&apikey=${ApiKeySasha}`);
        await sasha.sendMessage(from, { document: { url: data.resultado.dl_link }, caption: `⤷ Sucesso! O arquivo *'${data.resultado.fileName}'* foi baixado com sucesso!\n\n⤷ Tipo de arquivo: *${data.resultado.mimetype}*\n⤷ Tamanho: *${data.resultado.size}*`, mimetype: data.resultado.mimetype, fileName: data.resultado.fileNameb}, {quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'gdrive':
    if(!query) return await reply('Você esqueceu de colocar o URL após o comando. *O que deseja baixar?*');
    if(!query.includes('drive.google.com')) return await reply('Parece que o URL fornecido não é válido para o Google Drive. Por favor, insira um URL correto que começa com "drive.google.com" e evite usar encurtadores de links como bit.ly ou cutt.ly.');
    try {
        await reply(responses.wait());
        var data = await fetchJson(`${WebSite}/download/google-drive?apikey=${ApiKeySasha}&url=${query.trim()}`);
        await sasha.sendMessage(from, { document: { url: data.resultado.downloadUrl }, caption: `⤷ Sucesso! O arquivo *'${data.resultado.fileName}'* foi baixado com sucesso!\n\n⤷ Tipo de arquivo: *${data.resultado.mimetype}*\nSasha Download!`, mimetype: data.resultado.mimetype, fileName: data.resultado.fileNameb}, {quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'cep':
try {
    if(!query.trim()) return await reply('Por favor, digite o CEP que deseja buscar as informações.')
    var data = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/consultacep?cep=${query.trim()}&apikey=Learsi_Gamer`)
    await reply(`Aqui estão as informações para o CEP ${data.cep || 'Sem Informações!'}:\n*Rua:* ${data.rua || 'Sem Informações!'}\n*Complemento:* ${data.complemento || 'Sem Informações!'}\n*Bairro:* ${data.vizinhança || 'Sem Informações!'}\n*Cidade:* ${data.cidade || 'Sem Informações!'}\n*Estado:* ${data.estado}\n*Gia:* ${data.gia || 'Sem Informações!'}\n*Ibge:* ${data.ibge || 'Sem Informações!'}\n*DDD:* ${data.ddd || 'Sem Informações!'}\n*Siafi:* ${data.siafi || 'Sem Informações!'}`)
} catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
break

case 'ddd':
if(!query) return await reply('Qual DDD você deseja pesquisar? por exemplo o DDD do Maranhão: 98');
var ddds = await axios.get(`https://brasilapi.com.br/api/ddd/v1/${query.trim()}`)
var dddlist = `Aqui está a lista de cidades do estado ${ddds.data.state} com o DDD ${query.trim()}:\n\n`
for (var i = 0; i < ddds.data.cities.length; i++) {
    dddlist += `${i + 1}. *${ddds.data.cities[i]}*\n`
}
await reply(dddlist)
break

case 'amazon': case 'amazonsearch':
    if(query.trim().length < 4) return await reply('Parece que você esqueceu de adicionar o nome do produto! Por favor, coloque o nome do produto após o comando.');
    await reply('Estamos buscando os melhores resultados para você. Isso pode levar alguns segundos...');
    try {
        var data = await fetchJson(`${WebSite}/lojas/amazon?nome=${query.trim()}&apikey=${ApiKeySasha}`);
        if(data.resultado.length === 0) return await reply('Desculpe, não encontramos nenhum produto com esse nome. Tente ser mais específico ou verifique a ortografia.');
        var mapResult = data.resultado.map((v, index) => {
            return `*${index + 1}.* ⤷ Produto: *${v.titulo || 'Sem Informações!'}*\n⤷ Valor: *${v.valor}*\n⤷ Link: *${v.link}*`;
        }).join('\n–\n');
        await sasha.sendMessage(from, { text: `🔍 *Resultados de Pesquisa na Amazon*:\n–\n${mapResult}`, contextInfo: { externalAdReply: { title: data.resultado[0].titulo, thumbnail: await getBuffer(data.resultado[0].imagem),mediaType: 2, sourceUrl: data.resultado[0].link }}}, {quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'steam':
    if(!query.trim()) return await reply(`Digite o nome de um jogo da Steam. Exemplo: *${prefix + command} Counter-Strike 2*`);
    try {
        await reply(`Buscando informações sobre *${query}* na Steam...`);
        var data = await fetchJson(`https://api.suraweb.online/search/steam?q=${encodeURIComponent(query.trim())}`);
        if(!data || !data.result || !data.result.length) {
            return await reply(`Nenhum jogo encontrado com o nome *${query}*.`);
        }
        var game = data.result[0];
        var meta = game.detail?.metadata;
        await sasha.sendMessage(from, { image: { url: game.image }, caption: `*⤷ Jogo encontrado na Steam!*\n⤷ *Nome:* ${meta.title}\n⤷ *Gênero:* ${await traduzir(meta.genre?.join(", ")) || 'Não informado'}\n⤷ *Categoria:* ${await traduzir(meta.category?.slice(0, 5).join(", ")) || 'Não informado'}\n⤷ *Plataforma:* ${game.platform || 'Desconhecida'}\n⤷ *Preço:* ${game.price || 'Gratuito'}\n⤷ *Desenvolvedora:* ${meta.developer?.join(", ") || 'Não informado'}\n⤷ *Publicadora:* ${meta.publisher?.join(", ") || 'Não informado'}\n⤷ *Lançamento:* ${await traduzir(meta.release) || 'Desconhecido'}\n⤷ *Descrição:* ${await traduzir(meta.description?.substring(0, 400))}...` }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

/* ----- [ Começo das Cases | Menus ] ----- */

case 'menu': case 'helpp': case 'menup': case 'menuprincipal':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.principal(prefix)), mentions: [sender] }, {quoted: info });
break

case 'logos': case 'menulogo': case 'menulogos':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.logos(prefix)), mentions: [sender] }, {quoted: info });
break 

case 'menuadm': case 'menuadms': case 'adm':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.admins(prefix)), mentions: [sender] }, {quoted: info });
break;

case 'menudono': case 'donomenu':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.dono(prefix)), mentions: [sender] }, {quoted: info });
break;

case 'efeitosimg': case 'efeitos': case 'efeitoimg': case 'efeitosmarcar':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.efeitos(prefix)), mentions: [sender] }, {quoted: info });
break;

case 'alteradores':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.alteradores(prefix)), mentions: [sender] }, {quoted: info });
break;

case 'config-brincadeira':
  var key = query.trim();
  var normalizedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  if(normalizedKey.toLowerCase().startsWith('rank')) {
    normalizedKey = 'Rank' + normalizedKey.charAt(4).toUpperCase() + normalizedKey.slice(5).toLowerCase(); normalizedKey.charAt(4).toUpperCase() + normalizedKey.slice(5).toLowerCase();
  }
  var nonUpdatableKeys = ['Tapa', 'Matar', 'Kisses', 'Chute', 'Mamar', 'Sexo', 'Molesta'];
  if(nonUpdatableKeys.includes(normalizedKey)) {
    if(!(verifyMedia && info.message.videoMessage)) {
      return await reply(`Para trocar o URL de '${normalizedKey}', você precisa marcar um vídeo correspondente.`);
    }
    await reagir(from, '😸'); 
    var midia = info.message.videoMessage;
    var bufferMidia = await getFileBuffer(midia, 'video');
    var resultado = await uploader.catbox(bufferMidia);
    images['Brincadeiras']['Cards'][normalizedKey] = resultado;
    await saveJson('./configs/images.json', images);
    return await reply(`O URL do vídeo '${normalizedKey}' foi atualizado com sucesso para ⤷ ${resultado}`);
  }
  if((verifyMedia && !info.message.videoMessage || QuotedMessage.Picture)) {  
    await reagir(from, '😸'); 
    var midia = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage;
    var bufferMidia = await getFileBuffer(midia, 'image');
    var resultado = await uploader.catbox(bufferMidia);
  } else if((verifyMedia && info.message.videoMessage.seconds < 30 || QuotedMessage.Clip && info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 60)) {
    await reagir(from, '😸'); 
    var midia = QuotedMessage.Clip ? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.videoMessage : info.message.videoMessage;
    var bufferMidia = await getFileBuffer(midia, 'video');
    var resultado = await uploader.catbox(bufferMidia);
  } else {
    return await reply(`Por favor, envie uma *imagem* ou *vídeo* com o comando *${prefix + command}*, não se esqueça de mencionar a chave que você deseja alterar. 😐`);
    }
  if(images['Brincadeiras']['Cards'].hasOwnProperty(normalizedKey)) {
    images['Brincadeiras']['Cards'][normalizedKey] = resultado;
    await saveJson('./configs/images.json', images);
    await reply(`O URL da mídia '${normalizedKey}' foi atualizado com sucesso para ⤷ ${resultado}`);
  } else {
    var availableKeys = Object.keys(images['Brincadeiras']['Cards']);
    await reply(`A chave '${normalizedKey || '#'}' não existe. Tente novamente com uma chave válida.\n\nAqui estão as chaves disponíveis:`);
    var mensagem = '';
    availableKeys.forEach((key, index) => {
      mensagem += `${index + 1}. ${key}\n`;
    });
    await replyMessage(mensagem);
  }
break;

case 'brincadeiras': case 'brincadeira':
if(!verifyModoBn) return await reply('Poxa, tem que estar no modo brincadeira, viu? Vamos entrar na brincadeira! 😏')
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.brincadeiras(prefix)), mentions: [sender] }, {quoted: info });
break;

case 'menupremium': case 'menuprem':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.premium(prefix, capitalizeFirstLetter, configs.CommandsVIP['commands'])), mentions: [sender] }, {quoted: info });
break;

case 'menucasal':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.casal(prefix)), mentions: [sender] }, {quoted: info });
break;

case 'menudownload': case 'menudown':
await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: BotInfo(linguagem.downloads(prefix)), mentions: [sender] }, {quoted: info });
break;

case 'autodown':
await reply(`🌟 Olá! Eu posso te ajudar a baixar mídias diretamente de várias plataformas. Escolha a plataforma desejada abaixo e depois escolha o formato de download.

🚀 Aqui estão as opções disponíveis para download:
–
	⤷	TikTok
📥 Formatos disponíveis: MP3 | MP4/PNG
	⤷	YouTube
📥 Formatos disponíveis: MP3 | MP4
	⤷	Instagram
📥 Formatos disponíveis: MP3 | MP4/PNG
	⤷	Facebook
📥 Formatos disponíveis: MP3 | MP4
	⤷	Threads
📥 Formatos disponíveis: MP4/PNG
	⤷	Spotify
📥 Formato disponível: MP3
	⤷	Pinterest
📥 Formato disponível: MP4
	⤷	Twitter
📥 Formatos disponíveis: MP3 (beta) | MP4
—
É só fornecer o URL da mídia desejada e eu realizarei a busca para você!`)
break

case 'perfil':
    if(!verifyGrupo) return await reply(responses.grupo());
    try {
        var photo = await sasha.profilePictureUrl(`${sender.split('@')[0]}@c.us`, 'image');
    } catch {
        var photo = images['defaultProfile'].value;
    }
    try {
        var statusUser = await sasha.fetchStatus(sender);
        var statusText = statusUser.status || 'Privado ou não encontrado. 😅';
    } catch {
        var statusText = 'Privado ou não encontrado. 😅';
    }
    var usuarioPerfil = await getUsuarioById(sender);
    var nome = usuarioPerfil.nome || 'Não definido';
    var idade = usuarioPerfil.idade ? `${usuarioPerfil.idade} anos` : 'Não definida';
    var idioma = usuarioPerfil.idioma || 'Não definido';
    var registrado = formatarData(usuarioPerfil.registrado) || 'Não definido';
    var statusRelacionamento = '💔 Solteiro(a)';
    var parceiroRelacionamento = null;
    if(usuarioPerfil.casamento && usuarioPerfil.casamento.parceiro) {
        statusRelacionamento = `💍 Casado(a) com @${usuarioPerfil.casamento.parceiro.split('@')[0]} desde ${usuarioPerfil.casamento.desde}`;
        parceiroRelacionamento = usuarioPerfil.casamento.parceiro;
    } else if(usuarioPerfil.namoro && usuarioPerfil.namoro.parceiro) {
        statusRelacionamento = `💞 Namorando com @${usuarioPerfil.namoro.parceiro.split('@')[0]} desde ${usuarioPerfil.namoro.desde}`;
        parceiroRelacionamento = usuarioPerfil.namoro.parceiro;
    }
    var groupData = await collections.rankMessages.findOne({ _id: from });
    var userStats = groupData?.users?.find(u => u.id === sender) || {};
    await sasha.sendMessage(from, { image: { url: photo }, caption: `📌 *Perfil de ${nome}!*
—
💬 *Mensagens Enviadas:* ${userStats.messages || 'Sem Informações'}
📊 *Comandos Utilizados:* ${userStats.commands || 'Sem Informações'}
🎭 *Figurinhas Enviadas:* ${userStats.stickers || 'Sem Informações'}
—
💰 *Saldo:* ${usuarioPerfil.saldo} coins
🗣️ *Idioma:* ${idioma}
📅 *Registrado:* ${registrado}
📖 *Biografia:* ${statusText}
❤️ *Relacionamento:* ${statusRelacionamento}
🙄 *Modo Sem prefixo?* ${usuarioPerfil.disabled ? 'Ativado 😁' : 'Desativado 💔'}
—
🔮 *Análise de Personalidade:*  
🤡 *Corno(a):* ${Math.floor(Math.random() * 101)}%  
🐄 *Gado(a):* ${Math.floor(Math.random() * 101)}%  
🏳️‍🌈 *Gay/Lésbica:* ${Math.floor(Math.random() * 101)}%  
🕊️ *Santo(a):* ${Math.floor(Math.random() * 101)}%  
🔥 *Safado(a):* ${Math.floor(Math.random() * 101)}%  
💼 *Empresário(a):* ${Math.floor(Math.random() * 101)}%  
🛌 *Vagabundo(a):* ${Math.floor(Math.random() * 101)}%  
😍 *Lindo(a):* ${Math.floor(Math.random() * 101)}%
`, mentions: parceiroRelacionamento ? [parceiroRelacionamento] : [] }, { quoted: info });
break;

/* ----- [ Começo das Cases | Donos ] ----- */
case 'reviverqr':
if(!verifyDono) return await reply(responses.dono())
exec('cd config/media/qr-code && rm -rf pre-key* sender* session*')
await reply('Estou reiniciando tudo aqui. Um instante.')
process.exit()
break

case 'cases':
  if(!verifyDono) return await reply(responses.dono());
  try {
    var listCases = () => {
      var filePath = path.resolve(__dirname, 'command.js');
      if(!fs.existsSync(filePath)) return 'O arquivo "command.js" não foi encontrado.';
      var fileContent = fs.readFileSync(filePath, 'utf-8');
      var caseMatches = fileContent.match(/case\s+'(.+?)'/g);
      if(caseMatches && caseMatches.length > 0) {
        return [
          'Lista de comandos registrados:',
          '',
          ...caseMatches.map((line, i) => `${i + 1}. ${line.match(/'(.+?)'/)[1]}`)
        ].join('\n');
      } else {
        return 'Nenhum comando encontrado no arquivo.';
      }
    };
    var result = listCases();
    await sasha.sendMessage(from, { text: result }, { quoted: info });
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'totalcmd':
  if(!verifyDono) return await reply(responses.dono());
  try {
    var filePath = path.resolve(__dirname, 'command.js');
    var totalComandos = () => {
      if(!fs.existsSync(filePath)) return 'O arquivo "command.js" não foi encontrado.';
      var fileContent = fs.readFileSync(filePath, 'utf-8');
      var caseMatches = fileContent.match(/case\s+'(.+?)'/g);
      var total = caseMatches ? caseMatches.length : 0;
      return `Total de comandos encontrados: ${total}`;
    };
    var result = totalComandos();
    await sasha.sendMessage(from, { text: result }, { quoted: info });
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'getcommand':
  if (!verifyDono) return await reply(responses.dono());

  try {
    var filePath = path.resolve(__dirname, 'command.js');
    var cmdName = query.toLowerCase();

    if (!cmdName)
      return await reply('Informe o nome do comando desejado. Exemplo: getcommand menu');

    if (!fs.existsSync(filePath))
      return await reply('O arquivo "command.js" não foi encontrado no diretório.');

    var lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    var searchLine = `case '${cmdName}':`;

    var commandIndex = lines.findIndex(line => line.trim().toLowerCase() === searchLine);

    if (commandIndex === undefined)
      return await reply(`O comando "${cmdName}" não foi localizado no arquivo.`);

    var capturedLines = lines.slice(commandIndex, lines.length)
                                .reduce((acc, line, index, array) => {
                                  acc.push(line);
                                  if (line.trim() === 'break;') array.splice(index + 1);
                                  return acc;
                                }, []);

    var conteudo = capturedLines.join('\n').trim();

    await reply(`Enviando código completo do comando "${cmdName}"...`);
    await sasha.sendMessage(from, {
      text: '```javascript\n' + conteudo + '\n```',
    });
  } catch (error) {
    if (typeof logBug === 'function') logBug(error.message, command);
  }
  break;

case 'sairgp':
if(!verifyDono) return await reply(responses.dono())
if(!verifyGrupo) return await reply(responses.grupo())
try {
    await sasha.groupLeave(from)
    await reply('O bot agora vai sair do grupo. Se precisar de algo mais, só chamar!')
} catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
break

case 'seradm':
if(!verifyDono) return await reply(responses.dono())
await sasha.sendMessage(from, { text: `@${sender.split('@')[0]} Pronto ⤷ Agora você é um administrador.`, mentions: [sender] }, { quoted: info })
await sasha.groupParticipantsUpdate(from, [sender], 'promote')
break

case 'sermembro':
if(!verifyDono) return await reply(responses.dono())
await sasha.sendMessage(from, { text: `@${sender.split('@')[0]} Pronto ⤷ Agora você é um membro comum novamente.` , mentions: [sender] }, { quoted: info })
await sasha.groupParticipantsUpdate(from, [sender], 'demote')
break

case 'sairdogp':
if(!verifyDono) return await reply(responses.dono())
if(!query.trim()) return await reply(`Você deve visualizar o comando ${prefix}listagp e verificar a numeração do grupo do qual deseja que o bot saia. Exemplo: ${prefix}sairdogp 0. Este comando faz com que o bot saia do grupo especificado.`)
var getGroups = await sasha.groupFetchAllParticipating()
var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
var ingfoo = groups.map(v => v)
ingfoo.sort((a, b) => (a[0] < b.length))
try {
    await sasha.sendMessage(ingfoo[query].id, { text: `Estarei deixando o grupo, por ordem do meu dono. Se desejarem alugar o bot por um preço bacana, entrem em contato no privado ⤷ https://wa.me/${NumberDonoOficial}` })
    sasha.groupLeave(ingfoo[query].id)
} catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
await reply('Pronto, o bot saiu do grupo solicitado. Caso tenha dúvidas, use o comando listagp para verificar a lista de grupos.')
break

case 'listagp':
    if(!verifyDono) return await reply(responses.dono());
    var getGroups = await sasha.groupFetchAllParticipating();
    var groups = Object.values(getGroups);
    groups.sort((a, b) => a.subject.localeCompare(b.subject)); 
    var responde = `Lista de Grupos\nTotal de Grupos: ${groups.length}\n\n`;
    for (var grupos = 0; grupos < groups.length; grupos++) {
        var grupo = groups[grupos];
        var linkdogp = await sasha.groupInviteCode(grupo.id)
            .then(code => `https://chat.whatsapp.com/${code}`)
            .catch(() => 'Não foi possível puxar o link.');
        responde += `⤷ Grupo: ${grupos + 1}\n⤷ Nome do Grupo: ${grupo.subject}\n⤷ Id do Grupo: ${grupo.id}\n⤷ Link de convite: ${linkdogp}\n⤷ Criado: ${moment(grupo.creation * 1000).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss')}\n⤷ Total de Membros: ${grupo.participants.length}\n\n`;
    }
    await reply(responde);
break;

case 'grupoid':
try {
 var profilePictureUrl = await sasha.profilePictureUrl(from, 'image');
 } catch {
 var profilePictureUrl = images['defaultProfile'].value; 
 }
await sasha.sendMessage(from, { image: { url: profilePictureUrl }, caption: `Sasha Grupos! *@${sender.split('@')[0]}* ID do '${groupName}' ↴`, mentions: [sender], mimetype: 'image/jpeg' });
await replyMessage(from);
break

case 'atividade': case 'atividades':
    try {
        if(!membersSupreme) return await reply(responses.admin());
        var grupo = await collections.rankMessages.findOne({ _id: from });
        if(verifyGrupo && grupo && Array.isArray(grupo.users) && grupo.users.length > 0) {
            var teks = `*Atividade dos membros do grupo:*\n\n`;
            for (var i = 0; i < grupo.users.length; i++) {
                var member = grupo.users[i];
                teks += `*⤷ Membro:* @${member.id.split('@')[0]}\n*⤷ Comandos:* ${member.commands || 0}\n*⤷ Mensagens:* ${member.messages || 0}\n*⤷ Aparelho:* ${member.device || 'Desconhecido'}\n—\n`;
            }
            await sasha.sendMessage(from, { text: teks, mentions: grupo.users.map(i => i.id) }, { quoted: info });
        } else {
            await reply('Sem Informações o suficiente 😿');
        }
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'nome-bot':
    if(!verifyDono) return await reply(responses.dono());
    settings['botName'].value = query.trim();
    await saveJson('./configs/settings.json', settings);
    await reply(`O nome do bot foi alterado com sucesso para ⤷ ${settings['botName'].value}`);
break;

case 'apikey':
    if(!verifyDono) return await reply(responses.dono());
    settings['APIs'].apikey = query.trim();
    await saveJson('./configs/settings.json', settings)
    await reply(`A ApiKey do bot foi alterado com sucesso para ⤷ ${settings['APIs'].apikey}`);
break;

case 'nick-dono':
    if(!verifyDono) return await reply(responses.dono());
    settings['nameOwner'].value = query.trim();
    await saveJson('./configs/settings.json', settings);
    await reply(`O nick do dono foi configurado para ⤷ ${settings['nameOwner'].value}`);
 break;

case 'numero-dono':
    if(!verifyDono) return await reply(responses.dono());
    if(query.match(/[a-z]/i)) return await reply('Apenas números são permitidos.');
    settings['OwnerNumber'].value = query.trim().replace(new RegExp('[()+-/ +/]', 'gi'), '');
    await saveJson('./configs/settings.json', settings);
    await reply(`O número do dono foi configurado com sucesso para ⤷ ${settings['OwnerNumber'].value}`);
break;

case 'ajustesite':
    if(!verifyDono) return await reply(responses.dono());
    settings['APIs'].website = query.trim();
    await saveJson('./configs/settings.json', settings);
    await reply(`O Web site foi configurado para ⤷ ${settings['APIs'].website}`);
break;

case 'prefixo-bot': case 'setprefix':
    if(query.length < 1) return;
    if(!verifyDono) return await reply(responses.dono());
    settings['Prefix'].value = query.trim();
    await saveJson('./configs/settings.json', settings);
    await reply(`O prefixo foi alterado com sucesso para ⤷ ${settings['Prefix'].value}`);
break;

case 'fotomenu': case 'fundomenu':
    if(!verifyDono) return await reply(responses.dono());
    if(!QuotedMessage.Picture) return await reply('Você deve marcar uma imagem com esse comando. Se não for de primeira, tente novamente, ok?');
    if(verifyMedia && !info.message.imageMessage || QuotedMessage.Picture) {
        var image = QuotedMessage.Picture ? info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage : info.message?.imageMessage;
        var upload = await getFileBuffer(image, 'image');      
        try {
            var resultado = await uploader.pixhost(upload);
            images['Main'].value = resultado.resultado;
            await saveJson('./configs/images.json', images);
            await reply(`A imagem do menu foi alterada com sucesso para ⤷ ${await resultado}`);
        } catch (error) {
            if(typeof logBug === 'function') logBug(error.message, command);
        }
    }
break;

case 'fotobot':
    if(!verifyDono) return await reply(responses.dono());
    if(!QuotedMessage.Picture) return await reply(`Envie uma imagem com uma legenda utilizando o comando ${prefix}fotobot ou envie uma tag de imagem já enviada anteriormente.`);
    var buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image');
    await sasha.updateProfilePicture(botNumber, buff);
    await reply('Obrigado pela nova foto de perfil.');
break;

case 'clonar':
    if(!verifyDono) return await reply('Você realmente é o proprietário?');
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(string.length < 1) return await reply('Marque a pessoa que você quer clonar, por exemplo: clone @');
    if(!mentionJidTwo[0] || mentionJidTwo[1]) return await reply('Marque o @ do usuário para copiar a foto de perfil dele para o bot.');
    var { jid, id, notify } = groupMembers.find(x => x.id === mentionJidTwo[0]);
    try {
        var perfil = await sasha.profilePictureUrl(id);
        var buffer = await getBuffer(perfil);
        await sasha.updateProfilePicture(botNumber, buffer);
        await mention(`Foto de perfil atualizada com sucesso, usando a foto do perfil de @${id.split('@')[0]}`);
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'bcgp': case 'bcgc':
    if(!verifyDono) return await reply(responses.dono());
    if(!membersSupreme) return await reply(responses.admin());
    if(!query.trim()) return await reply('Ei, cadê o texto? Não vai me deixar no vácuo, né?');
    if(verifyMedia && !info.message.videoMessage || QuotedMessage.Picture) {
        encmedia = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image');
        for (i = 0; i < groupMembers.length; i++) {
            await sleep(2000);
            await sasha.sendMessage(groupMembers[i].id, { image: encmedia }, { caption: `Aqui está sua mensagem: \n\nGrupo: ${groupName}\nNúmero: wa.me/${sender.split('@')[0]}\nMensagem: ${query.trim()}` });
        }
        await reply('A transmissão foi enviada com sucesso. Todo mundo vai saber o que você disse agora!');
    } else {
        for (i = 0; i < groupMembers.length; i++) {
            await sleep(2000);
            await sasha.sendMessage(groupMembers[i].id, { text: `Aqui está sua mensagem: \n\nGrupo: ${groupName}\nNúmero: wa.me/${sender.split('@')[0]}\nMensagem: ${query.trim()}`, mentions: [sender] }, { quoted: info });
        }
        await reply('A transmissão foi um sucesso. Prepare-se para a chuva de respostas!');
    }
 break;

case 'subdono': 
  if(!verifyDono) return await reply(responses.dono());
  var entrada = query.replace(/ ?\/ ?/, '/');
  var { usuario: usuarioFinal, quantidadeDias: dias } = extrairUsuario(entrada);
  var infinito = dias === 0;
  if(isNaN(dias) || dias < 0) return await reply(`Informe um número válido de dias! Ex: ${prefix}subdono @user/0 (vitalício) ou ${prefix}subdono @user/30`);
  var usuario = await getUsuarioById(usuarioFinal);
  if(!usuario) return await reply('Usuário não encontrado. Tente novamente.');
  if(!Array.isArray(usuario.dono)) usuario.dono = [];
  var agora = new Date();
  var expiracao = infinito ? null : new Date();
  if(!infinito) expiracao.setDate(agora.getDate() + dias);
  if(usuario.dono.length > 0) {
    Object.assign(usuario.dono[0], { status: true, dataCriacao: agora.toISOString(), dataExpiracao: expiracao ? expiracao.toISOString() : null, infinito });
  } else {
    usuario.dono.push({ status: true, dataCriacao: agora.toISOString(), dataExpiracao: expiracao ? expiracao.toISOString() : null, infinito });
  }
  await updateUsuario(usuarioFinal, usuario);
  if(infinito) {
    await reply(`O cargo de *Dono vitalício* foi atribuído com sucesso!`);
    await sasha.sendMessage(usuarioFinal, { text: `Parabéns! Você foi promovido ao cargo de *Dono vitalício*!\n\nAgora você possui acesso completo aos recursos do sistema sem limite de tempo. Aproveite com responsabilidade!`, mentions: [usuarioFinal] });
  } else {
    await reply(`O cargo de *Dono* foi atribuído por *${dias} dia(s)*. Válido até: *${formatarData(expiracao)}*.`);
    await sasha.sendMessage(usuarioFinal, { text: `Você recebeu o cargo de *Dono* por *${dias} dia(s)*!\n\nSeu acesso especial está ativo até *${formatarData(expiracao)}*. Use esse tempo com sabedoria e aproveite os recursos disponíveis!`, mentions: [usuarioFinal] });
}
break;

case 'deldono': 
  if(!verifyDonoOficial) return await reply(responses.dono());
  if(!mentionTwo || mentionJidTwo[1]) return await reply('Por favor, marque a mensagem do usuário ou informe o @ do usuário que você deseja remover o cargo de *Dono*.')
  var usuario = await getUsuarioById(mentionTwo);
  if(!usuario) return await reply('Não conseguimos encontrar o usuário. Por favor, verifique e tente novamente.');
  if(!usuario.dono || usuario.dono.length === 0) return await reply('O usuário selecionado não possui o cargo de *Dono* no momento.');
  usuario.dono = [];
  await updateUsuario(mentionTwo, usuario);
  await reply(`O cargo de *Dono* foi removido com sucesso! O usuário não possui mais os privilégios exclusivos.`);
  await sasha.sendMessage(mentionTwo, { text: `Infelizmente, seu cargo de *Dono* foi removido. Como resultado, você perdeu os privilégios especiais. Caso deseje mais informações ou solicite o cargo novamente, entre em contato com a administração.`, mentions: [mentionTwo] });
break;

case 'getquoted':
await reply(JSON.stringify(info.message.extendedTextMessage.contextInfo, null, 3))
break

case 'donoslist':
  var usuariosDonos = getDonos.todosDonos(usuarios);
  if(!usuariosDonos || usuariosDonos.length === 0) return await reply('Nenhum usuário com o cargo de *Dono* encontrado no momento.');
  var lista = `[ Lista de *Donos* da ${botName} ]\n—\n`;
  for (var i = 0; i < usuariosDonos.length; i++) {
    var id = usuariosDonos[i];
    var usuario = await getUsuarioById(id);
    if(usuario && Array.isArray(usuario.dono) && usuario.dono.length > 0) {
      var dono = usuario.dono.find(d => d.status === true);
      var validadeTexto = dono.infinito ? 'Infinito' : '';
      if(!dono.infinito && dono.dataExpiracao) {
        var dataExp = new Date(dono.dataExpiracao);
        validadeTexto = `${formatarData(dataExp)}`;
      }
      lista += `${i + 1}. ${usuario.nome || 'Usuário(a)'}\n`;
      lista += `⤷ Validade do cargo: ${validadeTexto}\n`;
      lista += `⤷ wa.me/${id.split('@')[0]}\n\n`;
    }
  }
  lista += `Total de *${usuariosDonos.length}* Donos`;
  await sasha.sendMessage(from, { text: lista }, { quoted: info });
break;

case 'admins': case 'listadmins': case 'listaadmins':
    if(!verifyGrupo) return await reply(responses.grupo());
    var message = `Aqui está a lista dos admins do grupo *${groupName}*!\nTotal de admins: ${groupAdmins.length}\n\n`;
    var no = 0;
    const adminsList = [];

    for (var admin of groupAdmins) {
        no += 1;
        adminsList.push(`${no.toString()}. @${admin.split('@')[0]}\n`);
    }
    message = message + adminsList.join('');
    await mention(message);
break;

case 'ativo': case 'on': case 'voltei':
    if(!membersSupreme) return await reply('Esse comando é só para administradores ou o dono do grupo.');
    if(DonoOficial) {
        if(fs.existsSync(`./configs/media/assets/json/afk-@${NumberDonoOficial}.json`)) {  
            deleteFile(`./configs/media/assets/json/afk-@${NumberDonoOficial}.json`);
            return await reply('Bem-vindo de volta, agora você está online.');
        } else {
            return await reply('Você não registrou nenhuma mensagem de ausência.');
        }
    } else if(!membersSupreme) {
        if(!JSON.stringify(dataGp.ausentes.users).includes(sender)) {
            return await reply('Não há nenhum registro de ausência para o seu número.');
        }
        const userIndex = dataGp.ausentes.users.map(x => x.id).indexOf(sender);
        dataGp.ausentes.users.splice(userIndex, 1);
        await salvarConfigGrupo(dataGp);
        return await reply('Sua ausência foi removida com sucesso. Bem-vindo de volta!');
    }
break;

case 'ausente': case 'off': case 'afk':
    if(!membersSupreme) return await reply('Esse comando é exclusivo para administradores ou para o dono do grupo.');
    if(DonoOficial) {
        var temp = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
        await saveFile(`./configs/media/assets/json/afk-@${settings['OwnerNumber'].value.replace(new RegExp('[()+-/ +/]', 'gi'), '')}.json`, JSON.stringify({tempo: temp, motivo: query }, null, 2));
        return await reply('Mensagem de ausência registrada com sucesso. Você agora está off.');
    } else if(!membersSupreme) {
        if(!query.trim()) return await reply(`Por favor, forneça uma mensagem para a ausência. Exemplo: ${prefix + command} Estou tomando banho.`);
        if(!JSON.stringify(dataGp.ausentes.users).includes(sender)) {
            dataGp.ausentes.users.push({ id: sender, motivo: query.trim() });
            await salvarConfigGrupo(dataGp);
            return await reply('Mensagem de ausência criada com sucesso! Se quiser desativar, use o comando ativo.');
        } else {
            dataGp.ausentes.users[dataGp.ausentes.users.map(i => i.id).indexOf(sender)].motivo  = query.trim();
            await salvarConfigGrupo(dataGp);
            return await reply('Mensagem de ausência atualizada com sucesso! Se quiser desativar, use o comando ativo.');
        }
    } else {
        return await reply('Comando restrito apenas para administradores ou o dono do bot.');
    }
break;

case 'reagir':
const whatsappEmojis = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😇', '😉',
  '😊', '😋', '😌', '😍', '😘', '😗', '😙', '😚', '🙂', '🙃',
  '😉', '😌', '😋', '😛', '😜', '😝', '😒', '😓', '😔', '😕',
  '😖', '😗', '😙', '😚', '😜', '😝', '😞', '😟', '😠', '😡',
  '😢', '😭', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫',
  '😬', '😭', '😰', '😱', '😳', '😵', '😶', '😷', '🤒', '🤕',
  '🤧', '🤠', '😇', '🤗', '🤔', '🤭', '🤫', '🤨', '😈', '👿',
  '🤥', '🤪', '🤩', '🥳', '🥺', '🤓', '🧐', '🤠', '🥸', '😜',
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '👍', '👎', '✊', '👊',
  '🤛', '🤜', '🤞', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵',
  '👈', '👉', '👆', '👇', '☝️', '✌️', '🤞', '💍', '👄', '⚽'
];
await sasha.sendMessage(from, { react: { text: await pickRandom(whatsappEmojis), key: info.key } });
break

case 'limpar':
if(!verifyGrupo) return await reply(responses.grupo())
if(!membersSupreme) return await reply(responses.admin())
await sasha.sendMessage(from, { text: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' }, { quoted: info });
break

case 'apagar':
    if(!premiumUser) return await reply('Esse comando é só para usuários premium, precisa de um upgrade para usar!');
    await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.message.buttonsResponseMessage.contextInfo.stanzaId, participant: botNumber}});
break;

case 'deletar': case 'delete': case 'del': case 'd':
    if(!membersSupreme) return await reply(responses.admin());
    if(!mentionMessage) return await reply('Marque a mensagem de alguém que deseja apagar (ou do bot!).');
    await sasha.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.message.extendedTextMessage.contextInfo.stanzaId, participant: mentionMessage}});
 break;

case 'antipv':  
if(!verifyDono) return await reply(responses.dono())
configs.Privacidade.status = !configs.Privacidade.status
await saveJson('./configs/configs.json', configs);
await sasha.sendMessage(from, { text: configs.Privacidade.status ? `Ativou com sucesso o recurso de Anti Privado neste grupo` : `Desativou com sucesso o recurso de Anti Privado neste grupo` }, { quoted: info })
break

case 'block': case 'blockuser':
    if(!verifyDono) return await reply(responses.dono()); 
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Hey, precisa marcar alguém! Pode ser o @, responder a mensagem ou mandar o número. Mas lembre-se: um só por vez, hein?');
    if(botNumber.includes(mentionTwo)) {
    return await reply('Ei, você realmente está tentando me bloquear? Eu sou seu assistente fiel!\nInfelizmente, não posso ser bloqueado, mas podemos conversar sobre isso se quiser.');
    }
    if(JSON.stringify(nmrdn).includes(mentionTwo)) {
    return await reply('Ah, esse é o criador do bot, o *Biel*, com todas as permissões possíveis.\nNinguém pode aplicar block nele.');
    }
    if(JSON.stringify(donos).includes(mentionTwo) && !verifyDonoOficial) {
    return await reply('Esse é um dos sub donos do sistema, com permissões especiais.\nSomente o *donos oficial* pode aplicar o block nesse caso.');
    }
    if(JSON.stringify(premiums).includes(mentionTwo) && !verifyDonoOficial) {
    return await reply('Essa pessoa é uma das estrelas premium do nosso sistema!\nSomente o *dono oficial* pode aplicar um block nesse caso.');
    }
    var usuarioAlvo = await getUsuarioById(mentionTwo);
    if(usuarioAlvo?.block === true) {
        return await reply('Esse número já está bloqueado, não tem jeito!');
    }
    usuarioAlvo.block = true;
    await updateUsuario(mentionTwo, usuarioAlvo);
    await sasha.sendMessage(from, { text: `@${mentionTwo.split('@')[0]} foi bloqueado e não pode mais usar os comandos do bot em nenhum grupo ou privado. Até logo!`, mentions: [mentionTwo] }, { quoted: info });
    await sasha.updateBlockStatus(mentionTwo, 'block');
break;

case 'unblock': case 'unblockuser':
    if(!verifyDono) return await reply(responses.dono()); 
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Hey, precisa marcar alguém! Pode ser o @, responder a mensagem ou mandar o número. Mas lembre-se: um só por vez, hein?');
    var usuarioAlvo = await getUsuarioById(mentionTwo);
    if(usuarioAlvo?.block === false) {
        return await reply('Esse número já está desbloqueado, não tem jeito!');
    }
    usuarioAlvo.block = false;
    await updateUsuario(mentionTwo, usuarioAlvo);
    await sasha.sendMessage(from, { text: `@${mentionTwo.split('@')[0]} Você está liberado para utilizar meus comandos novamente!, mas não vacila, tá?`, mentions: [mentionTwo] }, { quoted: info });
    await sasha.updateBlockStatus(mentionTwo, 'unblock');
break;

case 'blocklist':
    var todosUsuarios = await getUsuarios();
    var blockListMessage = 'Aqui está a lista de números bloqueados:\n';
    var blockedUsers = todosUsuarios.filter(user => user.block === true);
    if(blockedUsers.length === 0) {
        return await reply('Não há números bloqueados no momento.');
    }
    blockedUsers.forEach((ban, index) => {
        blockListMessage += `${index + 1}. @${ban.id.split('@')[0]}\n`;
    });
    blockListMessage += `Total: ${blockedUsers.length} números bloqueados até agora.`;
    await sasha.sendMessage(from, { text: blockListMessage.trim(), mentions: blockedUsers.map(user => user.id) }, { quoted: info });
break;

case 'dados': case 'ping':
await reagir(from, '⚡');
  const latencia = performance.now()
    await sasha.sendMessage(from, { text: `💻 Informações do Servidor:\n\n🔢 Total de Memória RAM: *${(require('os').totalmem()/Math.pow(1024, 3)).toFixed(2)} GB*\n📊 Memória RAM Usada: *${(require('os').freemem()/Math.pow(1024, 3)).toFixed(2)} GB*\n🖥️ Uso da CPU: *${require('os').loadavg()[0].toFixed(2)}%*\n🌐 Sistema Operacional: *${capitalizeFirstLetter(require('os').platform())}* \`\`\`(${require('os').release()})\`\`\`\n\nℹ️ *Informações sobre o bot*:\nNome do bot: *${botName}*\nDesenvolvedor: *${donoName}*\nVelocidade de resposta: *${(performance.now() - latencia).toFixed(2)}ms*\nTempo Online: *${TimeCount(process.uptime())}*`, mentions: [sender] }, { quoted: info });
break;

case 'blockcmd': case 'blockcmdgp':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());  
    const comandoBloqueado = queryTwoB.replaceAll(command, 'Não pode bloquear esse comando');
    if(dataGp.comandosB.commands?.includes(comandoBloqueado)) return await reply('Este comando já está bloqueado. Nada a fazer por aqui!');
    !dataGp.comandosB.commands ? dataGp.comandosB.commands = [comandoBloqueado] : dataGp.comandosB.commands.push(comandoBloqueado);
    await salvarConfigGrupo(dataGp);
    await reply(`O comando ${comandoBloqueado} foi bloqueado com sucesso! Agora ele não pode ser mais usado no grupo. Não tem mais escape!`);
break

case 'unblockcmd': case 'unblockcmdgp':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    const comandoDesbloqueado = queryTwoB.replaceAll(command, 'Não pode bloquear esse comando');
    if(!dataGp.comandosB.commands?.includes(comandoDesbloqueado)) return await reply('Este comando já está desbloqueado no grupo. Já estava liberado!');  
    dataGp.comandosB.commands.splice(dataGp.comandosB.commands.indexOf(comandoDesbloqueado), 1);
    await salvarConfigGrupo(dataGp);
    await reply(`Comando ${comandoDesbloqueado} foi desbloqueado com sucesso no grupo! Agora todos podem usá-lo novamente!`);
break

case 'listacomandos': case 'listblockcmd': case 'listablockcmd': case 'comandosbloqueado': case 'comandosblock': case 'comandobloqueado': {
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!dataGp.comandosB.commands?.length > 0) return await reply('Nenhum comando bloqueado no momento. O chat está livre para todos!'); 
    var listaComandos = `List de comandos bloqueados no Grupo: ${groupName}`;
    for (var i = 0; i < dataGp.comandosB.commands.length; i++) {
        listaComandos += `${i}. ${dataGp.comandosB.commands[i]}\n`;
    }
    await sasha.sendMessage(from, { text: listaComandos }, { quoted: info });
}
break

case 'blockcmdg':
if(!verifyDono) return await reply(responses.dono())
  if(query.includes('blockcmdg blockcmdg') || query.includes('blockcmdg  blockcmdg')) return await reply('Tá louco maluco? Não tem como adicionar o mesmo comando duas vezes.');
  if(configs.blockCmdG['commands'].includes(query)) return await reply('Este comando já está na lista de *comandos bloqueados global*.');
  configs.blockCmdG['commands'].push(query);
  await saveJson('./configs/configs.json', configs);
  await reply(`O comando *${query.trim()}* foi adicionado à lista de comandos bloqueados global.`);
break;

case 'unblockcmdg':
if(!verifyDono) return await reply(responses.dono())
  if(query.includes('unblockcmdg unblockcmdg') || query.includes('unblockcmdg  unblockcmdg')) return await reply('Tá louco maluco? Não tem como desbloquear o mesmo comando duas vezes.');
  if(!configs.blockCmdG['commands'].includes(query)) return await reply('Este comando não está na lista de *comandos bloqueados global*.');
  var comandos = configs.blockCmdG['commands'].indexOf(query);
  configs.blockCmdG['commands'].splice(comandos, 1);
  await saveJson('./configs/configs.json', configs);
  await reply(`O comando *${query.trim()}* foi removido da lista de comandos bloqueados global.`);
break;

case 'listbcmdglobal':
  if(configs.blockCmdG['commands'].length == 0) return await reply('Não existe nenhum *comando bloqueado* na lista.');
  var tkks = `[Total: *${configs.blockCmdG['commands'].length}*] ⤷ Lista de comandos bloqueados pelo(s) meus proprietários:\n–\n`;
  tkks += configs.blockCmdG['commands'].map((v, index) => `\t[ *N° ${index + 1}* ] ⤷ Comando: ${prefix + v}`).join('\n–\n');
  await sasha.sendMessage(from, { text: tkks.trim() }, { quoted: info });
break;

case 'avalie':
if(!query) return await reply(`Exemplo: ${prefix}avalie 'Bot muito bom, parabéns. '`)
if(string.length >= 400) return await reply('Máximo 400 caracteres')
sasha.sendMessage(nmrdn, {text: `[ Avaliação ]\nDe: wa.me/${sender.split('@s.whatsapp.net')[0]}\n: ${query.trim()}` }, {quoted: info })
await reply('mensagem enviada ao meu dono, obrigado pela avaliação, iremos melhorar a cada dia.')
break

case 'bug':
if(!query) return await reply(`Exemplo: ${prefix}bug 'ocorreu um erro no comando sticker'`)
if(string.length >= 800) return await reply('Máximo 800 caracteres')
await sasha.sendMessage(nmrdn, {text: `[ Problema ]\n⤷ De: *wa.me/${sender.split('@s.whatsapp.net')[0]}*\n⤷ Erro ou bug: *${query.trim()}*` }, {quoted: info })
await reply('mensagem enviada ao meu dono, se enviar muitas mensagens repetida por zoueiras, você sera banido de utilizar os comandos do bot.')
break

case 'bugslist': case 'bugs':
    try {
    var mensagem = `Total de comandos com bugs ${bugs.bugs.length}\n`;
        if(bugs.bugs && bugs.bugs.length > 0) {
            for (var bugss = 0; bugss < bugs.bugs.length; bugss++) {
                const bug = bugs.bugs[bugss];
                const timestamp = new Date(bug.timestamp);
                const formattedDate = timestamp.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
             mensagem += `*${bugss + 1}°:* ⤷ *${bug.command}*\n⤷ Data: *${formattedDate}*\n⤷ Detalhes: *${bug.details}*\n—\n`;
            }
  await sasha.sendMessage(from, { text: mensagem }, { quoted: info });
        } else {
            await reply('Nenhum bug encontrado.');
        }
    } catch (error) {
        await reply(`Erro ao ler o arquivo de bugs: ${error}`);
    }
break;

case 'deletebug':
    try {
        if(!query) return await reply('Por favor, forneça o comando ou descrição do bug que deseja excluir.');
        const normalizedQuery = query.toLowerCase();
        if(normalizedQuery === 'todos') {
            if(bugs.bugs.length === 0) return await reply('Não há bugs para excluir.');
            const total = bugs.bugs.length;
            bugs.bugs = [];
            await saveJson('./configs/media/bugs.json', bugs);
            return await reply(`Todos os *${total}* bugs foram excluídos com sucesso.`);
        }
        const bugIndex = bugs.bugs.findIndex(bug => bug.command.toLowerCase() === normalizedQuery);
        if(bugIndex === -1) return await reply('Nenhum bug encontrado com esse comando.');
        const [bugToDelete] = bugs.bugs.splice(bugIndex, 1);
        await saveJson('./configs/media/bugs.json', bugs);
        await reply(`Bug excluído com sucesso!\nComando: *${bugToDelete.command}*\nDetalhes: *${bugToDelete.details}*`);
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'sugestão': case 'sugestao':
if(!query) return await reply(`Exemplo: ${prefix}sugestao 'Opa, crie um comando tal, que ele funcione de tal maneira, isso será muito bom, não só pra mim, mas pra vários fazer isso..'`)
if(string.length >= 800) return await reply('Máximo 800 caracteres');
await sasha.sendMessage(nmrdn, {text: `[ Sugestões ]\n⤷ De: *wa.me/${sender.split('@s.whatsapp.net')[0]}*\n⤷ Detalhes: *${query.trim()}*` }, {quoted: info })
await reply('mensagem enviada ao meu dono, obrigado pela sugestão, tentar ouvir o máximo possível de sugestões.')
break

/* ----- [ Começo das Cases | Apis Pesquisa ] ----- */
case 'tiktoksearch':
    if(!query) return await reply(`Hmm, você esqueceu de dizer o que procurar!`);
    try {
        var data = await fetchJson(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${query.trim()}`);
        if(!data.data || data.data.length === 0) return await reply('Nenhum resultado encontrado.');
        await reply(responses.waitSearch(query));
        var resultado = pickRandom(data.data);
        const date = new Date(resultado.create_time * 1000);
        const formattedDate = date.toUTCString();
        await sasha.sendMessage(from, { video: { url: resultado.nowm }, caption: `Sasha Pesquisa! *@${resultado.author}*\n⤷ Título: *${resultado.title?.trim() || 'Sem título'}*\n⤷ Url: *${resultado.url || 'Sem link'}*\n—\n> *Informações sobre o vídeo:*\n⤷ Views: *${formatNumber(resultado.views) || 0}*\n⤷ Quantas pessoas gostou? ⤷ *${formatNumber(resultado.likes) || 0}*\n⤷ Quantas pessoas comentou? ⤷ *${formatNumber(resultado.comments) || 0}*\n⤷ Compartilhamentos: *${formatNumber(resultado.share) || 0}*\n⤷ Quantas pessoas baixou? ⤷ *${formatNumber(resultado.download) || 0}*\n⤷ Data de Publicação: *${formattedDate}*`, mimetype: 'video/mp4' });
        if(resultado.music) { 
        await replyMessage('E claro, não poderia faltar a música!');
        await sasha.sendMessage(from, { audio: { url: resultado.music }, mimetype: 'audio/mpeg' });
        }
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'transcrever': {
    if ((verifyMedia && !info.message.imageMessage && info.message.videoMessage) || QuotedMessage.Clip || QuotedMessage.Soundbite) {
        reply('Recebi seu arquivo. Transcrevendo o áudio/vídeo, aguarde...');

        var muk = QuotedMessage.Clip 
            ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.videoMessage 
            : QuotedMessage.Soundbite 
                ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.audioMessage 
                : info.message.audioMessage;

        var base64String = await getFileBuffer(muk, QuotedMessage.Soundbite ? 'audio' : 'video');
        var buffer = Buffer.from(base64String, 'base64');
      const FormData = require('form-data');
        var formData = new FormData();
        formData.append('file', buffer, {
            filename: QuotedMessage.Soundbite ? 'audiofile.mp3' : 'videofile.mp4',
            contentType: muk.mimetype
        });

        fetch(`https://api.bronxyshost.com.br/transcrever?apikey=Learsi_Gamer`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            reply(data.texto || data.msg);
        })
        .catch((err) => {
            reply('Não foi possível transcrever este arquivo. Tente outro áudio ou vídeo.');
        });

    } else {
        return await reply('Por favor, envie ou marque um áudio/vídeo para que eu possa transcrever.');
    }
}
break;

case 'yt-totext':
    if(!query.match(/https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https:\/\/(www\.)?youtu\.be\/[\w-]+|https:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/))
        return await reply('Amore, esse link aí tá meio torto... me manda um certinho do YouTube, tá?');
    var { key } = await sasha.sendMessage(from, { text: 'Já tô no corre aqui com a IA pra te entregar tudinho o que foi falado nesse vídeo!' }, { quoted: info });
    try {
        var data = await fetchJson(`https://apizell.web.id/tools/transkripyoutube?url=${query.trim()}`);
        await sasha.sendMessage(from, { text: data.transcript, edit: key });
    } catch (error) {
        await sasha.sendMessage(from, { text: 'Ai ai... a IA empacou. Relaxa que isso passa, tenta de novo daqui a pouco!', edit: key });
    }
break;

case 'igstalker':
  if(!query) return await reply('Por favor, me envie um nome de usuário do Instagram!');
  await reply('🔍 Buscando usuário no Instagram, segura aí!');

  try {
    const data = await fetchJson(`https://api.vreden.my.id/api/v1/search/instagram/users?query=${encodeURIComponent(query.trim())}`);
    if(!data.result || !data.result.search_data || data.result.search_data.length === 0) 
      return await reply('Não encontrei nenhum usuário com esse nome.');
      
      var user = data.result.search_data[0];
      
      await sasha.sendMessage(from, { image: { url: user.profile_pic_url }, caption: `❏ *Instagram Stalker*\n—\n⤷ *Nome completo:* ${user.full_name || 'Não disponível'}\n⤷ *Usuário:* ${user.username}\n⤷ *Privado:* ${user.is_private ? 'Sim 🔒' : 'Não 🔓'}\n⤷ *Verificado:* ${user.is_verified ? 'Sim ✅' : 'Não ❌'}\n⤷ *Último Reel:* ${user.latest_reel_media ? new Date(user.latest_reel_media * 1000).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Não disponível' || '.'}\n⤷ *Contagem de mensagens não lidas:* ${user.unseen_count || 0}` }, { quoted: info });

  } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'tiktokstalker':
    if(!query) return await reply(`Parece que você esqueceu de informar o @ do usuário que deseja procurar. Por favor, forneça o nome de usuário!`);
    try {
        var data = await fetchJson(`https://restapi-v2.simplebot.my.id/stalk/tiktok?user=${query.trim()}`);
        var user = data.result
         if(!user) return await reply(`Não encontramos informações para o usuário *"@${query}"*. Tente novamente com um nome de usuário válido!`);
         await reply(responses.waitSearch(query));
   await sasha.sendMessage(from, { image: { url: user.avatarLarger }, caption: `⤷ *Sasha Stalker!* @${user.uniqueId}\n⤷ *Nome*: ${user.nickname}\n⤷ *Biografia*: ${user.signature || 'Nenhuma'}\n⤷ *@${user.uniqueId} é verificado?*: ${user.verified ? 'Sim' : 'Não'}\n⤷ *Conta criada em*: ${formatarTime(user.createTime)}\n—\n⤷ *Região*: ${user.region || 'Desconhecida'}\n⤷ *Idioma*: ${user.language || 'Desconhecido'}\n⤷ *Conta privada*: ${user.privateAccount ? 'Sim' : 'Não'}\n⤷ *Conta secreta*: ${user.secret ? 'Sim' : 'Não'}\n⤷ *É organização*: ${user.isOrganization ? 'Sim' : 'Não'}\n⤷ *Conta de comércio*: ${user.commerceUserInfo?.commerceUser ? 'Sim' : 'Não'}\n⤷ *É vendedor (ttSeller)*: ${user.ttSeller ? 'Sim' : 'Não'}\n⤷ *É anúncio virtual*: ${user.isADVirtual ? 'Sim' : 'Não'}\n—\n⤷ *Permite favoritos*: ${user.openFavorite ? 'Sim' : 'Não'}\n⤷ *Permite comentários*: ${user.commentSetting === 0 ? 'Ninguém' : user.commentSetting === 1 ? 'Amigos' : 'Todos'}\n⤷ *Permite duetos*: ${user.duetSetting === 0 ? 'Não' : 'Sim'}\n⤷ *Permite stitch*: ${user.stitchSetting === 0 ? 'Não' : 'Sim'}\n⤷ *Permite download*: ${user.downloadSetting === 0 ? 'Não' : 'Sim'}\n—\n⤷ *Aba de música visível*: ${user.profileTab?.showMusicTab ? 'Sim' : 'Não'}\n⤷ *Aba de perguntas visível*: ${user.profileTab?.showQuestionTab ? 'Sim' : 'Não'}\n⤷ *Aba de playlists visível*: ${user.profileTab?.showPlayListTab ? 'Sim' : 'Não'}\n—\n⤷ *Visibilidade dos seguindo*: ${user.followingVisibility === 0 ? 'Público' : user.followingVisibility === 1 ? 'Amigos' : 'Privado'}\n⤷ *Permite incorporar perfil*: ${user.profileEmbedPermission === 1 ? 'Sim' : 'Não'}\n⤷ *Está banido de incorporar*: ${user.isEmbedBanned ? 'Sim' : 'Não'}\n⤷ *Pode exibir playlists*: ${user.canExpPlaylist ? 'Sim' : 'Não'}\n—\n⤷ *Likes (corações)*: ${formatNumber(user.heart)}\n⤷ *Seguidores*: ${formatNumber(user.followerCount)}\n⤷ *Seguindo*: ${formatNumber(user.followingCount)}\n—\n⤷ *Última modificação do nickname*: ${formatarTime(user.nickNameModifyTime)}\n⤷ *Última modificação do ID único*: ${user.uniqueIdModifyTime === 0 ? 'Nunca' : formatarTime(user.uniqueIdModifyTime)}\n—\n⤷ *Motivo da recomendação*: ${user.recommendReason || 'Nenhum'}\n⤷ *Convite Now*: ${user.nowInvitationCardUrl || 'Nenhum'}\n⤷ *Eventos*: ${user.eventList?.length ? user.eventList.length + ' evento(s)' : 'Nenhum'}\n⤷ *Sugestão de vincular conta*: ${user.suggestAccountBind ? 'Sim' : 'Não'}`, mimetype: 'image/jpeg' }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'ytstalker':
    if(!query) return await reply('Eita! Cadê o @ do canal que você quer dar aquele stalk? Me manda aí!');
    try {
        var data = await fetchJson(`https://api.siputzx.my.id/api/stalk/youtube?username=${query.trim()}`);
        if(!data.data || data.data.length === 0) return await reply(`Ihh, não encontrei nada do canal @${query}. Será que ele está escondido?`);
        await reply(responses.waitSearch(query));
        var videoText = '> Últimos vídeos\n—\n';
        for (const v of data.data.latest_videos) {
            videoText += `⤷ *Título:* ${v.title}\n⤷ *Publicado*: ${v.publishedTime}\n⤷ *Visualizações:* ${v.viewCount}\n⤷ *Duração:* ${v.duration}\n⤷ *URL do vídeo:* ${v.videoUrl}\n—\n`;
        }
        await sasha.sendMessage(from, {image: { url: data.data.channel.avatarUrl }, caption: `⤷ *Sasha Stalker!* ${data.data.channel.username}\n⤷ *Biografia:* ${data.data.channel.description}\n⤷ *Inscritos:* ${data.data.channel.subscriberCount}\n⤷ *Vídeos:* ${data.data.channel.videoCount}\n—\n${videoText}`, mimetype: 'image/jpeg' }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'twitterstalker':
    if(!query) return await reply(`Hmm, você esqueceu de dizer o @ da pessoa que você quer procurar!`);
    try {
       var data = await fetchJson(`https://api.siputzx.my.id/api/stalk/twitter?user=${query.trim()}`);
       if(!data.data || data.data.length === 0) return await reply(`Não encontramos informações para o usuário *"@${query}"*. Tente novamente com um nome de usuário válido!`);
       await reply(responses.waitSearch(query));
       await sasha.sendMessage(from, { image: { url: data.data.profile.image }, caption: `Sasha Stalker! *${data.data.username}*\n⤷ Nome: *@${data.data.name}*\n⤷ *@${data.data.username} é verificado?*: ${data.data.verified ? 'Sim' : 'Não'}\n⤷ Biografia: *${data.data.description}*\n⤷ Conta criada em: *${data.data.created_at}*\n⤷ Tweets: #*${formatNumber(data.data.stats.tweets) || 0}*\n⤷ Seguidores: *${data.data.stats.followers}*\n⤷ Seguindo: *${formatNumber(data.data.stats.following)}*\n⤷ Gosteis: *${formatNumber(data.data.stats.likes)}*\n⤷ Médias: *${formatNumber(data.data.stats.media)}*`, mimetype: 'image/jpeg' }, { quoted: info });
       if(data.data.profile.banner) {
       await sasha.sendMessage(from, { image: { url: data.data.profile.banner }});
       } 
   } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
break
  
case 'grupos':
    try {
        var data = await fetchJson(`${WebSite}/pesquisa/gerar-grupos?apikey=${ApiKeySasha}`);
        var groupTable = data.resultado.map((v, index) => {
            rulesGroup = v.rules.map((rule, index) => `\t${index + 1}. ${rule}`).join('\n');
            return `*${index + 1}.* ⤷ Nome: ${v.name}\n⤷ Categoria: ${v.category}\n⤷ Acessos: ${v.accessCount}\n⤷ Regras:\n${rulesGroup}\n⤷ URL: ${v.groupUrl}`;
        }).join('\n–\n');
        await sasha.sendMessage(from, { image: { url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcexCXk1jkQQhgno5_sj_rv0JVcdXr2Fw33A&usqp=CAU` }, caption: 'Aqui está a lista de grupos que encontrei para você. Dê uma olhada nas opções abaixo:\n–\n' + groupTable }, { quoted: info });
    } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'gimage':
    if(!query) return await reply(`Hmm, você esqueceu de dizer o que procurar! Exemplo: *${prefix + command} Fogo*`)
    try {
        const resultado = await fetchJson(`${WebSite}/pesquisa/googleimage?query=${query.trim()}&apikey=${ApiKeySasha}`);
        await reply(responses.waitSearch(query));
        var data = pickRandom(resultado.resultado);
        await sasha.sendMessage(from, { image: { url: data.url }, caption: `⤷ Título: *${data.origin.title || 'Não existe título na imagem.'}*\n⤷ URL: *${data.origin.website.url || 'Sem URL.'}* \n⤷ Fonte: *${data.origin.website.name || 'Sem informação.'} _(${data.origin.website.domain || 'Sem informação.'})_*\n⤷ Resolução: *${data.height || '0'} × ${data.width || '0'}*` }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'pinterest':
if(!query) return await reply(`Hmm, você esqueceu de dizer o que procurar! Exemplo: *${prefix + command} Tinasha*`)
    try {
        const resultado = await fetchJson(`${WebSite}/pesquisa/pinterest?apikey=${ApiKeySasha}&query=${query.trim()}`);
        await reply(responses.waitSearch(query));
        var data = pickRandom(resultado.resultado);
        await sasha.sendMessage(from, { image: { url: data.image }, caption: `Sasha Pesquisa! *${data.fullname || 'Não existe título na imagem.'} (@${data.by})*\n⤷ Legenda: ${data.caption || 'Sem informação.'}\n⤷ URL: *${data.source || 'Sem URL.'}* \n⤷ Fonte: *Pinterest*` }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'gerarlink': case 'upload':
try {
    if((verifyMedia && !info.message.videoMessage || QuotedMessage.Picture)) {  
        await reagir(from, '😸'); // Reação para indicar que a solicitação está em andamento
        var midia = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage;
        var bufferMidia = await getFileBuffer(midia, 'image');
        var resultado = await uploader.catbox(bufferMidia);
        await reply(`Mídia convertida para URL com sucesso! Aqui está ⤷ *${resultado || 'Ehhh Url Broxou 😐'}*`);
    } else if((verifyMedia && info.message.videoMessage.seconds < 30 || QuotedMessage.Clip && info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 60)) {
        await reagir(from, '😸'); // Reação para indicar que a solicitação está em andamento
        var midia = QuotedMessage.Clip ? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.videoMessage  : info.message.videoMessage;
        var bufferMidia = await getFileBuffer(midia, 'video');
        var resultado = await uploader.catbox(bufferMidia);
        await reply(`Mídia convertida para URL com sucesso! Aqui está ⤷ *${resultado || 'Ehhh Url Broxou 😐'}*`);
    } else  if((verifyMedia && info.message.audioMessage.seconds < 30 || QuotedMessage.Soundbite && info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage.seconds < 60)) {
        await reagir(from, '😸'); // Reação para indicar que a solicitação está em andamento
        var midia = QuotedMessage.Soundbite ? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.audioMessage : info.message.audioMessage;
        var bufferMidia = await getFileBuffer(midia, 'audio');
        var resultado = await uploader.catbox(bufferMidia);
        await reply(`Mídia convertida para URL com sucesso! Aqui está ⤷ *${resultado || 'Ehhh Url Broxou 😐'}*`);
    } else {
    await reply(`Envie ou responda uma *imagem*, *audio* ou um *vídeo* com o comando *${prefix + command}* para converter a mídia em um link direto!`);
    }
} catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
break;

case 'ytsearch': case 'pesquisa-ytb':
    if(!query) return await reply('Parece que você esqueceu de adicionar algum texto após o comando. Por favor, forneça uma palavra-chave para a pesquisa.');
    await reply('Estamos procurando os melhores resultados no YouTube para você...');
    try {
        var data = await fetchJson(`${WebSite}/pesquisa/youtube?query=${query.trim()}&apikey=${ApiKeySasha}`);
        if(data.resultado.length === 0) return await reply('Não encontramos nenhum vídeo com esse título. Tente usar palavras-chave diferentes ou revise a ortografia.');
        var resultado = data.resultado.map((v, index) => {
            return `*${index + 1}.* ⤷ Título: *${v.title || 'Não encontrado'}*\n⤷ Descrição: *${v.description || 'Não encontrado'}*\n⤷ Duração: *${v.duration.timestamp || 'Não encontrado'}*\n⤷ Link: *${v.url || 'Não encontrado'}*`;
        }).join('\n–\n');
        await reply(`🔍 *Pesquisa no YouTube*:\n–\n${resultado}`);
    } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

/* ----- [ Começo das Cases | Downloads ] ----- */

case 'play': case 'p': case 'playaudio': case 'play_audio': case 'playmp3': case 'ytmp3':
    if (!query) return await reply('Por favor, insira o título de uma música ou vídeo.');

    await reply(responses.waitSearch(query));

    try {
        const raw = await yt.get(query, 'mp3');
        const result = Array.isArray(raw) ? raw[0] : raw;

        if (!result) return await reply('Não encontramos nenhum resultado com esse título.');

        await sasha.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: 𝗦𝗽𝗼𝘁𝗶𝗳𝘆 / 𝗬𝗼𝘂𝗧𝘂𝗯𝗲
⤷ Título: *${result.title}*
⤷ Descrição: *${result.description || 'Sem descrição disponível.'}*
⤷ Perfil: *${result.author?.name || 'Desconhecido'} (${result.author?.url || 'N/A'})*
⤷ Url Do Vídeo: *${result.url || 'N/A'}*
⤷ Duração: *${result.duration || 'N/A'} (${result.seconds || 0}s)*
⤷ Visualizações: *${(result.views || 0).toLocaleString()} views*
⤷ Público Há: *${result.ago || 'N/A'}*`
        }, { quoted: info });

        var waitMsg = await sasha.sendMessage(from, { text: 'Procurando sua música seu otário' }, { quoted: info });

        const frases = [
            'Calma aí, seu otário, tô extraindo a música',
            'Segura a emoção, gayzinho, quase pronto',
            'Já já sai, segura firme aí, que eu tô enfiando',
            'Quase lá, seu bosta, segura a ansiedade',
        ];

        for (var i = 0; i < frases.length; i++) {
            await new Promise(r => setTimeout(r, 2000));
            await sasha.sendMessage(from, { text: frases[i], edit: waitMsg.key });
        }
        
            await sasha.sendMessage(from, { audio: { url: `https://zero-two-apis.com.br/api/dl/ytaudio?url=${result.url}&apikey=Space` }, mimetype: 'audio/mpeg' }, { quoted: info });
            await sasha.sendMessage(from, { text: 'Aí tá sua música, seu gayzinho 🎶😂' }, { quoted: info });

    } catch (error) {
        console.error(error);
        if (typeof logBug === 'function') logBug(error.message || String(error), command);
    }
break;

case 'spotify': case 'spotifysearch':
    if(!query) return await reply('Por favor, insira o título de uma música.');
    try {
        var data = await fetchJson(`${WebSite}/pesquisa/spotify?apikey=${ApiKeySasha}&query=${query.trim()}`);
         if(data.resultado[0].length === 0) return await reply('Não encontramos nenhum resultado com esse Título.');
        await reply(responses.waitSearch(query));
        await sasha.sendMessage(from, { 
  image: { url: data.resultado[0].album.images[0] }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: 𝗦𝗽𝗼𝘁𝗶𝗳𝘆\n—\n⤷ Título: *${data.resultado[0].name}*\n⤷ Artista: *${data.resultado[0].album.artists}*\n⤷ Álbum: *${data.resultado[0].album.name}*\n⤷ Url da música: *${data.resultado[0].url}*\n⤷ Postado em: *${data.resultado[0].album.releaseDate}*\n⤷ Duração: *${data.resultado[0].duration}*` }, { quoted: info });
        var dataAudio = await fetchJson(`https://api.vreden.my.id/api/v1/download/spotify?url=${data.resultado[0].url}`);
          if(dataAudio.result.download) {
          await replyMessage('Aguarde aí, tô procurando a música!');
          await sasha.sendMessage(from, { audio: { url: dataAudio.result.download }, mimetype: 'audio/mpeg' });
        } else {
          await reply('Não foi possível encontrar a música.');
        }
      } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'playvideo': case 'play_video': case 'playvid': case 'playmp4':
    if(!query) return await reply('Por favor, insira o título de um vídeo.');
    try {
       await reply(responses.waitSearch(query));
        var result = await yt.get(query, '720'); 
        if(result.length === 0) return await reply('Não encontramos nenhum resultado com esse Título.');
        
        await sasha.sendMessage(from, { video: { url: `https://api.bronxyshost.com.br/api-bronxys/play_video?nome_url=${result.url}&apikey=Learsi_Gamer` }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 / 𝗩𝗶́𝗱𝗲𝗼\n—\n⤷ Título: *${result.title}*\n⤷ Descrição: *${result.description || 'Sem descrição disponível.'}*\n⤷ Perfil: *${result.author.name} (${result.author.url})*\n⤷ Url Do Vídeo: *${result.url}*\n⤷ Duração: *${result.duration} (${result.seconds}s)*\n⤷ Visualizações: *${result.views.toLocaleString()} views*\n⤷ Público Há: *${result.ago}*` });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'shorts': case 'ytmp4': case 'mp4yt':
  if(!query.match(/https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https:\/\/(www\.)?youtu\.be\/[\w-]+|https:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/)) return await reply('Por favor, insira o URL de um vídeo do YouTube.');
    try {
        await reply(`Buscando informações do vídeo. Aguarde um momento...`);
        await sasha.sendMessage(from, { video: { url: `https://api.bronxyshost.com.br/api-bronxys/play_video?nome_url=${query}&apikey=Learsi_Gamer` }, caption: '#SashaBot - Download YouTube' });
    } catch (error) { 
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'mp4':
if(!query) return await reply('Por favor, insira o URL de um vídeo.');
try {
await sasha.sendMessage(from, { video: { url: query }, mimetype: 'video/mp4' });
} catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break
 
case 'playdoc': case 'playdocumento': 
    if(!query) return await reply('Por favor, insira o título de um vídeo.');
         await reply(responses.waitSearch(query));
    try {
        var result = await yt.get(query, '1080'); 
        if(result.length === 0) return await reply('Não encontramos nenhum resultado com esse Título.');
        await sasha.sendMessage(from, { document: { url: `https://api.bronxyshost.com.br/api-bronxys/play_video?nome_url=${result.url}&apikey=Learsi_Gamer` }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 / 𝗩𝗶́𝗱𝗲𝗼\n—\n⤷ Título: *${result.title}*\n⤷ Descrição: *${result.description || 'Sem descrição disponível.'}*\n⤷ Perfil: *${result.author.name} (${result.author.url})*\n⤷ Url Do Vídeo: *${result.url}*\n⤷ Duração: *${result.duration} (${result.seconds}s)*\n⤷ Visualizações: *${result.views.toLocaleString()} views*\n⤷ Público Há: *${result.ago}*`, fileName: `${result.title}.mp4`, mimetype: 'video/mp4'});
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;
 
case 'spotifymp3':
    if(!query) return await reply('Parece que você esqueceu de adicionar algum url após o comando. Por favor, forneça um url download.');
    await reply(responses.wait());
    try { 
        var data = await fetchJson(`https://api.vreden.my.id/api/v1/download/spotify?url=${ApiKeySasha}&url=${query.trim()}`);
         if(data.result.length === 0) return await reply('Não encontramos nenhum resultado com esse Url.');
         const durationMs = data.result.duration_ms;
         const minutes = Math.floor(durationMs / 60000);
         const seconds = Math.floor((durationMs % 60000) / 1000);
         const durationFormatted = `${minutes}:${seconds.toString().padStart(2,'0')}`;
        await sasha.sendMessage(from, { image: { url: data.result.cover_url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: 𝗦𝗽𝗼𝘁𝗶𝗳𝘆\n—\n⤷ Título: *${data.result.title.trim() || 'Sem título'}*\n⤷ Artista: *${data.result.artists}*\n⤷ Álbum: *${data.result.album}*\n⤷ Duração: *${durationFormatted} Minutos*\n⤷ Lançamento: *${data.result.release_date}*` }, { quoted: info });
        if(data.result.download) { 
        await sasha.sendMessage(from, { audio: { url: data.result.download }, mimetype: 'audio/mpeg' });
        } else {
        await reply('Que peninha! 😿 parece que não tem donwload (music) disponível para esse Url');
        }
    } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, platform);
    }
break;

case 'pintemp4': case 'pinterestmp4':
    if(!query) return await reply('Parece que você esqueceu de adicionar algum url após o comando. Por favor, forneça um url download.');
    try { 
        var data = await fetchJson(`${WebSite}/download/pinterest-download?apikey=${ApiKeySasha}&url=${query.trim()}`);
        if(data.resultado.length === 0) return await reply('Não encontramos nenhum resultado com esse Url.');
        await reply(responses.wait());
     if(data.resultado.dl_link) {
     const hashtags = (data.resultado.keyword && data.resultado.keyword.length > 0)  ? data.resultado.keyword.map(keyword => `#${keyword}`).join('\n')  : 'Sem hashtags disponíveis';
        await sasha.sendMessage(from, { video: { url: data.resultado.dl_link }, caption: `Sasha Download! ⤷ *${data.resultado.author.name} (${data.resultado.author.username})*\n⤷ Título: *${data.resultado.title.trim() || 'Sem título'}*\n⤷ Url do post: *${data.resultado.source || 'Sem link'}*\n⤷ Url do autor: *${data.resultado.author.url}*\n⤷ Data de Publicação: *${data.resultado.upload}*\n⤷ Hashtags:\n${hashtags}`, mimetype: 'video/mp4' });
        } else {
        await reply('Que peninha! 😿 parece que não tem donwload (mp4) disponível para esse Url');
        }
    } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'tiktok': case 'ttk': case 'tiktokvideo': case 'tiktok_video':
  try {
    if(!/^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\//.test(query)) {
      return await reply(`Adicione um link válido do tiktok 😿`);
    }    
    await reply(responses.wait());
    var data = await fetchJson(`${WebSite}/download/tiktok?apikey=${ApiKeySasha}&url=${query}`); 
    var { resultado } = data;
    var temVideo = resultado?.video?.playAddr?.[0];
    var temImagens = Array.isArray(resultado?.images) && resultado.images.length > 0;
    var temMusica = resultado?.music?.playUrl?.[0];
    if(!temVideo && !temImagens) {
      return await TikTokV3(query);
    }
    var sendVideo = async () => {
      await sasha.sendMessage(from, { video: { url: resultado.video.playAddr[0] }, mimetype: 'video/mp4', caption: `*Sasha Download!*\n—\n⤷ Vídeo de *${resultado.author.nickname} (@${resultado.author.username})*\n⤷ Título: *${resultado.description.trim()}*\n⤷ URL do Autor: *https://www.tiktok.com/@${resultado.author.nickname}*\n—\n> *Informações ~ Video:*\n⤷ Curtidas: *${formatNumber(resultado.statistics.diggCount)}*\n⤷ Comentários: *${formatNumber(resultado.statistics.commentCount)}*\n⤷ Compartilhamentos: *${formatNumber(resultado.statistics.shareCount)}*\n⤷ Visualizações: *${formatNumber(resultado.statistics.playCount)}*\n⤷ Data de Upload: *${new Date(resultado.createTime * 1000).toLocaleString()}*\n⤷ Região: *${resultado.author.region || 'Não disponível'}*\n⤷ ID do Vídeo: *${resultado.id}*\n—\n> *Informações ~ Music:*\n⤷ Título: *${resultado.music.title}*\n⤷ Autor: *${resultado.music.author}*\n⤷ Album: *${resultado.music.album || 'Sem Informações'}*\n⤷ Música Comercial? *${resultado.music.isCommerceMusic ? 'Sim' : 'Nah'}*\n⤷ Música Original? *${resultado.music.isOriginalSound ? 'Sim' : 'Nah'}*\n⤷ Original do Artista? *${resultado.music.isAuthorArtist ? 'Sim' : 'Nah'}*` }, { quoted: info });
    };
    var sendImages = async () => {
      for (var [index, imageUrl] of resultado.images.entries()) {
        await sasha.sendMessage(from, { image: { url: imageUrl }, caption: `Imagem *${index + 1}* de *${resultado.author.nickname} (@${resultado.author.username})*` }, { quoted: info });
      }
      return await reply('Imagens enviadas com sucesso!');
    };
    if(temVideo) {
      await sendVideo();
    }
    if(temImagens) {
      await sendImages();
    }
    if(temMusica) {
      await replyMessage('E claro, não poderia faltar a música!');
      await sasha.sendMessage(from, { audio: { url: resultado.music.playUrl[0] }, mimetype: 'audio/mpeg' });
    } else {
      await reply('Não foi possível encontrar a música.');
    }
  } catch (error) {
    await TikTokV3(query);
  }
break;


case 'tiktokv2': case 'ttv2':
    if(!/^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\//.test(query)) {
        return await reply('Ei, você me deu algo errado! 😅 Passe um link válido do TikTok!');
    }
    await reply('Aguenta aí, estou buscando o conteúdo para você!');

    try {
        const data = await fetchJson(`https://api.vreden.my.id/api/v1/download/tiktok?url=${encodeURIComponent(query.trim())}`);

        if(!data.result || !data.result.data || data.result.data.length === 0) 
            return await replyMessage('Não foi possível encontrar mídia nesse link.');

        for(const media of data.result.data) {
            if(media.type.includes('nowatermark') || media.type === 'video') {
                await sasha.sendMessage(from, { 
                    video: { url: media.url }, 
                    caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *TikTok*\n—\n⤷ Título: *${data.result.title}*\n⤷ Autor: *${data.result.author.nickname}* (*${data.result.author.fullname}*)\n⤷ Postado em: *${data.result.taken_at}*\n⤷ Região: *${data.result.region}*`, 
                    mimetype: 'video/mp4' 
                }, { quoted: info });
            }
            if(media.type === 'photo') {
                await sasha.sendMessage(from, { 
                    image: { url: media.url }, 
                    caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *TikTok*\n—\n⤷ Título: *${data.result.title}*\n⤷ Autor: *${data.result.author.nickname}* (*${data.result.author.fullname}*)\n⤷ Postado em: *${data.result.taken_at}*\n⤷ Região: *${data.result.region}*`
                }, { quoted: info });
            }
        }

        if(data.result.music_info && data.result.music_info.url) {
            await replyMessage('Segura aí, encaminhando a música pra você!');
            await sasha.sendMessage(from, { 
                audio: { url: data.result.music_info.url }, 
                mimetype: 'audio/mpeg', 
                fileName: `${data.result.music_info.title}.mp3` 
            }, { quoted: info });
        }

    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, platform);
    }
break;

case 'tiktokmp4':
  try {
    if (!/^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\//.test(query)) {
      return await reply('Adicione um link válido do TikTok 😿');
    }

    await reply(responses.wait());

    var data = await fetchJson(`${WebSite}/download/tiktok/v2?apikey=${ApiKeySasha}&url=${query}`);

    const videoUrl = data.resultado?.video;
    const temImagens = Array.isArray(data.resultado?.images) && data.resultado.images.length > 0;

    const getBuffer = async (url) => {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(res.data, 'binary');
    };

    const sendVideo = async () => {
      const buffer = await getBuffer(videoUrl);
      await sasha.sendMessage(
        from,
        {
          video: buffer,
          caption: `*Sasha Download!*\n—\n⤷ Vídeo de *${data.resultado.author.nickname}* (https://www.tiktok.com/${data.resultado.author.nickname})\n⤷ Legenda: *${data.resultado.desc.trim() || '#Sem Legenda'}*\n—\n#SashaBot - Melhor bot do WhatsApp`
        },
        { quoted: info }
      );
    };

    const sendImages = async () => {
      for (var [index, imageUrl] of data.resultado.images.entries()) {
        const buffer = await getBuffer(imageUrl);
        await sasha.sendMessage(
          from,
          {
            image: buffer,
            caption: `Imagem *${index + 1} de ${data.resultado.images.length}*\n—\n#SashaBot - Melhor bot do WhatsApp`
          },
          { quoted: info }
        );
      }
      await reply('Imagens enviadas com sucesso!');
    };

    if (videoUrl) await sendVideo();
    if (temImagens) await sendImages();

  } catch (error) {
    if (typeof logBug === 'function') logBug(error.message, command);
  }
  break;
  
case 'tiktokmp3':
  try {
    if(!/^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\//.test(query)) {
      return await reply('Por favor, adicione um link válido do TikTok 😿');
    }
    var data = await fetchJson(`${WebSite}/download/tiktok?apikey=${ApiKeySasha}&url=${query.trim()}`);
    if(data.resultado.music && data.resultado.music.playUrl && data.resultado.music.playUrl[0]) {
      await reply('Realizando a busca da sua música!');
      await sasha.sendMessage(from, { audio: { url: data.resultado.music.playUrl[0] }, mimetype: 'audio/mpeg', fileName: `${data.resultado.music.title}.mp3` });
    } else {
      await reply('Não foi possível encontrar a música.');
    }
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;
  
case 'facemp4': case 'facebookmp4': case 'facebook':
    try {
        if(!query.match(/facebook\.com|fb\.watch/)) {
            return await reply(`Exemplo: ${prefix + command} o link do Facebook`);
        }
        await reply(responses.wait());
        var data = await fetchJson(`${WebSite}/download/facebook?apikey=${ApiKeySasha}&url=${query.trim()}`);
        if(!data?.resultado?.resultado) {
            return await reply('Erro: Resposta da API inválida.');
        }
        const videoInfo = data.resultado.resultado;
        var videoUrl = videoInfo.dl_link?.HD || videoInfo.dl_link?.SD;
        if(!videoUrl) {
            return await reply('Erro: Não foi possível obter o link do vídeo.');
        }
        await sasha.sendMessage(from, { video: { url: videoUrl.replace(/\\/g, '').replace(/&amp;/g, '&') }, mimetype: 'video/mp4', caption: `*Sasha Download!*\n—\n⤷ Título: *${videoInfo.title}*\n⤷ Duração: *${videoInfo.duration}*\n⤷ URL do vídeo: *${videoInfo.url}*`}, { quoted: info });

    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
 break;

case 'facemp3': case 'facebookmp3':
  try {
    if(!query.match(/facebook\.com|fb\.watch/)) {
         return await reply(`Oi, oi! Para usar esse comando, me passe o link do vídeo do Facebook!`);
       }
    await reply('Aguarde um segundinho, vou buscar o áudio para você!');
    sasha.sendMessage(from, { audio: { url: `https://api.bronxyshost.com.br/api-bronxys/face_audio?apikey=Learsi_Gamer&url=${query.trim()}` }, mimetype: 'audio/mpeg' })
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'twittermp4': case 'twitter': case 'x':
  try {
     if(!query.match(/^https?:\/\/x\.com/)) {
      return await reply(`Ei, você me deu algo errado! 😅 Passe o link direto do Twitter!`);
    }
   await reply(responses.wait());
    var data = await fetchJson(`${WebSite}/download/twitter?apikey=${ApiKeySasha}&url=${query.trim()}`);
    if(data.resultado.media.length > 0) {
      const media = data.resultado.media[0];
      if(media.videos && media.videos[1] && media.videos[1].url) {
        sasha.sendMessage(from, { video: { url: media.videos[1].url }, mimetype: 'video/mp4', caption: `*Sasha Download!*\n—\n⤷ Video de *@${data.resultado.author.username || 'Sem Informações'}*\n⤷ Legenda: *${data.resultado.description.trim() || 'Sem Informações'}*\n⤷ Linguagem: *${data.resultado.languange || 'Sem Informações'}*\n⤷ Postado em: *${data.resultado.createdAt || 'Sem Informações'}*\n⤷ Comentários: *${formatNumber(data.resultado.statistics.replieCount) || 'Sem Informações'}*\n⤷ Pessoas que favoritou: *${formatNumber(data.resultado.statistics.favoriteCount) || 'Sem Informações'}*\n⤷ Views: *${formatNumber(data.resultado.statistics.viewCount) || 'Sem Informações'}*\n—\n> *Informações do @${data.resultado.author.username || 'Usuário(a)'}:*\n⤷ Url do Autor: *${data.resultado.author.url}*\n⤷ Bio: *${data.resultado.author.bio || 'Sem Informações'}*\n⤷ Verificado? *${data.resultado.author.verified ? 'Sim' : 'Nahh' || 'Sem Informações'}*\n⤷ Localização: *${data.resultado.author.location || 'Sem Informações'}*\n⤷ Seguidores: *${formatNumber(data.resultado.author.statistics.followersCount) || 'Sem Informações'}*\n⤷ Amigos: *${formatNumber(data.resultado.author.statistics.friendsCount) || 'Sem Informações'}*` }, { quoted: info });
      } else if(media.image) {
        sasha.sendMessage(from, { image: { url: media.image }, caption: `*Sasha Download!*\n—\n⤷ Image de *@${data.resultado.author.username || 'Sem Informações'}*\n⤷ Legenda: *${data.resultado.description.trim() || 'Sem Informações'}*\n⤷ Linguagem: *${data.resultado.languange || 'Sem Informações'}*\n⤷ Postado em: *${data.resultado.createdAt || 'Sem Informações'}*\n⤷ Comentários: *${formatNumber(data.resultado.statistics.replieCount) || 'Sem Informações'}*\n⤷ Pessoas que favoritou: *${formatNumber(data.resultado.statistics.favoriteCount) || 'Sem Informações'}*\n⤷ Views: *${formatNumber(data.resultado.statistics.viewCount) || 'Sem Informações'}*\n—\n> *Informações do @${data.resultado.author.username || 'Usuário(a)'}:*\n⤷ Url do Autor: *${data.resultado.author.url}*\n⤷ Bio: *${data.resultado.author.bio || 'Sem Informações'}*\n⤷ Verificado? *${data.resultado.author.verified ? 'Sim' : 'Nahh' || 'Sem Informações'}*\n⤷ Localização: *${data.resultado.author.location || 'Sem Informações'}*\n⤷ Seguidores: *${formatNumber(data.resultado.author.statistics.followersCount) || 'Sem Informações'}*\n⤷ Amigos: *${formatNumber(data.resultado.author.statistics.friendsCount) || 'Sem Informações'}*` }, { quoted: info });
      }
    } else {
      await reply('Parece que o conteúdo não está disponível no momento, tente mais tarde! 😓');
    }
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'twittermp3':
  try {
    if(!query.match(/^https?:\/\/x\.com/)) {
        return await reply(`Oi, oi! Para usar esse comando, me passe o link do vídeo do X!`);
        }
    await reply('Aguarde um segundinho, vou buscar o áudio para você!');
    sasha.sendMessage(from, { audio: { url: `https://api.bronxyshost.com.br/api-bronxys/twitter_audio?apikey=Learsi_Gamer&url=${query.trim()}` }, mimetype: 'audio/mpeg' })
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'instagram': case 'insta': case 'instamp4':
    if(!query.match(/^https?:\/\/(www\.)?instagram\.com\//)) {
      return await reply('Ei, você me deu algo errado! 😅 Passe um link válido do Instagram!');
    }
    await reply('Aguenta aí, estou buscando o conteúdo para você!');    
    try {
        const data = await fetchJson(`https://api.vreden.my.id/api/v1/download/instagram?url=${encodeURIComponent(query.trim())}`);
        if(!data.result || !data.result.data || data.result.data.length === 0) return await reply('Não foi possível encontrar mídia nesse link.');
        for(const media of data.result.data) if(media.type === 'video') await sasha.sendMessage(from, { video: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *Instagram*\n—\n⤷ Usuario: *${data.result.profile.username}* (*${data.result.profile.full_name}*)\n⤷ Legenda: *${data.result.caption.text || 'Sem legenda'}*\n⤷ Postado em: *${data.result.caption.created_at ? new Date(data.result.caption.created_at*1000).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Não disponível'}*\n⤷ Tipo de mídia: *${media.type}*\n⤷ Curtidas: *${formatNumber(data.result.statistics.like_count) || 0}*\n⤷ Comentarios: *${formatNumber(data.result.statistics.comment_count) || 0}*\n⤷ Plays: *${formatNumber(data.result.statistics.ig_play_count) || formatNumber(data.result.statistics.play_count) || 0}*\n⤷ Reposts: *${formatNumber(data.result.statistics.repost_count) || 0}*\n⤷ Salvamentos: *${data.result.statistics.save_count || 0}*\n⤷ Compartilhamentos: *${formatNumber(data.result.statistics.share_count) || 0}*\n⤷ Seguidores do usuario: *${formatNumber(data.result.statistics.user_follower_count) || 'Não disponível'}*\n⤷ Total de posts do usuario: *${formatNumber(data.result.statistics.user_media_count) || 'Não disponível'}*\n⤷ Visualizacoes gerais: *${data.result.statistics.view_count || 0}*`, mimetype: 'video/mp4' }, { quoted: info });
        for(const media of data.result.data) if(media.type === 'image') await sasha.sendMessage(from, { image: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *Instagram*\n—\n⤷ Usuario: *${data.result.profile.username}* (*${data.result.profile.full_name}*)\n⤷ Legenda: *${data.result.caption.text || 'Sem legenda'}*\n⤷ Postado em: *${data.result.caption.created_at ? new Date(data.result.caption.created_at*1000).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Não disponível'}*\n⤷ Tipo de mídia: *${media.type}*\n⤷ Curtidas: *${formatNumber(data.result.statistics.like_count) || 0}*\n⤷ Comentarios: *${formatNumber(data.result.statistics.comment_count) || 0}*\n⤷ Plays: *${formatNumber(data.result.statistics.ig_play_count) || formatNumber(data.result.statistics.play_count) || 0}*\n⤷ Reposts: *${formatNumber(data.result.statistics.repost_count) || 0}*\n⤷ Salvamentos: *${data.result.statistics.save_count || 0}*\n⤷ Compartilhamentos: *${formatNumber(data.result.statistics.share_count) || 0}*\n⤷ Seguidores do usuario: *${formatNumber(data.result.statistics.user_follower_count) || 'Não disponível'}*\n⤷ Total de posts do usuario: *${formatNumber(data.result.statistics.user_media_count) || 'Não disponível'}*\n⤷ Visualizacoes gerais: *${data.result.statistics.view_count || 0}*` }, { quoted: info });
        var dataAudio = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/instagram?apikey=Learsi_Gamer&url=${query.trim()}`);
        if(dataAudio.msg && dataAudio.msg[0] && dataAudio.msg[0].url) {
            await replyMessage('Aguarde um segundinho, vou buscar o áudio para você!');
            await sasha.sendMessage(from, { audio: { url: dataAudio.msg[0].url }, mimetype: 'audio/mpeg' });
        }
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, platform);
    }
break;

case 'instagramv2': case 'instav2':
    if(!query.match(/^https?:\/\/(www\.)?instagram\.com\//)) return await reply('Passe um link válido do Instagram!');
    await reply('Aguenta aí, estou buscando o conteúdo para você!');
    try {
        const data = await fetchJson(`https://api.vreden.my.id/api/v2/download/instagram?url=${encodeURIComponent(query.trim())}`);
        if(!data.result || !data.result.media || data.result.media.length === 0) return await reply('Não foi possível encontrar mídia nesse link.');
        for(const media of data.result.media) {
            if(media.type === 'video') await sasha.sendMessage(from, { video: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *Instagram*\n—\n⤷ Usuario: *${data.result.username}*\n⤷ Legenda: *${data.result.title || 'Sem legenda'}*\n⤷ Postado em: *${data.result.taken_at ? new Date(data.result.taken_at*1000).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Não disponível'}*\n⤷ Tipo de mídia: *${media.type}*\n⤷ Curtidas: *${formatNumber(data.result.like_count) || 0}*\n⤷ Comentarios: *${formatNumber(data.result.comment_count) || 0}*` }, { quoted: info });
            if(media.type === 'image') await sasha.sendMessage(from, { image: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *Instagram*\n—\n⤷ Usuario: *${data.result.username}*\n⤷ Legenda: *${data.result.title || 'Sem legenda'}*\n⤷ Postado em: *${data.result.taken_at ? new Date(data.result.taken_at*1000).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Não disponível'}*\n⤷ Tipo de mídia: *${media.type}*\n⤷ Curtidas: *${formatNumber(data.result.like_count) || 0}*\n⤷ Comentarios: *${formatNumber(data.result.comment_count) || 0}* ` }, { quoted: info });
          var dataAudio = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/instagram?apikey=Learsi_Gamer&url=${query.trim()}`);
        if(dataAudio.msg && dataAudio.msg[0] && dataAudio.msg[0].url) {
            await replyMessage('Aguarde um segundinho, vou buscar o áudio para você!');
            await sasha.sendMessage(from, { audio: { url: dataAudio.msg[0].url }, mimetype: 'audio/mpeg' });
        }
        }
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, platform);
    }
break;
  
case 'instamp3':
  try {
    if(!query.match(/^https?:\/\/(www\.)?instagram\.com\//)) {
        return await reply(`Oi, oi! Para usar esse comando, me passe o link do vídeo do Instagram!`);
    }
    var data = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/instagram?apikey=Learsi_Gamer&url=${query.trim()}`);
    await reply('Aguarde um segundinho, vou buscar o áudio para você!');
    await sasha.sendMessage(from, { audio: { url: data.msg[0].url }, mimetype: 'audio/mpeg' })
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'threads':
    if(!query.match(/^https?:\/\/(www\.)?threads\.com\//)) {
        return await reply('Ei, você me deu algo errado! Passe um Url válido do Threads!');
    }
    await reply(responses.wait());
    try {
        const data = await fetchJson(`https://api.vreden.my.id/api/v1/download/threads?url=${encodeURIComponent(query.trim())}`);
        if(!data.result || !data.result.media || data.result.media.length === 0) {
            return await reply('Não foi possível encontrar mídia nesse Url.');
        }
        for(const media of data.result.media) {
            if(media.type === 'video') {
                await sasha.sendMessage(from, { video: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: Threads\n⤷ Tipo de mídia: video` }, { quoted: info });
            } else if(media.type === 'image') {
                await sasha.sendMessage(from, { image: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: Threads\n⤷ Tipo de mídia: image` }, { quoted: info });
            }
        }
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, 'threads');
    }
break;

case 'bc': case 'bcgroup': case 'transmitir': case 'transmissão': {
    if(!verifyDono) return await reply(responses.dono());
    var groups = await sasha.groupFetchAllParticipating();
    var groupIds = Object.values(groups).map(group => group.id);
    var quotedMessage = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var quotedImage = QuotedMessage.Picture ? quotedMessage?.imageMessage : info.message?.imageMessage;
    var quotedVideo = QuotedMessage.Clip ? quotedMessage?.videoMessage : info.message?.videoMessage;
    var quotedText = QuotedMessage.Text ? quotedMessage?.textMessage : info.message?.textMessage;
    var quotedDocument = QuotedMessage.Document ? quotedMessage?.documentMessage : info.message?.documentMessage;
    var quotedDocumentWithCaption = QuotedMessage.DocPlus ? quotedMessage?.documentWithCaptionMessage?.message?.documentMessage : info.message?.documentWithCaptionMessage?.message?.documentMessage;
    var quotedAudio = QuotedMessage.Soundbite ? quotedMessage.audioMessage : '';
    var quotedSticker = QuotedMessage.EmojiArt ? quotedMessage.stickerMessage : '';
    var finalText = QuotedMessage.Text && !quotedAudio && !quotedSticker && !quotedImage && !quotedVideo && !quotedDocument && !quotedDocumentWithCaption ? 'Transmissão do Proprietário: ' + quotedMessage.conversation
        : info.message?.conversation;
    var finalText2 = QuotedMessage.PlainText && !quotedAudio && !quotedSticker && !finalText && !quotedImage && !quotedVideo && !quotedDocument && !quotedDocumentWithCaption ? 'Transmissão do Proprietário: ' + quotedMessage.extendedTextMessage?.text : info?.message?.extendedTextMessage?.text;
    if(quotedImage) {
        quotedImage.caption = query.length > 1 ? 'Transmissão do Proprietário: ' + query : quotedImage.caption.replace(new RegExp(prefix + command, 'gi'), `Transmissão do Proprietário: ${donoName}\n\n`);
        quotedImage.image = { url: quotedImage.url };
        await sendToGroups(groupIds, quotedImage);
    } else if(quotedVideo) {
        quotedVideo.caption = query.length > 1 ? 'Transmissão do Proprietário: ' + query : quotedVideo.caption.replace(new RegExp(prefix + command, 'gi'), `Transmissão do Proprietário: ${donoName}\n\n`);
        quotedVideo.video = { url: quotedVideo.url };
        await sendToGroups(groupIds, quotedVideo);
    } else if(quotedText) {
        var blackMessage = { text: quotedText.replace(new RegExp(prefix + command, 'gi'), `Transmissão do Proprietário: ${donoName}\n\n`) };
        await sendToGroups(groupIds, blackMessage);
    } else if(!quotedAudio && !quotedSticker && finalText2) {
        var brownMessage = { text: finalText2.replace(new RegExp(prefix + command, 'gi'), `Transmissão do Proprietário: ${donoName}\n\n`) };
        await sendToGroups(groupIds, brownMessage);
    } else if(quotedDocument) {
        quotedDocument.document = { url: quotedDocument.url };
        await sendToGroups(groupIds, quotedDocument);
    } else if(quotedDocumentWithCaption) {
        quotedDocumentWithCaption.caption = query.length > 1 ? 'Transmissão do Proprietário: ' + query : quotedDocumentWithCaption.caption.replace(new RegExp(prefix + command, 'gi'), `Transmissão do Proprietário: ${donoName}\n\n`);
        quotedDocumentWithCaption.document = { url: quotedDocumentWithCaption.url };
        await sendToGroups(groupIds, quotedDocumentWithCaption);
    } else if(quotedSticker) {
        quotedSticker.sticker = { url: quotedSticker.url };
        await sendToGroups(groupIds, quotedSticker);
    } else if(quotedAudio) {
        quotedAudio.audio = { url: quotedAudio.url };
        await sendToGroups(groupIds, quotedAudio);
    }
break;
}
async function sendToGroups(groupIds, message) {
    var filteredGroups = groupIds.filter(id => id !== '120363347315692575@g.us');
    
    for (var groupId of filteredGroups) {
        await sleep(1500);
        await sasha.sendMessage(groupId, message);
    }
}
break

case 'fazertm':
    if (!verifyDono) return await reply(responses.dono());
    if (!query) return await reply('Digite a mensagem que você deseja enviar nos grupos.');
    try {
        var groups = await sasha.groupFetchAllParticipating();
        var groupIds = Object.values(groups).map(group => group.id);
        var filteredGroups = groupIds.filter(id => id !== '120363347315692575@g.us');
        await reply(`Enviando sua mensagem para ${filteredGroups.length} grupos. Isso pode levar alguns segundos...`);
        for (var groupId of filteredGroups) {
            await sleep(1500);
            await sasha.sendMessage(groupId, { text: `*Comunicado Importante*\n–\n⤷ ${query}` });
        }
        await reply('Pronto! Sua mensagem foi enviada com sucesso para todos os grupos.');
    } catch (error) {
        await reply('Houve um problema ao enviar a transmissão. Tente novamente mais tarde.');
    }
break;

case 'valor-celular':
try {
    var data = await fetchJson(`${WebSite}/lojas/tudocelular-ofertas?apikey=${ApiKeySasha}&query=${query.trim()}`);
    await reply(responses.waitSearch(query));
    function adicionais() {
        return data.resultado.menoresPrecos.map(resultado => {
            return `⤷ Title: *${resultado.nome}*\n⤷ Preço: *${resultado.preco}*\n⤷ Url de compra: *${resultado.linkCompra}*`;
        }).join('\n—\n');
    }
    await sasha.sendMessage(from, { image: { url: data.resultado.imagemProduto }, caption: `Sasha Download!\n—\n*${data.resultado.subtituloCompra || 'Sem Informações'}*\n—\n⤷ Celular: *${data.resultado.nomeProduto || 'Sem Informações'}*\n⤷ Descrição do produto: *${data.resultado.descricaoProduto.trim() || 'Sem Informações'}*\n⤷ Url do celular: *${data.resultado.linkCelular || 'Sem Informações'}*\n—\n> *Menores ~ Preços:*\n${adicionais()}`}, { quoted: info });
} catch (error) {
  if(typeof logBug === 'function') logBug(error.message, command);
}
break;

case 'convite': case 'join': case 'entrar':
  if((command === 'join' || command === 'entrar') && !verifyDonoOficial) {
    return await reply(responses.dono());
  }
  if(!query) {
    return await reply('Por favor, insira um link de convite do grupo ao lado do comando.');
  }
  if(!query.includes('chat.whatsapp.com/') || query.includes('|')) {
    return await reply(`Ops, parece que o link está incorreto.\nUse: ${prefix} link do grupo`);
  }
  const grupoURL = query.split('chat.whatsapp.com/')[1];
  try {
    await sasha.groupAcceptInvite(grupoURL);
    await sleep(2000);
    return await reply('Convite aceito com sucesso!');
  } catch (error) {
    const errorMessage = String(error);
    if(errorMessage.includes('resource-limit')) {
      return await reply('Seu grupo atingiu o limite de convites que pode aceitar. Tente novamente mais tarde.');
    }
    if(errorMessage.includes('not-authorized')) {
      return await reply('Eu não tenho permissão para entrar neste grupo.');
    }
    return await reply('Ocorreu um erro ao tentar aceitar o convite. Tente novamente mais tarde.');
  }
break;
  
case 'antidocumento': case 'antidoc':
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.antidoc.status = !dataGp.antidoc.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.antidoc.status ? 'Ativou com sucesso o recurso de Anti Documento neste grupo' : 'Desativou com sucesso o recurso de Anti Documento neste grupo' }, { quoted: info })
break

case 'antictt': case 'anticontato':  
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.antictt.status = !dataGp.antictt.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.antictt.status ? 'Ativou com sucesso o recurso de Anti Contato neste grupo' : 'Desativou com sucesso o recurso de Anti Contato neste grupo' }, { quoted: info })
break
 
case 'x9': case 'antiloc': case 'antiaudio': case 'antivideo': case 'antifake': 
case 'antilink': case 'antilinkgp': case 'antisticker': case 'antiimg': {
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp[command].status = !dataGp[command].status
  await salvarConfigGrupo(dataGp)
  const commandName = command.replace(/([a-z])([A-Z])/g, '$1 $2');
  await sasha.sendMessage(from, { text: dataGp[command].status ? `Ativou com sucesso o recurso de ${commandName} neste grupo` : `Desativou com sucesso o recurso de ${commandName} neste grupo` }, { quoted: info })
}
break

case 'soadm':
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  dataGp.soadm.status = true
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.soadm.status ? 'Ativou com sucesso o recurso de só adm utilizar comandos neste grupo' : 'Desativou com sucesso o recurso de Só ADM utilizar comandos neste grupo' }, { quoted: info })
break

case 'prefixos':
if(!verifyGrupo) return await reply(responses.grupo())
if(dataGp.multiprefix.prefixos.length < 1) return await reply('Não contem nenhum prefixo a + adicionado neste grupo.')
var mensagem = `Lista de prefixos para uso do bot, no Grupo⤷ ${groupName}\n\n`
for ( i of dataGp.multiprefix.prefixos) {
mensagem += `⤷ Prefixos: ${i}\n\n`
}
await reply(mensagem)
break

case 'addprefix':
if(!verifyGrupo) return await reply(responses.grupo())
if(!membersSupreme) return await reply(responses.admin())
if(!verifyMultiP) return await reply(`Para usar este comando, você deve ativar o comando, multiprefix\nExemplo ⤷ ${prefix}multiprefixo`)
if(antiLetraEmoji(query)) return await reply('Não pode letra modificada, nem emoji..')
if(!query.trim()) return await reply('Determine o novo prefixo, não pode espaço vazio...')
if(query.trim() > 1) return await reply(`Calma, o prefixo só pode ser um\nExemplo ⤷ ${prefix+command} _\nAe o bot vai passar á responder _ como prefixo do bot..`)
if(dataGp.multiprefix.prefixos.indexOf(query.trim()) >= 0) return await reply(`Esse prefixo já se encontra incluso, procure ver na lista dos prefixos\nExemplo: ${prefix}prefixos`)
dataGp.multiprefix.prefixos.push(query.trim())
await salvarConfigGrupo(dataGp)
await reply(`Prefixo ${query.trim()} Adicionado com sucesso na lista de prefixos para uso do bot, neste grupo...`)
break

case 'tirar_prefixo': case 'rm_prefixo':
if(!verifyGrupo) return await reply(responses.grupo())
if(!membersSupreme) return await reply(responses.admin())
if(!verifyMultiP) return await reply(`Para usar este comando, você deve ativar o comando, multiprefix\nExemplo: ${prefix}multiprefixo 1`)  
if(antiLetraEmoji(query)) return await reply('Não pode letra modificada, nem emoji..')
if(!query.trim()) return await reply('Determine o prefixo que deseja tirar, não pode espaço vazio...')
if(query.trim() > 1) return await reply(`Calma, o prefixo só pode ser tirado um por vez\nExemplo: ${prefix+command} _\nAe o bot não vai responder mais com _`)
if(dataGp.multiprefix.prefixos.indexOf(query.trim()) < 0) return await reply(`Esse prefixo não está incluso, procure ver na lista dos prefixos\nExemplo: ${prefix}prefixos`)
if(dataGp.multiprefix.prefixos.length == 1) return await reply('Adicione um prefixo para pode tirar este, tem que ter pelo menos 1 prefixo já incluso dentro do sistema para tirar outro.')
dataGp.multiprefix.prefixos.splice(dataGp.multiprefix.prefixos.indexOf(query.trim()), 1)
await salvarConfigGrupo(dataGp)
await reply(`Prefixo ${query.trim()} tirado com sucesso da lista de prefixos de uso deste grupo..`)
break

case 'multiprefixo': case 'multiprefix':  
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  dataGp.multiprefix.status = true
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.multiprefix.status ? 'Ativou com sucesso o recurso de multi prefixos neste grupo' : 'Desativou com sucesso o recurso de multi prefixos neste grupo' }, { quoted: info })
break

case 'anticatalogo': case 'anticatalg': 
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.anticatalogo.status = !dataGp.anticatalogo.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.anticatalogo.status ? 'Ativou com sucesso o recurso de anticatalogo neste grupo' : 'Desativou com sucesso o recurso de anticatalogo neste grupo' }, { quoted: info })
break

case 'antiloc': case 'antilocalizacao': 
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.antiloc.status = !dataGp.antiloc.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.antiloc.status ? 'Ativou com sucesso o recurso de anticatalogo neste grupo' : 'Desativou com sucesso o recurso de anticatalogo neste grupo' }, { quoted: info })
break

case 'bemvindo': case 'welcome':
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.wellcome.status = !dataGp.wellcome.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.wellcome.status ? 'Sucesso! O recurso de boas-vindas foi ativado neste grupo.' : 'O recurso de boas-vindas foi desativado com sucesso.' }, { quoted: info })
break

case 'ftbemvindo': case 'ftwelcome':
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.wellcome.photo = !dataGp.wellcome.photo
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.wellcome.photo ? 'Sucesso! O recurso de foto no boas-vindas foi ativado neste grupo.' : 'O recurso de foto no boas-vindas foi desativado com sucesso.' }, { quoted: info })
break

case 'fundobemvindo': case 'fundobv':  
    if(!membersSupreme) return await reply(responses.admin());
    if(!QuotedMessage.Picture) return await reply('Você deve marcar uma imagem com esse comando. Se não for de primeira, tente novamente, ok?');
    if(verifyMedia && !info.message.imageMessage || QuotedMessage.Picture) {
        var image = QuotedMessage.Picture ? info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage : info.message?.imageMessage;
        var upload = await getFileBuffer(image, 'image');      
        try {
            var resultado = await uploader.pixhost(upload);
            dataGp.wellcome.Mains.Enter = resultado.resultado;
            await salvarConfigGrupo(dataGp)
            await reply(`A imagem de bem-vindo foi alterada com sucesso para ⤷ ${resultado.resultado}`);
        } catch (error) {
            if(typeof logBug === 'function') logBug(error.message, command);
        }
    }
break;

case 'fundosaiu':  
  if(!membersSupreme) return await reply(responses.admin());
    if(!QuotedMessage.Picture) return await reply('Você deve marcar uma imagem com esse comando. Se não for de primeira, tente novamente, ok?');
    if(verifyMedia && !info.message.imageMessage || QuotedMessage.Picture) {
        var image = QuotedMessage.Picture ? info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage : info.message?.imageMessage;
        var upload = await getFileBuffer(image, 'image');      
        try {
            var resultado = await uploader.pixhost(upload);
            dataGp.wellcome.Mains.Left = resultado.resultado;
            await salvarConfigGrupo(dataGp)
            await reply(`A imagem de saia foi alterada com sucesso para ⤷ ${resultado.resultado}`);
        } catch (error) {
            if(typeof logBug === 'function') logBug(error.message, command);
        }
    }
break;

case 'autobang': case 'listanegrag':
    if(!verifyDono) return await reply(responses.dono())
    if(!mentionNumber) return await reply('Marque a mensagem do usuário ou forneça um número para adicionar à lista negra global.')
    if(configs.listaNegraG.users.includes(mentionNumber)) return await reply('Esse número já está na lista negra global.')
    configs.listaNegraG.users.push(mentionNumber)
        await saveJson('./configs/configs.json', configs)
        await reply(`Número ${mentionNumber} adicionado à lista de autoban com sucesso!`)
break

case 'tirardalistag':
  if(!verifyDono) return await reply(responses.dono());
  if(!mentionNumber) return await reply('Ei, me marque a mensagem do usuário ou passe o número que você quer tirar da lista negra. Vamos lá!');
  if(!configs.listaNegraG.users.includes(mentionNumber)) return await reply('*Ops! Esse número não está na lista negra!*');
  const userBanido = configs.listaNegraG.users.indexOf(mentionNumber);
  configs.listaNegraG.users.splice(userBanido, 1);
  await saveJson('./configs/configs.json', configs);
  await reply(`*Número removido com sucesso da lista negra!*`);
break;

case 'pergunta': case 'ia': case 'chatbot':
    if(!query) return await reply('Por favor, envie sua pergunta junto com o comando.');
    var { key } = await sasha.sendMessage(from, { text: 'Estou analisando sua pergunta com a inteligência artificial. Isso pode levar alguns segundos, aguarde...' }, { quoted: info });
    try {
        var data = await fetchJson(`https://apis.davidcyriltech.my.id/ai/chatbot?text=${encodeURIComponent(query.trim())}`);
        await sasha.sendMessage(from, { text: data.result, edit: key });
    } catch (error) {
        await sasha.sendMessage(from, { ext: 'Não consegui obter uma resposta da inteligência artificial no momento. Tente novamente em instantes.', edit: key });
    }
break;

case 'gptv4': case 'openai': case 'chatgpt':
    if(!query) return await reply('Por favor, envie sua pergunta junto com o comando.');
    var { key } = await sasha.sendMessage(from, { text: 'Consultando o modelo avançado GPT-4... Isso pode demorar alguns segundos.' }, { quoted: info });
    try {
        var data = await fetchJson(`https://apis.davidcyriltech.my.id/ai/gpt4?text=${query.trim()}`);
        await sasha.sendMessage(from, { text: `*Resposta da GPT-4:*\n\n${data.result}`, edit: key });
    } catch (error) {
        await sasha.sendMessage(from, { text: 'A IA GPT-4 não conseguiu responder no momento. Tente novamente em instantes.', edit: key });
   }
break;

case 'deekseek': 
    if(!query) return await reply('Opa! Cadê a pergunta, chefe? Joga ela aqui do lado do comando pra eu poder te ajudar!');
    var { key } = await sasha.sendMessage(from, { text: 'Beleza, tô aqui quebrando a cabeça com a IA pra te dar uma resposta top...' }, { quoted: info });
    try {
        var data = await fetchJson(`https://restapi-v2.simplebot.my.id/ai/deepseek?text=${query.trim()}`);
        await sasha.sendMessage(from, { text: data.result, edit: key });
    } catch (error) {
        await sasha.sendMessage(from, { text: 'A IA deu uma bugadinha agora... tenta de novo daqui a pouco que vai dar bom!', edit: key });
}
break;

case 'deepseek-v3': case 'metaai':
    if(!query) return await reply('Opa! Cadê a pergunta, chefe? Joga ela aqui do lado do comando pra eu poder te ajudar!');
    var { key } = await sasha.sendMessage(from, { text: 'Beleza, tô aqui quebrando a cabeça com a IA pra te dar uma resposta top...' }, { quoted: info });
    try {
        var data = await fetchJson(`https://apis.davidcyriltech.my.id/ai/${command}?text=${query.trim()}`);
        await sasha.sendMessage(from, { text: data.response, edit: key });
    } catch (error) {
        await sasha.sendMessage(from, { text: 'A IA deu uma bugadinha agora... tenta de novo daqui a pouco que vai dar bom!', edit: key });
}
break;

case 'blackbox': 
    if(!query) return await reply('Ei, tá querendo que eu adivinhe o que você quer? Manda a pergunta junto com o comando, pô!');
    var { key } = await sasha.sendMessage(from, { text: 'Segura firme! Tô fuçando nos arquivos secretos da Blackbox pra achar algo útil pra você...' }, { quoted: info });
    try {
        var resultado = await fetchJson(`${WebSite}/ia/blackbox?apikey=${ApiKeySasha}&prompt=${query.trim()}`);
        var data = pickRandom(resultado.resultado.search);
        await sasha.sendMessage(from, { text: `⤷ Título: *${data.title || 'Sem Informações'}*\n⤷ Url: *${data.link || 'Sem Informações'}*\n⤷ Postado: *${data.date || 'Sem Informações'}*\n⤷ Legenda: *${data.snippet || 'Sem Informações'}*`, edit: key });
    } catch (error) {
        await sasha.sendMessage(from, { text: 'Rapaz... a IA deu um nó na cabeça e não trouxe nada agora. Tenta de novo em instantes que vai!', edit: key });
    }
break;

case 'llama': 
    if(!query) return await reply('Ué, cadê a pergunta? Manda aí o que você quer saber, senão a Llama só vai mastigar grama!');
    var { key } = await sasha.sendMessage(from, { text: 'Aguenta aí que a Llama tá ruminando sua pergunta... resposta inteligente vindo aí!' }, { quoted: info });
    try {
        var data = await fetchJson(`${WebSite}/ia/llama?apikey=${ApiKeySasha}&prompt=${query.trim()}`);
        await sasha.sendMessage(from, { text: data.resultado.resposta.replace(/\*\*(.*?)\*\*/g, '*$1*'), edit: key });
    } catch (error) {
        await sasha.sendMessage(from, { text: 'A Llama se distraiu com um arbusto e não trouxe resposta agora. Tenta de novo já já!', edit: key });
    }
break;

case 'imagine': 
    if(!query) return await reply('Opa! Faltou me dizer o que você quer que eu imagine. Manda a ideia aí que eu crio as imagens!');
    var carregandoFrases = [
        'Tô aqui concentrado, invocando umas imagens criativas pra você... *Segura firme!*',
        'Me dá um segundo... tô pincelando uns pixels mágicos aqui!',
        'Chamando a IA artista... já já chega arte fresquinha!',
        'Imaginando forte... espero que goste do que vem aí!',
        'O universo das imagens tá sendo moldado... aguenta firme!'
    ];
    var sucessoFrases = [
        `Missão cumprida, ${NickName}! Tá aí suas imagens novinhas em folha!`,
        `Feito, ${NickName}! Olha só as belezuras que saíram do forno!`,
        `Tá aí, ${NickName}! A IA caprichou nessas criações pra você.`,
        `Criação finalizada com sucesso! Espero que tenha ficado do jeitinho que você imaginou.`,
        `${NickName}, imagens entregues! Agora é só curtir a arte.`
    ];
    var erroFrases = [
        'Vish... não consegui criar nada com essa ideia. Tenta dar uma repaginada na descrição!',
        'A IA se embananou com essa descrição. Que tal tentar outra ideia?',
        'Hmmm, tentei mas nada apareceu. Talvez com outra inspiração funcione!',
        'Nada veio dessa vez... mas bora tentar de novo com uma ideia diferente?',
        'A imaginação falhou dessa vez... tenta algo novo e eu tento de novo!'
    ];
    var { key } = await sasha.sendMessage(from, { text: pickRandom(carregandoFrases) }, { quoted: info });
        var data = await fetchJson(`https://bk9.fun/ai/fluximg?q=${query}`);
        if(!data.BK9 || data.BK9.length === 0) return await sasha.sendMessage(from, { text: pickRandom(erroFrases), edit: key });
  for (var image of data.BK9) {
    await sasha.sendMessage(from, { image: { url: image } });
   }
   await sasha.sendMessage(from, { text: pickRandom(sucessoFrases), edit: key }); 
break;
    
case 'sasha':
  const perguntasSasha = [
    `Hmph... Faça a sua pergunta, *se* for digno de uma resposta. Exemplo:  ${prefix + command} Qual é o seu nome?`,
    `Se você acha que sou obrigado a responder, faça a pergunta.`,
    `Você se atreve a me incomodar? Pergunte logo, mas não espere muito.`,
    `Não pense que minha paciência é infinita. Pergunte de forma correta:  ${prefix + command} Quais são as leis da física?`,
    `Se quer algo de mim, faça a pergunta como um ser digno:  ${prefix + command} Sasha pq você é tão arrogante?`,
    `Estou considerando responder, então faça a pergunta direito.`,
    `Se quer minha atenção, faça sua pergunta de uma vez!`,
    `Eu não sou sua amiga, e você não é digno de perguntas fáceis.`,
    `Você se atreve a me chamar de novo? Pergunte como se fosse digno de minha resposta:  ${prefix + command} Quem é seu criador?`
  ];
  if(!query) return await reply(await pickRandom(perguntasSasha));
    try {
      const ai = new SashaAI();
      const resposta = await ai.chat([{ role: 'user', content: query }]);
      await reply(resposta);
    } catch (error) {
      await reply('Houve um erro ao processar sua solicitação.');
    }
break;

case 'serie': 
  if(!query) return await reply(`Cadê o nome da série que você deseja ver informações?`);
  try {
    var data = await fetchJson(`https://api.themoviedb.org/3/search/tv?api_key=ddfcb99fae93e4723232e4de755d2423&query=${query}&language=pt`);
    if(data.total_results === 0) return await reply('Desculpe, não consegui encontrar o que você procurava. Pode tentar de outra maneira?');
    const serie = data.results[0];
    await sasha.sendMessage(from, { image: { url: `https://image.tmdb.org/t/p/original${serie.backdrop_path}` }, caption: `⤷ Título: *${serie.name}* (${serie.original_name})\n⤷ Lançamento: *${serie.first_air_date}*\n⤷ Avaliações: *${serie.vote_average} - (${serie.vote_count} Votos)*\n⤷ Popularidade da Série (%): *${serie.popularity.toFixed(1)}%*\n⤷ Classificação adulta? *${serie.adult ? 'Sim.' : 'Não.'}*\n⤷ Linguagem Oficial da Série: *${serie.original_language}*\n—\n⤷ *Sinopse da Série:*\n↳ ${serie.overview}` }, { quoted: info });
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'movie':
  if(!query) return await reply(`Cadê o nome do filme o qual você deseja ver informações?`);
  try {
    var data = await fetchJson(`https://api.themoviedb.org/3/search/movie?api_key=ddfcb99fae93e4723232e4de755d2423&query=${query}&language=pt`);
    if(data.total_results === 0) return await reply('Desculpe, não consegui encontrar o que você procurava utilizando essa forma, pode tentar de outra maneira?');
    const movie = data.results[0];
    await sasha.sendMessage(from, { image: { url: `https://image.tmdb.org/t/p/original${movie.backdrop_path}` }, caption: `⤷ Título: *${movie.title}* (${movie.original_title})\n⤷ Lançamento: *${movie.first_air_date}*\n⤷ Avaliações: *${movie.vote_average} - (${movie.vote_count} Votos)*\n⤷ Popularidade da Série (%): *${movie.popularity.toFixed(1)}%*\n⤷ Classificação adulta? *${movie.adult ? 'Sim.' : 'Não.'}*\n⤷ Linguagem Oficial da Série: *${movie.original_language}*\n—\n⤷ *Sinopse da Série:*\n↳ ${movie.overview}` }, { quoted: info });
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'prefix-disabled':
var usuario = await getUsuarioById(sender);
usuario.disabled = !usuario.disabled;
await updateUsuario(sender, usuario);
await sasha.sendMessage(from, { text: usuario.disabled ? 'Ativou com sucesso o modo sem prefixo. (para você)' : 'Desativou com sucesso o modo sem prefixo (para você).' }, { quoted: info })
break

case 'sashaia':
  if(!membersSupreme) return await reply(responses.admin())
  dataGp.sasha.status = !dataGp.sasha.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.sasha.status ? 'Ativou com sucesso o modo sasha neste grupo.' : 'Desativou o modo sasha com sucesso neste grupo' }, { quoted: info })
break

case 'autofigu': case 'autosticker':
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.autosticker.status = !dataGp.autosticker.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.autosticker.status ? 'Ativou com sucesso o recurso de auto figurinhas neste grupo' : 'Desativou com sucesso o recurso de auto figurinhas neste grupo' }, { quoted: info })
break

case 'modobrincadeira': case 'modobrincadeiras':  
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.jogos.status = !dataGp.jogos.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.jogos.status ? 'Ativou com sucesso o modo brincadeira neste grupo' : 'Desativou com sucesso o modo brincadeira neste grupo' }, { quoted: info })
break

case 'bangp': case 'unbangp':
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!verifyDono) return await reply(responses.dono())
    dataGp.bangp.status = !dataGp.bangp.status
    await salvarConfigGrupo(dataGp)
    await sasha.sendMessage(from, { text: dataGp.bangp.status ? 'Grupo banido com sucesso! Agora só os privilegiados podem entrar.' : 'Grupo desbanido com sucesso! A diversão está de volta.' }, { quoted: info })
break

case 'boton': case 'botoff':
if(!verifyDono) return await reply(responses.dono())
    configs.Modos.bot.status = !configs.Modos.bot.status;
    await saveJson('./configs/configs.json', configs)
    var botStatus = configs.Modos.bot.status;
    var statusMsg = botStatus ? 'Tudo certo, docinho! Agora estou *online* e pronta pra te ajudar!' : 'Descansei os circuitos! Agora estou *offline*, me chama se precisar depois.';
    await sasha.sendMessage(from, { text: statusMsg }, { quoted: info })
break;

case 'antipalavrão': case 'antipalavrao': case 'antipalavra':  
  if(!verifyGrupo) return await reply(responses.grupo())
  if(!membersSupreme) return await reply(responses.admin())
  if(!BotSupreme) return await reply(responses.botAdmin())
  dataGp.antipalavrao.status = !dataGp.antipalavrao.status
  await salvarConfigGrupo(dataGp)
  await sasha.sendMessage(from, { text: dataGp.antipalavrao.status ? 'Ativou com sucesso o recurso de Anti Palavras neste grupo' : 'Desativou com sucesso o recurso de Anti Palavras neste grupo' }, { quoted: info })
break;

case 'addpalavra':
  if(!membersSupreme) return await reply(responses.admin());
  if(!verifyPalavrao) return await reply(`O anti palavrão está desativado! Ative-o com o comando ${prefix}antipalavra 1 para poder adicionar palavras.`);
  if(string.length < 1) return await reply(`Use assim ⤷ ${prefix + command} [palavrão]. Exemplo ⤷ ${prefix + command} puta`);
  var palavra = string.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if(verifyPalavras.includes(palavra)) return await reply('Essa palavra já foi adicionada à lista, não pode ser repetida!');
  dataGp.antipalavrao.palavras.push(palavra);
  await salvarConfigGrupo(dataGp);
  await reply('Palavrão adicionado com sucesso! Agora vamos manter o ambiente mais saudável. 😊');
break;

case 'delpalavra':
  if(!membersSupreme) return await reply(responses.admin());
  if(!verifyPalavrao) return await reply('O sistema de anti palavrão está desativado! Não tem como remover palavras.');
  if(string.length < 1) return await reply(`Use assim ⤷ ${prefix + command} [palavrão]. Exemplo ⤷ ${prefix + command} puta`);
  var texto = string.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if(!verifyPalavras.includes(texto)) return await reply('Essa palavra já foi removida ou não está na lista, cara!')
  var i6 = dataGp.antipalavrao.palavras.indexOf(texto);
  dataGp.antipalavrao.palavras.splice(i6, 1);
  await salvarConfigGrupo(dataGp);
  await reply('Palavrão removido com sucesso! Agora o ambiente está mais tranquilo.');
break;

case 'listapalavrão': case 'listapalavra':
case 'listpalavra':
  if(!verifyPalavrao) return await reply('O sistema de anti palavrão está desativado! Não tem nada para mostrar agora.');
  var listaDePalavras = `Aqui está a lista de palavras proibidas, meu chapa!\nTotal de palavras ⤷ ${verifyPalavras.length}\n`;
  for (var palavra of verifyPalavras) {
    listaDePalavras += `⤷〔 *${palavra}* 〕\n`;
  }
  await reply(listaDePalavras);
break;

case 'status': case 'ativarcmds': case 'ativacoes':
  if(!verifyGrupo) return await reply(responses.grupo());
  if(!membersSupreme) return await reply(responses.admin());
  
  var status = `Explicação ⤷ Os Antis são ferramentas projetadas para proteger seu grupo, garantindo um ambiente seguro e organizado. Eles não banem usuários diretamente, mas desempenham um papel essencial na moderação ao:
    Apagar mensagens que violam as regras do grupo.
	Emitir advertências para os usuários que cometerem infrações.
	Notificar os administradores sobre atividades suspeitas ou repetidas violações, permitindo que tomem as medidas necessárias.

Dessa forma, os Antis ajudam a manter a ordem sem punições severas automáticas, dando aos administradores o controle final sobre as ações do grupo.

( OBS: Para ativar ou desativar os comandos, basta usar uma vez e depois usar novamente. Sem segredo! 😅 )

Anti Link Hard ⤷ ${dataGp.antilink.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antilink

Anti Link Grupo ⤷ ${dataGp.antilinkgp.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antilinkgp

Anti Fake ⤷ ${dataGp.antifake.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antifake

Anti Catalogo ⤷ ${dataGp.anticatalogo.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}anticatalogo

Anti Localização ⤷ ${dataGp.antiloc.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antiloc

X9 De Cargo de ADM ⤷ ${dataGp.x9.status ? '✓' : '✕'}  
Comando ⤷ ${prefix}x9

Modo Brincadeira ⤷ ${dataGp.jogos.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}modobrincadeira

Bem Vindo ⤷ ${dataGp.wellcome.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}bemvindo

Anti Vídeo ⤷ ${dataGp.antivideo.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antivideo

Anti Imagem ⤷ ${dataGp.antiimg.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antiimg

Anti Áudio ⤷ ${dataGp.antiaudio.status? '✓' : '✕'} 
Comando ⤷ ${prefix}antiaudio

Anti Documento ⤷ ${dataGp.antidoc.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antidoc

Anti Contato ${dataGp.antictt.status ? '✓' : '✕'}
Comando ⤷ ${prefix}antictt

Anti Sticker ⤷ ${dataGp.antisticker.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antisticker

Auto Figurinha ⤷ ${dataGp.autosticker.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}autofigu

Sasha AI ⤷ ${dataGp.sasha.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}sashaia

Anti Palavrão ⤷ ${dataGp.antipalavrao.status ? '✓' : '✕'} 
Comando ⤷ ${prefix}antipalavrao
`;
  await sasha.sendMessage(from, { image: { url: images['Main'].value }, caption: status }, {quoted: info });
break;

case 'reiniciar':
  if(!verifyDonoOficial) return await reply(responses.dono())
    await reply('Reiniciando o sistema, em segundos já estarei de volta senhor(a) as suas ordens!')
   await sleep(1200);
      process.exit();    
break;

case 'limparqr': 
  const diretorio = path.resolve('./configs/media/qr-code');
  try {
    if(!fs.existsSync(diretorio)) {
      return await sasha.sendMessage(from, { text: 'Diretório de QR Codes não encontrado.' });
    }
    const arquivos = await new Promise((resolve, reject) => {
      fs.readdir(diretorio, (err, files) => {
        if(err) return reject(err);
        resolve(files);
      });
    });
    const paraExcluir = arquivos.filter(file =>
      file?.startsWith('pre-key') ||
      file?.startsWith('sender-key') ||
      file?.startsWith('session-')
    );
    if(paraExcluir.length === 0) {
      return await sasha.sendMessage(from, { text: 'Nenhum QR Code antigo foi encontrado para exclusão.' });
    }
    for (const file of paraExcluir) {
      const filePath = path.join(diretorio, file);
      await new Promise((resolve, reject) => {
        fs.unlink(filePath, err => {
          if(err) return reject(err);
          resolve();
        });
      });
    }
    await sasha.sendMessage(from, { text: `Foram excluídos ${paraExcluir.length} QR Codes antigos.` });
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'ssf': case 'sfundo': 
try {
if((verifyMedia && !info.message.videoMessage || QuotedMessage.Picture) && !query.length <= 1) {  
var propertyMessage  = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || info.message?.imageMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage;
await reply('Removendo o fundo da imagem e transformando em Sticker...');
owgi = await getFileBuffer(propertyMessage, 'image');
var sticker = new Sticker();
resultadoFundo = await RemoverFundo(owgi)
sticker.addFile(resultadoFundo.resultado); 
sticker.options.metadata = {author: `⤷ Criado(a) por: ${botName}`, emojis: ['😼', '🥶', '😻']};
var resultadoSt = await sticker.start();
await sasha.sendMessage(from, { sticker: fs.readFileSync(resultadoSt[0].value) }, {quoted: info })
await sleep(500);
await deleteFile(resultadoSt[0].value);
} else {
return await reply('*‐* Responda uma imagem ou adicione na legenda da imagem o comando, lembre-se, o efeito de remoção de fundo só funciona em imagens.');
}
} catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
break

case 'rvisu': case 'revelarvisu': case 'viewonce':
    var imageViewOnce = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage;
    var videoViewOnce = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.videoMessage;
    var audioViewOnce = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2Extension?.message?.audioMessage
    if(!imageViewOnce && !videoViewOnce && !audioViewOnce) {
      return await reply('Marque uma imagem, vídeo ou áudio de visualização única para recuperar!');
     }
    if(imageViewOnce) {
        var fileBuffer = await getFileBuffer(imageViewOnce, 'image');
        var caption = imageViewOnce.caption || ''; 
        await sasha.sendMessage(from, { image: fileBuffer, caption }, { quoted: info });
    }
    if(videoViewOnce) {
        var fileBuffer = await getFileBuffer(videoViewOnce, 'video');
        var caption = videoViewOnce.caption || ''; 
        await sasha.sendMessage(from, { video: fileBuffer, caption }, { quoted: info });
    }
    if(audioViewOnce) {
        var fileBuffer = await getFileBuffer(audioViewOnce, 'audio');
        await sasha.sendMessage(from, { audio: fileBuffer, ptt: true }, { quoted: info });
    }
break;

case 'snome': case 'rename': case 'swm':
if(!QuotedMessage.EmojiArt) return await reply(`Responda um *STICKER* com *${prefix+command}* pack/autor ⤷ Renomeia o nome do pack e do autor do sticker.`);
try {
var [pack, autor] = query.split('/');
if(!pack || !autor) return await reply(`Responda um *STICKER* com *${prefix+command}* pack/autor ⤷ Renomeia o nome do pack e do autor do sticker.`)
var image = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
var sticker = new Sticker(); // Sticker
sticker.addFile(image); 
sticker.options.metadata = { pack: pack, author: autor, emojis: ['🤠', '🥶', '😻'] };
var resultadoSt = await sticker.start();
await sasha.sendMessage(from, { sticker: fs.readFileSync(resultadoSt[0].value) }, {quoted: info })
 await reagir(from, '😺'); 
 await deleteFile(resultadoSt[0].value)
} catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
break

case 's': case 'st': case 'stk': case 'sticker':
var auc = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || info.message?.imageMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage;
var aoc = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage || info.message?.videoMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.videoMessage;
await reagir(from, '⚡');
var sticker = new Sticker(); // Sticker
if(auc && string.length == 0) {
var fileBuffer = await getFileBuffer(auc, 'image');
sticker.addFile(fileBuffer); 
sticker.options.metadata = { pack: `⚙️ Usuário ⤷ ${NickName}\n🤖 Criado por ⤷ ${botName}`, author: `\n🌐 Web Site ⤷ https://sasha.online\n📅 Data ⤷ ${date} - ${hora}`, emojis: ['👄', '🙄', '😛'] };
await sticker.start().then(async(data) => {
console.log(data)
 await sasha.sendMessage(from, { sticker: fs.readFileSync(data[0].value)}, {quoted: info })
await reagir(from, '😺'); await deleteFile(data[0].value);
}).catch(async(error) => logBug(error.message, command));
} else if(aoc && aoc.seconds < 18) {
var fileBuffer = await getFileBuffer(aoc, 'video')
sticker.addFile(fileBuffer); 
sticker.options.metadata = { pack: `⚙️ Usuário ⤷ ${NickName}\n🤖 Criado por ⤷ ${botName}`, author: `\n🌐 Web Site ⤷ https://sasha.online\n📅 Data ⤷ ${date} - ${hora}`, emojis: ['👄', '🙄', '😛'] };
await sticker.start().then(async(data) => {
 await sasha.sendMessage(from, { sticker: fs.readFileSync(data[0].value)}, {quoted: info })
await reagir(from, '😺'); await deleteFile(data[0].value);
}).catch(async(error) => logBug(error.message, command));
} else if(string[0] == '-circle' || string[0] == '-cl') {
if(!JSON.stringify(info).includes('imageMessage')) return await reply(`Mencione ou adicione uma legenda à uma imagem ou um vídeo.\n⤷ Opções de Customização:\n\tCírculo: *${prefix+command} -circle* | *-cl*\n\tPirâmide: *${prefix+command} -piramide* | *-pr*\n\tBorda Circular: *${prefix+command} -borda* | *-bd*\n\tPrisma: *${prefix+command} -prisma* | *-pm*\n⤷ Observação do Comando:\n\tAs opções de *customização* edtá disponível somente para imagens.\nNão é possível criar *STICKERs* em vídeo (animados) com formatos diferentes em círculo, pirâmide, por exemplo.\n\tLembre-se o limite de duração do vídeo para criação de *STICKERs* animados é *9.9s*, caso seja maior realize o corte ou não será possível a criação.\n–\n> ${botName}`);
var fileBuffer = await getFileBuffer(auc, 'image');
sticker.options.edit = 'circle'; 
sticker.addFile(fileBuffer); 
sticker.options.metadata = { pack: `⚙️ Usuário ⤷ ${NickName}\n🤖 Criado por ⤷ ${botName}`, author: `\n🌐 Web Site ⤷ https://sasha.online\n📅 Data ⤷ ${date} - ${hora}`, emojis: ['👄', '🙄', '😛'] };
await sticker.start().then(async(data) => {
 await sasha.sendMessage(from, { sticker: fs.readFileSync(data[0].value)}, {quoted: info })
}).catch(async(error) => logBug(error.message, command));
} else if(string[0] == '-borda' || string[0] == '-bd' && !auc) {
if(!JSON.stringify(info).includes('imageMessage')) return await reply(`Mencione ou adicione uma legenda à uma imagem ou um vídeo.\n⤷ Opções de Customização:\n\tCírculo: *${prefix+command} -circle* | *-cl*\n\tPirâmide: *${prefix+command} -piramide* | *-pr*\n\tBorda Circular: *${prefix+command} -borda* | *-bd*\n\tPrisma: *${prefix+command} -prisma* | *-pm*\n⤷ Observação do Comando:\n\tAs opções de *customização* edtá disponível somente para imagens.\nNão é possível criar *STICKERs* em vídeo (animados) com formatos diferentes em círculo, pirâmide, por exemplo.\n\tLembre-se o limite de duração do vídeo para criação de *STICKERs* animados é *9.9s*, caso seja maior realize o corte ou não será possível a criação.\n–\n> ${botName}`);
var fileBuffer = await getFileBuffer(auc, 'image');
sticker.options.edit = 'borda'; 
sticker.addFile(fileBuffer); 
sticker.options.metadata = { pack: `⚙️ Usuário ⤷ ${NickName}\n🤖 Criado por ⤷ ${botName}`, author: `\n🌐 Web Site ⤷ https://sasha.online\n📅 Data ⤷ ${date} - ${hora}`, emojis: ['👄', '🙄', '😛'] };
await sticker.start().then(async(data) => {
 await sasha.sendMessage(from, { sticker: fs.readFileSync(data[0].value)}, {quoted: info })
}).catch(async(error) => logBug(error.message, command));
} else if(string[0] == '-piramide' || string[0] == '-pr' || string[0] == '-pyramid') {
if (!JSON.stringify(info).includes('imageMessage')) 
  return await reply(`Erro: Nenhuma imagem ou vídeo detectado. Por favor, envie uma imagem ou vídeo com uma legenda.\n⤷ Opções de Customização:\n\tCírculo: *${prefix+command} -circle* | *-cl*\n\tPirâmide: *${prefix+command} -piramide* | *-pr*\n\tBorda Circular: *${prefix+command} -borda* | *-bd*\n\tPrisma: *${prefix+command} -prisma* | *-pm*\n⤷ Observações:\n\tAs opções de customização são exclusivas para imagens.\n\tVídeos não suportam formatação de *STICKERs* animados em formatos como círculo ou pirâmide.\n\tAlém disso, o vídeo deve ter no máximo *9.9s* de duração para ser usado como *STICKER* animado. Caso contrário, será necessário cortar o vídeo.`);
var fileBuffer = await getFileBuffer(auc, 'image');
sticker.options.edit = 'piramide'; 
sticker.addFile(fileBuffer); 
sticker.options.metadata = { pack: `⚙️ Usuário ⤷ ${NickName}\n🤖 Criado por ⤷ ${botName}`, author: `\n🌐 Web Site ⤷ https://sasha.online\n📅 Data ⤷ ${date} - ${hora}`, emojis: ['👄', '🙄', '😛'] };
await sticker.start().then(async(data) => {
 await sasha.sendMessage(from, { sticker: fs.readFileSync(data[0].value)}, {quoted: info })
}).catch(async(error) => logBug(error.message, command));
} else if(string[0] == '-prisma' || string[0] == '-pm') {
if (!JSON.stringify(info).includes('imageMessage')) 
  return await reply(`Erro: Nenhuma imagem ou vídeo detectado. Por favor, envie uma imagem ou vídeo com uma legenda.\n⤷ Opções de Customização:\n\tCírculo: *${prefix+command} -circle* | *-cl*\n\tPirâmide: *${prefix+command} -piramide* | *-pr*\n\tBorda Circular: *${prefix+command} -borda* | *-bd*\n\tPrisma: *${prefix+command} -prisma* | *-pm*\n⤷ Observações:\n\tAs opções de customização são exclusivas para imagens.\n\tVídeos não suportam formatação de *STICKERs* animados em formatos como círculo ou pirâmide.\n\tAlém disso, o vídeo deve ter no máximo *9.9s* de duração para ser usado como *STICKER* animado. Caso contrário, será necessário cortar o vídeo.`);
var fileBuffer = await getFileBuffer(auc, 'image');
sticker.options.edit = 'primas'; 
sticker.addFile(fileBuffer); 
sticker.options.metadata = { pack: `⚙️ Usuário ⤷ ${NickName}\n🤖 Criado por ⤷ ${botName}`, author: `\n🌐 Web Site ⤷ https://sasha.online\n📅 Data ⤷ ${date} - ${hora}`, emojis: ['👄', '🙄', '😛'] };
await sticker.start().then(async(data) => {
 await sasha.sendMessage(from, { sticker: fs.readFileSync(data[0].value)}, {quoted: info })
}).catch(async(error) => logBug(error.message, command));
} else {
return await reply(`Como adicionar ou mencionar uma legenda em uma imagem ou vídeo.

⤷ Opções de Customização Disponíveis:
	⤷	Círculo: Você pode transformar a imagem em um círculo. Para isso, utilize o comando ${prefix+command} -circle ou a abreviação -cl.
	⤷	Pirâmide: Para transformar a imagem em uma pirâmide, use o comando ${prefix+command} -piramide ou a abreviação -pr.
	⤷	Borda Circular: Se você quiser adicionar uma borda circular à imagem, utilize o comando ${prefix+command} -borda ou a abreviação -bd.
	⤷	Prisma: Para aplicar um efeito de prisma à imagem, utilize o comando ${prefix+command} -prisma ou a abreviação -pm.

⤷ Informações Importantes sobre o Comando:
	⤷	Disponibilidade de Customizações: As opções de customização (círculo, pirâmide, borda circular e prisma) estão disponíveis somente para imagens.
	⤷	Limitações para Vídeos: Não é possível criar STICKERs animados em vídeos com formatos diferentes, como círculo ou pirâmide. Ou seja, vídeos com esses efeitos de formatação não podem ser convertidos em STICKERs animados.
	⤷	Limite de Duração para Vídeos: O limite de duração para criar STICKERs animados a partir de vídeos é 16,9 segundos. Caso o vídeo tenha uma duração maior, será necessário cortá-lo para que o processo de criação seja realizado com sucesso. Vídeos com mais de 16,9 segundos não poderão ser convertidos.`)
}
break

case 'toimg':
if(!QuotedMessage.EmojiArt) return await reply('Por favor, *mencione um sticker* para executar o comando.')
try {
  var image = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
  await sasha.sendMessage(from, { image: image }, {quoted: info })
} catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
}
break

case 'retro':
        try {
            var [textPrimary, textSecondary, textTertiary] = query.split('|');
            if(!query.includes('|')) return await reply(`Você esqueceu de adicionar os 3 textos para criar a logo! Use *|* para separá-los. Exemplo:\n⤷ *${prefix + command} Sasha|Apis|Oficial*`);
            
            await reply(responses.wait());
            await sasha.sendMessage(from, { image: { url: `${WebSite}/ephoto/retro?apikey=${ApiKeySasha}&text=${textPrimary.trim()}&text2=${textSecondary.trim()}&text3=${textTertiary.trim()}` }}, { quoted: info });
        } catch (error) {
             if(typeof logBug === 'function') logBug(error.message, command);
        }
break;

case 'captain': case 'graffitiwall': case 'phlogo': case 'blackpink': case 'deadpool': case 'glitter': case 'vintage3d':
        try {
            var [textPrimary, textSecondary] = query.split('|');
            if(!query.includes('|')) return await reply(`Você esqueceu de adicionar os 2 textos para criar a logo! Use *|* para separá-los. Exemplo:\n⤷ *${prefix + command} Sasha|BOT*`);
            await reply(responses.wait());
            await sasha.sendMessage(from, { image: { url: `${WebSite}/ephoto/${command}?apikey=${ApiKeySasha}&text=${textPrimary.trim()}&text2=${textSecondary.trim()}` }}, { quoted: info });
        } catch (error) {
            if(typeof logBug === 'function') logBug(error.message, command);
        }
break;

case 'galaxy-light': case 'galaxy': case 'glitch': case 'graffiti': case 'metallic': case 'glossy': case 'mascote': 
    case 'dragonfire': case 'goldpink': case 'pubgavatar': case 'ffavatar': case 'amongus': case 'comics': 
    case 'lolavatar': case 'cemiterio': case 'blood': case 'hallobat': case 'titanium': case 'eraser': case 'halloween': 
    case 'snow': case 'america': case 'mascoteneon': case 'doubleexposure': case 'metal': case '3dcrack': 
    case 'colorful': case 'ballon': case 'multicolor': case 'graffitipaint': case 'graffitistyle': case 'frozen': 
    case 'ligatures': case 'watercolor': case 'summerbeach': case 'cloudsky': case 'techstyle': case 'royal': 
    case 'firework': case 'mascotemetal':
        try {
            if(!query) return await reply(`Você esqueceu de adicionar um texto para criar a logo! Exemplo:\n⤷ *${prefix + command} Sasha*`);
            await reply(responses.wait());
            await sasha.sendMessage(from, { image: { url: `${WebSite}/ephoto/${command}?apikey=${ApiKeySasha}&text=${query.trim()}` }}, { quoted: info });
        } catch (error) {
            if(typeof logBug === 'function') logBug(error.message, command);
        }
break;

case 'fluffy-logo': case 'lava-logo': case 'cool-logo': case 'comic-logo': case 'fire-logo': case 'water-logo': case 'ice-logo': case 'elegant-logo': case 'gold-logo': case 'fortune-logo': case 'blue-logo': case 'silver-logo': case 'neon-logo': case 'skate-name': case 'retro-logo': case 'candy-logo': case 'glossy-logo':
        if(!query) return await reply(`Você esqueceu de adicionar um texto para criar a logo! Exemplo:\n⤷ *${prefix + command} Sasha Apis*`);
        try {
            await reply(responses.wait());
            await sasha.sendMessage(from, { image: { url: `${WebSite}/flamingtext?command=${command}&text=${query.trim()}&apikey=${ApiKeySasha}` }}, { quoted: info });
        } catch (error) {
            if(typeof logBug === 'function') logBug(error.message, command);
        }
break

case 'metadinha':
  try {
    var data = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
    var resultado = data[Math.floor(Math.random() * data.length)]
    await sasha.sendMessage(from, { image: { url: resultado.female }});
    await sasha.sendMessage(from, { image: { url: resultado.male }});
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'getfile':
  if (!verifyDono) return await reply(responses.dono());
  try {
    var mime = require('mime-types');
    if (!query) return await reply('Informe o nome do arquivo que deseja obter.');
    var filePath = path.resolve(__dirname, query);
    if (!fs.existsSync(filePath)) return await reply(`O arquivo "${query}" não foi encontrado.`);
    var fileMime = mime.lookup(filePath) || 'application/octet-stream';
    await sasha.sendMessage(from, { document: fs.readFileSync(filePath), fileName: path.basename(filePath), mimetype: fileMime, caption: `Arquivo solicitado: "${query}"` }, { quoted: info });
  } catch (error) {
    if (typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'substituir':
if(!verifyDonoOficial) return await reply(responses.dono())
  if(verifyMedia && !info.message.videoMessage || QuotedMessage.Document) {
    var media = QuotedMessage.Document ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage : info.message.documentMessage;
    var randomFileName = getRandom('.'+await getExtension(media.mimetype));
    var resultado = await getFileBuffer(media, 'document');
    fs.writeFileSync(query, resultado);
    await sasha.sendMessage(from, { text: 'Tudo certo, substituído com sucesso! Agora está tinindo! 🚀'}, {quoted: info });
  } else {
    await reply('Marque o documento ou o arquivo pra eu poder te ajudar com isso!');
  }
break;

case 'index-bot':
if(!verifyDonoOficial) return await reply(responses.dono())
  if(verifyMedia && !info.message.videoMessage || QuotedMessage.Document) {
   var media = QuotedMessage.Document ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage : info.message.documentMessage;
    var randomFileName = getRandom('.'+await getExtension(media.mimetype));
    var resultado = await getFileBuffer(media, 'document');
    fs.writeFileSync('./command.js', resultado);
    await sasha.sendMessage(from, { text: 'Tudo certo, novinha! Documento command.js foi modificado com sucesso! 😏'}, {quoted: info });
  } else {
    await reply('Você precisa marcar o documento ou o arquivo, assim consigo te ajudar a determinar a pasta ou substituir. Bora lá, não perde tempo!');
  }
break;

case 'bann':
  if(!verifyDono) return await reply(responses.dono())
  if(!BotSupreme) return await reply('Ué, o bot não é ADM? Preciso de uma ajudinha aí! 😅');
  if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque o usuário ou @dele(a), mas sem exageros, hein? Só um por vez!');
  if(!JSON.stringify(groupMembers).includes(mentionTwo)) return await reply('Esse usuário já foi removido ou saiu do grupo, sumiu da área! ✌️');
  if(premiumUser(mentionTwo)) return await mention(`@${mentionTwo.split('@')[0]} olha só, @${sender.split('@')[0]} está querendo te banir... mas vamos conversar sobre isso, né? 😅`);
  if(groupAdmins.includes(mentionTwo)) return await mention(`@${mentionTwo.split('@')[0]} olha só, @${sender.split('@')[0]} está querendo te banir... mas será que não dá pra resolver isso na boa? 😶`);
  if(botNumber.includes(mentionTwo)) return await reply('Ué, mas não vou me banir não, né? 🙄 Vou ficar aqui mesmo, viu?');
  if(donos.includes(mentionTwo)) return await reply('Meu dono? Não, não posso fazer isso, é um trabalho de respeito! 🤧');
  await sasha.sendMessage(from, { text: `@${mentionTwo.split('@')[0]} Você foi removido(a) com sucesso ⤷ (Motivos misteriosos ainda não esclarecidos... 🤫) -`, mentions: [mentionTwo]});
  await sasha.groupParticipantsUpdate(from, [mentionTwo], 'remove');
  await reply('Tudo feito! O grupo ficou mais leve e saudável, bora curtir mais a vibe! 😎👌');
break;

case 'nuke': case 'arquivargp':
  if(!verifyDono) return await reply('Eita! Só o dono tem permissão para fazer isso... 😎');
  if(!BotSupreme) return await reply('Ué, mas o bot não é ADM? Preciso de permissões! 😅');
  if(SashaBot) return;
  var blup = [];
  for (var i of groupMembers) {
    if(!donos.includes(i.id)) blup.push(i.id);
  }
  blup.splice(blup.indexOf(botNumber), 1);
  for (var i = 0; i < blup.length; i++) {
    await sleep(500);
    await sasha.groupParticipantsUpdate(from, [blup[i]], 'remove');
  }
  await reply('Esses membros não estavam no nível! Agora o grupo está mais leve! 😎👋');
break;
  
case 'togif': case 'tomp4': case 'tovideo':
    if ((verifyMedia && !info.message.videoMessage || QuotedMessage.EmojiArt) && !query.length <= 1) {
        reply(`Transformando seu sticker em um vídeo mágico... Segure firme, jovem padawan!`);
        try {
            var MediaWebP = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
            var fileName = require('crypto').randomBytes(10).toString('hex');
            await saveFile(`./configs/media/assets/webp/tmp/${fileName}.webp`, MediaWebP); 
            var resultadoGIF = await WebP_GIF(`./configs/media/assets/webp/tmp/${fileName}.webp`);
            await sasha.sendMessage(from, { video: { url: resultadoGIF.resultado }, gifPlayback: true }, { quoted: info }).catch(() => logBug(error.message, command));
            await reagir(from, '😺');
            await deleteFile(`./configs/media/assets/webp/tmp/${fileName}.webp`); 
        } catch (error) {
            if (typeof logBug === 'function') logBug(error.message, command);
        }
    } else {
        return await reply(`Por favor, *responda a um sticker* com o comando *${prefix + command}* para transformar ele em GIF ou vídeo!`);
    }
break;
    
case 'attp':
    try {
        if(!query.trim()) return await reply(`Fala aí! Manda um nome ou palavra pra eu transformar em sticker! Exemplo: *${prefix+command} Sasha Bot*`);
        await reply('Aguarde um segundinho, estou preparando sua arte! 🎨✨');
        var data = await getBuffer(`${WebSite}/ttp/attp?apikey=${ApiKeySasha}&texto=${query.trim()}`);
        await sasha.sendMessage(from, { sticker: data }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'ttp':
    try {
        if(!query.trim()) return await reply(`Fala aí! Manda um nome ou palavra pra eu transformar em sticker! Exemplo: *${prefix+command} Sasha Bot*`);
        await reply('Aguarde um segundinho, estou preparando sua arte! 🎨✨');
        var data = await getBuffer(`${WebSite}/ttp/ttp?apikey=${ApiKeySasha}&texto=${query.trim()}`);
        await sasha.sendMessage(from, { sticker: data }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'brat':
    try {
        if(!query.trim()) return await reply(`Fala aí! Manda um nome ou palavra pra eu transformar em sticker! Exemplo: *${prefix + command} Sasha Bot*`);
        await reply('Aguarde um segundinho, estou preparando sua arte!');
        var data = await getBuffer(`https://apizell.web.id/tools/bratblur?q=${query.trim()}`);
        var sticker = new Sticker();
        sticker.addFile(data);
        sticker.options.metadata = { pack: `${NickName}`, author: `${botName}`, emojis: ['😼', '😔', '😻'] };
        var resultadoSt = await sticker.start();
         await sasha.sendMessage(from, { sticker: fs.readFileSync(resultadoSt[0].value) }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'bratanimate':
    try {
        if(!query.trim()) return await reply(`Fala aí! Manda um nome ou palavra pra eu transformar em sticker! Exemplo: *${prefix + command} Sasha Bot*`);
        await reply('Aguarde um segundinho, estou preparando sua arte!');
        var data = await getBuffer(`https://apizell.web.id/tools/bratanimate?q=${query.trim()}`);
        var sticker = new Sticker();
        sticker.addFile(data);
        sticker.options.metadata = { pack: `${NickName}`, author: `${botName}`, emojis: ['😼', '😔', '😻'] };
        var resultadoSt = await sticker.start();
        await sasha.sendMessage(from, { sticker: fs.readFileSync(resultadoSt[0].value) }, { quoted: info });
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'nick': case 'gerarnick': case 'fazernick':
    try {
        if(antiLetraEmoji(query)) return await reply('Aí, sem aquelas letras modificadas ou emojis, ok? 😅');
        if(!query.trim()) return await reply(`Eita, cadê o nome? Me manda um nome para eu mandar com aquele toque especial! 😎\nExemplo: *${prefix+command} Sasha Bot*`);
        var nomesEstilosos = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/gerar_nick?nick=${query.trim()}&apikey=Learsi_Gamer`);
        var mensagemFinal = `Aqui está sua lista de nomes modificados, escolha seu favorito e arrase! 😜\n\n`;
        for (i of nomesEstilosos) {
            mensagemFinal += `${i}\n\n`;
        }
       await reply(mensagemFinal);
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'namorar': case 'casa': 
    if(!mentionTwo || mentionJidTwo[1]) return reply(`💍 Marque alguém para pedir em ${command === 'casa' ? 'casamento' : 'namoro'}!\n\nExemplo: *${command} @usuario*`);
    if(sender === mentionTwo) return reply('💔 Você não pode se relacionar consigo mesmo!');
    const pretendente = await getOrCreateUsuario(sender);
    const crush = await getOrCreateUsuario(mentionTwo);
    const isPedidoCasamento = command === 'casa';
    if(isPedidoCasamento) {
        const jaEstaoNamorando = pretendente.namoro?.parceiro === mentionTwo && crush.namoro?.parceiro === sender;
        if(jaEstaoNamorando) {
            const dataCasamento = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            pretendente.namoro = null;
            crush.namoro = null;
            pretendente.casamento = { parceiro: mentionTwo, desde: dataCasamento };
            crush.casamento = { parceiro: sender, desde: dataCasamento };
            await updateUsuario(sender, pretendente);
            await updateUsuario(mentionTwo, crush);
            return await sasha.sendMessage(from, { text: `💒 *Agora é oficial!* 💒\n\n💍 ⤷ @${sender.split('@')[0]} e ⤷ @${mentionTwo.split('@')[0]} evoluíram de namoro para casamento! ❤️\n\n📅 *Casados desde* ⤷ ${dataCasamento}`, mentions: [sender, mentionTwo] });
        }
        if(pretendente.casamento) return mention(`🤨 Ei @${sender.split('@')[0]}, você já é casado(a) com ⤷ @${pretendente.casamento.parceiro.split('@')[0]}! 💀`);
        if(crush.casamento) return mention(`💔 @${mentionTwo.split('@')[0]} já está casado(a)! Nada de destruir lares aqui!`);
        pretendente.pedidoCasamento = mentionTwo;
        crush.conviteCasamento = sender;
        await updateUsuario(sender, pretendente);
        await updateUsuario(mentionTwo, crush);
        return await sasha.sendMessage(from, { text: `💞 *Pedido de Casamento!* 💞\n\n💑 ⤷ @${sender.split('@')[0]} pediu ⤷ @${mentionTwo.split('@')[0]} em casamento!\n\n❤️ ⤷ @${mentionTwo.split('@')[0]}, responda com *${prefix}aceito* para oficializar!\n⤷ *${prefix}recusar* para recusar o pedido de casamento`, mentions: [sender, mentionTwo] });
         }
    if(pretendente.namoro || crush.namoro) return mention(`💔 Um de vocês já está em um relacionamento!`);
    pretendente.pedidoNamoro = mentionTwo;
    crush.conviteNamoro = sender;
    await updateUsuario(sender, pretendente);
    await updateUsuario(mentionTwo, crush);
    await sasha.sendMessage(from, { text: `💞 *Pedido de Namoro!* 💞\n\n💑 ⤷ @${sender.split('@')[0]} pediu ⤷ @${mentionTwo.split('@')[0]} em namoro!\n\n❤️ ⤷ @${mentionTwo.split('@')[0]}, responda com *${prefix}aceito* para oficializar!\n⤷ *${prefix}recusar* para recusar o pedido de namoro`, mentions: [sender, mentionTwo] });
break;

case 'trair': 
  if(!verifyGrupo) return await reply(responses.grupo());
  if(!mentionTwo || mentionJidTwo[1]) return reply('Marque *uma única pessoa* com quem você quer “tentar trair”.\n\nExemplo: *!trair @crush*');
  var user = await getUsuarioById(sender);
  var parceiro = user?.casamento?.parceiro || user?.namoro?.parceiro;
  if(!parceiro) return reply('Você nem está em um relacionamento… vai trair quem, o vento?');
  if(parceiro === mentionTwo) return reply('Kkkkk... você marcou seu próprio parceiro(a). Isso não é trair, é ser fiel demais!');
  await sasha.sendMessage(from, { text: `😐 @${sender.split('@')[0]} está tentando trair o(a) @${parceiro.split('@')[0]} com @${mentionTwo.split('@')[0]}...\n\n👀 Que feio, viu?! Alguém avisa o(a) @${parceiro.split('@')[0]}!`, mentions: [sender, parceiro, mentionTwo] }, { quoted: info });
break;

case 'briga':   
  if(!verifyGrupo) return await reply(responses.grupo());
  var user = await getUsuarioById(sender);
  var parceiro = user?.casamento?.parceiro || user?.namoro?.parceiro;
  if(!parceiro) return reply('Você nem está em um relacionamento. Vai brigar com quem?');
  const motivos = [
    'não lavou a louça',
    'curtiu a foto do(a) ex',
    'esqueceu o aniversário de namoro',
    'jogou sem responder',
    `trocou a @${parceiro.split('@')[0]} por outra`,
    'chamou de feio(a) na call'
  ];
  const motivo = motivos[Math.floor(Math.random() * motivos.length)];
  await sasha.sendMessage(from, { text: `😹 *BRIGA DE CASAL*\n\n@${sender.split('@')[0]} e @${parceiro.split('@')[0]} estão brigando porque *${motivo}*!\n\nAlguém separa esses dois...`, mentions: [sender, parceiro] }, { quoted: info });
break;

case 'reconciliar':
  if(!verifyGrupo) return await reply(responses.grupo());
  var user = await getUsuarioById(sender);
  var parceiro = user?.casamento?.parceiro || user?.namoro?.parceiro;
  if(!parceiro) return await reply('Não dá pra reconciliar sem um parceiro, né?');
  const frases = [
    'Prometo nunca mais esquecer de você.',
    'Vamos começar do zero.',
    'Você é o amor da minha vida, mesmo com defeitos.',
    'Me perdoa? Eu te amo demais.',
    'Eu estava errado(a). Você é tudo pra mim.'
  ];
  const frase = frases[Math.floor(Math.random() * frases.length)];
  await sasha.sendMessage(from, { text: `🤝 *RECONCILIAÇÃO* 🤝\n\n@${sender.split('@')[0]} se reconciliou com @${parceiro.split('@')[0]}.\n\n💬 “${frase}”\n\n💗 Que momento, gente...`, mentions: [sender, parceiro] }, { quoted: info });
break;

case 'aceito':
    if(!verifyGrupo) return await reply(responses.grupo());
    var usuario = await getOrCreateUsuario(sender);
    if(!usuario.conviteCasamento && !usuario.conviteNamoro) return await reply('💔 Você não tem pedidos pendentes.');
    var parceiro = usuario.conviteCasamento || usuario.conviteNamoro;
    var tipoRelacao = usuario.conviteCasamento ? 'casamento' : 'namoro';
    var dataRelacao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    await updateRelationShip(sender, parceiro, tipoRelacao, dataRelacao);
    await sasha.sendMessage(from, { text: `💒 *Agora é oficial!* 💒\n\n💍 ⤷ @${sender.split('@')[0]} e ⤷ @${parceiro.split('@')[0]} estão oficialmente ${tipoRelacao === 'casamento' ? 'casados' : 'namorando'}! ❤️\n\n📅 *Desde* ⤷ ${dataRelacao}`, mentions: [sender, parceiro] });
break;

case 'recusar':
    if(!verifyGrupo) return await reply(responses.grupo());
    var usuario = await getUsuarioById(sender);
    if(!usuario || (!usuario.conviteCasamento && !usuario.conviteNamoro)) {
        return await reply('💔 Você não tem pedidos pendentes para recusar.');
    }
    var parceiro = usuario.conviteCasamento || usuario.conviteNamoro;
    var dadosParceiro = await getUsuarioById(parceiro);
    usuario.conviteCasamento = null;
    usuario.conviteNamoro = null;
    dadosParceiro.pedidoCasamento = null;
    dadosParceiro.pedidoNamoro = null;
    await updateUsuario(sender, usuario);
    await updateUsuario(parceiro, dadosParceiro);
    await sasha.sendMessage(from, { text: `😔 *Pedido Recusado!*\n\n@${sender.split('@')[0]} recusou o pedido de @${parceiro.split('@')[0]}.\n\nNada de romance por hoje!`, mentions: [sender, parceiro] });
break;

case 'terminar': case 'divorciar':
    if(!verifyGrupo) return await reply(responses.grupo());
    var tipo = command === 'divorciar' ? 'casamento' : 'namoro';
    var usuario = await getOrCreateUsuario(sender);
    if(!usuario[tipo]) return await reply(`💔 Você não está em um ${tipo} para terminar.`);
    var parceiro = usuario[tipo].parceiro;
    await updateRelationShip(sender, parceiro, tipo);
    await sasha.sendMessage(from, { text: `💔 *Fim do ${tipo}!* 💔\n\n🚶 ⤷ @${sender.split('@')[0]} e ⤷ @${parceiro.split('@')[0]} não estão mais juntos.\n\n😢 Espero que encontrem felicidade!`, mentions: [sender, parceiro] });
break;

case 'cancelar-pedido':
    if(!verifyGrupo) return await reply(responses.grupo());
    var usuario = await getOrCreateUsuario(sender);
    var tipoPedido = usuario.pedidoCasamento ? 'casamento' : usuario.pedidoNamoro ? 'namoro' : null;
    if(!tipoPedido) return await reply('Você não tem pedidos pendentes para cancelar.');
    var parceiro = usuario[`pedido${tipoPedido.charAt(0).toUpperCase() + tipoPedido.slice(1)}`] || usuario[`convite${tipoPedido.charAt(0).toUpperCase() + tipoPedido.slice(1)}`];
    await updateRelationShip(sender, parceiro, tipoPedido);
    await sasha.sendMessage(from, { text: `*Pedido Cancelado!*\n\n💔 O pedido de ${tipoPedido} entre ⤷ @${sender.split('@')[0]} e ⤷ @${parceiro.split('@')[0]} foi cancelado.`, mentions: [sender, parceiro] });
break;

case 'minha-dupla': case 'dupla':
    if(!verifyGrupo) return await reply(responses.grupo());
    var usuario = await getOrCreateUsuario(sender);
    var tipoRelacao = usuario.casamento ? 'casamento' : usuario.namoro ? 'namoro' : null;
    if(!tipoRelacao) return await reply('💔 Você não tem uma dupla! Que tal encontrar alguém especial? 😢')
    var parceiro = usuario[tipoRelacao].parceiro;
    var dataRelacao = usuario[tipoRelacao].desde;
    var hoje = new Date();
    var dataInicio = new Date(dataRelacao);
    var anos = hoje.getFullYear() - dataInicio.getFullYear();
    var meses = (hoje.getMonth() - dataInicio.getMonth()) + anos * 12;
    var mensagemComemoracao = '';
    if(meses > 0 && meses % 12 === 0) {
        mensagemComemoracao = `\n\n🎉 Hoje vocês completam *${anos} ano(s)* juntos! 🎊`;
    } else if(meses > 0 && hoje.getDate() === dataInicio.getDate()) {
        mensagemComemoracao = `\n\n🎉 Hoje vocês completam *${meses} meses* juntos! 💕`;
    }
    await sasha.sendMessage(from, { text: `💞 *Sua Dupla* 💞\n\n💑 ⤷ @${sender.split('@')[0]} está em um ${tipoRelacao} com ⤷ @${parceiro.split('@')[0]}!\n📅 *Desde* ⤷ ${dataRelacao}${mensagemComemoracao}`, mentions: [sender, parceiro] });
break;

case 'chance':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Bora ativar o modo brincadeira, meu rei! 😏');
    if(query.length < 1) return sasha.sendMessage(from, { text: `Opa! Você esqueceu de dizer a sua dúvida! 😜\nExemplo: *${prefix}chance do biel bagaça o helizin* 🏳️‍🌈` }, { quoted: info });
    var random = `${Math.floor(Math.random() * 100)}`;
    await sasha.sendMessage(from, { text: `A chance de ${query}\n\né de ⤷ *${random}%*! 🔥😱` }, { quoted: info });
break;

case 'nazista':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 😏');
    await reply(`🔎 Analisando sua ficha secreta, @${senderNothing.split('@')[0]}... Isso pode ser preocupante. 👀`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '😇 Você é tão puro que poderia ser canonizado! Nem sombra dessas ideias!';
    } else if(random < 20) {
        var resposta = '🤔 Você já ouviu falar nisso, mas passou reto e foi tomar um café. Boa escolha!';
    } else if(random < 30) {
        var resposta = '😅 Hmm... Tem um pezinho na treta, mas nada que um bom livro de história não resolva.';
    } else if(random < 40) {
        var resposta = '😏 Começando a escorregar pro lado errado, hein? Melhor rever essas influências!';
    } else if(random < 50) {
        var resposta = '📖 Você já leu umas paradas estranhas... Melhor deixar essa vibe no passado, né?';
    } else if(random < 60) {
        var resposta = '⚠️ Seu histórico tá começando a ficar suspeito... O FBI já tá de olho!';
    } else if(random < 70) {
        var resposta = '🚨 Opa! O pessoal do tribunal de Haia tá te ligando... Melhor atender!';
    } else if(random < 80) {
        var resposta = '🔥 Tá andando num campo minado, hein? Se cuida pra não explodir junto!';
    } else if(random < 90) {
        var resposta = '🤨 Já tá flertando com as ideias erradas... Isso aí já virou um caso de estudo!';
    } else if(random < 100) {
        var resposta = '😱 Misericórdia! Se continuar assim, daqui a pouco vira documentário no History Channel!';
    } else {
        var resposta = '💀 Você desbloqueou um nível que nem deveria existir. FBI, pode levar!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Nazista }, caption: `*O quanto você é nazista, @${senderNothing.split('@')[0]}?* 卐\n\n*Você é ⤷ ${random}% nazista!* 😱\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'gay':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 🌈');
    await reply(`🏳️‍🌈 Calculando o nível de viadagem de @${senderNothing.split('@')[0]}... Isso pode ser revelador. 👀`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '😐 Você é mais hétero que comercial de barbeador masculino. Sem emoções, sem riscos, só camisa polo e futebol.';
    } else if(random < 20) {
        var resposta = '🤔 Às vezes bate uma vontade de cantar Lady Gaga no chuveiro, mas você finge que é só zoeira.';
    } else if(random < 30) {
        var resposta = '😏 Você já usou filtro de gatinho nos stories e gostou... Só não quer admitir.';
    } else if(random < 40) {
        var resposta = '👀 Você já elogiou um amigo e disse "sem maldade", mas no fundo sentiu um calorzinho diferente.';
    } else if(random < 50) {
        var resposta = '🌈 Você já viu uma calça skinny bonita e pensou "será que combina comigo?" Tá no caminho certo!';
    } else if(random < 60) {
        var resposta = '🔥 Você já rebolou na festa quando tocou Anitta... E foi o momento mais feliz da sua vida.';
    } else if(random < 70) {
        var resposta = '💅 O modo diva já tá ativado! Você finge que não, mas seu coração brilha quando toca Beyoncé.';
    } else if(random < 80) {
        var resposta = '🏳️‍🌈 Você já disse "vou beijar todo mundo hoje" e cumpriu! Só orgulho! 🌟';
    } else if(random < 90) {
        var resposta = '🥵 Sua energia gay é tão forte que faria até um hétero repensar a vida. Ícone!';
    } else if(random < 100) {
        var resposta = '✨ Você é um brilho ambulante! Se fosse mais gay, nascia purpurina!';
    } else {
        var resposta = '🌈🏳️‍🌈 Você não é só gay, você é o CEO da empresa GAY! Parabéns, líder da comunidade! 🎉';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Gay }, caption: `*O quanto você é gay, @${senderNothing.split('@')[0]}?* 🌈\n\n*Você é ⤷ ${random}% gay!* 😍\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'feio':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 😜');
    await reply(`🧐 Analisando a feiura de @${senderNothing.split('@')[0]}... Isso pode ser chocante! 😬`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '🤩 Você é tão bonito que poderia ser capa de revista! Talvez até do Photoshop, mas ainda conta!';
    } else if(random < 20) {
        var resposta = '😎 Você é charmoso(a), mas só quando a luz tá apagada. A noite te favorece!';
    } else if(random < 30) {
        var resposta = '😊 Você tem aquele feio charmoso, sabe? Aquele que as pessoas dizem "tem uma vibe legal"!';
    } else if(random < 40) {
        var resposta = '😅 Já ouviu alguém dizer "beleza não é tudo"? Então... Essa frase foi feita pra você!';
    } else if(random < 50) {
        var resposta = '🤔 Sua beleza é tipo Wi-Fi ruim... De vez em quando aparece, mas na maioria do tempo falha.';
    } else if(random < 60) {
        var resposta = '😂 Se a feiura fosse um esporte, você teria medalha de ouro!';
    } else if(random < 70) {
        var resposta = '👀 Olha... Não vou mentir, sua cara pode ter sido um acidente de percurso da genética.';
    } else if(random < 80) {
        var resposta = '💀 Sua feiura é tão forte que o espelho já pediu demissão!';
    } else if(random < 90) {
        var resposta = '🔥 Você não é feio(a), você é uma experiência estética incompreendida!';
    } else if(random < 100) {
        var resposta = '👹 Você é tão feio que até o Scooby-Doo sairia correndo sem precisar de mistério!';
    } else {
        var resposta = '💀 Você desbloqueou um nível de feiura nunca antes documentado. Os cientistas querem estudar você!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Feio }, caption: `*O quanto você é feio, @${senderNothing.split('@')[0]}?* 🤡\n\n*Você é ⤷ ${random}% feio!* 😱\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'corno':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 🐂💔');
    await reply(`🔎 Investigando a fidelidade no relacionamento de @${senderNothing.split('@')[0]}... Se prepara pra verdade! 👀`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '😎 Você é mais fiel que cão de guarda! Nunca nem sentiu cheiro de traição.';
    } else if(random < 20) {
        var resposta = '🤨 Tem um pezinho no corno, mas nada confirmado... Melhor ficar de olho!';
    } else if(random < 30) {
        var resposta = '😅 Já te chamaram de corno por brincadeira... Ou será que não era brincadeira?';
    } else if(random < 40) {
        var resposta = '👀 Sua situação tá meio suspeita... Melhor conferir aquele WhatsApp!';
    } else if(random < 50) {
        var resposta = '🐮 Tem alguém pegando seu amor escondido e você nem percebeu. Acorda, campeão!';
    } else if(random < 60) {
        var resposta = '😂 Você já foi corno uma vez e superou... Ou será que não?';
    } else if(random < 70) {
        var resposta = '💀 Sua testa já tá começando a brilhar... Acho que os chifres estão nascendo!';
    } else if(random < 80) {
        var resposta = '🔥 Seu status oficial: CORNO CONSCIENTE! Você sabe, mas aceita. Força guerreiro!';
    } else if(random < 90) {
        var resposta = '💔 Seu relacionamento tem mais gente do que uma festa. Você só não sabe ainda!';
    } else if(random < 100) {
        var resposta = '🐂 Seu nome já tá na lista do sindicato dos cornos! Aceita que dói menos!';
    } else {
        var resposta = '👑 PARABÉNS! Você é o REI DOS CORNOS! Seu chifre tem até reflexo!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Corno }, caption: `*O quanto você é corno, @${senderNothing.split('@')[0]}?* 🐂💔\n\n*Você é ⤷ ${random}% corno!* 😂\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'vesgo':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 👀💫');
    await reply(`👀 Analisando o grau de vesguice de @${senderNothing.split('@')[0]}... Se liga na avaliação! 🤓`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '😎 Seus olhos são mais alinhados que uma régua! Enxerga até pensamento.';
    } else if(random < 20) {
        var resposta = '🤔 Você tem um olhar misterioso... Ou só tá tentando focar direito?';
    } else if(random < 30) {
        var resposta = '😅 De vez em quando um olho vai pra um lado e o outro pro futuro, mas quase não dá pra notar!';
    } else if(random < 40) {
        var resposta = '👀 Seu olhar é tão confuso que quando você tira foto, a câmera pergunta "pra onde exatamente?"';
    } else if(random < 50) {
        var resposta = '💫 Você já viu um passarinho voando e um carro vindo ao mesmo tempo, sem querer!';
    } else if(random < 60) {
        var resposta = '😂 Seu grau de vesguice é médio... Às vezes parece que você tá encarando duas pessoas ao mesmo tempo!';
    } else if(random < 70) {
        var resposta = '👓 Seu oftalmologista já te deu atestado de confusão visual extrema!';
    } else if(random < 80) {
        var resposta = '🤯 Um olho seu vê o passado e o outro já tá no futuro... Sinistro!';
    } else if(random < 90) {
        var resposta = '🐸 Se botar um óculos, ele foge da sua cara! O fabricante não sabe pra onde apontar as lentes!';
    } else if(random < 100) {
        var resposta = '👀 Seu olhar é tão aleatório que parece até efeito especial de filme de terror!';
    } else {
        var resposta = '🌀 Você não é só vesgo... Você é um fenômeno óptico da natureza!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Vesgo }, caption: `*O quanto você é vesgo, @${senderNothing.split('@')[0]}?* 👀💫\n\n*Você é ⤷ ${random}% vesgo!* 😂\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'bebado':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 🍻');
    await reply(`🍺 Analisando o nível de cachaça de @${senderNothing.split('@')[0]}... Segura o copo e não cai! 🤪`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '🥤 Você é tão careta que até refrigerante sem gás te deixa tonto!';
    } else if(random < 20) {
        var resposta = '😎 Você só bebe socialmente... Ou seja, toda sexta-feira!';
    } else if(random < 30) {
        var resposta = '🍷 Você já tomou um vinho e fingiu que entendia de uvas.';
    } else if(random < 40) {
        var resposta = '🥴 Já deu aquela tropeçada voltando do rolê, mas nada sério... Ou pelo menos é o que você lembra!';
    } else if(random < 50) {
        var resposta = '🍻 Você bebe bem, mas só até começar a chamar ex no meio da festa!';
    } else if(random < 60) {
        var resposta = '🤪 Seus amigos já tiveram que te carregar pelo menos uma vez. Clássico!';
    } else if(random < 70) {
        var resposta = '🚨 Você já acordou sem lembrar de metade do rolê... E com novas amizades no zap!';
    } else if(random < 80) {
        var resposta = '💀 Seu fígado já pediu as contas! Se fosse dirigir, ia precisar de um GPS só pra andar reto!';
    } else if(random < 90) {
        var resposta = '🤢 Você já foi expulso de um bar por passar dos limites... Ou de vários!';
    } else if(random < 100) {
        var resposta = '🌀 Se fosse um Pokémon, seu ataque especial seria "Tornado de Cachaça"!';
    } else {
        var resposta = '🫠 Você é o próprio álcool em forma de gente! Se encostar no fósforo, pega fogo!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Bebado }, caption: `*O quanto você é bêbado, @${senderNothing.split('@')[0]}?* 🍻🥴\n\n*Você é ⤷ ${random}% bêbado!* 🤪\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'gado':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 🐮');
    await reply(`🐂 Calculando o nível de gadisse de @${senderNothing.split('@')[0]}... Será que vai dar vergonha? 👀`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '😎 Você não se apaixona fácil. Na verdade, tem coração de pedra!';
    } else if(random < 20) {
        var resposta = '🤨 Você até se ilude, mas não corre atrás. Respeitável!';
    } else if(random < 30) {
        var resposta = '😂 Já gastou uns trocados com crush, mas nada exagerado... Eu acho.';
    } else if(random < 40) {
        var resposta = '👀 Você já mandou um "bom dia, princesa" e se arrependeu depois.';
    } else if(random < 50) {
        var resposta = '💔 Seu currículo já tem algumas sofrências, mas ainda dá pra salvar!';
    } else if(random < 60) {
        var resposta = '🔥 Você já levou vácuo e insistiu... Mas quem nunca, né?';
    } else if(random < 70) {
        var resposta = '🤡 Se tivesse um reality show de gado, você estaria na final!';
    } else if(random < 80) {
        var resposta = '📲 Se "responde na hora" fosse profissão, você tava milionário!';
    } else if(random < 90) {
        var resposta = '🐮 Seu chip já foi clonado de tanto que você corre atrás!';
    } else if(random < 100) {
        var resposta = '😵 Seu status oficial: GADO MASTER SUPREMO! Resiste a nada!';
    } else {
        var resposta = '👑 PARABÉNS! Você é o REI DO GADO! Seu CPF já tá no nome do(a) crush!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Gado }, caption: `*O quanto você é gado, @${senderNothing.split('@')[0]}?* 🐮💔\n\n*Você é ⤷ ${random}% gado!* 😂\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'gostoso':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 😏🔥');
    await reply(`🔥 Calculando o nível de gostosura de @${senderNothing.split('@')[0]}... Fica tranquilo, só elogios! 😎`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '🤢 Você é tão gostoso quanto um pão amanhecido... melhor tentar de novo!';
    } else if(random < 20) {
        var resposta = '🤨 Tem um charme, mas tá mais pra “gostoso de olhar na vitrine”!';
    } else if(random < 30) {
        var resposta = '😏 Tá melhorando, mas ainda não virou o crush de ninguém... quase lá!';
    } else if(random < 40) {
        var resposta = '🍒 Tem potencial, mas só com um toque de make e estilo você fica irado!';
    } else if(random < 50) {
        var resposta = '💥 Já tá no nível "eu até olharia na rua", mas vamos dar uma caprichada no look!';
    } else if(random < 60) {
        var resposta = '💪 Se melhorar mais um pouco, vai virar capa de revista!';
    } else if(random < 70) {
        var resposta = '🔥 Chegou no nível “top do rolê”, você é o cara que todo mundo nota!';
    } else if(random < 80) {
        var resposta = '👑 Galã de novela, sim ou com certeza? Arrasa até embaixo d’água!';
    } else if(random < 90) {
        var resposta = '💥 Você é o sonho da galera! Se passar, a rua para só pra te ver!';
    } else if(random < 100) {
        var resposta = '😎 Cuidado! Sua beleza tá deixando o ambiente quente... vai virar meme!';
    } else {
        var resposta = '🔥 Nível máximo de gostosura! Se o sol te olhar, ele vai pedir dica de beleza!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Gostoso }, caption: `*O quanto você é gostoso, @${senderNothing.split('@')[0]}?* 😏🔥\n\n*Você é ⤷ ${random}% gostoso!* 🤩\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'gostosa':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amiga! 😏🔥');
    await reply(`🔥 Calculando o nível de gostosura de @${senderNothing.split('@')[0]}... Fica tranquila, só elogios! 😎`);
    var random = Math.floor(Math.random() * 110);
    if(random < 10) {
        var resposta = '🤢 Você é tão gostosa quanto um bolo queimado... tenta de novo, vai!';
    } else if(random < 20) {
        var resposta = '🤨 Tem um charme, mas ainda está mais pra “gostosa na foto com filtro”!';
    } else if(random < 30) {
        var resposta = '😏 Tá melhorando, mas ainda falta aquele “tchãn” de novela!';
    } else if(random < 40) {
        var resposta = '🍒 Tá quase lá, mas que tal um look mais ousado pra arrasar no rolê?';
    } else if(random < 50) {
        var resposta = '💥 Já tá no nível “só falta um close de rainha pra ser a sensação da balada”!';
    } else if(random < 60) {
        var resposta = '💪 Tá no caminho certo, dá pra ver que você arrasaria em qualquer evento!';
    } else if(random < 70) {
        var resposta = '🔥 O pessoal para de conversar quando você entra na sala... sempre um destaque!';
    } else if(random < 80) {
        var resposta = '👑 Você virou um ícone! Com essa beleza, todo mundo quer ser seu amigo!';
    } else if(random < 90) {
        var resposta = '💥 Você é a musa do rolê! Só falta a galera aplaudir quando você passar!';
    } else if(random < 100) {
        var resposta = '😎 A rua vai parar quando você andar, só pra admirar sua beleza!';
    } else {
        var resposta = '🔥 Nível máximo de gostosura! Se sua beleza fosse um filme, seria um blockbuster de sucesso!';
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].Gostosa }, caption: `*O quanto você é gostosa, @${senderNothing.split('@')[0]}?* 😏🔥\n\n*Você é ⤷ ${random}% gostosa!* 🤩\n\n${resposta}`, mentions: [senderNothing] }, { quoted: info });
break;

case 'matar':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Tem que estar no modo brincadeira, amigão! 😏');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer mandar pro além ☠️');
    var modosDeMorte = [
        "com um golpe de katana afiada", 
        "com um tiro de sniper à distância", 
        "com um soco tão forte que foi parar no espaço", 
        "jogando da ponte e gritando 'voa, passarinho!'", 
        "dando um Hadouken na cara", 
        "com um feitiço proibido de magia negra", 
        "só de olhar feio", 
        "colocando uma banana no chão e vendo escorregar", 
        "fazendo cócegas até a morte", 
        "envenenando a comida sem ninguém perceber", 
        "explodindo igual em filme de ação", 
        "jogando no meio de uma briga de gatos raivosos"
    ];
    var metodoMorte = modosDeMorte[Math.floor(Math.random() * modosDeMorte.length)];
    var mensagens = [
        `💀 *@${sender.split('@')[0]}* matou @${mentionTwo.split('@')[0]} ${metodoMorte}. Descanse em paz!`,
        `☠️ *@${sender.split('@')[0]}* não teve piedade e eliminou @${mentionTwo.split('@')[0]} ${metodoMorte}. Que brutalidade!`,
        `😂 *@${sender.split('@')[0]}* tentou matar @${mentionTwo.split('@')[0]}, mas escorregou e se matou sozinho(a)! BURRO(A)!`,
        `💀 *@${sender.split('@')[0]}* foi matar @${mentionTwo.split('@')[0]}, mas errou o alvo e acabou eliminando um inocente. Ops!`,
        `🔥 *@${sender.split('@')[0]}* matou @${mentionTwo.split('@')[0]} ${metodoMorte} e agora está sendo procurado pela polícia! 🚔`,
        `⚰️ *@${sender.split('@')[0]}* apagou @${mentionTwo.split('@')[0]}, e já estão vendendo espaço no cemitério!`,
        `🤣 *@${sender.split('@')[0]}* tentou matar @${mentionTwo.split('@')[0]}, mas a arma falhou e agora quem tá correndo é ele(a)!`,
        `👻 *@${sender.split('@')[0]}* matou @${mentionTwo.split('@')[0]}, mas o espírito voltou pra assombrar ele(a)!`,
        `💀 *@${sender.split('@')[0]}* deu fim em @${mentionTwo.split('@')[0]} ${metodoMorte}. Agora só resta a lenda!`,
        `😵 *@${sender.split('@')[0]}* tentou matar @${mentionTwo.split('@')[0]}, mas o plano falhou e acabou virando o alvo!`
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Matar }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;

case 'beijo': case 'beijar': case 'beija':
case 'beijar':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Pera aí! Só no modo brincadeira funciona, se liga! 😆');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer dar aquele beijo 😘');
    var tempos = [
        "2 segundos", "30 segundos", "5 minutos", "10 minutos", "1 hora", 
        "o tempo de um suspiro", "o suficiente para se apaixonar", 
        "tão rápido que ninguém viu", "com gosto de chiclete de menta", 
        "até perder o fôlego"
    ];
    var tempoBeijo = tempos[Math.floor(Math.random() * tempos.length)];
    var mensagens = [
        `💋 *@${sender.split('@')[0]}* deu aquele beijo cinematográfico em @${mentionTwo.split('@')[0]} e durou ${tempoBeijo}! 😍🔥`,
        `😳 *@${sender.split('@')[0]}* tentou beijar @${mentionTwo.split('@')[0]}, mas tomou um desvio de rosto e beijou o vento! 💀`,
        `😂 *@${sender.split('@')[0]}* chegou confiante pra beijar @${mentionTwo.split('@')[0]}, mas só ganhou um "eu te vejo como amigo(a)" 💔`,
        `🥵 *@${sender.split('@')[0]}* beijou @${mentionTwo.split('@')[0]} com tanta vontade que até esqueceram de respirar!`,
        `👀 *@${sender.split('@')[0]}* deu um selinho tímido em @${mentionTwo.split('@')[0]}, mas agora quer casar!`,
        `💀 *@${sender.split('@')[0]}* foi dar um beijo em @${mentionTwo.split('@')[0]}, mas acabou levando um tapa KKKKKK`,
        `😂 *@${sender.split('@')[0]}* tentou beijar @${mentionTwo.split('@')[0]}, mas a pessoa virou o rosto na hora e ficou um clima estranho...`,
        `😏 *@${sender.split('@')[0]}* beijou @${mentionTwo.split('@')[0]} e agora a pessoa não para de mandar mensagem. Deu ruim!`,
        `💋 *@${sender.split('@')[0]}* beijou @${mentionTwo.split('@')[0]} com tanta emoção que até trilha sonora romântica tocou no fundo! 🎶`,
        `🤣 *@${sender.split('@')[0]}* foi dar um beijo em @${mentionTwo.split('@')[0]}, mas os dentes bateram e agora a vergonha é eterna!`,
        `🔥 *@${sender.split('@')[0]}* e @${mentionTwo.split('@')[0]} deram um beijo tão intenso que até os vizinhos sentiram o clima! 😏`
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Kisses }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;

case 'comer':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Pera aí! Só no modo brincadeira funciona, se liga! 😆');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer dar aquele talento 😏');
    var tempos = [
        "2 minutos", "30 segundos", "15 minutos", "1 hora", "7 minutos", 
        "só de olhar", "só no pensamento", "5 minutos", "1 segundo e já era", 
        "uma eternidade", "um piscar de olhos", "rápido demais pra perceber"
    ];
    var tempoGozou = tempos[Math.floor(Math.random() * tempos.length)];
    var mensagens = [
        `🔥 *@${sender.split('@')[0]}* pegou @${mentionTwo.split('@')[0]} com vontade e finalizou em ${tempoGozou}! Pegou pesado! 😏`,
        `🤣 *@${sender.split('@')[0]}* foi com tudo pra cima de @${mentionTwo.split('@')[0]}, mas só conseguiu um "obrigado pelo carinho". Triste fim!`,
        `🤡 *@${sender.split('@')[0]}* foi tentar alguma coisa com @${mentionTwo.split('@')[0]}, mas no final só ganhou um belo bloqueio!`,
        `👀 *@${sender.split('@')[0]}* e @${mentionTwo.split('@')[0]} tentaram algo, mas um dos dois broxou. Quem foi? 🫣`,
        `🔥 *@${sender.split('@')[0]}* partiu pro ataque e deixou @${mentionTwo.split('@')[0]} sem andar por uma semana! Socorro! 😳`,
        `💀 *@${sender.split('@')[0]}* quis impressionar @${mentionTwo.split('@')[0]}, mas no final quem levou foi ele(a)...`,
        `😂 *@${sender.split('@')[0]}* tava animado, mas quando viu @${mentionTwo.split('@')[0]} pelado(a), broxou na hora!`,
        `🫣 *@${sender.split('@')[0]}* fez tudo com @${mentionTwo.split('@')[0]}, mas foi tão rápido que nem deu tempo de aproveitar! (${tempoGozou})`,
        `💔 *@${sender.split('@')[0]}* até tentou, mas @${mentionTwo.split('@')[0]} disse "hoje não, quem sabe um dia..."`,
        `🥵 *@${sender.split('@')[0]}* e @${mentionTwo.split('@')[0]} tiveram uma noite intensa... ou pelo menos tentaram!`,
        `🔥 *@${sender.split('@')[0]}* pegou @${mentionTwo.split('@')[0]} e agora tá apaixonado(a), alguém avisa que era só uma brincadeira? 😆`
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Sexo }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;

case 'molestar':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Pera aí! Só no modo brincadeira funciona, se liga! 😆');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer dar aquele talento 😏');
    var tempos = [
        "2 minutos", "30 segundos", "15 minutos", "1 hora", "7 minutos", 
        "só de olhar", "só no pensamento", "5 minutos", "1 segundo e já era", 
        "uma eternidade", "um piscar de olhos", "rápido demais pra perceber"
    ];
    var tempoGozou = tempos[Math.floor(Math.random() * tempos.length)];
    var mensagens = [
        `🔥 *@${sender.split('@')[0]}* pegou @${mentionTwo.split('@')[0]} com vontade e finalizou em ${tempoGozou}! Pegou pesado! 😏`,
        `🤣 *@${sender.split('@')[0]}* foi com tudo pra cima de @${mentionTwo.split('@')[0]}, mas só conseguiu um "obrigado pelo carinho". Triste fim!`,
        `🤡 *@${sender.split('@')[0]}* foi tentar alguma coisa com @${mentionTwo.split('@')[0]}, mas no final só ganhou um belo bloqueio!`,
        `👀 *@${sender.split('@')[0]}* e @${mentionTwo.split('@')[0]} tentaram algo, mas um dos dois broxou. Quem foi? 🫣`,
        `🔥 *@${sender.split('@')[0]}* partiu pro ataque e deixou @${mentionTwo.split('@')[0]} sem andar por uma semana! Socorro! 😳`,
        `💀 *@${sender.split('@')[0]}* quis impressionar @${mentionTwo.split('@')[0]}, mas no final quem levou foi ele(a)...`,
        `😂 *@${sender.split('@')[0]}* tava animado, mas quando viu @${mentionTwo.split('@')[0]} pelado(a), broxou na hora!`,
        `🫣 *@${sender.split('@')[0]}* fez tudo com @${mentionTwo.split('@')[0]}, mas foi tão rápido que nem deu tempo de aproveitar! (${tempoGozou})`,
        `💔 *@${sender.split('@')[0]}* até tentou, mas @${mentionTwo.split('@')[0]} disse "hoje não, quem sabe um dia..."`,
        `🥵 *@${sender.split('@')[0]}* e @${mentionTwo.split('@')[0]} tiveram uma noite intensa... ou pelo menos tentaram!`,
        `🔥 *@${sender.split('@')[0]}* pegou @${mentionTwo.split('@')[0]} e agora tá apaixonado(a), alguém avisa que era só uma brincadeira? 😆`
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Molesta }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;

case 'molesta':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Pera aí! Só no modo brincadeira funciona, se liga! 😆');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer dar aquela perturbaçãozinha 😏');
    var tempos = [
        "2 minutos", "30 segundos", "15 minutos", "1 hora", "7 minutos", 
        "só de olhar", "só no pensamento", "5 minutos", "1 segundo e já era", 
        "uma eternidade", "um piscar de olhos", "rápido demais pra perceber"
    ];
    var tempoGozou = tempos[Math.floor(Math.random() * tempos.length)];
    var mensagens = [
        `😏 *@${sender.split('@')[0]}* deu aquela perturbada em @${mentionTwo.split('@')[0]} e a coisa esquentou rapidinho! (${tempoGozou}) 🔥`,
        `🤣 *@${sender.split('@')[0]}* tentou molestar @${mentionTwo.split('@')[0]}, mas só conseguiu um "sai fora!" 💀`,
        `👀 *@${sender.split('@')[0]}* chegou cheio(a) de marra pra cima de @${mentionTwo.split('@')[0]}, mas no fim levou um vácuo épico!`,
        `🔥 *@${sender.split('@')[0]}* passou a mão em @${mentionTwo.split('@')[0]}, e agora tá correndo da polícia! 🚔💨`,
        `💀 *@${sender.split('@')[0]}* tentou molestar @${mentionTwo.split('@')[0]}, mas no final quem foi molestado(a) foi ele(a)! KKKKK`,
        `😂 *@${sender.split('@')[0]}* foi pra cima de @${mentionTwo.split('@')[0]}, mas tropeçou e caiu de cara no chão. Tentativa falha!`,
        `🫣 *@${sender.split('@')[0]}* tentou, tentou e tentou, mas @${mentionTwo.split('@')[0]} só respondeu com um "kkkkkk" e foi dormir!`,
        `🥵 *@${sender.split('@')[0]}* perturbou tanto @${mentionTwo.split('@')[0]} que agora ele(a) tá apaixonado(a)! Socorro!`,
        `🔥 *@${sender.split('@')[0]}* botou @${mentionTwo.split('@')[0]} no canto e deu aquela moléstia boa... O clima esquentou!`,
        `😂 *@${sender.split('@')[0]}* tentou molestar @${mentionTwo.split('@')[0]}, mas no fim ficou só no "oi, sumido(a)" e nada mais. 💀`
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Molesta }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;
    
case 'mamar':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Pera aí! Só no modo brincadeira funciona, se liga! 😆');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer dar aquela mamada 😏');
    var tempos = [
        "2 minutos", "30 segundos", "15 minutos", "1 hora", "7 minutos", 
        "só de olhar", "só no pensamento", "5 minutos", "1 segundo e já era", 
        "uma eternidade", "um piscar de olhos", "rápido demais pra perceber"
    ];
    var tempoGozou = tempos[Math.floor(Math.random() * tempos.length)];
    var mensagens = [
        `👄 *@${sender.split('@')[0]}* desceu com vontade e mamou @${mentionTwo.split('@')[0]} em apenas ${tempoGozou}! 🚀🔥`,
        `😂 *@${sender.split('@')[0]}* foi dar aquela mamada em @${mentionTwo.split('@')[0]}, mas engasgou no caminho! 💀`,
        `🤡 *@${sender.split('@')[0]}* tentou mamar @${mentionTwo.split('@')[0]}, mas a única coisa que recebeu foi um "vai dormir, fi". Triste fim!`,
        `🫣 *@${sender.split('@')[0]}* foi cheio(a) de sede ao pote, mas quando viu o tamanho, desistiu rapidinho!`,
        `🔥 *@${sender.split('@')[0]}* deu aquela mamada caprichada em @${mentionTwo.split('@')[0]} e agora não quer mais largar! Socorro! 🥵`,
        `💀 *@${sender.split('@')[0]}* tentou mamar @${mentionTwo.split('@')[0]}, mas no final acabou sendo mamado(a)! KKKKKK`,
        `😂 *@${sender.split('@')[0]}* tava animado(a), mas quando chegou na hora, @${mentionTwo.split('@')[0]} só queria conversar sobre a vida... QUEBROU O CLIMA! 💀`,
        `😳 *@${sender.split('@')[0]}* mamou tão bem @${mentionTwo.split('@')[0]} que agora a pessoa tá apaixonada! Como resolver isso agora?`,
        `🔥 *@${sender.split('@')[0]}* desceu cheio(a) de vontade e agora @${mentionTwo.split('@')[0]} não para de mandar mensagem! Pegou gosto, hein?`,
        `😂 *@${sender.split('@')[0]}* tentou mamar @${mentionTwo.split('@')[0]}, mas na hora H disse que era só brincadeira e fugiu correndo!`,
        `🥵 *@${sender.split('@')[0]}* deu aquela mamada insana em @${mentionTwo.split('@')[0]} e deixou a pessoa sem palavras! Socorro!`
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Mamar }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;

case 'biografia':
    try {
        var status = await sasha.fetchStatus(mentionEveryone);  
    } catch {
        var status = 'Privado ou não encontrado. 😅';
    }
    await reply(status.status);
break;

case 'tapa':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 😏');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer dar aquele tapão! 👋');
    var intensidade = ['de leve', 'forte', 'estourado', 'explosivo', 'de outro mundo', 'sem pena', 'com carinho'];
    var tipoTapa = ['na cara', 'na nuca', 'no cangote', 'na orelha', 'no peito', 'na testa', 'no braço', 'nas costas', 'na raba 🍑'];
    var forca = intensidade[Math.floor(Math.random() * intensidade.length)];
    var local = tipoTapa[Math.floor(Math.random() * tipoTapa.length)];
    var mensagens = [
        `💥 *@${sender.split('@')[0]}* deu um tapa *${forca}* *${local}* em @${mentionTwo.split('@')[0]}! Isso doeu até em mim! 😵`,
        `👋 @${mentionTwo.split('@')[0]} levou um tapão *${forca}* *${local}* de *@${sender.split('@')[0]}*! Tá ardendo, hein? 🤭`,
        `😈 *@${sender.split('@')[0]}* não teve dó e distribuiu um tapa *${forca}* *${local}* em @${mentionTwo.split('@')[0]}! Que agressividade! 🫣`,
        `🔥 Opa! Rolou um tapa *${forca}* *${local}* entre *@${sender.split('@')[0]}* e @${mentionTwo.split('@')[0]}! Já pode marcar revanche? 👀`,
        `🤣 @${mentionTwo.split('@')[0]} achou que ia escapar, mas *@${sender.split('@')[0]}* mandou um tapa *${forca}* *${local}*! Eita! 👏`,
        `💨 O tapa *${forca}* *${local}* que *@${sender.split('@')[0]}* deu em @${mentionTwo.split('@')[0]} foi tão forte que até ecoou! 🔊`,
        `🍑 Oxe! *@${sender.split('@')[0]}* deu um tapa *${forca}* *na raba* de @${mentionTwo.split('@')[0]}! Já pode mandar a coreografia do TikTok! 😂`,
        `🤠 @${mentionTwo.split('@')[0]} tomou um tapão *${forca}* *na raba* de *@${sender.split('@')[0]}*! Agora só falta o cavalo e a música sertaneja! 🐎🎶`,
        `🔥 A raba de @${mentionTwo.split('@')[0]} foi agraciada com um tapa *${forca}* de *@${sender.split('@')[0]}*! Aplausos para essa obra de arte! 👏`,
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Tapa }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;

case 'chute':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('A brincadeira só rola no modo brincadeira! Bora ativar ele, amigão! 😏');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque a pessoa que você quer dar aquele chutão! 🦵💥');
    var intensidade = ['de leve', 'forte', 'estourado', 'explosivo', 'de outro mundo', 'sem pena', 'com carinho'];
    var tipoChute = ['na perna', 'na bunda 🍑', 'na barriga', 'na costela', 'no braço', 'na canela 🔥', 'no peito', 'na coxa', 'no tornozelo', 'na cara 🤕'];
    var forca = intensidade[Math.floor(Math.random() * intensidade.length)];
    var local = tipoChute[Math.floor(Math.random() * tipoChute.length)];
    var mensagens = [
        `💥 *@${sender.split('@')[0]}* deu um chute *${forca}* *${local}* em @${mentionTwo.split('@')[0]}! Esse foi digno de UFC! 🥋`,
        `👢 @${mentionTwo.split('@')[0]} levou um bicudão *${forca}* *${local}* de *@${sender.split('@')[0]}*! Já pode chamar o SAMU? 🚑`,
        `😈 *@${sender.split('@')[0]}* acertou um chute *${forca}* *${local}* em @${mentionTwo.split('@')[0]}! Espero que tenha seguro saúde... 😅`,
        `🔥 Opa! Rolou um chute *${forca}* *${local}* entre *@${sender.split('@')[0]}* e @${mentionTwo.split('@')[0]}! Vingança à vista? 👀`,
        `🤣 @${mentionTwo.split('@')[0]} achou que tava tranquilo, mas *@${sender.split('@')[0]}* meteu um chutão *${forca}* *${local}*! TÁ VOANDO! 🛫`,
        `⚽ O chute *${forca}* *${local}* de *@${sender.split('@')[0]}* fez @${mentionTwo.split('@')[0]} rodar igual Beyblade! var IT RIP! 😂`,
        `🥋 Oxe! *@${sender.split('@')[0]}* aplicou um chute *${forca}* *${local}* em @${mentionTwo.split('@')[0]}! Treinando pra ser lutador de MMA? 🤜`,
        `💨 O impacto foi tão forte que @${mentionTwo.split('@')[0]} saiu voando com o chute *${forca}* *${local}*! Precisamos de um VAR aqui! 📺😂`,
    ];
    var mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    await sasha.sendMessage(from, { video: { url: images['Brincadeiras']['Cards'].Chute }, gifPlayback: true, caption: mensagemAleatoria, mentions: [mentionTwo, sender] }, { quoted: info });
break;

case 'dogolpe':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Precisa estar no modo brincadeira para usar esse comando! 😅');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque o @ do usuário ou a mensagem do comando. 😬');
    var golpe = Math.floor(Math.random() * 100);
    await sasha.sendMessage(from, { text: `*Golpista Encontrado 👉🏻*\n\n*golpista*: *@${mentionTwo.split('@')[0]}*\n*porcentagem do golpe*: ${golpe}% 😂\n\nEle(a) gosta de ferir sentimentos 😢`, mentions: [mentionTwo]});
break;

case 'casais': 
  if(!verifyGrupo) return await reply(responses.grupo());
  var todosUsuarios = await getUsuarios(); 
  var listaCasais = [];
  var jaListados = new Set();
  for (var user of todosUsuarios) {
    var { id, casamento, namoro } = user;
    var parceiro = casamento?.parceiro || namoro?.parceiro;
    if(parceiro && !jaListados.has(id) && !jaListados.has(parceiro)) {
      const desde = casamento?.desde || namoro?.desde || 'Data desconhecida';
      const tipo = casamento ? 'Casados' : 'Namorados';
      listaCasais.push({ um: id, dois: parceiro, tipo, desde });
      jaListados.add(id);
      jaListados.add(parceiro);
    }
  }
  if(listaCasais.length === 0) {
    return reply('💔 Nenhum casal registrado até o momento. Que tal formar o primeiro casal?');
  }
  var texto = `💞 *Lista de todos os Casais* 💞\n\n`;
  for (var i = 0; i < listaCasais.length; i++) {
    const casal = listaCasais[i];
    texto += `*${i + 1}. ${casal.tipo}*:\n⤷ @${casal.um.split('@')[0]} e @${casal.dois.split('@')[0]}\n⤷ Data que começaram ${casal.tipo === 'Namorados' ? 'a namorar' : 'o casamento'}: ${casal.desde}\n—\n`;
  }
  var mentions = listaCasais.flatMap(c => [c.um, c.dois]);
  await sasha.sendMessage(from, { text: texto, mentions });
  break;

case 'casal': case 'shippo': case 'shipo':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Só funciona no modo brincadeira, beleza? 😅');
    await mention(`🌟👩🏼‍❤️‍💋‍👨🏻 ⤷ Sinto uma química muito forte entre *@${groupMembers[Math.floor(Math.random() * groupMembers.length)].id.split('@')[0]} & @${groupMembers[Math.floor(Math.random() * groupMembers.length)].id.split('@')[0]}*, com uma chance de dar certo: *${Math.floor(Math.random() * 100)+'%'}*.`)
break;

case 'ranking': case 'rankativos': case 'rankativo': 
    if(!verifyGrupo) return await reply(responses.grupo())
    var grupo = await collections.rankMessages.findOne({ _id: from });

    if(grupo && grupo.users && Array.isArray(grupo.users)) {
        var ativos = grupo.users;
        ativos.sort((a, b) => (b.stickers + b.messages + b.commands) - (a.stickers + a.messages + a.commands));

        var menc = [];
        var response = `*Rank Dos Mais Ativos no Grupo: ${groupName}!*\n`;

        for (var i = 0; i < Math.min(5, ativos.length); i++) {
            var user = ativos[i];
            response += `\n*${i + 1}º:* ⤷ @${user.id.split('@')[0]}\n`;
            response += `⤷ Contagem de mensagens enviadas no grupo pelo usuário(a): *${user.messages || 'Sem Informações'}*\n`;
            response += `⤷ Contagem de comandos usados no grupo pelo usuário(a): *${user.commands || 'Sem Informações'}*\n`;
            response += `⤷ Contagem de figurinhas enviadas no grupo pelo usuário(a): *${user.stickers || 'Sem Informações'}*\n—\n`;
            menc.push(user.id);
        }

        await sasha.sendMessage(from, { text: response, mentions: menc }, { quoted: info });
    } else {
        await reply('Sem informações suficientes para gerar o ranking.');
    }
break;

case 'checkativo':
    if(!verifyGrupo) return await reply(responses.grupo());
    var grupo = await collections.rankMessages.findOne({ _id: from });
    if(!grupo) return await reply('Parece que o bot ainda não tem dados sobre esse grupo, vamos começar a contar! 😅');
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marca o @ direitinho e só um de cada vez, amigo! 😏');
    var userStats;
    if(grupo.users && Array.isArray(grupo.users)) {
        var user = grupo.users.find(u => u.id === mentionTwo);
        if(user) {
            userStats = user;
        }
    }
    if(userStats) {
        var data = `Consulta da atividade de: @${mentionTwo.split('@')[0]} no grupo: *${groupName}*\n⤷ Mensagens enviadas pelo usuário(a): *${userStats.messages}*\n⤷ Comandos usados pelo usuário(a): *${userStats.commands}*\n⤷ Usuário(a) Conectado em: *${userStats.device}*\n⤷ Figurinhas enviadas pelo usuário(a): *${userStats.stickers}*`;
        await sasha.sendMessage(from, { text: data, mentions: [mentionTwo] }, { quoted: info });
    } else {
        await reply('Informações do usuário não encontradas.');
    }
break;
    
case 'inativos':
case 'inativo':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(query.match(/[a-z]/i) || !query) {
        return await reply(`Exemplo: ${prefix + command} 0\nIsso mostrará quantas pessoas têm 0 mensagens no grupo, e se usar 5, vai mostrar quantos usuários têm 5 mensagens ou menos.`);
    }
    var groupDoc = await collections.rankMessages.findOne({ _id: from });
    if(!groupDoc || !groupDoc.users || groupDoc.users.length === 0) {
        return await reply(`Nenhum dado de mensagens encontrado para este grupo.`);
    }
    var threshold = parseInt(query.trim());
    var mencionados = [];
    var membersIds = groupMembers.map(i => i.id);
    for (var user of groupDoc.users) {
        var { id, messages = 0, commands = 0, stickers = 0 } = user;
        var isInactive = messages <= threshold && commands <= threshold && stickers <= threshold;
        var isValid = id.length > 5 && !groupAdmins.includes(id) && !donos.includes(id) && id !== botNumber;
        if(isInactive && isValid && membersIds.includes(id)) {
            mencionados.push(id);
        }
    }
    for (var user of groupDoc.users) {
        if(!membersIds.includes(user.id) && user.id.length > 5) {
            mencionados.push(user.id);
        }
    }
    if(mencionados.length === 0) {
        return await reply(`Não há pessoas com ${threshold} mensagens ou menos.`);
    }
    var text = `Usuários com ${threshold} mensagem(ns) pra baixo..\n\n`;
    for (var i = 0; i < mencionados.length; i++) {
        text += `${i + 1} ⤷ Usuário: @${mencionados[i].split('@')[0]}\n\n`;
    }
    await sasha.sendMessage(from, { text, mentions: mencionados }, { quoted: info });
break;

case 'tirarctt':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(!mentionTwo || mentionJidTwo[1]) return await reply('Marque o usuário ou @dele(a), mas sem exageros, hein? Só um por vez!');
    var groupDoc = await collections.rankMessages.findOne({ _id: from });
    if(!groupDoc) return await reply('Grupo não encontrado na base.');
    var userExists = groupDoc.users.some(u => u.id === mentionTwo);
    if(!userExists) return await reply('Usuário não encontrado nas estatísticas do grupo.');
    await collections.rankMessages.updateOne(
        { _id: from },
        { $pull: { users: { id: mentionTwo } } }
    );
    await sasha.groupParticipantsUpdate(from, [mentionTwo], 'remove');
    await sasha.sendMessage(from, { text: `O usuário @${mentionTwo.split('@')[0]} foi removido com sucesso do grupo e das estatísticas.` }, { quoted: info });
break;
    
case 'banghost':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!membersSupreme) return await reply(responses.admin());
    if(query.match(/[a-z]/i) || !query || query.length > 3) {
        return await reply(`Por favor, forneça um número válido de mensagens. Exemplo: \n${prefix + command} 0\nIsso irá mostrar e remover usuários com 0 mensagens ou menos.`);
    }
    var groupDoc = await collections.rankMessages.findOne({ _id: from });
    if(!groupDoc || !Array.isArray(groupDoc.users)) {
        return await reply(`O grupo ainda não tem estatísticas registradas.`);
    }
    var threshold = Number(query.trim());
    var membersIds = groupMembers.map(i => i.id);
    var inativos = [];
    for (var user of groupDoc.users) {
        var id = user.id;
        var messages = user.messages || 0;
        var stickers = user.stickers || 0;
        var commands = user.commands || 0;
        if(
            messages <= threshold &&
            stickers <= threshold &&
            commands <= threshold &&
            !groupAdmins.includes(id) &&
            !donos.includes(id) &&
            id !== botNumber &&
            membersIds.includes(id)
        ) {
            inativos.push(id);
        }
    }
    for (var user of groupDoc.users) {
        var id = user.id;
        if(!membersIds.includes(id) && id.length > 5) {
            inativos.push(id);
        }
    }
    if(inativos.length === 0) {
        return await reply(`Não há usuários com ${threshold} mensagem(ns) ou menos para remover no grupo.`);
    }
    for (var i = 0; i < inativos.length; i++) {
        await sasha.groupParticipantsUpdate(from, [inativos[i]], 'remove');
        await collections.rankMessages.updateOne(
            { _id: from },
            { $pull: { users: { id: inativos[i] } } }
        );
    }
    await sasha.sendMessage(from, { text: `Os usuários inativos com ${threshold} mensagem(ns) ou menos foram removidos com sucesso.` }, { quoted: info });
break;

case 'rankgay': case 'rankgays':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira!');
    var data = `🌈 Rank Dos 5 Mais Gays Do Grupo ⤷ ${groupName}\n—\n`;
    var mensagens = [
        '🏆 Ícone! O mais colorido do grupo! 😍✨',
        '🔥 Esse aqui brilha mais que glitter na balada! 💃',
        '😏 Já pode pedir música no Fantástico, três ranks seguidos!',
        '🌟 Esse aqui desfila na passarela do arco-íris!',
        '💅 Vibes de diva pop, não há como negar!',
        '👠 Já tá na final do RuPaul’s Drag Race!',
        '🎤 Se der um microfone, canta "I Will Survive" na hora!',
        '📸 Se fosse famoso, já teria capa na Vogue!',
        '💃 Esse já entra nos lugares ao som de Lady Gaga!',
        '🕺 Um verdadeiro rei (ou rainha) da dança!',
        '🎭 Atua melhor que qualquer novela mexicana!',
        '👑 Esse aqui já nasce pronto pro close certo!',
        '😆 Mais gay que festa temática de arco-íris!',
    ];
    var mentionedMembers = [];
    var selectedMembers = new Set();
    while (selectedMembers.size < 5 && selectedMembers.size < getMembers.length) {
        var randomMember = getMembers[Math.floor(Math.random() * getMembers.length)];
        if(!selectedMembers.has(randomMember)) {
            selectedMembers.add(randomMember);
            var porcentagem = Math.floor(Math.random() * 100);
            var mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
            data += `*${porcentagem}%* ⤷ @${randomMember.split('@')[0]} ⤷ ${mensagem}\n\n`;
            mentionedMembers.push(`${randomMember}`);
        }
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankGay }, caption: data, mentions: mentionedMembers }, { quoted: info });
break;

case 'rankgado': case 'rankgados':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira!');
    var data = `🐄 Rank Dos 5 Mais Gados Do Grupo ⤷ ${groupName}\n—\n`;
    var mensagens = [
        '💘 Esse aqui já tem foto de casal no perfil! 😎',
        '🔥 Sempre "te amo" no final das mensagens, é o rei do romance!',
        '🐄 Vai ser o primeiro a casar e ter filhos, não tem jeito!',
        '💍 Já está pensando no próximo presente para a crush!',
        '💅 Diz que vai terminar com a crush, mas sempre volta!',
        '🎯 Esse é o gado que sempre comenta "eu te entendo, meu bem!"',
        '🌹 Não consegue ficar mais de 5 minutos sem mandar mensagem para a crush!',
        '📸 Já foi flagrado no Instagram com foto de "nosso momento"! 🥰',
        '💖 Não consegue esconder o brilho nos olhos quando fala da crush!',
        '👑 Esse aqui vai mandar "fica com Deus" e depois vai sofrer de saudade!',
        '🎤 Já está planejando a serenata no aniversário da crush!',
        '🌸 Nunca perde a chance de dizer "te amo" nas redes sociais!',
        '🤣 Mais gado que churrasco de domingo com a família inteira!',
    ];
    var mentionedMembers = [];
    var selectedMembers = new Set();
    while (selectedMembers.size < 5 && selectedMembers.size < getMembers.length) {
        var randomMember = getMembers[Math.floor(Math.random() * getMembers.length)];
        if(!selectedMembers.has(randomMember)) {
            selectedMembers.add(randomMember);
            var porcentagem = Math.floor(Math.random() * 100);
            var mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
            data += `*${porcentagem}%* ⤷ @${randomMember.split('@')[0]} ⤷ ${mensagem}\n\n`;
            mentionedMembers.push(randomMember);
        }
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankGado }, caption: data, mentions: mentionedMembers }, { quoted: info });
break;

case 'rankcorno': case 'rankcornos':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira!');

    var data = `💔 Rank Dos 5 Mais Cornos Do Grupo ⤷ ${groupName}\n—\n`;
    var mensagens = [
        '💔 Esse aqui está no "Modo Sofrência" desde 2018!',
        '😂 Já tem história de "coração partido" pra contar pro terapeuta!',
        '😢 Esse corno já apareceu em várias "novelas mexicanas" do grupo!',
        '🔥 Se pudesse, tomava um copo de "desilusão" no café da manhã!',
        '💅 Vive se perguntando "será que é isso que eu mereço?"',
        '🎤 Já foi flagrado cantando "Amei Te Ver" no karaokê!',
        '😭 Tem mais lágrimas que uma tempestade de verão!',
        '👀 Já descobriu o "modo stalker" na vida e usa com frequência!',
        '📸 Postou mais indiretas do que foto com a ex-namorada!',
        '💬 Fica "desconectado" mais tempo que a conexão da internet!',
        '🌪️ Já teve a famosa "recaída", agora é só lembrar e rir!',
        '🍻 Beber virou rotina, só para afogar as mágoas!',
        '🤣 Mais corno que série de TV cheia de traição!',
    ];
    var mentionedMembers = [];
    var selectedMembers = new Set();
    while (selectedMembers.size < 5 && selectedMembers.size < getMembers.length) {
        var randomMember = getMembers[Math.floor(Math.random() * getMembers.length)];
        if(!selectedMembers.has(randomMember)) {
            selectedMembers.add(randomMember);
            var porcentagem = Math.floor(Math.random() * 100);
            var mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
            data += `*${porcentagem}%* ⤷ @${randomMember.split('@')[0]} ⤷ ${mensagem}\n\n`;
            mentionedMembers.push(randomMember);
        }
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankCorno }, caption: data, mentions: mentionedMembers }, { quoted: info });
break;

case 'surubao': case 'suruba':
if(!verifyGrupo) return await reply(responses.dono())
if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira!')
if(!query) return await reply(`Eita, coloque o número de pessoas após o comando.`)
if(Number(query) > 5) return await reply('Coloque um número menor, ou seja, abaixo de *5*.')
var emojiskk = ['🥵', '😈', '🫣', '😏'];
var emojis = emojiskk[Math.floor(Math.random() * emojiskk.length)];
var frasekk = [`tá querendo relações sexuais a ${query.trim()}, topa?`, `quer que *${query.trim()}* pessoas venham de *chicote, algema e corda de alpinista*.`, `quer que ${query.trim()} pessoas der tapa na cara, lhe chame de cachorra e fud3r bem gostosinho...`]
var context = frasekk[Math.floor(Math.random() * frasekk.length)]  
var data = `${emojis} @${sender.split('@')[0]} ${context}\n\n`
for (var i = 0; i < query; i++) {
data += `@${getMembers[Math.floor(Math.random() * getMembers.length)].split('@')[0]}\n`
}
await mention(data);
break

case 'rankgostoso': case 'rankgostosos':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira!');
    var data = `🔥 Rank Dos 5 Mais Gostosos Do Grupo ⤷ ${groupName}\n—\n`;
    var mensagens = [
        '💥 Esse aqui faz o clima esquentar só com a presença!',
        '🔥 Vai fazer qualquer um derreter com um sorriso!',
        '😏 O charme está em cada movimento, é puro magnetismo!',
        '💋 Se fosse um filme, seria "Coração de Ouro" no Oscar!',
        '🌟 Não existe ângulo ruim, só selfies perfeitas!',
        '💅 Esse aqui já passou do nível "muito bonito" para "indecente"!',
        '🎤 Já canta no chuveiro e imagina que é o protagonista de um clipe!',
        '📸 Já tem um book de fotos mais profissional que muito modelo!',
        '🕺 Você olha e já imagina que é o protagonista de uma novela!',
        '💃 Esse tem mais estilo que um desfile de moda!',
        '👑 Está pronto para arrasar no palco do "The Voice"!',
        '😍 Mais gostoso que sobremesa no fim de semana!',
    ];
    var mentionedMembers = [];
    var selectedMembers = new Set();
    while (selectedMembers.size < 5 && selectedMembers.size < getMembers.length) {
        var randomMember = getMembers[Math.floor(Math.random() * getMembers.length)];
        if(!selectedMembers.has(randomMember)) {
            selectedMembers.add(randomMember);
            var porcentagem = Math.floor(Math.random() * 100);
            var mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
            data += `*${porcentagem}%* ⤷ @${randomMember.split('@')[0]} ⤷ ${mensagem}\n\n`;
            mentionedMembers.push(randomMember);
        }
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankGostoso }, caption: data, mentions: mentionedMembers }, { quoted: info });
break;

case 'rankgostosa': case 'rankgostosas':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira!');
    var data = `🔥 Rank Das 5 Mais Gostosas Do Grupo ⤷ ${groupName}\n—\n`;
    var mensagens = [
        '💥 Essa aqui vai deixar qualquer um sem palavras com um olhar! 😍',
        '🔥 Já pode ser capa de revista, sem esforço!',
        '😏 O poder de sedução está em cada gesto, é uma verdadeira musa!',
        '💋 Essa aqui sabe arrasar tanto no look quanto na simpatia!',
        '🌟 Mais charmosa que qualquer desfile de moda!',
        '💅 Beleza e atitude, combinação fatal!',
        '🎤 Se cantasse, seria um sucesso no Spotify com milhões de ouvintes!',
        '📸 Cada foto é um ensaio fotográfico, impossível não ficar deslumbrado!',
        '🕺 Tem o estilo e a presença de uma verdadeira diva!',
        '💃 Não tem um ângulo ruim, só ângulos perfeitos!',
        '👑 Já merece uma coroa de rainha da beleza!',
        '😍 Mais gostosa que qualquer sobremesa de final de semana!',
    ];
    var mentionedMembers = [];
    var selectedMembers = new Set();
    while (selectedMembers.size < 5 && selectedMembers.size < getMembers.length) {
        var randomMember = getMembers[Math.floor(Math.random() * getMembers.length)];
        if(!selectedMembers.has(randomMember)) {
            selectedMembers.add(randomMember);
            var porcentagem = Math.floor(Math.random() * 100);
            var mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
            data += `*${porcentagem}%* ⤷ @${randomMember.split('@')[0]} ⤷ ${mensagem}\n\n`;
            mentionedMembers.push(randomMember);
        }
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankGostosa }, caption: data, mentions: mentionedMembers }, { quoted: info });
break;

case 'ranknazista': case 'ranknazistas':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira, meu chapa!');
    var data = `*💂‍♂️ RANK DOS 5 MAIS NAZISTAS DO GRUPO 卐 🤪*\n\n`;
    var messages = [
        'Esse aí é o chefe do rolê!',
        'Com esse percentual, esse já pode ser o líder do grupo!',
        'Já dá pra ver quem manda aqui, né?',
        'O cara é praticamente o dono do grupo!',
        'Cuidado, esse tá no modo líder total!'
    ];
    var mentionedMembers = []; 
    for (var i = 0; i < 5; i++) {
        var member = getMembers[Math.floor(Math.random() * getMembers.length)].split('@')[0];
        var message = messages[Math.floor(Math.random() * messages.length)];
        data += `${Math.floor(Math.random() * 100)}% @${member} ⤷ ${message}\n\n`;
        mentionedMembers.push(`@${member}`); 
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankNazista },  caption: data,  mentions: mentionedMembers.map(member => `${member}`), mimetype: 'image/jpg' }, { quoted: info });
break;

case 'rankotaku': case 'rankotakus':
    if(!verifyGrupo) return await reply(responses.grupo());
    if(!verifyModoBn) return await reply('Esse comando só funciona no modo brincadeira!');
    var data = `🎌 Rank Dos 5 Mais Otakus Do Grupo ⤷ ${groupName}\n—\n`;
    var mensagens = [
        '🔥 Esse aqui é um verdadeiro mestre das artes marciais, já foi treinado por mestres de anime!',
        '🎮 Sempre sabe o que está acontecendo no universo dos animes e jogos!',
        '🍜 Esse vive de ramen e já assistiu todos os episódios de Naruto!',
        '📚 Tem mais mangás que a biblioteca da escola e sabe o nome de todos!',
        '👒 Já fez cosplay até de personagens que você nunca ouviu falar!',
        '🎥 Esse aqui sabe de cor todas as aberturas de animes e canta junto!',
        '🖥️ Já maratonou 5 temporadas de anime em um fim de semana!',
        '📝 O mais informado de todos, já tem lista de animes para a próxima temporada!',
        '👽 Se você chamar esse de "otaku", ele vai te corrigir com o nome correto do gênero!',
        '🎧 Não sai de casa sem ouvir a trilha sonora de algum anime épico!',
        '🎤 Já participou de concurso de karaokê só para cantar abertura de anime!',
        '🖼️ Conhece todos os melhores animes, de mainstream a obscuro, e recomenda sempre!',
    ];
    var mentionedMembers = [];
    var selectedMembers = new Set();
    while (selectedMembers.size < 5 && selectedMembers.size < getMembers.length) {
        var randomMember = getMembers[Math.floor(Math.random() * getMembers.length)];
        if(!selectedMembers.has(randomMember)) {
            selectedMembers.add(randomMember);
            var porcentagem = Math.floor(Math.random() * 100);
            var mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
            data += `*${porcentagem}%* ⤷ @${randomMember.split('@')[0]} ⤷ ${mensagem}\n\n`;
            mentionedMembers.push(randomMember);
        }
    }
    await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankOtaku }, caption: data, mentions: mentionedMembers }, { quoted: info });
break;

case 'rankpau':
  if(!verifyGrupo) return await reply(responses.grupo());
  if(!verifyModoBn) return await reply('Só no modo brincadeira que funciona, amigo!');
  var data = `*Rank Dos 5 Pau Maior Do Grupo 😜*\n\n`;
  var TMPAU = [
    'Pequeno, quase não dá pra ver! 🧐',
    'Bem pequenininho, mais fofinho que qualquer coisa! 🥺',
    'Menor que meu dedo mindinho, assim fica difícil 😅',
    'Tá na média, dá pra sentir, mas não impressiona! 😌',
    'Grandinho, mas ainda não chega a assustar! 😎',
    'Grande até, quem diria, né?! 😏',
    'Gigantesco igual meu braço! 🤯',
    'Enorme, quase invade o útero! 🤪',
    'Grandão demais, chegou pra causar! 😳',
    'Vara de pegar manga, como sai na rua assim?? 🤨',
    'Gigante, quase virou um ser mitológico! 😆'
  ];
  var mentionedMembers = [];
  for (var i = 0; i < 5; i++) {
    var randomMember = getMembers[Math.floor(Math.random() * getMembers.length)].split('@')[0];
    var randomPau = TMPAU[Math.floor(Math.random() * TMPAU.length)];
    data += `${randomPau} _- @${randomMember}\n\n`;
    mentionedMembers.push(randomMember);
  }
  await sasha.sendMessage(from, { image: { url: images['Brincadeiras']['Cards'].RankPau }, caption: data, mentions: mentionedMembers.map(member => `${member}`), mimetype: 'image/jpg' }, { quoted: info });
break;

case 'ppt':
    if(!verifyModoBn) return await reply('Você precisa estar no modo brincadeira para jogar!');
    if(string.length < 1) return await reply(`Você deve digitar ${prefix}ppt pedra, ${prefix}ppt papel ou ${prefix}ppt tesoura`);
    var opcoes = ['pedra', 'papel', 'tesoura'];
    var escolhaBot = opcoes[Math.floor(Math.random() * opcoes.length)];
    var resultado;
    if((escolhaBot == 'pedra' && string == 'papel') ||
        (escolhaBot == 'papel' && string == 'tesoura') ||
        (escolhaBot == 'tesoura' && string == 'pedra')) {
        resultado = 'vitoria';
    } else if((escolhaBot == 'pedra' && string == 'tesoura') ||
        (escolhaBot == 'papel' && string == 'pedra') ||
        (escolhaBot == 'tesoura' && string == 'papel')) {
        resultado = 'derrota';
    } else if((escolhaBot == 'pedra' && string == 'pedra') ||
        (escolhaBot == 'papel' && string == 'papel') ||
        (escolhaBot == 'tesoura' && string == 'tesoura')) {
        resultado = 'empate';
    } else {
        return await reply(`Você deve digitar ${prefix}ppt pedra, ${prefix}ppt papel ou ${prefix}ppt tesoura`);
    }
    var mensagemResultado;
    if(resultado == 'vitoria') {
        mensagemResultado = 'Vitória do jogador';
    } else if(resultado == 'derrota') {
        mensagemResultado = 'A vitória é do BOT';
    } else if(resultado == 'empate') {
        mensagemResultado = 'O jogo terminou em empate';
    }
    await reply(`${botName} jogou: ${escolhaBot}\nO jogador jogou: ${string}\n\n${mensagemResultado}`);
break;

case 'videocontrario': case 'reversevid':
  if((verifyMedia && info.message.videoMessage || !QuotedMessage.Picture)) {
    const mediaToProcess = QuotedMessage.Clip ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const videoBuffer = await getFileBuffer(mediaToProcess, 'video');
    await reply('Calma aí, já vou deixar seu vídeo ao contrário...');
    await saveFile(tempFileName, videoBuffer);
    const outputFile = getRandom('.mp4');
    exec(`ffmpeg -i ${tempFileName} -vf reverse -af areverse ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
           return await reply('Deu ruim! Não consegui modificar o video.');
           }
      const reversedVideoBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { video: reversedVideoBuffer, mimetype: 'video/mp4' }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um vídeo válido para processar.');
  }
break;

case 'videolento': case 'slowvid':
  if((verifyMedia && info.message.videoMessage) || QuotedMessage.Clip) {
    const mediaToProcess = QuotedMessage.Clip ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const videoBuffer = await getFileBuffer(mediaToProcess, 'video');
    await reply('Segura aí, já vou deixar seu vídeo em câmera lenta...');
    await saveFile(tempFileName, videoBuffer);
    const outputFile = getRandom('.mp4');
    exec(`ffmpeg -i ${tempFileName} -filter:v 'setpts=2.0*PTS' -filter:a 'atempo=0.5' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui processar o vídeo.');
      }
      const slowVideoBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { video: slowVideoBuffer, mimetype: 'video/mp4' }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Envie um vídeo válido para eu processar.');
  }
break;

case 'videorapido': case 'fastvid':
  if((verifyMedia && info.message.videoMessage) || QuotedMessage.Clip) {
    const mediaToProcess = QuotedMessage.Clip ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const videoBuffer = await getFileBuffer(mediaToProcess, 'video');
    await reply('Segura aí, já vou acelerar seu vídeo...');
    await saveFile(tempFileName, videoBuffer);
    const outputFile = getRandom('.mp4');
    exec(`ffmpeg -i ${tempFileName} -filter:v 'setpts=0.5*PTS' -filter:a 'atempo=2.0' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui processar o vídeo.');
      }
      const fastVideoBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { video: fastVideoBuffer, mimetype: 'video/mp4' }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Envie um vídeo válido para eu processar.');
  }
break;

case 'audioreverse': case 'reverseaudio':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Calma aí, já vou inverter seu áudio...');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -af areverse ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Deu ruim! Não consegui modificar o áudio.');
      }
      const reversedAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: reversedAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'robot':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Transformando sua voz em robô... Prepare-se para uma experiência futurística!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'afftdn' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) { 
        return await reply('Não consegui modificar o áudio, algo deu errado!');
      }
      const robotAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: robotAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'eco':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Criando um eco misterioso... Sua voz vai se multiplicar no espaço!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'aecho=0.8:0.88:60:0.4' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) { 
         return await reply('Opa, não consegui adicionar o eco no áudio!');
      }
      const ecoAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: ecoAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'reverb':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Adicionando reverb... Sua voz vai ecoar como se estivesse em um grande palco!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'aecho=0.8:0.9:1000:0.8' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Algo deu errado ao adicionar o reverb!');
      }
      const reverbAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: reverbAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'pitch':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Mudando o pitch... Sua voz vai se tornar mais aguda!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'asetrate=44100*1.2' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) { 
       return await reply('😞 Não consegui alterar o pitch da sua voz!');
      }
      const pitchAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: pitchAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'monstervoice':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Transformando sua voz em de monstro... Prepare-se para o som aterrorizante!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'atempo=0.7,asetrate=44100*0.8' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Não consegui modificar o áudio para o monstro!');
        }
      const monsterAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: monsterAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'pitchshift':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Modificando o pitch de forma gradual... Ouça a transformação!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'asetrate=44100*1.5' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) { 
        return await reply('Algo deu errado ao modificar o pitch!');
        }
      const pitchShiftedAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: pitchShiftedAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'desafinar':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Sua voz vai ficar desafinada, como um cantor fora do tom!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'asetrate=44100*0.9' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
       return await reply('Não consegui desafinar o áudio!');
       }
      const desafinadoAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: desafinadoAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'alien':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Transformando sua voz em de alienígena... Prepare-se para a distorção extraterrestre!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'asetrate=44100*1.3,atempo=0.9,afftdn' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) { 
      return await reply('Não consegui modificar o áudio para o alienígena!');
      }
      const alienAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: alienAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'vinyl':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Adicionando o efeito vinil... Seu áudio vai soar como um disco antigo!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'aecho=0.8:0.9:1000:0.5,asetrate=44100*0.9' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
       return await reply('Não consegui adicionar o efeito vinil ao áudio!');
       }
      const vinylAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: vinylAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'distortion':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Adicionando distorção... Prepare-se para o áudio destruído!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'distortion' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
       return await reply('Algo deu errado ao aplicar a distorção!');
       }
      const distortedAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: distortedAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'slowmotion':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Colocando o áudio em câmera lenta... Sua voz vai desacelerar!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'atempo=0.5' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
       return await reply('Não consegui colocar o áudio em câmera lenta!');
       }
      const slowMotionAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: slowMotionAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'chipmunk':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Transformando sua voz em chipmunk... Prepare-se para a fofura!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'atempo=1.5,asetrate=44100*1.3' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
       return await reply('Não consegui transformar sua voz em chipmunk!');
      }
      const chipmunkAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: chipmunkAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'whisper':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Transformando sua voz em um sussurro... Ouça a suavidade!');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'volume=0.5' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
       return await reply('Não consegui transformar sua voz em um sussurro!');
       }
      const whisperAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: whisperAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break

case 'grave':
    if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
            var audioSource = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
            var audioExtension = await getExtension(audioSource.mimetype);
            var tempAudioPath = getRandom(`.${audioExtension}`);
            var processedAudioPath = getRandom('.mp3');
            var audioBuffer = await getFileBuffer(audioSource, 'audio');
             await reply('Calma aí, já vou deixar seu áudio mais grave...');
            await saveFile(tempAudioPath, audioBuffer);
            exec(`ffmpeg -i ${tempAudioPath} -filter:a 'atempo=0.9,asetrate=44100' ${processedAudioPath}`, async (erro) => {
                await deleteFile(tempAudioPath);
                if(erro) {
                    return await reply('Deu ruim! Não consegui modificar o áudio.');
                }
                var finalAudioBuffer = fs.readFileSync(processedAudioPath);
                await sasha.sendMessage(from, { audio: finalAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
                await deleteFile(processedAudioPath);
            });
    } else {
        await reply('Me marca em um áudio para eu editar.');
    }
break;

case 'vozmenino': case 'voicekid':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    const mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    const fileExtension = await getExtension(mediaToProcess.mimetype);
    const tempFileName = getRandom(`.${fileExtension}`);
    const audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Segura aí, já vou deixar sua voz mais fina...');
    await saveFile(tempFileName, audioBuffer);
    const outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'asetrate=48000*1.5,atempo=0.8' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui modificar o áudio.');
      }
      const modifiedAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: modifiedAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'tomp3': case 'videomp3':
try {
    if((verifyMedia && !info.message.imageMessage) || !info.message.videoMessage || QuotedMessage.Clip) {
        var videoFonte = QuotedMessage.Clip ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage;
        var extensao = '.' + await getExtension(videoFonte.mimetype);
        var caminhoTemp = getRandom(extensao);
        var bufferVideo = await getFileBuffer(videoFonte, 'video');
        await reply('Por favor, aguarde enquanto converto o vídeo...');
        await saveFile(caminhoTemp, bufferVideo);
        var caminhoFinal = getRandom('.mp4');
        await exec(`ffmpeg -i ${caminhoTemp} ${caminhoFinal}`, async (err) => {
            deleteFile(caminhoTemp);
            if(err) { 
              return await reply('Falha ao converter vídeo para áudio.');
            }
            var audioConvertido = fs.readFileSync(caminhoFinal);
            await sasha.sendMessage(from, { audio: audioConvertido, mimetype: 'audio/mpeg' }, { quoted: info });
            deleteFile(caminhoFinal);
        });
    } else {
        await reply('Marque o vídeo para transformar em áudio, por favor.');
    }
} catch (error) {
     if(typeof logBug === 'function') logBug(error.message, command);
}
break;

case 'removervocal': 
  try {      
    if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage && info.message.audioMessage || info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage) || QuotedMessage?.Soundbite) {
      var post = QuotedMessage?.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
      await reply(responses.wait());
      var buffer = await getFileBuffer(post, 'audio');
      var uploadServer = await uploader.catbox(buffer);
      var data = await fetchJson(`https://apizell.web.id/tools/vocalremover?url=${uploadServer}`);
      if(data.vocal_path) {
        await sasha.sendMessage(from, { text: '🎤 *Versão com vocal* – sem a música com a voz original.' });
        await sasha.sendMessage(from, { audio: { url: data.vocal_path }, mimetype: 'audio/mpeg' });
      } else {
        await reply('Não consegui gerar a *versão com vocal*. Talvez o áudio esteja com baixa qualidade ou houve uma falha na separação.');
      }
      if(data.instrumental_path) {
        await sasha.sendMessage(from, { text: '🎼 *Versão sem vocal* – Apenas os instrumentos, sem a voz.' });
        await sasha.sendMessage(from, { audio: { url: data.instrumental_path }, mimetype: 'audio/mpeg' });
        await reagir(from, '✅');
      } else {
        await reply('Não consegui gerar a *versão instrumental (sem vocal)*. Tente novamente mais tarde ou envie outro áudio.');
      }
    } else {
      await reply('Por favor, envie ou responda a uma *mensagem de áudio* para que eu possa remover os vocais.');
    }
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, command);
  }
break;

case 'bass': case 'bassboost':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    var mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    var fileExtension = await getExtension(mediaToProcess.mimetype);
    var tempFileName = getRandom(`.${fileExtension}`);
    var audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Segura aí, já vou aumentar o grave...');
    await saveFile(tempFileName, audioBuffer);
    var outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'bass=g=10' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui modificar o áudio.');
      }
      var bassBoostedAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: bassBoostedAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'estourar': case 'distort':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    var mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    var fileExtension = await getExtension(mediaToProcess.mimetype);
    var tempFileName = getRandom(`.${fileExtension}`);
    var audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Calma aí, estou estourando seu áudio...');
    await saveFile(tempFileName, audioBuffer);
    var outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'distortion' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui modificar o áudio.');
      }
      var distortedAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: distortedAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'audiorapido': case 'fastaudio':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    var mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    var fileExtension = await getExtension(mediaToProcess.mimetype);
    var tempFileName = getRandom(`.${fileExtension}`);
    var audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Segura aí, estou acelerando seu áudio...');
    await saveFile(tempFileName, audioBuffer);
    var outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'atempo=1.5' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui modificar o áudio.');
      }
      var fastAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: fastAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'esquilo': case 'squirrelvoice':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    var mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    var fileExtension = await getExtension(mediaToProcess.mimetype);
    var tempFileName = getRandom(`.${fileExtension}`);
    var audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Calma aí, estou transformando sua voz em de esquilo...');
    await saveFile(tempFileName, audioBuffer);
    var outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'asetrate=48000*1.5,atempo=0.8' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui modificar o áudio.');
      }
      var squirrelVoiceBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: squirrelVoiceBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'audiolento': case 'slowaudio':
  if((verifyMedia && !info.message.imageMessage && !info.message.videoMessage || QuotedMessage.Soundbite)) {
    var mediaToProcess = QuotedMessage.Soundbite ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage;
    var fileExtension = await getExtension(mediaToProcess.mimetype);
    var tempFileName = getRandom(`.${fileExtension}`);
    var audioBuffer = await getFileBuffer(mediaToProcess, 'audio');
    await reply('Segura aí, estou deixando seu áudio mais lento...');
    await saveFile(tempFileName, audioBuffer);
    var outputFile = getRandom('.mp3');
    exec(`ffmpeg -i ${tempFileName} -filter:a 'atempo=0.5' ${outputFile}`, async (err) => {
      await deleteFile(tempFileName);
      if(err) {
        return await reply('Opa, não consegui modificar o áudio.');
      }
      var slowAudioBuffer = fs.readFileSync(outputFile);
      await sasha.sendMessage(from, { audio: slowAudioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: info });
      deleteFile(outputFile);
    });
  } else {
    await reply('Por favor, envie um áudio válido para processar.');
  }
break;

case 'hd': case 'enhace': 
    try {
      if((verifyMedia && !info.message.videoMessage) || QuotedMessage.Picture) {
        await reagir(from, '🖼');
        reply(responses.wait());
        var post = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage
        var buffer = await getFileBuffer(post, 'image');
        var uploadServer = await uploader.catbox(buffer);
        var data = await fetchJson(`https://api.vreden.my.id/api/v1/artificial/imglarger/enhance?url=${uploadServer}`);
        await sasha.sendMessage(from, { image: { url: data.result.download } }, { quoted: info });
        await reagir(from, '😺');
      } else {
        await reply(`Responda uma imagem ou adicione na legenda da imagem o comando, para atribuir o efeito '${command}' à foto.`);
      }
    } catch (error) {
      if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'hdv2': case 'enhacev2': 
    try {
      if((verifyMedia && !info.message.videoMessage) || QuotedMessage.Picture) {
        await reagir(from, '🖼');
        reply(responses.wait());
        var post = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage
        var buffer = await getFileBuffer(post, 'image');
        var uploadServer = await uploader.catbox(buffer);
        var data = await fetchJson(`https://api.vreden.my.id/api/v1/artificial/pxpic/enhance?url=${uploadServer}`);
        await sasha.sendMessage(from, { image: { url: data.result.download } }, { quoted: info });
        await reagir(from, '😺');
      } else {
        await reply(`Responda uma imagem ou adicione na legenda da imagem o comando, para atribuir o efeito '${command}' à foto.`);
      }
    } catch (error) {
      if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'repair':
    try {
      if((verifyMedia && !info.message.videoMessage) || QuotedMessage.Picture) {
        await reagir(from, '🖼');
        reply(responses.wait());
        var post = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage
        var buffer = await getFileBuffer(post, 'image');
        var uploadServer = await uploader.catbox(buffer);
        var data = await fetchJson(`https://api.vreden.my.id/api/v1/artificial/imglarger/repair?url=${uploadServer}`);
        await sasha.sendMessage(from, { image: { url: data.result.download } }, { quoted: info });
        await reagir(from, '😺');
      } else {
        await reply(`Responda uma imagem ou adicione na legenda da imagem o comando, para atribuir o efeito '${command}' à foto.`);
      }
    } catch (error) {
      if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'restaurar': 
    try {
      if((verifyMedia && !info.message.videoMessage) || QuotedMessage.Picture) {
        await reagir(from, '🖼');
        reply(responses.wait());
        var post = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage
        var buffer = await getFileBuffer(post, 'image');
        var uploadServer = await uploader.catbox(buffer);
        var data = await fetchJson(`https://api.vreden.my.id/api/v1/artificial/imglarger/enhance?url=${uploadServer}`);
        await sasha.sendMessage(from, { image: { url: data.result.download } }, { quoted: info });
        await reagir(from, '😺');
      } else {
        await reply(`Responda uma imagem ou adicione na legenda da imagem o comando, para atribuir o efeito '${command}' à foto.`);
      }
    } catch (error) {
      if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

case 'bnw': case 'blur': case 'circle': case 'invert': case 'pixelate': case 'rotate':
    try {
      if((verifyMedia && !info.message.videoMessage) || QuotedMessage.Picture) {
        await reagir(from, '🖼');
        reply(responses.wait());
        var post = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage
        var buffer = await getFileBuffer(post, 'image');
        var uploadServer = await uploader.catbox(buffer);
        await sasha.sendMessage(from, { image: { url: `${WebSite}/imageeffect/${command}?link=${uploadServer}&apikey=${ApiKeySasha}` } }, { quoted: info });
        await reagir(from, '😺');
      } else {
        await reply(`Responda uma imagem ou adicione na legenda da imagem o comando, para atribuir o efeito '${command}' à foto.`);
      }
    } catch (error) {
      if(typeof logBug === 'function') logBug(error.message, command);
    }
 break;

case 'comunismo': case 'bolsonaro': case 'affect': case 'beautiful': case 'del': case 'hither': case 'facepalm': case 'magik': case 'rip': case 'jail': case 'trash': case 'sepia': case 'wanted': case 'wasted': case 'lgbt': case 'karaba':
    try {
    if((verifyMedia && !info.message.videoMessage || QuotedMessage.Picture)) {    
        await reagir(from, '😸'); // Reação para indicar que a solicitação está em andamento
        var midia = QuotedMessage.Picture ? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.imageMessage;
        var bufferMidia = await getFileBuffer(midia, 'image');
        var resultado = await uploader.catbox(bufferMidia);
        await sasha.sendMessage(from, { image: { url: `${WebSite}/montagem/${command}?link=${resultado}&apikey=${ApiKeySasha}` }}, { quoted: info });
        await reagir(from, '😺');
      } else {
        await reply(`Responda uma imagem ou adicione na legenda da imagem o comando, para atribuir o efeito '${command}' à foto.`);
      }
    } catch (error) {
      if(typeof logBug === 'function') logBug(error.message, command);
    }
break;

default:

async function baixar(message) {
  const URLS = message.match(/https?:\/\/[^\s]+/g);
  if (!URLS || URLS.length === 0) return;

  const platforms = {
    youtube: {
      regex: /https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https:\/\/(www\.)?youtu\.be\/[\w-]+|https:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/
    },
    whatsapp: {
      regex: /https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]+/
    },
    instagram: {
      regex: /^https?:\/\/(www\.)?instagram\.com\//
    },
    x: {
      regex: /^https?:\/\/x\.com/
    },
    tiktok: {
      regex: /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\//
    },
    pinterest: {
      regex: /https:\/\/(www\.)?pin\.it\/[\w-]+/
    },
    threads: {
      regex: /(?:https?:\/\/)?(?:www\.)?threads\.net\/@[^\/]+\/post\/\d+/
    },
    spotify: {
      regex: /(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|album|playlist)\/[A-Za-z0-9]+/
    },
    facebook: {
      regex: /(?:https?:\/\/)?(?:www\.)?(facebook\.com|fb\.watch)\/[\w./?=&-]+/
    }
  };

  const detectPlatform = (url) => {
    return Object.entries(platforms).find(([_, data]) => data.regex.test(url))?.[0] || null;
  };

  for (const query of URLS) {
    if (typeof query !== 'string') continue;

    const platform = detectPlatform(query);
    if (!platform) continue;

    switch (platform) {
      case 'youtube':
      try {
        await reply(`Buscando informações do vídeo. Aguarde um momento...`);
        await sasha.sendMessage(from, { video: { url: `https://api.bronxyshost.com.br/api-bronxys/play_video?nome_url=${query}&apikey=Learsi_Gamer` }, caption: '#SashaBot - Download YouTube' });
    } catch (error) { 
        if(typeof logBug === 'function') logBug(error.message, platform);
    }
     break;

      case 'instagram':
        await reply('Aguenta aí, estou buscando o conteúdo para você!');
    try {
        const data = await fetchJson(`https://api.vreden.my.id/api/v1/download/instagram?url=${encodeURIComponent(query.trim())}`);
        if(!data.result || !data.result.data || data.result.data.length === 0) return await reply('Não foi possível encontrar mídia nesse link.');
        for(const media of data.result.data) if(media.type === 'video') await sasha.sendMessage(from, { video: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *Instagram*\n—\n⤷ Usuario: *${data.result.profile.username}* (*${data.result.profile.full_name}*)\n⤷ Legenda: *${data.result.caption.text || 'Sem legenda'}*\n⤷ Postado em: *${data.result.caption.created_at ? new Date(data.result.caption.created_at*1000).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Não disponível'}*\n⤷ Tipo de mídia: *${media.type}*\n⤷ Curtidas: *${formatNumber(data.result.statistics.like_count) || 0}*\n⤷ Comentarios: *${formatNumber(data.result.statistics.comment_count) || 0}*\n⤷ Plays: *${formatNumber(data.result.statistics.ig_play_count) || formatNumber(data.result.statistics.play_count) || 0}*\n⤷ Reposts: *${formatNumber(data.result.statistics.repost_count) || 0}*\n⤷ Salvamentos: *${data.result.statistics.save_count || 0}*\n⤷ Compartilhamentos: *${formatNumber(data.result.statistics.share_count) || 0}*\n⤷ Seguidores do usuario: *${formatNumber(data.result.statistics.user_follower_count) || 'Não disponível'}*\n⤷ Total de posts do usuario: *${formatNumber(data.result.statistics.user_media_count) || 'Não disponível'}*\n⤷ Visualizacoes gerais: *${data.result.statistics.view_count || 0}*`, mimetype: 'video/mp4' }, { quoted: info });
        for(const media of data.result.data) if(media.type === 'image') await sasha.sendMessage(from, { image: { url: media.url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: *Instagram*\n—\n⤷ Usuario: *${data.result.profile.username}* (*${data.result.profile.full_name}*)\n⤷ Legenda: *${data.result.caption.text || 'Sem legenda'}*\n⤷ Postado em: *${data.result.caption.created_at ? new Date(data.result.caption.created_at*1000).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Não disponível'}*\n⤷ Tipo de mídia: *${media.type}*\n⤷ Curtidas: *${formatNumber(data.result.statistics.like_count) || 0}*\n⤷ Comentarios: *${formatNumber(data.result.statistics.comment_count) || 0}*\n⤷ Plays: *${formatNumber(data.result.statistics.ig_play_count) || formatNumber(data.result.statistics.play_count) || 0}*\n⤷ Reposts: *${formatNumber(data.result.statistics.repost_count) || 0}*\n⤷ Salvamentos: *${data.result.statistics.save_count || 0}*\n⤷ Compartilhamentos: *${formatNumber(data.result.statistics.share_count) || 0}*\n⤷ Seguidores do usuario: *${formatNumber(data.result.statistics.user_follower_count) || 'Não disponível'}*\n⤷ Total de posts do usuario: *${formatNumber(data.result.statistics.user_media_count) || 'Não disponível'}*\n⤷ Visualizacoes gerais: *${data.result.statistics.view_count || 0}*` }, { quoted: info });
         var dataAudio = await fetchJson(`https://api.bronxyshost.com.br/api-bronxys/instagram?apikey=Learsi_Gamer&url=${query.trim()}`);
        if(dataAudio.msg && dataAudio.msg[0] && dataAudio.msg[0].url) {
            await replyMessage('Aguarde um segundinho, vou buscar o áudio para você!');
            await sasha.sendMessage(from, { audio: { url: dataAudio.msg[0].url }, mimetype: 'audio/mpeg' });
        }
   } catch (error) {   
    await InstagramV3(query)
  }
   break;

      case 'x':
      try {
        await reply(responses.wait());
    var data = await fetchJson(`${WebSite}/download/twitter?apikey=${ApiKeySasha}&url=${query.trim()}`);
    if(data.resultado.media.length > 0) {
      const media = data.resultado.media[0];
      if(media.videos && media.videos[1] && media.videos[1].url) {
        sasha.sendMessage(from, { video: { url: media.videos[1].url }, mimetype: 'video/mp4', caption: `*Sasha Download!*\n—\n⤷ Video de *@${data.resultado.author.username || 'Sem Informações'}*\n⤷ Legenda: *${data.resultado.description.trim() || 'Sem Informações'}*\n⤷ Linguagem: *${data.resultado.languange || 'Sem Informações'}*\n⤷ Postado em: *${data.resultado.createdAt || 'Sem Informações'}*\n⤷ Comentários: *${formatNumber(data.resultado.statistics.replieCount) || 'Sem Informações'}*\n⤷ Pessoas que favoritou: *${formatNumber(data.resultado.statistics.favoriteCount) || 'Sem Informações'}*\n⤷ Views: *${formatNumber(data.resultado.statistics.viewCount) || 'Sem Informações'}*\n—\n> *Informações do @${data.resultado.author.username || 'Usuário(a)'}:*\n⤷ Url do Autor: *${data.resultado.author.url}*\n⤷ Bio: *${data.resultado.author.bio || 'Sem Informações'}*\n⤷ Verificado? *${data.resultado.author.verified ? 'Sim' : 'Nahh' || 'Sem Informações'}*\n⤷ Localização: *${data.resultado.author.location || 'Sem Informações'}*\n⤷ Seguidores: *${formatNumber(data.resultado.author.statistics.followersCount) || 'Sem Informações'}*\n⤷ Amigos: *${formatNumber(data.resultado.author.statistics.friendsCount) || 'Sem Informações'}*` }, { quoted: info });
      } else if(media.image) {
        sasha.sendMessage(from, { image: { url: media.image }, caption: `*Sasha Download!*\n—\n⤷ Image de *@${data.resultado.author.username || 'Sem Informações'}*\n⤷ Legenda: *${data.resultado.description.trim() || 'Sem Informações'}*\n⤷ Linguagem: *${data.resultado.languange || 'Sem Informações'}*\n⤷ Postado em: *${data.resultado.createdAt || 'Sem Informações'}*\n⤷ Comentários: *${formatNumber(data.resultado.statistics.replieCount) || 'Sem Informações'}*\n⤷ Pessoas que favoritou: *${formatNumber(data.resultado.statistics.favoriteCount) || 'Sem Informações'}*\n⤷ Views: *${formatNumber(data.resultado.statistics.viewCount) || 'Sem Informações'}*\n—\n> *Informações do @${data.resultado.author.username || 'Usuário(a)'}:*\n⤷ Url do Autor: *${data.resultado.author.url}*\n⤷ Bio: *${data.resultado.author.bio || 'Sem Informações'}*\n⤷ Verificado? *${data.resultado.author.verified ? 'Sim' : 'Nahh' || 'Sem Informações'}*\n⤷ Localização: *${data.resultado.author.location || 'Sem Informações'}*\n⤷ Seguidores: *${formatNumber(data.resultado.author.statistics.followersCount) || 'Sem Informações'}*\n⤷ Amigos: *${formatNumber(data.resultado.author.statistics.friendsCount) || 'Sem Informações'}*` }, { quoted: info });
      }
    } else {
      await reply('Parece que o conteúdo não está disponível no momento, tente mais tarde! 😓');
    }
  } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, platform);
  }
   break;

   case 'tiktok':
   try {
 await reply(responses.wait());
    var data = await fetchJson(`${WebSite}/download/tiktok?apikey=${ApiKeySasha}&url=${query}`); 
    var { resultado } = data;
    var temVideo = resultado?.video?.playAddr?.[0];
    var temImagens = Array.isArray(resultado?.images) && resultado.images.length > 0;
    var temMusica = resultado?.music?.playUrl?.[0];
    if(!temVideo && !temImagens) {
      return await TikTokV3(query);
    }
    var sendVideo = async () => {
      await sasha.sendMessage(from, { video: { url: resultado.video.playAddr[0] }, mimetype: 'video/mp4', caption: `*Sasha Download!*\n—\n⤷ Vídeo de *${resultado.author.nickname} (@${resultado.author.username})*\n⤷ Título: *${resultado.description.trim()}*\n⤷ URL do Autor: *https://www.tiktok.com/@${resultado.author.nickname}*\n—\n> *Informações ~ Video:*\n⤷ Curtidas: *${formatNumber(resultado.statistics.diggCount)}*\n⤷ Comentários: *${formatNumber(resultado.statistics.commentCount)}*\n⤷ Compartilhamentos: *${formatNumber(resultado.statistics.shareCount)}*\n⤷ Visualizações: *${formatNumber(resultado.statistics.playCount)}*\n⤷ Data de Upload: *${new Date(resultado.createTime * 1000).toLocaleString()}*\n⤷ Região: *${resultado.author.region || 'Não disponível'}*\n⤷ ID do Vídeo: *${resultado.id}*\n—\n> *Informações ~ Music:*\n⤷ Título: *${resultado.music.title}*\n⤷ Autor: *${resultado.music.author}*\n⤷ Album: *${resultado.music.album || 'Sem Informações'}*\n⤷ Música Comercial? *${resultado.music.isCommerceMusic ? 'Sim' : 'Nah'}*\n⤷ Música Original? *${resultado.music.isOriginalSound ? 'Sim' : 'Nah'}*\n⤷ Original do Artista? *${resultado.music.isAuthorArtist ? 'Sim' : 'Nah'}*` }, { quoted: info });
    };
    var sendImages = async () => {
      for (var [index, imageUrl] of resultado.images.entries()) {
        await sasha.sendMessage(from, { image: { url: imageUrl }, caption: `Imagem *${index + 1}* de *${resultado.author.nickname} (@${resultado.author.username})*` }, { quoted: info });
      }
      return await reply('Imagens enviadas com sucesso!');
    };
    if(temVideo) {
      await sendVideo();
    }
    if(temImagens) {
      await sendImages();
    }
    if(temMusica) {
      await replyMessage('E claro, não poderia faltar a música!');
      await sasha.sendMessage(from, { audio: { url: resultado.music.playUrl[0] }, mimetype: 'audio/mpeg' });
    } else {
      await reply('Não foi possível encontrar a música.');
    }
  } catch (error) {
    await TikTokV3(query);
  }
  break;

      case 'pinterest':
 try {
        var data = await fetchJson(`${WebSite}/download/pinterest-download?apikey=${ApiKeySasha}&url=${query.trim()}`);
        if(data.resultado.length === 0) return await reply('Não encontramos nenhum resultado com esse Url.');
        await reply(responses.wait());
     if(data.resultado.dl_link) {
     const hashtags = (data.resultado.keyword && data.resultado.keyword.length > 0)  ? data.resultado.keyword.map(keyword => `#${keyword}`).join('\n')  : 'Sem hashtags disponíveis';
        await sasha.sendMessage(from, { video: { url: data.resultado.dl_link }, caption: `Sasha Download! ⤷ *${data.resultado.author.name} (${data.resultado.author.username})*\n⤷ Título: *${data.resultado.title.trim() || 'Sem título'}*\n⤷ Url do post: *${data.resultado.source || 'Sem link'}*\n⤷ Url do autor: *${data.resultado.author.url}*\n⤷ Data de Publicação: *${data.resultado.upload}*\n⤷ Hashtags:\n${hashtags}`, mimetype: 'video/mp4' });
        } else {
        await reply('Que peninha! 😿 parece que não tem donwload (mp4) disponível para esse Url');
        }
    } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, platform);
    }
    break;

        case 'thread':
      try {
        var data = await fetchJson(`https://zero-two.online/api/dl2/threads?url=${query.trim()}&apikey=Space`);
        if(!data.resultado || !data.resultado.media || data.resultado.media.length === 0) return await reply('Não encontramos nenhum resultado com esse URL.');
        await reply(responses.wait());
        for (const media of data.resultado.media) {
            const replyMedia = {
                'Photo': async () => {
                    await sasha.sendMessage(from, { image: { url: media.url }, caption: `Sasha Download! ⤷ *@${data.resultado.postInfo.username}*\n⤷ Título: *${data.resultado.postInfo.mediaTitle || 'Sem Título'}*` });
                },
                'Video': async () => {
                    await sasha.sendMessage(from, { video: { url: media.videoUrl }, caption: `Sasha Download! ⤷ *@${data.resultado.postInfo.username}*\n⤷ Título: *${data.resultado.postInfo.mediaTitle || 'Sem Título'}*`, mimetype: 'video/mp4' });
                }
            };
            if(replyMedia[media.type || 'Photo']) {
                await replyMedia[media.type || 'Photo']();
            }
        }
    } catch (error) {
        if(typeof logBug === 'function') logBug(error.message, platform);
    }
    break;

      case 'spotify':
      await reply(responses.wait());
    try { 
        var data = await fetchJson(`https://api.vreden.my.id/api/v1/download/spotify?url=${ApiKeySasha}&url=${query.trim()}`);
         if(data.result.length === 0) return await reply('Não encontramos nenhum resultado com esse Url.');
         const durationMs = data.result.duration_ms;
         const minutes = Math.floor(durationMs / 60000);
         const seconds = Math.floor((durationMs % 60000) / 1000);
         const durationFormatted = `${minutes}:${seconds.toString().padStart(2,'0')}`;
        await sasha.sendMessage(from, { image: { url: data.result.cover_url }, caption: `❏ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: 𝗦𝗽𝗼𝘁𝗶𝗳𝘆\n—\n⤷ Título: *${data.result.title.trim() || 'Sem título'}*\n⤷ Artista: *${data.result.artists}*\n⤷ Álbum: *${data.result.album}*\n⤷ Duração: *${durationFormatted} Minutos*\n⤷ Lançamento: *${data.result.release_date}*` }, { quoted: info });
        if(data.result.download) { 
        await sasha.sendMessage(from, { audio: { url: data.result.download }, mimetype: 'audio/mpeg' });
        } else {
        await reply('Que peninha! 😿 parece que não tem donwload (music) disponível para esse Url');
        }
    } catch (error) {
    if(typeof logBug === 'function') logBug(error.message, platform);
    }
   break;

      case 'facebook':
        await reply(responses.wait());
        var data = await fetchJson(`${WebSite}/download/facebook?apikey=${ApiKeySasha}&url=${query.trim()}`);
        if(!data?.resultado?.resultado) {
            return await reply('Erro: Resposta da API inválida.');
        }
        const videoInfo = data.resultado.resultado;
        var videoUrl = videoInfo.dl_link?.HD || videoInfo.dl_link?.SD;
        if(!videoUrl) return await reply('Erro: Não foi possível obter o link do vídeo.');
    break;

      default:
        break;
    }
  }
}

await baixar(budy);

if(verifyGrupo && verificarExecution?.sasha?.status && budy !== undefined) {
  if(type === 'imageMessage') return;
  if(type === 'audioMessage') return;
  if(type === 'stickerMessage') return;
  if(info.key.fromMe) return;
  const emojisList = ['🤠', '💅🏻', '🦸‍♀️', '👮‍♀️', '😹', '😸'];
  await reagir(from, emojisList[Math.floor(Math.random() * emojisList.length)]);
  try {
    const response = await new SashaAI().chat([{ role: 'user', content: body }]);
    await sasha.sendMessage(from, { text: response }, { quoted: info });
  } catch (error) {
    await sasha.sendMessage(from, { text: responses.error() }, { quoted: info });
  }
}

var usuarios = await getUsuarios();
var dataAtual = new Date();
if(usuarios?.length) {
  for (const usuario of usuarios) {
    if(usuario.plano?.length) {
      for (const plano of usuario.plano) {
        if(!plano.infinito && new Date(plano.dataExpiracao) <= dataAtual && plano.status) {
          await sasha.sendMessage(usuario.id, { text: `Olá, ${usuario.nome}!\n\nNotamos que o seu plano de ${plano.nome} dias expirou. Não se preocupe! Você pode renová-lo agora mesmo para continuar aproveitando todos os benefícios.\n\nAcesse a loja para renovar seu plano ou escolha um novo!`, mentions: [usuario.id] });
          plano.status = false;
          await updateUsuario(usuario.id, usuario);
        }
      }
    }
  }
}

if(usuarios?.length) {
  for (const usuario of usuarios) {
    if(usuario.dono?.length) {
      for (const dono of usuario.dono) {
        if(dono.status && !dono.infinito && new Date(dono.dataExpiracao) <= dataAtual) {
          await sasha.sendMessage(usuario.id, { text: 'Seu cargo de *Dono* expirou e seu acesso foi removido, você não tem mais benefícios de donos.'});
          dono.status = false;
          await updateUsuario(usuario.id, usuario);
        }
      }
    }
  }
}

const verificarAniversariosCasamento = () => {
    if(!usuarios || !Array.isArray(usuarios)) return
    var hoje = new Date();
    var diaHoje = hoje.getDate();
    var mesHoje = hoje.getMonth() + 1; 
    usuarios.forEach(usuario => {
        if(usuario.casamento) {
            var parceiro = usuario.casamento.parceiro;
            var dataCasamento = new Date(usuario.casamento.desde);
            var diaCasamento = dataCasamento.getDate();
            var mesCasamento = dataCasamento.getMonth() + 1;
            var anoCasamento = dataCasamento.getFullYear();
            var anosCasados = hoje.getFullYear() - anoCasamento;
            var mesesCasados = (hoje.getMonth() - dataCasamento.getMonth()) + (anosCasados * 12);
            var mensagem = '';
            if(mesCasamento === mesHoje && diaCasamento === diaHoje) {
                if(anosCasados > 0) {
                    mensagem = `🎉 *Parabéns @${usuario.id.split('@')[0]} e @${parceiro.split('@')[0]}!*\n\n💍 Hoje vocês completam *${anosCasados} ano(s)* de casados! ❤️🎊`;
                } else {
                    mensagem = `🎉 *Feliz Aniversário de Casamento!* 💕\n\n💍 @${usuario.id.split('@')[0]} e @${parceiro.split('@')[0]}, hoje vocês completam *${mesesCasados} meses* juntos! ❤️`;
                }
            }
            if(mensagem) {
                sasha.sendMessage(usuario.id, { text: mensagem, mentions: [usuario.id, parceiro] });
            }
        }
    });
};

await verificarAniversariosCasamento()

/* ------- [ Comandos + Similaridade ] ------- */
if(verifyCmd) {
    const cmdSimilarity = listCommands(command);
    const similarityPercentage = cmdSimilarity.similarity || 0;
    const similarCommand = cmdSimilarity.command || 'nenhum comando encontrado';
    const similaritySuggestions = [
        `Olha... *${similarityPercentage}%* de semelhança com *'${prefix + similarCommand}'*. Não é exatamente igual, mas hey, pelo menos tentei, né?`,
        `Talvez você quisesse dizer *'${prefix + similarCommand}'*... ou talvez só quis me confundir mesmo. *${similarityPercentage}%* de semelhança é o que temos.`,
        `Achei algo *levemente parecido*: *'${prefix + similarCommand}'* (${similarityPercentage}%). Se não for isso, aí complica.`,
        `Tá longe de ser igual, mas ó: *'${prefix + similarCommand}'* tem *${similarityPercentage}%* de similaridade. Pode ser um chute... ou um gênio incompreendido.`,
        `Não sou mágico, mas *'${prefix + similarCommand}'* apareceu com *${similarityPercentage}%* de similaridade. Se não era isso, a culpa é do autocorretor.`,
        `Você digitou uma coisa, mas meu cérebro bugado pensou em *'${prefix + similarCommand}'* com *${similarityPercentage}%* de chance. Ajudei?`,
        `*'${prefix + similarCommand}'*. *${similarityPercentage}%* de similaridade. Se não era isso, você digitou em élfico, né?`
    ]
    const noSimilarityMessages = [
        `Nem com bola de cristal eu consegui entender esse comando. Que tal tentar de novo?`,
        `Comando tão misterioso que nem o Google conhece. Dá uma olhada no menu!`,
        `Não achei nem algo parecido... parece que esse comando veio de outro universo.`,
        `Essa tentativa foi criativa, eu admito. Mas não encontrei nada. Menu tá logo ali.`,
        `Se esse comando existe, ele tá em outro plano astral.`,
        `Tentei, forcei, comparei... e nada. Melhor tentar de novo com mais carinho.`
    ]
    const similarityMessage = similarityPercentage > 40 ? similaritySuggestions[Math.floor(Math.random() * similaritySuggestions.length)] : noSimilarityMessages[Math.floor(Math.random() * noSimilarityMessages.length)]
    const messages = [
        `Olá ${NickName} ${tempo}! O comando *'${command || prefix}'* parece que só existe na sua imaginação. Dá uma olhada no menu antes de inventar moda.\n—\n⤷ ${similarityMessage}`,
        `Uau ${NickName}, esse comando *'${command || prefix}'* é tão exclusivo que nem eu conheço. Será que você desbloqueou algum segredo?\n—\n⤷ ${similarityMessage}`,
        `Hmm... tentei achar o comando *'${command || prefix}'*, mas parece que ele só funciona no mundo invertido. Dá uma conferida no menu, vai que... né?\n—\n⤷ ${similarityMessage}`,
        `Você digitou *'${command || prefix}'* achando que eu ia entender? Confiante você, hein ${NickName}...\n—\n⤷ ${similarityMessage}`,
        `Esse comando *'${command || prefix}'*... olha, se ele existe, ele tá se escondendo bem. Sugiro consultar o menu, detetive.\n—\n⤷ ${similarityMessage}`,
        `Rapaz, nem o Google conseguiria entender esse *'${command || prefix}'*. Tenta um comando real da próxima vez.\n—\n⤷ ${similarityMessage}`,
        `Ihh ${NickName}, com esse comando *'${command || prefix}'* você quase quebrou meu sistema... Brincadeira! Mas não achei mesmo não.\n—\n⤷ ${similarityMessage}`,
        `Comando *'${command || prefix}'* não encontrado. Mas parabéns pela criatividade. Talvez um dia eu aprenda esse também!\n—\n⤷ ${similarityMessage}`
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    await reagir(from, '⚠️')
    await sasha.sendMessage(from, { text: randomMessage }, { quoted: info })
}
 
}
}
}

/* ----- [ Detectar alterações e salvar as modificações sem reiniciar a conexão ] ----- */
fs.watchFile(require.resolve(__filename), () => {
    fs.unwatchFile(require.resolve(__filename));
    console.log(colors.red('[MODIFICAÇÃO NO ARQUIVO]'), colors.white(__filename));
    delete require.cache[require.resolve(__filename)];
    require(require.resolve(__filename));
});

/* --------- [ Exportação da Função ] --------- */
module.exports = startBOT;
/* ----- [ Créditos ao Biel | © Sasha-BOT ] ----- */