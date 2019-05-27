const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;

function robot(schoolworkContent){
    fetchWikipediaContent();
    // sanitizeContent();
    // breakContentIntoSentences();

    async function fetchWikipediaContent(){
        let wikipediaInput = {
            "articleName": schoolworkContent.info.searchTerm,
            "lang": "pt"
          };

        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
        const wikipediaAlgorith = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
        const WikipediaResponse = await wikipediaAlgorith.pipe(wikipediaInput);
        const WikipediaContent = WikipediaResponse.get();
        console.log(WikipediaContent)
    }
}

module.exports = robot;