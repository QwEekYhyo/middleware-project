class BothInputs extends HTMLElement {
    constructor() {
        super();
        this.originInput = null;
        this.destinationInput = null;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "components/both-inputs/style.css");
        shadow.appendChild(style);

        const container = document.createElement("div");
        container.setAttribute("id", "container");
        shadow.appendChild(container);

        let widget = BothInputs.createWidget();
        container.appendChild(widget);
        this.originInput = BothInputs.createInput("Départ");
        widget.appendChild(this.originInput);

        widget = BothInputs.createWidget();
        container.appendChild(widget);
        this.originInput = BothInputs.createInput("Arrivée");
        widget.appendChild(this.originInput);
    }

    static createWidget() {
        const widget = document.createElement("custom-widget");
        widget.setAttribute("height", "80px");
        widget.setAttribute("width", "100%");
        return widget;
    }

    static createInput(title) {
        const input = document.createElement("address-input");
        input.setAttribute("address-title", title);
        return input;
    }
}

customElements.define("both-inputs", BothInputs);

export default BothInputs;
