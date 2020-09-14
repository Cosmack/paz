let bgColors = [
	'yellow', // Play
	'blue', // Add
	'red' // Sub
];

let cardColors = [
	'#5499C7',
	'#F5B041'
];

export default class Card{
	constructor(value, type){
		this.value = (value == null) ? 1 : value;
		this.type = (type == null) ? 0 : type;

		this.change = false;

		this.view = null;
	}

	RandomPlay(){
		this.value = Math.floor(Math.random() * 10) + 1;

		return this;
	}

	RandomHand(){
		this.value = Math.floor(Math.random() * 6) + 1;

		this.type = Math.floor(Math.random() * 2);

		let rnd = Math.round(Math.random() * 5);
		if(rnd == 5) this.change = true;

		return this;
	}

	View(){
		let card = this.view = document.createElement('div');

		card.className = 'card';
		card.innerHTML = this.TextOut();

		card.style.backgroundColor = cardColors[this.type];
		let bc = (this.change) ? 'white' : 'black';
		card.style.border = "2px solid " + bc;

		return card;
	}

	AIView(){
		let card = this.view = document.createElement('div');

		card.className = 'card';
		card.innerHTML = "<span class='card-type'>+</span>" + 0;

		card.style.backgroundColor = cardColors[0];
		card.style.color = cardColors[0];
		let bc = 'black';
		card.style.border = "2px solid " + bc;

		return card;
	}

	ChangeCard(){
		// console.log('Change card');
		this.type = (this.type == 0) ? 1 : 0;
		this.UpdateView();
	}

	UpdateView(){
		this.view.style.backgroundColor = cardColors[this.type];
		this.view.innerHTML = this.TextOut();
	}

	TextOut(){
		//return `${this.type == 0 ? "+": "-"}${this.value}`;
		let span = document.createElement('span');
		span.innerHTML = `${this.type == 0 ? "+": "- "}`;
		span.className = "card-type";

		return span.outerHTML + `${this.value}`;
	}
}