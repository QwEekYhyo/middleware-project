class InstructionContainer extends HTMLElement {
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
                .container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .child-1 {
                    flex: 1;
                }
                .child-2 {
                    flex: 2;
                }
                .child-3 {
                    flex: 2;
                }
            </style>
            <div class="container">
                <div class="child-1">Mute</div>
                <div class="child-2">Instructions</div>
                <div class="child-3">Arrivée</div>
            </div>
        `;
    }
}

customElements.define('instruction-container', InstructionContainer);