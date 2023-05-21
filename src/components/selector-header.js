import {css, html, LitElement} from 'lit'

export class SelectorHeader extends LitElement {

  static styles = css`
    ::part(listbox) {
      position: center;
      background-color: darkblue;
      color: white;
      overflow: visible;
      z-index: 100000000;
    }
    
  `

  render() {
    return html`<sl-select size="large" hoist>
    <sl-option value='100'>$100 13 Run</sl-option>
    <sl-option value='50'>$50 13 Run</sl-option>
    <sl-option value='8'>8 Run Out</sl-optionvalue>
    </sl-select>`
  }
}

customElements.define('selector-header', SelectorHeader)