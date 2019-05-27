const readline = require('readline-sync');

function robot(schoolworkContent){
    schoolworkContent.searchTerm = askSearchTerm();
}

function askSearchTerm(){
    return readline.question('Termo de pesquisa para o trabalho: ');
}

module.exports = robot;