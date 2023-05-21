import { LitElement, html, css } from 'lit';
// import { service } from "../state/app-machine.js";

export class CalcAdd extends LitElement {
	static properties = {
		num: { type: Number },
		scores: { type: Array },
	}

	static styles = css`
	.number {
		font-size: 1.5rem;
		color: red;
	}
	`

	constructor() {
		super();
		this.num = 1;
		// service.onTransition((state) => {
		// 	console.log(state)
		//  this.num = state.context.num;
		//  this.scores = state.context.scores;
		// })
	}

	updated(changed) {
		if (changed.has('scores')) {
			console.log('scores updated')
		}
	}


	render() {
		console.log(this.num)
		return html` <div class="number">Number: ${this.num}</div>
		${this.scores.map((score) => html`<div>${score.name}</div>`)}
		<sl-button size="large">Click me</sl-button>
		`;
	}
}

customElements.define('calc-add', CalcAdd);
