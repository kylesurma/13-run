// create skeleton for lit component

import { html, css, LitElement, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";

export class HeaderDropdown extends LitElement {
  static properties = {
    selectedHeader: { type: String },
    headers: { type: Array },
    isShowing: { type: Boolean },
  };
  static styles = css`
    .header-container {
      display: flex;
      justify-content: center;
    }

    .dropdown-container {
      display: flex;
      width: min(100%, 500px);
      justify-content: center;
    }

    .dropdown-header {
      display: flex;
      padding-left: 50px;
      font-size: 48px;
      align-items: center;
      justify-content: center;
    }

    .dropdown-menu-wrapper {
      position: absolute;
      top: 125px;
      font-size: 2em;
      display: flex;
      align-items: center;
      justify-content: center;
      width: inherit;
      height: fit-content;
      box-shadow: 0 0 10px 0 rgb(0 0 0 / 50%);
      flex-direction: column;
      z-index: 100;
      background-color: white;
    }

    .chevron-line2,
    .chevron-line1 {
      stroke-width: 10;
      stroke-linecap: round;
      -webkit-transition: -webkit-transform 0.4s, stroke 0.4s;
      transition: transform 0.4s, stroke 0.4s;
    }

    .chevron-line1 {
      -webkit-transform-origin: 50px 50px;
      transform-origin: 50px 50px;
    }
    .chevron-line2 {
      -webkit-transform-origin: 50px 50px;
      transform-origin: 50px 50px;
    }
    .chevron--down,
    .chevron--up {
      display: block;
      position: relative;
      top: 6px;
    }
    .chevron--down .chevron-container,
    .chevron--up .chevron-container {
      -webkit-transition: -webkit-transform 0.4s;
      transition: transform 0.4s;
      -webkit-transform: translateY(13px);
      transform: translateY(13px);
    }
    .chevron--down .chevron-line1,
    .chevron--up .chevron-line1 {
      stroke: #707173;
      -webkit-transform: rotate(40deg);
      transform: rotate(40deg);
    }
    .chevron--down .chevron-line2,
    .chevron--up .chevron-line2 {
      stroke: #707173;
      -webkit-transform: rotate(-40deg);
      transform: rotate(-40deg);
    }
    .chevron--up .chevron-container {
      -webkit-transform: translateY(-13px);
      transform: translateY(-13px);
    }
    .chevron--up .chevron-line1 {
      stroke: white;
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    .chevron--up .chevron-line2 {
      stroke: white;
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    .dropdown-menu-item {
      display: flex;
      padding: 10px;
      width: 90%;
      justify-content: center;
      border: 1px solid white;
      border-radius: 4px;
    }

    .dropdown-menu-item:hover {
      background-color: aliceblue;
      border: 1px aliceblue solid;
      
    }
    
    .dropdown-menu-item:active {
      background-color: #e6e6e6;
      border: 1px solid darkblue;
    }

    .hidden {
      display: none;
    }
    
    a {
      all: unset;
    }
  `;

  constructor() {
    super();
    this.selectedHeader = "$100 13-Run";
    this.headers = [{name: '$100 13-Run', url:'100-13-run'}, {name: '$50 13-Run', url:'50-13-run'}, {name: '8 Run Out', url: '8-run-out'}];
    this.isShowing = false;
  }

  render() {
    return html`
      <div class="header-container">
        <div class="dropdown-container">
          <div class="dropdown-header" @click=${this._handleOpen}>
            <p>${this.selectedHeader}</p>
            ${this.generateChevron()}
          </div>
          <div class="dropdown-menu-wrapper ${this.isShowing ? "" : "hidden"}">
            ${repeat(
              this.headers,
              (header) => html`<a href=${header.url} class="dropdown-menu-item">${header.name}</a>`
            )}
          </div>
        </div>
      </div>
    `;
  }

  generateChevron() {
    return html`
      <svg
        class="chevron ${this.isShowing ? "chevron--up" : "chevron--down"}"
        width="50"
        height="50"
        version="1.1"
        viewbox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <g class="chevron-container">
          <line class="chevron-line1" x1="10" y1="50" x2="50" y2="50" />
          <line class="chevron-line2" x1="90" y1="50" x2="50" y2="50" />
        </g>
      </svg>
    `;
  }

  _handleOpen() {
    this.isShowing = !this.isShowing;
  }
}

customElements.define("header-dropdown", HeaderDropdown);
