const tg=window.Telegram.WebApp
tg.expand()

let userID=tg.initDataUnsafe.user?.id || Math.random()

let username="Player"

let roomID=null

function createRoom(){

username=document.getElementById("nameInput").value

roomID="room"+Math.floor(Math.random()*9999)

db.ref("rooms/"+roomID).set({

host:userID,
started:false,
currentTurn:0,
reveal:false,
deck:createDeck(),
players:{
[userID]:{
name:username,
hand:[],
stand:false
}
}

})

listenRoom()

}

function joinRoom(){

username=document.getElementById("nameInput").value

roomID=document.getElementById("roomInput").value

db.ref("rooms/"+roomID+"/players/"+userID).set({

name:username,
hand:[],
stand:false

})

listenRoom()

}

function listenRoom(){

db.ref("rooms/"+roomID).on("value",snap=>{

let data=snap.val()

if(!data) return

document.getElementById("roomInfo").innerHTML="Room: "+roomID

renderPlayers(data)

if(data.started){

renderGame(data)

}

})

}

function startGame(){

let ref=db.ref("rooms/"+roomID)

ref.once("value").then(snap=>{

let data=snap.val()

let deck=data.deck

let players=data.players

Object.keys(players).forEach(id=>{

players[id].hand=[deck.pop(),deck.pop()]

})

ref.update({

players:players,
deck:deck,
started:true

})

})

}

function hit(){

let ref=db.ref("rooms/"+roomID)

ref.once("value").then(snap=>{

let data=snap.val()

let deck=data.deck

let players=data.players

players[userID].hand.push(deck.pop())

ref.update({

players:players,
deck:deck

})

})

}

function stand(){

let ref=db.ref("rooms/"+roomID)

ref.once("value").then(snap=>{

let data=snap.val()

let next=data.currentTurn+1

ref.update({

currentTurn:next

})

})

}

function reveal(){

db.ref("rooms/"+roomID).update({

reveal:true

})

}