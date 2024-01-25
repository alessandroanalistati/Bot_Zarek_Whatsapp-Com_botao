const makeWaSocket = require('@adiwajshing/baileys').default
const { DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, delay } = require('@adiwajshing/baileys')
const P = require('pino')
const { unlink } = require('fs')
const express = require('express')
const http = require('http')
const port = process.env.PORT || 8001
const app = express()
const server = http.createServer(app)
const fs = require('fs')
app.use(express.json())
app.use(express.urlencoded({
   extended: true
}))


// Iniciando
const buttons1 = [
   { buttonId: 'A1', buttonText: { displayText: '▶️ Introdução a Conjuntos Númericos \n👉  https://rebrand.ly/Introduçãoa-Conjuntos-Númericos \n \n *Conjuntos numéricos no dia a dia* \n\n 👉  https://rebrand.ly/Conjuntos-numéricos-dia-a-dia \n\n👉  https://rebrand.ly/Números-Naturais-inteiros' }, type: 1 },
   { buttonId: 'A2', buttonText: { displayText: '▶️ Operações com Conjuntos Númericos \n👉  https://rebrand.ly/Operações-Conjunto  \n\n👉https://rebrand.ly/Operações-com-Conjuntos' }, type: 1 },
   { buttonId: 'A3', buttonText: { displayText: '📝 Revisões & Exercícios' }, type: 1 },
]
// Aprofudamento
const buttons2 = [
   { buttonId: 'B1', buttonText: { displayText: '▶️ Números Racionais \n👉  https://rebrand.ly/Números-Racionais' }, type: 1 },
   { buttonId: 'B2', buttonText: { displayText: '▶️ Números Irracionais e Reais \n👉  https://rebrand.ly/Números-Irracionais-Reais' }, type: 1 },
   { buttonId: 'B3', buttonText: { displayText: '📝 Intervalos/Reais/Operações/Propriedades \n👉LINK https://rebrand.ly/Intervalos-Reais-Operações' }, type: 1 },

]

// Apostilas
const buttons3 = [
   { buttonId: 'C1', buttonText: { displayText: '📝 Apostila Completa *Comentada*\n 👉 https://rebrand.ly/apostila-comentada' }, type: 1 },
   { buttonId: 'C2', buttonText: { displayText: '📝 Apostila Completa *UFPA*\n 👉 https://rebrand.ly/apostilas-teorica' }, type: 1 },
   { buttonId: 'C3', buttonText: { displayText: '📝 Questões Comentadas \n 👉 https://rebrand.ly/questoes-comentadas-conj' }, type: 1 },

]

// Resumos e  mapas mentais
const buttons4 = [
   { buttonId: 'D1', buttonText: { displayText: '📝 Resumo \n 👉 https://rebrand.ly/resumo-conj-num ' }, type: 1 },  
   { buttonId: 'D2', buttonText: { displayText: '📝 Mapas Mentais \n 👉 https://rebrand.ly/mapas-mentais' }, type: 1 },
   { buttonId: 'D3', buttonText: { displayText: '📝 Formulário Interativo \n 👉 https://rebrand.ly/form-conj-num' }, type: 1 },

]

const ZAREKGroupCheck = (jid) => {
   const regexp = new RegExp(/^\d{18}@g.us$/)
   return regexp.test(jid)
}

const ZAREKUpdate = (ZAREKsock) => {
   ZAREKsock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) {
         console.log('© BOT-ZAREK - Qrcode: ', qr);
      };
      if (connection === 'close') {
         const ZAREKReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
         if (ZAREKReconnect) ZAREKConnection()
         console.log(`© BOT-ZAREK - CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
         if (ZAREKReconnect === false) {
            fs.rmSync('zdg', { recursive: true, force: true });
            const removeAuth = 'zdg'
            unlink(removeAuth, err => {
               if (err) throw err
            })
         }
      }
      if (connection === 'open') {
         console.log('© BOT-ZAREK -CONECTADO')
      }
   })
}

const ZAREKConnection = async () => {
   const { version } = await fetchLatestBaileysVersion()
   const { state, saveCreds } = await useMultiFileAuthState('zdg')

   const config = {
      auth: state,
      logger: P({ level: 'error' }),
      printQRInTerminal: true,
      version,
      connectTimeoutMs: 60_000,
      async getMessage(key) {
         return { conversation: 'botzg' };
      },
   }
   const ZAREKsock = makeWaSocket(config, { auth: state });
   ZAREKUpdate(ZAREKsock.ev);
   ZAREKsock.ev.on('creds.update', saveCreds);

   const ZAREKSendMessage = async (jid, msg) => {
      await ZAREKsock.presenceSubscribe(jid)
      await delay(2000)
      await ZAREKsock.sendPresenceUpdate('composing', jid)
      await delay(1500)
      await ZAREKsock.sendPresenceUpdate('paused', jid)
      return await ZAREKsock.sendMessage(jid, msg)
   }


   function isBlank(str) {
      return (!str || /^\s*$/.test(str));
   }

   ZAREKsock.ev.on('messages.upsert', async ({ messages, type }) => {

      const msg = messages[0]
      const ZAREKUsuario = msg.pushName
      const jid = msg.key.remoteJid
      const conversation = msg.message.conversation
      const listRespone = msg.message.listResponseMessage
      const buttonResponse = msg.message.templateButtonReplyMessage
      console.log(msg)

      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZAREKGroupCheck(jid)) {

         console.log("© BOT-ZAREK - MENSAGEM : ", msg)

         try {
            //ZAREKsock.sendReadReceipt(jid, msg.key.participant, [msg.key.id])
            ZAREKsock.readMessages(jid, msg.key.participant, [msg.key.id])
         }
         catch (e) {
            console.log('© BOT-ZAREK - Não foi possível enviar o ReadReceipt')
         }

         // OPÇÃO 1 INICIANDO' '------------------------------  XXXX --------------------------------------- 

         if (isBlank(conversation) && isBlank(buttonResponse)) {           
            if (msg.message.listResponseMessage.title === '1️⃣- INICIANDO') {
               const buttonsMessage = {
                  text: '🚦',
                  footer: 'Estou aqui para compartilhar com você alguns materiais incríveis que vão te ajudar a melhorar seu desempenho na disciplina. Sabemos que muitas vezes pode ser difícil encontrar recursos de qualidade para estudar e se preparar para as provas, mas com esses materiais, você terá tudo o que precisa para se destacar. \n\n *Bons Estudos*😉',
                  buttons: buttons1,
                  headerType: 1
               }
               ZAREKSendMessage(jid, buttonsMessage)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }

         }
          
         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'A1') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })

                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'A2') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'A3') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }
          
 // OPÇÃO '2️⃣- APOSTILAS 📝'''------------------------------  XXXX ---------------------------------------  

         if (isBlank(conversation) && isBlank(buttonResponse)) {
            if (msg.message.listResponseMessage.title === '2️⃣- APOSTILAS 📝') {
               const buttonsMessage = {
                  text: '🚦',
                  footer: 'Estudar pelo PDF pode trazer uma série de benefícios aos alunos que buscam aprender de forma mais eficiente e prática. Em primeiro lugar, o PDF é um formato bastante flexível e acessível, podendo ser aberto em diversos dispositivos, como smartphones, tablets e computadores. Além disso, é possível encontrar uma variedade imensa de materiais em PDF na internet, muitos deles gratuitos, o que amplia as opções de estudo para os alunos. Outro ponto importante é que o PDF permite uma leitura mais dinâmica e interativa, permitindo que o aluno faça anotações, destaque trechos importantes e até mesmo faça pesquisas relacionadas ao conteúdo. Por fim, o estudo pelo PDF pode ajudar o aluno a economizar tempo e dinheiro, já que ele não precisa se deslocar para a biblioteca ou comprar livros físicos, além de poder acessar o material a qualquer momento e em qualquer lugar. Portanto, estudar pelo PDF pode ser uma ótima opção para quem busca aprender de forma mais prática e eficiente.\n'+
                  '*Bons Estudos*😉',
                  buttons: buttons3,
                  headerType: 1
               }
               ZAREKSendMessage(jid, buttonsMessage)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }


         }
         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'C1') {
               ZAREKSendMessage(jid, { text: '😎 Olá, vamos a uma breve introdução a conjuntos numéricos.' })

                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'C2') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'C3') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }


         // OPÇÃO '3️⃣- APROFUNDADO NO ASSUNTO🔍'------------------------------  XXXX ---------------------------------------  

         if (isBlank(conversation) && isBlank(buttonResponse)) {
            if (msg.message.listResponseMessage.title === '3️⃣- APROFUNDADO NO ASSUNTO🔍') {
               const buttonsMessage = {
                  text: '🚦',
                  footer: 'Aprofundar-se em um assunto é fundamental para o desenvolvimento acadêmico e pessoal do aluno. Quando um estudante se dedica a aprender mais sobre um tema específico, ele adquire uma compreensão mais profunda e detalhada do assunto, o que o torna capaz de aplicar esse conhecimento em diversas áreas da vida. *Bons Estudos*😉',
                  buttons: buttons2,
                  headerType: 1
               }
               ZAREKSendMessage(jid, buttonsMessage)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }


         }
         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'B1') {
               ZAREKSendMessage(jid, { text: '😎 Olá TESTE, vamos a uma breve introdução a conjuntos numéricos.' })

                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'B2') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'B3') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

        


          // OPÇÃO '4️⃣- RESUMO / MAPAS MENTAIS 📉'------------------------------  XXXX --------------------------------------- 

          if (isBlank(conversation) && isBlank(buttonResponse)) {
            if (msg.message.listResponseMessage.title === '4️⃣- RESUMO / MAPAS MENTAIS 📉') {
               const buttonsMessage = {
                  text: '🚦',
                  footer: 'Estudar por *RESUMOS* e mapas mentais pode ser uma forma muito eficiente de aprender e reter informações. Essas técnicas são excelentes maneiras de organizar e sintetizar conteúdos complexos, tornando-os mais fáceis de compreender e memorizar. Por isso, é importante que os alunos aprendam e pratiquem essas habilidades.\n' +
                  'Os resumos são uma maneira de sintetizar e organizar as informações de um determinado texto, livro ou aula. Eles podem ser feitos em forma de tópicos, frases curtas, palavras-chave ou até mesmo em forma de esquemas. A grande vantagem dos resumos é que eles ajudam a fixar as informações mais importantes de um conteúdo, tornando a revisão muito mais eficiente.\n'+
                  'Já os *MAPAS MENTAIS* são uma forma de representar graficamente as informações e suas conexões, utilizando palavras-chave, imagens e símbolos. Eles permitem que o aluno visualize o conteúdo de forma clara e organizada, o que ajuda a identificar padrões e relações entre as informações. Além disso, os mapas mentais são úteis para estimular a criatividade e a associação de ideias.\n'+
                  'Em suma, estudar por *RESUMOS E MAPAS MENTAIS* pode ser uma forma muito eficiente de aprender e reter informações. Essas técnicas ajudam a organizar e sintetizar conteúdos complexos, desenvolvem habilidades de síntese e análise crítica, além de serem úteis para revisão e preparação para provas. Por isso, é importante que os alunos aprendam e pratiquem essas habilidades para se tornarem estudantes mais eficientes e bem-sucedidos.\n'+
                  '*Bons Estudos*😉',
                  buttons: buttons4,
                  headerType: 1
               }
               ZAREKSendMessage(jid, buttonsMessage)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }


         }
         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'D1') {
               ZAREKSendMessage(jid, { text: '😎 Olá, vamos a uma breve introdução a conjuntos numéricos.' })

                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'D2') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }

         try {
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'D3') {
               ZAREKSendMessage(jid, {
                  text: '' +
                     '\n' + '*xxxxxx*'
               })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         } catch (e) { }


         if (isBlank(listRespone) && isBlank(buttonResponse)) {
            const sections = [
               {
                  title: '🟩 CONJUNTOS NUMÉRIOS 🟩',
                  rows: [
                     { title: '1️⃣- INICIANDO', description: ' 😎  *Olá, ' + ZAREKUsuario +'\n   Você já se perguntou como pode aprender matemática de uma forma mais fácil e divertida? Sabemos que muitas pessoas têm dificuldade em lidar com os números e que muitas vezes a matemática pode parecer um verdadeiro bicho de sete cabeças. \n ' +
                     'Porém, estamos aqui para te ajudar! \n '+
                     'Queremos convidá-lo a assistir um vídeo incrível que vai te ensinar como aprender matemática de uma forma simples e eficaz. Neste vídeo, você vai aprender técnicas e estratégias para melhorar seu desempenho em matemática, além de dicas de como se preparar melhor para as provas. \n\n 👉 https://rebrand.ly/aprender-mat', rowId: 'A1' },
                     { title: '2️⃣- APOSTILAS 📝', description: '😁  *OI, ' + ZAREKUsuario +'\n  ', rowId: '' },
                     { title: '3️⃣- APROFUNDADO NO ASSUNTO🔍', description: '🤓  Vamos lá, ' + ZAREKUsuario +'\n   *Conjuntos numéricos* têm propriedades específicas, como ordem e operações aritméticas, que são utilizadas em cálculos matemáticos. Eles também são usados em várias áreas da matemática, como geometria, álgebra e análise. Por exemplo, os números reais são usados para descrever quantidades físicas como distância, tempo e velocidade, enquanto os números complexos são usados para representar fenômenos ondulatórios como ondas sonoras e eletromagnéticas.\n 👉LINK https://rebrand.ly/Números-Naturais-eInteiros', rowId: 'B1' },                     
                     { title: '4️⃣- RESUMO / MAPAS MENTAIS 📉', description: '😎  ' + ZAREKUsuario +' Estudar com resumos e mapas mentais é uma estratégia altamente eficaz para consolidar o conhecimento e garantir o sucesso nas avaliações. \n ', rowId: '' },
                  ],
               },
        //       {
        //          title: '💎✔️☑️🔘🔴🟠🟡🟢🔵🟣⚫⚪🟤    🟥🟧🟨🟩🟦🟪⬛⬜🟫',
        //          rows: [
        //             { title: '1', description: ' ', rowId: '' },
        //             { title: '2', description: '', rowId: '' },
        //             { title: '3', description: '', rowId: '' },
        //             { title: '4', description: '', rowId: '' },
        //          ],
        //       },
               {
                  title: '🟥 OUTROS ASSUNTOS 🟥',
                  rows: [
                     { title: '9️⃣ - /botzarek', description: '\n 😉 Ok, ' + ZAREKUsuario +'\n para falar comigo sobre qualquer assunto, é necessário digitar \n */botzarek* antes do seu texto para que eu possa processar e responder adequadamente. Para ilustrar, vou dar um exemplo: \n\n */botzarek Pode me explicar para que servem os conjuntos numéricos?* \n\n Depois é só aguardar a minha resposta ok. \n 😊Sinta-se à vontade para fazer perguntas ou pedir ajuda em qualquer coisa que precisar!🤜🤛 \n ', rowId: 'A1' },
                  ],
               },
            ]
            const sendList = {
               title: '😉 Óla ' + ZAREKUsuario + ', seja bem vindo!, \n',
               text: 'Olá, eu sou *ZAREK*, um agente de chat virtual e estarei aqui para auxiliá-lo na disciplina de Estudos de Funções Reais!\n',
               buttonText: '👉 *Clique aqui - MENU*',
               footer: '🟢 *IFBA - CAMPUS EUNÁPOLIS*',
               sections: sections
            }

            ZAREKSendMessage(jid, sendList)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }

      }


   })

}

ZAREKConnection()

server.listen(port, function () {
   console.log('© BOT-ZAREK - Servidor rodando na porta: ' + port);
});