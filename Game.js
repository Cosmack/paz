import Player from './Player.js';

let playerColors = [
	'blue',
	'red',
	'#9B59B6',
	'#2980B9'
];

export default class Game{
	constructor(players){
		this.Players = [];
		this.view = null;
		this.Views = {};
		this.modal = false;
		this.over = false;

		// Create Players
		if(Number.isInteger(players) || players == null){ // || players == NaN
			if(players == null) players = 2;

			for(let i = 1; i <= players; i++){
				let player = new Player();
				player.color = playerColors[i-1];

				player.DealHand();

				//player.name = player.color;
				player.name = "Player" + i;

				this.Players.push(player);
			}
		} else {
			// Load Players
		}

		this.current = 0; //player
	}

	View(){
		let view = this.view = document.createElement("div");
		view.classList.add("board");

		this.Players.forEach(( p, id ) => {
			let pView = p.View();

			// Draw User Controls
			if(p.ai == false) {
				let ctrl = p.Controls = this.PlayerControls();
				pView.appendChild( ctrl );
			}

			view.appendChild(pView);
		});

		document.body.appendChild(view);
	}

	PlayerControls(){ // Player Control View
		let player = this.Player();

		let view = document.createElement("div");
		view.className = 'player-control';

		// Button: End Turn
		let end = document.createElement("button");
		end.innerHTML = "End Turn";
		end.onclick = () => {
			//console.log('end turn');
			this.EndTurn();
		}
		view.appendChild(end);

		// Button: Stand
		let stand = document.createElement("button");
		stand.innerHTML = "Stand";
		stand.onclick = () => {
			//console.log('stand');
			this.Stand();
		}
		view.appendChild(stand);

		return view;
	}

	StartTurn(){
		let player = this.Player();
		console.log(`%c  Start Turn  ::  ${player.name}  ::  ${player.CardCount()}  `, `background:${player.color}; color:white;`);

		// If Able, Draw Card
		if(!player.stand && !player.out){
			player.Draw();
			player.UpdateView();

			// AI --> Funct Array? Int?
			if(player.ai){
				switch(player.Ai()){
					case 'STAND': this.Stand(); break;
					default: this.EndTurn(); break;
				}
			}
		} else {
			this.EndTurn();
		}
	}

	EndTurn(){
		let player = this.Player();

		// Check player out
		if(player.CardCount() > 20) {
			player.out = true;
			console.log(`%c    ${player.name} Out at ${player.CardCount()}`, 'background:yellow;');
		}

		// Check for a Winner
		if(!this.CheckWinConditions()) {

			// Check for Game Over (Player Score > 3)
			this.Players.forEach( p => {
				if(p.score >= 3) this.GameOver(p) 
			});

			// this.Reset(); // <--  Keep ?
		} else {
			// Increment Player
			let next = this.current += 1;
			if( next >= this.Players.length ) next = 0;
			this.current = next;

			//Next Turn
			this.StartTurn();
		}
	}

	Stand(){
		let player = this.Player();
		player.stand = true;

		console.log(`%c    ${player.name} Stands at ${player.CardCount()}  `, 'background:purple;color:white;');

		this.EndTurn();
	}

	// Game AI
	CheckWinConditions(){ 
		let player = this.Player();
		// Test Round Status : return true --> continue, false --> new round

		// Stands
		if(this.Players.every(p => p.stand)){
			// Who has highest number or tie
			if(this.Players.every(p => p.CardCount() == this.Players[0].CardCount())){
				let txt = '  < < <  All Tie  > > >  ';
				console.log('%c' + txt, 'background:orange;');
				this.ShowWinModal(txt);

				return false;
			}

			let winner = this.HighestCount();
			winner.Win();
			let txt = `  > > >  ${winner.name} wins by stand.  < < <  `;
			console.log(`%c` + txt, 'background:lime;');
			this.ShowWinModal(txt);

			return false;
		}

		// All Fail
		if(this.Players.every(p => p.out)){
			let txt = '  < < <  All Fail  > > >  ';
			console.log('%c' + txt, 'background:orange;');
			this.ShowWinModal(txt);

			return false;
		}

		// Last Player Standing
		let allFail = this.Players.filter(p => p.out == true);
		if(allFail.length == (this.Players.length - 1)){
			this.Players.forEach(p => { 
				if(!p.out) {
					p.Win();
					let txt = `  > > >  ${p.name} wins by default.  < < <  `;
					this.ShowWinModal(txt);
					console.log(`%c` + txt, 'background:green; color: white;');
				}
			});
			return false;
		}

		return true;
	}

	Reset(){
		this.Players.forEach(p=>{
			p.cards = [];
			p.out = false;
			p.stand = false;
			p.Views.cards.innerHTML = "";

			p.UpdateView();
		});
	}

	// Helpers
	Player(){
		return this.Players[this.current];
	}

	HighestCount(){
		let ranking = [...this.Players];
		ranking.sort((a,b) => b.CardCount() - a.CardCount());
		return ranking[0];
	}

	GameOver(winner){
		this.view.innerHTML = "";

		let name = document.createElement("div");
		name.className = "winner";
		name.innerHTML = ` ${ winner.name } has won!`;
		this.view.appendChild(name);

		let but = document.createElement("button");
		but.className = "newgame-btn";
		but.innerHTML = ` New Game `;
		but.onclick = () => {
			window.location = window.location;
		}
		this.view.appendChild(but);
	}

	IsGameOver(){
		let players = this.Players;
		players.forEach( p => {
			if(p.score >= 3) this.GameOver(p);
		});
	} // Not used

	ShowWinModal(txt){
		this.modal = true;
		var modal = this.Views.modal = document.createElement("div");
		modal.className = "modal";

		var content = document.createElement("div");
		content.className = "modal-content";
		modal.appendChild(content);

		var close = document.createElement("span");
		close.className = 'close';
		close.innerHTML = '&times;';
		close.onclick = () => {
			this.CloseWinModal();
		}
		content.appendChild(close);

		var p = document.createElement("p");
		p.innerHTML = txt;
		content.appendChild(p);

		document.body.appendChild(modal);

		modal.style.display = 'block';

		// Click Outside --> Close Win;
		window.onclick = (e) => {
			if (e.target == modal) this.CloseWinModal();
		}
	}

	CloseWinModal(){
		this.modal = false;
		this.Views.modal.style.display = 'none';
		this.Reset();
		this.EndTurn();
	}
}