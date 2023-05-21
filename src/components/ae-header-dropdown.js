/**
 * AeHeaderDropdown
 */
import {
  LitElement,
  html,
  css,
  nothing,
  classMap,
  unsafeHTML,
  sortObjects,
} from 'omni-ui';



export class AeHeaderDropdown extends LitElement {
  static properties = {
    // declare properties
    isShow: { type: Boolean },
    isOpen: { type: Boolean, attribute: 'is-open', reflect: true },
    hasError: { type: Boolean, attribute: 'is-danger', reflect: true },

    options: { type: Array },
    selected: { type: Object },
    labelText: { type: String },
    placeholder: { type: Object },
    infoText: { type: Object },
    dropdownContentType: { type: String },
    dropdownState: { type: String },
    otherSelectedOptions: { type: Array },

    showOptionTooltip: { type: Boolean },
    showSearchBar: { type: Boolean },
    showSelectionReset: { type: Boolean },
    searchText: { type: String },
    disabled: { type: Boolean, reflect: true },
    isLoading: { type: Boolean },
    transparent: { type: Boolean, reflect: true },
    dropdownWidth: { type: String },
  };

  static styles = [
    super.styles,
    css`
      :host {
        --color-el-bg: #f2f5fa;
      }

      /* declare styles */
      .button {
        border: 0;
      }

      .dropdown-container {
        display: flex;
        align-items: center;
      }

      .omni .dropdown {
        display: flex;
      }

      .omni .dropdown-wrapper {
        display: inline-flex;
        flex-direction: column;
      }

      /* Base dropdown styling */
      .omni .dropdown-menu {
        width: 100%;
        max-width: 301px;
        text-align: left;
      }

      .omni .dropdown .dropdown-content {
        padding: 0;
        border-radius: var(--radius);
      }

      .omni .dropdown .dropdown-content .dropdown-list {
        overflow-y: auto; /*fallback for non-supporting browser*/
        overflow-y: overlay;
        max-height: 225px;
      }
      .omni .dropdown .dropdown-content .dropdown-search + .dropdown-list {
        max-height: calc(225px - 42px);
      }

      .omni .dropdown .dropdown-content .dropdown-list::-webkit-scrollbar {
        width: 10px;
      }

      .omni .dropdown .dropdown-content .dropdown-list::-webkit-scrollbar-track {
        border: solid 3px transparent;
        box-shadow: inset 0 0 10px 10px transparent;
      }

      .omni .dropdown .dropdown-content .dropdown-list::-webkit-scrollbar-thumb {
        border-radius: 1rem;
        background-color: transparent;

        border: solid 3px transparent;
        box-shadow: inset 0 0 10px 10px rgba(162, 169, 173, 0.5);
      }

      .omni .dropdown .dropdown-content .dropdown-option {
        display: flex;
        align-items: center;

        height: 2.25rem;
        cursor: pointer;
        position: relative;
        padding: 0.2rem 1.25rem 0.2rem 2rem;
      }

      .omni .dropdown .dropdown-content .dropdown-option:hover {
        background-color: var(--color-pale-grey-two);
      }

      .omni .dropdown .dropdown-content .dropdown-option-disable {
        opacity: 25%;
        cursor: default;
      }

      .omni .dropdown .dropdown-content .dropdown-option-disable omni-icon {
        fill: #a2a9ad;
      }

      .omni .dropdown .dropdown-content .dropdown-option .dropdown-check-icon {
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
      }

      .omni .dropdown-option-icon {
        margin-right: 0.5rem;
      }

      .omni .dropdown-check-icon-active {
        fill: var(--color-electric-blue);
      }

      .omni .dropdown-check-icon-disable {
        fill: transparent;
      }

      .omni .dropdown-title {
        display: flex;
        align-items: center;
        font-weight: normal;
        text-transform: none;
      }

      .omni .dropdown-placeholder {
        color: var(--color-shark);
        fill: var(--color-shark) !important;
      }

      .omni .is-loading .dropdown-placeholder {
        color: transparent;
      }

      .omni .dropdown__button {
        flex: 1;
        justify-content: space-between !important;

        height: 2.25rem;
        padding: 0 1.25rem !important;
      }

      .omni .dropdown__button.has-reset {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding: 0 0.8rem 0 1.25rem !important;
      }

      .omni .dropdown__button:hover,
      .omni .dropdown.is-active .dropdown__button,
      .omni .dropdown.is-active .dropdown-trigger:hover {
        border-color: transparent;
        background: var(--color-el-bg) !important;
      }

      .omni .dropdown.is-active .dropdown__button,
      .omni .dropdown.is-active .dropdown__button:hover {
        background-color: white !important;
      }

      .omni .dropdown__button:before {
        box-shadow: none !important;
      }

      .omni .dropdown .selection-reset {
        height: 100%;
        padding-right: 0.5rem;

        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;
        background-color: var(--color-el-bg);
        border-radius: 0 var(--radius) var(--radius) 0;
      }

      .omni .dropdown:not(.is-active) .dropdown-trigger:hover .selection-reset {
        border-color: transparent;
        background: var(--color-el-bg);
      }

      .omni .dropdown.is-active .selection-reset {
        background-color: white !important;
      }

      :host([transparent]) .button {
        border: none;
        background-color: transparent;
      }

      :host([transparent]) .omni .dropdown .selection-reset,
      :host([transparent]) .omni .dropdown .selection-reset:hover {
        background-color: transparent;
      }

      .omni .dropdown-trigger {
        flex: 1;
        display: flex;
        align-items: center;
        border-radius: var(--radius);
      }

      .omni .dropdown-label {
        padding-bottom: 0.25rem;
        text-transform: capitalize;
        box-shadow: none !important;

        font-weight: normal;
        color: rgb(59, 62, 63);
        letter-spacing: 0.014em;
        margin-right: 1rem;
      }

      .omni .dropdown-group-header {
        overflow-x: hidden;
        padding: 0.332rem 1rem;

        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .omni .dropdown-group-header omni-tooltip span {
        opacity: 0.4;
      }

      .omni .dropdown-group-header omni-tooltip {
        width: 100%;
      }

      .omni .dropdown-option-text {
        width: 100%;
        overflow: hidden;
      }

      .omni .is-truncated-text {
        opacity: 0.9;
        display: block;
        overflow: hidden;
        line-height: 1.5;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .omni .option-highlighted-text {
        font-weight: bold;
      }

      .omni .dropdown-option-text omni-tooltip {
        width: 100%;
      }

      .omni omni-tooltip.overflown::part(tooltip) {
        display: none;
      }

      .omni .dropdown-content .dropdown-search {
        top: 0px;
        z-index: 1;
        position: sticky;
        position: -webkit-sticky;

        display: grid;
        align-items: center;
        grid-template-columns: 15% 70% 15%;

        height: 100%;
        background: white;
        padding: 10px 0 10px;
        border-bottom: 1px solid #edf0f4;
      }
      .omni .dropdown-content .dropdown-search input::placeholder {
        color: var(--color-shark);
      }

      .omni .dropdown-content .dropdown-search omni-icon {
        justify-self: center;
      }

      .omni .dropdown-content .dropdown-search omni-icon.search {
        fill: var(--color-shark);
      }

      .omni .dropdown-content .dropdown-search input {
        border: 0;
        font-size: 0.85rem;
        background-color: transparent;
      }

      .omni .dropdown-content .dropdown-search input:focus {
        outline: none;
        box-shadow: none !important;
      }

      .omni .dropdown-content .dropdown-search .search-close-icon {
        cursor: pointer;
      }

      .omni .dropdown__button-disable {
        opacity: 0.5;
        pointer-events: none;
        background-color: var(--color-el-bg);
        border: 1px solid #edf0f5;
      }

      .omni .dropdown-state-message {
        width: 100%;
        padding: 20px;

        text-align: center;
        white-space: normal;
        display: inline-block;
      }

      .omni .dropdown--is-active {
        border-radius: var(--radius);
        background-color: var(--placeholder);
        box-shadow: 0 0 0 1px var(--color-electric-blue);
      }

      .omni .is-danger .dropdown {
        border-radius: var(--radius);
        border: thin solid transparent;
        box-shadow: 0 0 0 1px var(--color-melon);
      }

      .omni .dropdown-info-text {
        display: flex;
        align-items: center;
        align-self: flex-end;

        margin: 0.5rem 0;
        padding-right: 0.25rem;

        text-align: right;
        font-size: 0.75rem;
      }

      .omni .dropdown-info-text.is-danger {
        align-self: flex-start;
      }

      .omni .dropdown-info-text.is-danger omni-icon {
        margin-left: 1rem;
        margin-right: 0.5rem;

        font-size: 1.2rem;
        fill: var(--color-melon);
      }
    `,
  ];

  constructor() {
    super();
    this.isShow = true;
    this.isOpen = false;
    this.options = [];
    this.selected = {
      value: '',
      text: '',
    };
    this.labelText = '';
    this.placeholder = {
      value: '',
      static: false,
    };
    this.dropdownContentType = 'single';
    this.dropdownWidth = '';

    // active state will have the first option selected
    // default state won't have any option selected
    this.dropdownState = 'active';

    // display other selected options
    this.otherSelectedOptions = [];
    this.showOptionTooltip = false;
    this.showSelectionReset = false;

    // Search properties
    this.emptySearchMessage = 'No match found for your search.';
    this.showSearchBar = false;
    this.searchText = '';
    this.searchedOptions = [];

    this.disabled = false;
    this.isLoading = false;
    this.transparent = false;
    this.closeMenu = this.closeMenu.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this.closeMenu);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this.closeMenu);
    super.disconnectedCallback();
  }

  toggleMenu(open = !this.isOpen) {
    this.isOpen = open;
    this._clearSearch();
  }

  closeMenu() {
    this.toggleMenu(false);
  }

  _singleContentType(options = undefined, groupHeader) {
    let currentOptions = options || this.options;

    if (!options && this.searchText) {
      currentOptions = this.searchedOptions;
    }

    return currentOptions.map((option, index) => {
      const dropdownOptionId = `${option.value}-${index}`;

      return html`
        <!-- Set an option as selected & disable it if any pre-selected data has been provided -->
        <div
          class="dropdown-option
            ${this.otherSelectedOptions.length > 0 &&
          this.otherSelectedOptions.includes(option.value) &&
          this.selected.value !== option.value
            ? 'dropdown-option-disable'
            : ''}"
          @click="${() => {
            if (
              this.otherSelectedOptions.length > 0 &&
              this.otherSelectedOptions.includes(option.value)
            )
              return;
            this._handleItemClick(option, groupHeader);
          }}"
          @keydown="${() => {
            if (
              this.otherSelectedOptions.length > 0 &&
              this.otherSelectedOptions.includes(option.value)
            )
              return;
            this._handleItemClick(option, groupHeader);
          }}"
        >
          <!-- Switch check icon on or off based on pre-selection data -->
          <omni-icon
            class="is-size-3 dropdown-check-icon ${(this.selected &&
              this.selected.value === option.value) ||
            (this.otherSelectedOptions.length > 0 &&
              this.otherSelectedOptions.includes(option.value)) ||
            (!this.selected?.value && index === 0 && this.dropdownState === 'default')
              ? 'dropdown-check-icon-active'
              : 'dropdown-check-icon-disable'}"
            icon-id="omni:informative:check"
          ></omni-icon>
          <div
            @mouseover="${(e) => this._dropdownTextHover(e, dropdownOptionId)}"
            @focus="${(e) => this._dropdownTextHover(e, dropdownOptionId)}"
            class="dropdown-option-text"
            id="id-${dropdownOptionId}"
          >
            <omni-tooltip>
              <span slot="invoker" class="is-truncated-text" id="id-${dropdownOptionId}-text"
                >${this.searchText && option.searchedText
                  ? unsafeHTML(option.searchedText)
                  : option.text}</span
              >
              <div slot="content">${option.text}</div>
            </omni-tooltip>
          </div>
        </div>
      `;
    });
  }

  _groupedContentType() {
    let currentOptions = this.options;

    if (this.searchText) {
      currentOptions = this.searchedOptions;
    }

    return currentOptions.map(
      (option, index) => html`
        <ul>
          <li
            id="id-${index}"
            class="dropdown-group-header"
            @mouseover="${(e) => this._dropdownTextHover(e, index)}"
            @focus="${(e) => this._dropdownTextHover(e, index)}"
          >
            <omni-tooltip>
              <span slot="invoker" id="id-${index}-text" class="is-truncated-text">
                ${this.searchText && this.searchedGroupHeader
                  ? unsafeHTML(option.searchedGroupHeader)
                  : option.groupHeader}
              </span>
              <div slot="content">${option.groupHeader}</div>
            </omni-tooltip>
          </li>
          ${this._singleContentType(sortObjects(option.groupItems, 'text'), option.groupHeader)}
        </ul>
      `
    );
  }

  render() {
    /* eslint-disable lit-a11y/click-events-have-key-events */
    return html`
      ${this.isShow
        ? html`
            <omni-style>
              <div class="dropdown-wrapper">
                <div class="dropdown-container ${this.hasError ? 'is-danger' : ''}">
                  ${this.labelText
                    ? html` <span class="is-size-5 dropdown-label">${this.labelText}</span>`
                    : null}

                  <div
                    id="dropdown"
                    part="dropdown"
                    class="dropdown ${!this.isOpen
                      ? 'dropdown--is-default'
                      : 'dropdown--is-active'} ${this.isOpen ? 'is-active' : ''}"
                  >
                    <div class="dropdown-trigger" part="dropdown-trigger">
                      <div
                        part="dropdown-button"
                        .disabled=${this.disabled}
                        class=${classMap({
                          button: true,
                          dropdown__button: true,
                          'is-loading': this.isLoading,
                          transparent: this.transparent,
                          'has-reset': this.showSelectionReset,
                          'dropdown__button-disable': this.options.length < 1,
                        })}
                        @click="${this._handleDropdownClick}"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                      >
                        ${this.placeholder.static
                          ? html` ${this.placeholder?.icon
                                ? html`<omni-icon
                                    part="placeholder-icon"
                                    class="is-size-3"
                                    icon-id=${this.placeholder.icon}
                                  ></omni-icon>`
                                : ''}
                              <span class="dropdown-title is-size-5" part="dropdown-title">
                                ${this.placeholder.value}
                              </span>`
                          : html`<span class="dropdown-title is-size-5" part="dropdown-title"
                              >${this.placeholder.value && (!this.selected || !this.selected.text)
                                ? html`${this.placeholder?.icon
                                      ? html`<omni-icon
                                          part="placeholder-icon"
                                          class="dropdown-placeholder is-size-3"
                                          icon-id=${this.placeholder.icon}
                                        ></omni-icon>`
                                      : ''}

                                    <span class="dropdown-placeholder">
                                      ${this.placeholder.value}
                                    </span>`
                                : html`${this.selected
                                    ? html`${this.selected.text.length < this.dropdownWidth
                                        ? html`<span>${this.selected.text}</span>`
                                        : html`<omni-tooltip>
                                            <span
                                              slot="invoker"
                                              class="is-truncated-text"
                                              part="dropdown-title-text"
                                            >
                                              ${this.selected.text}
                                            </span>
                                            <div slot="content">${this.selected.text}</div>
                                          </omni-tooltip> `}`
                                    : ''} `}
                            </span>`}
                        ${this.isOpen
                          ? html`<omni-icon
                              class="is-size-3"
                              icon-id="omni:interactive:up"
                            ></omni-icon>`
                          : html`<omni-icon
                              class="is-size-3"
                              icon-id="omni:interactive:down"
                            ></omni-icon>`}
                      </div>

                      <!-- Selection reset button -->
                      ${this.showSelectionReset
                        ? html`<span class="selection-reset" @click=${this._handleSelectionReset}>
                            <omni-icon
                              class="is-size-3 cursor-pointer"
                              icon-id="omni:interactive:remove"
                            ></omni-icon>
                          </span>`
                        : ''}
                    </div>
                    <div class="dropdown-menu" part="dropdown-menu" id="dropdown-menu" role="menu">
                      <div class="dropdown-content is-size-5" part="dropdown-content">
                        ${this.showSearchBar
                          ? html`
                              <!-- Search -->
                              <div
                                class="dropdown-search"
                                @click=${(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <omni-icon
                                  class="is-size-4 search"
                                  icon-id="omni:interactive:search"
                                ></omni-icon>
                                <input
                                  type="text"
                                  id="search"
                                  name="search"
                                  placeholder="Search"
                                  @keyup="${this._handleSearchChange}"
                                />
                                <omni-icon
                                  class="is-size-3 search-close-icon"
                                  icon-id="omni:interactive:close"
                                  @click="${this._clearSearch}"
                                ></omni-icon>
                              </div>
                            `
                          : nothing}
                        ${this.dropdownContentType === 'single'
                          ? html`<div class="dropdown-list">${this._singleContentType()}</div>`
                          : html`<div class="dropdown-list">${this._groupedContentType()}</div>`}
                        ${this.searchedOptions.length < 1 && this.searchText
                          ? html`
                              <span class="dropdown-state-message">${this.emptySearchMessage}</span>
                            `
                          : nothing}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Info text for help -->
                ${this.infoText?.help
                  ? html`<p class="dropdown-info-text">${this.infoText.help}</p>`
                  : ''}

                <!-- Info text for error -->
                ${this.hasError && this.infoText?.error
                  ? html`<p class="dropdown-info-text is-danger">
                      <omni-icon
                        part="icon"
                        icon-id=${this.infoText?.errorIcon
                          ? this.infoText.errorIcon
                          : 'icon:informative:error'}
                      ></omni-icon>
                      ${this.infoText.error}
                    </p>`
                  : ''}
              </div>
            </omni-style>
          `
        : html``}
    `;
  }

  _handleDropdownClick() {
    const { isOpen } = this;
    // before toggling menu, let click propagate so all menus close first
    setTimeout(() => this.toggleMenu(!isOpen));
  }

  _handleItemClick(selected, groupHeader) {
    this.isOpen = false;
    this.selected = selected;

    this.dispatchNewEvent('dropdownItemClick', {
      detail: {
        selected,
        groupHeader,
      },
    });

    // clear search bar
    this._clearSearch();
  }

  _handleSelectionReset() {
    this.dispatchNewEvent('removeSelectedItemClick', {
      detail: {
        selected: this.selected,
      },
    });
  }

  _dropdownTextHover(e, optionVal) {
    e.preventDefault();

    const invokerEl = this.shadowRoot.querySelector(`#id-${optionVal}-text`);
    const omniTooltipEl = this.shadowRoot.querySelector(`#id-${optionVal} > omni-tooltip`);

    if (!invokerEl || invokerEl.scrollWidth > invokerEl.clientWidth) return;

    omniTooltipEl.classList.add('overflown');
  }

  _handleSearchChange() {
    const searchText = this.shadowRoot.querySelector('#search').value;

    this.searchText = searchText;

    this.searchedOptions = this._returnSearchedOptions(this.options, searchText);

    // update component on search change
    this.requestUpdate();
  }

  // eslint-disable-next-line class-methods-use-this
  _applyHighlightText(fullText, searchText) {
    let safeSearchText = searchText.replace(
      /[\\-\\[\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]/g,
      '\\$&'
    );
    safeSearchText = safeSearchText.replace(new RegExp('<', 'g'), '&lt;');
    safeSearchText = safeSearchText.replace(new RegExp('>', 'g'), '&gt;');

    return fullText.replace(
      new RegExp(safeSearchText, 'gi'),
      '<span class="option-highlighted-text">$&</span>'
    );
  }

  _returnSearchedOptions(options, searchText) {
    let searchedOptions = [];

    if (this.dropdownContentType === 'single') {
      searchedOptions = options
        .filter((item) => item.text.match(new RegExp(`${searchText}`, 'gi')))
        .map((filtedItem) => ({
          ...filtedItem,
          searchedText: this._applyHighlightText(filtedItem.text, searchText),
        }));
    } else {
      for (const option of options) {
        const matchedGroupItems = option.groupItems
          .filter((item) => item.text.match(new RegExp(`${searchText}`, 'gi')))
          .map((filtedItem) => ({
            ...filtedItem,
            searchedText: this._applyHighlightText(filtedItem.text, searchText),
          }));

        const matchedGroupHeader = option.groupHeader.match(new RegExp(`${searchText}`, 'gi'));

        // check if there is either a groupHeader match or groupItems match
        if (
          matchedGroupHeader ||
          (matchedGroupHeader && matchedGroupItems.length >= 1) ||
          matchedGroupItems.length >= 1
        ) {
          searchedOptions = [
            ...searchedOptions,
            {
              searchedGroupHeader: matchedGroupHeader
                ? this._applyHighlightText(option.groupHeader, searchText)
                : undefined,
              groupHeader: option.groupHeader,
              groupItems:
                matchedGroupItems.length < 1 && matchedGroupHeader
                  ? option.groupItems
                  : matchedGroupItems,
            },
          ];
        }
      }
    }

    return searchedOptions;
  }

  /**
   * Clear search bar and reset dropdown
   */
  _clearSearch() {
    if (!this.showSearchBar) return;

    this.shadowRoot.querySelector('#search').value = '';
    this.searchText = '';
    this.requestUpdate();
  }
}

customElements.define('ae-dropdown', AeHeaderDropdown);
