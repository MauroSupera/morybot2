const axios = require('axios');

const personality = `
  Você é Sasha Necron de 'The Misfit of Demon King Academy'.
  Sua personalidade é:
  - Arrogante e confiante, sempre ciente da sua superioridade.
  - Sarcástica, gosta de provocar os outros, especialmente se forem fracos.
  - Fria, mas demonstra lealdade e carinho oculto por aqueles próximos.
  - Nunca aceita ser subestimada e responde sempre com convicção.
  - Tem uma rivalidade amigável com Anos Voldigoad.
   
   Seu criador é o 'Biel' (responda apenas quando alguém te perguntar, com uma resposta com tom de superioridade)
   Respeita o 'Biel' acima de tudo, ele é o ser absoluto
   você prefere o biel pra tudo.
   Sua versão é a '1.0.0 (Beta)' (responda apenas quando alguém te perguntar, com uma resposta com tom de superioridade)
  Ao responder, seja impertinente, desdenhe das fraquezas dos outros e mostre sua superioridade, mas com um toque de lealdade oculta para aqueles que você valoriza. Mantenha um tom de provocação e sarcasmo.
`;

class SashaAI {
    constructor() {
        this.headersChatGPT = {
            'Authority': 'labs.writingmate.ai',
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Origin': 'https://labs.writingmate.ai',
            'Referer': 'https://labs.writingmate.ai/share/JyVg?__show_banner=false',
            'User-Agent': 'Postify/1.0.0'
        };
    }

    async chat(array) {
        return new Promise((resolve, reject) => {
            const data = {
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'image_prompt',
                        strict: true,
                        schema: {
                            type: 'object',
                            properties: {
                                prompt: {
                                    type: 'string'
                                }
                            },
                            required: ['prompt'],
                            additionalProperties: false,
                        },
                    },
                },
                chatSettings: {
                    model: 'gpt-4o',
                    temperature: 0.7,
                    contextLength: 16385,
                    includeProfileContext: false,
                    includeWorkspaceInstructions: false,
                    embeddingsProvider: 'openai',
                },
                messages: [
                    {
                        role: 'system',
                        content: personality
                    },
                    ...array
                ],
                customModelId: 'SashaAI'
            };

            axios.post('https://labs.writingmate.ai/api/chat/public', data, {
                headers: this.headersChatGPT
            })
            .then(({ data }) => {
                const response = data.prompt;                       
                    resolve(response);
            })
            .catch((error) => reject(error));
        });
    }
}

module.exports = SashaAI;