const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;

async function robot(schoolworkContent){
    await fetchWikipediaContent(schoolworkContent);
    // sanitizeContent();
    // breakContentIntoSentences();
}

async function fetchWikipediaContent(schoolworkContent){
    let wikipediaInput = {
        "articleName": schoolworkContent.info.searchTerm,
        "lang": "pt"
    };

    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorith = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
    const wikipediaResponse = await wikipediaAlgorith.pipe(wikipediaInput);
    const wikipediaContent = wikipediaResponse.get();
    
    schoolworkContent.source = [];
    schoolworkContent.source.contentOriginal = wikipediaContent.content;
    schoolworkContent.source.wikipediaSummary = wikipediaContent.summary;

    schoolworkContent.source.references = wikipediaContent.references;
    schoolworkContent.source.references.push(wikipediaContent.url);
}

module.exports = robot;