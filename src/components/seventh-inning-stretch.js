import { LitElement, html, css } from 'lit'


export class SeventhInningStretch extends LitElement {
  static properties = {
    isIntermission: { type: Boolean },
  }

  render() {
    return html`
    <div class="seventh-inning-stretch">
      <h1>We'll See You Next Season!</h1>
    </div>
    `
  }
}

customElements.define('seventh-inning-stretch', SeventhInningStretch)
