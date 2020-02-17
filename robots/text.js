const algoritmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const sentenceBoundaryDetection = require('sbd')

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