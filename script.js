// ====== GLOBAL VARIABLES ======
let puzzleImg = "";
let giftImg = "";
let puzzleOrder = [];
let selectedTile = null;

// ====== CREATOR PAGE ======
function generateGiftLink() {
    const name = encodeURIComponent(document.getElementById("nameInput").value);
    const msg = encodeURIComponent(document.getElementById("messageInput").value);

    const puzzleFile = document.getElementById("photoInput").files[0];
    const giftFile = document.getElementById("giftInput").files[0];

    if(!puzzleFile || !giftFile){
        alert("Please choose both photos.");
        return;
    }

    const reader1 = new FileReader();
    reader1.onload = function(e){
        puzzleImg = e.target.result;
        const reader2 = new FileReader();
        reader2.onload = function(e2){
            giftImg = e2.target.result;
            const link = `gift.html?name=${name}&msg=${msg}&puzzle=${encodeURIComponent(puzzleImg)}&gift=${encodeURIComponent(giftImg)}`;
            document.getElementById("linkOutput").innerHTML = `<a href="${link}" target="_blank">Open Gift Website</a>`;
        };
        reader2.readAsDataURL(giftFile);
    };
    reader1.readAsDataURL(puzzleFile);
}

// ====== GIFT PAGE INITIALIZATION ======
if(window.location.pathname.includes("gift.html")){
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const msg = params.get("msg");
    puzzleImg = decodeURIComponent(params.get("puzzle"));
    giftImg = decodeURIComponent(params.get("gift"));

    document.getElementById("title").innerText = "Happy Birthday " + name + " 🎂";
    document.getElementById("giftMsg").innerText = msg;
    document.getElementById("giftImg").src = giftImg;

    // Play background music
    const music = document.getElementById("bgMusic");
    music.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Example free music
    music.play().catch(()=>{}); 

    initPuzzle();
}

// ====== PUZZLE LOGIC ======
function initPuzzle(){
    const puzzleDiv = document.getElementById("puzzle");
    puzzleDiv.innerHTML = "";
    puzzleOrder = [0,1,2,3,4,5,6,7,8].sort(()=>Math.random()-0.5);

    puzzleOrder.forEach((i,index)=>{
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.setAttribute("draggable","true");
        tile.dataset.index = index;

        const x = (i % 3) * -100;
        const y = Math.floor(i/3) * -100;
        tile.style.backgroundImage = `url(${puzzleImg})`;
        tile.style.backgroundPosition = `${x}px ${y}px`;

        // Drag and Drop Events
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("drop", dropTile);

        puzzleDiv.appendChild(tile);
    });
}

let dragStartIndex;
function dragStart(e){
    dragStartIndex = e.target.dataset.index;
}
function dragOver(e){
    e.preventDefault();
}
function dropTile(e){
    const dragEndIndex = e.target.dataset.index;
    [puzzleOrder[dragStartIndex], puzzleOrder[dragEndIndex]] = [puzzleOrder[dragEndIndex], puzzleOrder[dragStartIndex]];
    initPuzzle();
    checkWin();
}

// ====== CHECK WIN ======
function checkWin(){
    let win = true;
    for(let i=0;i<9;i++){ if(puzzleOrder[i]!==i) win=false; }
    if(win){
        document.getElementById("gift").style.display = "block";
        animateGiftBox();
        startConfetti();
    }
}

// ====== ANIMATED GIFT BOX ======
function animateGiftBox(){
    const box = document.getElementById("giftBox");
    box.style.transition = "transform 1s";
    box.style.transform = "scale(1.2) rotate(-10deg)";
    setTimeout(()=>{ box.style.transform = "scale(1) rotate(0deg)"; },1000);
}

// ====== CONFETTI ======
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let confettiArr = [];

function startConfetti(){
    confettiArr = [];
    for(let i=0;i<200;i++){
        confettiArr.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            r: Math.random()*6+2,
            color: `hsl(${Math.random()*360},100%,50%)`,
            dY: Math.random()*3+2
        });
    }
}
function drawConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confettiArr.forEach(c=>{
        ctx.beginPath();
        ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
        ctx.fillStyle = c.color;
        ctx.fill();
        c.y += c.dY;
        if(c.y>canvas.height) c.y=-10;
    });
    requestAnimationFrame(drawConfetti);
}
drawConfetti();