const readline = require('readline-sync');

function robot(schoolworkContent){
    schoolworkContent.info = [];
    schoolworkContent.info.searchTerm = askUserAnswer('Título do trabalho');
    schoolworkContent.info.deliveryDate = askUserAnswer('Data de entrega');
    
    schoolworkContent.info.school = [];
    schoolworkContent.info.school.name = askUserAnswer('Nome da escola');
    schoolworkContent.info.school.teacher = askUserAnswer('Nome do professor');
    schoolworkContent.info.school.class = askUserAnswer('Turma');
}

function askUserAnswer(ask){
    return readline.question(`${ask}: `);
}

module.exports = robot;