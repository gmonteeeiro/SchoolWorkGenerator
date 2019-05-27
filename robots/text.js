const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;

async function robot(schoolworkContent){
    schoolworkContent.source = [];
    schoolworkContent.source.contentOriginal = await fetchWikipediaContent(schoolworkContent.info.searchTerm);
    // sanitizeContent();
    // breakContentIntoSentences();
}

async function fetchWikipediaContent(searchTerm){
    let wikipediaInput = {
        "articleName": searchTerm,
        "lang": "pt"
    };

    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorith = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
    const WikipediaResponse = await wikipediaAlgorith.pipe(wikipediaInput);
    
    return WikipediaResponse.get();
}

module.exports = robot;