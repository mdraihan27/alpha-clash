let gameRunning = false, killGame = false, keyPressed = true;
let intervalId1, pressedKey = 'no-key' , right = true, wrongAlpha , lastAlpha, runCount = 0, lifeCount = document.getElementById('life-count'), scoreCount = document.getElementById('score-count'), lastKeyBeforeGameOver, currentAlpha = 'no-key', unIdKeyPressed = false;

let lifeBtn = document.getElementById('life-btn');
let scoreBtn = document.getElementById('score-btn');

function play1(){

    gameRunning = true;
    hideOneShowOther('home' ,'play');
    genRandomAlpha();
    intervalId1 = setInterval(genRandomAlpha, 1500);

}

function play2(){

    gameRunning = true;
    hideOneShowOther('score' ,'play');
    resetGame();
    genRandomAlpha();
    intervalId1 = setInterval(genRandomAlpha, 1500);

}


function hideOneShowOther(toBeHidden, toBeShown){

    document.getElementById(toBeHidden).classList.add('hidden');
    document.getElementById(toBeShown).classList.remove('hidden');

}


const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function genRandomAlpha (){

    gameOverCheck();

    if(keyPressed == false ){

        wrongKeyPressed(currentAlpha);
        decreaseLife();
        keyPressed = true;
        
        return;

    }

    keyColorReset();

    keyPressed = false;
    runCount++;

    let random = Math.round(Math.random()*25);
    
    document.getElementById('current-alpha').innerText = alphabets[random];
    highlightKey(alphabets[random]);
    currentAlpha = alphabets[random];


}

function gameOverCheck(){

    if(parseInt(lifeCount.innerText) <= 0){
        
        hideOneShowOther('play' , 'score')
        document.getElementById('final-page-score').innerText = scoreCount.innerText;
        keyColorReset();

        gameRunning = false;
        clearInterval(intervalId1);

    }

}

function highlightKey(id){

    element = document.getElementById(id);
    element.classList.remove('bg-white');
    element.classList.add('bg-[#ffa500]');

}

document.addEventListener('keyup' , function handleKeyPress(event){

    if(parseInt(lifeCount.innerText) > 0 && gameRunning == true && keyPressed == false){
        
        pressedKey = event.key
        pressedKey = pressedKey.toUpperCase();
        console.log(pressedKey)

        keyPressed = true;

        if(pressedKey == document.getElementById('current-alpha').innerText){
            
            correctKeyPressed(pressedKey);
            right = true;
            increaseScore();
            
            
        }else{

            wrongAlpha = pressedKey;
            right = false;
            decreaseLife();

            if(alphabets.includes(pressedKey)){
                wrongKeyPressed(pressedKey);
            }else{
                wrongKeyPressed(currentAlpha);
            }

        }
    }else if(gameRunning == false){

        if(event.key == 'Enter' && runCount == 0){
            play1();
        }else if(event.key == 'Enter' && runCount > 0){
            play2();
        }
    }
    
})



function correctKeyPressed(id){
    
        element = document.getElementById(id);
        element.classList.remove('bg-[#ffa500]');
        element.classList.add('bg-green-500');

        scoreBtn.classList.add('bg-green-500')

}

function wrongKeyPressed(id){

        element = document.getElementById(id);
        element.classList.remove('bg-white');
        element.classList.add('bg-red-600');

        lifeBtn.classList.add('bg-red-600')

        

}

function increaseScore(){

    let num = parseInt(scoreCount.innerText);
    num++;
    scoreCount.innerText = num;

}

function decreaseLife(){

    let num = parseInt(lifeCount.innerText);
    num--;
    lifeCount.innerText = num;


}

function resetGame(){

    scoreCount.innerText = 0;
    lifeCount.innerText = 5;
    runCount = 0;
    keyPressed = true;

    keyColorReset();

}

function keyColorReset(){

    lifeBtn.classList.remove('bg-red-600');
    scoreBtn.classList.remove('bg-green-500');

    for(let alphabet of alphabets){
        element = document.getElementById(alphabet)
        if(element.classList.contains('bg-[#ffa500]') || element.classList.contains('bg-red-600') || element.classList.contains('bg-green-500')){
            element.classList.remove('bg-[#ffa500]')
            element.classList.remove('bg-red-600')
            element.classList.remove('bg-green-500')

            element.classList.add('bg-white')
        }
    }

}
