const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* IMAGENS */

const monkeyImg = new Image();
monkeyImg.src = "https://i.ibb.co/Fqz7hQrx/IMG-8459.jpg";

/* CANVAS */

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ESTADO */

let jogoAtivo = false;
let chuva = [];
let nuvens = [];
let mouseX = window.innerWidth / 2;

let tempoSobrevivido = 0;
let intensidadeChuva = 0.35;

/* NUVENS */

for(let i = 0; i < 5; i++){
  nuvens.push({
    x: Math.random() * window.innerWidth,
    y: 40 + Math.random() * 120,
    vel: 0.2 + Math.random() * 0.5
  });
}

/* MOUSE E TOQUE */

window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
});

window.addEventListener("touchmove", e => {
  mouseX = e.touches[0].clientX;
}, { passive:true });

/* MACACO */

const macaco = {
  x(){
    return canvas.width / 2;
  },

  y(){
    return canvas.height - 130;
  }
};

/* COMEÇAR */

function iniciarJogo(){

  document.getElementById("telaTexto").style.display = "none";
  document.getElementById("game").style.display = "block";

  chuva = [];

  tempoSobrevivido = 0;
  intensidadeChuva = 0.35;

  jogoAtivo = true;

  requestAnimationFrame(loop);
}

/* REINICIAR */

function reiniciarJogo(){

  document.getElementById("derrota").style.display = "none";
  document.getElementById("game").style.display = "block";

  chuva = [];

  tempoSobrevivido = 0;
  intensidadeChuva = 0.35;

  jogoAtivo = true;

  requestAnimationFrame(loop);
}

/* CHUVA */

function criarGota(){

  chuva.push({
    x: Math.random() * canvas.width,
    y: -20,
    vel: 6 + Math.random() * 4
  });

}

/* GAME OVER */

function gameOver(){

  jogoAtivo = false;

  document.getElementById("game").style.display = "none";
  document.getElementById("derrota").style.display = "flex";

}

/* CORAÇÕES */

function criarCoracoes(){

  for(let i = 0; i < 50; i++){

    setTimeout(() => {

      const c = document.createElement("div");

      c.className = "coracao";

      c.innerHTML = Math.random() > 0.5 ? "💙" : "✨";

      c.style.left = Math.random() * 100 + "vw";
      c.style.bottom = "0px";

      document
      .getElementById("coracoes")
      .appendChild(c);

      setTimeout(() => {
        c.remove();
      },4000);

    }, i * 100);

  }

}

/* VITÓRIA */

function mostrarVitoria(){

  jogoAtivo = false;

  document.getElementById("game").style.display = "none";
  document.getElementById("vitoria").style.display = "flex";

  criarCoracoes();

}

/* LOOP */

function loop(){

  if(!jogoAtivo) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /* FUNDO */

  const grad = ctx.createLinearGradient(
    0,
    0,
    0,
    canvas.height
  );

  grad.addColorStop(0,"#dff5ff");
  grad.addColorStop(1,"#b8e6ff");

  ctx.fillStyle = grad;
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /* NUVENS */

  ctx.fillStyle = "rgba(255,255,255,.9)";

  nuvens.forEach(n => {

    n.x += n.vel;

    if(n.x > canvas.width + 120){
      n.x = -150;
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, 30, 0, Math.PI*2);
    ctx.arc(n.x+30, n.y-10, 35, 0, Math.PI*2);
    ctx.arc(n.x+60, n.y, 30, 0, Math.PI*2);
    ctx.fill();

  });

  /* CHUVA */

  intensidadeChuva += 0.00005;

  if(Math.random() < intensidadeChuva){
    criarGota();
  }

  for(let i = chuva.length-1; i >= 0; i--){

    const g = chuva[i];

    g.y += g.vel;

    ctx.strokeStyle = "#6aaeff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.lineTo(g.x - 5, g.y + 18);
    ctx.stroke();

    /* GUARDA CHUVA */

    const guardaX = mouseX;

    if(
      g.y > macaco.y() - 135 &&
      g.y < macaco.y() - 60 &&
      Math.abs(g.x - guardaX) < 60
    ){
      chuva.splice(i,1);
      continue;
    }

    /* MACACO */

    if(
      g.y > macaco.y() + 20 &&
      Math.abs(g.x - macaco.x()) < 40
    ){
      gameOver();
      return;
    }

    if(g.y > canvas.height + 30){
      chuva.splice(i,1);
    }

  }

  /* GUARDA CHUVA */

  const guardaX = mouseX;

  ctx.fillStyle = "#111";

  ctx.beginPath();
  ctx.arc(
    guardaX,
    macaco.y()-70,
    55,
    Math.PI,
    0
  );

  ctx.fill();

  ctx.strokeStyle = "#5d3c1d";
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(
    guardaX,
    macaco.y()-70
  );

  ctx.lineTo(
    guardaX,
    macaco.y()-5
  );

  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(
    "☠",
    guardaX-12,
    macaco.y()-80
  );

  /* MACACO */

  const bounce =
  Math.sin(Date.now()/250) * 4;

  ctx.save();

  ctx.beginPath();
  ctx.arc(
    macaco.x(),
    macaco.y(),
    55,
    0,
    Math.PI*2
  );

  ctx.clip();

  ctx.drawImage(
    monkeyImg,
    macaco.x()-55,
    macaco.y()-55 + bounce,
    110,
    110
  );

  ctx.restore();

  /* HUD */

  tempoSobrevivido += 1/60;

  document.getElementById("hud").innerHTML =
  "☔ Proteja o macaquinho • " +
  Math.floor(tempoSobrevivido) +
  "/30 segundos";

  /* VITÓRIA */

  if(tempoSobrevivido >= 30){

    mostrarVitoria();
    return;

  }

  requestAnimationFrame(loop);

}