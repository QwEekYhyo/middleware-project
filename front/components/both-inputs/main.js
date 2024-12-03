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
        this.destinationInput = BothInputs.createInput("Arrivée");
        widget.appendChild(this.destinationInput);

        this.originInput.addEventListener("keyup", this.onKeyUp.bind(this));
        this.destinationInput.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    static createWidget() {
        const widget = document.createElement("custom-widget");
        widget.setAttribute("height", "80px");
        widget.setAttribute("width", "100%");
        return widget;
    }

    onKeyUp(event) {
        console.log("hello");
        if (event.key === "Enter") {
            const origin = this.originInput.getInputText();
            const dest = this.destinationInput.getInputText();
            if (origin === "" || dest === "")
                return;
        
            fetch(
                `http://localhost:8000/api/itineraries?origin=${origin.replace(/ /g, "+")}&destination=${dest.replace(/ /g, "+")}`
            ).then(async response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.log(errorData);
                        console.error(`HTTP error! Status: ${response.status}, Message: ${errorData.error || 'Unknown error'}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                const mapView = document.querySelector('map-view');
                mapView.displayItinerary(data["geometry"]);

                mapView.placeMarkers(
                    data["origin"],
                    data["destination"],
                    data["origin_station"],
                    data["destination_station"]
                );
                this.originInput.clearInput();
                this.destinationInput.clearInput();
            });
        }
    }

    static createInput(title) {
        const input = document.createElement("address-input");
        input.setAttribute("address-title", title);
        return input;
    }
}

customElements.define("both-inputs", BothInputs);

export default BothInputs;
