const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const sentenceBoundaryDetection = require('sbd');

const watsonApiKey = require('../credentials/watson-nlu.json').apikey;
const watsonApiUrl = require('../credentials/watson-nlu.json').url;

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: watsonApiUrl
});

async function robot(schoolworkContent){
    await fetchWikipediaContent(schoolworkContent);
    sanitizeContentInLines(schoolworkContent);
    breakContentInSubjets(schoolworkContent);
    breakContentIntoSentences(schoolworkContent);

    await getSentencesKeywords(schoolworkContent);



    console.log(schoolworkContent.source.subjects);
}

async function fetchWikipediaContent(schoolworkContent){
    let wikipediaInput = {
        "articleName": schoolworkContent.info.searchTerm,
        "lang": "en"
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

function breakContentIntoSentences(schoolworkContent){
    schoolworkContent.source.subjects.forEach((item, index) => {
        const sentences = sentenceBoundaryDetection.sentences(item.contentOriginal);

        schoolworkContent.source.subjects[index].sentences = [];

        sentences.forEach((sentence) => {
            schoolworkContent.source.subjects[index].sentences.push({
                text: sentence,
                keywords: [],
                images: []
            });
        });
    });
}

async function watsonKeywords(sentence){
    return new Promise((resolve, reject) => {
        nlu.analyze({
            text: sentence,
            features: {
                keywords: {}
            }
        }, (error, response) => {
            if (error) {
                // reject(error);
                return;
            }

            const keywords = response.keywords.map(keyword => {
                return keyword.text
            });
  
            resolve(keywords);
        });
    });
}

async function getSentencesKeywords(schoolworkContent){
    schoolworkContent.source.subjects.forEach(async(subjectItem, subjectIndex) => {
        subjectItem.sentences.forEach(async(sentenceItem, sentenceIndex) => {
            schoolworkContent.source.subjects[subjectIndex].sentences[sentenceIndex].keywords = await watsonKeywords(sentenceItem.text);
        });
    });
}

module.exports = robot;