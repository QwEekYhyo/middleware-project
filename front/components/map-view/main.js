class MapView extends HTMLElement {
    constructor() {
        super();
        this.map = null;
        this.routeLayer = null;
    }

    connectedCallback() {
        this.style.position = 'absolute';
        this.style.width = '100vw';
        this.style.height = '100vh';
        this.style.zIndex = '-1';
        this.render();
        this.initializeMap();
    }

    render() {
        const mapDiv = document.createElement('div');
        mapDiv.id = 'map';
        mapDiv.style.height = '100vh';
        this.appendChild(mapDiv);
    }

    initializeMap() {
        this.map = L.map('map').setView([51.505, -0.09], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
        this.map.zoomControl.remove();

        var marker = L.marker([51.5, -0.09]).addTo(this.map);
        var marker2 = L.marker([51.0, -0.09]).addTo(this.map);

        marker.bindPopup("<b>Vous etes ici</b>").openPopup();

        function onMapClick(e) {
            console.log("You clicked the map at " + e.latlng);
            marker2.setLatLng(e.latlng);
        }
        this.map.on('click', onMapClick);
    }

    displayItinerary(geometry, options = { color: 'blue', weight: 4 }) {
        if (!this.map) {
            console.error("Map is not initialized.");
            return;
        }

        const coordinates = polyline.decode(geometry);
        const latLngs = coordinates.map(coord => [coord[0], coord[1]]);

        if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
        }

        this.routeLayer = L.polyline(latLngs, options).addTo(this.map);

        this.map.fitBounds(this.routeLayer.getBounds());
    }
}

customElements.define("map-view", MapView);
