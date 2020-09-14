import Card from './PazCard.js';
import Game from './Game.js';

// Index JS
(()=>{
	console.log('  .:  Paz  ::  Running  :.  ');
	// Const
	let doc = document;
	let bod = doc.body;

	// Get Players
	let params = (new URL(document.location)).searchParams;
	let players = parseInt(params.get('players')); //    <-- F I X

	// Game
	let game = new Game(2);
	game.Players[0].ai = false;

	// console.log(game);

	game.View();

	game.StartTurn();

	doc.onkeyup = (e) => {
		//console.log(e.key);
		console.log(game.modal);
		if(!game.modal){
			switch(e.key){
				case ' ':
					game.EndTurn();
				break;
				case 'Enter':
					game.Stand();
				break;
			}
		} else {
			game.CloseWinModal();
		}
		
	}
})();