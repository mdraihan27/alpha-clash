function play1(){

    hideOneShowOther('home' ,'play');
    genRandomAlpha();
    // setInterval(genRandomAlpha, 1000);

}

function play2(){

    hideOneShowOther('score' ,'play');
    genRandomAlpha();

}


function hideOneShowOther(toBeHidden, toBeShown){

    document.getElementById(toBeHidden).classList.add('hidden');
    document.getElementById(toBeShown).classList.remove('hidden');

}

let right = true, wrongAlpha , lastAlpha, runCount = 0, lifeCount = document.getElementById('life-count'), scoreCount = document.getElementById('score-count');

function genRandomAlpha (){

    const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

   if(runCount > 0){
        if(!right){
            unHighlightLastKey(lastAlpha);
            unHighlightRedKey(wrongAlpha);
        }
   }
   runCount++;

    let random = Math.round(Math.random()*25);
    
    document.getElementById('current-alpha').innerText = alphabets[random];
    highlightKey(alphabets[random]);


}

function highlightKey(id){

    element = document.getElementById(id);
    element.classList.remove('bg-white');
    element.classList.add('bg-[#ffa500]');

}

document.addEventListener('keyup' , function handleKeyPress(event){

    let pressedKey = event.key
    pressedKey = pressedKey.toUpperCase();
    console.log(pressedKey)
    if(pressedKey == document.getElementById('current-alpha').innerText){

        correctKeyPressed(pressedKey);
        right = true;
        lastAlpha = document.getElementById('current-alpha').innerText;
        increaseScore();

    }else{

        right = false;
        wrongAlpha = pressedKey;
        lastAlpha = document.getElementById('current-alpha').innerText;
        wrongKeyPressed(pressedKey);
        decreaseLife();

    }
})

function correctKeyPressed(id){

    element = document.getElementById(id);
    element.classList.remove('bg-[#ffa500]');
    element.classList.add('bg-white');
    genRandomAlpha();

}

function wrongKeyPressed(id){

    element = document.getElementById(id);
    element.classList.remove('bg-white');
    element.classList.add('bg-red-700');
    genRandomAlpha();

}

function unHighlightGreenKey(id){

    element = document.getElementById(id);
    element.classList.remove('bg-green-500');
    element.classList.add('bg-white');

}

function unHighlightRedKey(id){

    element = document.getElementById(id);
    element.classList.remove('bg-red-700');
    element.classList.add('bg-white');

}

function unHighlightLastKey(id){

    element = document.getElementById(id);
    element.classList.remove('bg-[#ffa500]');
    element.classList.add('bg-white');

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
