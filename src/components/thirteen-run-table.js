import { html, css, LitElement, nothing } from "lit";

export class ThirteenRunTable extends LitElement {
  static properties = {
    teams: { type: Array },
    todaysScores: { type: Array },
    archivedScores: { type: Object },
    todaysScoresObj: { type: Object },
    players: { type: Object },
    showTeam: { type: String },
  };
  static styles = css`
    img {
      height: 30px;
      width: 30px;
    }
    .table-container {
      overflow-x: scroll;
      overflow-y: hidden;
      width: 95vw;
      height: min-content;
      padding: 0 0 0 45px;
      background-color: dimgray;
      box-shadow: -7px 5px 20px 1px #000;
      border-radius: 10px;
    }
    table {
      border-collapse: separate;
      border-spacing: 0;
      height: 100%;
      background-color: transparent;
    }
    .team-logo {
      position: absolute;
      left: 3px;
      width: 40px;
      margin: 6px 0 0 0;
      border: 2px solid;
      border-radius: 10px;
      background-color: antiquewhite;
      z-index: 5;
    }
    td {
      height: 50px;
      border-bottom: 0.05px antiquewhite solid;
    }

    ::part(body) {
      background-color: darkblue;
      color: white;
      width: 115px;
      height: 40px;
      border-radius: 10px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    .number {
      position: relative;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    
    .player-name {
      min-width: 100px;
      background-color: dimgray;
      color: #fff;
      font-family: "American Typewriter", serif;
      font-size: 12px;

      text-shadow: 2px 2px 6px black;
    }
    
    span {
      display: flex;
      font-family: "Roboto Mono", monospace;
      font-size: 24px;
      min-width: 30px;
      max-width: 50px;
      padding: 10px 10px 10px 10px;
      border-radius: 5px;
      justify-content: center;
      background-color: beige;
      opacity: 1;
    }
    
    .active {
      border: 1px solid beige;
    }
    
     .active:hover {
      border: 1px solid red;
    }
    
    .check {
      opacity: 0.5;
    }
    
    .check::before {
      position: absolute;
      top: -22px;
      bottom: 0;
      left: 0;
      right: 0;
      content: "✔";
      font-size: 40px;
      color: red;
      line-height: 100px;
      text-align: center;
      z-index: -1;
    }
    @media only screen and (min-width: 850px) {
      .table-container {
        max-width: 795px;
      }
    }

    @media only screen and (min-width: 925px) {
      :host {
        display: flex;
        justify-content: center;
      }
      img {
      }
      .table-container {
        padding: 0 0 0 0;
        max-width: 900px;
      }
      .team-logo {
        position: relative;
        left: 0;
      }
    }
  `;
  constructor() {
    super();
    this.teams = [];
    this.archivedScores = {};
    this.numbers = Array.from({ length: 14 }, (v, i) => [i]);
    this.showTeam = "";
    this.seeAll = false
  }

  firstUpdated(_changedProperties) {}

  render() {
    return !this.teams.length
      ? nothing
      : html`
          <div class="table-container">
            <table>
              ${this.teams.map((team) => {
                const teamName = team.name.toLowerCase().replace(" ", "-");
                const cityName = team.city.toLowerCase().replace(" ", "-");

                return html`
                  <tr>
                    <th class="team-logo">
                      <img
                        src="https://loodibee.com/wp-content/uploads/mlb-${team.logoId ??
                        `${cityName}-${teamName}-logo`}.png"
                        alt="${team.name} Logo"
                        @click=${() => {
                          if (this.seeAll) {
                            this.showTeam = team.name;
                          }
                        }}
                      />
                    </th>
                    <td class="player-name">
                      <p>${this.players[team.name]}</p>
                    </td>
                    ${this.renderNumbers(team)}
                  </tr>
                `;
              })}
            </table>
          </div>
        `;
  }

  renderNumbers(team) {
    return this.numbers.map((number) => {
      const gameInfo = this.archivedScores[team.name][number];
      const { opponent, date } = gameInfo || {};

      // format date to Mar 31st

      const timeZoneFix = (date) => {
        const dateObj = new Date(date);
        dateObj.setMinutes(dateObj.getTimezoneOffset());
        return dateObj.toLocaleDateString("en-CA", {
          month: "short",
          day: "numeric",
        });
      };

      const formattedDate = date ? timeZoneFix(date) : "";

      const string = `On ${formattedDate}
       vs 
       ${opponent}`;

      return gameInfo
        ? html` <td class="number ${number}">
            <sl-tooltip
              content=${string}
              hoist
              .open=${this.showTeam === team.name}
            >
              <div class="check"></div>
              <span class="active">${number}</span>
            </sl-tooltip>
          </td>`
        : html` <td class="number ${number}">
            <span>${number}</span>
          </td>`;
    });
  }

  checkClass(name, num) {
    if (
      this.archivedScores[name][num] ||
      this.todaysScoresObj[name][num] === 0
    ) {
      return "check";
    }
  }
}

customElements.define("thirteen-run-table", ThirteenRunTable);
