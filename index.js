const robots = {
    userInputs: require('./robots/userInputs.js'),
    text: require('./robots/text.js')
}

function start(){
    const schoolworkContent = {};
    
    robots.userInputs(schoolworkContent);
    robots.text(schoolworkContent);
    
    console.log(schoolworkContent);
}

start();