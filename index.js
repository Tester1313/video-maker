const readline = require('readline-sync')
const robots = {
    text: require('./robots/text.js')
}

async function start() {
    const content = {}

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    await robots.text(content);

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        //Pega o index do array selecionado pelo usuario
        const seletedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        const selectedPrefixText = prefixes[seletedPrefixIndex]

        return selectedPrefixText;
    }

    console.log(content)
}

start()