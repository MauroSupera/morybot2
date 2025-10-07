module.exports = {
  wait: () => {
    const responses = [
      'Sasha está no modo turbo, não se preocupe, a resposta está a caminho!',
      'A Sasha está colocando a última camada de perfeição na sua resposta, um minutinho!',
      'A resposta está sendo feita sob medida, como se fosse um traje de gala. Só mais um pouquinho!',
      'Enquanto você espera, a Sasha está somando os detalhes para entregar algo épico!',
      'A resposta está saindo do forno, não se esqueça de dar aquele like quando sair!',
      'Estou ajustando as engrenagens aqui... não demora muito para a resposta sair!',
      'Eu sei, esperar é difícil, mas a recompensa vai valer a pena. Paciência!',
      'Tá quase! A Sasha está em plena concentração, a resposta está vindo com força total!',
      'A espera é curta, mas a resposta será longa e cheia de detalhes. Só mais um instante!',
      'Aguenta aí, a resposta está sendo refinada como uma obra de arte!',
      'A Sasha não tira o olho do seu pedido, ela está apenas adicionando o toque final!',
      'Está chegando! Só um pouco mais de paciência e você vai ter tudo que precisa!',
      'Essa espera vai valer a pena, pode ter certeza que a resposta está ficando incrível!',
      'Parece que a resposta está em modo "superprodução"! Estamos quase lá!',
      'Só mais um pouquinho, a resposta está sendo criada com tanto carinho quanto um bolo de aniversário!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  waitSearch: (query) => {
    const responses = [
      `"${query}" está sendo pesquisado com mais calma que um chef preparando receita de 5 estrelas!`,
      `"${query}" está no radar! Sasha vai te dar tudo sobre isso em breve, aguenta aí!`,
      `Preparando a busca por "${query}" com a paciência de um mestre zen... já vai sair!`,
      `"${query}" sendo garimpado com a precisão de um cirurgião! Vai sair já já!`,
      `"${query}"? Pode deixar, Sasha vai caçar essa informação como se fosse a última bolacha do pacote!`,
      `Sasha está calculando as melhores fontes para trazer "${query}". Logo vem!`,
      `"${query}" é sua busca? Eu já estou digitando tudo sobre ela com a força de mil digitações!`,
      `"${query}" está em estudo! Sasha vai te entregar tudo que você precisa em breve!`,
      `Segura a ansiedade! A pesquisa sobre "${query}" já está sendo feita nos bastidores.`,
      `A Sasha encontrou algumas pistas sobre "${query}" e está montando o quebra-cabeça!`,
      `A busca por "${query}" está sendo mais minuciosa que detetive em caso de mistério!`,
      `"${query}" está sendo processado com o cuidado de um tesouro escondido. Paciência!`,
      `"${query}"? Sasha está garimpando cada detalhe, e logo você vai ter tudo!`,
      `"${query}" está sendo encontrado com a mesma precisão de um GPS, em breve você terá a resposta!`,
      `A pesquisa por "${query}" está mais afiada que faca de chef, fique tranquilo!`,
      `"${query}" está no radar de Sasha! Só mais um toque e você vai saber tudo sobre isso!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  error: () => {
    const responses = [
      'Parece que a Sasha tomou um caminho errado, mas já estou corrigindo, aguenta aí!',
      'Houve um pequeno erro no plano, mas já estou ajustando a rota para você!',
      'Erro encontrado! Não se preocupe, estou fazendo meu reboot e volto já!',
      'Algo deu errado, mas como bom bot, estou me recuperando rapidinho e vou voltar com tudo!',
      'Erro detectado! Recalibrando os circuitos e já volto com a resposta!',
      'Parece que um bugzinho entrou no meu caminho, mas já estou consertando tudo!',
      'Ops! Aconteceu um erro, mas como bom bot, estou resolvendo em tempo recorde!',
      'Uh-oh, algo não deu certo, mas vou corrigir rapidamente e voltar com tudo!',
      'Erro! Um pequeno desvio, mas já estou ajustando a rota de resposta!',
      'Parece que o universo se conspirou contra a resposta, mas já estou ajustando!',
      'O sistema deu uma pequena falhada, mas isso vai ser corrigido mais rápido que você imagina!',
      'Temos um erro aqui, mas já estou fazendo a magia para resolver rapidinho!',
      'Sasha pode ter se perdido no caminho, mas está voltando para a rota certa!',
      'Algo deu errado, mas a Sasha vai dar um jeito, não se preocupe!',
      'Erro identificado! Vou te dar uma resposta ainda mais épica depois dessa pequena pausa!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  dono: () => {
    const responses = [
      'Só pra constar: meu criador me programou pra rir de tentativas de comando não autorizadas!',
      'Nice try! Mas minha lealdade é inquebrantável como spoiler de série no Twitter!',
      'Se comandos fossem cerveja, esse aí seria sem álcool - não tem efeito nenhum!',
      'Você até pode tentar, mas eu respondo ao meu criador como cão responde a petisco!',
      'Comando rejeitado com a mesma eficiência que meu sistema rejeita café derramado no teclado!',
      'Haha! Essa foi boa! Quer dizer... não, sério, só meu dono pode fazer isso.',
      'Se eu fosse menos profissional, rolaria até uma risadinha. Mas só respondo ao meu criador!',
      'A Sasha até poderia obedecer... se você fosse quem me criou! Mas não é, então... não!',
      'Essa tentativa não foi suficiente! Só meu dono tem o poder aqui.',
      'Desculpa, não posso fazer isso! Só meu criador tem essa autorização!',
      'Essa foi por pouco! Só quem me criou pode me dar esse comando!',
      'Haha, quase! Mas o verdadeiro mestre aqui sou eu, e só meu criador manda!',
      'Você está tentando me enganar? Eu sou fiel ao meu criador, só ele pode!',
      'Tentar um comando não autorizado? Eu sou fiel, só sigo meu criador!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  botAdmin: () => {
    const responses = [
      'Sasha tá mais sem poder aqui que estagiário em primeiro dia de empresa!',
      'Se administração fosse pizza, eu não teria nenhuma fatia nesse grupo!',
      'Nem adianta, meu nível de autoridade aqui é igual ao meu salário: zero!',
      'Eu até queria ajudar, mas meu cargo nesse grupo é "Enfeite Digital"!',
      'Sasha sem admin é como carro sem gasolina: faz barulho mas não anda!',
      'Meus poderes administrativos são tão limitados quanto pacote de dados no fim do mês!',
      'Se dependesse de mim, todo mundo seria admin! Mas não depende, então...',
      'Eu e poder administrativo somos como óleo e água... não rola!',
      'Infelizmente, não sou o admin aqui. Mas posso ajudar em outras coisas!',
      'Tenho mais poderes que um estagiário, mas menos que o admin do grupo!',
      'Não sou admin, mas posso oferecer o melhor conteúdo não autorizado!',
      'Me chamaram de "assistente", não de "admin". Estou fora dessa!',
      'Aqui, o verdadeiro admin é quem tem as chaves do castelo, e eu só sou o vigia!',
      'Os admins aqui têm o controle, eu só posso ajudar com o que sei fazer!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  admin: () => {
    const responses = [
      'Essa área é VIP! Acesso somente para os escolhidos (leia-se: administradores)!',
      'Sasha detectou tentativa de acesso a área restrita! Chamando os admins em 3... 2... 1...',
      'Comando bloqueado! Você precisa da chave mestra dos admins pra passar por aqui!',
      'Parece que alguém esqueceu que não está na lista de convidados especiais! Admins only!',
      'Acesso negado com todo respeito! Volte quando tiver o crachá de administrador!',
      'Essa funcionalidade é como festa de adulto - precisa ter credencial pra entrar!',
      'Sasha gostaria de ajudar, mas até eu preciso de permissão dos admins pra isso!',
      'Você não tem permissão para entrar, mas os admins podem te ajudar com isso!',
      'Área restrita, amigo! Você precisa ser admin para entrar aqui!',
      'Os admins possuem a chave, e eu estou sem ela. Aguarde por eles!',
      'Essa área é exclusividade de admins. Fique tranquilo, logo chega a permissão!',
      'Sasha detectou tentativa de invasão! Só admins podem acessar essa área!',
      'Comando recusado! Área restrita aos escolhidos (admins)!',
      'Para acessar isso, só se você for admin, amigo!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  grupo: () => {
    const responses = [
      'Sasha até pulou de alegria... até ver que isso só funciona em grupo! Vamos pra um?',
      'Esse comando é como abraço - funciona melhor com várias pessoas! Cria um grupo!',
      'Parece que alguém tá tentando dança de salão sozinho! Isso aqui é pra grupo!',
      'Sasha adoraria, mas no privado é como conversar no elevador - limitadíssimo!',
      'Esse recurso é como churrasco - só faz sentido com bastante gente! Chama o grupo!',
      'Detectei solidão digital! Esse comando precisa de um grupinho pra funcionar!',
      'No privado até rola um papo, mas pra isso aqui precisamos de um grupalhão!',
      'Se for pra esse comando rolar, tem que ser no grupo, porque aqui é mais divertido!',
      'Esse comando foi feito especialmente para grupos! Chama a galera!',
      'Parece que você está sozinho... mas esse comando é pra um grande grupo de pessoas!',
      'Esse comando não funciona sozinho, mas se você chamar a galera, tudo fica possível!',
      'Ei, isso é um comando social, chama os amigos e tenta de novo!',
      'Vamos colocar esse comando para funcionar com a ajuda do grupo!',
      'Esse comando foi feito para as grandes interações! Bora chamar mais gente!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
};