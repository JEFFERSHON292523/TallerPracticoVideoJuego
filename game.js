const canvas = document.querySelector('#game')
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const spanLives = document.querySelector('#lives')
const spanTiempo = document.querySelector('#time')
const spanRecord = document.querySelector('#Record')
const pResult = document.querySelector('#Result')

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timePLayer;
let timeStart;
let timeInterval;


const positionPlayer = {
    x : undefined,
    y : undefined,
}

const positionGift = {
    x : undefined,
    y : undefined,
}

let positionEnemy = []

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function fixNumber(n){
    return Number(n.toFixed(2))
}

function setCanvasSize(){
 
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7   
    }else{
        canvasSize = window.innerHeight * 0.7
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize )
    canvas.setAttribute('height', canvasSize )
    elementSize = canvasSize /10;
    positionPlayer.x=undefined;
    positionPlayer.y=undefined;
    startGame();

}

function startGame(){

    console.log(canvasSize,elementSize);
    console.log(window.innerHeight,window.innerHeight);
    
    game.font = elementSize + 'px Verdana';
    game.textAlign = 'end' ;

    const map = maps[level];

    if(!map){
       gameWin();
       return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTiempo,100);
        showRecord();
    }

    const mapRows= map.trim().split('\n');
    const mapRowsCol = mapRows.map(row => row.trim().split(''))

    showLives();

    positionEnemy = []
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowsCol.forEach((row , rowI) => {
        row.forEach((col , colI) => {
            const emoji = emojis[col]
            const posX=elementSize*(colI+1);
            const posY=elementSize*(rowI+1);

                if(col == 'O'){
                    if(!positionPlayer.x && !positionPlayer.y){
                        positionPlayer.x = posX
                        positionPlayer.y = posY
                    }
                }else if(col == 'I'){
                    positionGift.x = posX
                    positionGift.y = posY
                }else if(col == 'X'){
                    positionEnemy.push({
                        x : posX,
                        y : posY,
                    })
                }
            game.fillText(emoji,posX,posY);
        });
    });
            movePlayer()
   // for (let row = 1 ; row <= 10; row++){
     //for (let col= 1; col<=10; col++) {
       // game.fillText(emojis[mapRowsCol[row-1][col-1]],elementSize*col,elementSize*row);
     //}
    //}
}

function levelWin(){
    console.log('subiste de nivel');
    level++;
    startGame();
}

function levelFail(){
    console.log('chocaste con una bombita ' + lives);
    lives --;
    if(lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined }
    positionPlayer.x = undefined;
    positionPlayer.y = undefined;
    startGame();

}

function gameWin(){
    clearInterval(timeInterval)
    console.log('terminaste el juego');
    
    const recordTime = localStorage.getItem('Record_Time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){
        if(playerTime < recordTime){
            localStorage.setItem('Record_Time',playerTime)
            pResult.innerHTML = ('NUEVO RECORD');
        }else{pResult.innerHTML = ('SIGUE INTENTANDO');}
    }else{
        localStorage.setItem('Record_Time',playerTime)
        pResult.innerHTML = ('PRIMERA VEZ JUGANDO, PURA SUERTE');
    }
}

function movePlayer(){
    const giftColisionX = positionGift.x.toFixed(3) == positionPlayer.x.toFixed(3);
    const giftColisionY = positionGift.y.toFixed(3) == positionPlayer.y.toFixed(3);
    const colisionan = giftColisionX && giftColisionY;

    if(colisionan){
        levelWin();
    }
   
    const colisionanConLaBombita = positionEnemy.find(enemy =>{
        const enemyColisionX = enemy.x.toFixed(3) == positionPlayer.x.toFixed(3)
        const enemyColisionY = enemy.y.toFixed(3) == positionPlayer.y.toFixed(3)

        return enemyColisionX && enemyColisionY;
        })
        
    if(colisionanConLaBombita){
        levelFail();
    }


    game.fillText(emojis['PLAYER'], positionPlayer.x , positionPlayer.y)
}

function showLives(){
    const arrayLives = Array(lives).fill(emojis['HEART'])
    console.log(arrayLives);

    spanLives.innerHTML = "";
    arrayLives.forEach(heart => spanLives.append(heart))
    
}

function showTiempo(){
    spanTiempo.innerHTML = Date.now() - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('Record_Time')
}

window.addEventListener('keydown',moveByKeys)
btnUp.addEventListener('click',moveUp)
btnLeft.addEventListener('click',moveLeft)
btnRight.addEventListener('click',moveRight)
btnDown.addEventListener('click',moveDown)

function moveByKeys(event){
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
    else if(event.key == 'ArrowDown') moveDown();
    
}

function moveUp(){
    console.log('me quiero mover hacia arriba');
    if((positionPlayer.y - elementSize) < elementSize){
        console.log('OUT');
    }else{
    positionPlayer.y -=elementSize ;
    startGame()}
}
function moveLeft(){
    console.log('me quiero mover hacia la izquierda');
    if((positionPlayer.x - elementSize) < elementSize){
        console.log('OUT');
    }else{
    positionPlayer.x -=elementSize 
    startGame()}
}
function moveRight(){
    console.log('me quiero mover hacia a derecha');
    if((positionPlayer.x + elementSize) > canvasSize  ){
        console.log('OUT');
    }else{
    positionPlayer.x +=elementSize }
    startGame()
}
function moveDown(){
    console.log('me quiero mover hacia abajo');
    if((positionPlayer.y + elementSize) > canvasSize  ){
        console.log('OUT');
    }else{
    positionPlayer.y +=elementSize }
    startGame()
}
