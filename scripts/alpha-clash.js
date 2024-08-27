function play1(){
    hideOneShowOther('home' ,'play');
    genRandomAlpha();
}

function play2(){
    hideOneShowOther('score' ,'play');
    genRandomAlpha();
}


function hideOneShowOther(toBeHidden, toBeShown){
    document.getElementById(toBeHidden).classList.add('hidden');
    document.getElementById(toBeShown).classList.remove('hidden');
}

function genRandomAlpha (){
    const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    let random = Math.round(Math.random()*25);
    
    document.getElementById('current-alpha').innerText = alphabets[random];
    highlightKey(alphabets[random]);


}

function highlightKey(id){
    element = document.getElementById(id);
    element.classList.remove('bg-white');
    element.classList.add('bg-[#ffa500]');
}