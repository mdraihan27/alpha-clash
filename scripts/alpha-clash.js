let gameRunning = false;
let intervalId1, pressedKey = 'no-key' , right = true, wrongAlpha , lastAlpha, runCount = 0, lifeCount = document.getElementById('life-count'), scoreCount = document.getElementById('score-count'), lastKeyBeforeGameOver, currentAlpha = 'no-key';

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



//    if(runCount > 0 && pressedKey != 'no-key' && currentAlpha != 'no-key'){

        keyColorReset();

        // if(right){

        //     unHighlightGreenKey(pressedKey);

        // }else{

        //     unHighlightRedKey(pressedKey);
        //     unHighlightLastKey(currentAlpha);

        // }
        // unHighlightRedKey(wrongAlpha);
//    }else if (runCount > 0){

//         unHighlightLastKey(currentAlpha);

//    }
   runCount++;

    let random = Math.round(Math.random()*25);
    
    document.getElementById('current-alpha').innerText = alphabets[random];
    highlightKey(alphabets[random]);
    currentAlpha = alphabets[random];


}

function highlightKey(id){

    element = document.getElementById(id);
    element.classList.remove('bg-white');
    element.classList.add('bg-[#ffa500]');

}

document.addEventListener('keyup' , function handleKeyPress(event){

    if(parseInt(lifeCount.innerText) > 0 && gameRunning == true ){
        
        pressedKey = event.key
        pressedKey = pressedKey.toUpperCase();
        console.log(pressedKey)

        if(pressedKey == document.getElementById('current-alpha').innerText){
            
            correctKeyPressed(pressedKey);
            right = true;
            // lastAlpha = document.getElementById('current-alpha').innerText;
            increaseScore();
            
        }else{

            wrongAlpha = pressedKey;
            right = false;
            decreaseLife();
            wrongKeyPressed(pressedKey);
            // lastAlpha = document.getElementById('current-alpha').innerText;

        }

        // console.log(lastAlpha)
    }
    
})

function correctKeyPressed(id){
    
    element = document.getElementById(id);
    element.classList.remove('bg-[#ffa500]');
    element.classList.add('bg-green-500');
    // genRandomAlpha();
    
}

function wrongKeyPressed(id){
    
    element = document.getElementById(id);
    element.classList.remove('bg-white');
    element.classList.add('bg-red-600');

    if(parseInt(lifeCount.innerText) <= 0){

        clearInterval(intervalId1);
        gameRunning = false;

    }

}

// function unHighlightGreenKey(id){

//     element = document.getElementById(id);
//     element.classList.remove('bg-green-500');
//     element.classList.add('bg-white');

// }

// function unHighlightRedKey(id){

//     element = document.getElementById(id);
//     element.classList.remove('bg-red-600');
//     element.classList.add('bg-white');

// }

// function unHighlightLastKey(id){

//     element = document.getElementById(id);
//     element.classList.remove('bg-[#ffa500]');
//     element.classList.add('bg-white');

// }

function increaseScore(){

    let num = parseInt(scoreCount.innerText);
    num++;
    scoreCount.innerText = num;

}

function decreaseLife(){

    let num = parseInt(lifeCount.innerText);
    num--;
    lifeCount.innerText = num;

    if(num == 0){
        
        hideOneShowOther('play' , 'score')
        document.getElementById('final-page-score').innerText = scoreCount.innerText;

    }

}

function resetGame(){

    scoreCount.innerText = 0;
    lifeCount.innerText = 3;
    runCount = 0;

    //  unHighlightLastKey(currentAlpha);
    //  unHighlightRedKey(pressedKey)

    keyColorReset();

}

function keyColorReset(){
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
