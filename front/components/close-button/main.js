class CancelButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = `
            <button>
                <img src="assets/cancel.png" alt="cancel button">
            </button>
        `;

        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'components/close-button/style.css');

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new Event('popup-closed', { bubbles: true, composed: true }));
        });
    }
}

customElements.define('cancel-button', CancelButton);
