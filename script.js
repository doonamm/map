import ArrayMap from './map.js';
const TILE_W = 12;
const TILE_H = 12;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const RATIO = 1.6;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = CANVAS_WIDTH/RATIO;
const MAP_WIDTH = 1920;
const MAP_HEIGHT = 1200;
const FRAME_DELAY = 20;
var loop = null;

const view = {
    x: 0,
    y: 0
}

const background = new Image();
background.src = './map.png';

const playerImg = {};
playerImg.left = new Image;
playerImg.left.src = './sprites/ACharLeft.png';
playerImg.right = new Image;
playerImg.right.src = './sprites/ACharRight.png';
playerImg.right.onload = ()=>{console.log('loaded');}
playerImg.up = new Image;
playerImg.up.src = './sprites/ACharUp.png';
playerImg.down = new Image;
playerImg.down.src = './sprites/ACharDown.png';
playerImg.w = 24;
playerImg.h = 24;
playerImg.x = 0;
playerImg.y = 0;
playerImg.delayTime = 6;
playerImg.delayCount = playerImg.delayTime;


const player = {
    w: 2*playerImg.w,
    h: 2*playerImg.h,
    x: 25,
    y: 110,
    direction: 'down',
    status: {
        left: false,
        right: false,
        up: false,
        down: false
    },
    speed: 3,
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
updateScreenSize();
setInterval(update, FRAME_DELAY);

//function
function keyDown(e){
    switch(e.code){
        case 'ArrowLeft':
            updateState(true, 'left');
            break;
        case 'ArrowRight':
            updateState(true, 'right');
            break;
        case 'ArrowUp':
            updateState(true, 'up');
            break;
        case 'ArrowDown':
            updateState(true, 'down');
            break;
    }
}
function keyUp(e){
    switch(e.code){
        case 'ArrowLeft':
            updateState(false, 'left');
            break;
        case 'ArrowRight':
            updateState(false, 'right');
            break;
        case 'ArrowUp':
            updateState(false, 'up');
            break;
        case 'ArrowDown':
            updateState(false, 'down');
            break;
    }
}
function update(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    updateMapPosition();
    ctx.drawImage(background, 0, 0, MAP_WIDTH, MAP_HEIGHT, view.x, view.y, MAP_WIDTH*2, MAP_HEIGHT*2);
    
    drawPlayer(playerImg[player.direction], playerImg.x*playerImg.w, playerImg.y*playerImg.w);
    updatePlayerImg();
    updatePlayerPosition();
}
function drawPlayer(img, imgX, imgY){
    ctx.drawImage(img, imgX, imgY, playerImg.w, playerImg.h, player.x + view.x, player.y + view.y, player.w, player.h);
}
function updateState(isMoving, direction){
    if(player.direction !== direction || !isMoving){
        playerImg.x = 0;
        playerImg.y = 0;
        if(player.status[player.direction]===false)
            player.direction = direction;
    }
    player.status[direction] = isMoving;
}
function updatePlayerImg(){
    if(!player.status.left && !player.status.right && !player.status.up && !player.status.down)
        return;
    if(playerImg.delayCount > 0){
        playerImg.delayCount--;
        return;
    }
    playerImg.delayCount = playerImg.delayTime;
    playerImg.x++;
    if(playerImg.x > 1){
        playerImg.x = 0;
        playerImg.y++;
        if(playerImg.y > 1){
            playerImg.y = 0;
        }
    }
}
function updateScreenSize(){
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}
function updatePlayerPosition(){
    const x = player.x;
    const y = player.y;

    if(player.status.left){
        player.direction = 'left';
        player.x -= player.speed
    }
    else if(player.status.right){
        player.direction = 'right';
        player.x += player.speed;
    }
    if(checkMapCollision(player.x, player.y) === 1)
        player.x = x;
    if(player.status.up){
        player.direction = 'up';
        player.y -= player.speed;
    }
    else if(player.status.down){
        player.direction = 'down';
        player.y += player.speed;
    }
    if(checkMapCollision(player.x, player.y) === 1)
        player.y = y;
}
function updateMapPosition(){
    var x = -(player.x + player.w/2 - CANVAS_WIDTH/2);
    var y = -(player.y + player.h/2 - CANVAS_HEIGHT/2);
    if(x > 0 )
        x = 0;
    if(y > 0)
        y = 0;
    if(x < CANVAS_WIDTH - MAP_WIDTH*2)
        x = CANVAS_WIDTH - MAP_WIDTH*2;
    if(y < CANVAS_HEIGHT - MAP_HEIGHT*2)
        y = CANVAS_HEIGHT - MAP_HEIGHT*2;
    view.x = x;
    view.y = y;
}
function checkMapCollision(x, y){
    const indexCol = Math.floor((x/2) / TILE_W) + 1;
    const indexRow = Math.floor((y/2) / TILE_H) + 1;

    if(indexCol < 0 || indexCol > 159 || indexRow < 0 || indexRow > 99)
        return 1;
    return ArrayMap[indexRow][indexCol];
}

