class PopUpContent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                #pop-up-content {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;
                }

                #pop-up-content > * {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
            <div id="pop-up-content">
                <timer-component></timer-component>
                <p>Message</p>
                <cancel-button></cancel-button>
            </div>
        `;
    }
}

customElements.define('pop-up-content', PopUpContent);