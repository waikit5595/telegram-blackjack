function renderPlayers(data){

let html="Room: "+roomID+"<br><br>"

Object.values(data.players).forEach(p=>{

html+=`
<div class="player">

${p.name}

</div>
`

})

document.getElementById("players").innerHTML=html

}

function renderGame(data){

let html=""

let ids=Object.keys(data.players)

ids.forEach((id,i)=>{

let p=data.players[id]

let turn = data.currentTurn==i ? "turn": ""

html+=`<div class="player ${turn}">`

html+=`<h3>${p.name}</h3>`

p.hand.forEach(c=>{

if(id==userID || data.reveal){

html+=`<div class="card">${c.rank}${c.suit}</div>`

}else{

html+=`<div class="card back">🂠</div>`

}

})

if(id==userID){

html+=`<div>Score: ${score(p.hand)}</div>`

}

if(blackjack(p.hand)){

html+=`<div class="blackjack">BLACKJACK!</div>`

}

html+="</div>"

})

document.getElementById("game").innerHTML=html

}