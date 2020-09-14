import Card from './PazCard.js';

export default class Player{
// Expand for Persistant Play (db)
	constructor(){ // hand?
		// Profile
		this.deck = [];
		this.score = 0;
		this.name = 'Player' + Math.round(Math.random() * 1701);
		this.ai = true;

		// UI
		this.Views = {};

		// Game
		this.hand = [];
		this.cards = [];
		this.view = null;
		this.stand = false;
		this.out = false;
	}

	Win(){
		this.score += 1;
		return this.score;
	}

	DealHand(){
		if(this.deck.length == 0){
			for(let i = 0; i < 5; i++) this.hand.push(new Card().RandomHand());
		}

		// If human draw, show, else obfusticate. X Pre Draw
	}

	Draw(){
		let card = new Card().RandomPlay();
		this.cards.push(card);

		this.Views.cards.appendChild( card.View() );

		console.log(`%c    ${ this.name } drew ${ card.value }  ::  ${this.CardCount()}  `, 'background:#AED6F1');
	}

	PlayCard(c, id){
		// To Table
		this.cards.push(c);
		// From Hand
		this.hand.splice(id,1);

		if(this.ai){
			c.view.remove();
			this.Views.cards.appendChild(c.View());
		} else {
			this.Views.cards.appendChild(c.view);
		}

		this.UpdateView();

		console.log(`%c    ${this.name} played card ${c.value} (${c.type})`, `background:teal; color: white;`);
	}

	View(){
		let view = this.Views.view = document.createElement("div");
		view.className = "player";

		//    H E A D
		let head = this.Views.head = document.createElement("div");
		head.className = "player-head";
		// Name
		let name = this.Views.name = document.createElement("span");
		name.innerHTML = this.name + " ";
		head.appendChild(name);

		// Wins Label
		let wins = document.createElement("span");
		wins.className = 'player-wins';
		wins.innerHTML = 'Wins: ';
		// Score
		let score = this.Views.score = document.createElement("span");
		score.innerHTML = this.score;
		wins.appendChild(score);
		head.appendChild(wins);

		view.appendChild(head); // Head

		//    B O D Y
		let body = document.createElement("div");
		body.className = "player-body";

		// Count
		let count = this.Views.count = document.createElement("span");
		count.className = "player-count";
		count.innerHTML = ` ${this.CardCount()} `;
		body.appendChild(count);

		// Cards
		let cards = this.Views.cards = document.createElement("span");
		cards.className = "player-cards";
		body.appendChild(cards);

		// Hand --> Show Hand
		let hand = this.Views.hand = document.createElement("span");
		hand.className = "player-hand player-cards";
		this.ShowHand();
		body.appendChild(hand);

		view.appendChild(body); // Body

		return view;
	}

	UpdateView(){
		this.Views.count.innerHTML = ` ${this.CardCount()} `;
		this.Views.score.innerHTML = this.score;

		if(this.out){
			this.Views.view.style.borderColor = '#F5B041';
			this.Views.head.style.backgroundColor = '#F5B041';
		} else if(this.stand){
			this.Views.view.style.borderColor = 'white';
			this.Views.head.style.backgroundColor = 'white';
		} else {
			this.Views.view.style.borderColor = '#85C1E9';
			this.Views.head.style.backgroundColor = '#85C1E9';
		}
	}

	ShowHand(){
		// Clear Hand
		let view = this.Views.hand;
		view.innerHTML = "";
		let hand = this.hand;

		// Hand Card Logic
		hand.forEach((c,id) => {
			let card = (!this.ai) ? c.View() : c.AIView();

			card.onclick = event => {
				if(event.shiftKey){
					c.ChangeCard();
				} else {
					this.PlayCard(c, id);
					card.onclick = null;
				}
				
			}
			view.appendChild(card);
		});
	}

	CardCount(){
		let count = 0;

		// Add or Subtract
		this.cards.forEach(c => {
			if(c.type == 1){
				count -= c.value
			} else {
				count += c.value
			}
		});

		// Auto-Stand Here?
		//if(count == 20)

		return count;
	}

	Ai(){
		let count = this.CardCount();

		// Stand on 20 (or less ..)
		if(count == 20) {
			return 'STAND';
		}

		// Try Not to Lose (or Win from Above) [Defense]
		if(count > 20){
			let diff = count - 20;

			// Exact Match
			let matchId = this.hand.findIndex(c => c.value == diff && ( c.type == 1 || c.change == true ));
			if(matchId != -1){
				let card = this.hand[matchId];
				if(card.type == 0) card.ChangeCard();
				this.PlayCard(card, matchId);
				return 'STAND';
			}

			// Sacrafice Card to Survive
			let prayId = this.hand.findIndex(c => c.value > diff && ( c.type == 1 || c.change == true ));
			if(prayId != -1){
				let card = this.hand[prayId];
				if(card.type == 0) card.ChangeCard();
				this.PlayCard(card, prayId);
			}
		}

		// Try To Win [Offense]
		if(count < 20) {
			let diff = 20 - count;

			// Matching Card
			let matchId = this.hand.findIndex(c => c.value == diff && ( c.type == 0 || c.change == true ));
			if(matchId != -1){
				let card = this.hand[matchId];
				if(card.type == 1) card.ChangeCard();
				this.PlayCard(card, matchId);
				return 'STAND';
			}

			// Try to make <20
			let opts = this.hand.filter(c => c.value < diff && ( c.type == 0 || c.change == true ));
			if(opts.length > 0){
				opts.sort( (a,b) => b.value - a.value );
				let optDiff = diff - opts[0];
				// Roll
				let roll = Math.floor(Math.random() * 10) + 1;
				// Feeling Lucky?
				let play = false;
				switch(optDiff){
					case 1: // 1 in 3
						if(roll > 6) play = true;
					break;
					case 2: // 1 in 5
						if(roll > 8) play = true;
					break;
					default:
					break;
				}
				// Try Luck
				if(play){
					if(card.type == 1) card.ChangeCard();
					this.PlayCard(match, matchId);
					return 'STAND';
				}
			}
		}

		return 'END';
	}

	TempSpacer(){
		let spacer = document.createElement("span");
		spacer.innerHTML = " / ";
		return spacer;
	}
}