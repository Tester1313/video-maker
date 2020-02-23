const fs = require('fs');
const algoritmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const watsonApiKey = require('../credentials/watson.json').apikey;
const sentenceBoundaryDetection = require('sbd')

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
 
const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});
 
/*nlu.analyze(
  {
    text: `Hi I'm Mickael Jackson and I like doing the moonwalker dance move`,
    features: {
      keywords: {}
    }
  })
  .then(response => {
    console.log(JSON.stringify(response.result, null, 2));
    process.exit(0)
  })
  .catch(err => {
    console.log('error: ', err);
    process.exit(0)
  }
  );*/

async function robot(content) {
    await fetchContentFromWikipedia(content) //baixa conteudo wikipidia
    sanitizeContent(content) //limpar conteudo
    breakContentIntoSentences(content) //quebra conteudo

    async function fetchContentFromWikipedia(content) {
        const algoritmiaAuthenticated = algoritmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algoritmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()
        
        content.sourceContentOriginal = wikipediaContent.content;
    }

    function sanitizeContent(content) {
        const withoutBlakeLinesAndMarkDown = removeBlakeLinesAndMarkDown(content.sourceContentOriginal);        
        const withoutDatesInParentheses  = removeDatesInParentheses(withoutBlakeLinesAndMarkDown);

        content.sourceContentSanitized = withoutDatesInParentheses;

        function removeBlakeLinesAndMarkDown(text) {
            const allLines = text.split("\n")

            const withoutBlakeLinesAndMarkDown = allLines.filter((line) => {
                if(line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }

                return true
            })

            return withoutBlakeLinesAndMarkDown

        }
        
    }

    function removeDatesInParentheses(text) {
        try {
            return text.toString().replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        } catch (error){
            console.log('ERRO', error)
        }
    }

    function breakContentIntoSentences(content) {
        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords:  [],
                images: []
            })
        })
    }

    
}

module.exports = robot