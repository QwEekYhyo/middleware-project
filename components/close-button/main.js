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
            if (this.parentElement) {
                this.parentElement.parentElement.style.display = 'none';
            }
        });
    }
}

customElements.define('cancel-button', CancelButton);