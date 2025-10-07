const { downloadContentFromMessage, prepareWAMessageMedia, proto, relayWAMessage, mentionedJid, processTime, MediaType, Browser, MessageType, Presence, Mimetype, Browsers, delay, getLastMessageInChat } = require('@whiskeysockets/baileys');

/* --------- [ Módulos Necessários ] ---------- */
const { Boom }  = require('@hapi/boom');
const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const crypto = require('crypto');
const cfonts = require('cfonts');
const chalk = require('chalk');
const util = require('util');
const P = require('pino');
const path = require('path');
const readline = require('readline');
const connect = readline.createInterface({ input: process.stdin, output: process.stdout });
const NodeCache = require('node-cache');
const isUrl = require('valid-url');
const ffmpeg = require('fluent-ffmpeg');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const { exec } = require('child_process');
const moment = require('moment-timezone');
const colors = require('colors');
const YouTube = require('yt-search');
const YTbe = require('./utils/libraries/plugins/yt.js');
const yt = new YTbe();
/* Data & Hora */
const time = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
const hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
const date = moment.tz('America/Sao_Paulo').format('DD/MM/YY');

/* --------- [ Funções JS - Arquivos ] --------- */
const { capitalizeFirstLetter, TimeCount, getBuffer, fetchJson, getGroupAdmins, getMembros, getExtension, getRandom, formatNumber, iniciarSistemaPremium } = require('./utils/libraries/functions.js');
const { Sticker } = require('./utils/libraries/sticker');
const connectToDatabase = require('./utils/connect');
const SashaAI = require('./utils/libraries/plugins/SashaAI.js');
//const anime = require('./utils/libraries/plugins/animes.js');
const uploader = require('./utils/libraries/upload.js');
const WebP_GIF = require('./utils/libraries/webpmp4.js');
const RemoverFundo = require('./utils/libraries/removebg.js');

/* -------------- [ Arquivos JSON ] -------------- */
const bugs = JSON.parse(fs.readFileSync('./configs/media/bugs.json'));
const settings = JSON.parse(fs.readFileSync('./configs/settings.json'));
const configs = JSON.parse(fs.readFileSync('./configs/configs.json'));
const images = JSON.parse(fs.readFileSync('./configs/images.json'));
const packname = JSON.parse(fs.readFileSync('./package.json'));

/* -------------- [ Definições Essenciais ] -------------- */
const donoName = settings['nameOwner'].value;
const prefix = settings['Prefix'].value;
const channel = settings['NewsletterConfig'].value;
const botName = settings['botName'].value;
const { linguagem, responses, getInfo } = require('./configs/lib');

/* ------ [ Apagar/Criar/Verificar/Salvar arquivos do Diretório ] ------ */
function deleteFile(localDoArquivo) {try {fs.unlinkSync(localDoArquivo)} catch(error) {}};
const verificarJson = (json, value) => {
if(JSON.stringify(json).includes(value)) return true
return false
}

const saveJson = (caminho, dados) => {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
};

function saveFile(filePath, Media) {
  fs.writeFileSync(filePath, Media);
}

function lerJSON(caminho) {
  try {
    const dados = fs.readFileSync(caminho, 'utf8');
    return JSON.parse(dados);
  } catch (erro) {
    return null;
  }
}

function lerArquivo(caminho) {
  try {
    const conteudo = fs.readFileSync(caminho, 'utf8');
    return conteudo;
  } catch (erro) {
    return null;
  }
}

/* ---- [ Letras Modificadas ou Emojis ] ---- */
function antiLetraEmoji(str) {
    for (let i = 0, n = str.length; i < n; i++) {
        if(str.charCodeAt(i) > 255) {
            return true;
        }
    }
       return false;
}

/* --------- [ Download de Média ] --------- */ 
const getFileBuffer = async (mediakey, MediaType) => {
   const stream = await downloadContentFromMessage(mediakey, MediaType);
     var buffer = Buffer.from([]);
       for await(const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk]);
    }
     return buffer;
};

/* --------- [ Tudo abaixo await sleep(1000) vai demorar 1 segundo pra funcionar, 1000 é igual 1 segundo.. ] --------- */
const sleep = async function(ms) {
return new Promise(resolve => setTimeout(resolve, ms))
};
/* -------- [ Função principal da Sasha Bot ] ------- */
async function getUsuarios() {
    const { db, collections } = await connectToDatabase();
    return collections.usuarios.find({}).toArray();
}

async function getUsuarioById(id) {
    const { db, collections } = await connectToDatabase();
    const usuario = await collections.usuarios.findOne({ id });
    return usuario;
}

async function getOrCreateUsuario(id) {
    const { db, collections } = await connectToDatabase();
    var usuario = await collections.usuarios.findOne({ id });

    if (!usuario) {
        usuario = {
            id,
            namoro: null,
            casamento: null,
            pedidoNamoro: null,
            conviteNamoro: null,
            pedidoCasamento: null,
            conviteCasamento: null
        };
        await collections.usuarios.insertOne(usuario);
    }

    return usuario;
}

async function addUsuario(novoUsuario) {
    const { db, collections } = await connectToDatabase();
    const existente = await collections.usuarios.findOne({ id: novoUsuario.id });
    if (existente) return false;

    const result = await collections.usuarios.insertOne(novoUsuario);
    return result.acknowledged;
}

async function updateUsuario(id, novosDados) {
    const set = {};
    const unset = {};

    for (const key in novosDados) {
        if (novosDados[key] === null) unset[key] = "";
        else set[key] = novosDados[key];
    }

    const update = {};
    if (Object.keys(set).length) update.$set = set;
    if (Object.keys(unset).length) update.$unset = unset;
    const { db, collections } = await connectToDatabase();
    const result = await collections.usuarios.updateOne({ id }, update);
    return result.modifiedCount > 0;
}

async function updateRelationShip(id1, id2, tipo, data = null) {
    const { db, collections } = await connectToDatabase();
    const tiposValidos = ['namoro', 'casamento'];

    const campo = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const pedido = `pedido${campo}`;
    const convite = `convite${campo}`;

    await collections.usuarios.updateMany(
        { id: { $in: [id1, id2] } },
        { $set: { [pedido]: null, [convite]: null } }
    );

    if (data) {
        await collections.usuarios.updateOne({ id: id1 }, { $set: { [tipo]: { parceiro: id2, desde: data } } });
        await collections.usuarios.updateOne({ id: id2 }, { $set: { [tipo]: { parceiro: id1, desde: data } } });
    } else {
        await collections.usuarios.updateOne({ id: id1 }, { $unset: { [tipo]: "" } });
        await collections.usuarios.updateOne({ id: id2 }, { $unset: { [tipo]: "" } });
    }

    return true;
}

/* -------- [ Similaridade de Comandos ] ------- */
function fuzzySimilarity(word1, word2) {
   function generateNGrams(word, n) {
      const nGrams = [];
      for (let i = 0; i < word.length - n + 1; i++) {
        nGrams.push(word.slice(i, i + n));
      }
        return nGrams;
    };
  const nGrams1 = generateNGrams(word1, 2);
  const nGrams2 = generateNGrams(word2, 2);
  const commonNGrams = nGrams1.filter(nGram => nGrams2.includes(nGram));
  const similarity = Math.round((2 * commonNGrams.length) / (nGrams1.length + nGrams2.length) * 100);
      return similarity;
}
  
function listCommands(targetWord) {
    const fileContent = fs.readFileSync('command.js', 'utf8');
    const commandsRegex = /case\s+[''](.+?)['']/g;
    let mostSimilarCommand = '';
    let highestSimilarity = -1;
    let match;
        while ((match = commandsRegex.exec(fileContent)) !== null) {
          const extractedCommand = match[1];
          const similarity = fuzzySimilarity(targetWord, extractedCommand);
          if (similarity > highestSimilarity) {
              highestSimilarity = similarity;
              mostSimilarCommand = extractedCommand;
          }
      }
      return {command: mostSimilarCommand, similarity: highestSimilarity};
};

module.exports = {
/* 1: Módulos - © Sasha-BOT */
P, path, fs, util, Boom, axios, ffmpeg, fetch, exec, isUrl, moment, cheerio, NodeCache, connect, colors, cfonts, chalk, YouTube, yt,
/* 1: Funções JS - © Sasha-BOT */
getBuffer, fetchJson, capitalizeFirstLetter, getExtension, getGroupAdmins, getMembros, getRandom, formatNumber, iniciarSistemaPremium, TimeCount, SashaAI, connectToDatabase, Sticker, uploader, RemoverFundo, WebP_GIF,
/* 3: Funções JSON - © Sasha-BOT */
packname, bugs, settings, configs, images,
/* 4: Menus/Info - © Sasha-BOT */
 linguagem, responses, getInfo, botName, donoName, prefix, channel,
/* 5: Funções Nescessária - © Sasha-BOT */
time, hora, date, getFileBuffer, verificarJson, saveJson, saveFile, lerJSON, lerArquivo, deleteFile, sleep, listCommands, antiLetraEmoji, getUsuarios, addUsuario, getUsuarioById, updateRelationShip, getOrCreateUsuario, updateUsuario
}