const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;

async function robot(schoolworkContent){
    await fetchWikipediaContent(schoolworkContent);
    sanitizeContentInLines(schoolworkContent);
    breakContentInSubjets(schoolworkContent);
    // breakContentIntoSentences(schoolworkContent);

    console.log(schoolworkContent.source.subjects);
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

function sanitizeContentInLines(schoolworkContent){
    schoolworkContent.source.contentLinesSanitizeds = removeBlankLines(schoolworkContent.source.contentOriginal);

    function removeBlankLines(text){
        const allLines = text.split('\n');
        
        const withoutBlankLines = allLines.filter((line) =>{
            if(line.trim().length === 0 || line.startsWith('===')){
                return false;
            }
            return true;
        });

        return withoutBlankLines;
    }
}

function breakContentInSubjets(schoolworkContent){
    schoolworkContent.source.subjects = [];

    let previewContent = true;
    let atualContent = '';

    let indexSubject = -1;
    schoolworkContent.source.contentLinesSanitizeds.forEach((item, index) => {
        if(item.startsWith('=')){
            if(previewContent){
                schoolworkContent.source.preview = atualContent;

                previewContent = false;
            }
            else{
                schoolworkContent.source.subjects[indexSubject].contentOriginal = atualContent;
            }

            indexSubject++;
            schoolworkContent.source.subjects.push({
                title: item.substring(3, item.length - 3)
            });

            atualContent = '';
        }
        else{
            atualContent += `${item} `;
        }
    });
}

module.exports = robot;