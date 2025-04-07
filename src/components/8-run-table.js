import { html, css, LitElement, nothing } from "lit";
import { when } from "lit/directives/when.js";

export class EightRunTable extends LitElement {
  static properties = {
    teams: { type: Array },
    archivedScores: { type: Object },
    players: { type: Object },
    showTeam: { type: String },
  };
  static styles = css`
    img {
      height: 75px;
      width: 75px;
    }

    .team-grid-container {
      display: grid;
      gap: 10px;
      padding: 25px;
      justify-items: center;
      grid-template-columns: repeat(2, 1fr);
    }
    .team-container {
      width: 100px;
      padding: 20px;
      text-align: center;
      border: 2px solid;
      border-radius: 10px;
      background-color: antiquewhite;
      z-index: 5;
      position: relative;
    }
    .out {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 0, 0, 0.6);
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

    /* Small screens: 2 columns */
    @media (min-width: 600px) {
      .team-grid-container {
        grid-template-columns: repeat(2, 1fr);
        padding: 50px;
      }
    }

    /* Medium screens: 3 columns */
    @media (min-width: 768px) {
      .team-grid-container {
        grid-template-columns: repeat(3, 1fr);
        padding: 50px;
      }
    }

    /* Large screens: 5 columns */
    @media (min-width: 1024px) {
      .team-grid-container {
        grid-template-columns: repeat(5, 1fr);
        padding: 50px;
      }
    }
  `;
  constructor() {
    super();
    this.teams = [];
    this.archivedScores = {};
    this.numbers = Array.from({ length: 14 }, (v, i) => [i]);
    this.showTeam = "";
    this.seeAll = false;
  }

  render() {
    return !this.teams.length
      ? nothing
      : html`
          <div class="team-grid-container">
            ${this.teams.map((team) => {
              const teamName = team.name.toLowerCase().replace(" ", "-");
              const cityName = team.city.toLowerCase().replace(" ", "-");
              const isOut = this.isTeamOut(team);

              return html`
                <div class="team-container">
                  ${when(
                    isOut,
                    () =>
                      html`<sl-tooltip
                        content=${this.createTooltipContent(isOut)}
                        hoist
                        .open=${this.showTeam === team.name}
                        placement="bottom"
                        distance="-30"
                      >
                        <div class="out"></div>
                      </sl-tooltip>`,
                  )}
                  <div class="team-logo">
                    <img
                      src="https://loodibee.com/wp-content/uploads/mlb-${team.logoId ??
                      `${cityName}-${teamName}-logo`}.png"
                      alt=${team.name}
                      @click=${() => {
                        this.showTeam = team.name;
                      }}
                    />
                  </div>
                  <div class="team-name"><p>${this.players[team.name]}</p></div>
                </div>
              `;
            })}
          </div>
        `;
  }

  isTeamOut({ name }) {
    return this.archivedScores[name]?.["8"];
  }

  createTooltipContent({ opponent, date }) {
    const timeZoneFix = (date) => {
      const dateObj = new Date(date);
      dateObj.setMinutes(dateObj.getTimezoneOffset());
      return dateObj.toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
      });
    };

    const formattedDate = date ? timeZoneFix(date) : "";

    return `On ${formattedDate}
       vs
       ${opponent}`;
  }
}

customElements.define("eight-run-table", EightRunTable);
