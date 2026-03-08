function value(r){

if(r=="A") return 11
if(["J","Q","K"].includes(r)) return 10

return parseInt(r)

}

function score(hand){

let total=0
let aces=0

hand.forEach(c=>{

if(c.rank=="A") aces++
else total+=value(c.rank)

})

let best=0

if(hand.length==2){

for(let a of [1,11]){

let s=total+a
if(s<=21 && s>best) best=s

}

}

else if(hand.length==3){

for(let a of [1,10]){

let s=total+a
if(s<=21 && s>best) best=s

}

}

else{

best=total+aces

}

if(best==0) best=total+aces

return best

}

function blackjack(hand){

if(hand.length!=2) return false

let r1=hand[0].rank
let r2=hand[1].rank

return (r1=="A" && value(r2)==10) ||
(r2=="A" && value(r1)==10)

}

function strongPair(hand){

if(hand.length!=2) return false

if(hand[0].rank!=hand[1].rank) return false

return value(hand[0].rank)>=8

}