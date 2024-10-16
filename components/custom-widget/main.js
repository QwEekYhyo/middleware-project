class CustomWidget extends HTMLElement {
    static observedAttributes = ["height", "width"];

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const height = this.getAttribute("height") || "100px";
        const width = this.getAttribute("width") || "100px";

        const style = document.createElement("style");
        style.textContent = `
            :host {
                width: ${width};
                height: ${height};
                background-color: white;
                border-radius: 15px;
                box-shadow: 3px 3px 10px #c7c7c7, -3px -3px 10px #c7c7c7;
            }
        `;

        const slot = document.createElement("slot");

        this.shadow.appendChild(style);
        this.shadow.appendChild(slot);
    }
}

customElements.define("custom-widget", CustomWidget);

export default CustomWidget;
