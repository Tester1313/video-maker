const algoritmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;

function robot(content) {
    fetchContentFromWikipedia(content) //baixa conteudo wikipidia
    //sanitizeCotente(content) //limpar conteudo
    //breakContentIntoSentences(content) //quebra conteudo

    async function fetchContentFromWikipedia(content) {
        const algoritmiaAuthenticated = algoritmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algoritmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()
        console.log(wikipediaContent)
    }
}

module.exports = robot