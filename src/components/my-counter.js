import { LitElement, html } from 'lit';
// import { service } from "../state/app-machine.js";

export class MyCounter extends LitElement {
	static get properties() {
		return {
			count: {
				type: Number,
			},
		};
	}

	constructor() {
		super();
		this.count = 0;
	}

	increment() {
		// service.send('INCREMENT');
	}

	render() {
		return html`
			<div>
				<p>Count: ${this.count}</p>

				<button type="button" @click=${this.increment}>Increment</button>
			</div>
		`;
	}
}

customElements.define('my-counter', MyCounter);
