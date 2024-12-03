class AddressInput extends HTMLElement {
    constructor() {
        super();
        this.input = null;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const title = document.createElement("div");
        title.innerText = this.getAttribute("address-title") || "title";

        this.input = document.createElement("input");
        this.input.setAttribute("placeholder", this.getAttribute("input-placeholder") || "Search");

        shadow.appendChild(title);
        shadow.appendChild(this.input);

        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "components/address-input/style.css");

        shadow.appendChild(style);
    }

    getInputText() {
        return this.input.value;
    }

    clearInput() {
        this.input.value = "";
    }
}

customElements.define("address-input", AddressInput);

export default AddressInput;
