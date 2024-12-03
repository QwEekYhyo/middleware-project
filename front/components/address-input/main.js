class AddressInput extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const title = document.createElement("div");
        title.innerText = this.getAttribute("address-title") || "title";

        const input = document.createElement("input");
        input.setAttribute("placeholder", "Search");

        shadow.appendChild(title);
        shadow.appendChild(input);

        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "components/address-input/style.css");

        shadow.appendChild(style);
    }
}

customElements.define("address-input", AddressInput);

export default AddressInput;
