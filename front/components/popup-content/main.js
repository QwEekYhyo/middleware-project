class PopUpContent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render(message = "Bienvenue sur Maps à la Fouassier !") {
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
                <p>${message}</p>
                <cancel-button></cancel-button>
            </div>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector('timer-component').addEventListener('timer-ended', () => {
            this.closePopUp();
        });

        this.shadowRoot.querySelector('cancel-button').addEventListener('popup-closed', () => {
            this.closePopUp();
        });
    }

    closePopUp() {
        this.dispatchEvent(new Event('popup-closed', { bubbles: true, composed: true }));
    }

    updateMessage(newMessage) {
        const messageElement = this.shadowRoot.querySelector('p');
        if (messageElement) {
            messageElement.textContent = newMessage;
        }
    }
}

customElements.define('pop-up-content', PopUpContent);
