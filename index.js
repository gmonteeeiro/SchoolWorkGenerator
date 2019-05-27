const robots = {
    userInputs: require('./robots/userInputs.js'),
    text: require('./robots/text.js')
}

async function start(){
    const schoolworkContent = {};
    
    robots.userInputs(schoolworkContent);
    await robots.text(schoolworkContent);
    
    //console.log(schoolworkContent);
}

start();