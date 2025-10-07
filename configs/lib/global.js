module.exports = {
  botInfo: () => {
  return `🌸 Olá, eu sou a Sasha Bot! 🌸

Fui criada com muito amor e dedicação pelo Biel, sendo desenvolvida totalmente do zero! 💖 Todo o meu funcionamento é baseado na minha própria API exclusiva: https://sasha.online, garantindo comandos rápidos, eficientes e personalizados para oferecer a melhor experiência possível.

🔧 Informações Técnicas:
 🌟 Versão Atual: 2.0.0
 🧠 Inteligência Artificial Integrada
 🚀 Comandos e funcionalidades otimizadas
 🔗 Baseada em API própria para maior estabilidade

Estou aqui para facilitar sua vida e tornar sua experiência incrível! Qualquer dúvida ou sugestão, sinta-se à vontade para interagir comigo. 💕`
  },
  
    donoInfo: (pushname, sender, NumberDonoOficial, prefix) => {
    return `🌟 Informações do Dono da Sasha Bot 🌟

Olá, ${pushname}!

Aqui estão as informações do dono e do bot para você:

—

Informações do Dono:
 ⤷ Solicitante: @${sender.split('@')[0]}
 ⤷ Contato do Dono: wa.me/${NumberDonoOficial}

—

Informações do Bot:
 ⤷ Prefixo: ${prefix}

—

Se precisar de algo, estarei sempre à disposição para te ajudar! 😄`
    },
  
    configBot: (prefix) => {
    return `🌟 Tutorial de Como Personalizar a Sasha Bot 🌟

A Sasha Bot foi feita para ser totalmente personalizável! Com alguns comandos simples, você pode ajustar o nome, apelido, número do dono, prefixo e até a imagem do menu.

1️⃣ Ativando o Bot

Para começar, você precisa ativar a Sasha Bot no Termux ou em outro ambiente compatível. Após a ativação, vá até o WhatsApp do bot e inicie uma conversa privada com ele.

Agora, basta usar os comandos abaixo para personalizar tudo do seu jeito!

—

📝 Alterar o Nome do Bot

Este comando define o nome que será exibido nas interações da Sasha Bot.

 ⤷ Comando:

${prefix}nome-bot Sasha Bot

 ⤷ Exemplo:
Se você quiser mudar para “Sasha IA”, basta enviar:

${prefix}nome-bot Sasha IA

✅ Você pode usar letras personalizadas e símbolos para deixar o nome ainda mais estiloso!

—

👑 Definir Apelido do Dono

Caso queira que a Sasha Bot reconheça você por um apelido específico, use este comando.

 ⤷ Comando:

${prefix}nick-dono Biel

 ⤷ Exemplo:
Se deseja que o bot te chame de “Chefe”, envie:

${prefix}nick-dono Chefe

Agora, toda vez que o bot falar com você, ele usará esse apelido!

—

📞 Configurar o Número do Dono

Este comando define qual número será reconhecido como o dono oficial do bot.

 ⤷ Comando:

${prefix}numero-dono 559885568495

 ⤷ Importante:
˚✧ Digite o número sem o “+”, sem traços “-” e sem o 9 extra da operadora.
˚✧ O número precisa ser exatamente igual ao do seu WhatsApp.
˚✧ Apenas o próprio bot pode definir quem será seu dono antes da configuração inicial.

—

⚙️ Alterar o Prefixo do Bot

O prefixo é o símbolo que ativa os comandos da Sasha Bot.

 ⤷ Comando:

${prefix}prefixo-bot !

 ⤷ Exemplo:
Se o prefixo atual for ${prefix}, ao rodar o comando acima, ele será alterado para !.
Agora, ao invés de ${prefix}comando, você precisará digitar !comando para ativar as funções.

—

🖼️ Trocar a Foto do Menu

Se deseja personalizar a imagem do menu do bot, utilize este comando.

 ⤷ Comando:

${prefix}fotomenu

 ⤷ Como usar:
	1.	Marque a imagem desejada no WhatsApp.
	2.	Envie o comando enquanto a imagem estiver marcada.

Agora, o menu da Sasha Bot terá a imagem que você escolheu!

—

🎉 Parabéns! Agora a Sasha Bot está personalizada do seu jeito! 🎉
Caso tenha dúvidas, repita os comandos ou consulte a documentação oficial.

Se precisar de mais ajuda, me avise!`
    },
    
    infoBemVindo: (prefix) => {
    return `🌟 Tutorial de Como Configurar o Bem-Vindo na Sasha Bot 🌟

Olá! Vou te ensinar como configurar a mensagem de bem-vindo da Sasha Bot, para que sua interação seja ainda mais personalizada e acolhedora!

1️⃣ Ativando o Bem-Vindo

Para começar, você precisa ativar o comando de bem-vindo. Isso faz com que o bot envie uma saudação automática para qualquer novo usuário que entrar em seu WhatsApp.

 ⤷ Comando:

${prefix}bemvindo

—

2️⃣ Configurando Bem-Vindo com Foto

Caso você queira que a mensagem de bem-vindo seja acompanhada de uma foto personalizada, você pode ativar este comando.

 ⤷ Comando:

${prefix}ftwelcome

Isso permitirá que você adicione uma imagem à mensagem de boas-vindas, tornando-a mais visual e atraente.

—

3️⃣ Alterando o Fundo de Entrada e Saída

Se você deseja personalizar ainda mais o visual da sua bot, pode alterar os fundos de entrada e saída dos usuários.

 ⤷ Comando para mudar o fundo da entrada (bem-vindo):

${prefix}fundobv

 ⤷ Comando para mudar o fundo da saída (despedida):

${prefix}fundosaiu

—

Agora a Sasha Bot está configurada com um bem-vindo personalizado, seja com foto ou fundo! Se precisar de mais alguma ajuda, não hesite em me chamar. 😄`
    }
}