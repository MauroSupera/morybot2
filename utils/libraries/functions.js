const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const cfonts = require('cfonts');
const os = require('os');
const chalk = require('chalk');
const mimetype = require('mime-types');
const moment = require('moment-timezone');

/* Função 1: Acessar sites com JSON e retornar seu resultado. */
async function fetchJson(url, options) { 
   const resultado = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options });
	if (!resultado.ok) return Promise.reject('Error')
		const json = await resultado.json();
		return Promise.resolve(json);
}

/* Função 2: Criar um Buffer de uma mídia (vídeo, etc...) através de um URL. */
async function getBuffer(url) {
	const resultado = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, method: 'GET' });
	if (!resultado.ok) return Promise.reject('Error')
	const buffer = await resultado.buffer();
		return Promise.resolve(buffer);
}

/* Função 3: Descobrir a extensão da mídia através de uma terminação. */
const getExtension = async(type) => {
    return await mimetype.extension(type)
}

/* Função 4: Criar uma Array com os adminstradores do grupo. */
const getGroupAdmins = (participants) => {
    admins = []
    for (let i of participants) {
        if(i.admin == 'admin') admins.push(i.phoneNumber)
        if(i.admin == 'superadmin') admins.push(i.phoneNumber)
    }
    return admins
}

/* Função 5: Criar uma Array com todos os membros, sem incluir os administradores. */
const getMembros = (participants) => {
    admins = []
    for (let i of participants) {
        if(i.admin == null) admins.push(i.phoneNumber)
    }
    return admins
}

/* Função 6: Criar uma sequência numérica para uso nos arquivos temporários. */
const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

/* Função 7: Fazer a conversão de segundos para dias, horas, minutos e segundos. */
function TimeCount(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s
    };
        var dias = Math.floor(seconds / (60*60) / (24));
        var horas = Math.floor(seconds / (60*60) % (24));
        var minutos = Math.floor(seconds % (60*60) / 60);
        var segundos = Math.floor(seconds % 60);
    return `${pad(dias)} dia(s), ${pad(horas)} hora(s), ${pad(minutos)} minuto(s) e ${pad(segundos)} segundo(s).`;
}

/* Função 8: Transformar a primeira letra em maiuscula. */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

/* Função 9: Formata os números por exemplo: 2585299 para 2.6M */
const formatNumber = (num) => {
      if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'M';
      } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'K';
      }
      return num;
};

/* Função 10: Console Log de OPEN da Sasha Bot */
function limparConsole() {
    console.clear();
}

function mostrarTituloBold() {
    console.log(
        cfonts.render('SASHA BOT', {
            font: 'block',
            align: 'center',
            colors: ['#00f2ff', '#008cff', '#00ffea'],
            gradient: true,
            bold: true,
            env: 'node'
        }).string
    );
}

const ping = performance.now();

function criarPainelStatusBold() {
    return [
        '╭────────────────────────────────────────────────────────╮',
        `│ ✧ ${chalk.hex('#008cff').bold('SASHA BOT v3.0.0')} ${chalk.hex('#fffff').bold('→')}  ${chalk.gray.bold('Bot para Whatsapp Web')}`,
        '├───────────────────┬────────────────────────────────────┤',
        `│ ${chalk.hex('#00ff7b').bold('⌬ VERSÃO')}    → ${chalk.hex('#fffff').bold('3.0.0')}${' '.repeat(12)}${chalk.gray.bold(`[${'■'.repeat(4)}${'□'.repeat(1)}]`)}`,
        `│ ${chalk.hex('#00ff7b').bold('⟁ SISTEMA')}   → ${chalk.hex('#fffff').bold(`${os.platform().toUpperCase()} ${os.arch()}`)}${' '.repeat(15)}`,
        `│ ${chalk.hex('#00ff7b').bold('⚡ VELOCIDADE')} → ${chalk.hex('#fffff').bold(`${(performance.now() - ping).toFixed(2)}ms`)}${' '.repeat(15)}`,
        `│ ${chalk.hex('#00ff7b').bold('⎈ SOCIAL')}    → ${chalk.hex('#fffff').bold('@not.bieel')}`,
        `│ ${chalk.hex('#00ff7b').bold('⟠ DESENVOLVEDOR')} → ${chalk.hex('#fffff').bold('Equipe Sasha - Biel')} ${chalk.gray.bold('[')}${chalk.greenBright.bold('■■■■■')}${chalk.gray.bold('□□□□□]')}`,
        `│ ${chalk.hex('#00ff7b').bold('⏣ STATUS')}    → ${chalk.bold.green('ONLINE')} ${chalk.hex('#00ff7b').bold('Conexão Whatsapp Web Estabelecida')}`,
        '╰───────────────────┴────────────────────────────────────╯'
    ].join('\n');
}

function criarBarraProgressoBold(percent) {
    const filled = Math.min(20, Math.floor(percent / 5));
    return `${chalk.hex('#00f2ff').bold('⟦')}${chalk.hex('#00ffea').bold('■'.repeat(filled))}${chalk.gray.bold('□'.repeat(20 - filled))}${chalk.hex('#00f2ff').bold('⟧')} ${chalk.hex('#fffff').bold(`${percent}%`)}`;
}

async function animarCarregamentoBold() {
    console.log(`\n${chalk.hex('#00ffea').bold('⚡ INICIALIZANDO SISTEMA WHATSAPP WEB')}`);
    
    var progress = 0;
    const loadingPhases = [
        'Inicializando módulos',
        'Conectando ao WhatsApp Web',
        'Conectando ao Mongo DB',
        'Carregando mensagens',
        'Carregando data base',
        'Otimizando o servidor',
        'Preparando interfaces'
    ];

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const phase = loadingPhases[Math.min(Math.floor(progress / 20), loadingPhases.length - 1)];
            
            process.stdout.write(`\r${' '.repeat(process.stdout.columns - 1)}\r`);
            process.stdout.write(`${chalk.hex('#ff00ea').bold('↻')} ${chalk.hex('#fffff').bold(phase + ':')} ${criarBarraProgressoBold(progress)}`);
            
            progress += 2;
            
            if (progress > 100) {
                clearInterval(interval);
                process.stdout.write(`\r${' '.repeat(process.stdout.columns - 1)}\r`);
                process.stdout.write(`${chalk.hex('#00ff7b').bold('✓')} ${chalk.hex('#fffff').bold('Sistema pronto:')} ${criarBarraProgressoBold(100)}\n\n`);
                resolve();
            }
        }, 80);
    });
}

function mostrarMensagemFinalBold() {
    console.log([
        chalk.hex('#00f2ff').bold('╭──────────────────────────────────────────────────────╮'),
        chalk.hex('#00f2ff').bold('│') + chalk.hex('#00ffea').bold('        SASHA BOT CONECTADA AO WHATSAPP WEB '),
        chalk.hex('#00f2ff').bold('│') + chalk.hex('#fffff').bold('           Todos os comandos carregados      '),
        chalk.hex('#00f2ff').bold('│') + chalk.hex('#fffff').bold('           © Copyright Sasha Bot & Biel     '),
        chalk.hex('#00f2ff').bold('╰──────────────────────────────────────────────────────╯')
    ].join('\n'));
    
    console.log(chalk.hex('#00ff7b').bold('\n[ SISTEMA PRONTO PARA RECEBER MENSAGENS]\n'));
}

async function iniciarSistemaPremium() {
    limparConsole();
   // mostrarTituloBold();
  //  console.log(criarPainelStatusBold());
//    await animarCarregamentoBold();
  //  mostrarMensagemFinalBold();
}

module.exports = { capitalizeFirstLetter, TimeCount, getBuffer, fetchJson, getGroupAdmins, getMembros, getExtension, getRandom, formatNumber, iniciarSistemaPremium }
